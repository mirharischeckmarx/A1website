"use client";

import Link from "next/link";
import Image from "next/image";

const col1 = [
  { label: "About Us", href: "/about" },
  { label: "What We Do", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Partners", href: "/technology" },
  { label: "Case Studies", href: "/cases" },
  { label: "Contact Us", href: "/contact" },
];

const col2 = [
  { label: "Privacy Statement", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 py-10">
        {/* Top row — tagline + links + offices all in one row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Tagline */}
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white uppercase tracking-tight leading-none">
              Let there be
              <br />
              <span className="text-[#A100FF]">change</span>
            </h3>
          </div>

          {/* Nav links */}
          <div>
            <ul className="space-y-1.5">
              {col1.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[#A2A2A0] text-xs hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <ul className="space-y-1.5">
              {col2.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[#A2A2A0] text-xs hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices + contact */}
          <div>
            <div className="space-y-1 text-[#616160] text-[11px]">
              <p>India — Noida &bull; +91 1204365353</p>
              <p>UAE — Dubai &bull; +971 56 609 7324</p>
              <p>South Africa — Centurion</p>
              <p>Kenya — Nairobi</p>
              <p>USA — Boston, MA</p>
            </div>
            <div className="mt-3 flex gap-3 text-[11px]">
              <a href="mailto:info@a1tecno.com" className="text-[#616160] hover:text-[#A100FF] transition-colors">info@a1tecno.com</a>
              <span className="text-[#2a2a2a]">|</span>
              <a href="https://linkedin.com/company/a1technology" target="_blank" rel="noopener noreferrer" className="text-[#616160] hover:text-[#A100FF] transition-colors">LinkedIn</a>
              <a href="https://twitter.com/a1aborinnovate" target="_blank" rel="noopener noreferrer" className="text-[#616160] hover:text-[#A100FF] transition-colors">Twitter</a>
            </div>
          </div>
        </div>

        {/* Copyright — tight */}
        <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Image src="/images/brand/a1-logo.png" alt="A1 Technology" width={22} height={19} />
            <span className="text-white text-xs font-medium">A1 Technology</span>
          </div>
          <p className="text-[#616160] text-[10px]">
            &copy; {new Date().getFullYear()} A1 Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
