"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const col1 = [
  { label: "About Us", href: "/about" },
  { label: "What We Do", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Partners", href: "/technology" },
  { label: "Case Studies", href: "/cases" },
  { label: "Contact Us", href: "/contact" },
  { label: "Careers", href: "#" },
];

const col2 = [
  { label: "Privacy Statement", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "Accessibility Statement", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
      {/* "Let there be change" animated section */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white uppercase tracking-tight leading-none">
            Let there be
            <br />
            <span className="text-[#A100FF]">change</span>
          </h3>
        </motion.div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div>
            <ul className="space-y-3">
              {col1.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#A2A2A0] text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <ul className="space-y-3">
              {col2.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#A2A2A0] text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Offices */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.15em] font-medium mb-4">
              Global Offices
            </h4>
            <div className="space-y-2 text-[#616160] text-xs">
              <p>India — Noida, UP &bull; T: +91 1204365353</p>
              <p>UAE — Dubai &bull; M: +971 56 609 7324</p>
              <p>South Africa — Centurion</p>
              <p>Kenya — Nairobi</p>
              <p>USA — Boston, MA</p>
            </div>
            <div className="mt-4 space-y-1 text-[#616160] text-xs">
              <p>
                E:{" "}
                <a
                  href="mailto:info@a1tecno.com"
                  className="hover:text-white transition-colors"
                >
                  info@a1tecno.com
                </a>
              </p>
              <p>
                T:{" "}
                <a
                  href="tel:+971566097324"
                  className="hover:text-white transition-colors"
                >
                  +971 56 609 7324
                </a>
              </p>
            </div>
            <div className="mt-6 flex gap-4">
              <a
                href="https://linkedin.com/company/a1technology"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#616160] text-xs hover:text-[#A100FF] transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com/a1aborinnovate"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#616160] text-xs hover:text-[#A100FF] transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-[#616160] text-xs hover:text-[#A100FF] transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image src="/images/brand/a1-logo.png" alt="A1 Technology" width={28} height={24} />
            <span className="text-white text-sm font-medium">A1 Technology</span>
          </div>
          <p className="text-[#616160] text-xs">
            &copy; {new Date().getFullYear()} A1 Technology. All rights reserved. Design &amp; Technology by A1 Technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
