"use client";

import { useEffect, useState } from "react";

export default function MouseGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-50 hidden md:block"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        width: 400,
        height: 400,
        background:
          "radial-gradient(circle, rgba(161,0,255,0.06) 0%, transparent 70%)",
        transition: "left 0.1s ease-out, top 0.1s ease-out",
      }}
    />
  );
}
