import ServiceDetailLayout from "@/components/sections/ServiceDetailLayout";

export default function QualityTechnologyServicesPage() {
  return (
    <ServiceDetailLayout
      tag="// QUALITY TECHNOLOGY SERVICES"
      title="Quality Technology Services"
      subtitle="QE / OBSERVABILITY / AI ENGINEERING / AUTOMATION"
      description="Next-generation quality engineering, observability platforms, AI adoption, and intelligent automation — transforming how enterprises build, monitor, and operate secure technology ecosystems."
      visualization="app-security"
      subServices={[
        {
          title: "Quality Engineering",
          description:
            "Transformation assurance with proprietary frameworks. Continuous testing pipelines that reduce testing time by 63% while achieving broader coverage through AI-assisted test generation.",
          features: [
            "Transformation Assurance (QRACE, COMPAS, Anabot)",
            "Continuous Assurance — 63% testing time reduction",
            "Non-Functional Requirement (NFR) Engineering",
            "Release Engineering and deployment validation",
          ],
        },
        {
          title: "Observability Engineering",
          description:
            "Full-stack observability and digital experience monitoring. End-to-end visibility across infrastructure, applications, and user journeys with correlated telemetry data.",
          features: [
            "Full Stack Observability (metrics, logs, traces)",
            "Digital Experience Observability (DEM)",
            "AIOps-driven anomaly detection",
            "Custom dashboard and alert engineering",
          ],
        },
        {
          title: "Integrated Ops Support",
          description:
            "Operations Command Center with customer-experience-led monitoring. Achieve 60% MTTR reduction through intelligent incident routing and automated escalation.",
          features: [
            "Ops Command Center — 60% MTTR reduction",
            "CX-Led Command Centre for business-critical apps",
            "Intelligent incident triage and routing",
            "Runbook automation and self-healing",
          ],
        },
        {
          title: "AI Engineering",
          description:
            "End-to-end AI adoption from data foundations to production deployment. Generative AI, enterprise search, contact center AI, and document processing at enterprise scale.",
          features: [
            "AI Foundations — Data Quality and Observability",
            "Gen AI adoption and Enterprise AI Search",
            "Contact Center AI and Document Processing",
            "AI Assurance and Gen AI Model Observability",
          ],
        },
        {
          title: "Intelligent Automation",
          description:
            "Business process and infrastructure automation powered by AI. Cloud migration automation, RPA, and workflow orchestration that eliminates manual toil.",
          features: [
            "Business Process Automation (RPA + AI)",
            "Infrastructure Automation and Cloud Migration",
            "Workflow orchestration and scheduling",
            "Self-service IT portals and chatbot integration",
          ],
        },
      ]}
    />
  );
}
