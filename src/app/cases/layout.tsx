import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies — Real-World Cybersecurity Success Stories",
  description:
    "See how A1 Technology deployed ransomware defense for banking enterprises, executed zero-trust migration for government organizations, and built compliance-ready security for healthcare networks.",
  openGraph: {
    title: "Cybersecurity Case Studies | A1 Technology",
    description:
      "Proven results: ransomware defense, zero-trust architecture, and healthcare compliance. Real-world success stories from banking, government, and healthcare sectors.",
    url: "https://a1tecno.com/cases",
  },
  alternates: { canonical: "https://a1tecno.com/cases" },
};

export default function CasesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
