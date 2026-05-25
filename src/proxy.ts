import { NextResponse, type NextRequest } from "next/server";

/**
 * Defensive edge proxy (formerly "middleware").
 *
 * Detects common attack patterns and escalates against repeat offenders:
 *   1st strike  →  60-second rate-limit / soft block (HTTP 429)
 *   2nd strike  →  1-hour block (HTTP 403)
 *   3rd+ strike →  24-hour block (HTTP 403)
 *
 * In-memory state is fine for single-process dev. For production, replace
 * the offenders/requestLog Maps with Upstash Redis or Vercel KV — Edge
 * functions are stateless and your blocks won't survive a region switch.
 *
 * Defensive only. Never performs outbound requests against the attacker.
 */

// Patterns are compiled via RegExp() at module load — avoids regex-literal
// parsing edge cases in the Turbopack edge bundler.
const ATTACK_PATTERNS: { name: string; re: RegExp }[] = [
  // SQL injection probes
  { name: "sqli-union", re: new RegExp("\\bunion\\b\\s+\\bselect\\b", "i") },
  { name: "sqli-or-1", re: new RegExp("\\bor\\b\\s+1\\s*=\\s*1", "i") },
  { name: "sqli-sleep", re: new RegExp("\\b(sleep|benchmark|pg_sleep|waitfor)\\s*\\(", "i") },
  { name: "sqli-comment", re: new RegExp("(--|/\\*|;\\s*drop\\s+table)", "i") },

  // XSS probes
  { name: "xss-script-tag", re: new RegExp("<\\s*script\\b", "i") },
  { name: "xss-event-handler", re: new RegExp("\\bon(error|load|click|mouseover)\\s*=", "i") },
  { name: "xss-javascript-uri", re: new RegExp("javascript\\s*:", "i") },
  { name: "xss-svg-onload", re: new RegExp("<\\s*svg[^>]*\\bonload\\b", "i") },

  // Path traversal
  { name: "path-traversal", re: new RegExp("(\\.\\./|\\.\\.\\\\|%2e%2e%2f|%2e%2e/)", "i") },

  // Command injection
  { name: "cmd-inject", re: new RegExp("(\\$\\(|;\\s*(cat|ls|wget|curl|nc|bash|sh)\\s)", "i") },

  // Local / Remote file inclusion
  { name: "lfi-etc", re: new RegExp("/etc/(passwd|shadow|hosts)", "i") },
  { name: "rfi-http", re: new RegExp("=https?://", "i") },

  // Config / secret probes
  { name: "config-probe", re: new RegExp("/(\\.env|\\.git/|\\.aws/|wp-config\\.php|web\\.config|phpinfo\\.php)", "i") },

  // Server-side template injection
  { name: "ssti", re: new RegExp("\\{\\{\\s*[a-z_]+\\s*\\}\\}|\\$\\{[a-z_]+\\}", "i") },
];

// Scanner / pentest tool User-Agents (real crawlers excluded)
const BAD_UA: string[] = [
  "sqlmap", "nikto", "acunetix", "nessus", "nmap", "masscan",
  "wpscan", "zgrab", "dirb", "gobuster", "ffuf", "metasploit",
];

const STRIKE_BLOCKS_MS = [
  60 * 1000,           // strike 1: 60 seconds
  60 * 60 * 1000,      // strike 2: 1 hour
  24 * 60 * 60 * 1000, // strike 3+: 24 hours
];

type OffenderRecord = {
  strikes: number;
  blockUntil: number;
  lastReason: string;
  firstSeen: number;
};

const offenders = new Map<string, OffenderRecord>();
const requestLog = new Map<string, number[]>();
const FLOOD_WINDOW_MS = 60 * 1000;
const FLOOD_THRESHOLD = 120;

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function safeDecode(s: string): string {
  try {
    // Decode twice — many evasion attempts use double-encoding (%252F → %2F → /)
    return decodeURIComponent(decodeURIComponent(s));
  } catch {
    try { return decodeURIComponent(s); } catch { return s; }
  }
}

