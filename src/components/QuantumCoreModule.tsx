"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { sendMessageToAtomlink } from "../utils/geminiApi";
import RotatingLogo from "./RotatingLogo";

interface QuantumCoreModuleProps {
  onBack: () => void;
  userName?: string;
}

export default function QuantumCoreModule({ onBack, userName = "Arpit" }: QuantumCoreModuleProps) {
  const [query, setQuery] = useState("");
  const [researchData, setResearchData] = useState("");
  const [isResearching, setIsResearching] = useState(false);

  const handleResearch = async () => {
    if (!query.trim()) return;

    try {
      const audio = new Audio('/Assets/Sounds/fast_sweep.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch(e) {}

    setIsResearching(true);
    setResearchData("");

    try {
      const response = await sendMessageToAtomlink(query, [], userName);
      setResearchData(response);
    } catch (error) {
      setResearchData("### CRITICAL FAILURE\nResearch node offline. Connection to Quantum Core lost.");
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      className="w-full max-w-5xl h-[90vh] md:h-[650px] overflow-y-auto md:overflow-hidden flex flex-col bg-[#001015]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-4 md:p-8 shadow-[0_0_50px_rgba(0,255,255,0.4)] relative gap-4 md:gap-8"
    >
      {/* Module Hub Title */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-center border-b border-cyan-500/20 pb-4 md:pb-6 gap-6 md:gap-0 shrink-0 z-10 relative">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full md:w-auto text-center sm:text-left">
          <RotatingLogo size={44} glowColor="rgba(0, 255, 255, 0.4)" />
          <div>
            <h2 className="text-2xl font-mono tracking-[0.3em] text-cyan-100 uppercase mt-1">Quantum Core Hub</h2>
            <p className="text-[9px] text-cyan-400 opacity-60 tracking-[0.2em] font-mono uppercase font-medium mt-1">Deep Research Console</p>
          </div>
        </div>
        <button 
          onClick={() => {
            try { 
              const audio = new Audio('/Assets/Sounds/fast_bleep.mp3');
              audio.volume = 0.5;
              audio.play().catch(() => {}); 
            } catch(e) {}
            onBack();
          }}
          className="w-full md:w-auto px-6 py-2 border border-cyan-500/20 rounded-full font-mono text-[10px] tracking-widest text-cyan-400/60 hover:text-cyan-100 hover:border-cyan-400 transition-all uppercase bg-cyan-950/20 text-center shrink-0"
        >
          [ Terminate Link ]
        </button>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-10 overflow-hidden">
        {/* Search Bar HUD Container */}
        <div className="lg:col-span-4 flex flex-col h-full gap-6 hidden">
            {/* The previous QuantumCoreModule had top input, bottom output but Circuit Forge has Left-Right layout.
                Since Signal Vision is left input right output, I'll align Quantum to also be Left-Right 
                by wrapping it similarly.
            */}
        </div>

        {/* Since previous layout was vertical, let's adapt it to side-by-side or keep it vertical but constrained */}
        <div className="lg:col-span-12 flex flex-col gap-6 h-full border-cyan-500/30">
          <div className="w-full relative group">
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleResearch();
                }
              }}
              placeholder="ENTER RESEARCH PARAMETERS..."
              className="w-full h-24 pl-8 pr-24 py-6 bg-black/80 border border-cyan-500/40 rounded-xl font-mono text-[13px] tracking-[0.2em] text-cyan-100 outline-none focus:border-cyan-400/60 transition-all placeholder-cyan-900 resize-none shadow-[inset_0_0_15px_rgba(0,255,255,0.05)]"
            />
            <button 
              onClick={handleResearch}
              disabled={isResearching || !query.trim()}
              className="absolute right-4 top-5 w-14 h-14 rounded-full flex items-center justify-center text-cyan-400 group-hover:text-emerald-400 transition-colors bg-cyan-900/20 hover:bg-cyan-900/40 border border-cyan-500/20"
            >
              {isResearching ? (
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              )}
            </button>
          </div>

          {/* Main Research Viewport */}
          <div className="flex-1 overflow-hidden flex flex-col border border-cyan-500/40 bg-black/80 rounded-2xl shadow-[inset_0_0_20px_rgba(0,255,255,0.1)]">
             <div className="px-6 py-3 border-b border-cyan-500/10 flex justify-between items-center bg-cyan-950/20">
                <div className="flex gap-4">
                  <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">Research Stream active</span>
                  <span className="text-[9px] font-mono text-emerald-500 tracking-widest uppercase animate-pulse">Neural Path Established</span>
                </div>
             </div>
             
             <div className="flex-1 p-8 overflow-y-auto max-h-[60vh] md:max-h-[70vh] custom-scrollbar relative">
                {researchData ? (
                  <>
                    <div className="markdown-research-content prose prose-invert max-w-none pb-12">
                      <ReactMarkdown 
                         remarkPlugins={[remarkGfm, remarkMath]}
                         rehypePlugins={[rehypeKatex]}
                         components={{
                           h1: ({node, ...props}) => <h1 className="text-cyan-400 font-bold mb-6 text-3xl border-b border-cyan-500/20 pb-4 tracking-tighter" {...props} />,
                           h2: ({node, ...props}) => <h2 className="text-emerald-400 font-mono text-lg mt-10 mb-4 uppercase tracking-[0.2em]" {...props} />,
                           strong: ({node, ...props}) => <strong className="text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,255,255,0.4)]" {...props} />,
                           p: ({node, ...props}) => <p className="text-[15px] leading-relaxed mb-6 text-cyan-100/90 font-light" {...props} />,
                           code: ({node, ...props}) => <code className="bg-cyan-950/40 text-cyan-200 px-1.5 py-0.5 rounded font-mono" {...props} />,
                           pre: ({node, ...props}) => <pre className="bg-black border border-cyan-500/20 p-6 rounded-2xl my-8 overflow-x-auto shadow-[inset_0_0_10px_rgba(0,255,255,0.1)] text-cyan-200" {...props} />,
                           ul: ({node, ...props}) => <ul className="list-disc list-outside mb-6 pl-5 space-y-2 text-cyan-100/80" {...props} />,
                           li: ({node, ...props}) => <li className="marker:text-emerald-500" {...props} />,
                         }}
                      >
                        {researchData}
                      </ReactMarkdown>
                    </div>
                    {/* Visual Scroll Cue */}
                    <div className="sticky bottom-0 w-full flex justify-end pointer-events-none pt-4">
                      <div className="animate-bounce bg-black/80 text-cyan-400 text-[10px] uppercase tracking-[0.2em] px-4 py-2 border border-cyan-500/30 rounded-full font-mono shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                        ↓ Scroll Pipeline
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                     <div className="relative mb-8">
                        <div className="w-32 h-32 border border-cyan-500/20 rounded-full animate-ping absolute inset-0"></div>
                        <div className="w-32 h-32 border border-emerald-500/10 rounded-full animate-pulse transition-transform duration-1000"></div>
                     </div>
                     <h3 className="text-cyan-500/40 font-mono text-[11px] tracking-[0.6em] uppercase">Deep Research Console Idle</h3>
                     <p className="text-cyan-700/50 font-mono text-[9px] mt-4 tracking-widest uppercase">Awaiting Quantum Query Initialization</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
