import React from "react";
import { motion } from "motion/react";

export default function LogoSection() {
  return (
    <div className="flex flex-col items-start select-none max-w-full">
      {/* Top Title: CHRONO */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center gap-[1.25em] pl-1"
      >
        <span className="text-[1.15rem] md:text-[2.2rem] font-display font-light text-chrono-black tracking-[0.45em]">
          C H R
        </span>
        
        {/* Customized Chrono timer dial 'O' */}
        <div className="relative w-5 h-5 md:w-8 md:h-8 flex items-center justify-center -ml-2 mr-1">
          <svg viewBox="0 0 40 40" className="w-[18px] h-[18px] md:w-[30px] md:h-[30px] fill-transparent stroke-chrono-black" strokeWidth="4.5">
            <circle cx="20" cy="20" r="15" />
            {/* Clock hand red tick pointing to 2 o'clock */}
            <line x1="20" y1="20" x2="31" y2="11" stroke="#FF1744" strokeWidth="4" strokeLinecap="round" />
            <circle cx="20" cy="20" r="2.5" fill="#FF1744" stroke="none" />
          </svg>
        </div>

        <span className="text-[1.15rem] md:text-[2.2rem] font-display font-light text-chrono-black tracking-[0.45em]">
          N O
        </span>
      </motion.div>

      {/* Main Title: PINBALL in Sharp High-End SVG Vector contour */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
        className="relative w-[220px] md:w-[480px] lg:w-[520px] h-auto my-1.5"
      >
        <svg 
          viewBox="0 0 600 145" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
        >
          {/* Black Side: P I N */}
          <g fill="#111111">
            {/* P */}
            <path d="M 15 15 L 115 15 C 150 15 150 70 115 70 L 60 70 L 60 130 L 15 130 Z M 60 40 L 105 40 C 115 40 115 50 105 50 L 60 50 Z" />
            {/* I */}
            <path d="M 155 15 L 200 15 L 200 130 L 155 130 Z" />
            {/* N */}
            <path d="M 220 15 L 265 15 L 320 85 L 320 15 L 360 15 L 360 130 L 320 130 L 265 60 L 265 130 L 220 130 Z" />
          </g>

          {/* Red Side: B A L L */}
          <g fill="#FF1744">
            {/* B */}
            <path d="M 375 15 L 445 15 C 475 15 475 60 445 65 C 480 70 480 130 445 130 L 375 130 Z M 415 40 L 435 40 C 445 40 445 55 435 55 L 415 55 Z M 415 85 L 435 85 C 445 85 445 105 435 105 L 415 105 Z" />
            {/* A ( futuristic stencil triangle ) */}
            <path d="M 490 15 L 535 15 L 565 130 L 520 130 L 512 85 L 485 85 L 478 130 L 440 130 Z M 490 40 L 480 70 L 510 70 L 500 40 Z" fill="#FF1744" />
            {/* L */}
            <path d="M 565 15 L 600 15 L 585 100 L 610 100 L 605 130 L 545 130 Z" />
          </g>
        </svg>
      </motion.div>

      {/* Subtitle: TIME STOPS. YOU STRIKE. */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="flex items-center gap-3 w-full max-w-[480px] mt-1 pl-1"
      >
        {/* Left Wing Line (Section 9 HUD Decorative Lines) */}
        <div className="flex-1 flex items-center pr-2">
          <div className="h-[1px] bg-chrono-dark/20 flex-1" />
          <svg width="12" height="6" viewBox="0 0 12 6" className="text-chrono-dark/30 stroke-current ml-1" fill="none">
            <path d="M0 5 L8 2 L12 2" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>

        {/* Core Subtitle Text */}
        <span className="text-xs md:text-sm font-mono tracking-[0.25em] text-chrono-dark whitespace-nowrap font-medium">
          TIME STOPS. <span className="text-chrono-red font-bold">YOU STRIKE.</span>
        </span>

        {/* Right Wing Line */}
        <div className="flex-1 flex items-center pl-2">
          <svg width="12" height="6" viewBox="0 0 12 6" className="text-chrono-dark/30 stroke-current mr-1" fill="none">
            <path d="M12 5 L4 2 L0 2" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <div className="h-[1px] bg-chrono-dark/20 flex-1" />
        </div>
      </motion.div>
    </div>
  );
}
