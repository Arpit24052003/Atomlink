"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendMessageToAtomlink } from "../utils/geminiApi";
import RotatingLogo from "./RotatingLogo";

interface SignalVisionModuleProps {
  onBack: () => void;
  userName?: string;
}

export default function SignalVisionModule({ onBack, userName = "Arpit" }: SignalVisionModuleProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      new Audio('/Assets/Sounds/fast_sweep.mp3').play().catch(() => {});
    } catch(e) {}

    setIsLoading(true);
    setAnalysisResult(""); // Reset previous result

    try {
      const prompt = `You are now in Signal Vision Mode. Analyze this engineering visual (Circuit, Waveform, or Graph). 
      Provide: 
      1. Identification 
      2. Key Parameters/Values 
      3. Theoretical Implications (e.g., if it's a phasor diagram, explain the lead/lag).`;
      
      const response = await sendMessageToAtomlink(prompt, [], userName, selectedImage, mimeType || undefined);
      
      setAnalysisResult(response);
    } catch (error) {
      setAnalysisResult("SYSTEM ERROR: Signal interference. Unable to complete analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-5xl h-[650px] flex flex-col bg-[#001015]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,255,255,0.4)] relative overflow-hidden"
    >
      {/* Glitch Overlay Header */}
      <div className="flex justify-between items-center mb-8 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-4">
          <RotatingLogo size={42} glowColor="rgba(0, 255, 255, 0.4)" />
          <h2 className="text-2xl font-mono tracking-[0.3em] text-cyan-100 uppercase">Signal Vision Core</h2>
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
          className="text-[10px] tracking-[0.2em] font-mono text-cyan-400/60 hover:text-cyan-400 transition-colors uppercase border border-cyan-500/20 px-4 py-2 rounded bg-cyan-950/20"
        >
          [ Return to Command ]
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden min-h-0">
        {/* Left Column: Input UI */}
        <div className="flex flex-col gap-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`flex-grow border-2 border-dashed border-cyan-500/40 bg-black/80 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-black/60 transition-all group relative overflow-hidden ${selectedImage ? 'p-0' : 'p-10'}`}
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Signal Source" className="w-full h-full object-contain opacity-90 transition-transform group-hover:scale-105" />
            ) : (
              <>
                <svg className="w-12 h-12 mb-4 text-cyan-500/40 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[11px] font-mono text-cyan-500/60 uppercase tracking-widest text-center group-hover:text-cyan-400 transition-colors">
                  Upload Visual Sensor Data<br/><span className="text-[9px] opacity-70">PNG / JPG / BMP</span>
                </p>
              </>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={!selectedImage || isLoading}
            className={`w-full py-4 rounded font-mono text-[13px] tracking-[0.2em] uppercase transition-all duration-300 relative overflow-hidden group 
                      ${!selectedImage || isLoading ? 'bg-cyan-900/20 text-cyan-800' : 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/60 hover:bg-cyan-400 hover:text-black shadow-[0_0_20px_rgba(0,255,255,0.3)]'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full shadow-[0_0_8px_rgba(0,255,255,0.8)]"></div>
                Analyzing Frequency...
              </div>
            ) : "Establish Neural Analysis"}
          </button>
        </div>

        {/* Right Column: Result Display */}
        <div className="flex flex-col border border-cyan-500/40 bg-black/80 rounded-xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,255,255,0.1)]">
          <div className="px-4 py-2 bg-cyan-950/40 border-b border-cyan-500/20 text-[9px] tracking-[0.2em] font-mono text-cyan-400 uppercase">
            Analysis Stream
          </div>
          <div className="flex-1 p-6 font-mono text-[13px] text-cyan-50 leading-relaxed overflow-y-auto">
            {analysisResult ? (
              <div className="markdown-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-cyan-400 font-bold text-lg mb-2 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-cyan-300 font-bold text-md mb-1 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] font-black uppercase text-[12px]" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 text-cyan-100/90" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 text-cyan-100/90" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1 marker:text-cyan-400" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                  }}
                >
                  {analysisResult}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-cyan-800 text-[10px] uppercase tracking-widest text-center animate-pulse">
                Awaiting Data Input...<br/>
                No active signal detected.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Corner Accents */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/30"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/30"></div>
    </motion.div>
  );
}
