import type { Metadata } from "next";
import ServiceDetailLayout from "@/components/sections/ServiceDetailLayout";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Managed Security Services — Implementation, Monitoring & SOC Staffing",
  description:
    "Managed security services: professional deployment, 24/7 SLA-backed support, SIEM monitoring, SOAR automation, vulnerability assessment, and cybersecurity staff augmentation.",
  openGraph: {
    title: "Managed Security Services | A1 Technology",
    description: "End-to-end managed security: deployment, 24/7 monitoring, incident response, and certified cybersecurity staffing.",
    url: "https://a1tecno.com/services/managed-services",
  },
  alternates: { canonical: "https://a1tecno.com/services/managed-services" },
};

export default function ManagedServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", url: "/" }, { name: "Services", url: "/services" }, { name: "Managed Services", url: "/services/managed-services" }]} />
      <ServiceJsonLd name="Managed Security Services" description="Professional deployment, 24/7 monitoring, incident response, and certified cybersecurity staffing." url="/services/managed-services" />
      <ServiceDetailLayout
      tag="// MANAGED SERVICES"
      title="Managed Services"
      subtitle="IMPLEMENTATION / SUPPORT / MONITORING / STAFFING"
      description="Free up your internal resources to focus on the business by letting us handle day-to-day security operations. Our managed services team provides end-to-end support — from deployment to 24/7 monitoring."
      visualization="info-security"
      subServices={[
        {
          title: "Implementation Professional Services",
          description:
            "Rapid security deployment by certified professionals. We design, deploy, and configure your entire security stack with zero downtime and full documentation.",
          features: [
            "Certified vendor-specific deployment engineers",
            "Architecture design and validation",
            "Migration from legacy security platforms",
            "Post-deployment tuning and optimization",
          ],
        },
        {
          title: "Advanced Support",
          description:
            "SLA-based annual maintenance with dedicated support engineers providing both onsite and remote assistance, preventive maintenance, and rapid incident response.",
          features: [
            "24/7 SLA-backed support tiers (Bronze/Silver/Gold/Platinum)",
            "Preventive maintenance schedules",
            "Onsite and remote incident response",
            "Quarterly health checks and reporting",
          ],
        },
        {
          title: "Monitoring & Management Services",
          description:
            "Comprehensive managed detection and response through our Next-Gen SIEM, incident response automation, security analytics, user behavior analysis, and SOAR orchestration.",
          features: [
            "Next-Gen SIEM with real-time correlation",
            "Security Analytics and User Behavior Analysis (UBA)",
            "SOAR-automated incident response playbooks",
            "VAPT — continuous vulnerability assessment",
            "Security device management across all vendors",
          ],
        },
        {
          title: "IT Staff Augmentation",
          description:
            "Skilled cybersecurity resource recruitment and placement for enterprise teams. We provide certified security analysts, architects, and engineers on flexible engagement models.",
          features: [
            "Pre-vetted security professionals",
            "Short-term and long-term placements",
            "SOC analyst staffing (Tier 1–3)",
            "CISO-as-a-Service for growing enterprises",
          ],
        },
      ]}
    />
    </>
  );
}
