import ServiceDetailLayout from "@/components/sections/ServiceDetailLayout";

export default function SapIotSecurityAssessmentPage() {
  return (
    <ServiceDetailLayout
      tag="// SAP & IoT SECURITY"
      title="SAP & IoT Security Assessment"
      subtitle="SAP VAPT / SOURCE CODE / DATABASE / IoT"
      description="Specialized security assessments for SAP ecosystems and IoT infrastructure. We protect your business-critical ERP systems and connected devices from sophisticated attacks."
      visualization="network-security"
      subServices={[
        {
          title: "SAP Vulnerability Assessment",
          description:
            "Comprehensive vulnerability scanning of SAP landscapes including ABAP, HANA, Fiori, and NetWeaver components to identify known CVEs, misconfigurations, and missing patches.",
        },
        {
          title: "SAP Penetration Testing",
          description:
            "Active exploitation testing of SAP systems simulating real-world attacker techniques including RFC interface attacks, privilege escalation, and cross-client access.",
        },
        {
          title: "SAP Source Code Review",
          description:
            "Manual and automated review of ABAP custom code and Fiori applications to identify injection vulnerabilities, authorization bypass, and insecure data handling patterns.",
        },
        {
          title: "SAP Server Assessment",
          description:
            "Security baseline assessment of SAP application servers including OS hardening, service configuration, network exposure, and encryption settings.",
        },
        {
          title: "SAP Network Security Assessment",
          description:
            "Assessment of network segmentation, firewall rules, and traffic flows specific to SAP infrastructure — ensuring proper isolation and defense-in-depth.",
        },
        {
          title: "SAP Database Security Assessment",
          description:
            "Deep analysis of SAP HANA and supporting databases including access controls, encryption at rest/in transit, backup security, and audit logging configuration.",
        },
        {
          title: "IoT Security Assessment",
          description:
            "End-to-end security testing of IoT ecosystems including device firmware analysis, communication protocol testing, cloud backend assessment, and physical security evaluation.",
          features: [
            "Firmware extraction and reverse engineering",
            "Communication protocol analysis (MQTT, CoAP, BLE)",
            "Cloud backend and API security testing",
            "Physical attack vector assessment",
          ],
        },
      ]}
    />
  );
}
