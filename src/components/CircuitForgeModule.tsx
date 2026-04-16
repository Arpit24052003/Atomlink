"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Basic styles for math
import { sendMessageToAtomlink } from "../utils/geminiApi";
import RotatingLogo from "./RotatingLogo";

interface CircuitForgeModuleProps {
  onBack: () => void;
  userName?: string;
}

export default function CircuitForgeModule({ onBack, userName = "Arpit" }: CircuitForgeModuleProps) {
  const [requirements, setRequirements] = useState("");
  const [forgeResult, setForgeResult] = useState("");
  const [isForging, setIsForging] = useState(false);

  const handleForge = async () => {
    if (!requirements.trim()) return;

    try {
      new Audio('/Assets/Sounds/fast_sweep.mp3').play().catch(() => {});
    } catch(e) {}

    setIsForging(true);
    setForgeResult("");

    try {
      const prompt = `You are the Circuit Forge Engine. Your goal is to synthesize schematics. 
      When a user provides a requirement ("${requirements}"), provide: 
      1. A brief 'Intuition' 
      2. A 'Schematic' (using ASCII or clear lists) 
      3. A 'Component BOM' table 
      4. Technical 'Design Formulas' using LaTeX.`;

      const response = await sendMessageToAtomlink(prompt, [], userName);
      setForgeResult(response);
    } catch (error) {
      setForgeResult("### SYSTEM FAILURE\nForge ignition sequence failed. Neural link timeout.");
    } finally {
      setIsForging(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="w-full max-w-5xl h-[90vh] md:h-[650px] overflow-y-auto md:overflow-hidden flex flex-col bg-[#001015]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-4 md:p-8 shadow-[0_0_50px_rgba(0,255,255,0.4)] relative gap-4 md:gap-8"
    >
      {/* Header with Forge Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyan-500/20 pb-4 md:pb-6 gap-4 md:gap-0 shrink-0">
        <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto">
          <RotatingLogo size={48} glowColor="rgba(0, 255, 255, 0.4)" />
          <div>
            <h2 className="text-3xl font-mono tracking-[0.4em] text-cyan-100 uppercase">Circuit Forge</h2>
            <p className="text-[10px] text-cyan-500/60 tracking-[0.1em] uppercase font-mono">Schematic Synthesis Engine v2.0</p>
          </div>
        </div>
        <button 
          onClick={() => {
            try { new Audio('/Assets/Sounds/fast_bleep.mp3').play().catch(() => {}); } catch(e) {}
            onBack();
          }}
          className="w-full md:w-auto px-6 py-2 border border-cyan-500/20 rounded-full font-mono text-[10px] tracking-widest text-cyan-400/60 hover:text-cyan-100 hover:border-cyan-400 transition-all uppercase bg-cyan-950/20 text-center shrink-0"
        >
          [ Dismiss Forge ]
        </button>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-10 overflow-hidden">
        {/* Input Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <div className="flex flex-col gap-3 group">
            <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest pl-1">Design Requirements</label>
            <textarea 
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="E.g., 12V to 5V Buck Converter for 2A load..."
              className="w-full h-[180px] bg-black/80 border border-cyan-500/40 rounded-xl p-4 font-mono text-[13px] text-cyan-100 outline-none focus:border-cyan-400/80 transition-all placeholder-cyan-900 resize-none shadow-[inset_0_0_15px_rgba(0,255,255,0.05)]"
            />
          </div>

          <button 
            onClick={handleForge}
            disabled={!requirements.trim() || isForging}
            className={`w-full py-5 rounded-2xl font-mono text-[14px] tracking-[0.3em] uppercase transition-all duration-500 relative overflow-hidden
                      ${!requirements.trim() || isForging ? 'bg-cyan-950/20 text-cyan-900 border border-cyan-500/10' : 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] shadow-[0_0_15px_rgba(0,255,255,0.1)]'}`}
          >
            {isForging ? (
              <span className="flex items-center justify-center gap-4">
                <span className="w-1.5 h-1.5 bg-cyan-400 animate-ping rounded-full"></span>
                Forging System...
              </span>
            ) : "Ignite Forge Sequence"}
          </button>

          <div className="mt-auto border-t border-cyan-500/10 pt-4">
            <p className="text-[9px] font-mono text-cyan-500/40 uppercase leading-relaxed tracking-wider">
              Safety Protocol: All generated schematics must be validated against physical component tolerances before implementation.
            </p>
          </div>
        </div>

        {/* Synthesis Dashboard (Output) */}
        <div className="lg:col-span-8 flex flex-col border border-cyan-500/40 bg-black/80 rounded-2xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,255,255,0.1)] relative">
          <div className="absolute top-0 right-0 p-4">
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-500/20 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-cyan-500/20 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-cyan-400 animate-pulse rounded-full shadow-[0_0_5px_rgba(0,255,255,0.5)]"></div>
            </div>
          </div>
          
          <div className="px-6 py-3 bg-cyan-950/20 border-b border-cyan-500/10 flex justify-between items-center">
            <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest">Synthesis Dashboard</span>
            <span className="text-[9px] font-mono text-cyan-600 uppercase">Live Output Stream</span>
          </div>

          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            {forgeResult ? (
              <div className="markdown-forge-content prose prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-cyan-400 font-bold text-2xl mb-4 border-b border-cyan-500/20 pb-2 flex items-center gap-3" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-cyan-300 font-mono text-lg mt-8 mb-4 tracking-[0.1em]" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-cyan-400 font-semibold uppercase tracking-widest text-[11px]" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-black/80 border border-cyan-500/20 p-6 rounded-xl overflow-x-auto my-6 shadow-inner text-cyan-200" {...props} />,
                    code: ({node, ...props}) => <code className="text-cyan-100/90 font-mono" {...props} />,
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-6 border border-cyan-500/20 rounded-xl">
                        <table className="w-full text-left" {...props} />
                      </div>
                    ),
                    th: ({node, ...props}) => <th className="bg-cyan-900/30 p-3 text-cyan-400 font-mono text-[11px] uppercase tracking-widest" {...props} />,
                    td: ({node, ...props}) => <td className="p-3 border-t border-cyan-500/10 text-[12px] text-cyan-50/80" {...props} />,
                    p: ({node, ...props}) => <p className="text-[14px] leading-relaxed mb-4 text-gray-300/90 font-sans" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 text-gray-300" {...props} />,
                    li: ({node, ...props}) => <li className="mb-2 marker:text-cyan-500" {...props} />,
                  }}
                >
                  {forgeResult}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center select-none text-center">
                <div className={`w-20 h-20 border-b-2 border-cyan-500/30 rounded-full animate-spin-slow mb-6 ${isForging ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'opacity-30'}`}></div>
                <p className={`text-[11px] font-mono uppercase tracking-[0.5em] transition-all duration-500 ${isForging ? 'text-cyan-400 animate-pulse' : 'text-cyan-500 opacity-30'}`}>
                  {isForging ? "Synthesizing Circuit Logic..." : "Awaiting Forge Initialization"}
                </p>
                <p className="text-cyan-500/40 text-[9px] mt-2 font-mono uppercase tracking-[0.2em] opacity-30">
                  {isForging ? "Neural pathways establishing structure" : "Enter requirements to begin synthesis"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
