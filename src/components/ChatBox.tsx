"use client";

import React, { useState, useEffect, useRef } from "react";
import { sendMessageToAtomlink } from "../utils/geminiApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatBoxProps {
  handleChatStart: () => void;
  playInteractionSound: () => void;
  userName?: string;
}

interface Message {
  role: "user" | "model";
  content: string;
  image?: string;
}

export default function ChatBox({ handleChatStart, playInteractionSound, userName = "Arpit" }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // For typewriter
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingText, setPendingText] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedMimeType, setAttachedMimeType] = useState<string | null>(null);
  
  // Rate Limiting & Optimization States
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const [cooldownCountdown, setCooldownCountdown] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Utility to convert user file to base64 synchronously
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setAttachedImage(base64);
      setAttachedMimeType(file.type);
    }
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, displayedResponse, isLoading]);

  // Initial greeting
  useEffect(() => {
    // Only greet once if completely empty
    if (messages.length === 0 && !isTyping && !pendingText && !isLoading && !displayedResponse) {
       setPendingText(`System online. Neural pathways connected. Awaiting your directive, Engineer ${userName}.`);
       setIsTyping(true);
    }
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping || !pendingText) return;
    
    setDisplayedResponse(""); // Clear completely on fresh string injection
    let i = 0;
    
    const interval = setInterval(() => {
      // Use absolute substring tracking instead of `prev + char` to bypass strict-mode offset failures
      setDisplayedResponse(pendingText.substring(0, i + 1));
      i++;
      
      if (i === pendingText.length) {
        clearInterval(interval);
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: "model", content: pendingText }]);
        setDisplayedResponse("");
        setPendingText("");
      }
    }, 10); // Sentient transition speed (Fast & Fluid)
    
    return () => clearInterval(interval);
  }, [isTyping, pendingText]);

  const handleSend = async () => {
    const now = Date.now();
    
    // Strict 5-second debounce logic restored to protect API quota
    if (now - lastRequestTime < 5000) {
      setIsDebouncing(true);
      setTimeout(() => setIsDebouncing(false), 2000);
      return;
    }

    // Safety guards for existing process
    if (isLoading || isTyping || (!inputText.trim() && !attachedImage)) return;
    
    try {
      const audio = new Audio('/Assets/Sounds/sci_fi_interface.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch(e) {}

    // Reset recovery states
    setErrorMessage(null);
    setCanRetry(false);
    setLastRequestTime(now);

    // Initial message processing
    handleChatStart();

    const userMsg = inputText;
    const imgBase64 = attachedImage;
    const imgMime = attachedMimeType;
    
    setInputText("");
    setAttachedImage(null);
    setAttachedMimeType(null);

    const newUserMsg: Message = { role: "user", content: userMsg };
    if (imgBase64) newUserMsg.image = imgBase64;

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);
    
    try {
      const response = await sendMessageToAtomlink(userMsg, messages, userName, imgBase64 || undefined, imgMime || undefined);
      setIsLoading(false);

      if (response.includes("429") || response.includes("quota") || response.includes("Too Many Requests")) {
        setErrorMessage("SYSTEM CORE OVERHEATED: Rate limit reached. Neural link cooling down...");
        setCooldownCountdown(5);
        
        const timer = setInterval(() => {
          setCooldownCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setCanRetry(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        try {
          const audio = new Audio('/Assets/Sounds/sci_fi_interface.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch(e) {}
        setPendingText(response);
        setDisplayedResponse("");
        setIsTyping(true);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage("SYSTEM FAILURE: Communication link lost.");
      setCanRetry(true);
    }
  };

  return (
    <div className="w-full md:w-[520px] h-[calc(100vh-140px)] md:h-[400px] border border-cyan-400/50 md:rounded-[10px] rounded-2xl bg-gradient-to-br from-[#001015]/70 via-[#001828]/50 to-[#1a0b2e]/60 backdrop-blur-[15px] flex flex-col shadow-[0_0_20px_rgba(0,255,255,0.3),inset_0_0_30px_rgba(0,255,255,0.1),inset_0_0_20px_rgba(147,51,234,0.15)] overflow-hidden relative group">
      
      {/* Reflection Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-50 z-0"></div>

      {/* Chat Component Top Header */}
      <div className="px-6 py-3 border-b border-cyan-500/40 bg-cyan-950/40 flex items-center shadow-inner relative z-10 shrink-0">
        <h3 className="text-xs uppercase tracking-widest text-cyan-50 font-semibold drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">Atomlink Core Engaged</h3>
      </div>

      {/* Chat Component Body */}
      <div className="flex-1 p-6 flex flex-col relative overflow-y-auto z-10 gap-4" style={{scrollbarWidth: 'none'}}>
        
        {/* Persistent Watermark Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-10 pointer-events-none flex flex-col items-center">
          <img src="/Assets/Images/Logo_transparent.png" className="w-[85%] h-[85%] object-contain animate-[spin_25s_linear_infinite]" />
        </div>

        {/* Existing Messages */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col font-mono text-cyan-50 text-[13px] tracking-wide leading-relaxed ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <span className={`px-4 py-3 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'bg-cyan-900/60 border border-cyan-500/40 shadow-sm shadow-cyan-900/50' : 'bg-[#001015]/80 border border-cyan-400/20 shadow-sm shadow-cyan-900/20'}`}>
              <span className={`font-bold block mb-1 text-[10px] tracking-widest uppercase ${msg.role === 'user' ? 'text-gray-400' : 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]'}`}>
                 {msg.role === 'model' ? 'ATOMLINK' : `ENGINEER ${userName.toUpperCase()}`}
              </span>
              {msg.image && (
                <img src={msg.image} alt="User Upload" className="mb-2 rounded border border-cyan-500/30 max-h-[150px] opacity-80 shadow-[0_0_10px_rgba(0,255,255,0.1)]" />
              )}
              <div className="markdown-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-cyan-400 font-bold text-lg mb-2 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-cyan-300 font-bold text-md mb-1 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] font-black" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 text-cyan-100/90" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 text-cyan-100/90" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1 marker:text-cyan-400" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </span>
          </div>
        ))}

        {/* Typing State Display */}
        {isTyping && displayedResponse && (
          <div className="flex flex-col font-mono text-cyan-50 text-[13px] tracking-wide leading-relaxed items-start">
             <span className="px-4 py-3 rounded-lg max-w-[85%] bg-[#001015]/80 border border-cyan-400/20 shadow-sm shadow-cyan-900/20">
               <span className="text-cyan-400 font-bold block mb-1 text-[10px] tracking-widest uppercase drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">ATOMLINK</span>
               <div className="markdown-content">
                 <ReactMarkdown 
                   remarkPlugins={[remarkGfm]}
                   components={{
                     h1: ({node, ...props}) => <h1 className="text-cyan-400 font-bold text-lg mb-2" {...props} />,
                     h2: ({node, ...props}) => <h2 className="text-cyan-300 font-bold text-md mb-1" {...props} />,
                     strong: ({node, ...props}) => <strong className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] font-black" {...props} />,
                     p: ({node, ...props}) => <p className="inline" {...props} />, // Keep text inline for typing feel
                     ul: ({node, ...props}) => <ul className="list-disc list-inside inline-block" {...props} />,
                     li: ({node, ...props}) => <li className="inline" {...props} />,
                   }}
                 >
                   {displayedResponse}
                 </ReactMarkdown>
               </div>
               <span className="inline-block w-2 h-3 bg-cyan-300 ml-1 animate-pulse align-middle translate-y-[1px] shadow-[0_0_8px_rgba(0,255,255,0.8)]"></span>
             </span>
          </div>
        )}

        {/* Holographic Orb Loader */}
        {isLoading && (
          <div className="flex flex-col items-start w-full mt-2">
             <div className="w-8 h-8 rounded-full border border-cyan-500/30 bg-cyan-900/40 flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(0,255,255,0.9)]"></div>
             </div>
          </div>
        )}

        {/* Auto Scroll Anchor */}
        <div ref={messagesEndRef} className="h-1 shrink-0" />
      </div>

      {/* Image Upload Preview */}
      {attachedImage && (
        <div className="absolute bottom-[60px] left-4 z-20">
          <div className="relative border border-cyan-400/50 rounded bg-[#001015]/90 p-1 shadow-[0_0_15px_rgba(0,255,255,0.4)]">
             <img src={attachedImage} alt="Upload Preview" className="h-[60px] max-w-[120px] object-cover rounded-sm opacity-90" />
             <button 
                onClick={() => { setAttachedImage(null); setAttachedMimeType(null); fileInputRef.current && (fileInputRef.current.value = ""); }}
                className="absolute -top-2 -right-2 bg-black border border-cyan-500 rounded-full w-5 h-5 flex items-center justify-center text-cyan-400 text-[10px] hover:bg-cyan-900 hover:text-white"
             >
                X
             </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 md:p-3 pb-8 md:pb-3 border-t border-cyan-500/20 bg-[#000810]/80 relative z-10 flex items-center shrink-0">
        
        {/* Hidden File Input & Neon Attachment Button */}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mr-3 text-cyan-500 hover:text-cyan-300 transition-colors shrink-0"
          title="Upload Visual Sensor Data"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={errorMessage ? "SYSTEM COOLING..." : "ENTER DIRECTIVE..."}
          className={`flex-grow bg-transparent border-none outline-none font-mono text-[13px] md:text-[11px] p-2 md:p-0 tracking-widest uppercase focus:ring-0 ${errorMessage ? 'text-red-400' : 'text-cyan-200 placeholder-cyan-800/80'}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (inputText.trim() || attachedImage)) handleSend();
          }}
          disabled={isLoading || isTyping || !!errorMessage}
        />
        
        {errorMessage && canRetry ? (
          <button
            onClick={() => { setErrorMessage(null); setCanRetry(false); }}
            className="ml-2 px-3 py-1 bg-red-900/30 border border-red-500/50 text-red-400 text-[10px] rounded hover:bg-red-500 hover:text-black transition-all font-bold tracking-tighter"
          >
            RETRY
          </button>
        ) : errorMessage ? (
          <div className="ml-2 text-[10px] text-red-500/70 font-mono animate-pulse">
            WAIT {cooldownCountdown}s
          </div>
        ) : (
          <button
            onClick={handleSend}
            disabled={isLoading || isTyping || isDebouncing || (!inputText.trim() && !attachedImage)}
            className={`ml-2 w-12 h-12 md:w-8 md:h-8 rounded shrink-0 flex items-center justify-center transition-colors ${isDebouncing ? 'bg-yellow-900/40 text-yellow-500' : 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-400 hover:text-black disabled:opacity-30 disabled:pointer-events-none'}`}
            title={isDebouncing ? "Wait 5s between requests" : "Send Directive"}
          >
            {isDebouncing ? '⌛' : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l18-7-9 19-3-9-6-3z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
