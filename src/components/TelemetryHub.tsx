"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Zap, Globe, Hexagon } from "lucide-react";

export default function TelemetryHub() {
  const [auDistance, setAuDistance] = useState(149597870); // km
  const [lightTime, setLightTime] = useState(499.0); // seconds
  const [velocity, setVelocity] = useState(29.78); // km/s
  const [hexStreams, setHexStreams] = useState<string[]>([
    "[Sgr A*] 8F4C2A1E9B3D7F60 :: 128.4520° / -12.1894°",
    "[Sgr A*] C5B1E94D0F8A6237 :: 241.9021° / 34.8123°",
    "[Sgr A*] 1E7B9C3F0A2D8E54 :: 084.1129° / -05.3341°"
  ]);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  const playHoverSound = () => {
    try {
      const audio = new Audio('/Assets/Sounds/sci fi positive.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch(err) {}
  };

  // In-place Hex Data Mutation Effect
  useEffect(() => {
    const chars = "0123456789ABCDEF";
    const interval = setInterval(() => {
      setHexStreams(prev => prev.map(stream => {
        const parts = stream.split(" :: ");
        if (parts.length === 2) {
          let hex = parts[0].replace("[Sgr A*] ", "");
          const charsArr = hex.split('');
          
          for(let i=0; i<3; i++){
            const randIndex = Math.floor(Math.random() * 16);
            charsArr[randIndex] = chars.charAt(Math.floor(Math.random() * chars.length));
          }
          
          let coords = parts[1].split(" / ");
          if(coords.length === 2) {
             let ra = parseFloat(coords[0].replace("°", ""));
             let dec = parseFloat(coords[1].replace("°", ""));
             ra += (Math.random() * 0.002 - 0.001);
             dec += (Math.random() * 0.002 - 0.001);
             return `[Sgr A*] ${charsArr.join('')} :: ${ra.toFixed(4)}° / ${dec.toFixed(4)}°`;
          }
          return `[Sgr A*] ${charsArr.join('')} :: ${parts[1]}`;
        }
        return stream;
      }));
    }, 150);

    return () => clearInterval(interval);
  }, []);



  // Random Event Triggers
  useEffect(() => {
    const alerts = [
      "Uplink to Voyager 1: Active",
      "Initializing Data from Proxima Centauri",
      "Quantum Sync: Andromeda Galaxy",
      "Solar Flare Anomaly Detected",
      "Tracing Oort Cloud Debris Vector",
      "Dark Matter Resonance Calibrated"
    ];

    const planNextAlert = () => {
      const delay = Math.random() * (20000 - 8000) + 8000; // 8-20 seconds
      setTimeout(() => {
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        setSystemAlert(randomAlert);
        
        // Clear alert after 4 seconds
        setTimeout(() => setSystemAlert(null), 4000);
        
        planNextAlert();
      }, delay);
    };

    planNextAlert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
          will-change: transform;
          display: flex;
          width: max-content;
        }
      `}} />
      
      {/* Desktop Layout */ }
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="hidden md:flex absolute left-8 top-[170px] bottom-[40px] w-[320px] z-20 flex-col gap-5 pointer-events-auto"
      >
      <div className="flex items-center gap-2 mb-0 border-b border-cyan-500/30 pb-2">
        <Radio className="w-5 h-5 text-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
        <h2 className="text-[13px] font-mono tracking-[0.3em] text-cyan-200">ASTRO-TELEMETRY</h2>
      </div>

      {/* Earth-Sun Geometry */}
      <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.15)", borderColor: "rgba(0,255,255,0.6)" }} onMouseEnter={playHoverSound} className="bg-gradient-to-br from-[#001015]/70 via-[#001828]/50 to-[#1a0b2e]/60 backdrop-blur-[15px] border border-emerald-500/20 rounded-lg p-5 shadow-[0_0_15px_rgba(80,200,120,0.05)] relative overflow-hidden group z-10 origin-left shrink-0">
        <div className="absolute top-0 left-0 w-[2px] h-full bg-emerald-500/50"></div>
        <h3 className="text-[10px] uppercase tracking-widest text-emerald-500/80 mb-4 flex items-center gap-2">
          <Globe className="w-3 h-3" /> Earth-Sun Geometry
        </h3>
        
        <div className="space-y-3 font-mono text-xs">
           <div className="flex justify-between items-center group-hover:text-emerald-300 transition-colors">
              <span className="text-gray-400">Dist (AU)</span>
              <span className="text-emerald-100 font-bold tracking-wider">{auDistance.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} km</span>
           </div>
           <div className="flex justify-between items-center group-hover:text-emerald-300 transition-colors">
              <span className="text-gray-400">c-Travel</span>
              <span className="text-emerald-100 font-bold tracking-wider">{lightTime.toFixed(3)} s</span>
           </div>
        </div>
      </motion.div>

      {/* Galactic Node Stream */}
      <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.15)", borderColor: "rgba(0,255,255,0.6)" }} onMouseEnter={playHoverSound} className="bg-gradient-to-br from-[#001015]/70 via-[#001828]/50 to-[#1a0b2e]/60 backdrop-blur-[15px] border border-cyan-500/20 rounded-lg p-5 flex-grow flex flex-col shadow-[inset_0_0_20px_rgba(0,255,255,0.05)] relative overflow-hidden z-10 origin-left">
         {/* Waveform Background Overlay */}
         <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.4) 2px, rgba(0, 255, 255, 0.4) 4px)'
              }}>
         </div>

         <h3 className="text-[10px] uppercase tracking-widest text-cyan-500/80 mb-3 flex items-center gap-2 relative z-10">
           <Hexagon className="w-3 h-3" /> Galactic Node [Sgr A*]
         </h3>

         <div className="flex-grow overflow-hidden font-mono text-[9px] text-cyan-200/70 tracking-widest leading-relaxed relative z-10 flex flex-col justify-center">
           {hexStreams.map((stream, idx) => (
             <div key={idx} className="mb-2 last:mb-0">
               {stream}
             </div>
           ))}
         </div>
      </motion.div>

      {/* Random Event Triggers Box */}
      <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.15)", borderColor: "rgba(0,255,255,0.6)" }} onMouseEnter={playHoverSound} className="min-h-[80px] bg-gradient-to-br from-[#001015]/70 via-[#001828]/50 to-[#1a0b2e]/60 backdrop-blur-[15px] border border-cyan-500/30 rounded-lg flex items-center justify-center relative overflow-hidden z-10 origin-left shrink-0">
        <AnimatePresence>
          {systemAlert ? (
            <motion.div 
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              className="absolute inset-0 flex items-center justify-center p-4 bg-cyan-900/40 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(0,255,255,0.2)]"
            >
              <div className="flex items-center gap-3">
                 <Zap className="w-4 h-4 text-cyan-300 animate-bounce drop-shadow-[0_0_5px_rgba(0,255,255,0.8)] shrink-0" />
                 <span className="text-[10px] text-center font-mono tracking-widest text-cyan-100 uppercase animate-glitch">{systemAlert}</span>
              </div>
            </motion.div>
          ) : (
            <div className="text-[10px] font-mono tracking-widest text-gray-600 uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-900 animate-pulse"></div>
              Awaiting Subspace Ping...
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      </motion.div>

      {/* Mobile Telemetry Ticker */ }
      <div className="md:hidden fixed bottom-0 left-0 w-full h-12 bg-[#000810]/95 border-t border-cyan-500/40 z-50 overflow-hidden backdrop-blur-md">
         <div className="animate-marquee h-full flex items-center font-mono text-[10px] text-cyan-300">
           {/* Section 1 */}
           <div className="flex items-center gap-10 pr-10 whitespace-nowrap">
             <span className="flex items-center gap-2 font-bold drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">
               <Radio className="w-3 h-3 text-cyan-400 animate-pulse" /> ASTRO-TELEMETRY
             </span>
             <span className="flex items-center gap-2">
               <Globe className="w-3 h-3 text-emerald-500" /> [Earth-Sun] Dist: {auDistance.toLocaleString()} km c-Travel: {lightTime.toFixed(3)}s
             </span>
             <span className="text-cyan-500/50">|</span>
             {hexStreams.map((stream, idx) => (
               <span key={idx} className="flex items-center gap-2">
                 <Hexagon className="w-3 h-3 text-cyan-500" /> {stream}
               </span>
             ))}
             <span className="text-cyan-500/50">|</span>
             <span className="flex items-center gap-2">
               <Zap className="w-3 h-3 text-cyan-300 animate-pulse" /> {systemAlert || "AWAITING SUBSPACE PING"}
             </span>
           </div>

           {/* Section 2 (Duplicate for Seamless Loop) */}
           <div className="flex items-center gap-10 pr-10 whitespace-nowrap">
             <span className="flex items-center gap-2 font-bold drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">
               <Radio className="w-3 h-3 text-cyan-400 animate-pulse" /> ASTRO-TELEMETRY
             </span>
             <span className="flex items-center gap-2">
               <Globe className="w-3 h-3 text-emerald-500" /> [Earth-Sun] Dist: {auDistance.toLocaleString()} km c-Travel: {lightTime.toFixed(3)}s
             </span>
             <span className="text-cyan-500/50">|</span>
             {hexStreams.map((stream, idx) => (
               <span key={`dup-${idx}`} className="flex items-center gap-2">
                 <Hexagon className="w-3 h-3 text-cyan-500" /> {stream}
               </span>
             ))}
             <span className="text-cyan-500/50">|</span>
             <span className="flex items-center gap-2">
               <Zap className="w-3 h-3 text-cyan-300 animate-pulse" /> {systemAlert || "AWAITING SUBSPACE PING"}
             </span>
           </div>
         </div>
      </div>
    </>
  );
}
