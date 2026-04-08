"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

/* ── 3 Feature Cards (Operations Center / Managed / Threat Hunting) ── */
const featureCards = [
  {
    icon: "⬡",
    title: "Fully Integrated Operations Center",
    description:
      "Monitor security incidents in real time and respond instantly with advanced threat hunting, powered by integrated SIEM, SOAR, and XDR platforms.",
    cta: "Discover",
    href: "/services/managed-services",
  },
  {
    icon: "◈",
    title: "Managed Security Services",
    description:
      "Outsource your security operations to our expert team. 24/7 monitoring, incident response, and compliance management across 5 global regions.",
    cta: "Discover",
    href: "/services/managed-services",
  },
  {
    icon: "△",
    title: "Proactive Threat Hunting & Compliance",
    description:
      "Our threat intelligence team identifies and neutralizes risks before they reach your environment. Continuous compliance monitoring for every framework.",
    cta: "Discover",
    href: "/services/network-security-assessment",
  },
];

/* ── 5 Solution Categories ── */
const solutionCategories = [
  {
    title: "Network Security",
    slug: "network-security-solutions",
    description:
      "We continuously monitor your networks with proactive threat intelligence and advanced analysis methods, detect potential attacks at their source and swiftly close security gaps.",
    cta: "Examine",
  },
  {
    title: "Information Security",
    slug: "information-security-solutions",
    description:
      "We protect your data with modern encryption methods and data classification techniques, and strengthen your compliance with automated risk management processes.",
    cta: "Learn More",
  },
  {
    title: "Data Security",
    slug: "data-security-solutions",
    description:
      "We safeguard your sensitive data with advanced DLP, classification, and encryption solutions. Ensure regulatory compliance and full data governance across your organization.",
    cta: "Explore",
  },
  {
    title: "Cloud Security",
    slug: "cloud-security-solutions",
    description:
      "Securely manage all cloud environments with our manageable cloud security services — from CASB and CNAPP to zero-trust cloud architectures across AWS, Azure, and GCP.",
    cta: "Explore Services",
  },
  {
    title: "Application Security",
    slug: "application-security-solutions",
    description:
      "Secure all processes from the software development lifecycle to the live environment. Applications are the primary target — we make them the strongest link.",
    cta: "Discover",
  },
];

/* ── 6 Capability Boxes ── */
const capabilities = [
  {
    abbr: "DLP",
    title: "Data Loss Prevention",
    description: "Protect sensitive data from unauthorized access, exfiltration, and insider threats across endpoints and cloud.",
  },
  {
    abbr: "SIEM",
    title: "Security Information & Event Management",
    description: "We monitor and protect your systems 24/7 with next-gen correlation engines and AI-powered anomaly detection.",
  },
  {
    abbr: "MSSP",
    title: "Managed Security Service Provider",
    description: "We manage your security with customized solutions, freeing your internal teams to focus on core business.",
  },
  {
    abbr: "SOAR",
    title: "Security Orchestration & Automation",
    description: "Automated workflows for faster incident response — orchestrate multi-vendor tools, automate playbooks, and accelerate resolution.",
  },
  {
    abbr: "NGFW",
    title: "Next-Gen Firewall",
    description: "Protect your network from unauthorized access with deep packet inspection, IPS, and application-layer filtering.",
  },
  {
    abbr: "XDR",
    title: "Extended Detection & Response",
    description: "Unified threat detection across endpoints, network, cloud, and email — correlating signals into actionable intelligence.",
  },
];

/* ── Services Navigation (detail pages) ── */
const servicePages = [
  { title: "Managed Services", href: "/services/managed-services" },
  { title: "Network Security Assessment", href: "/services/network-security-assessment" },
  { title: "Quality Technology Services", href: "/services/quality-technology-services" },
  { title: "Application Security Assessment", href: "/services/application-security-assessment" },
  { title: "SAP & IoT Security Assessment", href: "/services/sap-iot-security-assessment" },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden cyber-grid">
        <ParticleField density={0.4} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black z-[1]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#A100FF] text-xs uppercase tracking-[0.3em] font-mono">
              // SERVICES & SOLUTIONS
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mt-4 leading-tight">
              Your Shield Against
              <br />
              <span className="neon-text">Cyber Threats</span>
            </h1>
            <p className="text-gray-400 mt-6 max-w-2xl text-lg leading-relaxed">
              No gaps. No guesswork. Security that works. We protect your
              applications, network, cloud, and infrastructure with
              military-grade precision.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/contact" className="cyber-btn cyber-btn-filled">
                Get in Touch
              </Link>
              <Link href="#solutions" className="cyber-btn">
                Explore Solutions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3 Feature Cards ── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-32 relative z-20">
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              >
                <Link href={card.href} className="block h-full">
                  <div className="glass-panel p-8 h-full hover:border-[rgba(161,0,255,0.4)] transition-all duration-300 group relative overflow-hidden">
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[rgba(161,0,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="text-3xl mb-5 text-[#A100FF] opacity-60">
                        {card.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#A100FF] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        {card.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[#A100FF] text-sm font-semibold uppercase tracking-wider">
                        {card.cta}
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 Solution Categories ── */}
      <section id="solutions" className="py-24 bg-[rgba(161,0,255,0.01)] border-y border-[rgba(161,0,255,0.06)]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// REDEFINE SECURITY"
            title="Overcome Traditional Security. Build Cyber Resilience."
            description="Five integrated security domains engineered to neutralize threats across every layer of your digital ecosystem."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {solutionCategories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/services/${cat.slug}`} className="block h-full">
                  <div className="glass-panel p-6 h-full flex flex-col hover:border-[rgba(161,0,255,0.4)] transition-all duration-300 group relative overflow-hidden">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#A100FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <span className="text-[#A100FF] font-mono text-xs mb-3">
                      0{i + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#A100FF] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed flex-1 mb-4">
                      {cat.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[#A100FF] text-xs font-semibold uppercase tracking-wider mt-auto">
                      {cat.cta}
                      <svg
                        className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 Capability Boxes ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// CORE TECHNOLOGIES"
            title="For Proactive Defense Against Cyber Threats"
            description="Innovative security technologies powering the cybersecurity solutions of the future."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <GlassCard key={cap.abbr} delay={i * 0.08}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-14 h-14 flex items-center justify-center border border-[rgba(161,0,255,0.2)] bg-[rgba(161,0,255,0.03)]">
                    <span className="text-[#A100FF] font-mono font-bold text-sm">
                      {cap.abbr}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">{cap.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Detail Pages Navigation ── */}
      <section className="py-24 bg-[rgba(161,0,255,0.01)] border-y border-[rgba(161,0,255,0.06)]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// ASSESSMENTS & SERVICES"
            title="Specialized Security Services"
            description="Deep-dive service categories with dedicated assessment teams and proven methodologies."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {servicePages.map((page, i) => (
              <motion.div
                key={page.href}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={page.href} className="block">
                  <div className="glass-panel p-6 hover:border-[rgba(161,0,255,0.4)] transition-all duration-300 group flex items-center justify-between">
                    <h3 className="text-white font-semibold group-hover:text-[#A100FF] transition-colors">
                      {page.title}
                    </h3>
                    <svg
                      className="w-5 h-5 text-gray-600 group-hover:text-[#A100FF] group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-12 holo-shimmer relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                For the Cybersecurity Solutions of the Future
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Trust A1 Technology. Let our experts architect a security
                posture that evolves as fast as the threats you face.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="cyber-btn cyber-btn-filled">
                  Contact Now
                </Link>
                <Link href="/cases" className="cyber-btn">
                  View Case Studies
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
