import React, { useState, useEffect } from "react";
import { Heart, Hourglass, Timer, Plus, Shield } from "lucide-react";
import { motion } from "motion/react";

export default function TopStatusBar({ cores }: { cores?: number }) {
  const [time, setTime] = useState({ hrs: 1, mins: 23, secs: 45 });
  const [cash, setCash] = useState(cores ?? 1250);

  useEffect(() => {
    if (cores !== undefined) {
      setCash(cores);
    }
  }, [cores]);

  const [healthSegmentHover, setHealthSegmentHover] = useState<number | null>(null);

  // Tick the timer slowly for ultra-authentic look
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let s = prev.secs + 1;
        let m = prev.mins;
        let h = prev.hrs;
        if (s >= 60) {
          s = 0;
          m += 1;
        }
        if (m >= 60) {
          m = 0;
          h += 1;
        }
        return { hrs: h, mins: m, secs: s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="relative w-full z-10 flex flex-col md:flex-row justify-between items-center gap-4 px-12 pt-6 pb-2 text-chrono-black font-mono select-none">
      
      {/* Top Left: Health, Stability status & Resources */}
      <div className="flex items-center gap-6">
        {/* Vital Health Indicator */}
        <div className="flex items-center gap-2">
          {/* Heart Icon (Section 10 Custom style wrapper) */}
          <motion.div 
            whileHover={{ scale: 1.15 }}
            className="text-chrono-red flex items-center justify-center cursor-pointer"
          >
            <Heart className="w-[18px] h-[18px] fill-chrono-red stroke-chrono-red filter drop-shadow-[0_0_4px_rgba(255,23,68,0.5)]" />
          </motion.div>

          {/* Slanted Health Segments - Image 2 Section 2.1 */}
          <div className="flex gap-1 items-center">
            {[...Array(6)].map((_, idx) => {
              // Exact health segments state: 4 fully active red, 1 partial dark, 1 empty gray.
              let bgClass = "bg-chrono-panel";
              if (idx < 4) {
                bgClass = "bg-chrono-red";
              } else if (idx < 5) {
                bgClass = "bg-chrono-dark";
              }

              return (
                <div
                  key={idx}
                  className={`relative w-6 h-2 transition-all duration-200 cursor-help ${bgClass}`}
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  }}
                  onMouseEnter={() => setHealthSegmentHover(idx)}
                  onMouseLeave={() => setHealthSegmentHover(null)}
                >
                  {/* Subtle glass reflection across bars */}
                  <div className="absolute inset-x-0 top-0 h-[30%] bg-white/20" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-4 w-px bg-chrono-panel" />

        {/* High Density Core Stability label */}
        <div className="text-[10px] font-bold tracking-widest text-[#444444]">
          <span className="text-[#111111]">CORE_STABILITY:</span> 0.64
        </div>

        {/* Resource Hourglass count */}
        <div className="flex items-center gap-1.5 bg-chrono-bg/50 px-2.5 py-1 rounded border border-chrono-panel/50">
          <Hourglass className="w-4 h-4 text-chrono-dark animate-[spin_6s_linear_infinite]" strokeWidth={2.5} />
          <span className="text-sm font-hud font-bold tracking-wider text-chrono-dark">
            000
          </span>
        </div>
      </div>

      {/* Top Center: Live Run Timer with "Temporal Synchronization" subtitle */}
      <div className="flex flex-col items-center">
        <motion.div 
          className="flex items-center gap-2 text-[#111111]"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-2xl font-black tracking-[0.2em] italic">
            {formatNum(time.hrs)}:{formatNum(time.mins)}:{formatNum(time.secs)}
          </span>
        </motion.div>
        <span className="text-[8px] tracking-[0.3em] uppercase opacity-50 font-sans font-bold text-chrono-dark mt-0.5">
          Temporal Synchronization
        </span>
      </div>

      {/* Top Right: Hexagonal Coin Currency with Credits label */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-xs font-bold tracking-wider text-[#111111]">
            {cash.toLocaleString()} <span className="text-chrono-red">CR</span>
          </div>
          <div className="text-[9px] opacity-40 uppercase font-bold text-[#444444]">Credits</div>
        </div>

        <motion.div 
          className="flex items-center gap-2 bg-chrono-bg/50 px-3 py-1 rounded border border-chrono-panel/80 hover:border-chrono-red/40 transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          {/* Symmetrical Hexagon custom coin icon from SVG */}
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-chrono-dark fill-transparent" strokeWidth="2.5">
              <polygon points="12 2, 21 7.2, 21 16.8, 12 22, 3 16.8, 3 7.2" />
              <circle cx="12" cy="12" r="4" className="fill-chrono-red" />
            </svg>
          </div>
        </motion.div>

        {/* Quick Add Button */}
        <motion.button
          onClick={() => setCash((prev) => prev + 100)}
          className="w-6 h-6 rounded-full bg-chrono-red text-white flex items-center justify-center hover:bg-chrono-accent cursor-pointer border border-transparent shadow shadow-chrono-red/30 focus:outline-none focus:ring-1 focus:ring-chrono-red"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          title="Add credits (Test Interaction)"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
        </motion.button>
      </div>

    </div>
  );
}
