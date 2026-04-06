"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import dynamic from "next/dynamic";
import { useRef, useEffect } from "react";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

/* ── Platform Partners (top tier) ── */
const platformPartners = [
  {
    name: "Amazon Web Services",
    short: "AWS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/512px-Amazon_Web_Services_Logo.svg.png",
    desc: "Cloud Infrastructure",
  },
  {
    name: "Google Cloud",
    short: "GCP",
    logo: "https://www.gstatic.com/devrel-devsite/prod/v0e0f589edd85502a40b9d2c4e47f452e6b7c08f4e177c4b5f6be8e3db3e8ac16/cloud/images/cloud-logo.svg",
    desc: "AI & Analytics",
  },
  {
    name: "Microsoft Azure",
    short: "Azure",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/150px-Microsoft_Azure.svg.png",
    desc: "Enterprise Cloud",
  },
  {
    name: "Salesforce",
    short: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/512px-Salesforce.com_logo.svg.png",
    desc: "CRM & Security",
  },
];

/* ── Solution Partners with local logos ── */
const solutionPartners = [
  { name: "ArcSight", logo: "/images/partners/arcsight.png" },
  { name: "AlgoSec", logo: "/images/partners/algosec.png" },
  { name: "Broadcom", logo: "/images/partners/broadcom.png" },
  { name: "Checkmarx", logo: "/images/partners/checkmarx.png" },
  { name: "Check Point", logo: "/images/partners/checkpoint.png" },
  { name: "CrowdStrike", logo: "/images/partners/crowdstrike.png" },
  { name: "Cymulate", logo: "/images/partners/cymulate.png" },
  { name: "Dece", logo: "/images/partners/dece.png" },
  { name: "Delinea", logo: "/images/partners/delinea.png" },
  { name: "Forcepoint", logo: "/images/partners/forcepoint.png" },
  { name: "Forescout", logo: "/images/partners/forescout.png" },
  { name: "Fortinet", logo: "/images/partners/fortinet.png" },
  { name: "GroundLabs", logo: "/images/partners/groundlabs.png" },
  { name: "IBM QRadar", logo: "/images/partners/ibm-qradar.png" },
  { name: "Immersive Labs", logo: "/images/partners/immersive.png" },
  { name: "Infoblox", logo: "/images/partners/infoblox.png" },
  { name: "Invicti", logo: "/images/partners/invicti.png" },
  { name: "Ivanti", logo: "/images/partners/ivanti.png" },
  { name: "Keysight", logo: "/images/partners/keysight.png" },
  { name: "ObserveIT", logo: "/images/partners/observeit.png" },
];

/* ── Extended Partner Ecosystem logos ── */
const extendedPartners = [
  "/images/partners/partner-extra-1.png",
  "/images/partners/partner-extra-2.jpeg",
  "/images/partners/partner-extra-3.png",
  "/images/partners/partner-extra-4.jpeg",
  "/images/partners/partner-extra-5.png",
  "/images/partners/partner-extra-6.png",
  "/images/partners/partner-extra-7.png",
  "/images/partners/partner-extra-8.png",
  "/images/partners/partner-extra-9.png",
  "/images/partners/partner-extra-10.png",
  "/images/partners/partner-extra-11.png",
  "/images/partners/partner-extra-12.png",
  "/images/partners/partner-extra-13.png",
  "/images/partners/partner-extra-14.png",
  "/images/partners/partner-extra-15.png",
  "/images/partners/partner-extra-16.png",
  "/images/partners/partner-extra-17.png",
  "/images/partners/partner-extra-18.png",
  "/images/partners/partner-extra-19.png",
  "/images/partners/partner-extra-20.jpeg",
  "/images/partners/partner-extra-21.png",
  "/images/partners/partner-extra-22.png",
  "/images/partners/partner-extra-23.png",
];

