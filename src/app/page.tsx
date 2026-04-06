"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, Suspense } from "react";
import Link from "next/link";
import HeroSection from "@/components/sections/HeroSection";
import dynamic from "next/dynamic";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";

const ThreatDashboard = dynamic(() => import("@/components/ui/ThreatDashboard"), { ssr: false, loading: () => null });
const NetworkGraph = dynamic(() => import("@/components/three/NetworkGraph"), { ssr: false, loading: () => null });

/* ── DATA ── */
const solutions = [
  { num: "01", title: "Network Security", desc: "Proactive threat intelligence. Advanced analysis. Attacks detected at source.", href: "/services/network-security-solutions", icon: "◆" },
  { num: "02", title: "Information Security", desc: "Modern encryption. Data classification. Automated risk management.", href: "/services/information-security-solutions", icon: "◈" },
  { num: "03", title: "Data Security", desc: "Advanced DLP. Classification. Full data governance and compliance.", href: "/services/data-security-solutions", icon: "⬡" },
  { num: "04", title: "Cloud Security", desc: "CASB. CNAPP. Zero-trust cloud across AWS, Azure, GCP.", href: "/services/cloud-security-solutions", icon: "⬢" },
  { num: "05", title: "Application Security", desc: "Secure SDLC to live environment. The primary target, hardened.", href: "/services/application-security-solutions", icon: "△" },
];

const capabilities = [
  { abbr: "DLP", name: "Data Loss Prevention", line: "Protect sensitive data from unauthorized access." },
  { abbr: "SIEM", name: "Security Information & Event Mgmt", line: "24/7 monitoring and protection." },
  { abbr: "SOAR", name: "Security Orchestration & Automation", line: "Automated workflows. Faster responses." },
  { abbr: "XDR", name: "Extended Detection & Response", line: "Unified threat detection across all surfaces." },
  { abbr: "MSSP", name: "Managed Security Service Provider", line: "Customized security management." },
  { abbr: "NGFW", name: "Next-Gen Firewall", line: "Network protection from unauthorized access." },
];

const features = [
  { title: "Integrated Operations Center", desc: "Monitor incidents instantly. Respond with advanced threat hunting, SIEM, SOAR, and XDR.", href: "/services/managed-services" },
  { title: "Managed Security Services", desc: "24/7 monitoring, incident response, and compliance management across 5 global regions.", href: "/services/managed-services" },
  { title: "Proactive Threat Hunting", desc: "Our intelligence team neutralizes risks before they reach your environment.", href: "/services/network-security-assessment" },
];

const clients = [
  { quote: "A1 Technology transformed our security posture. Their SOC team detected threats we didn't know existed.", name: "Chief Information Security Officer", company: "Fortune 500 Bank" },
  { quote: "The zero-trust implementation was flawless. 78 days, 50,000 users, passed compliance on first attempt.", name: "Director of IT Security", company: "Government Agency" },
  { quote: "Their managed services freed our team to focus on innovation while they handled the threat landscape.", name: "VP of Engineering", company: "Healthcare Network" },
  { quote: "The penetration testing uncovered critical vulnerabilities our previous vendor missed entirely.", name: "Head of Cybersecurity", company: "Enterprise SaaS" },
];

