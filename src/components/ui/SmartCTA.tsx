"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Working late?";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Working late?";
}

function getSmartMessage(): string {
  const hour = new Date().getHours();
  const day = new Date().getDay();

  if (day === 0 || day === 6) {
    return "Even on weekends, threats don't rest — and neither does our SOC.";
  }
  if (hour >= 22 || hour < 6) {
    return "Our 24/7 SOC is active right now, monitoring threats across 5 regions.";
  }
  if (hour >= 9 && hour < 17) {
    return "Our security architects are available now for a consultation.";
  }
  return "Schedule a consultation with our cybersecurity experts.";
}

export default function SmartCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setVisible(scrollPercent > 0.4);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-xs"
        >
          <div className="glass-panel p-5 border border-[rgba(161,0,255,0.15)]">
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-3 text-gray-600 hover:text-white text-xs"
              aria-label="Dismiss"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 text-[10px] font-mono uppercase tracking-wider">
                {getGreeting()}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              {getSmartMessage()}
            </p>
            <Link href="/contact" className="cyber-btn cyber-btn-filled text-xs !py-2 !px-4">
              Talk to Us
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
