import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import {
  Heart,
  Hourglass,
  Timer,
  RefreshCw,
  Zap,
  Shield,
  HelpCircle,
  Magnet,
  Play,
  Pause,
  ArrowLeft,
  Target,
  Sparkles,
  Sliders,
} from "lucide-react";
import { usePauseMenu } from "./PauseMenuContext";
import PauseMenuOverlay from "./PauseMenuOverlay";
import GameCanvas from "./GameCanvas";
import { AudioManager } from "../game/AudioManager";

import { SaveData } from "../game/SaveSystem";

interface GameplayHUDProps {
  onExit: () => void;
  onOpenShop?: () => void;
  onGameOver?: (stats: {
    score: number;
    wave: number;
    timeSurvived: number;
    turretsDestroyed: number;
    totalChronoUsed: number;
    totalChronoRecovered: number;
    highestSingleKill: number;
    totalBounceBonuses: number;
    perfectWaves: number;
    highestComboReached: number;
    highestComboMultiplier: number;
    totalComboBonusEarned: number;
  }) => void;
  saveData: SaveData;
}

export default function GameplayHUD({
  onExit,
  onOpenShop,
  onGameOver,
  saveData,
}: GameplayHUDProps) {
  const { isPaused, setIsPaused } = usePauseMenu();

  // Game HUD state simulators
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [enemiesLeft, setEnemiesLeft] = useState(0);
  const [wave, setWave] = useState(1);
  const [isTimeFrozen, setIsTimeFrozen] = useState(true);
  const [waveState, setWaveState] = useState<"PLAYING" | "CLEAR_WAIT">(
    "PLAYING",
  );

  // Real HP state from physics engine
  const [playerHp, setPlayerHp] = useState(5);
  const [playerMaxHp, setPlayerMaxHp] = useState(5);

  // Chrono System
  const [chronoEnergy, setChronoEnergy] = useState(100);
  const [totalChronoUsed, setTotalChronoUsed] = useState(0);
  const [totalChronoRecovered, setTotalChronoRecovered] = useState(0);

  // Ability charges (represented as red/empty dots)
  const [piercerCharges, setPiercerCharges] = useState([true, true, false]);
  const [guardCharges, setGuardCharges] = useState([true, true, false]);
  const [slowFieldCharges, setSlowFieldCharges] = useState([
    true,
    false,
    false,
  ]);
  const [magneticCharges, setMagneticCharges] = useState([true, false, false]);

  const [boss, setBoss] = useState<{name: string, hp: number, maxHp: number, hitFlashTimer?: number} | undefined>(undefined);

  const arenaRef = useRef<HTMLDivElement>(null);
  // Stats updater
  const handleStatsChange = (stats: any) => {
    setScore(stats.score);
    setWave(stats.wave);
    setEnemiesLeft(stats.enemiesLeft);
    setIsTimeFrozen(stats.isTimeFrozen);
    setWaveState(stats.waveState);
    setChronoEnergy(stats.chronoEnergy);
    setTotalChronoUsed(stats.totalChronoUsed);
    setTotalChronoRecovered(stats.totalChronoRecovered);
    setMultiplier(stats.currentComboMultiplier || 1.0);
    setBoss(stats.boss);
  };

  const triggerAbility = (
    name: string,
    chargeSetter: React.Dispatch<React.SetStateAction<boolean[]>>,
  ) => {
    if (isPaused) return; // Prevent ability triggers when paused
    AudioManager.getInstance().playSFX("menu_click");
    chargeSetter((prev) => {
      const next = [...prev];
      const activeIdx = next.indexOf(true);
      if (activeIdx !== -1) {
        next[activeIdx] = false;
      } else {
        // Reset/Reload
        return [true, true, false];
      }
      return next;
    });
  };

  return (
    <div
      className="relative w-full h-full z-15 flex flex-col justify-between select-none overflow-hidden text-chrono-black font-sans bg-chrono-bg/95 p-0 md:px-12 md:py-3"
      ref={arenaRef}
    >
      {/* MOBILE COMPACT HUD (<15% height) */}
      <div className="flex md:hidden justify-between items-center bg-[#111111] text-white px-3 py-2 border-b-2 border-chrono-red/50 shadow-md text-[10px] font-mono tracking-wider z-20 shrink-0 h-[10vh] max-h-[60px]">
         <div className="flex flex-col gap-1">
           <div className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-chrono-red fill-chrono-red" /><span>{playerHp}/{playerMaxHp}</span></div>
           <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#FF9100]" /><span>{Math.floor(chronoEnergy)}%</span></div>
         </div>
         <div className="flex flex-col items-center">
            <span className="font-hud font-bold text-chrono-red text-xs">W {wave}</span>
            <span className="text-[9px] opacity-70">LEFT {enemiesLeft}</span>
         </div>
         <div className="flex flex-col items-end">
             <span className="font-hud font-bold text-chrono-red text-[11px]">{score.toLocaleString()}</span>
             {multiplier > 1.0 && (
               <motion.span 
                 key={multiplier}
                 initial={{ scale: 1.5, color: "#FFFFFF" }}
                 animate={{ scale: 1, color: "#FF9100" }}
                 className="text-[10px] font-bold text-[#FF9100]"
               >
                 COMBO x{multiplier.toFixed(1)}
               </motion.span>
             )}
         </div>
         <button 
           onClick={() => setIsPaused(true)}
           className="w-8 h-8 rounded bg-white/10 flex items-center justify-center ml-2 border border-white/20 active:bg-white/20"
         >
           <Pause className="w-4 h-4 fill-white" />
         </button>
      </div>

      {/* 2. TOP HEADERS HUD BAR - MATCHING EXACT DESIGN SPECIFICATIONS */}
      <div className="hidden md:flex flex-row justify-between items-center gap-6 z-10 border-b border-chrono-panel/40 pb-3">
        {/* Left Elements: HP slant and Counter */}
        <div className="flex items-center gap-6">
          <div
            className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              if (onGameOver) {
                AudioManager.getInstance().playSFX("menu_click");
                onGameOver({
                  score: score,
                  wave: wave,
                  timeSurvived: 60,
                  turretsDestroyed: 0,
                  totalChronoUsed: totalChronoUsed,
                  totalChronoRecovered: totalChronoRecovered,
                  highestSingleKill: 0,
                  totalBounceBonuses: 0,
                  perfectWaves: 0,
                  highestComboReached: 0,
                  highestComboMultiplier: 1.0,
                  totalComboBonusEarned: 0,
                });
              }
            }}
            title="Shatter Chrono-Armor / Trigger Game Over (Testing)"
          >
            <div className="flex items-center gap-2">
              <Heart className="w-5.5 h-5.5 text-chrono-red fill-chrono-red filter drop-shadow-[0_0_5px_rgba(255,23,68,0.6)] animate-pulse" />
              <div className="flex gap-1 items-center">
                {[...Array(playerMaxHp)].map((_, idx) => {
                  let bgClass = "bg-chrono-panel";
                  if (idx < playerHp) {
                    bgClass = "bg-chrono-red";
                  } else if (idx === playerHp) {
                    bgClass = "bg-chrono-dark"; // the one that just got lost recently, visual fluff
                  }
                  return (
                    <div
                      key={idx}
                      className={`w-6 h-2 ${bgClass} transition-colors duration-200`}
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <span className="text-[10px] font-mono font-black text-chrono-red tracking-widest mt-1 ml-7 uppercase">
              {playerHp}/{playerMaxHp} SYNTH-ARMOR
            </span>
          </div>

          <div className="h-6 w-px bg-chrono-panel" />

          {/* Symmetrical Hourglass */}
          <div className="flex items-center gap-2 bg-chrono-black/5 px-2.5 py-1 rounded border border-chrono-panel/60">
            <Hourglass className="w-4 h-4 text-chrono-dark animate-[spin_5s_linear_infinite]" />
            <span className="text-sm font-hud font-extrabold text-chrono-black">
              000
            </span>
          </div>
        </div>

        {/* Center elements: Timer & Frozen Status banner */}
        <div className="flex flex-col items-center select-none text-center">
          <div className="flex items-center gap-2 font-hud text-xl font-bold tracking-[0.2em] italic text-[#111111]">
            <Timer className="w-4.5 h-4.5 text-chrono-red animate-pulse" />
            <span>01:23:45</span>
          </div>
          <span
            className={`text-[9px] tracking-[0.22em] uppercase font-mono font-black border border-chrono-red/20 px-3 py-0.5 rounded mt-1 shadow-sm transition-colors ${
              isTimeFrozen
                ? "bg-chrono-red/10 text-chrono-red animate-pulse"
                : "bg-chrono-black text-white"
            }`}
          >
            {isTimeFrozen ? "TIME FROZEN" : "SIMULATING ACTIVE TIME"}
          </span>
        </div>

        {/* Right Elements Score & Multiplier */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[9px] block font-mono font-bold text-chrono-dark/70 tracking-widest uppercase">
              SCORE
            </span>
            <span className="text-lg font-hud font-black text-chrono-black">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="h-6 w-px bg-[#E5E5E2]" />

          <div className="text-right w-[80px]">
             {multiplier > 1.0 && (
               <motion.div
                 key={multiplier}
                 initial={{ scale: 1.2, opacity: 0.8 }}
                 animate={{ scale: 1, opacity: 1 }}
               >
                 <span className="text-[9px] block font-mono font-bold text-[#FF9100] tracking-widest uppercase animate-pulse">
                   COMBO
                 </span>
                 <span className="text-xl font-hud font-black text-[#FF9100] tracking-wider drop-shadow-[0_0_8px_rgba(255,145,0,0.5)]">
                   x{multiplier.toFixed(1)}
                 </span>
               </motion.div>
             )}
          </div>
        </div>
      </div>

      {/* 3. CENTER ACTIVE STRATEGIC FIELD (Wavy crystal lasers, floating bullet traces) */}
      <div className="flex-1 w-full flex md:grid grid-cols-12 gap-4 md:my-2 relative min-h-[380px] items-stretch md:items-center">
        {/* Left: Interactive Vertical Ability Slates with active indicators */}
        <div className="col-span-2 hidden lg:flex flex-col justify-center items-start gap-3.5 z-10 px-2 lg:px-0">
          {/* Ability: PIERCER */}
          <motion.div
            onClick={() => triggerAbility("PIERCER", setPiercerCharges)}
            whileHover={{ scale: 1.04, x: 4 }}
            whileTap={{ scale: 0.96 }}
            className="p-3 bg-white border border-[#E5E4E0] w-full max-w-[124px] rounded flex flex-col items-center justify-between gap-1 shadow-sm hover:border-chrono-red/30 cursor-pointer"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-chrono-bg border border-chrono-panel flex items-center justify-center text-chrono-dark">
              <Target className="w-4 h-4 text-chrono-red" />
            </div>
            <span className="text-[8px] font-hud font-black text-chrono-dark tracking-wider leading-none mt-1">
              PIERCER
            </span>
            <div className="flex gap-1 items-center mt-1">
              {piercerCharges.map((ch, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${ch ? "bg-chrono-red" : "bg-chrono-panel"}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Ability: GUARD SHELL */}
          <motion.div
            onClick={() => triggerAbility("GUARD SHELL", setGuardCharges)}
            whileHover={{ scale: 1.04, x: 4 }}
            whileTap={{ scale: 0.96 }}
            className="p-3 bg-white border border-[#E5E4E0] w-full max-w-[124px] rounded flex flex-col items-center justify-between gap-1 shadow-sm hover:border-chrono-red/30 cursor-pointer"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-chrono-bg border border-chrono-panel flex items-center justify-center text-chrono-dark">
              <Shield className="w-4 h-4 text-chrono-dark" strokeWidth={2.5} />
            </div>
            <span className="text-[8px] font-hud font-black text-chrono-dark tracking-wider leading-none mt-1">
              GUARD SHELL
            </span>
            <div className="flex gap-1 items-center mt-1">
              {guardCharges.map((ch, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${ch ? "bg-chrono-red" : "bg-chrono-panel"}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Ability: SLOW FIELD */}
          <motion.div
            onClick={() => triggerAbility("SLOW FIELD", setSlowFieldCharges)}
            whileHover={{ scale: 1.04, x: 4 }}
            whileTap={{ scale: 0.96 }}
            className="p-3 bg-white border border-[#E5E4E0] w-full max-w-[124px] rounded flex flex-col items-center justify-between gap-1 shadow-sm hover:border-chrono-red/30 cursor-pointer"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-chrono-bg border border-chrono-panel flex items-center justify-center text-chrono-dark">
              <Timer className="w-4 h-4 text-chrono-dark" />
            </div>
            <span className="text-[8px] font-hud font-black text-chrono-dark tracking-wider leading-none mt-1">
              SLOW FIELD
            </span>
            <div className="flex gap-1 items-center mt-1">
              {slowFieldCharges.map((ch, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${ch ? "bg-chrono-red" : "bg-chrono-panel"}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Ability: MAGNETIC CORE */}
          <motion.div
            onClick={() => triggerAbility("MAGNETIC CORE", setMagneticCharges)}
            whileHover={{ scale: 1.04, x: 4 }}
            whileTap={{ scale: 0.96 }}
            className="p-3 bg-white border border-[#E5E4E0] w-full max-w-[124px] rounded flex flex-col items-center justify-between gap-1 shadow-sm hover:border-chrono-red/30 cursor-pointer"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-chrono-bg border border-chrono-panel flex items-center justify-center text-chrono-dark">
              <Magnet className="w-4 h-4 text-chrono-dark" />
            </div>
            <span className="text-[8px] font-hud font-black text-chrono-dark tracking-wider leading-none mt-1">
              MAGNETIC CORE
            </span>
            <div className="flex gap-1 items-center mt-1">
              {magneticCharges.map((ch, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${ch ? "bg-chrono-red" : "bg-chrono-panel"}`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Center: Dynamic Presentation Arena Map */}
        <div className="flex-1 md:col-span-8 lg:col-span-8 relative h-full flex items-center justify-center border-none md:border md:border-dashed border-[#E5E5E2]/40 bg-chrono-bg/10 rounded overflow-visible">
          <GameCanvas
            upgrades={saveData.upgrades}
            onHpChange={(hp, maxHp) => {
              setPlayerHp(hp);
              setPlayerMaxHp(maxHp);
            }}
            onStatsChange={handleStatsChange}
            onGameOver={(stats) => {
              if (onGameOver) {
                AudioManager.getInstance().playSFX("menu_click");
                onGameOver(stats);
              }
            }}
          />
          {waveState === "CLEAR_WAIT" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-chrono-panel border border-chrono-red px-6 py-3 rounded shadow-[0_0_15px_rgba(255,23,68,0.3)]"
              >
                <span className="text-chrono-red font-hud font-black tracking-widest text-xl">
                  WAVE CLEARED
                </span>
              </motion.div>
            </div>
          )}
          
          {boss && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 max-w-lg pointer-events-none z-30">
              <div className="bg-chrono-dark/90 border border-chrono-red/50 p-2 rounded flex flex-col gap-1 relative overflow-hidden">
                {boss.hitFlashTimer && boss.hitFlashTimer > 0 ? (
                  <div className="absolute inset-0 bg-white/40 z-10" />
                ) : null}
                <div className="flex justify-between items-center px-1 z-20">
                   <span className="text-chrono-red font-hud font-black tracking-widest text-sm drop-shadow-md">{boss.name}</span>
                   <span className="text-white font-mono text-xs opacity-80">{Math.ceil((boss.hp / boss.maxHp) * 100)}%</span>
                </div>
                <div className="h-2.5 bg-[#111111] rounded overflow-hidden z-20">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(boss.hp / boss.maxHp) * 100}%` }}
                     transition={{ duration: 0.2 }}
                     className="h-full bg-chrono-red shadow-[0_0_10px_rgba(255,23,68,0.8)]"
                   />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Wave list & Enemies Remaining (2 columns) */}
        <div className="col-span-2 hidden lg:flex flex-col justify-center items-end gap-4 z-10 px-2 lg:px-0">
          {/* Wave count box */}
          <div
            className="p-4 bg-white border border-[#E5E4E0] w-full max-w-[130px] rounded space-y-1 text-center shadow-sm"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            <span className="text-[9px] font-mono font-bold text-chrono-dark/70 tracking-widest block uppercase">
              WAVE
            </span>
            <div className="text-sm font-hud font-black tracking-widest text-[#111111]">
              <span className="text-chrono-red text-base font-extrabold">
                {wave.toString().padStart(2, "0")}
              </span>{" "}
              / 12
            </div>
          </div>

          {/* Enemies left box */}
          <div
            className="p-4 bg-white border border-[#E5E4E0] w-full max-w-[130px] rounded space-y-1 text-center shadow-sm"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            <span className="text-[9px] font-mono font-bold text-chrono-dark/70 tracking-widest block uppercase">
              ENEMIES LEFT
            </span>
            <span className="text-xl md:text-2xl font-hud font-black tracking-wider text-chrono-red block animate-pulse">
              {enemiesLeft}
            </span>
          </div>

          {/* Next wave countdown timer */}
          <div
            className="p-4 bg-white border border-[#E5E4E0] w-full max-w-[130px] rounded space-y-1 text-center shadow-sm"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            <span className="text-[9px] font-mono font-bold text-chrono-dark/70 tracking-widest block uppercase">
              NEXT WAVE
            </span>
            <span className="text-sm md:text-base font-hud font-black text-chrono-black tracking-widest block">
              --:--
            </span>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ACTION CONTROL HUD CONTROLS */}
      <div className="hidden md:flex flex-row justify-between items-center gap-4 pt-3 border-t border-chrono-panel/40 z-10">
        {/* Bottom Left: Energy Charge Indicator Circular dial */}
        <div className="relative flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              AudioManager.getInstance().playSFX("menu_click");
              setScore((prev) => prev + 2500);
              alert("SHATTER BURST ULTIMATE ACTIVATED! Score bonus injected!");
            }}
            className="relative w-16 h-16 rounded-full bg-[#111111] hover:bg-chrono-red shadow-xl flex items-center justify-center text-white cursor-pointer group"
          >
            {/* Spin outer circle representing charge */}
            <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke={
                  chronoEnergy < 10
                    ? "#D50000"
                    : chronoEnergy < 25
                      ? "#FF9100"
                      : "#FF1744"
                }
                strokeWidth="3.5"
                fill="none"
                strokeDasharray="176"
                strokeDashoffset={176 - (176 * chronoEnergy) / 100}
                className={`transition-all duration-300 ${chronoEnergy < 25 ? "animate-pulse" : ""}`}
              />
            </svg>
            <Zap
              className={`w-6 h-6 fill-current text-white ${chronoEnergy < 25 ? "animate-pulse" : ""}`}
            />
          </motion.div>

          <div className="flex flex-col">
            <span
              className={`text-[9px] font-mono font-bold tracking-widest uppercase ${chronoEnergy < 10 ? "text-[#D50000]" : chronoEnergy < 25 ? "text-[#FF9100]" : "text-[#444444]"}`}
            >
              CHRONO ENERGY{" "}
              {chronoEnergy < 10
                ? "CRITICAL"
                : chronoEnergy < 25
                  ? "WARNING"
                  : "STABLE"}
            </span>
            <span className="text-xs font-hud font-extrabold text-[#111111]">
              {Math.floor(chronoEnergy)} / 100
            </span>
          </div>
        </div>

        {/* Bottom Center: Decal styled reminder of Time state direction */}
        <div
          className="px-6 py-2.5 bg-white border border-[#E5E4E0] flex items-center justify-center text-[10px] font-mono font-extrabold tracking-widest text-[#444444] shadow-sm select-none"
          style={{
            clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-chrono-red" />
            <span>TIME ONLY MOVES WHILE YOU DRAG</span>
            <span className="w-1.5 h-1.5 bg-chrono-red" />
          </div>
        </div>

        {/* Bottom Right: pause button back to main protocol selecting or resume */}
        <div className="flex items-center gap-3">
          {/* Pause Trigger */}
          <motion.button
            onClick={() => {
              AudioManager.getInstance().playSFX("menu_back");
              setIsPaused(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-11 px-6 border border-[#E0DFDC] hover:border-chrono-dark text-chrono-dark font-hud font-black text-[11px] tracking-widest flex items-center justify-center gap-2 cursor-pointer bg-white"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
            }}
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            PAUSE SIMULATION
          </motion.button>
        </div>
      </div>

      {/* SVG Definitions for Crystal shards styling */}
      <svg className="hidden">
        <defs>
          <radialGradient id="crystal-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF1744" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F6F5F2" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Portal Overlay Renderer */}
      <PauseMenuOverlay
        onResume={() => setIsPaused(false)}
        onRestart={() => {
          // We can't really restart physics easily here without destroying game object,
          // triggering game over with 0 is an okay way, or we can just ignore it for now
          AudioManager.getInstance().playSFX("menu_click");
          setIsPaused(false);
          if (onGameOver) {
            onGameOver({
              score: 0,
              wave: 1,
              timeSurvived: 0,
              turretsDestroyed: 0,
              totalChronoUsed: 0,
              totalChronoRecovered: 0,
              highestSingleKill: 0,
              totalBounceBonuses: 0,
              perfectWaves: 0,
              highestComboReached: 0,
              highestComboMultiplier: 1.0,
              totalComboBonusEarned: 0,
            });
          }
        }}
        onOpenSettings={() => {
          AudioManager.getInstance().playSFX("menu_back");
          alert(
            "CHRONO SETTINGS ACCESSED\nAdjusting graphic fidelity/volume parameters.",
          );
        }}
        onOpenProtocolMenu={() => {
          setIsPaused(false);
          if (onOpenShop) {
            onOpenShop();
          } else {
            onExit();
          }
        }}
        onQuit={() => {
          setIsPaused(false);
          if (onGameOver) {
            onGameOver({
              score: score,
              wave: wave,
              timeSurvived: 0,
              turretsDestroyed: 0,
              totalChronoUsed: totalChronoUsed,
              totalChronoRecovered: totalChronoRecovered,
              highestSingleKill: 0,
              totalBounceBonuses: 0,
              perfectWaves: 0,
              highestComboReached: 0,
              highestComboMultiplier: 1.0,
              totalComboBonusEarned: 0,
            });
          } else {
            onExit();
          }
        }}
      />
    </div>
  );
}
