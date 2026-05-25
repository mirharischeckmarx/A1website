/**
 * Input-validation helpers — central place for sanitizing user-supplied data
 * before it reaches a database, log line, outbound API, or HTML render.
 *
 * Philosophy:
 *   - Whitelist what's allowed; reject everything else.
 *   - Return parsed/safe values, never raw input.
 *   - Throw on invalid input; never silently coerce.
 *
 * Use these on any server action, route handler, or form submission you add.
 */

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(`[${field}] ${message}`);
    this.name = "ValidationError";
  }
}

// ── Generic length & charset checks ──

export function isString(v: unknown): v is string {
  return typeof v === "string";
}

export function requireString(
  field: string,
  v: unknown,
  opts: { min?: number; max?: number } = {},
): string {
  if (!isString(v)) throw new ValidationError(field, "must be a string");
  const trimmed = v.trim();
  const { min = 1, max = 10_000 } = opts;
  if (trimmed.length < min) throw new ValidationError(field, `must be at least ${min} chars`);
  if (trimmed.length > max) throw new ValidationError(field, `must be at most ${max} chars`);
  return trimmed;
}

export function optionalString(
  field: string,
  v: unknown,
  opts: { max?: number } = {},
): string | undefined {
  if (v == null || v === "") return undefined;
  return requireString(field, v, { min: 0, ...opts });
}

// ── Common formats ──

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export function requireEmail(field: string, v: unknown): string {
  const s = requireString(field, v, { max: 254 });
  if (!EMAIL_RE.test(s)) throw new ValidationError(field, "invalid email format");
  return s.toLowerCase();
}

const PHONE_RE = /^[+0-9 ()-]{7,20}$/;
export function optionalPhone(field: string, v: unknown): string | undefined {
  const s = optionalString(field, v, { max: 20 });
  if (s == null) return undefined;
  if (!PHONE_RE.test(s)) throw new ValidationError(field, "invalid phone format");
  return s;
}

const URL_RE = /^https?:\/\/[^\s<>"]{4,2048}$/i;
export function requireHttpUrl(field: string, v: unknown): string {
  const s = requireString(field, v, { max: 2048 });
  if (!URL_RE.test(s)) throw new ValidationError(field, "must be http(s) URL");
  try {
    const url = new URL(s);
    if (/^(\d+\.){3}\d+$|^\[/.test(url.hostname)) {
      throw new ValidationError(field, "IP-literal URLs not allowed");
    }
    if (/^(localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(url.hostname)) {
      throw new ValidationError(field, "internal hostnames not allowed");
    }
    return url.href;
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    throw new ValidationError(field, "could not parse URL");
  }
}

// ── Enumerations ──

export function requireEnum<T extends string>(
  field: string,
  v: unknown,
  allowed: readonly T[],
): T {
  if (!isString(v)) throw new ValidationError(field, "must be a string");
  if (!(allowed as readonly string[]).includes(v)) {
    throw new ValidationError(field, `must be one of ${allowed.join(", ")}`);
  }
  return v as T;
}

// ── HTML escape ──

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
};
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"'/]/g, (c) => HTML_ESCAPES[c]);
}

// ── Strip non-printable / zero-width / control chars (log-injection defense) ──
// Built via RegExp() with string literals so the source file stays pure ASCII.

const ASCII_CONTROL_RE = new RegExp("[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]", "g");
const ZERO_WIDTH_RE = new RegExp("[\\u200B-\\u200F\\u2028\\u2029\\uFEFF]", "g");
const CRLF_RE = /\r\n?/g;

export function stripControl(s: string): string {
  return s
    .replace(ASCII_CONTROL_RE, "")
    .replace(ZERO_WIDTH_RE, "")
    .replace(CRLF_RE, "\n");
}

// ── Safe JSON for inline <script> blocks ──
// Prevents </script> breakout when serializing data into HTML.

const LS_RE = new RegExp("\\u2028", "g");
const PS_RE = new RegExp("\\u2029", "g");

export function safeJsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(LS_RE, "\\u2028")
    .replace(PS_RE, "\\u2029");
}

// ── Contact-form helper bundling typical fields ──

export type ContactInput = {
  name: string;
  email: string;
  company?: string;
  topic?: string;
  message: string;
};

const CONTACT_TOPICS = [
  "Network Security",
  "Data Security",
  "Information Security",
  "Application Security",
  "Cloud Security",
  "General Requirement",
] as const;

export function parseContact(raw: Record<string, unknown>): ContactInput {
  return {
    name: requireString("name", raw.name, { min: 2, max: 120 }),
    email: requireEmail("email", raw.email),
    company: optionalString("company", raw.company, { max: 200 }),
    topic: raw.topic
      ? requireEnum("topic", raw.topic, CONTACT_TOPICS)
      : undefined,
    message: stripControl(requireString("message", raw.message, { min: 5, max: 4000 })),
  };
}
