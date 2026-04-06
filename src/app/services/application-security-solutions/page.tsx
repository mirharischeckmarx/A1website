import ServiceDetailLayout from "@/components/sections/ServiceDetailLayout";

export default function ApplicationSecuritySolutionsPage() {
  return (
    <ServiceDetailLayout
      tag="// APPLICATION SECURITY SOLUTIONS"
      title="Application Security Solutions"
      subtitle="CLOUD / SOURCE CODE / MOBILE / WEB"
      description="Applications are critical for business continuity and are the primary target of cyber attacks. Secure all processes from the software development lifecycle to the live environment."
      visualization="app-security"
      subServices={[
        {
          title: "Cloud Security Assessment",
          description:
            "In-depth security review of cloud-deployed applications including serverless functions, containerized services, API gateways, and cloud-native architectures.",
          features: [
            "Cloud application architecture review",
            "Serverless and container security testing",
            "API gateway and service mesh assessment",
            "Cloud-native threat modeling",
          ],
        },
        {
          title: "Source Code Audit",
          description:
            "Comprehensive source code review combining automated SAST tools with manual expert analysis to identify vulnerabilities, insecure patterns, and hardcoded secrets.",
          features: [
            "Multi-language SAST scanning",
            "Manual code review by security engineers",
            "Secret and credential detection",
            "Remediation guidance per vulnerability class",
          ],
        },
        {
          title: "Mobile Application Security",
          description:
            "Full security assessment of iOS and Android applications including binary analysis, reverse engineering, API interception, local storage analysis, and runtime manipulation testing.",
          features: [
            "iOS and Android binary reverse engineering",
            "Certificate pinning bypass testing",
            "Local storage and keychain analysis",
            "Runtime hooking and tampering detection",
          ],
        },
        {
          title: "Web Application Penetration Testing",
          description:
            "Deep web application security testing focused on OWASP Top 10 and beyond — covering injection attacks, broken authentication, sensitive data exposure, XSS, CSRF, and business logic flaws.",
          features: [
            "OWASP Top 10 comprehensive testing",
            "API security (REST, GraphQL, SOAP, gRPC)",
            "Authentication and authorization bypass",
            "Business logic and workflow manipulation",
          ],
        },
      ]}
    />
  );
}
