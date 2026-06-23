import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface LevelProgressBarProps {
  currentXp?: number;
  maxXp?: number;
  currentLevel?: number;
  nextLevel?: number;
}

export default function LevelProgressBar({
  currentXp = 2150,
  maxXp = 3000,
  currentLevel = 12,
  nextLevel = 13
}: LevelProgressBarProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Fill animation after mounting
    const timer = setTimeout(() => {
      setPercent((currentXp / maxXp) * 100);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentXp, maxXp]);

  return (
    <div 
      className="bg-white border border-[#E0DFDC] p-4 shadow-sm relative flex flex-col justify-center w-full"
      style={{
        clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
      }}
    >
      <div className="space-y-2">
        {/* Stats row */}
        <div className="flex justify-between items-center text-[9px] font-mono font-bold text-chrono-dark/80 tracking-wide">
          <span>LEVEL PROGRESS</span>
          <span className="text-chrono-red">{currentXp.toLocaleString()} / {maxXp.toLocaleString()} XP</span>
        </div>

        {/* Outer Bar */}
        <div className="relative h-2 bg-chrono-panel rounded overflow-hidden">
          {/* Animated Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-0 bottom-0 left-0 bg-chrono-red"
          />
        </div>

        {/* Labels row */}
        <div className="flex justify-between items-center text-[10px] font-mono font-black text-chrono-dark">
          <span>LVL {currentLevel}</span>
          <span>LVL {nextLevel}</span>
        </div>
      </div>
    </div>
  );
}
