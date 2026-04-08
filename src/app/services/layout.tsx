import type { Metadata } from "next";
import { FAQJsonLd } from "@/components/seo/JsonLd";

const serviceFaqs = [
  {
    question: "What cybersecurity services does A1 Technology offer?",
    answer: "A1 Technology provides comprehensive cybersecurity services including network security solutions, cloud security (AWS/Azure/GCP), application security testing, data loss prevention, SIEM/SOAR implementation, managed SOC operations, penetration testing, and zero trust architecture deployment.",
  },
  {
    question: "Does A1 Technology offer 24/7 security monitoring?",
    answer: "Yes, A1 Technology operates a 24/7 Security Operations Center (SOC) with real-time threat monitoring, rapid incident response, and high-availability managed security services across all supported regions.",
  },
  {
    question: "What industries does A1 Technology serve?",
    answer: "A1 Technology serves enterprises across financial services, government and defense, healthcare, technology, and telecommunications sectors with tailored cybersecurity solutions meeting industry-specific compliance requirements like PCI-DSS, HIPAA, SOC 2, and ISO 27001.",
  },
  {
    question: "Where are A1 Technology offices located?",
    answer: "A1 Technology has global offices in Noida (India - HQ), Dubai (UAE), Centurion (South Africa), Nairobi (Kenya), and Boston (USA), providing cybersecurity services across 5 countries.",
  },
];

export const metadata: Metadata = {
  title: "Cybersecurity Services — Network, Cloud, Application & Data Security",
  description:
    "Comprehensive cybersecurity services including network security, cloud security (AWS/Azure/GCP), application security, data loss prevention, SIEM, SOC, and managed security services for enterprises.",
  openGraph: {
    title: "Enterprise Cybersecurity Services | A1 Technology",
    description:
      "Full-spectrum cybersecurity: network protection, cloud security, application security, DLP, SIEM, SOAR, and 24/7 managed SOC services.",
    url: "https://a1tecno.com/services",
  },
  alternates: { canonical: "https://a1tecno.com/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQJsonLd faqs={serviceFaqs} />
      {children}
    </>
  );
}
