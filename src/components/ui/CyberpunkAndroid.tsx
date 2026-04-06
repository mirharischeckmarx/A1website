"use client";

import { useEffect, useRef } from "react";

export default function CyberpunkAndroid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Particle system
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      drift: number;
    }

    const particles: Particle[] = [];
    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * w(),
        y: Math.random() * h(),
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.4 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        drift: (Math.random() - 0.5) * 0.3,
      });
    }

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, w(), h());

      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) {
          p.y = h() + 10;
          p.x = Math.random() * w();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${p.opacity})`;
        ctx.fill();
      });
    };
    animate();

    // Circuit trace animation
    const traces = containerRef.current?.querySelectorAll(".circuit-trace");
    traces?.forEach((trace, i) => {
      const el = trace as HTMLElement;
      el.style.animationDelay = `${i * 1.5}s`;
    });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="android-hero"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 40%, #0d1b2a 0%, #0a0a0f 70%, #050508 100%)",
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,0.015) 2px, rgba(0,200,255,0.015) 4px)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
          zIndex: 15,
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={particleCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* ── THREE FACES CONTAINER ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(900px, 90vw)",
          height: "min(700px, 80vh)",
          zIndex: 5,
        }}
      >
        {/* Left profile face */}
        <div
          style={{
            position: "absolute",
            left: "0%",
            top: "50%",
            transform: "translateY(-50%) scale(0.7)",
            opacity: 0.35,
            filter: "blur(2px)",
            zIndex: 1,
          }}
        >
          <AndroidFace profile="left" />
        </div>

        {/* Right profile face */}
        <div
          style={{
            position: "absolute",
            right: "0%",
            top: "50%",
            transform: "translateY(-50%) scale(0.7)",
            opacity: 0.35,
            filter: "blur(2px)",
            zIndex: 1,
          }}
        >
          <AndroidFace profile="right" />
        </div>

        {/* Center face (main) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
          }}
        >
          <AndroidFace profile="center" />
        </div>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes eyePulse {
          0%, 100% { opacity: 0.9; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.4); }
        }
        @keyframes eyeGlowPulse {
          0%, 100% { box-shadow: 0 0 15px 5px rgba(0,200,255,0.4), 0 0 40px 10px rgba(0,200,255,0.2), inset 0 0 10px rgba(0,200,255,0.3); }
          50% { box-shadow: 0 0 25px 10px rgba(0,200,255,0.6), 0 0 60px 20px rgba(0,200,255,0.3), inset 0 0 15px rgba(0,200,255,0.5); }
        }
        @keyframes irisRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes circuitFlow {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes ledBlink {
          0%, 90%, 100% { opacity: 0.3; }
          95% { opacity: 1; }
        }
        @keyframes neckGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        .circuit-trace {
          animation: circuitFlow 4s linear infinite;
        }
        .led-node {
          animation: ledBlink 3s ease-in-out infinite;
        }
        .eye-container {
          animation: eyeGlowPulse 3s ease-in-out infinite;
        }
        .iris-ring {
          animation: irisRotate 12s linear infinite;
        }
        .iris-ring-reverse {
          animation: irisRotate 8s linear infinite reverse;
        }
      `}</style>
    </div>
  );
}

