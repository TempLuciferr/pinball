import React from "react";
import { motion } from "motion/react";

export default function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-chrono-bg">
      {/* Subtle Grid Backdrop matching High Density design parameters exactly */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#444444 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#444444]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#444444]/40 to-transparent" />
      </div>
      <div className="absolute inset-0 isometric-grid opacity-20" />

      {/* Futuristic Frame border container with corner cuts */}
      <div className="absolute inset-4 border border-chrono-panel/60 rounded-lg">
        {/* Top-Left Corner Bracket */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-chrono-dark/40" />
        {/* Top-Right Corner Bracket */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-chrono-dark/40" />
        {/* Bottom-Left Corner Bracket */}
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-chrono-dark/40" />
        {/* Bottom-Right Corner Bracket */}
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-chrono-dark/40" />
      </div>

      {/* Cybernetic Tech Braces & Panels */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Top and side coordinate ticks */}
        <g stroke="#E5E5E5" strokeWidth="1" opacity="0.6">
          <line x1="100" y1="20" x2="100" y2="30" />
          <line x1="200" y1="20" x2="200" y2="26" />
          <line x1="300" y1="20" x2="300" y2="26" />
          <line x1="400" y1="20" x2="400" y2="30" />
          
          <line x1="20" y1="100" x2="30" y2="100" />
          <line x1="20" y1="200" x2="26" y2="200" />
          <line x1="20" y1="300" x2="26" y2="300" />
          <line x1="20" y1="400" x2="30" y2="400" />

          {/* Symmetrical right & bottom ticks */}
          <line x1="calc(100% - 100px)" y1="20" x2="calc(100% - 100px)" y2="30" />
          <line x1="calc(100% - 200px)" y1="20" x2="calc(100% - 200px)" y2="26" />
          <line x1="calc(100% - 300px)" y1="20" x2="calc(100% - 300px)" y2="26" />

          <line x1="calc(100% - 20px)" y1="100" x2="calc(100% - 30px)" y2="100" />
          <line x1="calc(100% - 20px)" y1="200" x2="calc(100% - 26px)" y2="200" />
          <line x1="calc(100% - 20px)" y1="300" x2="calc(100% - 26px)" y2="300" />
        </g>

        {/* Small Plus crosshairs in corners */}
        <g stroke="#444444" strokeWidth="1" opacity="0.4">
          <path d="M 60,80 L 70,80 M 65,75 L 65,85" />
          <path d="M calc(100% - 70px),80 L calc(100% - 60px),80 M calc(100% - 65px),75 L calc(100% - 65px),85" />
          <path d="M 60,calc(100% - 80px) L 70,calc(100% - 80px) M 65,calc(100% - 85px) L 65,calc(100% - 75px)" />
          <path d="M calc(100% - 70px),calc(100% - 80px) L calc(100% - 60px),calc(100% - 80px) M calc(100% - 65px),calc(100% - 85px) L calc(100% - 65px),calc(100% - 75px)" />
        </g>
        
        {/* Subtle center background target reticle near the sphere placement on the right */}
        {/* Center of target is roughly at CX: 72% CY: 50% */}
        <g stroke="#FF1744" strokeWidth="1" opacity="0.12" className="animate-pulse-slow">
          <circle cx="72%" cy="48%" r="180" strokeDasharray="3, 8" fill="none" />
          <circle cx="72%" cy="48%" r="100" strokeDasharray="5, 5" fill="none" />
          <line x1="calc(72% - 220px)" y1="48%" x2="calc(72% - 120px)" y2="48%" />
          <line x1="calc(72% + 120px)" y1="48%" x2="calc(72% + 220px)" y2="48%" />
          <line x1="72%" y1="calc(48% - 220px)" x2="72%" y2="calc(48% - 120px)" />
          <line x1="72%" y1="calc(48% + 120px)" x2="72%" y2="calc(48% + 220px)" />
        </g>

        {/* Framing border tech nodes (Image 2 - section 9/11) */}
        {/* Top border cut path */}
        <path 
          d="M 120,16 L 240,16 L 250,26 L calc(100% - 250px),26 L calc(100% - 240px),16 L calc(100% - 120px),16" 
          fill="none" 
          stroke="#E5E5E5" 
          strokeWidth="1.5"
        />
        
        {/* Bottom border design */}
        <path 
          d="M 150,calc(100% - 16px) L 280,calc(100% - 16px) L 290,calc(100% - 26px) L calc(100% - 290px),calc(100% - 26px) L calc(100% - 280px),calc(100% - 16px) L calc(100% - 150px),calc(100% - 16px)" 
          fill="none" 
          stroke="#E5E5E5" 
          strokeWidth="1.5"
        />

        {/* Corner angled elements representing plate edges (Section 11) */}
        {/* Top-Right angled metal bracket wing */}
        <path d="M calc(100% - 24px),60 L calc(100% - 60px),24" fill="none" stroke="#E5E5E5" strokeWidth="3" />
        <path d="M calc(100% - 16px),72 L calc(100% - 72px),16" fill="none" stroke="#E5E5E5" strokeWidth="1" />
        {/* Bottom-Left angled metal bracket wing */}
        <path d="M 24px,calc(100% - 60px) L 60px,calc(100% - 24px)" fill="none" stroke="#E5E5E5" strokeWidth="3" />
        <path d="M 16px,calc(100% - 72px) L 72px,calc(100% - 16px)" fill="none" stroke="#E5E5E5" strokeWidth="1" />
      </svg>

      {/* Corner Red Hazard Stripes & Tiny Deco elements (Section 12 Decals) */}
      <div className="absolute top-20 left-6 flex flex-col gap-1 opacity-80">
        <div className="w-[2px] h-8 bg-chrono-dark/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-chrono-red animate-ping" />
      </div>

      {/* Decorative vertical hazard bars bottom-left */}
      <div className="absolute bottom-28 left-8 flex gap-1.5 items-center rotate-45">
        <div className="w-3 h-1 bg-chrono-red" />
        <div className="w-3 h-1 bg-chrono-red" />
        <div className="w-3 h-1 bg-chrono-red" />
      </div>

      {/* Decorative metal label block top-center and bottom center */}
      <div className="absolute top-[15px] left-1/2 -translate-x-1/2 px-4 py-0.5 border-x border-chrono-panel bg-chrono-bg/95">
        <span className="text-[9px] text-chrono-dark font-mono tracking-widest uppercase opacity-65">
          CHRONO_CORE_OS_v1.09
        </span>
      </div>

      <div className="absolute bottom-[15px] left-1/2 -translate-x-1/2 px-4 py-0.5 border-x border-chrono-panel bg-chrono-bg/95">
        <span className="text-[9px] text-chrono-dark font-mono tracking-widest uppercase opacity-65">
          SECTOR_07_LAB
        </span>
      </div>

      {/* Elegant HUD framing decor lines near bottom right & left */}
      <div className="absolute bottom-16 right-12 w-32 h-6 border-b border-r border-chrono-panel/80 rounded-br-md opacity-70">
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-chrono-panel" />
      </div>

      <div className="absolute bottom-16 left-12 w-32 h-6 border-b border-l border-chrono-panel/80 rounded-bl-md opacity-70">
        <div className="absolute bottom-0 left-0 w-3 h-3 bg-chrono-panel" />
      </div>

      {/* High Density Corner Coordinates Metadata */}
      <div className="absolute top-0 left-0 p-4 text-[9px] font-mono text-[#444444] opacity-30 select-none leading-relaxed">
        X-COORD: 102.33<br />
        Y-COORD: 890.11
      </div>

      <div className="absolute bottom-0 right-0 p-4 text-[9px] font-mono text-[#444444] opacity-30 text-right select-none leading-relaxed">
        CHRONO_PINBALL_UI_01<br />
        ARCH_DESIGN_P22
      </div>

      {/* High Density Systems Status Flag Bottom-Left Decal */}
      <div className="absolute bottom-5 left-10 flex items-center space-x-2 select-none opacity-40">
        <div className="w-1.5 h-1.5 bg-[#111111] rounded-sm" />
        <div className="w-1.5 h-1.5 bg-[#111111] rounded-sm" />
        <div className="w-4 h-1 bg-[#FF1744]" />
        <span className="text-[8px] uppercase tracking-widest font-mono font-bold text-[#111111] ml-2 animate-pulse">
          ALL SYSTEMS NOMINAL
        </span>
      </div>
    </div>
  );
}
