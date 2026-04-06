"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

/* ── Platform Partners (top tier) ── */
const platformPartners = [
  { name: "Amazon Web Services", short: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/512px-Amazon_Web_Services_Logo.svg.png" },
  { name: "Google Cloud", short: "GCP", logo: "https://www.gstatic.com/devrel-devsite/prod/v0e0f589edd85502a40b9d2c4e47f452e6b7c08f4e177c4b5f6be8e3db3e8ac16/cloud/images/cloud-logo.svg" },
  { name: "Microsoft Azure", short: "Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/150px-Microsoft_Azure.svg.png" },
  { name: "Salesforce", short: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/512px-Salesforce.com_logo.svg.png" },
];

/* ── Solution Partners with SVG logos from logo.dev/clearbit ── */
const solutionPartners = [
  { name: "ArcSight", domain: "microfocus.com" },
  { name: "AlgoSec", domain: "algosec.com" },
  { name: "Broadcom", domain: "broadcom.com" },
  { name: "Checkmarx", domain: "checkmarx.com" },
  { name: "Check Point", domain: "checkpoint.com" },
  { name: "CrowdStrike", domain: "crowdstrike.com" },
  { name: "Cymulate", domain: "cymulate.com" },
  { name: "Delinea", domain: "delinea.com" },
  { name: "Forcepoint", domain: "forcepoint.com" },
  { name: "Forescout", domain: "forescout.com" },
  { name: "Fortinet", domain: "fortinet.com" },
  { name: "GroundLabs", domain: "groundlabs.com" },
  { name: "IBM QRadar", domain: "ibm.com" },
  { name: "Immersive Labs", domain: "immersivelabs.com" },
  { name: "Infoblox", domain: "infoblox.com" },
  { name: "Invicti", domain: "invicti.com" },
  { name: "Ivanti", domain: "ivanti.com" },
  { name: "Keysight", domain: "keysight.com" },
  { name: "ObserveIT", domain: "proofpoint.com" },
  { name: "Palo Alto Networks", domain: "paloaltonetworks.com" },
];

/* ── Technology Areas ── */
const techAreas = [
  {
    category: "Detection & Response",
    tools: ["SIEM / SOAR / XDR", "EDR / NDR / MDR", "Threat Intelligence Platforms", "Behavioral Analytics (UBA)"],
  },
  {
    category: "Cloud & Identity",
    tools: ["CASB / CNAPP / CSPM", "IAM / PAM / SSO / MFA", "Container & K8s Security", "Serverless Protection"],
  },
  {
    category: "Network & Perimeter",
    tools: ["Next-Gen Firewalls", "SD-WAN / SASE", "DDoS Mitigation", "Micro-Segmentation"],
  },
  {
    category: "AI & Automation",
    tools: ["ML Threat Detection", "Automated Playbooks", "Predictive Analytics", "AIOps & Observability"],
  },
  {
    category: "Application Security",
    tools: ["SAST / DAST / SCA", "API Security", "DevSecOps Pipeline", "WAF Management"],
  },
  {
    category: "Data Protection",
    tools: ["DLP (Endpoint + Cloud)", "Data Classification", "Encryption & Key Management", "Backup & Recovery"],
  },
];

const supportTopics = [
  "Network Security", "Data Security", "Information Security",
  "Application Security", "Cloud Security", "General Requirement",
];

export default function TechnologyPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        <ParticleField density={0.4} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black z-[1]" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-[#A100FF] text-xs uppercase tracking-[0.2em] font-medium">
              Our Solution Partners
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white mt-4 leading-[1.1] uppercase tracking-tight">
              We Work With
              <br />
              The <span className="text-[#A100FF]">Best</span> In
              <br />
              The World
            </h1>
            <p className="text-[#A2A2A0] mt-6 max-w-xl text-lg leading-relaxed">
              Industry-leading manufacturers and solution providers that enable
              us to provide fast, secure, and comprehensive service support.
              We offer the best solutions through our strong partnerships.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Platform Partners (AWS, GCP, Azure, Salesforce) ── */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center mb-12">
            <span className="text-[#616160] text-xs uppercase tracking-[0.2em]">
              Strategic Cloud & Platform Partners
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platformPartners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-[#101010] border border-white/5 hover:border-[rgba(161,0,255,0.25)] p-8 md:p-10 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-300 group min-h-[160px]"
              >
                <div className="h-12 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-12 max-w-[140px] object-contain brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <span className="text-[#A2A2A0] text-sm group-hover:text-white transition-colors">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution Partners Grid — Large logos ── */}
      <section className="py-24">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
          <SectionHeading
            tag="Solution Partners"
            title="Our Technology Alliance Network"
            description="20+ best-of-breed security and networking vendors integrated into our service delivery."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {solutionPartners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-[#0a0a0a] border border-white/5 hover:border-[rgba(161,0,255,0.3)] p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 group min-h-[140px] relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(161,0,255,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Logo */}
                <div className="relative z-10 h-10 w-full flex items-center justify-center">
                  <img
                    src={`https://logo.clearbit.com/${partner.domain}`}
                    alt={partner.name}
                    className="max-h-10 max-w-[100px] object-contain brightness-0 invert opacity-50 group-hover:opacity-90 transition-opacity duration-300"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback: hide broken image and show name instead
                      (e.target as HTMLImageElement).style.display = "none";
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        const fallback = document.createElement("span");
                        fallback.className = "text-[#A100FF] font-semibold text-lg";
                        fallback.textContent = partner.name.charAt(0);
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>

                {/* Name */}
                <span className="relative z-10 text-[#A2A2A0] text-xs font-medium group-hover:text-white transition-colors text-center leading-tight">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technology Areas ── */}
      <section className="py-24 border-y border-white/5 bg-[rgba(161,0,255,0.01)]">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
          <SectionHeading
            tag="Technology Stack"
            title="Our Arsenal"
            description="The technologies we deploy, manage, and orchestrate across six security domains."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {techAreas.map((area, i) => (
              <motion.div
                key={area.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#0a0a0a] border border-white/5 hover:border-[rgba(161,0,255,0.2)] p-6 transition-all duration-300"
              >
                <h3 className="text-[#A100FF] text-xs uppercase tracking-[0.15em] mb-4 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A100FF]" />
                  {area.category}
                </h3>
                <div className="space-y-3">
                  {area.tools.map((tool) => (
                    <div key={tool} className="flex items-center gap-2 text-sm text-[#A2A2A0]">
                      <span className="text-[#A100FF] text-xs">&gt;</span>
                      {tool}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <SectionHeading
            tag="Need More Information?"
            title="Get Expert Support"
            description="Fill out the form and our expert team will contact you as soon as possible."
          />
          <div className="bg-[#0a0a0a] border border-white/5 p-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-black border border-white/10 focus:border-[#A100FF] text-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#616160]"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-black border border-white/10 focus:border-[#A100FF] text-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#616160]"
                />
              </div>
              <select className="w-full bg-black border border-white/10 focus:border-[#A100FF] text-[#616160] px-4 py-3 text-sm outline-none transition-colors">
                <option value="">What you want to get support about?</option>
                {supportTopics.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              <textarea
                placeholder="Tell us about your requirements..."
                rows={4}
                className="w-full bg-black border border-white/10 focus:border-[#A100FF] text-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-[#616160] resize-none"
              />
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 accent-[#A100FF]" />
                <span className="text-[#616160] text-xs">
                  I consent to having this website store my submitted information so they can respond to my inquiry.
                </span>
              </div>
              <button type="submit" className="cyber-btn cyber-btn-filled">
                Send a Request
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
