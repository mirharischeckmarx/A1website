"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SEEDS = [
  { cve: "CVE-2026-1042", sev: "CRITICAL", note: "RCE in widely-deployed VPN appliance" },
  { cve: "CVE-2026-0987", sev: "HIGH", note: "Auth bypass in popular CMS plugin" },
  { cve: "CVE-2026-0815", sev: "HIGH", note: "Memory corruption in image parser" },
  { cve: "CVE-2026-0719", sev: "MEDIUM", note: "Privilege escalation via misconfigured IAM" },
  { cve: "CVE-2026-0688", sev: "CRITICAL", note: "Pre-auth RCE in monitoring agent" },
  { cve: "CVE-2026-0561", sev: "HIGH", note: "SSRF in identity gateway" },
  { cve: "ADVISORY", sev: "INFO", note: "Ransomware group rotating C2 infrastructure" },
  { cve: "ADVISORY", sev: "INFO", note: "Phishing campaign targeting fintech CFOs" },
  { cve: "INTEL", sev: "INFO", note: "New zero-day chain disclosed at industry conference" },
  { cve: "BLOCKED", sev: "OK", note: "8,914 attacks neutralized by A1 SOC in the last hour" },
];

const SEV_COLOR: Record<string, string> = {
  CRITICAL: "#ff3050",
  HIGH: "#ff9a30",
  MEDIUM: "#ffd860",
  INFO: "#8ab4ff",
  OK: "#00FFE0",
};

export default function ThreatTicker() {
  const pathname = usePathname();
  const [items, setItems] = useState(() => SEEDS);

  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) => {
        const rotated = [...prev.slice(1), prev[0]];
        return rotated;
      });
    }, 12000);
    return () => clearInterval(id);
  }, []);

  if (pathname?.startsWith("/preview")) return null;

  return (
    <div
      aria-label="Live threat intelligence ticker"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 30,
        background: "rgba(8,0,12,0.92)",
        borderTop: "1px solid rgba(161,0,255,0.25)",
        backdropFilter: "blur(8px)",
        overflow: "hidden",
        zIndex: 30,
        fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
        fontSize: 11,
        color: "#ddd",
        display: "flex",
        alignItems: "center",
        gap: 0,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          background: "linear-gradient(90deg, #0a0a0a, #050505)",
          color: "#00FFE0",
          padding: "4px 14px",
          letterSpacing: 3,
          fontWeight: 700,
          fontSize: 10,
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderRight: "1px solid rgba(0, 255, 224, 0.25)",
          textShadow: "0 0 8px rgba(0, 255, 224, 0.5)",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#00FFE0",
            boxShadow: "0 0 10px #00FFE0",
            animation: "tickerPulse 1.4s ease-in-out infinite",
          }}
        />
        LIVE THREAT FEED
      </div>

      <div
        style={{
          flex: 1,
          overflow: "hidden",
          maskImage: "linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 40,
            whiteSpace: "nowrap",
            animation: "tickerScroll 90s linear infinite",
            paddingLeft: 24,
          }}
        >
          {[...items, ...items].map((it, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#616160", fontSize: 10, letterSpacing: 1, fontVariantNumeric: "tabular-nums" }}>{it.cve}</span>
              <span style={{ color: SEV_COLOR[it.sev], fontWeight: 700, fontSize: 10, letterSpacing: 2 }}>{it.sev}</span>
              <span style={{ color: "#c8c8c8" }}>{it.note}</span>
              <span style={{ color: "#00FFE0", opacity: 0.25 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tickerScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes tickerPulse { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="Live threat intelligence ticker"] > div:last-of-type > div {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
