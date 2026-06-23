import React from "react";
import { motion } from "motion/react";

export default function ChronoSphere() {
  return (
    <div className="relative flex items-center justify-center select-none w-[100px] h-[100px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] z-10">
      
      {/* Detached Soft Floor Shadow underneath the float sphere */}
      <motion.div 
        className="absolute bottom-[-15px] md:bottom-[-25px] w-[60%] h-[12px] md:h-[20px] bg-black/35 rounded-full blur-[10px] md:blur-[16px] pointer-events-none"
        animate={{ 
          scaleX: [1, 0.85, 1],
          scaleY: [1, 0.75, 1],
          opacity: [0.65, 0.45, 0.65] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 6, 
          ease: "easeInOut" 
        }}
      />

      {/* Floating Chrome Pinball Sphere - Image 2 Section 4 */}
      <motion.div
        animate={{ 
          y: [0, -14, 0],
          rotate: [0, 4, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 6, 
          ease: "easeInOut" 
        }}
        className="chrome-sphere w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] group"
      >
        {/* SVG highlight overlay layer for pristine 3D reflections */}
        <svg 
          viewBox="0 0 300 300" 
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Top specular highlight gradient */}
            <linearGradient id="specular-gloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Bottom metallic rim light */}
            <linearGradient id="rim-gradient" x1="1" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            {/* Dark contrast crescent for real-world metal reflection cutoff */}
            <radialGradient id="dark-reflection" cx="65%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#444444" stopOpacity="0" />
              <stop offset="70%" stopColor="#111111" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#000000" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Deep dark backing reflection band */}
          <circle cx="150" cy="150" r="146" fill="url(#dark-reflection)" opacity="0.9" />

          {/* Inner metallic reflection rings - Section 4 detail */}
          <circle 
            cx="150" 
            cy="150" 
            r="125" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="2.5" 
            strokeDasharray="40 180" 
            opacity="0.35" 
            transform="rotate(-40 150 150)" 
          />
          <circle 
            cx="150" 
            cy="150" 
            r="135" 
            fill="none" 
            stroke="#111111" 
            strokeWidth="3" 
            strokeDasharray="100 200" 
            opacity="0.5" 
            transform="rotate(60 150 150)" 
          />

          {/* Top-Left Specular Core Crescent Highlight (Image 1 glossy reflection) */}
          <path 
            d="M 50,110 C 65,70 110,40 160,40 C 200,40 230,55 245,80 C 215,65 170,55 125,70 C 85,85 62,100 50,110 Z" 
            fill="url(#specular-gloss)" 
            opacity="0.75" 
          />

          {/* Secondary small pinpoint glare at top-right */}
          <circle cx="105" cy="105" r="16" fill="#ffffff" opacity="0.6" filter="blur(2px)" />
          <circle cx="95" cy="95" r="5" fill="#ffffff" opacity="0.85" />

          {/* Symmetrical crescent bounce light on bottom edge */}
          <path 
            d="M 60,190 C 80,230 120,260 170,260 C 220,260 250,230 260,195 C 235,215 195,225 155,220 C 115,215 80,205 60,190 Z" 
            fill="url(#rim-gradient)" 
            opacity="0.6" 
          />

          {/* Tactical cyber reticle overlaid directly on the Chrome Sphere bounding box */}
          <circle 
            cx="150" 
            cy="150" 
            r="142" 
            fill="none" 
            stroke="#FF1744" 
            strokeWidth="1.5" 
            strokeDasharray="10, 4, 3, 4" 
            className="animate-spin-slow opacity-15" 
          />

          <circle 
            cx="150" 
            cy="150" 
            r="148" 
            fill="none" 
            stroke="#FF1744" 
            strokeWidth="1" 
            strokeDasharray="3, 30" 
            className="animate-spin-reverse opacity-25" 
          />
        </svg>

        {/* Real-world reflection glaze details from Tailwind styles */}
        <div className="chrome-reflection" />
        <div className="chrome-core" />
        <div className="chrome-rim-light" />

        {/* Dynamic Glass sweep shine effect on mouse hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
      </motion.div>
    </div>
  );
}