/* ── ANDROID FACE COMPONENT ── */
function AndroidFace({ profile }: { profile: "center" | "left" | "right" }) {
  const isCenter = profile === "center";
  const scale = isCenter ? 1 : 0.85;
  const skewX = profile === "left" ? "15deg" : profile === "right" ? "-15deg" : "0deg";
  const faceWidth = 220 * scale;
  const faceHeight = 300 * scale;

  return (
    <div
      style={{
        width: faceWidth,
        height: faceHeight + 120 * scale,
        position: "relative",
        transform: `perspective(800px) rotateY(${profile === "left" ? "25deg" : profile === "right" ? "-25deg" : "0deg"})`,
      }}
    >
      {/* ── HEAD / CRANIUM ── */}
      <div
        style={{
          position: "absolute",
          width: faceWidth,
          height: faceHeight,
          left: "50%",
          top: 0,
          transform: "translateX(-50%)",
          borderRadius: `${faceWidth * 0.45}px ${faceWidth * 0.45}px ${faceWidth * 0.3}px ${faceWidth * 0.3}px`,
          background: `
            radial-gradient(ellipse at 50% 30%, #2a3040 0%, #1a1e2e 40%, #0f1218 80%),
            linear-gradient(180deg, #1e2535 0%, #12161f 100%)
          `,
          boxShadow: `
            inset 0 ${-20 * scale}px ${40 * scale}px rgba(0,0,0,0.5),
            inset 0 ${10 * scale}px ${30 * scale}px rgba(0,180,255,0.03),
            0 0 ${60 * scale}px rgba(0,0,0,0.8),
            0 0 ${30 * scale}px rgba(0,100,200,0.05)
          `,
          overflow: "hidden",
        }}
      >
        {/* Micro-crack texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(137deg, transparent 48%, rgba(40,50,70,0.3) 49%, transparent 50%),
              linear-gradient(43deg, transparent 46%, rgba(30,40,60,0.2) 47%, transparent 48%),
              linear-gradient(95deg, transparent 45%, rgba(35,45,65,0.15) 46%, transparent 47%)
            `,
            borderRadius: "inherit",
            pointerEvents: "none",
          }}
        />

        {/* Forehead mechanical plating */}
        <div
          style={{
            position: "absolute",
            top: `${8 * scale}px`,
            left: "50%",
            transform: "translateX(-50%)",
            width: `${faceWidth * 0.7}px`,
            height: `${35 * scale}px`,
            borderRadius: `${15 * scale}px`,
            background: "linear-gradient(180deg, #1a2030 0%, #151b28 100%)",
            border: "1px solid rgba(0,150,255,0.08)",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          {/* Circuit lines on forehead */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="circuit-trace"
              style={{
                position: "absolute",
                top: `${8 + i * 8}px`,
                left: `${15 + i * 5}px`,
                right: `${15 + i * 5}px`,
                height: "1px",
                background: `linear-gradient(90deg, transparent 0%, rgba(0,200,255,0.3) 20%, rgba(0,200,255,0.1) 50%, rgba(0,200,255,0.3) 80%, transparent 100%)`,
                backgroundSize: "200% 100%",
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* ── EYES ── */}
        {isCenter && (
          <>
            <Eye x={faceWidth * 0.3} y={faceHeight * 0.38} scale={scale} />
            <Eye x={faceWidth * 0.7} y={faceHeight * 0.38} scale={scale} />
          </>
        )}
        {!isCenter && (
          <Eye
            x={profile === "left" ? faceWidth * 0.55 : faceWidth * 0.45}
            y={faceHeight * 0.38}
            scale={scale}
          />
        )}

        {/* ── NOSE ── */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `${faceHeight * 0.48}px`,
            transform: "translateX(-50%)",
            width: `${18 * scale}px`,
            height: `${35 * scale}px`,
            background: `linear-gradient(180deg, rgba(30,40,55,0.6) 0%, rgba(25,30,45,0.8) 100%)`,
            borderRadius: `${4 * scale}px ${4 * scale}px ${8 * scale}px ${8 * scale}px`,
            boxShadow: `
              ${-2 * scale}px 0 ${5 * scale}px rgba(0,0,0,0.3),
              ${2 * scale}px 0 ${5 * scale}px rgba(0,0,0,0.3)
            `,
          }}
        />

        {/* ── LIPS ── */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `${faceHeight * 0.68}px`,
            transform: "translateX(-50%)",
            width: `${50 * scale}px`,
            height: `${12 * scale}px`,
          }}
        >
          {/* Upper lip */}
          <div
            style={{
              width: "100%",
              height: `${5 * scale}px`,
              background: "linear-gradient(180deg, #2a3040 0%, #222838 100%)",
              borderRadius: `${6 * scale}px ${6 * scale}px 0 0`,
              clipPath: "polygon(15% 0%, 50% 30%, 85% 0%, 100% 100%, 0% 100%)",
            }}
          />
          {/* Lip separation line */}
          <div
            style={{
              width: "80%",
              height: "1px",
              margin: "0 auto",
              background: "linear-gradient(90deg, transparent, rgba(0,150,255,0.15), transparent)",
            }}
          />
          {/* Lower lip */}
          <div
            style={{
              width: "85%",
              height: `${6 * scale}px`,
              margin: "0 auto",
              background: "linear-gradient(180deg, #1e2535 0%, #1a2030 100%)",
              borderRadius: `0 0 ${10 * scale}px ${10 * scale}px`,
            }}
          />
        </div>

        {/* ── JAWLINE ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${faceHeight * 0.15}px`,
            background: "linear-gradient(0deg, rgba(15,18,24,0.9) 0%, transparent 100%)",
            borderRadius: `0 0 ${faceWidth * 0.3}px ${faceWidth * 0.3}px`,
          }}
        />

        {/* ── TEMPLE MECHANICS (left) ── */}
        <TempleMechanism x={5 * scale} y={faceHeight * 0.3} scale={scale} side="left" />
        {/* ── TEMPLE MECHANICS (right) ── */}
        <TempleMechanism x={faceWidth - 35 * scale} y={faceHeight * 0.3} scale={scale} side="right" />
      </div>

      {/* ── NECK MECHANICS ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `${faceHeight - 10 * scale}px`,
          transform: "translateX(-50%)",
          width: `${faceWidth * 0.45}px`,
          height: `${120 * scale}px`,
        }}
      >
        {/* Neck column */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(180deg, #1a1e2e 0%, #0f1218 100%)`,
            borderRadius: `0 0 ${20 * scale}px ${20 * scale}px`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Cable bundles */}
          {[0.2, 0.4, 0.6, 0.8].map((xPos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${xPos * 100}%`,
                top: 0,
                bottom: 0,
                width: `${3 * scale}px`,
                background: `linear-gradient(180deg, #2a3545 0%, #1a2535 50%, #151d2a 100%)`,
                boxShadow: `0 0 ${3 * scale}px rgba(0,100,200,0.1)`,
              }}
            />
          ))}

          {/* LED nodes on neck */}
          {[0.15, 0.35, 0.55, 0.75, 0.9].map((yPos, i) => (
            <div
              key={i}
              className="led-node"
              style={{
                position: "absolute",
                left: `${20 + (i % 3) * 25}%`,
                top: `${yPos * 100}%`,
                width: `${3 * scale}px`,
                height: `${3 * scale}px`,
                borderRadius: "50%",
                background: "#00c8ff",
                boxShadow: `0 0 ${4 * scale}px rgba(0,200,255,0.6), 0 0 ${8 * scale}px rgba(0,200,255,0.3)`,
                animationDelay: `${i * 0.6}s`,
              }}
            />
          ))}

          {/* Horizontal rings */}
          {[0.2, 0.5, 0.8].map((yPos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "-5%",
                right: "-5%",
                top: `${yPos * 100}%`,
                height: `${2 * scale}px`,
                background: "linear-gradient(90deg, transparent, rgba(0,150,255,0.12), transparent)",
                animation: `neckGlow 3s ease-in-out ${i * 0.8}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── EYE ILLUMINATION on face ── */}
      {isCenter && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `${faceHeight * 0.35}px`,
            transform: "translateX(-50%)",
            width: `${faceWidth * 0.8}px`,
            height: `${faceHeight * 0.4}px`,
            background: "radial-gradient(ellipse at 50% 30%, rgba(0,180,255,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      )}

      {/* ── RIM LIGHT ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          [profile === "left" ? "right" : profile === "right" ? "left" : "right"]: "-2px",
          width: "2px",
          height: `${faceHeight * 0.8}px`,
          background: `linear-gradient(180deg, transparent 0%, rgba(100,180,255,0.15) 30%, rgba(100,180,255,0.08) 70%, transparent 100%)`,
          borderRadius: `${faceWidth * 0.45}px`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ── EYE COMPONENT ── */
function Eye({ x, y, scale }: { x: number; y: number; scale: number }) {
  const size = 28 * scale;

  return (
    <div
      className="eye-container"
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size * 0.7}px`,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: "radial-gradient(circle, #00e5ff 0%, #0088cc 40%, #004466 70%, #001a2e 100%)",
        zIndex: 10,
      }}
    >
      {/* Iris rings (concentric, like camera aperture) */}
      <div
        className="iris-ring"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: `${size * 0.8}px`,
          height: `${size * 0.55}px`,
          borderRadius: "50%",
          border: `1px solid rgba(0,220,255,0.4)`,
        }}
      />
      <div
        className="iris-ring-reverse"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: `${size * 0.55}px`,
          height: `${size * 0.38}px`,
          borderRadius: "50%",
          border: `1px solid rgba(0,240,255,0.6)`,
        }}
      />
      {/* Inner core glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: `${size * 0.25}px`,
          height: `${size * 0.18}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffffff 0%, #80ffff 40%, #00ccff 100%)",
          animation: "eyePulse 3s ease-in-out infinite",
        }}
      />
      {/* Aperture blades (8 segments) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: `${size * 0.4}px`,
            height: "1px",
            background: `linear-gradient(90deg, transparent, rgba(0,200,255,0.25), transparent)`,
            transform: `translate(-50%, -50%) rotate(${i * 22.5}deg)`,
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}

/* ── TEMPLE MECHANISM ── */
function TempleMechanism({
  x,
  y,
  scale,
  side,
}: {
  x: number;
  y: number;
  scale: number;
  side: "left" | "right";
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${30 * scale}px`,
        height: `${60 * scale}px`,
      }}
    >
      {/* Chrome tubes */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${i * 18 * scale}px`,
            left: side === "left" ? 0 : "auto",
            right: side === "right" ? 0 : "auto",
            width: `${20 * scale}px`,
            height: `${4 * scale}px`,
            background: `linear-gradient(${side === "left" ? "90deg" : "270deg"}, #3a4555 0%, #2a3545 50%, #1a2535 100%)`,
            borderRadius: `${2 * scale}px`,
            boxShadow: `0 1px ${2 * scale}px rgba(0,0,0,0.5), inset 0 1px 0 rgba(100,150,200,0.1)`,
          }}
        />
      ))}

      {/* LED nodes */}
      {[0, 1].map((i) => (
        <div
          key={i}
          className="led-node"
          style={{
            position: "absolute",
            top: `${5 + i * 20}px`,
            [side === "left" ? "right" : "left"]: `${2 * scale}px`,
            width: `${3 * scale}px`,
            height: `${3 * scale}px`,
            borderRadius: "50%",
            background: "#00c8ff",
            boxShadow: `0 0 ${4 * scale}px rgba(0,200,255,0.6)`,
            animationDelay: `${i * 1.2}s`,
          }}
        />
      ))}

      {/* Wiring */}
      <div
        style={{
          position: "absolute",
          top: `${50 * scale}px`,
          left: side === "left" ? `${5 * scale}px` : "auto",
          right: side === "right" ? `${5 * scale}px` : "auto",
          width: `${15 * scale}px`,
          height: `${1}px`,
          background: `linear-gradient(${side === "left" ? "90deg" : "270deg"}, rgba(0,200,255,0.2), transparent)`,
        }}
      />
    </div>
  );
}
