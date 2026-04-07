"use client";

import { useEffect, useRef } from "react";

/* ── Office coordinates (normalized 0-1 for equirectangular projection) ── */
const offices = [
  { name: "Noida", region: "India", x: 0.715, y: 0.345, color: "#A100FF" },
  { name: "Dubai", region: "UAE", x: 0.665, y: 0.375, color: "#00ccaa" },
  { name: "Centurion", region: "South Africa", x: 0.595, y: 0.68, color: "#3388ff" },
  { name: "Nairobi", region: "Kenya", x: 0.62, y: 0.505, color: "#ff6644" },
  { name: "Boston", region: "USA", x: 0.265, y: 0.32, color: "#ffaa00" },
];

/* ── Simplified continent outlines (normalized x,y pairs) ── */
const continents: number[][][] = [
  // North America
  [[0.08,0.18],[0.12,0.14],[0.18,0.13],[0.22,0.15],[0.25,0.18],[0.28,0.22],[0.30,0.28],[0.28,0.32],[0.24,0.36],[0.20,0.38],[0.18,0.42],[0.17,0.44],[0.14,0.42],[0.12,0.38],[0.10,0.35],[0.08,0.30],[0.06,0.25],[0.08,0.18]],
  // South America
  [[0.28,0.50],[0.30,0.48],[0.33,0.50],[0.35,0.55],[0.34,0.62],[0.33,0.68],[0.31,0.74],[0.29,0.78],[0.27,0.80],[0.25,0.76],[0.24,0.70],[0.24,0.64],[0.25,0.58],[0.26,0.52],[0.28,0.50]],
  // Europe
  [[0.47,0.16],[0.50,0.14],[0.53,0.15],[0.55,0.18],[0.54,0.22],[0.52,0.25],[0.50,0.28],[0.48,0.30],[0.46,0.28],[0.45,0.24],[0.46,0.20],[0.47,0.16]],
  // Africa
  [[0.48,0.34],[0.52,0.32],[0.56,0.34],[0.60,0.38],[0.62,0.42],[0.63,0.48],[0.62,0.55],[0.60,0.62],[0.58,0.68],[0.55,0.72],[0.52,0.70],[0.50,0.65],[0.48,0.58],[0.46,0.50],[0.45,0.42],[0.46,0.36],[0.48,0.34]],
  // Asia
  [[0.58,0.14],[0.62,0.12],[0.68,0.14],[0.75,0.16],[0.80,0.20],[0.82,0.25],[0.80,0.30],[0.78,0.34],[0.75,0.38],[0.72,0.40],[0.68,0.42],[0.64,0.38],[0.60,0.34],[0.58,0.28],[0.56,0.22],[0.58,0.14]],
  // Australia
  [[0.82,0.60],[0.85,0.58],[0.88,0.60],[0.90,0.64],[0.88,0.68],[0.85,0.70],[0.82,0.68],[0.80,0.64],[0.82,0.60]],
];

/* ── Data packet traveling along a connection ── */
interface Packet {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  size: number;
}

