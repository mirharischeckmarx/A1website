"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type Item = {
  label: string;
  hint?: string;
  href?: string;
  keywords?: string[];
  action?: () => void;
};

const ITEMS: Item[] = [
  { label: "Home", href: "/", hint: "/", keywords: ["start", "main"] },
  { label: "Services — Network Security", href: "/services/network-security-solutions", hint: "Services", keywords: ["network", "firewall", "ngfw"] },
  { label: "Services — Cloud Security", href: "/services/cloud-security-solutions", hint: "Services", keywords: ["cloud", "aws", "azure", "gcp", "casb"] },
  { label: "Services — Application Security", href: "/services/application-security-solutions", hint: "Services", keywords: ["app", "appsec", "sdlc"] },
  { label: "Services — Data Security", href: "/services/data-security-solutions", hint: "Services", keywords: ["dlp", "data", "encryption"] },
  { label: "Services — Information Security", href: "/services/information-security-solutions", hint: "Services", keywords: ["infosec", "iso", "compliance"] },
  { label: "Services — Managed SOC", href: "/services/managed-services", hint: "Services", keywords: ["soc", "mssp", "siem", "soar", "xdr"] },
  { label: "Solutions", href: "/solutions", hint: "What we think", keywords: ["ai", "automation", "cloud", "consulting"] },
  { label: "Case Studies", href: "/cases", hint: "Proof", keywords: ["case", "studies", "results"] },
  { label: "Technology Partners", href: "/technology", hint: "Partners", keywords: ["aws", "azure", "fortinet", "palo alto", "crowdstrike"] },
  { label: "About A1", href: "/about", hint: "Company", keywords: ["company", "team", "story"] },
  { label: "Contact", href: "/contact", hint: "Get in touch", keywords: ["email", "phone", "demo", "talk", "sales"] },
  { label: "Book a security assessment", href: "/contact", hint: "CTA", keywords: ["demo", "assessment", "consult"] },
];

function score(item: Item, q: string): number {
  if (!q) return 1;
  const ql = q.toLowerCase();
  const haystack = [item.label, item.hint, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (item.label.toLowerCase().startsWith(ql)) return 100;
  if (haystack.includes(ql)) return 50;
  let qi = 0;
  for (const ch of haystack) {
    if (qi < ql.length && ch === ql[qi]) qi++;
  }
  return qi === ql.length ? 10 : 0;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/preview")) return;
    const onKey = (e: KeyboardEvent) => {
      const isToggle = (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
      if (isToggle) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pathname]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const results = useMemo(() => {
    return ITEMS
      .map((it) => ({ it, s: score(it, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.it);
  }, [query]);

  if (!open) return null;

  function go(item: Item) {
    setOpen(false);
    if (item.action) item.action();
    else if (item.href) router.push(item.href);
  }

  return (
    <div
      role="dialog"
      aria-label="Command palette"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
      }}
    >
      <div
        style={{
          width: "min(640px, 92vw)",
          background: "#0a0a0a",
          border: "1px solid rgba(161,0,255,0.25)",
          borderRadius: 12,
          boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(161,0,255,0.1)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ color: "#A100FF", fontSize: 14 }}>⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
              else if (e.key === "Enter") { e.preventDefault(); if (results[selected]) go(results[selected]); }
            }}
            placeholder="Search the site — services, cases, anything…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 16,
              fontFamily: "inherit",
            }}
            aria-label="Search"
          />
          <kbd style={{ fontSize: 10, color: "#616160", border: "1px solid #2a2a2a", borderRadius: 4, padding: "2px 6px" }}>ESC</kbd>
        </div>

        <ul style={{ listStyle: "none", margin: 0, padding: 8, maxHeight: "50vh", overflowY: "auto" }}>
          {results.length === 0 && (
            <li style={{ padding: "20px 12px", color: "#616160", fontSize: 13 }}>No matches.</li>
          )}
          {results.map((it, i) => (
            <li
              key={it.label}
              onMouseEnter={() => setSelected(i)}
              onClick={() => go(it)}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: i === selected ? "rgba(161,0,255,0.12)" : "transparent",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ color: "#fff", fontSize: 14 }}>{it.label}</span>
              {it.hint && <span style={{ color: "#616160", fontSize: 11, letterSpacing: 1 }}>{it.hint}</span>}
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 10, color: "#616160", letterSpacing: 1 }}>
          <span>↑↓ navigate · ↵ select</span>
          <span>⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}
