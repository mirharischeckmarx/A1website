import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Global Cybersecurity Leader Since 2020",
  description:
    "A1 Technology is a leading cybersecurity and IT solutions provider with offices in 5 countries. 30+ technology partners, 60+ projects delivered, and 24/7 SOC operations protecting enterprises worldwide.",
  openGraph: {
    title: "About A1 Technology — Global Cybersecurity Leader",
    description:
      "Leading cybersecurity firm with offices across India, UAE, South Africa, Kenya, and USA. 50+ enterprise clients protected with 24/7 SOC operations.",
    url: "https://a1tecno.com/about",
  },
  alternates: { canonical: "https://a1tecno.com/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
