import type { Metadata } from "next";
import ServiceDetailLayout from "@/components/sections/ServiceDetailLayout";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Network Security Assessment — VAPT, Wireless & Architecture Review",
  description:
    "Professional network security assessments: penetration testing (VAPT), wireless security, architecture review, server hardening, Active Directory audits, and CIS/NIST compliance.",
  openGraph: {
    title: "Network Security Assessment | A1 Technology",
    description: "Offensive security assessments: VAPT, wireless testing, architecture review, and compliance-aligned server hardening.",
    url: "https://a1tecno.com/services/network-security-assessment",
  },
  alternates: { canonical: "https://a1tecno.com/services/network-security-assessment" },
};

export default function NetworkSecurityAssessmentPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Services", url: "/services" }, { name: "Network Security Assessment", url: "/services/network-security-assessment" }]} />
      <ServiceJsonLd name="Network Security Assessment" description="Professional VAPT, wireless security, architecture review, and CIS/NIST-aligned server hardening." url="/services/network-security-assessment" />
      <ServiceDetailLayout
      tag="// NETWORK SECURITY ASSESSMENT"
      title="Network Security Assessment"
      subtitle="VAPT / WIRELESS / ARCHITECTURE / HARDENING"
      description="Our offensive security team conducts thorough assessments of your network infrastructure — identifying vulnerabilities, misconfigurations, and attack paths before adversaries exploit them."
      visualization="network-security"
      subServices={[
        {
          title: "Vulnerability Assessment & Penetration Testing",
          description:
            "Comprehensive VAPT across internal and external network infrastructure using industry-standard methodologies (OWASP, NIST, PTES) to discover and validate exploitable weaknesses.",
          features: [
            "Internal and external network penetration testing",
            "Automated + manual vulnerability discovery",
            "Exploit validation and proof-of-concept",
            "Detailed remediation roadmap",
          ],
        },
        {
          title: "Wireless Network Security",
          description:
            "Assessment of wireless infrastructure including rogue access point detection, encryption strength analysis, and authentication bypass testing.",
          features: [
            "Rogue AP detection and evil twin testing",
            "WPA2/WPA3 encryption analysis",
            "Wireless IDS/IPS validation",
            "Guest network isolation review",
          ],
        },
        {
          title: "Network Appliance Configuration Review",
          description:
            "Deep-dive review of firewall rules, router ACLs, switch configurations, and load balancer settings to identify security gaps and compliance deviations.",
        },
        {
          title: "Network Architecture Review",
          description:
            "Holistic assessment of your network topology, segmentation strategy, traffic flows, and defense-in-depth architecture against current threat models.",
        },
        {
          title: "Telecom Network Security",
          description:
            "Specialized assessment for telecom infrastructure including SS7 vulnerability testing, VoIP security, and signaling protocol analysis.",
        },
        {
          title: "Server Hardening",
          description:
            "Security baseline assessment and hardening aligned with NIST, CIS Benchmarks, SOX, PCI-DSS, ISO 27001, HIPAA, and DISA STIG frameworks.",
          features: [
            "CIS Benchmark compliance scoring",
            "OS-level hardening (Linux/Windows)",
            "Patch management audit",
            "Privilege escalation path analysis",
          ],
        },
        {
          title: "Active Directory & VPN Review",
          description:
            "Assessment of Active Directory security posture including GPO review, Kerberos delegation analysis, trust relationship audit, and VPN configuration hardening.",
        },
      ]}
    />
    </>
  );
}
