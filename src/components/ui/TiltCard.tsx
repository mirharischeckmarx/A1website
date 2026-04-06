"use client";

import { useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}

export default function TiltCard({
  children,
  className = "",
  glowColor = "0,255,156",
  delay = 0,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTilt({
      x: (y - 0.5) * -15,
      y: (x - 0.5) * 15,
    });
    setGlowPos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: "preserve-3d",
        transition: isHovered ? "none" : "transform 0.4s ease-out",
      }}
      className={`relative group ${className}`}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(${glowColor},0.12) 0%, transparent 60%)`,
        }}
      />

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-0"
        style={{
          boxShadow: `0 0 30px rgba(${glowColor},0.08), inset 0 0 30px rgba(${glowColor},0.02)`,
        }}
      />

      {/* Content with Z-depth */}
      <div
        className="relative z-10 glass-panel p-6 h-full"
        style={{ transform: "translateZ(20px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
