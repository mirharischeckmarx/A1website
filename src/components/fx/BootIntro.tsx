"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LINES = [
  { text: "$ a1tech --connect --identify", delay: 200 },
  { text: "[ OK ] Establishing secure channel...", delay: 350 },
  { text: "[ OK ] TLS 1.3 handshake complete", delay: 300 },
  { text: "[ OK ] Verifying SOC certificate chain", delay: 350 },
  { text: "[ OK ] Fingerprint: 4A:91:F2:DC:7E:00:12:88", delay: 400 },
  { text: "[ OK ] Authentication: ACCESS GRANTED", delay: 450 },
  { text: "$ a1tech --launch", delay: 250 },
];

export default function BootIntro() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState<string[]>([]);
  const [hidingNow, setHidingNow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/preview")) return;
    if (sessionStorage.getItem("a1-boot-seen") === "1") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("a1-boot-seen", "1");
      return;
    }
    setVisible(true);
    sessionStorage.setItem("a1-boot-seen", "1");
    document.documentElement.style.overflow = "hidden";

    let cancelled = false;
    let elapsed = 0;
    const acc: string[] = [];

    LINES.forEach((line, i) => {
      elapsed += line.delay;
      setTimeout(() => {
        if (cancelled) return;
        acc.push(line.text);
        setShown([...acc]);
        if (i === LINES.length - 1) {
          setTimeout(() => {
            if (cancelled) return;
            setHidingNow(true);
            setTimeout(() => {
              if (cancelled) return;
              setVisible(false);
              document.documentElement.style.overflow = "";
            }, 600);
          }, 450);
        }
      }, elapsed);
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") skip();
    };
    window.addEventListener("keydown", onKey);

    function skip() {
      cancelled = true;
      setHidingNow(true);
      setTimeout(() => {
        setVisible(false);
        document.documentElement.style.overflow = "";
      }, 300);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        color: "#A100FF",
        fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
        display: "flex",
        flexDirection: "column",
        padding: "10vh 8vw",
        opacity: hidingNow ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
      role="dialog"
      aria-label="Loading"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#A100FF",
            boxShadow: "0 0 12px #A100FF",
            animation: "a1pulse 1.2s ease-in-out infinite",
          }}
        />
        <span style={{ fontSize: 12, letterSpacing: 4, color: "#A2A2A0" }}>
          A1 SECURE TERMINAL · 26.05.24
        </span>
      </div>

      <div style={{ flex: 1, fontSize: 14, lineHeight: 1.9 }}>
        {shown.map((line, i) => {
          const isOk = line.startsWith("[ OK ]");
          const isPrompt = line.startsWith("$");
          return (
            <div key={i} style={{ color: isPrompt ? "#fff" : isOk ? "#9affb0" : "#A2A2A0" }}>
              {isOk ? (
                <>
                  <span style={{ color: "#A100FF" }}>[</span>
                  <span style={{ color: "#9affb0" }}> OK </span>
                  <span style={{ color: "#A100FF" }}>]</span>
                  <span style={{ color: "#fff" }}>{line.slice(6)}</span>
                </>
              ) : (
                line
              )}
            </div>
          );
        })}
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 16,
            background: "#A100FF",
            verticalAlign: "middle",
            marginLeft: 4,
            animation: "a1caret 0.7s steps(2) infinite",
          }}
        />
      </div>

      <div style={{ fontSize: 11, color: "#616160", letterSpacing: 2, marginTop: 24 }}>
        PRESS ESC OR ENTER TO SKIP
      </div>

      <style>{`
        @keyframes a1pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }
        @keyframes a1caret { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
      `}</style>
    </div>
  );
}
