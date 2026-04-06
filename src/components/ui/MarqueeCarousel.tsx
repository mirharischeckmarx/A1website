"use client";

import { useEffect, useRef } from "react";

const pills = [
  "Cybersecurity", "Zero Trust", "AI-Powered", "SOC 24/7",
  "Threat Intelligence", "Cloud Security", "DevSecOps", "SIEM & SOAR",
  "Penetration Testing", "Managed Services", "XDR",
  "Application Security", "Data Protection", "Compliance",
  "Vulnerability Management", "Incident Response", "Network Defense",
  "Identity & Access", "CASB & CNAPP",
];

export default function MarqueeCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      x -= 0.4;
      if (Math.abs(x) >= track.scrollWidth / 2) x = 0;
      track.style.transform = `translateX(${x}px)`;
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="overflow-hidden py-5 border-y border-white/[0.04] bg-black/50 backdrop-blur-sm">
      <div ref={trackRef} className="flex gap-3 will-change-transform" style={{ width: "max-content" }}>
        {[...pills, ...pills].map((pill, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-5 py-2 rounded-full shrink-0 border border-[rgba(161,0,255,0.25)] bg-[rgba(161,0,255,0.06)] hover:bg-[rgba(161,0,255,0.12)] transition-colors"
          >
            <span className="text-[#A100FF] text-xs">&#9670;</span>
            <span className="text-white/70 text-[13px] font-medium whitespace-nowrap">{pill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
