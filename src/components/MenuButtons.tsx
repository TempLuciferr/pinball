import React, { useState } from "react";
import { motion } from "motion/react";
import { Target, ShoppingCart, Settings, BarChart2, Play } from "lucide-react";
import { AudioManager } from "../game/AudioManager";

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  isPrimary?: boolean;
  onClick?: () => void;
  tabIndex?: number;
}

export function ActionButton({ label, icon, isPrimary = false, onClick, tabIndex = 0 }: ButtonProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleHover = () => {
    AudioManager.getInstance().playSFX("menu_hover");
  };

  const handlePress = () => {
    AudioManager.getInstance().playSFX("menu_click");
    if (onClick) onClick();
  };

  if (isPrimary) {
    return (
      <motion.button
        tabIndex={tabIndex}
        onClick={handlePress}
        onMouseEnter={handleHover}
        onFocus={() => { setIsFocused(true); handleHover(); }}
        onBlur={() => setIsFocused(false)}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full max-w-[340px] md:max-w-[400px] h-11 md:h-[58px] cursor-pointer outline-none select-none transition-all duration-150 play-btn-clip bg-chrono-red ${
          isFocused ? "chrono-glow-red ring-2 ring-chrono-accent/50 scale-[1.02]" : "chrono-glow-red"
        }`}
      >
        {/* Soft Inner Highlight */}
        <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        
        {/* Play Icon and Label */}
        <div className="flex items-center justify-center gap-4 w-full h-full text-white font-hud font-black tracking-[0.25em] text-lg md:text-xl md:pl-6 pl-4">
          <Play className="w-5 h-5 fill-white stroke-none filter drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] animate-pulse" />
          <span>{label}</span>
        </div>
        
        {/* Framing border accents representing professional game engine design */}
        <div className="absolute left-[14px] top-0 bottom-0 w-[1px] bg-white/10" />
        <div className="absolute right-0 bottom-0 w-3 h-3 bg-white/20 play-btn-clip transform rotate-45 translate-x-2 translate-y-2" />
      </motion.button>
    );
  }

  // Secondary Button Layout with corner markers and left-aligned styling
  return (
    <motion.button
      tabIndex={tabIndex}
      onClick={handlePress}
      onMouseEnter={handleHover}
      onFocus={() => { setIsFocused(true); handleHover(); }}
      onBlur={() => setIsFocused(false)}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full max-w-[340px] md:max-w-[400px] h-10 md:h-12 cursor-pointer outline-none select-none text-chrono-black font-display font-bold tracking-[0.18em] text-sm flex items-center justify-between px-5 bg-[#FCFCFB] border border-[#E0DFDC] group hover:border-chrono-dark/40 ${
        isFocused ? "ring-2 ring-chrono-dark/30 shadow-md bg-white translate-x-1" : "shadow-sm"
      }`}
      style={{
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
      }}
    >
      {/* Light glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Button Body Aligning Icon & Label */}
      <div className="flex items-center gap-4">
        {icon && (
          <div className="text-chrono-dark group-hover:text-chrono-red transition-colors flex items-center justify-center">
            {icon}
          </div>
        )}
        <span className="font-hud uppercase text-[11px] md:text-xs text-chrono-dark group-hover:text-chrono-black transition-colors">
          {label}
        </span>
      </div>

      {/* Right corner angle tag slice marker - Image 2 Section 3 */}
      <div className="relative w-4 h-4 overflow-hidden flex items-end justify-end">
        {/* Custom Red Slash marker */}
        <div 
          className="w-2.5 h-1 bg-chrono-red/20 group-hover:bg-chrono-red transition-colors"
          style={{
            transform: "rotate(-45deg) translate(2px, 5px)",
          }}
        />
        <div 
          className="w-2.5 h-1 bg-chrono-red group-hover:w-3.5 transition-all"
          style={{
            transform: "rotate(-45deg) translate(0px, 7px)",
          }}
        />
      </div>

      {/* Accent edge framing line on hover */}
      <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-transparent group-hover:bg-chrono-red transition-all" />
    </motion.button>
  );
}

interface MenuButtonListProps {
  onSelectOption: (menuType: string) => void;
}

export default function MenuButtonList({ onSelectOption }: MenuButtonListProps) {
  return (
    <div className="flex flex-col gap-2 md:gap-3 w-full items-start pl-1 z-10 max-w-[340px] md:max-w-[400px]">
      
      {/* Primary Action */}
      <ActionButton 
        label="PLAY" 
        isPrimary 
        onClick={() => onSelectOption("PLAY")} 
        tabIndex={1}
      />

      {/* Secondary Actions with associated Icons from Section 10 */}
      <ActionButton
        label="CHALLENGES"
        icon={<Target className="w-4 h-4" strokeWidth={2.2} />}
        onClick={() => onSelectOption("CHALLENGES")}
        tabIndex={2}
      />

      <ActionButton
        label="SHOP"
        icon={<ShoppingCart className="w-4 h-4" strokeWidth={2.2} />}
        onClick={() => onSelectOption("SHOP")}
        tabIndex={3}
      />

      <ActionButton
        label="SETTINGS"
        icon={<Settings className="w-4 h-4" strokeWidth={2.2} />}
        onClick={() => onSelectOption("SETTINGS")}
        tabIndex={4}
      />

      <ActionButton
        label="STATISTICS"
        icon={<BarChart2 className="w-4 h-4" strokeWidth={2.2} />}
        onClick={() => onSelectOption("STATISTICS")}
        tabIndex={5}
      />

      <ActionButton
        label="LEADERBOARDS"
        icon={<BarChart2 className="w-4 h-4" strokeWidth={2.2} />}
        onClick={() => onSelectOption("LEADERBOARDS")}
        tabIndex={6}
      />

    </div>
  );
}
