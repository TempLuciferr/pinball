import React, { useState } from "react";
import { motion } from "motion/react";
import { Film, Play, RotateCcw } from "lucide-react";
import { AudioManager } from "../game/AudioManager";

interface RevivePanelProps {
  onReviveSuccess: () => void;
  onQuit: () => void;
}

export default function RevivePanel({ onReviveSuccess, onQuit }: RevivePanelProps) {
  const [remaining, setRemaining] = useState(3);

  const handleReviveClick = () => {
    AudioManager.getInstance().playSFX("menu_click");
    if (remaining > 0) {
      setRemaining(prev => prev - 1);
      // Simulate watching ad briefly
      alert("TEMPORAL SHIELD RECHARGING\nWatching simulation diagnostics. Resuming active wave shortly.");
      onReviveSuccess();
    } else {
      alert("NO REVIVES REMAINING TODAY\nPurchase additional backup credits in the shop panel.");
    }
  };

  return (
    <div 
      className="bg-white border border-[#E0DFDC] p-5 shadow-sm relative flex flex-col justify-between flex-1 text-center"
      style={{
        clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
      }}
    >
      <div className="space-y-4 flex flex-col justify-between h-full">
        {/* Header warnings */}
        <div>
          <span className="text-xs font-hud font-black tracking-[0.2em] text-chrono-red block uppercase mb-1">
            DON'T GIVE UP!
          </span>
          <p className="text-[10px] text-[#444444] font-sans font-bold leading-relaxed px-2">
            Revive and start this turn with all bullets frozen for 30 seconds.
          </p>
        </div>

        {/* Center button action with remaining status label option */}
        <div className="space-y-3.5 my-3">
          
          {/* Animated Revive Button */}
          <motion.button
            onClick={handleReviveClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-11 bg-chrono-red hover:bg-chrono-accent text-white flex items-center justify-center gap-2.5 font-hud text-[11px] font-black tracking-widest uppercase relative shadow-lg shadow-chrono-red/20 cursor-pointer outline-none"
            style={{
              clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            {/* Specular shimmer */}
            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <Film className="w-4 h-4 fill-white stroke-none animate-bounce" />
            <span className="leading-none mt-0.5">WATCH AD TO REVIVE</span>
          </motion.button>

          <span className="text-[9px] font-mono font-bold tracking-widest text-chrono-dark/70 block uppercase">
            REMAINING TODAY: {remaining} / 3
          </span>

        </div>

        {/* Quit trigger */}
        <button
          onClick={() => {
            AudioManager.getInstance().playSFX("menu_back");
            onQuit();
          }}
          className="w-full py-2.5 border border-[#E0DFDC] hover:border-chrono-dark text-chrono-dark hover:bg-chrono-bg/10 select-none cursor-pointer font-hud text-[10px] font-black tracking-widest uppercase transition-all"
          style={{
            clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          NO THANKS, QUIT
        </button>

      </div>
    </div>
  );
}
