import React, { createContext, useContext, useState, useEffect } from "react";

interface PauseMenuContextValue {
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

const PauseMenuContext = createContext<PauseMenuContextValue | undefined>(undefined);

export const usePauseMenu = () => {
  const context = useContext(PauseMenuContext);
  if (!context) {
    throw new Error("usePauseMenu must be used within a PauseMenuProvider");
  }
  return context;
};

export const PauseMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPaused, setIsPaused] = useState(false);

  // Keyboard navigation support: 'P' to Pause/Resume, 'Escape' to Pause/Resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        setIsPaused((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <PauseMenuContext.Provider value={{ isPaused, setIsPaused }}>
      {children}
    </PauseMenuContext.Provider>
  );
};
