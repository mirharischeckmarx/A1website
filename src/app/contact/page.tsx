"use client";

import { useState, useEffect, FormEvent, Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

const ContactGlobe = dynamic(
  () => import("@/components/three/ContactGlobe"),
  { ssr: false, loading: () => null },
);
const NetworkMap = dynamic(
  () => import("@/components/ui/NetworkMap"),
  { ssr: false, loading: () => null },
);

/* ── Office data ── */
const offices = [
  {
    region: "India",
    city: "Noida, Uttar Pradesh",
    short: "Noida",
    address:
      "Platina Heights, A26, C Block Phase 2, Industrial Area, Sector 62, Noida, UP 201309",
    phone: "+91 1204365353",
    fax: "+91 1204365354",
    mobile: "+91 9796144420",
    flag: "IN",
    label: "Headquarters",
  },
  {
    region: "UAE",
    city: "Dubai",
    short: "Dubai",
    address: "Rigga Business Centre 1001",
    phone: "+971 455 247 66",
    fax: "+971 455 247 66",
    mobile: "+971 56 609 7324",
    flag: "AE",
    label: "Middle East Hub",
  },
  {
    region: "South Africa",
    city: "Centurion, Gauteng",
    short: "Centurion",
    address:
      "1 Landmarks Avenue, Kosmosdaal Ext 11, Samrand, Centurion, Gauteng 0157",
    phone: "1-800-356-8933",
    fax: "1-800-356-8933",
    mobile: "1-800-356-8933",
    flag: "ZA",
    label: "Africa Regional",
  },
  {
    region: "Kenya",
    city: "Nairobi",
    short: "Nairobi",
    address: "Reliance Centre, Nairobi",
    phone: "+254 001 0655",
    fax: "+254 001 0655",
    mobile: "+254 001 0655",
    flag: "KE",
    label: "East Africa",
  },
  {
    region: "USA",
    city: "Boston, MA",
    short: "Boston",
    address: "224 Berkeley Street, 6th Floor, Boston, MA 02006",
    phone: "1-800-356-8933",
    fax: "1-800-356-8933",
    mobile: "1-800-356-8933",
    flag: "US",
    label: "Americas Office",
  },
];

const supportTopics = [
  "Network Security",
  "Data Security",
  "Information Security",
  "Application Security",
  "Cloud Security",
  "General Requirement",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    topic: "",
    message: "",
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeOffice, setActiveOffice] = useState(0);
  const [focusOffice, setFocusOffice] = useState<number | undefined>(undefined);

  // Smart office detection: auto-select nearest office based on timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset = new Date().getTimezoneOffset();
      if (tz.startsWith("Asia/") && offset <= -300) setActiveOffice(0);       // India
      else if (tz.startsWith("Asia/Dubai") || tz.startsWith("Asia/Riyadh") || (offset === -240)) setActiveOffice(1); // UAE
      else if (tz.startsWith("Africa/Johannesburg") || tz.startsWith("Africa/Harare")) setActiveOffice(2); // SA
      else if (tz.startsWith("Africa/Nairobi") || tz.startsWith("Africa/Kampala")) setActiveOffice(3); // Kenya
      else if (tz.startsWith("America/")) setActiveOffice(4);                 // USA
    } catch {
      // Fallback to default (India HQ)
    }
  }, []);

  const handleOfficeSelect = useCallback((idx: number) => {
    setActiveOffice(idx);
  }, []);

  // When user clicks an office card — tell the globe to focus on it
  const handleOfficeClick = useCallback((idx: number) => {
    setActiveOffice(idx);
    setFocusOffice(idx);
    // Reset so the same office can be re-clicked
    setTimeout(() => setFocusOffice(undefined), 100);
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email";
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const inputBase =
    "w-full bg-[#080c18] border border-[#1a2340] focus:border-[#A100FF] text-white px-4 py-3.5 text-sm outline-none transition-all duration-300 placeholder:text-[#3a4460] rounded-none";

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          MAIN SECTION — Globe left, Form right
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-[#030818] overflow-hidden">
        {/* Background effects */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(10,30,80,0.4) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(161,0,255,0.05) 0%, transparent 50%)",
          }}
        />

        {/* Top nav spacer */}
        <div className="h-16" />

        <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 py-12 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 min-h-[calc(100vh-4rem)] items-center">
            {/* ── LEFT: Globe + Active office ── */}
            <div className="lg:col-span-7 relative">
              {/* Globe */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
                className="relative h-[420px] sm:h-[500px] lg:h-[650px]"
              >
                {/* Glow behind globe */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-[500px] h-[500px] rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(10,120,100,0.2) 0%, rgba(0,170,130,0.08) 35%, rgba(161,0,255,0.03) 55%, transparent 70%)",
                      filter: "blur(40px)",
                    }}
                  />
                </div>

                <Suspense fallback={null}>
                  <ContactGlobe onSelectOffice={handleOfficeSelect} focusOffice={focusOffice} />
                </Suspense>
              </motion.div>

              {/* Active office info card — floating over the globe bottom */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeOffice}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-8 left-6 right-6 sm:left-auto sm:right-auto sm:bottom-12 sm:left-8 max-w-sm z-20"
                >
                  <div className="bg-[#0a1025]/90 backdrop-blur-xl border border-[#1a2a55] p-5 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#A100FF] animate-pulse" />
                      <span className="text-[#A100FF] text-xs font-semibold uppercase tracking-[0.15em]">
                        {offices[activeOffice].label}
                      </span>
                    </div>
                    <h3 className="text-white text-lg font-bold">
                      {offices[activeOffice].region} —{" "}
                      {offices[activeOffice].short}
                    </h3>
                    <p className="text-[#6a7a9a] text-xs mt-1 leading-relaxed">
                      {offices[activeOffice].address}
                    </p>
                    <div className="flex gap-4 mt-3 text-[11px] text-[#5a6a8a]">
                      <span>T: {offices[activeOffice].phone}</span>
                      <span>M: {offices[activeOffice].mobile}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Globe caption */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                <span className="text-[#3a4a6a] text-[9px] uppercase tracking-[0.2em]">
                  Drag to explore &middot; 5 offices worldwide
                </span>
              </div>
            </div>

            {/* ── RIGHT: Form + Contact details ── */}
            <div className="lg:col-span-5 py-8 lg:py-20">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* GET IN TOUCH header */}
                <div className="mb-8">
                  <span className="text-[#A100FF] text-[10px] uppercase tracking-[0.3em] font-semibold">
                    Get In Touch
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">
                    Send Us a{" "}
                    <span className="text-[#A100FF]">Message</span>
                  </h2>
                  <p className="text-[#5a6a8a] text-sm mt-3 leading-relaxed">
                    Fill out the form and our cybersecurity experts will contact
                    you within 24 hours.
                  </p>
                </div>

                {/* Form */}
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#0a1025] border border-[#1a2a55] p-10 text-center rounded-lg"
                    >
                      <div className="w-16 h-16 mx-auto mb-5 rounded-full border-2 border-[#A100FF] flex items-center justify-center">
                        <span className="text-[#A100FF] text-2xl">
                          &#10003;
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Message Sent
                      </h3>
                      <p className="text-[#5a6a8a] text-sm">
                        Our expert team will contact you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="c-name"
                            className="text-[#5a6a8a] text-[10px] uppercase tracking-wider mb-1.5 block font-medium"
                          >
                            Your Name *
                          </label>
                          <input
                            id="c-name"
                            type="text"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                name: e.target.value,
                              })
                            }
                            className={inputBase}
                          />
                          {errors.name && (
                            <span
                              className="text-red-400 text-[11px] mt-1 block"
                              role="alert"
                            >
                              {errors.name}
                            </span>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="c-email"
                            className="text-[#5a6a8a] text-[10px] uppercase tracking-wider mb-1.5 block font-medium"
                          >
                            Work Email *
                          </label>
                          <input
                            id="c-email"
                            type="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className={inputBase}
                          />
                          {errors.email && (
                            <span
                              className="text-red-400 text-[11px] mt-1 block"
                              role="alert"
                            >
                              {errors.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="c-company"
                          className="text-[#5a6a8a] text-[10px] uppercase tracking-wider mb-1.5 block font-medium"
                        >
                          Company
                        </label>
                        <input
                          id="c-company"
                          type="text"
                          placeholder="Your company"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: e.target.value,
                            })
                          }
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="c-subject"
                          className="text-[#5a6a8a] text-[10px] uppercase tracking-wider mb-1.5 block font-medium"
                        >
                          Subject
                        </label>
                        <select
                          id="c-subject"
                          value={formData.topic}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              topic: e.target.value,
                            })
                          }
                          className={`${inputBase} ${!formData.topic ? "text-[#3a4460]" : ""}`}
                        >
                          <option value="">
                            What do you need support with?
                          </option>
                          {supportTopics.map((topic) => (
                            <option key={topic} value={topic}>
                              {topic}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="c-message"
                          className="text-[#5a6a8a] text-[10px] uppercase tracking-wider mb-1.5 block font-medium"
                        >
                          Message *
                        </label>
                        <textarea
                          id="c-message"
                          placeholder="Tell us about your requirements..."
                          rows={4}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          className={`${inputBase} resize-none`}
                        />
                        {errors.message && (
                          <span
                            className="text-red-400 text-[11px] mt-1 block"
                            role="alert"
                          >
                            {errors.message}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-3">
                        <input
                          id="c-consent"
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              consent: e.target.checked,
                            })
                          }
                          className="mt-1 accent-[#A100FF]"
                        />
                        <label
                          htmlFor="c-consent"
                          className="text-[#4a5a7a] text-xs leading-relaxed"
                        >
                          I agree to the processing of my personal data by A1
                          Technology, in accordance with the Terms of Use and
                          Privacy Policy.
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-4 bg-[#A100FF] hover:bg-[#8800dd] text-white text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-[0_0_30px_rgba(161,0,255,0.3)]"
                      >
                        Send Message
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* ── CONTACT US details ── */}
                <div className="mt-10 pt-8 border-t border-[#1a2340]">
                  <span className="text-[#A100FF] text-[10px] uppercase tracking-[0.3em] font-semibold">
                    Contact Us
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-4 h-4 text-[#A100FF]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                          />
                        </svg>
                        <span className="text-[#5a6a8a] text-[10px] uppercase tracking-wider font-medium">
                          Phone
                        </span>
                      </div>
                      <a
                        href="tel:+971566097324"
                        className="text-white text-sm hover:text-[#A100FF] transition-colors"
                      >
                        +971 56 609 7324
                      </a>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-4 h-4 text-[#A100FF]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                        <span className="text-[#5a6a8a] text-[10px] uppercase tracking-wider font-medium">
                          Email
                        </span>
                      </div>
                      <a
                        href="mailto:info@a1tecno.com"
                        className="text-white text-sm hover:text-[#A100FF] transition-colors"
                      >
                        info@a1tecno.com
                      </a>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="w-4 h-4 text-[#A100FF]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-[#5a6a8a] text-[10px] uppercase tracking-wider font-medium">
                          Hours
                        </span>
                      </div>
                      <span className="text-white text-sm">
                        Mon-Fri 09:00-17:30
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          OUR GLOBAL OFFICES — Bottom strip
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#040a1a] border-t border-[#0f1a35] py-16">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-[#A100FF] text-[10px] uppercase tracking-[0.3em] font-semibold">
              Our Global Offices
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
              5 Offices Across 4 Continents
            </h3>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {offices.map((office, i) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleOfficeClick(i)}
                className={`relative p-6 cursor-pointer transition-all duration-400 group rounded-lg overflow-hidden ${
                  activeOffice === i
                    ? "bg-[#0c1530] border border-[rgba(161,0,255,0.35)]"
                    : "bg-[#080e22] border border-[#0f1a35] hover:border-[#1a2a55]"
                }`}
              >
                {/* Active glow */}
                {activeOffice === i && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(161,0,255,0.06)] to-transparent pointer-events-none" />
                )}

                {/* Location pin icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    activeOffice === i
                      ? "bg-[rgba(161,0,255,0.15)] border border-[rgba(161,0,255,0.3)]"
                      : "bg-[#0c1530] border border-[#1a2a40] group-hover:border-[#2a3a60]"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 transition-colors ${
                      activeOffice === i
                        ? "text-[#A100FF]"
                        : "text-[#3a4a6a] group-hover:text-[#5a6a8a]"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>

                {/* Office details */}
                <div className="relative z-10">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                      activeOffice === i ? "text-[#A100FF]" : "text-[#3a4a6a]"
                    }`}
                  >
                    [{office.flag}]
                  </span>
                  <h4
                    className={`text-base font-bold mt-1 transition-colors ${
                      activeOffice === i
                        ? "text-white"
                        : "text-[#8a9aba] group-hover:text-white"
                    }`}
                  >
                    {office.short}
                  </h4>
                  <p className="text-[#4a5a7a] text-[11px] mt-1 leading-relaxed">
                    {office.region}
                  </p>
                  <a
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="text-[#4a5a7a] text-[11px] mt-2 block hover:text-[#A100FF] transition-colors"
                  >
                    {office.phone}
                  </a>
                </div>

                {/* Active indicator bar */}
                {activeOffice === i && (
                  <motion.div
                    layoutId="officeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#A100FF] to-transparent"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          GLOBAL NETWORK — Live light show map
      ══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#030818] border-t border-[#0f1a35] overflow-hidden">
        {/* Header */}
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <div>
              <span className="text-[#A100FF] text-[10px] uppercase tracking-[0.3em] font-semibold">
                Live Network
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                Global Security <span className="text-[#A100FF]">Operations</span>
              </h3>
              <p className="text-[#4a5a7a] text-sm mt-2 max-w-lg">
                Real-time visualization of our distributed security mesh connecting 5 continents.
                Data streams flow 24/7 between our global Security Operations Centers.
              </p>
            </div>
            <div className="flex gap-6">
              {[
                { val: "24/7", label: "Monitoring" },
                { val: "<30s", label: "Response" },
                { val: "99.99%", label: "Uptime" },
              ].map((s) => (
                <div key={s.label} className="text-right">
                  <span className="text-[#A100FF] text-xl font-bold block">{s.val}</span>
                  <span className="text-[#3a4a6a] text-[9px] uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Map canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="relative w-full h-[400px] md:h-[500px]"
        >
          <Suspense fallback={null}>
            <NetworkMap />
          </Suspense>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#030818] pt-16 pb-8 border-t border-[#0f1a35]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Ready to Secure Your{" "}
              <span className="text-[#A100FF]">Future</span>?
            </h3>
            <p className="text-[#5a6a8a] text-sm mt-4 max-w-lg mx-auto leading-relaxed">
              Our team of certified cybersecurity experts is standing by to
              architect a security posture tailored to your organization.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/services" className="cyber-btn cyber-btn-filled">
                Explore Services
              </Link>
              <Link href="/cases" className="cyber-btn">
                View Case Studies
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
