"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import DynamicBackground from "./DynamicBackground";
import ChatBox from "./ChatBox";
import Navbar from "./Navbar";
import Capabilities from "./Capabilities";
import Overview from "./Overview";
import TelemetryHub from "./TelemetryHub";

interface CommandCenterProps {
  userName: string;
}

export default function CommandCenter({ userName }: CommandCenterProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [phase, setPhase] = useState<"welcome" | "ui">("welcome");
  const [activeTab, setActiveTab] = useState<string>("home");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (phase === "welcome") {
      const timer = setTimeout(() => {
        setPhase("ui");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1; // Very low volume so it doesn't disturb the user
    }
  }, []);

  const handleChatStart = () => {
    // Intentionally left blank. Ambient track must play continuously regardless of user interaction.
  };

  const playInteractionSound = () => {
    try {
      const audio = new Audio('/Assets/Sounds/Alien_tech.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch(err) {}
  };

  return (
    <div className="absolute inset-0 z-10 w-full h-full text-white font-sans overflow-hidden">
      {/* Dynamic 3D WebGL Background Engine */}
      <DynamicBackground />

      {/* Physical occlusion mask layer using absolute transparent image */}
      <div className="absolute inset-0 bg-[url('/Assets/Images/webui_ref_transparent.png')] bg-cover bg-center opacity-90 pointer-events-none z-10"></div>
      
      {/* Ambient Audio Element mapped accurately */}
      <audio ref={audioRef} src="/Assets/Sounds/interstellar.mp3" loop autoPlay />

      <AnimatePresence mode="wait">
        {phase === "welcome" ? (
          <motion.div 
            key="welcome-msg"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: {duration: 1.0} }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
          >
             <div className="text-center glass-panel p-6 md:p-12 w-[90%] md:w-auto rounded-2xl border border-cyan-500/20 bg-black/60 backdrop-blur-xl shadow-[0_0_50px_rgba(0,255,255,0.1)]">
                <h2 className="text-2xl md:text-4xl font-mono text-cyan-400 mb-4 animate-pulse uppercase tracking-widest leading-tight">Atom Link Established</h2>
                <p className="text-sm md:text-xl text-gray-300 font-mono tracking-widest">Welcome to the command center, <span className="text-white font-bold">{userName}</span>.</p>
             </div>
          </motion.div>
        ) : (
          <motion.div
            key="main-ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, ease: "linear" }}
            className="absolute inset-0 z-30 flex flex-col p-4 md:p-10 font-sans pb-24 md:pb-10"
          >
            {/* Nav Header mapping exact Mockup Layout */}
            <header className="relative z-[70] flex flex-row md:justify-between items-start w-full pointer-events-auto justify-between">
               <div className="flex items-center gap-4">
                 <div className="flex flex-col mt-2">
                   <motion.h1 
                     whileHover={{ textShadow: "0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)", scale: 1.02 }}
                     className="text-5xl tracking-[0.05em] text-cyan-100 font-light border-none m-0 transition-all duration-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)] cursor-default origin-left" style={{fontFamily: "Optima, Segoe UI, sans-serif"}}
                   >
                     ATOMLINK
                   </motion.h1>
                   <p className="text-[10px] tracking-[0.05em] text-cyan-100/80 mt-0 capitalize pl-1 font-medium">Integrating Engineering With Quantum Gravity</p>
                 </div>
               </div>
               
               <Navbar 
                 activeTab={activeTab} 
                 setActiveTab={setActiveTab} 
                 playInteractionSound={playInteractionSound} 
               />
            </header>

            <AnimatePresence>
              {activeTab === "home" && <TelemetryHub key="telemetry-hub" />}
            </AnimatePresence>

            {/* Main Center Area Dynamic Route Mounting */}
            <main className="flex-grow relative flex justify-center md:justify-end items-center md:mr-8 pointer-events-auto mt-4 md:mt-0">
               <AnimatePresence mode="wait">
                 {activeTab === "home" && (
                   <motion.div 
                     key="home"
                     initial={{ opacity: 0, x: 50, filter: "blur(4px)" }}
                     animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                     exit={{ opacity: 0, x: 50, filter: "blur(4px)" }}
                     transition={{ duration: 0.5, ease: "easeOut" }}
                     className="flex flex-col items-center gap-6 z-20"
                   >
                     {/* Chat Panel abstracted into standalone ChatBox component */}
                     <ChatBox 
                       handleChatStart={handleChatStart}
                       playInteractionSound={playInteractionSound}
                       userName={userName}
                     />
                   </motion.div>
                 )}

                 {activeTab === "overview" && (
                   !isSignedIn ? (
                     <motion.div 
                       key="overview-locked"
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 1.05 }}
                       transition={{ duration: 0.4 }}
                       className="flex flex-col items-center justify-center w-[450px] h-[360px] z-20 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.1)] text-cyan-100"
                     >
                        <h2 className="text-2xl font-light tracking-[0.2em] mb-3 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">MISSION OVERVIEW</h2>
                        <div className="flex flex-col items-center gap-4 mt-4">
                          <p className="text-red-400 tracking-widest text-xs uppercase font-bold animate-pulse">LOCKED: AUTHENTICATION REQUIRED</p>
                          <button onClick={() => { playInteractionSound(); setActiveTab("signin"); }} className="px-4 py-2 border border-cyan-500/40 rounded bg-[#001015]/80 hover:bg-cyan-900/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all text-[11px] tracking-widest text-cyan-100">
                             PROCEED TO LOGIN
                          </button>
                        </div>
                     </motion.div>
                   ) : (
                     <Overview key="overview-unlocked" playInteractionSound={playInteractionSound} setActiveTab={setActiveTab} />
                   )
                 )}

                 {activeTab === "capabilities" && (
                   !isSignedIn ? (
                     <motion.div 
                       key="capabilities-locked"
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 1.05 }}
                       transition={{ duration: 0.4 }}
                       className="flex flex-col items-center justify-center w-[450px] h-[360px] z-20 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.1)] text-cyan-100"
                     >
                        <h2 className="text-2xl font-light tracking-[0.2em] mb-3 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">CAPABILITIES</h2>
                        <div className="flex flex-col items-center gap-4 mt-4">
                          <p className="text-red-400 tracking-widest text-xs uppercase font-bold animate-pulse">LOCKED: ONBOARDING REQUIRED</p>
                          <button onClick={() => { playInteractionSound(); setActiveTab("signin"); }} className="px-4 py-2 border border-cyan-500/40 rounded bg-[#001015]/80 hover:bg-cyan-900/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all text-[11px] tracking-widest text-cyan-100">
                             PROCEED TO LOGIN
                          </button>
                        </div>
                     </motion.div>
                   ) : (
                     <Capabilities key="capabilities" />
                   )
                 )}

                 {activeTab === "signin" && (
                   <motion.div 
                     key="signin"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.05 }}
                     transition={{ duration: 0.4 }}
                     className="flex flex-col items-center justify-center z-20 w-full"
                   >
                      {!isLoaded ? (
                         <div className="text-cyan-400 font-mono animate-pulse">Establishing secure link...</div>
                      ) : isSignedIn ? (
                         <div className="w-full max-w-[450px] h-[360px] bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.1)] text-cyan-100 flex flex-col items-center justify-center">
                            <h2 className="text-xl font-light tracking-widest mb-4">IDENTITY VERIFIED</h2>
                            <p className="text-gray-400 tracking-widest text-xs uppercase mb-6">You have total access.</p>
                            <button onClick={() => { playInteractionSound(); setActiveTab("home"); }} className="px-6 py-2 border border-cyan-500/40 rounded bg-[#001015]/80 hover:bg-cyan-900/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all text-[11px] tracking-widest">
                               RETURN TO COMMAND CENTER
                            </button>
                         </div>
                      ) : (
                         <div className="rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.15)] border border-cyan-500/20">
                            <SignIn appearance={{ baseTheme: dark, elements: { rootBox: "border-none", card: "bg-black/60 backdrop-blur-xl border-none shadow-none" } }} routing="hash" />
                         </div>
                      )}
                   </motion.div>
                 )}
               </AnimatePresence>
            </main>

            {/* Global Footer Layout */}
            <footer className="hidden md:flex w-full pb-2 px-2 pointer-events-auto">
               <p className="text-[12px] text-gray-300/80 tracking-[0.05em] drop-shadow-md">© 2002 Atom Link Corp. - All orbits secured.</p>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
