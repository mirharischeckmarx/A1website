"use client";

import { useEffect, useRef } from "react";

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let mouseX = w / 2;
    let mouseY = h / 2;
    let scrollY = 0;
    let time = 0;

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Accenture-purple aurora blobs
    interface Blob { x: number; y: number; radius: number; offset: number; speed: number; }
    const blobs: Blob[] = [];
    for (let i = 0; i < 4; i++) {
      blobs.push({
        x: (i / 4) * w + Math.random() * 200,
        y: Math.random() * h,
        radius: 250 + Math.random() * 350,
        offset: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.2,
      });
    }

    // Floating particles
    interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; }
    const particles: Particle[] = [];
    const pCount = w < 768 ? 30 : 70;
    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2, vy: -0.15 - Math.random() * 0.3,
        size: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.2 + 0.05,
      });
    }

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.003;

      // Black base
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      // Aurora blobs — purple palette shifting
      blobs.forEach((blob) => {
        const bx = blob.x + Math.sin(time * blob.speed + blob.offset) * 180 + (mouseX / w - 0.5) * 40;
        const by = blob.y + Math.cos(time * blob.speed * 0.6 + blob.offset) * 120 + (mouseY / h - 0.5) * 25 - scrollY * 0.03;

        // Shift between purple, deep blue, and dark magenta
        const phase = time + blob.offset;
        const r = Math.floor(40 + Math.sin(phase * 0.7) * 35 + Math.sin(phase * 1.3) * 20);
        const g = Math.floor(5 + Math.sin(phase * 0.5 + 2) * 5);
        const b = Math.floor(60 + Math.sin(phase * 0.4 + 1) * 50 + Math.cos(phase * 0.8) * 30);
        const alpha = 0.025 + Math.sin(time * 0.8 + blob.offset) * 0.01;

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, blob.radius);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.4})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // Mouse-reactive purple glow
      const mGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 250);
      mGrad.addColorStop(0, "rgba(161,0,255,0.035)");
      mGrad.addColorStop(1, "transparent");
      ctx.fillStyle = mGrad;
      ctx.fillRect(0, 0, w, h);

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(161,0,255,${p.alpha})`;
        ctx.fill();
      });

      // Subtle grid
      ctx.strokeStyle = `rgba(161,0,255,${0.01 + Math.sin(time * 2) * 0.004})`;
      ctx.lineWidth = 0.5;
      const grid = 80;
      const ox = (scrollY * 0.08) % grid;
      for (let x = -grid + ox; x < w + grid; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      const oy = (scrollY * 0.04) % grid;
      for (let y = -grid + oy; y < h + grid; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%", willChange: "auto" }}
    />
  );
}
