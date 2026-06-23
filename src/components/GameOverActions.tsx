import React from "react";
import { motion } from "motion/react";
import { 
  BarChart3, ShoppingCart, RotateCcw, LogOut
} from "lucide-react";
import { AudioManager } from "../game/AudioManager";

interface GameOverActionsProps {
  onLeaderboards: () => void;
  onShop: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export default function GameOverActions({
  onLeaderboards,
  onShop,
  onRestart,
  onMainMenu
}: GameOverActionsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 py-4 w-full relative z-10">
      
      {/* 1. LEADERBOARDS BUTTON */}
      <motion.button
        onClick={() => {
          AudioManager.getInstance().playSFX("menu_click");
          onLeaderboards();
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className="h-11 px-6 border border-[#E0DFDC] hover:border-[#111111] text-[#111111] font-hud font-black text-xs tracking-[0.16em] uppercase flex items-center justify-center gap-2.5 bg-white shadow-sm cursor-pointer"
        style={{
          clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        }}
      >
        <BarChart3 className="w-4 h-4 text-chrono-red" />
        <span>LEADERBOARDS</span>
      </motion.button>

      {/* 2. SHOP BUTTON */}
      <motion.button
        onClick={() => {
          AudioManager.getInstance().playSFX("menu_click");
          onShop();
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className="h-11 px-6 border border-[#E0DFDC] hover:border-[#111111] text-[#111111] font-hud font-black text-xs tracking-[0.16em] uppercase flex items-center justify-center gap-2.5 bg-white shadow-sm cursor-pointer"
        style={{
          clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        }}
      >
        <ShoppingCart className="w-4 h-4 text-[#111111]" />
        <span>SHOP</span>
      </motion.button>

      {/* 3. RESTART PRIMARY CTA */}
      <motion.button
        onClick={() => {
          AudioManager.getInstance().playSFX("menu_click");
          onRestart();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="h-[52px] px-10 bg-chrono-red hover:bg-chrono-accent text-white font-hud font-black text-[13px] tracking-[0.25em] uppercase flex items-center justify-center gap-3 relative shadow-lg shadow-chrono-red/20 cursor-pointer"
        style={{
          clipPath: "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        <RotateCcw className="w-4 h-4 text-white" />
        <span>RESTART RUN</span>
      </motion.button>

      {/* 4. MAIN MENU BUTTON */}
      <motion.button
        onClick={() => {
          AudioManager.getInstance().playSFX("menu_back");
          onMainMenu();
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className="h-11 px-6 border border-[#E0DFDC] hover:border-[#111111] text-[#111111] font-hud font-black text-xs tracking-[0.16em] uppercase flex items-center justify-center gap-2.5 bg-white shadow-sm cursor-pointer"
        style={{
          clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        }}
      >
        <LogOut className="w-4 h-4 text-[#111111]" />
        <span>MAIN MENU</span>
      </motion.button>

    </div>
  );
}
