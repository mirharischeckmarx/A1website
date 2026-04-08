"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

/* ── Service Cards (8 cards like A1) ── */
const serviceCards = [
  {
    title: "Managed Services",
    description:
      "Free up your internal resources to focus on the business by letting us handle day-to-day support services, monitoring, and incident response.",
    href: "/services/managed-services",
  },
  {
    title: "IT Consulting & Advisory",
    description:
      "The right technology, implemented properly, appropriately managed and monitored, can lead to significant gains in growth and operational efficiency.",
    href: "/contact",
  },
  {
    title: "Cyber Security",
    description:
      "Our experts identify vulnerabilities, assess risks, and implement robust security measures to safeguard your systems, data, and digital assets.",
    href: "/services",
  },
  {
    title: "Web Development",
    description:
      "Our web development services help you establish an impactful online presence and reach your target audience effectively with modern stacks.",
    href: "/contact",
  },
  {
    title: "Mobile Development",
    description:
      "We create customized mobile apps that align with your brand and goals, with expertise across iOS, Android, and cross-platform frameworks.",
    href: "/contact",
  },
  {
    title: "Cloud Services",
    description:
      "With expertise in cloud technologies across AWS, Azure, and GCP, we help you find the right cloud solutions that meet your business goals.",
    href: "/services/cloud-security-solutions",
  },
  {
    title: "AI & Automation",
    description:
      "From generative AI adoption to intelligent automation — we help organizations harness AI for security, operations, and business transformation.",
    href: "/services/quality-technology-services",
  },
  {
    title: "Software Development",
    description:
      "From custom CRM to transportation management systems — we build enterprise-grade software with security baked in from day one.",
    href: "/contact",
  },
];

/* ── Solution Categories with interactive tabs ── */
const solutionTabs = [
  {
    id: "network",
    title: "Network Security",
    href: "/services/network-security-solutions",
    items: [
      "Network Security Management",
      "Anti-Ransomware Solutions",
      "DNS and DHCP Security & Address Management",
      "Vulnerability Management",
      "Endpoint Security Management",
      "Malware Analysis and Detection",
    ],
  },
  {
    id: "information",
    title: "Information Security",
    href: "/services/information-security-solutions",
    items: [
      "Security Information Event Management (SIEM)",
      "Security Automation Solution (SOAR)",
      "Security Configuration & Compliance",
      "User Behavior Analytics",
      "Enterprise Security Operations & Orchestration",
      "Cyber Risk Scoring",
      "Encryption — Data & Device",
      "AI-Powered Threat Hunting",
    ],
  },
  {
    id: "data",
    title: "Data Security",
    href: "/services/data-security-solutions",
    items: [
      "Configuration Management",
      "URL / Content Filtering & Gateway",
      "Data Classification Solution",
    ],
  },
  {
    id: "cloud",
    title: "Cloud Security",
    href: "/services/cloud-security-solutions",
    items: [
      "Cloud & Virtualization Security",
      "Cloud Access Security Broker (CASB)",
      "Cloud App Protection Platform (CNAPP)",
      "Identity and Access Management (IAM)",
      "Firewall — IPS / IDS",
      "Email Encryption & Web Security",
    ],
  },
  {
    id: "application",
    title: "Application Security",
    href: "/services/application-security-solutions",
    items: [
      "Cloud Security Assessment",
      "Source Code Audit",
      "Mobile Application Security",
      "Web Application Penetration Testing",
    ],
  },
];

/* ── Industry Solutions ── */
const industries = [
  {
    title: "Financial Services",
    icon: "◆",
    description:
      "PCI-DSS compliance, fraud detection, secure transaction monitoring, and zero-trust banking architecture for global financial institutions.",
    threats: ["Transaction fraud", "Account takeover", "Insider threats"],
  },
  {
    title: "Government & Defense",
    icon: "⬡",
    description:
      "Sovereign security operations, classified network protection, and nation-state threat defense for government agencies and defense contractors.",
    threats: ["APT campaigns", "Espionage", "Critical infrastructure"],
  },
  {
    title: "Healthcare",
    icon: "◈",
    description:
      "HIPAA-compliant security, medical device protection, patient data encryption, and telehealth security for hospitals and pharma enterprises.",
    threats: ["Ransomware", "PHI breaches", "Medical device exploits"],
  },
  {
    title: "Enterprise & Technology",
    icon: "⬢",
    description:
      "Cloud-native security, DevSecOps integration, IP protection, and supply chain security for technology companies at scale.",
    threats: ["Supply chain attacks", "IP theft", "Cloud misconfiguration"],
  },
];

