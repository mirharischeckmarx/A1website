import ServiceDetailLayout from "@/components/sections/ServiceDetailLayout";

export default function ApplicationSecurityAssessmentPage() {
  return (
    <ServiceDetailLayout
      tag="// APPLICATION SECURITY ASSESSMENT"
      title="Application Security Assessment"
      subtitle="CLOUD / SOURCE CODE / MOBILE / WEB"
      description="Comprehensive application security assessment covering cloud environments, source code audits, mobile application testing, and web application penetration testing — securing every layer of your software."
      visualization="app-security"
      subServices={[
        {
          title: "Cloud Security Assessment",
          description:
            "In-depth assessment of your cloud environment across AWS, Azure, and GCP. We evaluate IAM policies, network configurations, storage permissions, encryption, and compliance posture.",
          features: [
            "Multi-cloud configuration review (AWS/Azure/GCP)",
            "IAM policy and privilege analysis",
            "Storage and database exposure assessment",
            "Compliance mapping (SOC 2, ISO 27001, PCI-DSS)",
          ],
        },
        {
          title: "Source Code Audit",
          description:
            "Manual and automated review of application source code to identify security vulnerabilities, insecure coding patterns, hardcoded secrets, and logic flaws before deployment.",
          features: [
            "SAST with manual expert validation",
            "Hardcoded credential and secret detection",
            "Business logic flaw analysis",
            "Secure coding recommendations per language",
          ],
        },
        {
          title: "Mobile Application Security",
          description:
            "Full security assessment of iOS and Android applications — including reverse engineering, API interception, local storage analysis, certificate pinning bypass, and runtime manipulation.",
          features: [
            "iOS and Android binary analysis",
            "API endpoint security testing",
            "Local data storage and encryption review",
            "Runtime manipulation and tampering tests",
          ],
        },
        {
          title: "Web Application Penetration Testing",
          description:
            "OWASP Top 10 focused web application assessment combining automated scanning with manual exploitation to uncover injection flaws, auth bypasses, XSS, CSRF, and business logic vulnerabilities.",
          features: [
            "OWASP Top 10 full coverage",
            "Authentication and session management testing",
            "API security testing (REST, GraphQL, SOAP)",
            "Business logic and authorization bypass testing",
          ],
        },
      ]}
    />
  );
}
