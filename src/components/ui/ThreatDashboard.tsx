"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const threatTypes = [
  "Ransomware",
  "Phishing",
  "DDoS",
  "SQL Injection",
  "Zero-Day",
  "APT",
  "Brute Force",
  "Man-in-the-Middle",
];

const regions = ["US-East", "EU-West", "APAC", "ME-UAE", "US-West", "EU-North"];

interface ThreatEntry {
  id: number;
  type: string;
  region: string;
  severity: "Critical" | "High" | "Medium";
  status: "Blocked" | "Mitigated" | "Analyzing";
  timestamp: string;
}

export default function ThreatDashboard() {
  const [threats, setThreats] = useState<ThreatEntry[]>([]);
  const [, setBlockedCount] = useState(0);

  useEffect(() => {
    // Generate initial threats
    const initial: ThreatEntry[] = [];
    for (let i = 0; i < 6; i++) {
      initial.push(generateThreat(i));
    }
    setThreats(initial);

    // Add new threats periodically
    const interval = setInterval(() => {
      setThreats((prev) => {
        const next = [generateThreat(Date.now()), ...prev.slice(0, 5)];
        return next;
      });
      setBlockedCount((c) => c + Math.floor(Math.random() * 5) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 overflow-hidden relative scanlines">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#A100FF] animate-pulse" />
          <span className="text-[#A100FF] text-xs uppercase tracking-[0.2em] font-mono font-semibold">
            SOC Threat Monitor
          </span>
        </div>
        <span className="text-gray-600 text-xs font-mono">
          Simulation &bull; 24/7 SOC Operations
        </span>
      </div>

      {/* Threat feed */}
      <div className="space-y-2">
        {threats.map((threat) => (
          <motion.div
            key={threat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between py-2 px-3 bg-black/40 border border-gray-900 rounded text-xs font-mono"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  threat.severity === "Critical"
                    ? "bg-red-500"
                    : threat.severity === "High"
                      ? "bg-orange-500"
                      : "bg-yellow-500"
                }`}
              />
              <span className="text-gray-400 w-16 hidden sm:inline">{threat.region}</span>
              <span className="text-white">{threat.type}</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 rounded text-[10px] ${
                  threat.status === "Blocked"
                    ? "bg-[rgba(161,0,255,0.1)] text-[#A100FF]"
                    : threat.status === "Mitigated"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {threat.status}
              </span>
              <span className="text-gray-600 hidden sm:inline">{threat.timestamp}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-4 pt-4 border-t border-gray-900 flex justify-between text-[10px] text-gray-600 font-mono">
        <span>MODE: CONTINUOUS MONITORING</span>
        <span>COVERAGE: 5 REGIONS</span>
        <span className="hidden sm:inline">STATUS: OPERATIONAL</span>
      </div>
    </div>
  );
}

function generateThreat(id: number): ThreatEntry {
  const severities: ThreatEntry["severity"][] = ["Critical", "High", "Medium"];
  const statuses: ThreatEntry["status"][] = ["Blocked", "Mitigated", "Analyzing"];
  const now = new Date();
  return {
    id,
    type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    region: regions[Math.floor(Math.random() * regions.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: statuses[Math.floor(Math.random() * 3)],
    timestamp: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`,
  };
}