function detectAttack(req: NextRequest): { name: string; where: string } | null {
  const url = req.nextUrl;
  const raw = url.pathname + url.search;
  const decoded = safeDecode(raw);
  // Normalize `+` to space (URL query convention) so patterns with \s+ match
  const haystack = (raw + " " + decoded + " " + decoded.replace(/\+/g, " ")).toLowerCase();

  for (const { name, re } of ATTACK_PATTERNS) {
    if (re.test(haystack)) return { name, where: "url" };
  }

  for (const [key, val] of req.headers.entries()) {
    if (val.indexOf("\r") !== -1 || val.indexOf("\n") !== -1) {
      return { name: "header-crlf", where: "header:" + key };
    }
  }

  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  for (const sig of BAD_UA) {
    if (ua.indexOf(sig) !== -1) return { name: "bad-ua-" + sig, where: "user-agent" };
  }

  return null;
}

function recordFlood(ip: string, now: number): boolean {
  const log = requestLog.get(ip) || [];
  const recent: number[] = [];
  for (const t of log) {
    if (now - t < FLOOD_WINDOW_MS) recent.push(t);
  }
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > FLOOD_THRESHOLD;
}

function recordStrike(ip: string, reason: string, now: number): OffenderRecord {
  const prev = offenders.get(ip);
  const strikes = (prev?.strikes ?? 0) + 1;
  const blockMs = STRIKE_BLOCKS_MS[Math.min(strikes - 1, STRIKE_BLOCKS_MS.length - 1)];
  const rec: OffenderRecord = {
    strikes,
    blockUntil: now + blockMs,
    lastReason: reason,
    firstSeen: prev?.firstSeen ?? now,
  };
  offenders.set(ip, rec);
  return rec;
}

function logEvent(payload: Record<string, unknown>) {
  console.warn(JSON.stringify({ event: "wafx", ts: new Date().toISOString(), ...payload }));
}

function deny(status: number, reason: string, retryMs?: number) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-WAF": "a1tech-edge",
    "Cache-Control": "no-store",
  });
  if (retryMs) headers.set("Retry-After", String(Math.ceil(retryMs / 1000)));
  return new NextResponse(
    JSON.stringify({ error: "Request blocked", reason }),
    { status, headers },
  );
}

function isAssetPath(path: string): boolean {
  if (path.indexOf("/_next/") === 0) return true;
  const dot = path.lastIndexOf(".");
  if (dot === -1) return false;
  const ext = path.substring(dot).toLowerCase();
  return ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp"
    || ext === ".svg" || ext === ".ico" || ext === ".css" || ext === ".js"
    || ext === ".woff" || ext === ".woff2";
}

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (isAssetPath(path)) return NextResponse.next();

  const ip = clientIp(req);
  const now = Date.now();

  // 1) Already blocked?
  const offender = offenders.get(ip);
  if (offender && offender.blockUntil > now) {
    const retry = offender.blockUntil - now;
    logEvent({ action: "block", ip, strikes: offender.strikes, reason: offender.lastReason, path });
    return deny(offender.strikes === 1 ? 429 : 403, offender.lastReason, retry);
  }

  // 2) Attack pattern detection
  const attack = detectAttack(req);
  if (attack) {
    const rec = recordStrike(ip, attack.name, now);
    logEvent({
      action: "strike",
      ip,
      strikes: rec.strikes,
      attack: attack.name,
      where: attack.where,
      path,
      blockUntilMs: rec.blockUntil - now,
    });
    return deny(rec.strikes === 1 ? 429 : 403, attack.name, rec.blockUntil - now);
  }

  // 3) Flood detection
  if (recordFlood(ip, now)) {
    const rec = recordStrike(ip, "request-flood", now);
    logEvent({ action: "strike", ip, strikes: rec.strikes, attack: "flood", path });
    return deny(429, "request-flood", rec.blockUntil - now);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
