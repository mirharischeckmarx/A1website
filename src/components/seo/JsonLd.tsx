type JsonLdProps = { data: Record<string, unknown> };

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE_URL = "https://a1tecno.com";

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
  return <JsonLd data={data} />;
}

export function ServiceJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${url}`,
    provider: {
      "@type": "Organization",
      name: "A1 Technology",
      url: SITE_URL,
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "South Africa" },
      { "@type": "Country", name: "Kenya" },
      { "@type": "Country", name: "United States" },
    ],
  };
  return <JsonLd data={data} />;
}

export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return <JsonLd data={data} />;
}

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "A1 Technology",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.png`,
    description:
      "Enterprise-grade cybersecurity, IT solutions, cloud security, and digital transformation services.",
    foundingDate: "2020",
    priceRange: "$$$$",
    telephone: "+91-120-4365353",
    email: "info@a1tecno.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Platina Heights, A26, C Block Phase 2, Industrial Area, Sector 62",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201309",
      addressCountry: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cybersecurity Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Network Security Solutions" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cloud Security Solutions" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Application Security Solutions" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Data Security Solutions" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Managed Security Services" } },
      ],
    },
  };
  return <JsonLd data={data} />;
}
