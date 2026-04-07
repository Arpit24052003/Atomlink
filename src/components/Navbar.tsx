"use client";

import React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  playInteractionSound: () => void;
}

export default function Navbar({ activeTab, setActiveTab, playInteractionSound }: NavbarProps) {
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const tabs = [
    { id: "home", label: "HOME" },
    { id: "overview", label: "OVERVIEW" },
    { id: "capabilities", label: "CAPABILITIES" },
    { id: "signin", label: isSignedIn ? "VERIFIED" : "SIGN IN" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-12 mt-6 mr-10 text-[13px] tracking-widest uppercase font-semibold drop-shadow-md">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isHome = tab.id === "home";

          return (
            <button
              key={tab.id}
              onClick={() => {
                playInteractionSound();
                setActiveTab(tab.id);
              }}
              className={`
                pb-2 transition-all duration-300 outline-none border-b-2
                ${isActive ? "text-cyan-200 border-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" : "text-gray-400 border-transparent hover:text-cyan-100 group"}
                ${isHome && !isActive ? "drop-shadow-[0_0_12px_rgba(0,255,255,0.6)] text-cyan-100" : ""}
              `}
            >
              {tab.label}
            </button>
          );
        })}
        
        {isSignedIn && (
          <div className="pl-4 border-l border-cyan-500/30">
            <UserButton appearance={{ baseTheme: dark }} />
          </div>
        )}
      </nav>

      {/* Mobile Hamburger Toggle */}
      <div className="md:hidden flex items-center pr-4 mt-4 z-[60]">
        <button 
          onClick={() => {
            playInteractionSound();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          className="text-cyan-400 hover:text-cyan-200 p-2"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Fullscreen Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-50 bg-[#000810]/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 border-t border-cyan-500/20"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playInteractionSound();
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-xl font-mono tracking-[0.2em] uppercase transition-colors ${activeTab === tab.id ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'text-gray-500 hover:text-cyan-100'}`}
              >
                {tab.label}
              </button>
            ))}
            
            {isSignedIn && (
               <div className="mt-8 scale-150 border flex p-1 border-cyan-500/30 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                 <UserButton appearance={{ baseTheme: dark }} />
               </div>
            )}
            <p className="absolute bottom-10 text-[10px] text-cyan-500/30 tracking-widest uppercase font-mono">End of Relay</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
