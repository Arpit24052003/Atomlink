"use client";

import { useState } from "react";
import CinematicIntro from "@/components/CinematicIntro";
import CommandCenter from "@/components/CommandCenter";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [appState, setAppState] = useState<"pending" | "intro" | "dashboard">("pending");
  const [userName, setUserName] = useState<string>("User");
  const handleInitialize = () => {
    try {
      const audio = new Audio('/Assets/Sounds/interface_notification_trimmed.wav');
      audio.play().catch(console.error);
    } catch(e) {
      console.error(e);
    }
    setAppState("intro");
  };

  return (
    <main className="h-full w-full bg-[#000103] relative overflow-hidden">
      <AnimatePresence>
        {appState === "pending" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-50 bg-[#000103]"
          >
            <button 
              onClick={handleInitialize}
              className="relative overflow-hidden text-cyan-300 font-mono font-bold tracking-widest md:tracking-[0.4em] text-sm md:text-base px-8 md:px-14 py-4 md:py-6 border border-cyan-400/30 rounded-lg bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] hover:border-cyan-300 transition-all duration-500 transform hover:scale-105"
            >
              <span className="relative z-10">[ INITIALIZE ATOM LINK ]</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 text-transparent to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]"></div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {appState === "intro" && (
        <CinematicIntro onComplete={(name: string) => {
           setUserName(name);
           setAppState("dashboard");
        }} />
      )}

      <AnimatePresence>
        {appState === "dashboard" && (
          <CommandCenter userName={userName} />
        )}
      </AnimatePresence>
    </main>
  );
}
