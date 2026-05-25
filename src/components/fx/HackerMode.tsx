"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SEQUENCE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

export default function HackerMode() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/preview")) return;
    if (localStorage.getItem("a1-hacker-mode") === "1") {
      setActive(true);
      document.body.classList.add("hacker-mode");
    }

    let buffer: string[] = [];

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer = [...buffer, key].slice(-SEQUENCE.length);

      if (buffer.length === SEQUENCE.length && buffer.every((k, i) => k === SEQUENCE[i])) {
        toggle();
      }
    };

    function toggle() {
      const next = !document.body.classList.contains("hacker-mode");
      document.body.classList.toggle("hacker-mode", next);
      localStorage.setItem("a1-hacker-mode", next ? "1" : "0");
      setActive(next);
      setToast(next ? "HACKER MODE ENGAGED" : "HACKER MODE DISENGAGED");
      setTimeout(() => setToast(null), 2500);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname]);

  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
        background: active ? "rgba(0,20,0,0.92)" : "rgba(20,0,30,0.92)",
        color: active ? "#7CFC00" : "#A100FF",
        border: `1px solid ${active ? "#7CFC00" : "#A100FF"}`,
        padding: "12px 24px",
        fontSize: 12,
        fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
        letterSpacing: 4,
        fontWeight: 700,
        zIndex: 9500,
        boxShadow: `0 0 30px ${active ? "rgba(124,252,0,0.5)" : "rgba(161,0,255,0.5)"}`,
        animation: "hmFlash 0.4s ease",
      }}
    >
      {toast}
      <style>{`
        @keyframes hmFlash {
          from { transform: translate(-50%, 20px); opacity: 0 }
          to { transform: translate(-50%, 0); opacity: 1 }
        }
      `}</style>
    </div>
  );
}
