"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const differentiators = [
  {
    title: "Direct Expert Access",
    description:
      "You get direct access to certified engineers and 24/7 mission-critical support by our global team. No barriers, no scripted support calls.",
  },
  {
    title: "Powerful Ecosystem",
    description:
      "We offer best-of-breed solutions thanks to our close ties with the world's leading network and security technology vendors.",
  },
  {
    title: "Superior Project Execution",
    description:
      "We offer skilled project management and perfect interdisciplinary alignment. Experience peace of mind during the rollout of your project.",
  },
  {
    title: "Lean and Agile",
    description:
      "Not just buzzwords. We have a relentless focus on quality, speed, and customer satisfaction.",
  },
  {
    title: "Peer-to-Peer Engagement",
    description:
      "We connect with our customers on all levels, and function as an extension of their own team, from engineers to executives.",
  },
  {
    title: "Thrive in Complex Situations",
    description:
      "Our experts work on the most complex network and security projects in highly competitive industries.",
  },
];

const stats = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 30, suffix: "+", label: "Solution Partners" },
  { value: 60, suffix: "+", label: "Projects Delivered" },
  { value: 50, suffix: "+", label: "Happy Clients" },
  { value: 5, suffix: "", label: "Countries" },
  { value: 24, suffix: "/7", label: "SOC Operations" },
];

const offices = [
  {
    region: "IN",
    city: "Noida",
    country: "India",
    role: "Global Headquarters",
    top: "42%",
    left: "68%",
  },
  {
    region: "AE",
    city: "Dubai",
    country: "UAE",
    role: "Middle East Operations",
    top: "44%",
    left: "58%",
  },
  {
    region: "ZA",
    city: "Johannesburg",
    country: "South Africa",
    role: "Southern Africa Hub",
    top: "72%",
    left: "54%",
  },
  {
    region: "KE",
    city: "Nairobi",
    country: "Kenya",
    role: "East Africa Hub",
    top: "55%",
    left: "56%",
  },
  {
    region: "US",
    city: "Boston",
    country: "USA",
    role: "Americas Operations",
    top: "36%",
    left: "25%",
  },
];

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                   */
/* ------------------------------------------------------------------ */