export default function NetworkMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    let w = parent.clientWidth;
    let h = parent.clientHeight;
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Connection pairs (all offices connected)
    const connections: [number, number][] = [];
    for (let i = 0; i < offices.length; i++) {
      for (let j = i + 1; j < offices.length; j++) {
        connections.push([i, j]);
      }
    }

    // Data packets
    const packets: Packet[] = [];
    function spawnPacket() {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      const reverse = Math.random() > 0.5;
      packets.push({
        fromIdx: reverse ? conn[1] : conn[0],
        toIdx: reverse ? conn[0] : conn[1],
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
        size: 2 + Math.random() * 3,
      });
    }

    // Floating particles in the background
    const bgParticles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      bgParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    let frameId: number;
    let t = 0;
    let spawnTimer = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.6);
      bgGrad.addColorStop(0, "rgba(8, 15, 30, 0.95)");
      bgGrad.addColorStop(1, "rgba(3, 8, 20, 0.98)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Grid dots
      ctx.fillStyle = "rgba(30, 50, 80, 0.25)";
      const gridSpacing = 30;
      for (let gx = 0; gx < w; gx += gridSpacing) {
        for (let gy = 0; gy < h; gy += gridSpacing) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Background particles
      ctx.save();
      bgParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.fillStyle = `rgba(60, 120, 200, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Draw continents
      continents.forEach((continent) => {
        ctx.beginPath();
        continent.forEach(([x, y], idx) => {
          const px = x * w;
          const py = y * h;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(15, 30, 55, 0.6)";
        ctx.fill();
        ctx.strokeStyle = "rgba(30, 70, 120, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw connections (glowing lines between offices)
      connections.forEach(([i, j]) => {
        const from = offices[i];
        const to = offices[j];
        const fx = from.x * w, fy = from.y * h;
        const tx = to.x * w, ty = to.y * h;

        // Curved connection — arc through a midpoint above
        const mx = (fx + tx) / 2;
        const my = (fy + ty) / 2 - Math.abs(fx - tx) * 0.15;

        // Animated glow intensity
        const pulse = 0.4 + Math.sin(t * 1.5 + i + j) * 0.15;

        // Outer glow
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(mx, my, tx, ty);
        ctx.strokeStyle = `rgba(80, 40, 200, ${pulse * 0.15})`;
        ctx.lineWidth = 6;
        ctx.stroke();

        // Mid glow
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(mx, my, tx, ty);
        ctx.strokeStyle = `rgba(100, 60, 220, ${pulse * 0.3})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Core line
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(mx, my, tx, ty);
        ctx.strokeStyle = `rgba(140, 80, 255, ${pulse * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Spawn data packets periodically
      spawnTimer += 0.016;
      if (spawnTimer > 0.3) {
        spawnTimer = 0;
        spawnPacket();
      }

      // Animate and draw data packets
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const from = offices[pkt.fromIdx];
        const to = offices[pkt.toIdx];
        const fx = from.x * w, fy = from.y * h;
        const tx = to.x * w, ty = to.y * h;
        const mx = (fx + tx) / 2;
        const my = (fy + ty) / 2 - Math.abs(fx - tx) * 0.15;

        // Quadratic bezier point at t
        const prog = pkt.progress;
        const inv = 1 - prog;
        const px = inv * inv * fx + 2 * inv * prog * mx + prog * prog * tx;
        const py = inv * inv * fy + 2 * inv * prog * my + prog * prog * ty;

        // Packet glow
        const packetGrad = ctx.createRadialGradient(px, py, 0, px, py, pkt.size * 4);
        packetGrad.addColorStop(0, `rgba(161, 0, 255, 0.8)`);
        packetGrad.addColorStop(0.4, `rgba(100, 50, 220, 0.3)`);
        packetGrad.addColorStop(1, `rgba(80, 30, 180, 0)`);
        ctx.fillStyle = packetGrad;
        ctx.beginPath();
        ctx.arc(px, py, pkt.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Packet core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, pkt.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw office nodes
      offices.forEach((office, i) => {
        const ox = office.x * w;
        const oy = office.y * h;
        const pulse = 1 + Math.sin(t * 2 + i * 1.3) * 0.3;

        // Outer pulse ring
        const ringRadius = 18 + pulse * 8;
        ctx.beginPath();
        ctx.arc(ox, oy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(161, 0, 255, ${0.1 + pulse * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Second pulse ring (offset phase)
        const ringRadius2 = 12 + Math.sin(t * 3 + i) * 5;
        ctx.beginPath();
        ctx.arc(ox, oy, ringRadius2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 60, 220, 0.2)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Glow halo
        const haloGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, 25);
        haloGrad.addColorStop(0, `rgba(161, 0, 255, 0.3)`);
        haloGrad.addColorStop(0.5, `rgba(100, 40, 200, 0.08)`);
        haloGrad.addColorStop(1, `rgba(80, 20, 160, 0)`);
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(ox, oy, 25, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(ox, oy, 5, 0, Math.PI * 2);
        ctx.fillStyle = office.color;
        ctx.fill();

        // Inner bright center
        ctx.beginPath();
        ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // City label
        ctx.fillStyle = "rgba(200, 210, 230, 0.8)";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(office.name, ox, oy - 28);

        // Region label
        ctx.fillStyle = "rgba(120, 140, 180, 0.5)";
        ctx.font = "9px sans-serif";
        ctx.fillText(office.region, ox, oy - 16);
      });

      // Scan line sweeping across the map
      const scanX = (t * 40) % (w + 100) - 50;
      const scanGrad = ctx.createLinearGradient(scanX - 30, 0, scanX + 30, 0);
      scanGrad.addColorStop(0, "rgba(161, 0, 255, 0)");
      scanGrad.addColorStop(0.5, "rgba(161, 0, 255, 0.04)");
      scanGrad.addColorStop(1, "rgba(161, 0, 255, 0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(scanX - 30, 0, 60, h);

      // Corner HUD elements
      ctx.strokeStyle = "rgba(80, 50, 160, 0.2)";
      ctx.lineWidth = 1;
      // Top-left bracket
      ctx.beginPath();
      ctx.moveTo(15, 35); ctx.lineTo(15, 15); ctx.lineTo(35, 15);
      ctx.stroke();
      // Top-right bracket
      ctx.beginPath();
      ctx.moveTo(w - 15, 35); ctx.lineTo(w - 15, 15); ctx.lineTo(w - 35, 15);
      ctx.stroke();
      // Bottom-left bracket
      ctx.beginPath();
      ctx.moveTo(15, h - 35); ctx.lineTo(15, h - 15); ctx.lineTo(35, h - 15);
      ctx.stroke();
      // Bottom-right bracket
      ctx.beginPath();
      ctx.moveTo(w - 15, h - 35); ctx.lineTo(w - 15, h - 15); ctx.lineTo(w - 35, h - 15);
      ctx.stroke();

      // Status text top-left
      ctx.fillStyle = "rgba(100, 60, 200, 0.4)";
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillText("GLOBAL NETWORK ACTIVE", 22, 30);

      // Status text top-right
      ctx.textAlign = "right";
      ctx.fillText(`NODES: ${offices.length} | LINKS: ${connections.length}`, w - 22, 30);

      // Bottom-left uptime
      ctx.textAlign = "left";
      ctx.fillText("UPTIME: 99.99%", 22, h - 22);

      // Bottom-right threat count
      const threatCount = Math.floor(2800 + Math.sin(t * 0.5) * 50);
      ctx.textAlign = "right";
      ctx.fillText(`THREATS BLOCKED: ${threatCount}`, w - 22, h - 22);
    };

    animate();

    // Resize handler
    const onResize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
