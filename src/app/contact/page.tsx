"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

const offices = [
  {
    region: "India",
    city: "Noida, Uttar Pradesh",
    address: "Platina Heights, A26, C Block Phase 2, Industrial Area, Sector 62, Noida, UP 201309",
    phone: "+91 1204365353",
    fax: "+91 1204365354",
    mobile: "+91 9796144420",
  },
  {
    region: "UAE",
    city: "Dubai",
    address: "Rigga Business Centre 1001",
    phone: "+971 455 247 66",
    fax: "+971 455 247 66",
    mobile: "+971 56 609 7324",
  },
  {
    region: "South Africa",
    city: "Centurion, Gauteng",
    address: "1 Landmarks Avenue, Kosmosdaal Ext 11, Samrand, Centurion, Gauteng 0157",
    phone: "1-800-356-8933",
    fax: "1-800-356-8933",
    mobile: "1-800-356-8933",
  },
  {
    region: "Kenya",
    city: "Nairobi",
    address: "Reliance Centre, Nairobi",
    phone: "+254 001 0655",
    fax: "+254 001 0655",
    mobile: "+254 001 0655",
  },
  {
    region: "USA",
    city: "Boston, MA",
    address: "224 Berkeley Street, 6th Floor, Boston, MA 02006",
    phone: "1-800-356-8933",
    fax: "1-800-356-8933",
    mobile: "1-800-356-8933",
  },
];

const supportTopics = [
  "Network Security",
  "Data Security",
  "Information Security",
  "Application Security",
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

  const inputClass =
    "w-full bg-black/50 border border-gray-800 focus:border-[#A100FF] text-white px-4 py-3 text-sm font-mono outline-none transition-colors placeholder:text-gray-700";

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden cyber-grid">
        <ParticleField density={0.3} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black z-[1]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[#A100FF] text-xs uppercase tracking-[0.3em] font-mono">
              // CONTACT
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mt-4">
              Contact Our
              <br />
              <span className="neon-text">Team Now!</span>
            </h1>
            <p className="text-gray-400 mt-6 max-w-xl text-lg">
              You can reach our team at any time for any questions and needs
              related to cyber security. Our experts are ready to support you
              with the right solutions by getting back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-12 border-b border-[rgba(161,0,255,0.06)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 text-center">
              <span className="text-[#A100FF] text-xs font-mono uppercase tracking-wider">
                Reach Out for Support
              </span>
              <p className="text-gray-400 text-sm mt-2">
                Monday - Friday (09:00 - 17:30)
              </p>
              <p className="text-white font-mono mt-1">+971 56 609 7324</p>
            </div>
            <div className="glass-panel p-6 text-center">
              <span className="text-[#A100FF] text-xs font-mono uppercase tracking-wider">
                Send an E-mail
              </span>
              <p className="text-gray-400 text-sm mt-2">
                Get a reply within 24 hours
              </p>
              <p className="text-white font-mono mt-1">info@a1tecno.com</p>
            </div>
            <div className="glass-panel p-6 text-center">
              <span className="text-[#A100FF] text-xs font-mono uppercase tracking-wider">
                Global Presence
              </span>
              <p className="text-gray-400 text-sm mt-2">
                5 offices worldwide
              </p>
              <p className="text-white font-mono mt-1">India &bull; UAE &bull; SA &bull; Kenya &bull; USA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form + Offices */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeading
                tag="// NEED MORE INFORMATION?"
                title="Send Us a Message"
                description="Fill out the form and our expert team will contact you as soon as possible."
                center={false}
              />

              {submitted ? (
                <div className="glass-panel p-8 text-center">
                  <div className="text-4xl mb-4 text-[#A100FF]">◈</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Request Received
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Our expert team will contact you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={inputClass}
                      />
                      {errors.name && (
                        <span className="text-red-400 text-xs mt-1 block">
                          {errors.name}
                        </span>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={inputClass}
                      />
                      {errors.email && (
                        <span className="text-red-400 text-xs mt-1 block">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className={inputClass}
                  />
                  <select
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                    className={`${inputClass} ${!formData.topic ? "text-gray-700" : ""}`}
                  >
                    <option value="">What you want to get support about?</option>
                    {supportTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                  <div>
                    <textarea
                      placeholder="Tell us about your requirements... *"
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className={`${inputClass} resize-none`}
                    />
                    {errors.message && (
                      <span className="text-red-400 text-xs mt-1 block">
                        {errors.message}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) =>
                        setFormData({ ...formData, consent: e.target.checked })
                      }
                      className="mt-1 accent-[#A100FF]"
                    />
                    <span className="text-gray-500 text-xs">
                      I agree to the processing of my personal data by A1
                      Technology, A1 Technology&apos;s Terms of Use and Privacy Policy.
                    </span>
                  </div>
                  <button type="submit" className="cyber-btn cyber-btn-filled">
                    Send a Request
                  </button>
                </form>
              )}
            </motion.div>

            {/* Offices */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeading
                tag="// BRANCH OFFICES"
                title="Our Global Offices"
                center={false}
              />
              <div className="space-y-4">
                {offices.map((office) => (
                  <div
                    key={office.city}
                    className="glass-panel p-6 hover:border-[rgba(161,0,255,0.3)] transition-all"
                  >
                    <span className="text-[#A100FF] text-xs font-mono uppercase tracking-wider">
                      {office.region}
                    </span>
                    <h3 className="text-white font-bold text-lg mt-1">
                      {office.city}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {office.address}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs font-mono text-gray-600">
                      <span>T: {office.phone}</span>
                      <span>M: {office.mobile}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
