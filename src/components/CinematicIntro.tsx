"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CinematicIntroProps {
  onComplete: (name: string) => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<"reveal" | "identify" | "transition">("reveal");
  const [userName, setUserName] = useState("");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  // Strict execution locks
  const hasAudioPlayed = useRef(false);
  const interactionStarted = useRef(false);

  // High-Definition Audio Pipeline via Web Audio API 
  const startAudioSequence = useCallback(() => {
    // Prevent the script loop
    if (hasAudioPlayed.current || !audioRef.current || phase !== "reveal") return;
    
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioCtxRef.current.createMediaElementSource(audioRef.current);
        const analyser = audioCtxRef.current.createAnalyser();
        
        analyser.fftSize = 256; // Provides precisely enough bins for a 32-bar visualizer
        source.connect(analyser);
        analyser.connect(audioCtxRef.current.destination);
        
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          hasAudioPlayed.current = true;
          // Elevate playback speed locally 
          if (audioRef.current) audioRef.current.playbackRate = 1.15;
          if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
          }
        }).catch(err => {
          console.warn("Audio autoplay blocked by system architecture - Wait for user interaction.", err);
        });
      }
    } catch (e) {
      console.error("Web Audio API Routing Error:", e);
    }
  }, [phase]);

  // Give the initialization UI sound time to breathe before playing AI voice
  useEffect(() => {
    const timer = setTimeout(() => {
      startAudioSequence();
    }, 800);
    return () => clearTimeout(timer);
  }, [startAudioSequence]);

  // Stop the logic entirely upon single audio wrap-up
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    
    const handleAudioEnd = () => {
      setPhase("identify"); // Destroys the audio visualizer implicitly 
    };
    
    audioEl.addEventListener("ended", handleAudioEnd);
    return () => audioEl.removeEventListener("ended", handleAudioEnd);
  }, []);

  // Modal sci-fi sound effect
  useEffect(() => {
    if (phase === "identify") {
      try {
        const audio = new Audio('/Assets/Sounds/fast_sweep.mp3');
        audio.play().catch(console.error);
      } catch (e) {
        console.warn('Audio Context blocked', e);
      }
    }
  }, [phase]);

  // True 32-Bar Professional Frequency Waveform rendered to Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Capture the live HD Female Voice amplitude frequencies
      if (analyserRef.current && dataArrayRef.current && hasAudioPlayed.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
      }

      ctx.beginPath();
      // Requirement: Multi-Bar Frequency Visualizer (32 bars)
      const totalBars = 32;
      const barWidth = 6;
      const spacing = 14;
      const totalVizWidth = totalBars * spacing;
      const startX = (width - totalVizWidth) / 2;

      for (let i = 0; i < totalBars; i++) {
        let barHeight = 2; // Flatline minimum base
        
        if (dataArrayRef.current) {
          // Mirror rendering mapping lower voice frequencies outwards toward the spectrum edge
          const binIndex = i < totalBars / 2 
            ? 5 + (totalBars / 2 - 1 - i) * 2 
            : 5 + (i - totalBars / 2) * 2;
            
          const amplitude = dataArrayRef.current[binIndex] || 0;
          barHeight = 2 + (amplitude / 255) * 160; 
        }

        // Apply dynamic neon cyan grading mapped directly to the vocal intensity value
        ctx.fillStyle = `rgba(0, 255, 255, ${0.3 + (barHeight / 160) * 0.7})`;
        ctx.shadowBlur = barHeight > 10 ? 15 : 0;
        ctx.shadowColor = "#00FFFF";
        
        // Render individual bar
        ctx.fillRect(startX + i * spacing, centerY - barHeight / 2, barWidth, barHeight);
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setPhase("transition");
      setTimeout(() => {
        try {
          const audio = new Audio('/Assets/Sounds/plasma_gun.mp3');
          audio.play().catch(console.error);
        } catch(err) {}
        onComplete(userName.trim());
      }, 1000); // Trigger Dashboard 
    }
  };

  const handleGlobalClick = () => {
    if (!interactionStarted.current) {
      interactionStarted.current = true;
      startAudioSequence();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#000103] overflow-hidden flex items-center justify-center pointer-events-auto"
      onClick={handleGlobalClick}
    >
      {/* Local High Def Pipeline overriding Window.SpeechSynthesis */}
      <audio ref={audioRef} src="/Assets/Sounds/Jeevant_AI.mp3?v=4" crossOrigin="anonymous" preload="auto" />

      {/* Embedded Analyser WebGL Canvas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
         <canvas 
            ref={canvasRef} 
            width={typeof window !== 'undefined' ? window.innerWidth : 1200} 
            height={400} 
            className="w-full h-[400px]"
         />
      </div>

      <AnimatePresence>
        {phase === "reveal" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)", transition: { duration: 0.8 } }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 flex items-center justify-center"
          >
            {/* The Floating Orbital Emblem */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative flex items-center justify-center"
            >
              <div 
                className="w-56 h-56 md:w-72 md:h-72 relative flex items-center justify-center rounded-full"
              >
                  {/* The light glowing strictly BEHIND the black space */}
                  <div className="absolute inset-1 rounded-full bg-cyan-500/20 blur-[30px] animate-pulse" />
                  
                  {/* The exact black space */}
                  <div className="absolute inset-4 rounded-full bg-black border border-cyan-500/30 shadow-[0_0_40px_rgba(0,255,255,0.2)]" />

                  {/* Logo Display: Fully transparent physical file */}
                  <img 
                      src="/Assets/Images/Logo_transparent.png" 
                      alt="Atomlink Orbital Core"
                      className="relative z-10 w-[70%] h-[70%] object-contain"
                  />
                  
                  {/* Front glowing orbital perimeter ring tracking the black space */}
                  <div className="absolute inset-4 z-20 rounded-full border-2 border-cyan-500/80 shadow-[inset_0_0_30px_rgba(0,255,255,0.4)] pointer-events-none opacity-90 animate-[pulse_4s_ease-in-out_infinite]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Identity Security Gate */}
      <AnimatePresence>
        {phase === "identify" && (
          <motion.div 
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.5, filter: "brightness(2) blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="absolute z-30 flex flex-col items-center justify-center w-full max-w-md px-6"
          >
            <div className="glass-panel p-8 rounded-2xl w-full border border-cyan-500/50 bg-black/80 backdrop-blur-3xl shadow-[0_0_60px_rgba(0,255,255,0.15)] relative overflow-hidden">
              <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-8 text-center animate-pulse">
                System Interface Unlocked
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter Your Name" 
                  className="w-full bg-transparent border-b-2 border-cyan-900 focus:border-cyan-400 outline-none text-white font-mono text-sm tracking-widest text-center py-3 transition-colors duration-300 placeholder:text-cyan-500/70 uppercase"
                  autoFocus
                  required
                />
                <button 
                  type="submit"
                  disabled={!userName.trim()}
                  className="mt-4 text-black bg-cyan-400 disabled:opacity-20 disabled:bg-cyan-900 disabled:text-gray-400 px-6 py-4 font-mono tracking-widest font-bold uppercase rounded hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all duration-300 transform grow"
                >
                  Confirm Identity
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Loading Light Explosion */}
      <AnimatePresence>
        {phase === "transition" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-cyan-400 mix-blend-overlay backdrop-blur-md"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

