import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology Partners — AWS, Azure, GCP, CrowdStrike & 40+ Partners",
  description:
    "A1 Technology partners with 40+ industry leaders including AWS, Google Cloud, Microsoft Azure, Salesforce, CrowdStrike, Fortinet, Palo Alto Networks, and Check Point for best-in-class security.",
  openGraph: {
    title: "Technology Partners | A1 Technology",
    description:
      "40+ technology partnerships with AWS, Azure, GCP, CrowdStrike, Fortinet, and more. Best-in-class security stack for enterprise protection.",
    url: "https://a1tecno.com/technology",
  },
  alternates: { canonical: "https://a1tecno.com/technology" },
};

export default function TechnologyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
