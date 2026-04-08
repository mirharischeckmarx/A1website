import type { Metadata } from "next";
import ServiceDetailLayout from "@/components/sections/ServiceDetailLayout";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Network Security Solutions — Management, Anti-Ransomware & Endpoint Protection",
  description:
    "Enterprise network security solutions: network management, anti-ransomware defense, DNS/DHCP security, vulnerability management, endpoint protection, and advanced malware analysis.",
  openGraph: {
    title: "Network Security Solutions | A1 Technology",
    description: "Multi-layered network security: anti-ransomware, endpoint protection, vulnerability management, and 24/7 monitoring.",
    url: "https://a1tecno.com/services/network-security-solutions",
  },
  alternates: { canonical: "https://a1tecno.com/services/network-security-solutions" },
};

export default function NetworkSecuritySolutionsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Services", url: "/services" }, { name: "Network Security Solutions", url: "/services/network-security-solutions" }]} />
      <ServiceJsonLd name="Network Security Solutions" description="Enterprise network security with anti-ransomware, endpoint protection, vulnerability management, and 24/7 monitoring." url="/services/network-security-solutions" />
      <ServiceDetailLayout
      tag="// NETWORK SECURITY SOLUTIONS"
      title="Network Security Solutions"
      subtitle="MANAGEMENT / ANTI-RANSOMWARE / DNS / ENDPOINT / MALWARE"
      description="We continuously monitor your networks with proactive threat intelligence and advanced analysis methods, detect potential attacks at their source and swiftly close security gaps."
      visualization="network-security"
      subServices={[
        {
          title: "Network Security Management",
          description:
            "Centralized network security management with real-time visibility across all network segments, automated policy enforcement, and continuous compliance monitoring.",
          features: [
            "Centralized firewall and policy management",
            "Network traffic analysis and visualization",
            "Automated security policy enforcement",
            "Compliance-driven configuration baselines",
          ],
        },
        {
          title: "Anti-Ransomware Solutions",
          description:
            "Multi-layered ransomware defense combining behavioral detection, immutable backups, network micro-segmentation, and AI-powered early warning systems to stop ransomware before encryption.",
          features: [
            "Behavioral ransomware detection (pre-encryption)",
            "Immutable backup and rapid recovery",
            "Network micro-segmentation to limit lateral movement",
            "AI-driven early warning and quarantine",
          ],
        },
        {
          title: "DNS and DHCP Security & Address Management",
          description:
            "Secure DNS infrastructure with threat intelligence integration, DNS tunneling detection, DHCP snooping, and automated IP address management for enterprise networks.",
        },
        {
          title: "Vulnerability Management",
          description:
            "Continuous vulnerability scanning, risk-based prioritization, and automated patch management across all network assets with full compliance reporting.",
          features: [
            "Continuous asset discovery and scanning",
            "Risk-based vulnerability prioritization (CVSS + context)",
            "Automated patch deployment workflows",
            "Regulatory compliance reporting",
          ],
        },
        {
          title: "Endpoint Security Management",
          description:
            "Enterprise endpoint protection with EDR, application whitelisting, device control, and mobile threat defense across desktops, servers, and mobile devices.",
        },
        {
          title: "Malware Analysis and Detection",
          description:
            "Advanced malware analysis using sandboxing, static/dynamic analysis, and threat intelligence correlation to detect known and unknown malware variants in real time.",
        },
      ]}
    />
    </>
  );
}
