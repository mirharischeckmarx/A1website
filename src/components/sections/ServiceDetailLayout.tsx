"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false, loading: () => null }
);

// Domain-specific 3D visualizations
const vizComponents: Record<string, ComponentType> = {
  "data-security": dynamic(() => import("@/components/three/DataSecurityViz"), { ssr: false, loading: () => null }),
  "network-security": dynamic(() => import("@/components/three/NetworkSecurityViz"), { ssr: false, loading: () => null }),
  "cloud-security": dynamic(() => import("@/components/three/CloudSecurityViz"), { ssr: false, loading: () => null }),
  "app-security": dynamic(() => import("@/components/three/AppSecurityViz"), { ssr: false, loading: () => null }),
  "info-security": dynamic(() => import("@/components/three/InfoSecurityViz"), { ssr: false, loading: () => null }),
};

interface SubService {
  title: string;
  description: string;
  features?: string[];
}

interface ServiceDetailProps {
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  subServices: SubService[];
  visualization?: string;
}

export default function ServiceDetailLayout({
  tag,
  title,
  subtitle,
  description,
  subServices,
  visualization,
}: ServiceDetailProps) {
  const VizComponent = visualization ? vizComponents[visualization] : null;

  return (
    <>
      {/* Hero with domain-specific 3D viz */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden cyber-grid">
        {VizComponent ? <VizComponent /> : <ParticleField density={0.3} />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-[1]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-6">
              <Link href="/services" className="hover:text-[#A100FF] transition-colors">
                Services
              </Link>
              <span>/</span>
              <span className="text-gray-400">{title}</span>
            </div>

            <span className="text-[#A100FF] text-xs uppercase tracking-[0.3em] font-mono">
              {tag}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 leading-tight">
              {title}
            </h1>
            <p className="text-[#A100FF] text-lg font-mono mt-2 opacity-70">
              {subtitle}
            </p>
            <p className="text-gray-400 mt-6 max-w-2xl text-lg leading-relaxed">
              {description}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/contact" className="cyber-btn cyber-btn-filled">
                Get in Touch
              </Link>
              <Link href="/services" className="cyber-btn">
                All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inline 3D visualization panel (shows the viz again alongside content) */}
      {VizComponent && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="glass-panel overflow-hidden relative h-[350px] md:h-[450px]">
              <VizComponent />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,20,0.9)] via-transparent to-transparent z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="text-[10px] text-[#A100FF] font-mono uppercase tracking-[0.2em]">
                  // Live {title} Visualization
                </span>
                <p className="text-gray-500 text-xs mt-1 max-w-md">
                  Real-time 3D representation of {title.toLowerCase()} architecture and threat vectors.
                </p>
              </div>
              <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A100FF] animate-pulse" />
                <span className="text-[10px] text-gray-600 font-mono">ACTIVE</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sub-services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subServices.map((sub, i) => (
              <GlassCard key={sub.title} delay={i * 0.08} hover={true}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-[rgba(161,0,255,0.2)] bg-[rgba(161,0,255,0.03)] text-[#A100FF] font-mono text-sm font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {sub.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {sub.description}
                    </p>
                    {sub.features && sub.features.length > 0 && (
                      <div className="space-y-2">
                        {sub.features.map((feat) => (
                          <div key={feat} className="flex items-start gap-2 text-xs text-gray-500">
                            <span className="text-[#A100FF] mt-0.5">▹</span>
                            {feat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-10 holo-shimmer"
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Secure Your Infrastructure?
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Our security architects will design a custom solution tailored
              to your threat landscape.
            </p>
            <Link href="/contact" className="cyber-btn cyber-btn-filled">
              Contact Now
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
