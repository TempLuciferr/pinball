import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Heart, Hourglass, Timer, RefreshCw, Zap, Shield, Magnet, ArrowRight,
  Sparkles, Flame, Target, Compass, CornerRightDown, Play, ChevronRight, ChevronLeft
} from "lucide-react";

import { SaveData, Upgrades } from "../game/SaveSystem";
import { AudioManager } from "../game/AudioManager";

interface UpgradeItem {
  id: keyof Upgrades;
  name: string;
  desc: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
  icon: "shatter" | "dilation" | "crit" | "reflex";
}

interface LoadoutSkill {
  name: string;
  charges: boolean[];
  icon: React.ReactNode;
}

interface UpgradeShopPageProps {
  onContinue: () => void;
  onRefreshCallback?: () => void;
  saveData: SaveData;
  setSaveData: React.Dispatch<React.SetStateAction<SaveData>>;
}

export default function UpgradeShopPage({ onContinue, onRefreshCallback, saveData, setSaveData }: UpgradeShopPageProps) {
  const [selectedId, setSelectedId] = useState<keyof Upgrades>("launchThrusters");
  const [wave, setWave] = useState(7);
  const [countdown, setCountdown] = useState(10);

  // Dynamic upgrade states matching screenshot parameters exactly
  const upgrades: UpgradeItem[] = [
    {
      id: "launchThrusters",
      name: "LAUNCH THRUSTERS",
      desc: "Increase launch force multiplier.",
      baseCost: 120,
      costMultiplier: 1.7,
      maxLevel: 5,
      icon: "shatter"
    },
    {
      id: "chronoEfficiency",
      name: "CHRONO EFFICIENCY",
      desc: "Reduce chrono energy drain during time slow.",
      baseCost: 100,
      costMultiplier: 1.8,
      maxLevel: 5,
      icon: "dilation"
    },
    {
      id: "chronoSiphon",
      name: "CHRONO SIPHON",
      desc: "Increase chrono energy recovered per kill.",
      baseCost: 120,
      costMultiplier: 1.8,
      maxLevel: 5,
      icon: "crit"
    },
    {
      id: "elasticHull",
      name: "ELASTIC HULL",
      desc: "Increase restitution (bounciness).",
      baseCost: 150,
      costMultiplier: 2.0,
      maxLevel: 3,
      icon: "reflex"
    },
    {
      id: "frictionlessCoating",
      name: "FRICTIONLESS COAT",
      desc: "Reduce velocity damping over time.",
      baseCost: 250,
      costMultiplier: 2.5,
      maxLevel: 3,
      icon: "shatter"
    }
  ];

  const getCost = (item: UpgradeItem) => {
    const level = saveData.upgrades[item.id];
    if (level >= item.maxLevel) return "MAX";
    return Math.floor(item.baseCost * Math.pow(item.costMultiplier, level));
  };

  // Symmetrical active loadouts preview state
  const loadouts: LoadoutSkill[] = [
    { name: "PIERCER", charges: [true, true, false], icon: <Target className="w-4 h-4 text-chrono-red" /> },
    { name: "SLOW FIELD", charges: [true, true, false], icon: <Timer className="w-4 h-4 text-chrono-black" /> },
    { name: "GUARD SHELL", charges: [true, true, false], icon: <Shield className="w-4 h-4 text-chrono-dark" /> },
    { name: "MAGNETIC CORE", charges: [true, true, false], icon: <Magnet className="w-4 h-4 text-chrono-dark" /> }
  ];

  const getPreviewStats = () => {
    const level = saveData.upgrades[selectedId] || 0;
    const nextLevel = level + 1;
    let label = "";
    let valCurrent: string | number = "";
    let valNext: string | number = "";
    let isMax = false;
    let maxLevel = 0;

    switch (selectedId) {
      case "launchThrusters":
        label = "LAUNCH FORCE";
        valCurrent = (0.15 + 0.01 * level).toFixed(2);
        valNext = (0.15 + 0.01 * nextLevel).toFixed(2);
        maxLevel = 5;
        break;
      case "elasticHull":
        label = "BOUNCINESS";
        valCurrent = (0.80 + 0.04 * level).toFixed(2);
        valNext = (0.80 + 0.04 * nextLevel).toFixed(2);
        maxLevel = 3;
        break;
      case "chronoEfficiency":
        label = "ENERGY DRAIN";
        valCurrent = (25 - 2 * level).toString();
        valNext = (25 - 2 * nextLevel).toString();
        maxLevel = 5;
        break;
      case "chronoSiphon":
        label = "ENERGY RECOVERY";
        valCurrent = Math.min(50, 30 + 5 * level).toString();
        valNext = Math.min(50, 30 + 5 * nextLevel).toString();
        maxLevel = 5;
        break;
      case "frictionlessCoating":
        label = "DAMPING";
        valCurrent = (0.985 + 0.002 * level).toFixed(3);
        valNext = (0.985 + 0.002 * nextLevel).toFixed(3);
        maxLevel = 3;
        break;
    }

    isMax = level >= maxLevel;

    return {
      label,
      current: valCurrent,
      next: isMax ? "MAX" : valNext,
      isMax
    };
  };

  const previewStats = getPreviewStats();

  const handleCardSelect = (id: keyof Upgrades) => {
    AudioManager.getInstance().playSFX("menu_click");
    setSelectedId(id);
  };

  const buyUpgrade = (upgrade: UpgradeItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card selection redundant sound
    const cost = getCost(upgrade);
    if (cost === "MAX") return;
    
    if (saveData.cores >= cost) {
      AudioManager.getInstance().playSFX("upgrade");
      
      setSaveData(prev => {
        const nextLevel = prev.upgrades[upgrade.id] + 1;
        return {
          ...prev,
          cores: prev.cores - cost,
          upgrades: {
            ...prev.upgrades,
            [upgrade.id]: nextLevel
          }
        };
      });
      
    } else {
      AudioManager.getInstance().playSFX("menu_back");
      alert("INSUFFICIENT CHRONO CORES\nComplete active protocol waves to earn core currency.");
    }
  };

  const currentCores = saveData.cores;

  return (
    <div className="relative w-full h-full z-15 flex flex-col justify-between select-none overflow-hidden text-chrono-black font-sans bg-chrono-bg/95 p-4 md:px-12 py-3">
      
      {/* 1. TOP BAR HUD PREVIEW */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 z-10 border-b border-chrono-panel/40 pb-3">
        
        {/* Left HP layout */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Heart className="w-5.5 h-5.5 text-chrono-red fill-chrono-red" />
              <div className="flex gap-1 items-center">
                {[...Array(6)].map((_, idx) => {
                  let bgClass = "bg-chrono-panel";
                  if (idx < 4) {
                    bgClass = "bg-chrono-red";
                  } else if (idx < 5) {
                    bgClass = "bg-chrono-dark";
                  }
                  return (
                    <div
                      key={idx}
                      className="w-6 h-2 bg-chrono-red"
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                    />
                  );
                })}
              </div>
            </div>
            <span className="text-[10px] font-mono font-black text-chrono-red tracking-widest mt-1 ml-7">
              7/10 HP
            </span>
          </div>

          <div className="h-6 w-px bg-chrono-panel" />

          {/* Symmetrical Hourglass */}
          <div className="flex items-center gap-2 bg-[#E5E5E2]/30 px-2.5 py-1 rounded border border-chrono-panel/60">
            <Hourglass className="w-4 h-4 text-chrono-dark" />
            <span className="text-sm font-hud font-extrabold text-chrono-black">000</span>
          </div>
        </div>

        {/* Center Live Run Timer with "Temporal Synchronization" subtitle */}
        <div className="flex flex-col items-center select-none text-center">
          <div className="flex items-center gap-2 font-hud text-xl font-bold tracking-[0.2em] italic text-[#111111]">
            <Timer className="w-4.5 h-4.5 text-chrono-red" />
            <span>01:23:45</span>
          </div>
          <span className="text-[9px] tracking-[0.22em] uppercase font-mono font-black text-chrono-dark mt-1">
            TIME FROZEN
          </span>
        </div>

        {/* Right Elements Score & Multiplier */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[9px] block font-mono font-bold text-chrono-dark/70 tracking-widest uppercase">SCORE</span>
            <span className="text-lg font-hud font-black text-chrono-black">128,750</span>
          </div>

          <div className="h-6 w-px bg-[#E5E5E2]" />

          <div className="text-right">
            <span className="text-[9px] block font-mono font-bold text-chrono-dark/70 tracking-widest uppercase">MULTIPLIER</span>
            <span className="text-lg font-hud font-black text-chrono-red tracking-wider">x4.6</span>
          </div>
        </div>

      </div>

      {/* 2. CHOOSE AN UPGRADE HEADER */}
      <div className="text-center py-2 relative z-10 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-hud font-black tracking-[0.22em] text-chrono-black uppercase">
          CHOOSE AN UPGRADE
        </h1>
        <span className="text-xs font-hud font-black tracking-[0.18em] text-chrono-red uppercase mt-1">
          UPGRADE SHOP
        </span>

        {/* Center pillbox active funds preview */}
        <div className="mt-3 flex items-center gap-2 bg-[#111111] border border-chrono-panel/60 text-white px-5 py-2 text-xs font-mono font-bold rounded shadow-lg">
          <div className="w-4.5 h-4.5 rounded-full border border-white flex items-center justify-center bg-transparent">
            <div className="w-2 h-2 bg-chrono-red rotate-45" />
          </div>
          <span className="tracking-wider text-sm">{currentCores.toLocaleString()}</span>
          <span className="text-chrono-red ml-1 cursor-pointer" onClick={() => setSaveData(prev => ({...prev, cores: prev.cores + 1000}))}>+</span>
        </div>
      </div>

      {/* 3. CORE UPGRADE CARDS SECTION WITH INTEGRATED SIDEBARS */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-5 py-4 flex-1 items-stretch z-10 overflow-hidden">
        
        {/* Left Sidebar: Loadout checklist panel */}
        <div className="hidden md:flex col-span-2 flex-col justify-between bg-white border border-[#E0DFDC] p-4 font-mono text-center relative"
             style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))" }}>
          <div className="space-y-4">
            <span className="text-[9px] font-sans font-black tracking-widest text-[#444444] border-b border-chrono-panel/50 pb-2 block uppercase">
              ACTIVE LOADOUT
            </span>

            <div className="space-y-5 pt-2">
              {loadouts.map((load, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 group">
                  <div className="w-9 h-9 rounded-full bg-chrono-bg border border-chrono-panel/80 flex items-center justify-center shadow-inner group-hover:border-chrono-red/45 transition-colors">
                    {load.icon}
                  </div>
                  <span className="text-[8px] font-hud font-black text-[#111111] leading-none tracking-wide">{load.name}</span>
                  
                  {/* Upgrade rating charges indicator */}
                  <div className="flex gap-1 items-center mt-0.5">
                    {load.charges.map((ch, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${ch ? "bg-chrono-red animate-pulse" : "bg-[#E5E5E2]"}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[8px] opacity-40 leading-tight">SYSTEM CALIBRATED</div>
        </div>

        {/* Center area: 4 Upgrade options row */}
        <div className="flex overflow-x-auto snap-x hide-scrollbar md:col-span-8 md:grid md:grid-cols-5 gap-4 items-stretch px-4 md:px-0 h-full">
          {upgrades.map((item) => {
            const isSelected = selectedId === item.id;
            const currentLevel = saveData.upgrades[item.id] || 0;
            const nextLevel = currentLevel + 1;
            const isMax = currentLevel >= item.maxLevel;
            const cost = getCost(item);
            const canAfford = cost !== "MAX" && saveData.cores >= cost;
            
            return (
              <div
                key={item.id}
                onClick={() => handleCardSelect(item.id)}
                className={`min-w-[80vw] snap-center shrink-0 md:min-w-0 relative bg-white border cursor-pointer transition-all duration-300 flex flex-col justify-between p-5 text-center group ${
                  isSelected 
                    ? "border-chrono-red ring-2 ring-chrono-red ring-offset-1 shadow-lg" 
                    : "border-[#E5E4E0] hover:border-chrono-dark/50 hover:-translate-y-[2px] shadow-sm"
                }`}
                style={{
                  clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                }}
              >
                {/* Header title */}
                <div className="space-y-1">
                  <h3 className={`text-[11px] font-hud font-black tracking-wide leading-tight ${
                    isSelected ? "text-chrono-red" : "text-chrono-black"
                  }`}>
                    {item.name}
                  </h3>
                  <div className="h-px w-8 bg-chrono-panel/40 mx-auto mt-2" />
                </div>

                {/* Vector graphics visual representing Upgrade type */}
                <div className="relative h-20 flex items-center justify-center bg-[#FAF9F6] border border-chrono-bg rounded shadow-inner my-2">
                  <div className="absolute inset-0 bg-[#E5E5E2]/15 pointer-events-none" />
                  
                  {/* Dynamically styled icons relative to Upgrade parameters */}
                  {item.icon === "shatter" && (
                    <svg viewBox="0 0 100 100" className="w-10 h-10 stroke-chrono-red fill-none" strokeWidth="1.5">
                      <polygon points="50,20 60,35 50,40 40,35" fill="#FF1744" opacity="0.8" />
                      <polygon points="40,35 50,40 45,55 30,48" fill="#FF4569" />
                      <g stroke="#111111" strokeWidth="1">
                        <line x1="50" y1="20" x2="50" y2="5" />
                        <line x1="30" y1="48" x2="10" y2="58" />
                        <line x1="70" y1="48" x2="90" y2="58" />
                      </g>
                    </svg>
                  )}

                  {item.icon === "dilation" && (
                    <div className="relative flex items-center justify-center">
                      <Timer className="w-10 h-10 text-[#111111] animate-pulse-slow" strokeWidth={1.5} />
                      <div className="absolute w-5 h-px bg-chrono-red rotate-45 transform origin-center" />
                    </div>
                  )}

                  {item.icon === "crit" && (
                    <svg viewBox="0 0 100 100" className="w-10 h-10 stroke-[#111111] fill-none" strokeWidth="1.5">
                      <line x1="50" y1="20" x2="50" y2="80" stroke="#FF1744" />
                      <line x1="20" y1="50" x2="80" y2="50" />
                      <rect x="42" y="42" width="16" height="16" stroke="#FF1744" transform="rotate(45 50 50)" />
                    </svg>
                  )}

                  {item.icon === "reflex" && (
                    <Hourglass className="w-10 h-10 text-[#111111]" strokeWidth={1.5} />
                  )}

                  {isSelected && (
                    <div className="absolute inset-0 border border-chrono-red/20 rounded pointer-events-none" />
                  )}
                </div>

                {/* Description paragraphs */}
                <p className="text-[9px] text-chrono-dark/80 line-clamp-3 font-sans leading-relaxed flex-1 px-1">
                  {item.desc}
                </p>

                {/* LV range progression status indicators */}
                <div className="my-2 space-y-1">
                  <div className="flex justify-center items-center gap-1 text-[9px] font-mono font-bold tracking-widest text-[#444444] uppercase">
                    <span>LV. {currentLevel}</span>
                    {!isMax && (
                      <>
                        <ArrowRight className="w-2.5 h-2.5 text-chrono-red" />
                        <span className="text-chrono-red">LV. {nextLevel}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Pricing / Equip action CTA container */}
                <button
                  disabled={!canAfford || isMax}
                  onClick={(e) => buyUpgrade(item, e)}
                  className={`w-full py-1.5 flex items-center justify-center gap-1.5 font-hud text-[10px] font-black tracking-widest transition-all rounded cursor-pointer ${
                    isSelected
                      ? (canAfford 
                          ? "bg-chrono-red text-white hover:bg-chrono-accent shadow-md shadow-chrono-red/20"
                          : "bg-chrono-panel/50 text-[#888888] cursor-not-allowed")
                      : (canAfford
                          ? "bg-chrono-black text-white hover:bg-[#222222]"
                          : "bg-chrono-panel/50 text-[#888888] cursor-not-allowed")
                  }`}
                  style={{
                    clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  }}
                >
                  {!isMax && (
                    <div className="w-3 h-3 rounded-full border border-current flex items-center justify-center bg-transparent">
                      <div className="w-1.5 h-1.5 bg-chrono-red rotate-45" />
                    </div>
                  )}
                  <span>{isMax ? "MAX" : cost}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Sidebar: UPGRADE PREVIEW & STATS HIGHLIGHT */}
        <div className="hidden md:flex col-span-2 flex-col justify-between bg-white border border-[#E0DFDC] p-4 z-10"
             style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))" }}>
          
          <div className="space-y-4">
            <span className="text-[9px] font-sans font-black tracking-widest text-[#444444] border-b border-chrono-panel/50 pb-2 block text-center uppercase">
              UPGRADE PREVIEW
            </span>

            {/* Vector graphics diagram display matching stage view layout */}
            <div className="relative h-[90px] bg-chrono-bg/50 border border-chrono-panel/50 rounded overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 tactical-grid opacity-20" />
              <div 
                className="w-10 h-10 rounded-full relative z-10 shadow-md" 
                style={{
                  background: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #D5D5D2 35%, #888888 65%, #444444 100%)",
                }}
              />
              <svg className="absolute inset-0 w-full h-full stroke-chrono-red/35 pointer-events-none" strokeWidth="0.5">
                <line x1="10" y1="10" x2="90" y2="80" />
                <line x1="80" y1="10" x2="20" y2="80" />
                <circle cx="50" cy="45" r="1.5" fill="#FF1744" />
              </svg>
            </div>

            {/* Symmetrical Stats Panel checklist with arrow indicators */}
            <div className="space-y-3 pt-1">
              <span className="text-[9px] font-mono font-black text-chrono-dark/70 tracking-widest block uppercase">STATS</span>
              
              {/* Stat */}
              <div className="pt-1.5">
                <div className="flex justify-between items-center text-[9px] font-mono leading-none">
                  <span className="text-chrono-dark font-extrabold uppercase">{previewStats.label}</span>
                  <div className="flex items-center gap-1">
                    <span className="opacity-60">{previewStats.current}</span>
                    <ArrowRight className="w-2 h-2 text-chrono-red" />
                    <span className={!previewStats.isMax ? "text-chrono-red font-bold" : "text-chrono-dark font-bold"}>
                      {previewStats.next}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
          <div className="text-[8px] opacity-40 leading-tight">HARDWARE CALIBRATED</div>
        </div>

      </div>

      {/* 5. BOTTOM CTAs ACTION BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-3 border-t border-chrono-panel/40 z-20 mt-auto bg-chrono-bg">
        
        {/* Left: Wave status capsule indicators */}
        <div 
          className="hidden md:flex py-3 px-6 bg-[#FAF9F6] border border-[#E0DFDC] items-center justify-center text-xs font-mono font-extrabold text-[#444444] shadow-sm select-none"
          style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
        >
          <div className="flex items-center gap-3">
            <ChevronLeft className="w-4 h-4 text-chrono-dark opacity-35" />
            <span className="tracking-widest">WAVE</span>
            <span className="text-chrono-red font-hud font-black text-sm">{wave.toString().padStart(2, "0")} / 12</span>
            <ChevronRight className="w-4 h-4 text-chrono-dark opacity-35" />
          </div>
        </div>

        {/* Center: Continue primary button CTA */}
        <div className="flex flex-col items-center">
          <motion.button
            onClick={() => {
              AudioManager.getInstance().playSFX("menu_click");
              onContinue();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full max-w-[320px] md:max-w-[400px] h-[52px] cursor-pointer outline-none select-none bg-chrono-red hover:bg-chrono-accent text-white flex items-center justify-center gap-4 font-hud font-black tracking-[0.25em] text-sm md:text-base shadow-lg shadow-chrono-red/25 rounded"
            style={{
              clipPath: "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
            <Play className="w-4.5 h-4.5 fill-white stroke-none animate-pulse" />
            <span>CONTINUE</span>
          </motion.button>
          <span className="text-[8px] font-sans font-bold tracking-widest uppercase opacity-45 mt-1.5 text-chrono-dark">
            PROCEED TO NEXT WAVE
          </span>
        </div>

        {/* Right: Countdown clock next wave capsule indicators */}
        <div 
          className="hidden md:flex py-3 px-6 bg-[#FAF9F6] border border-[#E0DFDC] items-center justify-center text-xs font-mono font-extrabold text-[#444444] shadow-sm select-none"
          style={{ clipPath: "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }}
        >
          <div className="flex items-center gap-3">
            <span className="tracking-widest">NEXT WAVE IN</span>
            <span className="text-chrono-black font-hud font-black text-sm">00:{countdown.toString().padStart(2, "0")}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
