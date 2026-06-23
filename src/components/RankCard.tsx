import React from "react";
import { motion } from "motion/react";

interface RankCardProps {
  rank?: "S" | "A" | "B" | "C" | "D";
}

export default function RankCard({ rank = "S" }: RankCardProps) {
  return (
    <div
      className="bg-white border border-[#E0DFDC] p-5 text-center w-[120px] shadow-sm relative flex flex-col justify-center items-center"
      style={{
        clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
      }}
    >
      <span className="text-[10px] font-hud font-black tracking-[0.25em] text-[#444444] uppercase mb-2">
        RANK
      </span>

      {/* Hexagonal rank badge */}
      <motion.div
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", damping: 12, delay: 0.4 }}
        className="relative w-16 h-16 flex items-center justify-center cursor-pointer group"
      >
        {/* Outer glowing red polygon */}
        <div 
          className="absolute inset-0 bg-[#FF1744] hover:scale-105 transition-transform duration-300"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
          }}
        />
        
        {/* Inner black polygon */}
        <div 
          className="absolute inset-[3px] bg-[#111111]"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
          }}
        />

        {/* Dynamic bright rank character */}
        <span className="relative z-10 font-hud text-3xl font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(255,23,68,0.8)]">
          {rank}
        </span>
      </motion.div>
    </div>
  );
}