/* ── Technology Areas ── */
const techAreas = [
  {
    category: "Detection & Response",
    icon: "01",
    tools: [
      "SIEM / SOAR / XDR",
      "EDR / NDR / MDR",
      "Threat Intelligence Platforms",
      "Behavioral Analytics (UBA)",
    ],
  },
  {
    category: "Cloud & Identity",
    icon: "02",
    tools: [
      "CASB / CNAPP / CSPM",
      "IAM / PAM / SSO / MFA",
      "Container & K8s Security",
      "Serverless Protection",
    ],
  },
  {
    category: "Network & Perimeter",
    icon: "03",
    tools: [
      "Next-Gen Firewalls",
      "SD-WAN / SASE",
      "DDoS Mitigation",
      "Micro-Segmentation",
    ],
  },
  {
    category: "AI & Automation",
    icon: "04",
    tools: [
      "ML Threat Detection",
      "Automated Playbooks",
      "Predictive Analytics",
      "AIOps & Observability",
    ],
  },
  {
    category: "Application Security",
    icon: "05",
    tools: [
      "SAST / DAST / SCA",
      "API Security",
      "DevSecOps Pipeline",
      "WAF Management",
    ],
  },
  {
    category: "Data Protection",
    icon: "06",
    tools: [
      "DLP (Endpoint + Cloud)",
      "Data Classification",
      "Encryption & Key Management",
      "Backup & Recovery",
    ],
  },
];

