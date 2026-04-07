"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignalVisionModule from "./SignalVisionModule";
import CircuitForgeModule from "./CircuitForgeModule";
import QuantumCoreModule from "./QuantumCoreModule";

export default function Capabilities() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const cards = [
    {
      id: "circuit-forge",
      title: "CIRCUIT FORGE",
      desc: "Schematic Synthesis & Power Logic Designing.",
      icon: (
        <svg className="w-12 h-12 mb-6 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] transition-transform group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      id: "signal-vision",
      title: "SIGNAL VISION",
      desc: "Real-time Waveform Analysis & Frequency Visualization.",
      icon: (
        <svg className="w-12 h-12 mb-6 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] transition-transform group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: "quantum-core",
      title: "QUANTUM CORE",
      desc: "Deep Research Lab & Multi-model Knowledge Engine.",
      icon: (
        <svg className="w-12 h-12 mb-6 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] transition-transform group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
  ];

  const playHoverSound = () => {
    try {
      const audio = new Audio('/Assets/Sounds/sci fi positive.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch(err) {}
  };

  return (
    <AnimatePresence mode="wait">
      {!activeModule ? (
        <motion.div 
          key="capabilities-grid"
          initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 flex items-start md:items-center justify-center pointer-events-auto overflow-y-auto pt-24 pb-24 md:pt-0 md:pb-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16 w-full max-w-5xl px-6 md:px-10 mt-auto md:mt-0 mb-auto md:mb-0">
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                onMouseEnter={playHoverSound}
                onClick={() => setActiveModule(card.id)}
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 30px rgba(0, 255, 255, 0.15)", borderColor: "rgba(0,255,255,0.6)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center justify-center text-center p-6 min-h-[200px] md:min-h-[260px] border border-cyan-500/20 rounded-[16px] bg-gradient-to-br from-[#001015]/80 via-[#001828]/60 to-[#1a0b2e]/70 backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,255,0.05)] cursor-pointer group"
              >
                <div className="scale-75 md:scale-100">{card.icon}</div>
                <h3 className="text-lg md:text-xl font-mono text-cyan-100 tracking-[0.2em] mb-2 md:mb-4 group-hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                  {card.title}
                </h3>
                <p className="text-[11px] uppercase tracking-widest text-cyan-100/60 leading-relaxed max-w-[80%] group-hover:text-cyan-200 transition-colors">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : activeModule === "signal-vision" ? (
        <motion.div 
           key="signal-vision-module"
           initial={{ opacity: 0, x: 100 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -100 }}
           transition={{ duration: 0.5, ease: "anticipate" }}
           className="absolute inset-0 flex items-center justify-center pointer-events-auto z-50 p-10"
        >
           <SignalVisionModule onBack={() => setActiveModule(null)} />
        </motion.div>
      ) : activeModule === "circuit-forge" ? (
        <motion.div 
           key="circuit-forge-module"
           initial={{ opacity: 0, y: 100, scale: 0.8 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: -100, scale: 0.8 }}
           transition={{ duration: 0.6, type: "spring", damping: 15 }}
           className="absolute inset-0 flex items-center justify-center pointer-events-auto z-50 p-10"
        >
           <CircuitForgeModule onBack={() => setActiveModule(null)} />
        </motion.div>
      ) : activeModule === "quantum-core" ? (
        <motion.div 
           key="quantum-core-module"
           initial={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
           animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
           exit={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
           transition={{ duration: 0.8, ease: "circOut" }}
           className="absolute inset-0 flex items-center justify-center pointer-events-auto z-50 p-10"
        >
           <QuantumCoreModule onBack={() => setActiveModule(null)} />
        </motion.div>
      ) : (
        <motion.div 
           key="placeholder-module"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto text-cyan-100"
        >
           <h2 className="text-2xl font-light tracking-[0.2em] mb-6">MODULE OFFLINE</h2>
           <button 
             onClick={() => setActiveModule(null)}
             className="px-6 py-2 border border-cyan-500/40 rounded bg-cyan-950/20 hover:bg-cyan-400 hover:text-black transition-all"
           >
             BACK TO CORE
           </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
