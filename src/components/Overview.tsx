"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Cpu, Database, Fingerprint, Activity, Wrench, Atom } from "lucide-react";

interface OverviewProps {
  playInteractionSound: () => void;
  setActiveTab: (tab: string) => void;
}

export default function Overview({ playInteractionSound, setActiveTab }: OverviewProps) {
  const { user } = useUser();
  const firstName = user?.firstName || "Operator";

  // Countdown Logic
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number}>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2027-03-20T00:00:00Z").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const playHoverSound = () => {
    try {
      const audio = new Audio('/Assets/Sounds/sci fi positive.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch(err) {}
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col w-full md:w-[820px] h-[calc(100vh-140px)] md:h-[480px] z-20 bg-[#000508]/80 backdrop-blur-xl border border-cyan-500/20 rounded-xl overflow-y-auto md:overflow-hidden p-6 shadow-[0_0_30px_rgba(0,255,255,0.05)]"
    >
      {/* Cyber-Circuit Background Patter Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{
             backgroundImage: `
               linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
             `,
             backgroundSize: '40px 40px'
           }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-transparent to-emerald-900/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Dynamic Welcome */}
        <div className="flex flex-col md:flex-row md:justify-between items-start border-b border-cyan-500/30 pb-4 gap-4 md:gap-0">
          <div>
            <h2 className="text-2xl font-light tracking-[0.2em] text-cyan-100 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] uppercase">
              Welcome back, {firstName}.
            </h2>
            <p className="text-emerald-400 tracking-widest text-xs uppercase mt-2 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(80,200,120,0.8)]"></span>
              Neural Link Active
            </p>
          </div>
          
          {/* Milestone Component */}
          <div className="text-left md:text-right flex flex-col items-start md:items-end w-full md:w-auto">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">TARGET: PROJECT ATOMLINK 2.0 COMPLETION</span>
            <div className="flex gap-3 font-mono text-cyan-300">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold bg-black/50 px-2 py-1 rounded border border-cyan-500/30">{String(timeLeft.days).padStart(3, '0')}</span>
                <span className="text-[9px] mt-1 text-cyan-100/50">D</span>
              </div>
              <span className="text-2xl mt-1 text-cyan-500">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold bg-black/50 px-2 py-1 rounded border border-cyan-500/30">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] mt-1 text-cyan-100/50">H</span>
              </div>
              <span className="text-2xl mt-1 text-cyan-500">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold bg-black/50 px-2 py-1 rounded border border-cyan-500/30">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[9px] mt-1 text-cyan-100/50">M</span>
              </div>
              <span className="text-2xl mt-1 text-emerald-500">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold bg-black/50 px-2 py-1 rounded border border-emerald-500/30 text-emerald-300 drop-shadow-[0_0_8px_rgba(80,200,120,0.5)]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[9px] mt-1 text-emerald-100/50">S</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Telemetry */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div onMouseEnter={playHoverSound} className="flex-1 bg-black/40 border border-cyan-500/20 rounded-lg p-4 flex items-center gap-4 hover:border-cyan-400/50 hover:bg-cyan-900/20 transition-all duration-300 group shadow-[0_0_15px_rgba(0,255,255,0.02)]">
             <div className="p-3 bg-cyan-950/50 rounded-full border border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all">
               <Cpu className="w-5 h-5 text-cyan-300" />
             </div>
             <div>
               <p className="text-[10px] tracking-widest text-cyan-500/80 uppercase">Neural Engine</p>
               <p className="text-sm font-medium tracking-wide text-cyan-100">Gemini 2.0 Flash</p>
             </div>
          </div>
          
          <div onMouseEnter={playHoverSound} className="flex-1 bg-black/40 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-4 hover:border-emerald-400/50 hover:bg-emerald-900/20 transition-all duration-300 group shadow-[0_0_15px_rgba(80,200,120,0.02)]">
             <div className="p-3 bg-emerald-950/50 rounded-full border border-emerald-500/30 group-hover:shadow-[0_0_15px_rgba(80,200,120,0.5)] transition-all">
               <Database className="w-5 h-5 text-emerald-400" />
             </div>
             <div>
               <p className="text-[10px] tracking-widest text-emerald-500/80 uppercase">Data Vault</p>
               <p className="text-sm font-medium tracking-wide text-emerald-100">Supabase Live</p>
             </div>
          </div>

          <div onMouseEnter={playHoverSound} className="flex-1 bg-black/40 border border-cyan-500/20 rounded-lg p-4 flex items-center gap-4 hover:border-cyan-400/50 hover:bg-cyan-900/20 transition-all duration-300 group shadow-[0_0_15px_rgba(0,255,255,0.02)]">
             <div className="p-3 bg-cyan-950/50 rounded-full border border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all">
               <Fingerprint className="w-5 h-5 text-cyan-300" />
             </div>
             <div>
               <p className="text-[10px] tracking-widest text-cyan-500/80 uppercase">Identity</p>
               <p className="text-sm font-medium tracking-wide text-cyan-100">Verified via Clerk</p>
             </div>
          </div>
        </div>

        {/* Quick Navigation Tiles */}
        <div className="mt-4 flex-grow">
           <h3 className="text-[11px] uppercase tracking-widest text-cyan-500 mb-2 border-b border-cyan-900/50 pb-2">Module Access Array</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[calc(100%-2rem)] pb-4 md:pb-0">
              
              <button onMouseEnter={playHoverSound} onClick={() => { playInteractionSound(); /* future feature */ }} className="group relative h-full text-left bg-gradient-to-br from-[#001520] to-black border border-cyan-500/30 p-5 rounded-lg hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all duration-300 flex flex-col justify-center">
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                 <Activity className="w-6 h-6 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                 <h4 className="text-xs tracking-[0.15em] uppercase text-cyan-100 mb-2">Signal Vision</h4>
                 <p className="text-[11px] text-gray-400/80 leading-relaxed font-light">Advanced telemetric tracking and real-time anomaly detection protocols.</p>
              </button>

              <button onMouseEnter={playHoverSound} onClick={() => { playInteractionSound(); setActiveTab("capabilities"); }} className="group relative h-full text-left bg-gradient-to-br from-[#001520] to-black border border-cyan-500/30 p-5 rounded-lg hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all duration-300 flex flex-col justify-center">
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                 <Wrench className="w-6 h-6 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                 <h4 className="text-xs tracking-[0.15em] uppercase text-cyan-100 mb-2">Circuit Forge</h4>
                 <p className="text-[11px] text-gray-400/80 leading-relaxed font-light">Engineering toolset mapping physical architectures to virtual schematics.</p>
              </button>

              <button onMouseEnter={playHoverSound} onClick={() => { playInteractionSound(); /* future feature */ }} className="group relative h-full text-left bg-gradient-to-br from-[#001520] to-black border border-emerald-500/30 p-5 rounded-lg hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(80,200,120,0.15)] transition-all duration-300 flex flex-col justify-center">
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                 <Atom className="w-6 h-6 text-emerald-400 mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(80,200,120,0.8)]" />
                 <h4 className="text-xs tracking-[0.15em] uppercase text-emerald-100 mb-2">Quantum Core</h4>
                 <p className="text-[11px] text-gray-400/80 leading-relaxed font-light">High-fidelity compute cluster processing complex physics simulations.</p>
              </button>

           </div>
        </div>

      </div>
    </motion.div>
  );
}
