"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  tag: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeading({
  tag,
  title,
  description,
  center = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${center ? "text-center" : ""}`}
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(161,0,255,0.15)] bg-[rgba(161,0,255,0.04)] text-[#A100FF] text-[11px] uppercase tracking-[0.2em] font-medium mb-5">
        <span className="w-1 h-1 rounded-full bg-[#A100FF]" />
        {tag}
      </span>
      <h2 className="text-3xl md:text-5xl font-semibold text-white mt-2 leading-[1.08] tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-[#A2A2A0] mt-4 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