/* ── Contact form options ── */
const supportTopics = [
  "Network Security",
  "Data Security",
  "Information Security",
  "Application Security",
  "Cloud Security",
  "General Requirement",
];

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState("network");
  const [formTopic, setFormTopic] = useState("");

  const activeTabData = solutionTabs.find((t) => t.id === activeTab)!;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden cyber-grid">
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
              Services &<br />
              <span className="neon-text">Solutions</span>
            </h1>
            <p className="text-gray-400 mt-6 max-w-2xl text-lg leading-relaxed">
              Take your company to new heights by investing in our reliable
              and efficient technology solutions. Comprehensive IT and
              cybersecurity services — from managed security operations to
              AI-powered threat defense.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/contact" className="cyber-btn cyber-btn-filled">
                Get in Touch
              </Link>
              <Link href="#solutions-tabs" className="cyber-btn">
                Explore Solutions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Intro Text ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Comprehensive IT Services for Enterprises
            </h2>
            <p className="text-gray-400 leading-relaxed">
              When we say comprehensive, we mean comprehensive. A1 Technology
              has the experience and expertise to provide end-to-end
              security across every sphere — from network perimeter to
              cloud workloads, from application code to user behavior. Your
              organization deserves a partner that covers every attack
              surface.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 8 Service Cards Grid ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// OUR SERVICES"
            title="Simplifying IT for a Complex World"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {serviceCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={card.href} className="block h-full">
                  <div className="glass-panel p-6 h-full flex flex-col hover:border-[rgba(161,0,255,0.4)] transition-all duration-300 group">
                    <span className="text-[#A100FF] font-mono text-xs mb-3">
                      0{i + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#A100FF] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                      {card.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[#A100FF] text-xs font-semibold uppercase tracking-wider mt-auto">
                      Learn more
                      <svg
                        className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose A1 Technology ── */}
      <section className="py-20 bg-[rgba(161,0,255,0.01)] border-y border-[rgba(161,0,255,0.06)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-10 holo-shimmer"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Why Choose Services from A1 Technology?
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              A1 Technology services provide businesses with an edge over the
              competition. Outsourced IT and security services improve
              efficiency, build trust with customers, and can be tailored to
              meet your specific goals — from growing enterprises to global organizations.
            </p>
            <Link href="/contact" className="cyber-btn cyber-btn-filled">
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Solution Categories — Interactive Tabs ── */}
      <section id="solutions-tabs" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// SECURITY SOLUTIONS"
            title="Solution Categories"
            description="Five integrated security domains — click each tab to explore."
          />

          {/* Tab navigation */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {solutionTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-all duration-300 ${
                  activeTab === tab.id
                    ? "border-[#A100FF] text-[#A100FF] bg-[rgba(161,0,255,0.08)] shadow-[0_0_15px_rgba(161,0,255,0.1)]"
                    : "border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {activeTabData.title} Solutions
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {activeTabData.items.length} solutions in this category
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeTabData.items.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-black/30 border border-gray-900 rounded hover:border-[rgba(161,0,255,0.2)] transition-colors"
                      >
                        <span className="text-[#A100FF] text-xs mt-0.5">▹</span>
                        <span className="text-gray-300 text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="shrink-0">
                  <Link
                    href={activeTabData.href}
                    className="cyber-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Industry Solutions ── */}
      <section className="py-24 bg-[rgba(161,0,255,0.01)] border-y border-[rgba(161,0,255,0.06)]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// BY INDUSTRY"
            title="Sector-Specific Protection"
            description="Deep domain expertise meets cutting-edge cyber defense."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industries.map((industry, i) => (
              <GlassCard key={industry.title} delay={i * 0.1}>
                <div className="text-3xl mb-4 text-[#A100FF] opacity-60">
                  {industry.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {industry.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {industry.description}
                </p>
                <div className="border-t border-gray-800 pt-4">
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                    Key Threats
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {industry.threats.map((threat) => (
                      <span
                        key={threat}
                        className="text-[10px] px-2 py-1 bg-red-500/5 border border-red-500/20 text-red-400 font-mono"
                      >
                        {threat}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading
            tag="// NEED MORE INFORMATION?"
            title="Get Expert Support"
            description="Fill out the form and our expert team will contact you as soon as possible."
          />
          <div className="glass-panel p-8">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-black/50 border border-gray-800 focus:border-[#A100FF] text-white px-4 py-3 text-sm font-mono outline-none transition-colors placeholder:text-gray-700"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-black/50 border border-gray-800 focus:border-[#A100FF] text-white px-4 py-3 text-sm font-mono outline-none transition-colors placeholder:text-gray-700"
                />
              </div>
              <select
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                className={`w-full bg-black/50 border border-gray-800 focus:border-[#A100FF] text-white px-4 py-3 text-sm font-mono outline-none transition-colors ${!formTopic ? "text-gray-700" : ""}`}
              >
                <option value="">What you want to get support about?</option>
                {supportTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Tell us about your requirements..."
                rows={4}
                className="w-full bg-black/50 border border-gray-800 focus:border-[#A100FF] text-white px-4 py-3 text-sm font-mono outline-none transition-colors placeholder:text-gray-700 resize-none"
              />
              <button type="submit" className="cyber-btn cyber-btn-filled">
                Send a Request
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
