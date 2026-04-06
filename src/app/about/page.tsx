"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

const differentiators = [
  {
    title: "Direct Expert Access",
    description:
      "You get direct access to certified engineers and 24/7 mission-critical support by our global team. No barriers, no scripted support calls.",
  },
  {
    title: "Powerful Ecosystem",
    description:
      "We offer best-of-breed solutions thanks to our close ties with the world's leading network and security technology vendors.",
  },
  {
    title: "Superior Project Execution",
    description:
      "We offer skilled project management and perfect interdisciplinary alignment. Experience peace of mind during the rollout of your project.",
  },
  {
    title: "Lean and Agile",
    description:
      "Not just buzzwords. We have a relentless focus on quality, speed, and customer satisfaction.",
  },
  {
    title: "Peer-to-Peer Engagement",
    description:
      "We connect with our customers on all levels, and function as an extension of their own team, from engineers to executives.",
  },
  {
    title: "Thrive in Complex Situations",
    description:
      "Our experts work on the most complex network and security projects in highly competitive industries.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden cyber-grid">
        <ParticleField density={0.5} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black z-[1]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#A100FF] text-xs uppercase tracking-[0.3em] font-mono">
              // ABOUT A1 TECHNOLOGY
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mt-4 leading-tight">
              Building Cyber Resilience
              <br />
              <span className="neon-text">Across the Globe</span>
            </h1>
            <p className="text-gray-400 mt-6 max-w-xl text-lg">
              The Global Story of Domestic Capital
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading
                tag="// WHO WE ARE"
                title="The Foremost IT & Cybersecurity Solutions Provider"
                center={false}
              />
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>
                  A1 Technology stands as the foremost IT, cybersecurity and
                  advanced technical and networking solutions provider in the
                  region. Since our inception in 2020, we have been dedicated to
                  empowering companies with tailor-made information security
                  solutions and services that meet the evolving challenges of the
                  digital landscape.
                </p>
                <p>
                  With a commitment to cutting-edge technology, we offer
                  comprehensive insights and world-class solutions, providing our
                  clients with an unparalleled advantage over competitors in their
                  respective industries.
                </p>
                <p>
                  Our team of experts combines industry knowledge with innovative
                  approaches to deliver custom solutions that address the unique
                  cybersecurity needs of each client. A1 Technology&apos;s track record
                  exemplifies our unwavering commitment to excellence, positioning
                  us as the go-to partner for organisations seeking a secure and
                  competitive edge in today&apos;s dynamic business environment.
                </p>
              </div>
            </div>

            {/* Stats panel */}
            <div className="glass-panel p-8 holo-shimmer">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "5+", label: "Years Experience" },
                  { value: "5", label: "Global Offices" },
                  { value: "30+", label: "Solution Partners" },
                  { value: "60+", label: "Completed Projects" },
                  { value: "50+", label: "Happy Customers" },
                  { value: "24/7", label: "SOC Operations" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4">
                    <div className="text-2xl font-bold neon-text font-mono">
                      {stat.value}
                    </div>
                    <div className="text-gray-500 text-xs uppercase tracking-wider mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Partner */}
      <section className="py-32 bg-[rgba(161,0,255,0.01)] border-y border-[rgba(161,0,255,0.06)]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            tag="// A PARTNER YOU CAN RELY ON"
            title="A Security and Network Partner You Can Rely On"
            description="We have over a decade of experience in security and networking for enterprises, data centers and telecommunication companies. This sets us apart from pure players in the enterprise security industry."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((item, i) => (
              <GlassCard key={item.title} delay={i * 0.1}>
                <div className="flex items-start gap-4">
                  <span className="text-[#A100FF] font-mono text-sm mt-1">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8"
            >
              <span className="text-[#A100FF] text-xs uppercase tracking-[0.2em] font-mono font-semibold">
                Our Mission
              </span>
              <h3 className="text-2xl font-bold text-white mt-3 mb-4">
                Catalysts for Innovation
              </h3>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  Our mission extends beyond protection. We strive to be catalysts
                  for innovation, enabling organisations to confidently harness the
                  full potential of emerging and cutting-edge technologies.
                </p>
                <p>
                  By remaining at the forefront of industry advancements, we deliver
                  world-class expertise, strategic insight, and forward-looking
                  solutions that help our clients achieve sustainable competitive
                  advantage.
                </p>
                <p>
                  Through a culture of continuous learning and adaptability, we
                  position ourselves as a trusted partner for organisations seeking
                  not just security, but long-term business value.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-8"
            >
              <span className="text-[#A100FF] text-xs uppercase tracking-[0.2em] font-mono font-semibold">
                Our Vision
              </span>
              <h3 className="text-2xl font-bold text-white mt-3 mb-4">
                Global Leader in Cybersecurity
              </h3>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  At A1 Technology, our vision is to be a global leader in
                  cybersecurity and advanced technology solutions — setting the
                  benchmark for excellence, trust, and innovation across the industry.
                </p>
                <p>
                  We aspire to build a strong international presence across India,
                  the Middle East, Africa, and the Americas, becoming the most
                  trusted global solutions provider in cybersecurity.
                </p>
                <p>
                  Leveraging deep expertise in security technologies and an
                  innovation-driven approach, we deliver comprehensive, scalable,
                  and sustainable security solutions that empower our customers to
                  operate with confidence in an increasingly complex digital landscape.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enduring Partnerships */}
      <section className="py-24 bg-[rgba(161,0,255,0.01)] border-t border-[rgba(161,0,255,0.06)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-10 holo-shimmer"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Building Enduring Partnerships
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              At A1 Technology, we are committed to building enduring partnerships
              founded on trust, collaboration, and a deep understanding of our
              clients&apos; evolving needs. We work closely with each organisation to
              design and implement solutions that address today&apos;s challenges while
              proactively anticipating future risks and opportunities — ensuring
              resilience, innovation, and growth in an ever-changing digital landscape.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
