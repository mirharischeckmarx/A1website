"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";

const solutions = [
  {
    icon: "⬡",
    title: "Network Security",
    description:
      "We continuously monitor your networks with proactive threat intelligence and advanced analysis methods, detect potential attacks at their source and quickly close security gaps.",
    href: "/services/network-security-solutions",
    cta: "Examine",
  },
  {
    icon: "◈",
    title: "Information Security",
    description:
      "We protect your data with modern encryption methods and data classification techniques, and strengthen your compliance with automated risk management processes.",
    href: "/services/information-security-solutions",
    cta: "Learn More",
  },
  {
    icon: "⬢",
    title: "Data Security",
    description:
      "We safeguard your sensitive data with advanced DLP, classification, and encryption solutions. Ensure regulatory compliance and full data governance across your organization.",
    href: "/services/data-security-solutions",
    cta: "Explore",
  },
  {
    icon: "◇",
    title: "Cloud Security",
    description:
      "Cloud infrastructures provide advantages to businesses with their dynamic and scalable systems. Securely manage all cloud environments with A1 Technology manageable cloud security services.",
    href: "/services/cloud-security-solutions",
    cta: "Explore Services",
  },
  {
    icon: "△",
    title: "Application Security",
    description:
      "Applications are important for business continuity and are also the primary target of cyber attacks. Secure all processes from the software development lifecycle to the live environment.",
    href: "/services/application-security-solutions",
    cta: "Discover",
  },
];

const capabilities = [
  {
    abbr: "DLP",
    title: "Data Loss Prevention",
    description: "Protect your sensitive data from unauthorized access.",
  },
  {
    abbr: "SIEM",
    title: "Security Information & Event Management",
    description: "We monitor and protect your systems 24/7.",
  },
  {
    abbr: "MSSP",
    title: "Managed Security Service Provider",
    description: "We manage your security with customized solutions.",
  },
  {
    abbr: "SOAR",
    title: "Security Orchestration & Automation",
    description: "We automate workflows for faster responses.",
  },
  {
    abbr: "NGFW",
    title: "Next-Gen Firewall",
    description: "Protect your network from unauthorized access.",
  },
];

export default function ServicesOverview() {
  return (
    <>
      {/* Solutions Overview */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// REDEFINE SECURITY"
            title="Overcome the Traditional Understanding of Security"
            description="Five integrated security domains engineered to neutralize threats across every layer of your digital ecosystem."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {solutions.map((item, i) => (
              <GlassCard key={item.title} delay={i * 0.1}>
                <div className="text-2xl mb-3 text-[#A100FF] opacity-60">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-[#A100FF] text-xs font-semibold uppercase tracking-wider hover:gap-2 transition-all"
                >
                  {item.cta}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-24 bg-[rgba(161,0,255,0.01)] border-y border-[rgba(161,0,255,0.06)]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// CORE TECHNOLOGIES"
            title="For Proactive Defense Against Cyber Threats"
            description="Innovative. Meet our services."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {capabilities.map((cap, i) => (
              <GlassCard key={cap.abbr} delay={i * 0.08}>
                <div className="w-12 h-12 flex items-center justify-center border border-[rgba(161,0,255,0.2)] bg-[rgba(161,0,255,0.03)] mb-4">
                  <span className="text-[#A100FF] font-mono font-bold text-sm">
                    {cap.abbr}
                  </span>
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{cap.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {cap.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
