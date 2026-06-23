import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Settings, BarChart2, LogOut } from "lucide-react";
import PauseMenuBackdrop from "./PauseMenuBackdrop";
import PauseMenuContainer from "./PauseMenuContainer";
import PauseMenuButton from "./PauseMenuButton";
import { usePauseMenu } from "./PauseMenuContext";

interface PauseMenuOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onOpenProtocolMenu: () => void;
  onQuit: () => void;
}

export default function PauseMenuOverlay({
  onResume,
  onRestart,
  onOpenSettings,
  onOpenProtocolMenu,
  onQuit
}: PauseMenuOverlayProps) {
  const { isPaused, setIsPaused } = usePauseMenu();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const menuActions = [
    { label: "Resume", icon: <Play className="w-4 h-4 fill-white stroke-none" />, variant: "primary" as const, action: onResume },
    { label: "Restart Protocol", icon: <RotateCcw className="w-4 h-4" />, variant: "secondary" as const, action: onRestart },
    { label: "Settings", icon: <Settings className="w-4 h-4" />, variant: "secondary" as const, action: onOpenSettings },
    { label: "Protocol Menu", icon: <BarChart2 className="w-4 h-4" />, variant: "secondary" as const, action: onOpenProtocolMenu },
    { label: "Quit to Main Menu", icon: <LogOut className="w-4 h-4" />, variant: "secondary" as const, action: onQuit }
  ];

  // Enable arrow-key selection & trigger mechanism
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPaused) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % menuActions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + menuActions.length) % menuActions.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        menuActions[focusedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, focusedIndex]);

  if (!isPaused) return null;

  return (
    <PauseMenuBackdrop>
      <PauseMenuContainer>
        {/* Title area */}
        <div className="text-center w-full mb-8">
          <h2 className="text-3xl md:text-4xl font-hud font-black tracking-[0.25em] text-chrono-black uppercase mb-2">
            PAUSED
          </h2>
          
          <div className="flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-chrono-panel/80" />
            <span className="text-[10px] md:text-xs font-mono font-black tracking-[0.22em] text-[#FF1744] uppercase">
              TIME IS FROZEN
            </span>
            <span className="w-6 h-px bg-chrono-panel/80" />
          </div>
        </div>

        {/* Dynamic button stack with arrow selection indicators */}
        <div 
          ref={containerRef}
          className="w-full space-y-3"
          role="menu"
          aria-label="Pause Menu Options"
        >
          {menuActions.map((item, idx) => (
            <PauseMenuButton
              key={idx}
              label={item.label}
              icon={item.icon}
              variant={item.variant}
              isFocused={focusedIndex === idx}
              onClick={() => {
                setFocusedIndex(idx);
                item.action();
              }}
            />
          ))}
        </div>

        {/* Small accessibility & support helper */}
        <div className="w-full text-center mt-6 select-none opacity-40 font-mono text-[9px] uppercase tracking-widest text-chrono-dark">
          ▲▼ navigation • [Enter] select • [p / esc] toggle
        </div>
      </PauseMenuContainer>
    </PauseMenuBackdrop>
  );
}