function AnimatedCounter({
  value,
  suffix,
  duration = 2,
}: {
  value: number;
  suffix: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <>
      {/* ============================================================ */}
      {/* 1. HERO                                                       */}
      {/* ============================================================ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/content/about-banner.png"
          alt="A1 Technology"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40 z-[1]" />
        <ParticleField density={0.4} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[#A100FF] text-xs uppercase tracking-[0.3em] font-mono">
              // ABOUT A1 TECHNOLOGY
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mt-6 leading-[1.05] tracking-tight">
              Building Cyber Resilience
              <br />
              <span className="neon-text">Across the Globe</span>
            </h1>
            <p className="text-gray-400 mt-8 max-w-xl text-lg md:text-xl leading-relaxed">
              The Global Story of Domestic Capital
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-[1px] h-12 bg-gradient-to-b from-[#A100FF] to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. COMPANY OVERVIEW                                           */}
      {/* ============================================================ */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div>
              <SectionHeading
                tag="// WHO WE ARE"
                title="The Foremost IT & Cybersecurity Solutions Provider"
                center={false}
              />
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>
                  A1 Technology stands as the foremost IT, cybersecurity and
                  advanced technical and networking solutions provider in the
                  region. Since our inception in 2020, we have been dedicated to
                  empowering companies with tailor-made information security
                  solutions and services that meet the evolving challenges of the
                  digital landscape.
                </p>
                <p>
                  With a commitment to cutting-edge technology, we offer
                  comprehensive insights and world-class solutions, providing our
                  clients with an unparalleled advantage over competitors in their
                  respective industries.
                </p>
                <p>
                  Our team of experts combines industry knowledge with innovative
                  approaches to deliver custom solutions that address the unique
                  cybersecurity needs of each client. A1 Technology&apos;s track record
                  exemplifies our unwavering commitment to excellence, positioning
                  us as the go-to partner for organisations seeking a secure and
                  competitive edge in today&apos;s dynamic business environment.
                </p>
              </div>
            </div>

            {/* Right — image with stats overlay */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-[rgba(161,0,255,0.12)]">
                <Image
                  src="/images/content/hero-team.jpg"
                  alt="A1 Technology team"
                  width={720}
                  height={480}
                  className="w-full h-auto object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Stats overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "5+", label: "Years" },
                      { value: "50+", label: "Clients" },
                      { value: "5", label: "Countries" },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="text-xl md:text-2xl font-bold neon-text font-mono">
                          {s.value}
                        </div>
                        <div className="text-gray-400 text-[10px] uppercase tracking-widest mt-1">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,rgba(161,0,255,0.08),transparent_70%)] -z-10 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. STATS BAR                                                  */}
      {/* ============================================================ */}
      <section className="relative py-20 border-y border-[rgba(161,0,255,0.1)] overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(161,0,255,0.06),transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="text-3xl md:text-4xl font-bold neon-text font-mono mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-500 text-xs uppercase tracking-[0.15em] group-hover:text-gray-300 transition-colors duration-300">
                  {stat.label}
                </div>
                {/* Underline accent */}
                <div className="mt-3 mx-auto w-8 h-[2px] bg-gradient-to-r from-transparent via-[#A100FF] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. DIFFERENTIATORS                                            */}
      {/* ============================================================ */}
      <section className="py-32 bg-[rgba(161,0,255,0.01)]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// A PARTNER YOU CAN RELY ON"
            title="A Security and Network Partner You Can Rely On"
            description="We have over half a decade of experience in security and networking for enterprises, data centers and telecommunication companies. This sets us apart from pure players in the enterprise security industry."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((item, i) => (
              <GlassCard key={item.title} delay={i * 0.1}>
                <div className="flex items-start gap-5">
                  {/* Number badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg border border-[rgba(161,0,255,0.2)] bg-[rgba(161,0,255,0.06)] flex items-center justify-center">
                    <span className="text-[#A100FF] font-mono text-sm font-bold">
                      0{i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. MISSION & VISION                                           */}
      {/* ============================================================ */}
      <section className="relative py-32 overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/content/solutions-banner.jpg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// PURPOSE & DIRECTION"
            title="What Drives Us Forward"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 md:p-10 relative overflow-hidden group"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#A100FF] to-transparent" />

              <span className="text-[#A100FF] text-xs uppercase tracking-[0.2em] font-mono font-semibold">
                Our Mission
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-6">
                Catalysts for Innovation
              </h3>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  Our mission extends beyond protection. We strive to be catalysts
                  for innovation, enabling organisations to confidently harness the
                  full potential of emerging and cutting-edge technologies.
                </p>
                <p>
                  By remaining at the forefront of industry advancements, we deliver
                  world-class expertise, strategic insight, and forward-looking
                  solutions that help our clients achieve sustainable competitive
                  advantage.
                </p>
                <p>
                  Through a culture of continuous learning and adaptability, we
                  position ourselves as a trusted partner for organisations seeking
                  not just security, but long-term business value.
                </p>
              </div>
              {/* Decorative */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-[rgba(161,0,255,0.04)] blur-3xl group-hover:bg-[rgba(161,0,255,0.08)] transition-colors duration-700" />
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="glass-panel p-8 md:p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#A100FF] to-transparent" />

              <span className="text-[#A100FF] text-xs uppercase tracking-[0.2em] font-mono font-semibold">
                Our Vision
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-6">
                Global Leader in Cybersecurity
              </h3>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  At A1 Technology, our vision is to be a global leader in
                  cybersecurity and advanced technology solutions — setting the
                  benchmark for excellence, trust, and innovation across the industry.
                </p>
                <p>
                  We aspire to build a strong international presence across India,
                  the Middle East, Africa, and the Americas, becoming the most
                  trusted global solutions provider in cybersecurity.
                </p>
                <p>
                  Leveraging deep expertise in security technologies and an
                  innovation-driven approach, we deliver comprehensive, scalable,
                  and sustainable security solutions that empower our customers to
                  operate with confidence in an increasingly complex digital landscape.
                </p>
              </div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-[rgba(161,0,255,0.04)] blur-3xl group-hover:bg-[rgba(161,0,255,0.08)] transition-colors duration-700" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. GLOBAL PRESENCE                                            */}
      {/* ============================================================ */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// GLOBAL PRESENCE"
            title="Operational Across 5 Countries"
            description="From our headquarters in India to strategic offices across the Middle East, Africa, and the Americas."
          />

          {/* Map container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mt-16"
          >
            {/* SVG World Map — simplified outline */}
            <div className="relative w-full aspect-[2/1] rounded-2xl border border-[rgba(161,0,255,0.08)] bg-[rgba(161,0,255,0.02)] overflow-hidden">
              {/* Grid lines */}
              <svg
                viewBox="0 0 1000 500"
                fill="none"
                className="absolute inset-0 w-full h-full opacity-[0.06]"
              >
                {/* Horizontal grid */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0"
                    y1={i * 50}
                    x2="1000"
                    y2={i * 50}
                    stroke="#A100FF"
                    strokeWidth="0.5"
                  />
                ))}
                {/* Vertical grid */}
                {Array.from({ length: 21 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={i * 50}
                    y1="0"
                    x2={i * 50}
                    y2="500"
                    stroke="#A100FF"
                    strokeWidth="0.5"
                  />
                ))}
                {/* Simplified world outline */}
                <path
                  d="M150,120 Q200,100 250,115 Q280,120 300,110 Q320,105 340,115 Q360,125 380,120 Q400,115 420,130 Q440,140 460,135 Q480,120 500,125 Q510,130 520,140 Q530,155 540,160 Q560,165 580,155 Q600,145 620,150 Q640,155 660,148 Q680,140 700,145 Q720,150 740,155 Q760,145 780,155 Q800,160 820,155 L830,158 Q840,165 830,175 Q820,185 810,195 Q790,210 780,230 Q775,240 770,255 L760,260 Q750,265 740,260 Q730,255 720,260 Q710,270 700,275 Q690,280 680,275 Q670,270 660,280 Q650,290 640,285 Q620,275 610,280 Q600,290 590,295 Q580,300 565,295 Q550,285 540,290 Q530,300 520,310 Q510,320 500,325 L490,330 Q480,335 470,330 Q460,320 450,315 Q440,310 430,315 Q420,320 410,325 Q400,330 390,340 Q380,350 370,355 L350,360 Q340,355 330,350 Q320,340 310,335 Q300,330 290,325 Q270,315 260,310 L250,305 Q240,298 230,290 Q220,280 210,275 Q200,268 190,260 Q180,250 175,240 Q170,230 165,220 Q160,200 155,185 Q150,170 148,155 Z"
                  stroke="#A100FF"
                  strokeWidth="1"
                  opacity="0.3"
                  fill="rgba(161,0,255,0.02)"
                />
                {/* Americas */}
                <path
                  d="M140,150 Q150,140 170,135 Q190,130 200,140 Q210,150 215,165 Q218,175 215,190 Q210,205 205,220 Q200,235 195,250 Q190,260 188,275 Q186,290 190,305 Q195,320 200,335 Q205,350 210,360 Q215,370 220,380 Q225,390 230,395 L235,400 Q230,405 220,400 Q210,390 200,380 Q190,365 185,355 Q175,340 170,325 Q165,310 160,295 Q155,280 152,265 Q150,250 148,235 Q145,220 143,205 Q140,185 138,170 Z"
                  stroke="#A100FF"
                  strokeWidth="1"
                  opacity="0.25"
                  fill="rgba(161,0,255,0.02)"
                />
                {/* Africa */}
                <path
                  d="M460,230 Q470,225 480,230 Q490,235 500,240 Q510,245 520,250 Q530,260 535,275 Q538,290 535,305 Q530,320 525,335 Q518,350 510,360 Q505,370 498,375 Q490,380 480,375 Q470,368 462,358 Q455,345 450,330 Q445,315 442,300 Q440,285 442,270 Q445,255 450,245 Z"
                  stroke="#A100FF"
                  strokeWidth="1"
                  opacity="0.25"
                  fill="rgba(161,0,255,0.02)"
                />
              </svg>

              {/* Office location dots */}
              {offices.map((office, i) => (
                <motion.div
                  key={office.region}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                  className="absolute group/dot"
                  style={{ top: office.top, left: office.left }}
                >
                  {/* Ping animation */}
                  <span className="absolute -inset-3 animate-ping rounded-full bg-[#A100FF] opacity-20" />
                  <span className="absolute -inset-2 rounded-full bg-[#A100FF] opacity-10" />
                  {/* Dot */}
                  <span className="relative block w-3 h-3 rounded-full bg-[#A100FF] border-2 border-black shadow-[0_0_12px_rgba(161,0,255,0.6)]" />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                    <div className="glass-panel px-4 py-3 text-center whitespace-nowrap">
                      <div className="text-[#A100FF] font-mono text-[10px] tracking-widest mb-1">
                        [{office.region}]
                      </div>
                      <div className="text-white text-sm font-semibold">
                        {office.city}, {office.country}
                      </div>
                      <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">
                        {office.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Office cards below map */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-8">
              {offices.map((office, i) => (
                <motion.div
                  key={office.region}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-4 text-center hover:border-[rgba(161,0,255,0.25)] transition-colors duration-300"
                >
                  <div className="text-[#A100FF] font-mono text-xs tracking-[0.2em] mb-2">
                    [{office.region}]
                  </div>
                  <div className="text-white text-sm font-semibold">
                    {office.city}
                  </div>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mt-1">
                    {office.country}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. ENDURING PARTNERSHIPS                                      */}
      {/* ============================================================ */}
      <section className="py-24 bg-[rgba(161,0,255,0.01)] border-t border-[rgba(161,0,255,0.06)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-10 md:p-14 holo-shimmer relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#A100FF] to-transparent" />
            <span className="text-[#A100FF] text-xs uppercase tracking-[0.2em] font-mono">
              // Our Promise
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-6">
              Building Enduring Partnerships
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              At A1 Technology, we are committed to building enduring partnerships
              founded on trust, collaboration, and a deep understanding of our
              clients&apos; evolving needs. We work closely with each organisation to
              design and implement solutions that address today&apos;s challenges while
              proactively anticipating future risks and opportunities — ensuring
              resilience, innovation, and growth in an ever-changing digital landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. CTA                                                        */}
      {/* ============================================================ */}
      <section className="relative py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(161,0,255,0.04)] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(161,0,255,0.08),transparent_60%)] blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#A100FF] text-xs uppercase tracking-[0.3em] font-mono">
              // Let&apos;s Connect
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mt-6 leading-tight">
              Ready to partner
              <br />
              <span className="neon-text">with the best?</span>
            </h2>
            <p className="text-gray-400 mt-6 text-lg max-w-xl mx-auto leading-relaxed">
              Join a growing list of global organisations that trust A1 Technology
              to secure and transform their digital infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#A100FF] hover:bg-[#8A00E0] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(161,0,255,0.3)]"
              >
                Get in Touch
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 border border-[rgba(161,0,255,0.3)] text-white font-semibold rounded-lg hover:bg-[rgba(161,0,255,0.08)] transition-all duration-300"
              >
                Explore Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
