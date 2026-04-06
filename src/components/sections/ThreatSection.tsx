"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import ThreatDashboard from "@/components/ui/ThreatDashboard";
import dynamic from "next/dynamic";

const NetworkGraph = dynamic(
  () => import("@/components/three/NetworkGraph"),
  { ssr: false }
);

export default function ThreatSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          tag="// REAL-TIME DEFENSE"
          title="Live Threat Intelligence"
          description="Monitoring millions of endpoints. Neutralizing threats in milliseconds."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Network Graph */}
          <div className="h-[400px] relative glass-panel overflow-hidden">
            <NetworkGraph />
            <div className="absolute bottom-4 left-4 text-[10px] font-mono text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A100FF]" />
                Active nodes
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Threat vectors
              </div>
            </div>
          </div>

          {/* Threat Dashboard */}
          <ThreatDashboard />
        </div>
      </div>
    </section>
  );
}
