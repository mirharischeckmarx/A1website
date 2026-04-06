"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";

const stats = [
  { end: 5, suffix: "+", label: "Years Experience", prefix: "" },
  { end: 30, suffix: "+", label: "Solution Partners", prefix: "" },
  { end: 60, suffix: "+", label: "Completed Projects", prefix: "" },
  { end: 50, suffix: "+", label: "Happy Customers", prefix: "" },
];

export default function StatsSection() {
  return (
    <section className="py-20 border-y border-[rgba(161,0,255,0.06)] bg-[rgba(161,0,255,0.01)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-[#A100FF] text-xs uppercase tracking-[0.3em] font-mono">
            // FOR THE CYBERSECURITY SOLUTIONS OF THE FUTURE
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-3">
            Trust A1 Technology
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              end={stat.end}
              suffix={stat.suffix}
              prefix={stat.prefix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
