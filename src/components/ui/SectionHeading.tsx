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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 0, 0.36, 1] }}
      className={`mb-14 ${center ? "text-center" : ""}`}
    >
      <span className={`inline-flex items-center gap-2.5 text-[#A100FF] text-[10px] uppercase tracking-[0.32em] font-medium mb-6 ${center ? "" : ""}`}>
        <span className="w-6 h-px bg-gradient-to-r from-transparent to-[#A100FF]" />
        {tag}
        <span className="w-6 h-px bg-gradient-to-l from-transparent to-[#A100FF]" />
      </span>
      <h2 className="text-[clamp(1.875rem,4vw,3.5rem)] font-semibold text-white leading-[1.02] tracking-[-0.025em]">
        {title}
      </h2>
      {description && (
        <p className="text-[#A2A2A0] mt-5 max-w-xl mx-auto leading-relaxed text-[15px]">
          {description}
        </p>
      )}
    </motion.div>
  );
}
