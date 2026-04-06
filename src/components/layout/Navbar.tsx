"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/services", label: "What We Do" },
  { href: "/solutions", label: "What We Think" },
  { href: "/about", label: "Who We Are" },
  { href: "/technology", label: "Partners" },
  { href: "/cases", label: "Case Studies" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between">
          {/* Logo — Accenture ">" style mark */}
          <Link href="/" className="flex items-center gap-3">
            <span className="text-[#A100FF] text-3xl font-bold leading-none">&gt;</span>
            <span className="text-white text-lg font-medium tracking-wide">
              A1 Technology
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#A2A2A0] hover:text-white transition-colors duration-300 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="flex items-center gap-2 text-sm font-medium text-white hover:text-[#A100FF] transition-colors"
            >
              Get in Touch
              <span className="chevron-icon text-xs">&gt;</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-black pt-20 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-3xl text-white font-semibold uppercase tracking-wide py-4 border-b border-white/5 hover:text-[#A100FF] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
