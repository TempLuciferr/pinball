import React from "react";
import { motion } from "motion/react";

interface PauseMenuButtonProps {
  key?: React.Key;
  label: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick: () => void;
  isFocused?: boolean;
}

export default function PauseMenuButton({
  label,
  icon,
  variant = "secondary",
  onClick,
  isFocused = false
}: PauseMenuButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full h-[48px] px-6 flex items-center justify-center gap-3 font-hud text-xs font-black tracking-[0.2em] uppercase transition-all duration-150 cursor-pointer outline-none ${
        isPrimary
          ? "bg-chrono-red text-white hover:bg-chrono-accent shadow-[0_4px_12px_rgba(255,23,68,0.25)] border-transparent"
          : "bg-white text-chrono-black border border-[#E0DFDC] hover:border-chrono-dark hover:bg-chrono-bg/20"
      } ${
        isFocused ? "ring-2 ring-chrono-red ring-offset-2" : ""
      }`}
      style={{
        clipPath: "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      }}
      aria-label={label}
    >
      {/* Laser glow highlight on primary */}
      {isPrimary && (
        <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      )}

      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      <span className="leading-none mt-0.5">{label}</span>
    </motion.button>
  );
}
