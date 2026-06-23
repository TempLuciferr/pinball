import React from "react";
import { motion } from "motion/react";

interface PauseMenuBackdropProps {
  children: React.ReactNode;
}

export default function PauseMenuBackdrop({ children }: PauseMenuBackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-[#111111]/35 backdrop-blur-[4px] flex items-center justify-center p-4 overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
