import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface ScoreCardProps {
  score: number;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);

  // Score count-up animation
  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) return;

    const totalDuration = 1000; // 1 second
    const incrementTime = 20;
    const totalSteps = totalDuration / incrementTime;
    const stepValue = end / totalSteps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div
      className="bg-white border border-[#E0DFDC] p-5 text-center flex-1 min-w-[180px] shadow-sm relative flex flex-col justify-center items-center"
      style={{
        clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
      }}
    >
      <span className="text-[10px] font-hud font-black tracking-[0.25em] text-[#444444] uppercase mb-1">
        FINAL SCORE
      </span>
      <h3 className="text-3xl font-hud font-black text-chrono-red tracking-wider my-1">
        {displayScore.toLocaleString()}
      </h3>
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 120 }}
        className="text-[9px] font-mono font-black text-chrono-red tracking-widest uppercase flex items-center gap-1.5 mt-1"
      >
        NEW BEST! 🎉
      </motion.p>
    </div>
  );
}