/* ── Infinite Marquee Row ── */
function MarqueeRow({
  images,
  speed = 0.5,
  reverse = false,
}: {
  images: string[];
  speed?: number;
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    let frameId: number;
    const direction = reverse ? 1 : -1;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      x += speed * direction * 0.4;
      if (Math.abs(x) >= track.scrollWidth / 2) x = 0;
      track.style.transform = `translateX(${x}px)`;
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [speed, reverse]);

  const doubled = [...images, ...images];

  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-6 will-change-transform"
        style={{ width: "max-content" }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="shrink-0 w-[180px] h-[100px] bg-[#0a0a0a] border border-white/5 hover:border-[rgba(161,0,255,0.25)] flex items-center justify-center p-5 rounded-lg transition-all duration-300 group"
          >
            <Image
              src={src}
              alt={`Partner ${(i % images.length) + 1}`}
              width={120}
              height={60}
              className="max-h-[50px] w-auto object-contain opacity-75 group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechnologyPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const row1 = extendedPartners.slice(0, 12);
  const row2 = extendedPartners.slice(12);

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Background Image */}
        <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
          <Image
            src="/images/content/partners-banner.jpg"
            alt="Partners Banner"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/70 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-[2]" />

        {/* Particle field on top */}
        <div className="absolute inset-0 z-[3]">
          <ParticleField density={0.3} />
        </div>

        {/* Purple accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A100FF] to-transparent z-[5]" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 py-32 w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0, 1] }}
            className="max-w-4xl"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(161,0,255,0.2)] bg-[rgba(161,0,255,0.06)] text-[#A100FF] text-[11px] uppercase tracking-[0.25em] font-medium mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#A100FF] animate-pulse" />
              Strategic Technology Partners
            </motion.span>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold text-white leading-[1.05] uppercase tracking-tight">
              We Work With
              <br />
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A100FF] to-[#c850ff]">
                Best
              </span>{" "}
              In
              <br />
              The World
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-[#A2A2A0] mt-8 max-w-xl text-lg leading-relaxed"
            >
              Industry-leading manufacturers and solution providers that enable
              us to deliver fast, secure, and comprehensive cybersecurity
              services. We offer the best solutions through our strongest
              partnerships.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Link href="/contact" className="cyber-btn cyber-btn-filled">
                Become a Partner
              </Link>
              <Link href="#partners" className="cyber-btn">
                Explore Partners
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap gap-12 mt-20"
          >
            {[
              { value: "40+", label: "Technology Partners" },
              { value: "4", label: "Cloud Platforms" },
              { value: "6", label: "Security Domains" },
              { value: "100%", label: "Coverage" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[#616160] text-xs uppercase tracking-[0.15em] mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── PLATFORM PARTNERS ── */}
      <section id="partners" className="py-24 border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
          <SectionHeading
            tag="Strategic Cloud & Platform Partners"
            title="Powered by the Leaders"
            description="Our core platform partnerships with the world's largest cloud and enterprise technology providers."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            {platformPartners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative bg-[#0a0a0a] border border-white/[0.06] hover:border-[rgba(161,0,255,0.35)] p-10 md:p-12 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 group min-h-[200px] overflow-hidden"
              >
                {/* Hover glow background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(161,0,255,0.06)] via-[rgba(161,0,255,0.02)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Top border glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#A100FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 h-14 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={56}
                    className="max-h-14 w-auto object-contain brightness-0 invert opacity-60 group-hover:opacity-100 transition-all duration-400"
                    unoptimized
                  />
                </div>
                <div className="relative z-10 text-center">
                  <span className="text-white text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity block">
                    {partner.name}
                  </span>
                  <span className="text-[#616160] text-[11px] uppercase tracking-[0.15em] mt-1 block group-hover:text-[#A100FF] transition-colors duration-500">
                    {partner.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION PARTNERS GRID ── */}
      <section className="py-28">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
          <SectionHeading
            tag="Solution Partners"
            title="Our Technology Alliance Network"
            description="20+ best-of-breed security and networking vendors integrated into our service delivery."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {solutionPartners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.03, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="relative bg-[#0a0a0a] border border-white/[0.05] hover:border-[rgba(161,0,255,0.4)] p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-500 group min-h-[150px] overflow-hidden"
              >
                {/* Multi-layer glow effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(161,0,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-[1px] bg-gradient-to-b from-[rgba(161,0,255,0.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm pointer-events-none" />
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-[#A100FF] to-transparent" />
                  <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-[#A100FF] to-transparent" />
                </div>

                {/* Logo */}
                <div className="relative z-10 h-12 w-full flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={120}
                    height={48}
                    className="max-h-12 w-auto object-contain opacity-80 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>

                {/* Name */}
                <span className="relative z-10 text-[#616160] text-xs font-medium group-hover:text-white transition-colors duration-300 text-center leading-tight tracking-wide">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXTENDED PARTNER ECOSYSTEM (Marquee) ── */}
      <section className="py-20 border-y border-white/5 bg-[rgba(161,0,255,0.01)]">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 mb-12">
          <SectionHeading
            tag="Extended Network"
            title="Extended Partner Ecosystem"
            description="A broader network of trusted technology vendors powering our comprehensive security solutions."
          />
        </div>
        <div className="space-y-6">
          <MarqueeRow images={row1} speed={0.4} />
          <MarqueeRow images={row2} speed={0.35} reverse />
        </div>
      </section>

      {/* ── TECHNOLOGY STACK ── */}
      <section className="py-28">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
          <SectionHeading
            tag="Technology Stack"
            title="Our Arsenal"
            description="The technologies we deploy, manage, and orchestrate across six critical security domains."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {techAreas.map((area, i) => (
              <motion.div
                key={area.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="relative bg-[#0a0a0a] border border-white/[0.05] hover:border-[rgba(161,0,255,0.25)] p-8 transition-all duration-500 group overflow-hidden"
              >
                {/* Subtle hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(161,0,255,0.04)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Large faded number */}
                <span className="absolute top-4 right-6 text-[4rem] font-bold text-white/[0.02] group-hover:text-[rgba(161,0,255,0.06)] transition-colors duration-500 leading-none select-none">
                  {area.icon}
                </span>

                <div className="relative z-10">
                  <h3 className="text-[#A100FF] text-xs uppercase tracking-[0.18em] mb-5 font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A100FF]" />
                    {area.category}
                  </h3>
                  <div className="space-y-3">
                    {area.tools.map((tool) => (
                      <div
                        key={tool}
                        className="flex items-center gap-3 text-sm text-[#A2A2A0] group-hover:text-white/70 transition-colors duration-300"
                      >
                        <span className="text-[#A100FF] text-[10px] opacity-60">&gt;</span>
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(161,0,255,0.03)] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(161,0,255,0.2)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(161,0,255,0.2)] to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(161,0,255,0.15)] bg-[rgba(161,0,255,0.04)] text-[#A100FF] text-[11px] uppercase tracking-[0.2em] font-medium mb-6">
              <span className="w-1 h-1 rounded-full bg-[#A100FF]" />
              Let&apos;s Build Together
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.08] tracking-tight">
              Ready to Leverage Our
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A100FF] to-[#c850ff]">
                Partner Ecosystem
              </span>
              ?
            </h2>
            <p className="text-[#A2A2A0] mt-6 text-lg leading-relaxed max-w-xl mx-auto">
              Connect with our team to discover how our technology alliances can
              accelerate your security transformation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href="/contact" className="cyber-btn cyber-btn-filled">
                Get Started Today
              </Link>
              <Link href="/services" className="cyber-btn">
                Explore Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
