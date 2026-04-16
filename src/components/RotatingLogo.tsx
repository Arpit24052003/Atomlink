"use client";

import React from "react";
import { motion } from "framer-motion";

interface RotatingLogoProps {
  size?: number;
  glowColor?: string;
}

export default function RotatingLogo({ size = 48, glowColor = "rgba(0, 255, 255, 0.4)" }: RotatingLogoProps) {
  return (
    <div 
      className="relative flex items-center justify-center pointer-events-none"
      style={{ width: size, height: size }}
    >
      {/* Background Pulse */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: glowColor, filter: "blur(8px)" }}
      />
      
      {/* The Rotating Hub */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Orbital Ring */}
        <div 
          className="absolute inset-0 border border-white/20 rounded-full"
          style={{ boxShadow: `inset 0 0 10px ${glowColor}` }}
        />
        
        {/* The Actual Logo Image */}
        <img 
          src="/Assets/Images/Logo_transparent.png?update=1" 
          alt="Atomlink" 
          className="w-[70%] h-[70%] object-contain opacity-90"
        />
        
        {/* Glowing Node */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"
        />
      </motion.div>
    </div>
  );
}
