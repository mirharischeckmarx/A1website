import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT Solutions — Managed Services, Cloud, AI & Cybersecurity",
  description:
    "Enterprise IT solutions including managed services, IT consulting, cybersecurity, web & mobile development, cloud services, AI & automation, and custom software development.",
  openGraph: {
    title: "Enterprise IT Solutions | A1 Technology",
    description:
      "Full-stack IT solutions: managed services, cloud migration, AI automation, cybersecurity, and custom software development for enterprises.",
    url: "https://a1tecno.com/solutions",
  },
  alternates: { canonical: "https://a1tecno.com/solutions" },
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
