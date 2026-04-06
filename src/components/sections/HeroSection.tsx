"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { RobertVoice, robertDialogue } from "@/lib/robertSpeech";

const HeroScene3D = dynamic(() => import("@/components/three/HeroScene3D"), { ssr: false });
const MarqueeCarousel = dynamic(() => import("@/components/ui/MarqueeCarousel"), { ssr: false });

export default function HeroSection() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentCaption, setCurrentCaption] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "robert"; text: string }[]>([]);
  const voiceRef = useRef<RobertVoice | null>(null);
  const hasStartedRef = useRef(false);

  const startSequence = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setTimeout(() => {
      const voice = new RobertVoice(
        (s) => setIsSpeaking(s),
        (idx) => setCurrentCaption(robertDialogue[idx]?.caption || "")
      );
      voiceRef.current = voice;
      voice.speak(0);
    }, 2500);
  }, []);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200);
    const trigger = () => { startSequence(); window.removeEventListener("click", trigger); window.removeEventListener("touchstart", trigger); };
    window.addEventListener("click", trigger);
    window.addEventListener("touchstart", trigger);
    return () => { window.removeEventListener("click", trigger); window.removeEventListener("touchstart", trigger); voiceRef.current?.destroy(); };
  }, [startSequence]);

  const handleTalk = () => {
    if (!voiceRef.current) { const v = new RobertVoice((s) => setIsSpeaking(s), (i) => setCurrentCaption(robertDialogue[i]?.caption || "")); voiceRef.current = v; }
    if (isMuted) { voiceRef.current.unmute(); setIsMuted(false); }
    voiceRef.current.speak(0);
  };
  const handleMute = () => { if (voiceRef.current) { if (isMuted) { voiceRef.current.unmute(); setIsMuted(false); } else { voiceRef.current.mute(); setIsMuted(true); } } };
  const handleSkip = () => voiceRef.current?.skip();
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault(); if (!chatInput.trim()) return;
    const msg = chatInput.trim(); setChatInput("");
    setChatMessages(p => [...p, { role: "user", text: msg }]);
    setTimeout(() => {
      const r = ["A1 Technology monitors and protects your systems 24/7.", "We provide end-to-end security across 5 global regions.", "Our VAPT team identifies weaknesses before attackers do.", "Connect with our experts — we'll respond within 24 hours.", "From SIEM to SOAR to advanced threat hunting — we've got you covered."];
      setChatMessages(p => [...p, { role: "robert", text: r[Math.floor(Math.random() * r.length)] }]);
    }, 1200);
  };

  const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 0, 0.36, 1] as const } } };

  return (
    <>
      {/* ═══════════════ HERO — NOT sticky, self-contained ═══════════════ */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        {/* 3D Scene — contained within hero only */}
        <div className="absolute inset-0 z-0">
          <HeroScene3D />
        </div>

        {/* Atmospheric glows */}
        <div className="absolute -top-20 -left-20 w-[700px] h-[700px] z-[1] pointer-events-none opacity-70" style={{ background: "radial-gradient(circle, rgba(161,0,255,0.15) 0%, transparent 55%)", filter: "blur(100px)" }} />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] z-[1] pointer-events-none opacity-50" style={{ background: "radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 55%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] z-[1] pointer-events-none opacity-30" style={{ background: "radial-gradient(circle, rgba(117,0,192,0.12) 0%, transparent 55%)", filter: "blur(60px)" }} />

        {/* Bottom fade — hard black at the bottom so content below is clean */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black z-[2]" />

        {/* Content — centered */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6">
          <AnimatePresence>
            {showContent && (
              <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
                initial="hidden"
                animate="show"
                className="max-w-5xl"
              >
                {/* Eyebrow */}
                <motion.div variants={fadeUp} className="mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(161,0,255,0.2)] bg-[rgba(161,0,255,0.05)] text-[#A100FF] text-[11px] uppercase tracking-[0.2em] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A100FF] animate-pulse" />
                    AI-Powered Cyber Defense Platform
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1 variants={fadeUp} className="text-[clamp(2.5rem,8vw,8rem)] font-semibold uppercase leading-[0.92] tracking-[-0.03em]">
                  <span className="block text-white">Your Shield</span>
                  <span className="block text-[#A100FF]">Against Cyber</span>
                  <span className="block text-white">Threats</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p variants={fadeUp} className="text-[#A2A2A0] text-base md:text-lg mt-8 max-w-2xl mx-auto leading-relaxed font-light">
                  No gaps. No guesswork. Enterprise-grade security for applications,
                  networks, cloud, and infrastructure — powered by AI, delivered globally.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mt-10">
                  <Link href="/contact" className="cyber-btn cyber-btn-filled text-sm">Talk to Us</Link>
                  <Link href="/services" className="cyber-btn text-sm">Explore Services</Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1.2 } } }}
                  className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-3"
                >
                  {[
                    { val: "5+", lab: "Years" },
                    { val: "30+", lab: "Partners" },
                    { val: "60+", lab: "Projects" },
                    { val: "50+", lab: "Clients" },
                    { val: "5", lab: "Countries" },
                  ].map((s) => (
                    <div key={s.lab} className="text-center">
                      <span className="text-[#A100FF] text-2xl md:text-3xl font-semibold block">{s.val}</span>
                      <span className="text-[#616160] text-[10px] uppercase tracking-wider">{s.lab}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-8 flex flex-col items-center gap-2"
          >
            <span className="text-[#616160] text-[9px] uppercase tracking-[0.25em]">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 border border-white/15 rounded-full flex justify-center pt-2"
            >
              <div className="w-1 h-1.5 bg-[#A100FF] rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE — solid bg so no bleed ═══════════════ */}
      <div className="relative z-20 bg-black">
        <MarqueeCarousel />
      </div>

      {/* ═══════════════ CAPTION ═══════════════ */}
      <AnimatePresence>
        {currentCaption && isSpeaking && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[90%]">
            <div className="bg-black/90 backdrop-blur-xl border border-white/10 px-6 py-4 text-center rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A100FF] animate-pulse" />
                <span className="text-[#A100FF] text-[10px] uppercase tracking-[0.15em] font-medium">Robert — AI Security Analyst</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{currentCaption}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ CONTROLS ═══════════════ */}
      <AnimatePresence>
        {showContent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
            <button onClick={handleTalk} className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-xl border border-[rgba(161,0,255,0.2)] hover:border-[rgba(161,0,255,0.4)] transition-all rounded-full">
              <svg className="w-3.5 h-3.5 text-[#A100FF]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
              <span className="text-[#A100FF] text-[11px] uppercase tracking-wider">{isSpeaking ? "Speaking" : "Talk"}</span>
              {isSpeaking && <span className="flex gap-0.5">{[0,1,2].map(i=><motion.span key={i} animate={{scaleY:[1,2.5,1]}} transition={{duration:0.35,repeat:Infinity,delay:i*0.08}} className="w-0.5 h-3 bg-[#A100FF] rounded-full origin-bottom"/>)}</span>}
            </button>
            <button onClick={handleMute} className="p-2 bg-black/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all rounded-full">
              <svg className="w-3.5 h-3.5 text-[#616160]" fill="currentColor" viewBox="0 0 24 24">{isMuted?<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>:<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>}</svg>
            </button>
            {isSpeaking && <motion.button initial={{opacity:0}} animate={{opacity:1}} onClick={handleSkip} className="p-2 bg-black/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all rounded-full"><svg className="w-3.5 h-3.5 text-[#616160]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></motion.button>}
            <button onClick={()=>setChatOpen(!chatOpen)} className={`p-2 backdrop-blur-xl border transition-all rounded-full ${chatOpen?"bg-[rgba(161,0,255,0.1)] border-[rgba(161,0,255,0.3)]":"bg-black/80 border-white/10 hover:border-white/20"}`}>
              <svg className={`w-3.5 h-3.5 ${chatOpen?"text-[#A100FF]":"text-[#616160]"}`} fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ CHATBOT ═══════════════ */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div initial={{opacity:0,y:20,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:0.95}} className="fixed bottom-20 right-6 z-50 w-[380px] max-w-[90vw]">
            <div className="bg-black/95 backdrop-blur-2xl border border-white/10 overflow-hidden rounded-2xl shadow-2xl shadow-[rgba(161,0,255,0.05)]">
              <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#A100FF] animate-pulse"/><span className="text-white text-xs font-medium">Robert AI</span></div>
                <button onClick={()=>setChatOpen(false)} className="text-[#616160] hover:text-white text-lg leading-none">&times;</button>
              </div>
              <div className="h-72 overflow-y-auto p-4 space-y-3 no-scrollbar">
                <div className="flex gap-2"><span className="text-[#A100FF] text-xs mt-1 font-bold">&gt;</span><div className="bg-[rgba(161,0,255,0.04)] border border-[rgba(161,0,255,0.08)] px-3 py-2.5 text-sm text-white/60 max-w-[85%] rounded-xl rounded-tl-none">I&apos;m Robert, your AI security analyst. How can I help?</div></div>
                {chatMessages.map((m,i)=>(<div key={i} className={`flex gap-2 ${m.role==="user"?"justify-end":""}`}>{m.role==="robert"&&<span className="text-[#A100FF] text-xs mt-1 font-bold">&gt;</span>}<div className={`px-3 py-2.5 text-sm max-w-[85%] rounded-xl ${m.role==="user"?"bg-white/5 border border-white/10 text-white rounded-tr-none":"bg-[rgba(161,0,255,0.04)] border border-[rgba(161,0,255,0.08)] text-white/60 rounded-tl-none"}`}>{m.text}</div></div>))}
              </div>
              <form onSubmit={handleChatSubmit} className="border-t border-white/5 px-4 py-3 flex gap-2">
                <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask anything..." className="flex-1 bg-transparent border border-white/10 focus:border-[#A100FF] text-white px-3 py-2 text-sm outline-none placeholder:text-[#616160] transition-colors rounded-lg"/>
                <button type="submit" className="px-3 py-2 bg-[#A100FF] hover:bg-[#7500C0] text-white transition-colors rounded-lg"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
