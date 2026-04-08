import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DynamicBG from "@/components/ui/DynamicBGWrapper";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import SmartCTA from "@/components/ui/SmartCTA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://a1tecno.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "A1 Technology | Enterprise Cybersecurity & IT Solutions",
    template: "%s | A1 Technology",
  },
  description:
    "A1 Technology delivers enterprise-grade cybersecurity, cloud security, network protection, and digital transformation services across 5 countries. 24/7 SOC monitoring. 50+ clients secured. Your shield against cyber threats.",
  keywords: [
    "cybersecurity",
    "IT solutions",
    "cloud security",
    "network security",
    "data protection",
    "SIEM",
    "SOC",
    "managed security services",
    "penetration testing",
    "digital transformation",
    "A1 Technology",
    "enterprise security",
    "zero trust",
    "threat intelligence",
  ],
  authors: [{ name: "A1 Technology", url: SITE_URL }],
  creator: "A1 Technology",
  publisher: "A1 Technology",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "A1 Technology",
    title: "A1 Technology | Enterprise Cybersecurity & IT Solutions",
    description:
      "Enterprise-grade cybersecurity, cloud security, and digital transformation services. 24/7 SOC monitoring across 5 countries.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "A1 Technology - Your Shield Against Cyber Threats",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A1 Technology | Enterprise Cybersecurity & IT Solutions",
    description:
      "Enterprise-grade cybersecurity, cloud security, and digital transformation services. 24/7 SOC monitoring across 5 countries.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: SITE_URL },
  category: "technology",
};

function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "A1 Technology",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Enterprise-grade cybersecurity, IT solutions, cloud security, and digital transformation services.",
    foundingDate: "2020",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 50 },
    sameAs: [
      "https://www.linkedin.com/company/a1-technology/",
      "https://x.com/a1technology",
      "https://www.facebook.com/a1technology",
      "https://www.youtube.com/@a1technology",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-120-4365353",
        contactType: "sales",
        areaServed: ["IN", "AE", "ZA", "KE", "US"],
        availableLanguage: "English",
      },
    ],
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Platina Heights, A26, C Block Phase 2, Industrial Area, Sector 62",
        addressLocality: "Noida",
        addressRegion: "Uttar Pradesh",
        postalCode: "201309",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Rigga Business Centre - 1001",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "1 Landmarks Avenue, Kosmosdaal Ext 11, Samrand",
        addressLocality: "Centurion",
        addressRegion: "Gauteng",
        postalCode: "0157",
        addressCountry: "ZA",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Reliance Centre",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "224 Berkeley Street, 6th Floor",
        addressLocality: "Boston",
        addressRegion: "MA",
        postalCode: "02006",
        addressCountry: "US",
      },
    ],
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "South Africa" },
      { "@type": "Country", name: "Kenya" },
      { "@type": "Country", name: "United States" },
    ],
    knowsAbout: [
      "Cybersecurity",
      "Cloud Security",
      "Network Security",
      "Penetration Testing",
      "SIEM",
      "SOC",
      "Zero Trust Architecture",
      "Data Loss Prevention",
      "Managed Security Services",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "A1 Technology",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/services?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-black text-gray-200">
        <ScrollProgress />
        <Suspense fallback={null}>
          <DynamicBG />
        </Suspense>
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <BackToTop />
        <SmartCTA />
      </body>
    </html>
  );
}
