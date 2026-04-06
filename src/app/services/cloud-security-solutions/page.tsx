import ServiceDetailLayout from "@/components/sections/ServiceDetailLayout";

export default function CloudSecuritySolutionsPage() {
  return (
    <ServiceDetailLayout
      tag="// CLOUD SECURITY SOLUTIONS"
      title="Cloud Security Solutions"
      subtitle="CASB / CNAPP / CSPM / CWP / IAM / ZERO TRUST"
      description="Securely manage all cloud environments with our comprehensive cloud security services. From zero-trust architectures to workload protection, we cover every layer of your cloud journey."
      visualization="cloud-security"
      subServices={[
        {
          title: "Cloud & Virtualization Security",
          description:
            "Comprehensive security for cloud and virtualized environments including hypervisor hardening, virtual network security, and cloud workload isolation.",
        },
        {
          title: "Zero Trust Cloud Security",
          description:
            "Implement zero-trust principles across your cloud infrastructure — continuous verification, least-privilege access, and micro-segmentation for every workload and identity.",
          features: [
            "Identity-centric access control",
            "Micro-segmentation across cloud environments",
            "Continuous trust evaluation",
            "SASE integration for remote access",
          ],
        },
        {
          title: "Cloud Access Security Broker (CASB)",
          description:
            "Visibility and control over cloud application usage. Enforce security policies, detect shadow IT, prevent data leakage, and ensure compliance across SaaS, PaaS, and IaaS.",
        },
        {
          title: "Cloud-Native Application Protection Platform (CNAPP)",
          description:
            "Unified cloud-native security from code to cloud — combining CSPM, CWP, container security, and infrastructure-as-code scanning into a single platform.",
          features: [
            "Shift-left security for IaC and CI/CD",
            "Runtime workload protection",
            "Container and serverless security",
            "Unified risk visualization across clouds",
          ],
        },
        {
          title: "Cloud Security Posture Management (CSPM)",
          description:
            "Continuous monitoring and auto-remediation of cloud misconfigurations across AWS, Azure, and GCP with compliance mapping to CIS, SOC 2, PCI-DSS, and more.",
        },
        {
          title: "Cloud Workload Protection (CWP)",
          description:
            "Runtime protection for VMs, containers, and serverless functions including vulnerability management, integrity monitoring, and behavioral threat detection.",
        },
        {
          title: "Kubernetes Security Posture Management (KSPM)",
          description:
            "Security assessment and continuous monitoring of Kubernetes clusters including pod security policies, RBAC review, network policies, and supply chain integrity.",
        },
        {
          title: "Identity and Access Management (IAM)",
          description:
            "Enterprise IAM architecture including SSO, MFA, privileged access management, identity governance, and automated access certification workflows.",
          features: [
            "Single Sign-On (SSO) and MFA deployment",
            "Privileged Access Management (PAM)",
            "Identity governance and lifecycle management",
            "Just-in-time access provisioning",
          ],
        },
        {
          title: "Firewall — IPS/IDS",
          description:
            "Cloud-native firewall and intrusion detection/prevention systems for VPC traffic inspection, east-west security, and automated threat blocking.",
        },
        {
          title: "Email Encryption & Web Security",
          description:
            "End-to-end email encryption, anti-phishing protection, and secure web gateway services to protect against email-borne threats and web-based attacks.",
        },
      ]}
    />
  );
}
