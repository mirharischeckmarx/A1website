import type { Metadata } from "next";
import ServiceDetailLayout from "@/components/sections/ServiceDetailLayout";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Information Security Solutions — SIEM, SOAR, UBA & AI Threat Hunting",
  description:
    "Information security solutions: next-gen SIEM, SOAR automation, user behavior analytics, cyber risk scoring, enterprise encryption, and AI-powered threat hunting services.",
  openGraph: {
    title: "Information Security Solutions | A1 Technology",
    description: "Advanced InfoSec: SIEM, SOAR orchestration, UBA, encryption, and AI-driven threat hunting for enterprise protection.",
    url: "https://a1tecno.com/services/information-security-solutions",
  },
  alternates: { canonical: "https://a1tecno.com/services/information-security-solutions" },
};

export default function InformationSecuritySolutionsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Services", url: "/services" }, { name: "Information Security Solutions", url: "/services/information-security-solutions" }]} />
      <ServiceJsonLd name="Information Security Solutions" description="Next-gen SIEM, SOAR orchestration, UBA, encryption, and AI-driven threat hunting." url="/services/information-security-solutions" />
      <ServiceDetailLayout
      tag="// INFORMATION SECURITY SOLUTIONS"
      title="Information Security Solutions"
      subtitle="SIEM / SOAR / UBA / ENCRYPTION / AI HUNTING"
      description="We protect your data with modern encryption methods and data classification techniques, and strengthen your compliance with automated risk management processes."
      visualization="info-security"
      subServices={[
        {
          title: "Security Information & Event Management (SIEM)",
          description:
            "Next-generation SIEM deployment with real-time log correlation, ML-powered anomaly detection, and automated alert triaging that processes billions of events daily.",
          features: [
            "Real-time log ingestion and correlation",
            "ML-powered anomaly detection and baselining",
            "Custom detection rules and use case library",
            "Automated alert triage and false-positive reduction",
          ],
        },
        {
          title: "Security Automation Solution (SOAR)",
          description:
            "Orchestration and automation platform that connects your security stack, automates repetitive workflows, and accelerates incident response from hours to seconds.",
          features: [
            "Pre-built playbooks for common incident types",
            "Multi-vendor tool integration and orchestration",
            "Automated enrichment and threat intelligence lookup",
            "Case management and collaboration workflows",
          ],
        },
        {
          title: "Security Configuration & Compliance",
          description:
            "Continuous security configuration monitoring and compliance assessment against industry frameworks including CIS, NIST, ISO 27001, PCI-DSS, and HIPAA.",
        },
        {
          title: "User Behavior Analytics (UBA)",
          description:
            "ML-driven user and entity behavior analytics that establish baselines, detect anomalous activity, and identify insider threats and compromised accounts in real time.",
        },
        {
          title: "Enterprise Security Operations & Orchestration",
          description:
            "Unified security operations platform that consolidates alerts, automates workflows, and provides executive dashboards across your entire security ecosystem.",
        },
        {
          title: "Cyber Risk Scoring",
          description:
            "Quantitative cyber risk assessment framework that translates technical vulnerabilities into business risk metrics for executive decision-making and board reporting.",
        },
        {
          title: "Encryption (Data and Device)",
          description:
            "Enterprise encryption solutions for data at rest, in transit, and in use — including full disk encryption, database encryption, and tokenization with centralized key management.",
        },
        {
          title: "AI-Powered Threat Hunting",
          description:
            "Proactive threat hunting powered by machine learning models that analyze network telemetry, endpoint behavior, and dark web intelligence to discover hidden threats.",
          features: [
            "Hypothesis-driven and ML-assisted hunting",
            "Dark web and threat intelligence integration",
            "Adversary TTP mapping to MITRE ATT&CK",
            "Continuous hunting-as-a-service model",
          ],
        },
      ]}
    />
    </>
  );
}
