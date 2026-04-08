import type { Metadata } from "next";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Contact Us — Global Offices in 5 Countries",
  description:
    "Get in touch with A1 Technology for cybersecurity consultations, IT solutions, and enterprise security assessments. Offices in Noida, Dubai, Centurion, Nairobi, and Boston.",
  openGraph: {
    title: "Contact A1 Technology — Global Cybersecurity Experts",
    description:
      "Reach our cybersecurity experts across 5 global offices. 24/7 support available for enterprise security needs.",
    url: "https://a1tecno.com/contact",
  },
  alternates: { canonical: "https://a1tecno.com/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocalBusinessJsonLd />
      {children}
    </>
  );
}