export default function Home() {
  const purposeRef = useRef(null);
  const { scrollYProgress: purposeProgress } = useScroll({ target: purposeRef, offset: ["start end", "end start"] });
  const purposeY = useTransform(purposeProgress, [0, 1], [80, -80]);

  return (
    <>
      <HeroSection />

      {/* ═══════════════════════════════════════════════════════
          SECTION: OUR PURPOSE
          Inspired by Dribbble — asymmetric layout with floating stats
      ═══════════════════════════════════════════════════════ */}
      <section ref={purposeRef} className="relative py-32 overflow-hidden bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left — floating stat card + 3D viz */}
            <motion.div
              style={{ y: purposeY }}
              className="lg:col-span-5 relative"
            >
              {/* 3D Network Viz */}
              <div className="relative h-[400px] rounded-3xl overflow-hidden border border-white/5 bg-[#0a0a0a]">
                <Suspense fallback={null}>
                  <NetworkGraph />
                </Suspense>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />

                {/* Floating score badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute top-6 left-6 z-20"
                >
                  <div className="w-20 h-20 rounded-full border-[3px] border-[#A100FF] flex items-center justify-center bg-black/80 backdrop-blur-xl">
                    <div className="text-center">
                      <span className="text-white text-2xl font-bold block leading-none">98</span>
                      <span className="text-[#A100FF] text-[8px] uppercase tracking-wider">Score</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating metric badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-6 right-6 z-20 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#A100FF] animate-pulse" />
                    <div>
                      <span className="text-white text-sm font-semibold block">2,847 Threats</span>
                      <span className="text-[#616160] text-[10px]">Neutralized today</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right — text content */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[#A100FF] text-[11px] uppercase tracking-[0.25em] font-medium">Our Purpose</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mt-4 leading-[1.05] tracking-tight">
                  Building Cyber
                  <br />
                  <span className="text-[#A100FF]">Resilience</span> Globally
                </h2>
                <p className="text-[#A2A2A0] text-base md:text-lg mt-6 leading-relaxed max-w-xl">
                  Since 2020, A1 Technology has been the foremost IT and cybersecurity
                  solutions provider — empowering enterprises with tailor-made
                  security across the evolving digital landscape.
                </p>
                <div className="mt-8 space-y-4">
                  {[
                    "Direct access to certified engineers — no barriers, no scripts",
                    "Best-of-breed solutions through world-leading vendor partnerships",
                    "24/7 mission-critical support by our global team across 5 countries",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full border border-[#A100FF] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[#A100FF] text-[10px]">✓</span>
                      </span>
                      <span className="text-white/80 text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 mt-8 text-[#A100FF] text-sm font-medium hover:gap-3 transition-all group"
                >
                  Learn more about us
                  <span className="w-6 h-6 rounded-full bg-[#A100FF] flex items-center justify-center group-hover:bg-[#7500C0] transition-colors">
                    <span className="text-white text-xs">&gt;</span>
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION: SOLUTIONS — Stacked diagonal cards
      ═══════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden bg-black">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20" style={{ background: "radial-gradient(circle, rgba(161,0,255,0.3) 0%, transparent 60%)", filter: "blur(80px)" }} />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeading
            tag="Solutions"
            title="Redefine Security"
            description="Five integrated domains. Every attack vector covered."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-12">
            {solutions.map((sol, i) => (
              <motion.div
                key={sol.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={sol.href} className="block group">
                  <div className="relative bg-[#0a0a0a] border border-white/[0.04] hover:border-[rgba(161,0,255,0.3)] p-6 h-full transition-all duration-500 overflow-hidden rounded-2xl">
                    {/* Top glow on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#A100FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Radial glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(161,0,255,0.04)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <span className="text-[#A100FF] text-3xl opacity-30 block mb-4">{sol.icon}</span>
                    <span className="text-[#616160] text-xs font-mono">{sol.num}</span>
                    <h3 className="text-white text-lg font-semibold mt-1 mb-3 group-hover:text-[#A100FF] transition-colors">{sol.title}</h3>
                    <p className="text-[#616160] text-xs leading-relaxed">{sol.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-[#A100FF] text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <span>&gt;</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION: FEATURES — 3 cards with diagonal accent
      ═══════════════════════════════════════════════════════ */}
      <section className="py-32 border-y border-white/[0.03] bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeading
            tag="Services"
            title="Empower Your Security Posture"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Link href={feat.href} className="block group h-full">
                  <div className="relative bg-[#0a0a0a] border border-white/[0.04] hover:border-[rgba(161,0,255,0.25)] rounded-2xl p-8 h-full transition-all duration-500 overflow-hidden">
                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#A100FF] rotate-45 translate-x-12 -translate-y-12 opacity-[0.07] group-hover:opacity-[0.15] transition-opacity" />
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[rgba(161,0,255,0.08)] border border-[rgba(161,0,255,0.15)] flex items-center justify-center mb-5">
                      <span className="text-[#A100FF] text-sm font-bold">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-[#A100FF] transition-colors">{feat.title}</h3>
                    <p className="text-[#A2A2A0] text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION: CAPABILITIES — Horizontal scroll strip
      ═══════════════════════════════════════════════════════ */}
      <section className="py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeading
            tag="Technologies"
            title="Proactive Defense Arsenal"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-12">
            {capabilities.map((cap, i) => (
              <GlassCard key={cap.abbr} delay={i * 0.06} className="rounded-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[rgba(161,0,255,0.06)] border border-[rgba(161,0,255,0.12)] flex items-center justify-center mb-3">
                    <span className="text-[#A100FF] font-mono font-bold text-sm">{cap.abbr}</span>
                  </div>
                  <h4 className="text-white text-xs font-semibold mb-1">{cap.name}</h4>
                  <p className="text-[#616160] text-[10px] leading-relaxed">{cap.line}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION: LIVE THREAT INTELLIGENCE
      ═══════════════════════════════════════════════════════ */}
      <section className="py-32 border-y border-white/[0.03] relative overflow-hidden bg-black">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-15" style={{ background: "radial-gradient(circle, rgba(161,0,255,0.4) 0%, transparent 60%)", filter: "blur(80px)" }} />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#A100FF] text-[11px] uppercase tracking-[0.25em] font-medium">Real-Time Defense</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-white mt-4 leading-[1.05] tracking-tight">
                Live Threat
                <br />
                <span className="text-[#A100FF]">Intelligence</span>
              </h2>
              <p className="text-[#A2A2A0] mt-6 max-w-md leading-relaxed">
                Monitoring millions of endpoints. Neutralizing threats in
                milliseconds. Our fully integrated operations center never sleeps.
              </p>
              <div className="flex gap-8 mt-8">
                {[
                  { val: "24/7", lab: "Monitoring" },
                  { val: "<30s", lab: "Response" },
                  { val: "99.99%", lab: "Uptime" },
                ].map((s) => (
                  <div key={s.lab}>
                    <span className="text-[#A100FF] text-2xl font-semibold block">{s.val}</span>
                    <span className="text-[#616160] text-[10px] uppercase tracking-wider">{s.lab}</span>
                  </div>
                ))}
              </div>
            </div>
            <Suspense fallback={null}>
              <ThreatDashboard />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION: TESTIMONIALS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-32 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeading
            tag="Testimonials"
            title="What Our Clients Say"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
            {clients.map((client, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0a0a0a] border border-white/[0.04] rounded-2xl p-8 hover:border-[rgba(161,0,255,0.15)] transition-all duration-500"
              >
                <p className="text-white/70 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{client.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(161,0,255,0.1)] border border-[rgba(161,0,255,0.2)] flex items-center justify-center">
                    <span className="text-[#A100FF] text-xs font-bold">{client.company.charAt(0)}</span>
                  </div>
                  <div>
                    <span className="text-white text-sm font-medium block">{client.name}</span>
                    <span className="text-[#616160] text-xs">{client.company}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION: CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden bg-black">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(161,0,255,0.06) 0%, transparent 50%)" }} />

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#A100FF] text-[11px] uppercase tracking-[0.25em] font-medium">Get Started</span>
            <h2 className="text-4xl md:text-6xl font-semibold text-white mt-4 leading-[1.05] tracking-tight">
              Ready to Redefine
              <br />
              Your <span className="text-[#A100FF]">Security</span>?
            </h2>
            <p className="text-[#A2A2A0] mt-6 max-w-lg mx-auto">
              Connect with our experts. Get a custom security assessment
              and start protecting what matters most.
            </p>
            <div className="flex justify-center gap-4 mt-10">
              <Link href="/contact" className="cyber-btn cyber-btn-filled">Talk to Us</Link>
              <Link href="/services" className="cyber-btn">View Services</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
