import React from "react";
import { motion } from "motion/react";

interface PauseMenuContainerProps {
  children: React.ReactNode;
}

export default function PauseMenuContainer({ children }: PauseMenuContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative w-full max-w-[90vw] md:max-w-[460px] max-h-[70vh] md:max-h-none overflow-y-auto bg-[#FAF9F6] border border-[#E0DFDC] p-6 md:p-10 shadow-2xl flex flex-col items-center justify-between z-50 text-chrono-black thin-scrollbar"
      style={{
        clipPath: "polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
      }}
    >
      {/* Visual sci-fi line decorations in upper and lower corners */}
      <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-[#E0DFDC] to-transparent" />
      <div className="absolute bottom-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-[#E0DFDC] to-transparent" />
      
      {/* Double line/corner highlight border effect matching screenshot */}
      <div className="absolute top-1 left-1 w-6 h-6 border-t border-l border-chrono-red/40" />
      <div className="absolute bottom-1 right-1 w-6 h-6 border-b border-r border-chrono-red/40" />

      {children}
    </motion.div>
  );
}
