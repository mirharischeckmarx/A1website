import ServiceDetailLayout from "@/components/sections/ServiceDetailLayout";

export default function DataSecuritySolutionsPage() {
  return (
    <ServiceDetailLayout
      tag="// DATA SECURITY SOLUTIONS"
      title="Data Security Solutions"
      subtitle="CONFIGURATION / FILTERING / CLASSIFICATION"
      description="We safeguard your sensitive data with advanced DLP, classification, and encryption solutions. Ensure regulatory compliance and full data governance across your organization."
      visualization="data-security"
      subServices={[
        {
          title: "Configuration Management",
          description:
            "Automated configuration management and drift detection across your infrastructure. Ensure every system maintains its security baseline with continuous monitoring and auto-remediation.",
          features: [
            "Infrastructure-as-code security scanning",
            "Configuration drift detection and alerting",
            "Auto-remediation workflows",
            "Compliance baseline enforcement (CIS, NIST, DISA STIG)",
          ],
        },
        {
          title: "URL/Content Filtering & Gateway",
          description:
            "Secure web gateway and content filtering solutions that protect users from malicious websites, enforce acceptable use policies, and prevent data exfiltration via web channels.",
          features: [
            "Category-based URL filtering",
            "SSL/TLS inspection for encrypted traffic",
            "Cloud-delivered secure web gateway",
            "Data exfiltration prevention via web channels",
          ],
        },
        {
          title: "Data Classification Solution",
          description:
            "Automated data discovery and classification across structured and unstructured data stores. Identify sensitive data (PII, PHI, PCI), apply labels, and enforce handling policies.",
          features: [
            "Automated sensitive data discovery (PII, PHI, PCI)",
            "ML-powered classification and labeling",
            "Policy-based data handling enforcement",
            "Integration with DLP and encryption solutions",
          ],
        },
      ]}
    />
  );
}
