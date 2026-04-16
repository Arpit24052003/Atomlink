"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// --- System Override: Suppress specific THREE.js depreciation warnings from R3F internal loop ---
if (typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (msg.includes('Clock:') && msg.includes('has been deprecated')) {
      return; // Intercept and block
    }
    originalWarn(...args);
  };
}

// Parallax Camera Controller
function CameraRig() {
  useFrame((state) => {
    // Maps standard viewport mouse events to a buttery-smooth 2.5D camera pan vector
    const targetX = (state.pointer.x * 2.5);
    const targetY = (state.pointer.y * 1.5);
    
    // Aggressive lerp fraction (0.02) means it takes time to catch up, yielding that gorgeous cinematic "drift"
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.02);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.02);
    
    // Always anchor focus center screen regardless of pan angle
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// Drifting energy streaks logic
function EnergyStreaks() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    // Removed all constant rotation so the particles rely entirely on randomized floating
  });

  return (
    // Moving the group back to strictly keep ALL particles in front of the camera!
    // Merged into a single particle system with a unified color per user request.
    <group ref={groupRef} position={[0, 0, -5]}>
      <Sparkles 
        count={350} 
        speed={0.6} 
        opacity={0.25} 
        color="#00FFFF" 
        size={18} 
        scale={[50, 40, 10]} 
        noise={3.5}
      />
    </group>
  );
}

export default function DynamicBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 bg-[#000103] pointer-events-none overflow-hidden">
        {/* 
          DEEP SPACE CANVAS (Z-0)
          Renders exclusively behind the solid UI image mask so stars are perfectly blocked by the spaceship bodies.
        */}
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: false, antialias: false }}>
          <ambientLight intensity={0.5} />
          <CameraRig />
          
          <Stars 
            radius={60} 
            depth={50} 
            count={500} 
            factor={2} 
            saturation={0} 
            fade 
            speed={0} 
          />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {/* 
          FOREGROUND PARALLAX CANVAS (Z-20)
          Renders floating OVER the UI mask natively so energy streaks move beautifully in front of the station
          without being blocked. Transparent WebGL GL Alpha.
        */}
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true, antialias: false }}>
          <ambientLight intensity={0.5} />
          <CameraRig />
          
          <EnergyStreaks />
        </Canvas>
      </div>
    </>
  );
}
