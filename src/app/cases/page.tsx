"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

const caseStudies = [
  {
    title: "Banking Enterprise — Ransomware Defense Deployment",
    industry: "Financial Services",
    scenario:
      "A major banking enterprise faced escalating ransomware threats across their distributed infrastructure. Legacy signature-based detection was failing against evolving attack variants, and incident response relied on manual workflows.",
    before: {
      label: "Before A1 Technology",
      stats: [
        "Slow detection relying on legacy tools",
        "Manual, uncoordinated incident response",
        "Multiple security tool silos",
        "No unified threat visibility",
      ],
    },
    after: {
      label: "After A1 Technology",
      stats: [
        "Real-time threat detection via SIEM/SOAR",
        "Automated containment playbooks",
        "Unified security operations center",
        "Continuous 24/7 monitoring",
      ],
    },
    roi: "Dramatically reduced detection-to-response time. Achieved unified visibility and automated incident workflows across all banking operations.",
  },
  {
    title: "Government Organization — Zero Trust Architecture",
    industry: "Government & Defense",
    scenario:
      "A government organization needed to migrate from perimeter-based security to a zero-trust architecture across their network to meet evolving compliance mandates and enable secure remote access for their workforce.",
    before: {
      label: "Before A1 Technology",
      stats: [
        "Perimeter-based legacy security model",
        "VPN-only remote access",
        "No identity verification at application layer",
        "Compliance gaps in multiple frameworks",
      ],
    },
    after: {
      label: "After A1 Technology",
      stats: [
        "Full zero-trust architecture deployed",
        "SASE-based secure access for all users",
        "Continuous identity validation",
        "Compliance achieved across required frameworks",
      ],
    },
    roi: "Successful zero-trust migration completed on schedule. Passed compliance audits and significantly reduced access-related security incidents.",
  },
  {
    title: "Healthcare Network — Compliance & Security Overhaul",
    industry: "Healthcare",
    scenario:
      "A large healthcare network with multiple facilities needed a comprehensive security overhaul to address regulatory compliance gaps, fragmented security tooling, and lack of centralized threat visibility across their entire operation.",
    before: {
      label: "Before A1 Technology",
      stats: [
        "Fragmented, disconnected security tools",
        "No centralized visibility or monitoring",
        "Compliance gaps across facilities",
        "Uncoordinated incident response",
      ],
    },
    after: {
      label: "After A1 Technology",
      stats: [
        "Unified security platform across all facilities",
        "24/7 SOC monitoring and incident response",
        "Full regulatory compliance achieved",
        "Centralized threat intelligence and reporting",
      ],
    },
    roi: "Achieved continuous compliance across all facilities. Unified security operations and established proactive threat monitoring organization-wide.",
  },
];

export default function CasesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden cyber-grid">
        <ParticleField density={0.3} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black z-[1]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[#A100FF] text-xs uppercase tracking-[0.3em] font-mono">
              // CASE STUDIES
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mt-4">
              Proven in
              <br />
              <span className="neon-text">Battle</span>
            </h1>
            <p className="text-gray-400 mt-6 max-w-xl text-lg">
              Real scenarios. Real threats. Real results. See how A1 Technology
              protects the world&apos;s most critical organizations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#A100FF] font-mono text-sm">
                    CASE 0{i + 1}
                  </span>
                  <span className="text-[10px] px-2 py-1 border border-[rgba(161,0,255,0.2)] text-[#A100FF] font-mono uppercase tracking-wider">
                    {cs.industry}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {cs.title}
                </h2>
              </div>

              {/* Scenario */}
              <GlassCard hover={false} className="mb-8">
                <h4 className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-3 font-mono">
                  Scenario
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  {cs.scenario}
                </p>
              </GlassCard>

              {/* Before / After */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 border-red-500/20">
                  <h4 className="text-red-400 text-xs uppercase tracking-[0.2em] mb-4 font-mono font-semibold">
                    {cs.before.label}
                  </h4>
                  <div className="space-y-3">
                    {cs.before.stats.map((stat) => (
                      <div
                        key={stat}
                        className="flex items-center gap-2 text-sm text-gray-400"
                      >
                        <span className="text-red-500">✕</span>
                        {stat}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-6 border-[rgba(161,0,255,0.2)]">
                  <h4 className="text-[#A100FF] text-xs uppercase tracking-[0.2em] mb-4 font-mono font-semibold">
                    {cs.after.label}
                  </h4>
                  <div className="space-y-3">
                    {cs.after.stats.map((stat) => (
                      <div
                        key={stat}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <span className="text-[#A100FF]">✓</span>
                        {stat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ROI */}
              <div className="glass-panel-sm p-4 holo-shimmer">
                <div className="flex items-center gap-3">
                  <span className="text-[#A100FF] text-xs font-mono font-bold uppercase tracking-wider">
                    Impact:
                  </span>
                  <span className="text-gray-300 text-sm">{cs.roi}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
