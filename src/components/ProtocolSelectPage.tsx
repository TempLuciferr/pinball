import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, Lock, Star, ChevronDown, Flame, Timer, 
  Trash2, Plus, Play, ShoppingCart, Shield, Zap, Sparkles, Activity, Compass
} from "lucide-react";
import { AudioManager } from "../game/AudioManager";

// Protocol typescript declaration
export interface Protocol {
  id: string; // "01", "02", etc.
  name: string;
  category: string;
  description: string;
  stars: number;
  maxStars: number;
  locked: boolean;
  bestTime: string;
  bestScore: string;
  enemies: number;
  rewards: { xp: number; credits: number };
}

// Hardcoded Protocols database matching exact visual list from Image
const PROTOCOLS_LIST: Protocol[] = [
  {
    id: "01",
    name: "VECTOR GRID",
    category: "Training Protocol",
    description: "The fundamentals. Learn to freeze, aim and shatter.",
    stars: 3,
    maxStars: 3,
    locked: false,
    bestTime: "01:23:45",
    bestScore: "128,750",
    enemies: 48,
    rewards: { xp: 500, credits: 250 }
  },
  {
    id: "02",
    name: "TIME RIFT",
    category: "Intermediate Challenge",
    description: "An volatile arena with randomized chronostase anomalies.",
    stars: 2,
    maxStars: 3,
    locked: true,
    bestTime: "02:11:30",
    bestScore: "340,900",
    enemies: 96,
    rewards: { xp: 750, credits: 400 }
  },
  {
    id: "03",
    name: "SHATTER DOME",
    category: "Advanced Combat",
    description: "Faceted quartz obstacles reflect incoming ball trajectories.",
    stars: 3,
    maxStars: 3,
    locked: true,
    bestTime: "03:05:12",
    bestScore: "512,100",
    enemies: 154,
    rewards: { xp: 1200, credits: 600 }
  },
  {
    id: "04",
    name: "CORONA BREACH",
    category: "Solar Core",
    description: "Extreme velocity solar flares alter friction properties.",
    stars: 2,
    maxStars: 4,
    locked: true,
    bestTime: "01:45:18",
    bestScore: "220,400",
    enemies: 80,
    rewards: { xp: 800, credits: 350 }
  },
  {
    id: "05",
    name: "KINETIC VOID",
    category: "Zero Gravity Range",
    description: "No friction. Pure momentum controls. Stay within coordinates.",
    stars: 1,
    maxStars: 4,
    locked: true,
    bestTime: "--:--:--",
    bestScore: "0",
    enemies: 110,
    rewards: { xp: 900, credits: 500 }
  },
  {
    id: "06",
    name: "REFLEX BUFFER",
    category: "Tachyonic Accelerator",
    description: "Ultra high speed pinball strikes. 0.05s response window.",
    stars: 3,
    maxStars: 3,
    locked: true,
    bestTime: "--:--:--",
    bestScore: "0",
    enemies: 64,
    rewards: { xp: 1000, credits: 550 }
  },
  {
    id: "07",
    name: "TITAN STRIKE",
    category: "Heavy Mechanics",
    description: "Launch oversized metal dynamic balls into armored targets.",
    stars: 2,
    maxStars: 3,
    locked: true,
    bestTime: "05:12:00",
    bestScore: "890,200",
    enemies: 210,
    rewards: { xp: 2000, credits: 1000 }
  },
  {
    id: "08",
    name: "WARP COORDINATE",
    category: "Hyperspace Drift",
    description: "Portals link opposite flipper orbits. Predict parallel paths.",
    stars: 1,
    maxStars: 4,
    locked: true,
    bestTime: "--:--:--",
    bestScore: "0",
    enemies: 125,
    rewards: { xp: 1100, credits: 650 }
  },
  {
    id: "09",
    name: "CHRONOS CRUCIBLE",
    category: "Final Examination",
    description: "Shatter the clock core. High-tier speed boss simulation.",
    stars: 3,
    maxStars: 3,
    locked: true,
    bestTime: "--:--:--",
    bestScore: "0",
    enemies: 300,
    rewards: { xp: 5000, credits: 2500 }
  }
];

// Loadouts active configuration
interface LoadoutItem {
  id: string;
  name: string;
  desc: string;
  icon: string; // pierce, slow, shield
  active: boolean;
}

// Active upgrades
interface UpgradeItem {
  name: string;
  level: number;
}

interface ProtocolSelectPageProps {
  onBackToMenu: () => void;
  onOpenShop: () => void;
  onStartSimulation: () => void;
}

export default function ProtocolSelectPage({ onBackToMenu, onOpenShop, onStartSimulation }: ProtocolSelectPageProps) {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol>(PROTOCOLS_LIST[0]);
  const [activeTab, setActiveTab] = useState<"classic" | "hardcore">("classic");
  
  // Custom loadouts
  const [loadouts, setLoadouts] = useState<LoadoutItem[]>([
    { id: "L1", name: "PIERCER", desc: "Bullets pierce 1 extra target.", icon: "pierce", active: true },
    { id: "L2", name: "SLOW FIELD", desc: "Time resumes 10% slower.", icon: "slow", active: true },
    { id: "L3", name: "GUARD SHELL", desc: "Survive one hit per run.", icon: "shield", active: true },
  ]);

  // Upgrades list matching exactly: Speed Boost Lv. 2, Crit Shards Lv. 1, Time Dilation Lv. 3, Magnetic Core Lv.1, Shatter Blast Lv. 2, Reflex Buffer Lv. 1
  const [upgrades, setUpgrades] = useState<UpgradeItem[]>([
    { name: "SPEED BOOST", level: 2 },
    { name: "CRIT SHARDS", level: 1 },
    { name: "TIME DILATION", level: 3 },
    { name: "MAGNETIC CORE", level: 1 },
    { name: "SHATTER BLAST", level: 2 },
    { name: "REFLEX BUFFER", level: 1 },
  ]);

  const handleProtocolClick = (protocol: Protocol) => {
    // Shuts visual lockouts but allows toggling active detail preview anyway for interactive demonstration
    AudioManager.getInstance().playSFX("menu_click");
    setSelectedProtocol(protocol);
  };

  const toggleLoadout = (id: string) => {
    AudioManager.getInstance().playSFX("menu_click");
    setLoadouts(prev => 
      prev.map(item => item.id === id ? { ...item, active: !item.active } : item)
    );
  };

  const handleStartProtocol = () => {
    AudioManager.getInstance().playSFX("menu_click");
    onStartSimulation();
  };

  return (
    <div className="relative w-full h-full z-15 flex flex-col justify-between font-sans select-none overflow-y-auto px-4 md:px-12 py-4">
      
      {/* 2. HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-chrono-panel/40 pb-4">
        {/* Left Side: Header with authentic Back Button */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => {
              AudioManager.getInstance().playSFX("menu_back");
              onBackToMenu();
            }}
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 border border-[#E0DFDC] hover:border-chrono-dark/60 bg-white flex items-center justify-center text-chrono-dark hover:text-chrono-black cursor-pointer rounded shadow-sm focus:outline-none"
            style={{
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            }}
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </motion.button>

          <div className="flex flex-col items-start">
            <h1 className="text-xl md:text-2xl font-hud font-black text-chrono-black tracking-[0.2em] leading-none uppercase">
              SELECT PROTOCOL
            </h1>
            <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.18em] text-[#444444] opacity-75 mt-1">
              CHOOSE YOUR BATTLEFIELD
            </span>
          </div>
        </div>

        {/* Right Side: Mode Switch Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-[#FAF9F6] border border-chrono-panel px-4 py-2 text-xs font-mono font-bold text-chrono-dark shadow-sm hover:border-chrono-red/30 transition-all rounded">
            <span className="w-2 h-2 bg-chrono-red rounded-full animate-ping" />
            <span className="text-chrono-red">☠</span>
            <span className="tracking-widest ml-1 uppercase">MODE: {activeTab.toUpperCase()}</span>
            <ChevronDown className="w-4 h-4 ml-3 text-chrono-dark/60" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* 3. PROTCOL GRID & INFO PANEL ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4 flex-1 items-start">
        
        {/* Left: 3x3 Grid (8 columns on large screens) */}
        <div className="lg:col-span-8 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:grid md:grid-cols-3 pb-2 md:pb-0">
          {PROTOCOLS_LIST.map((protocol) => {
            const isSelected = selectedProtocol.id === protocol.id;
            
            return (
              <motion.div
                key={protocol.id}
                onClick={() => handleProtocolClick(protocol)}
                whileHover={{ y: -3, scale: 1.01 }}
                className={`min-w-[85vw] snap-center shrink-0 md:min-w-0 relative cursor-pointer transition-all duration-200 bg-white border border-[#E5E4E0] shadow-sm flex flex-col justify-between overflow-hidden group ${
                  isSelected ? "ring-2 ring-chrono-red border-transparent shadow-md" : ""
                }`}
                style={{
                  height: "115px",
                  clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                }}
              >
                {/* Header label in card (RED stripe if selected) */}
                <div className={`px-3.5 py-1.5 flex justify-between items-center transition-colors ${
                  isSelected ? "bg-chrono-red text-white" : "bg-transparent text-chrono-black"
                }`}>
                  <span className={`text-base font-hud font-black tracking-wider ${
                    isSelected ? "text-white" : "text-chrono-red"
                  }`}>
                    {protocol.id}
                  </span>

                  {/* Title sub-label for selected stage */}
                  {isSelected && (
                    <motion.span 
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[9px] font-hud font-black tracking-[0.1em] text-white/90 uppercase"
                    >
                      {protocol.name}
                    </motion.span>
                  )}
                </div>

                {/* Card Center: Chrome Sphere Embedded Diagram Mini-Preview */}
                <div className="relative flex-1 flex items-center justify-center p-2 overflow-hidden bg-gradient-to-tr from-transparent via-chrono-bg/15 to-chrono-panel/20">
                  
                  {/* Absolute subtle background blueprints vector graphic */}
                  <div className="absolute inset-2 border border-dashed border-[#E5E5E2]/40 rounded pointer-events-none" />
                  
                  {/* Selected Grid Particle Overlay graphic */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-red-400/5 transition-opacity pointer-events-none" />
                  )}

                  {/* Miniature central chrome sphere visual */}
                  <div 
                    className="w-10 h-10 rounded-full shadow-inner relative z-10 transition-transform group-hover:scale-110 duration-500" 
                    style={{
                      background: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #D5D5D2 35%, #999999 65%, #444444 100%)",
                      boxShadow: "inset 0 3px 6px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.6), 0 3px 8px rgba(0,0,0,0.15)"
                    }}
                  >
                    {/* Gloss reflection ring */}
                    <div className="absolute top-1 left-1 right-1 bottom-1 rounded-full bg-white/20" />
                  </div>

                  {/* Visual particles representation on SELECTED (stage 01) or other unlock ones */}
                  {protocol.id === "01" && (
                    <svg className="absolute inset-0 w-full h-full stroke-chrono-red/25 pointer-events-none" strokeWidth="0.5">
                      <line x1="20" y1="20" x2="100" y2="100" />
                      <line x1="120" y1="10" x2="80" y2="90" />
                      <line x1="130" y1="80" x2="30" y2="40" />
                      {/* Geometric tiny red shard dots */}
                      <circle cx="50" cy="30" r="1.5" fill="#FF1744" />
                      <circle cx="150" cy="65" r="1.5" fill="#FF1744" />
                      <rect x="180" y="25" width="3" height="3" fill="#FF1744" />
                    </svg>
                  )}
                </div>

                {/* Card Footer: Star Rating representation / LOCKED badge slant */}
                <div className={`px-3 py-1 flex justify-between items-center text-[10px] ${
                  isSelected ? "bg-[#FF1744]/90 text-white" : "bg-[#ECEBE7] text-chrono-dark"
                }`}>
                  
                  {/* Active stars count represent */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(3)].map((_, index) => (
                      <Star 
                        key={index}
                        className={`w-3 h-3 ${
                          index < protocol.stars 
                            ? (isSelected ? "text-white fill-white" : "text-chrono-dark fill-chrono-dark") 
                            : "opacity-25"
                        }`} 
                        strokeWidth={2.5}
                      />
                    ))}
                  </div>

                  {/* Locked status slanted tag */}
                  {protocol.locked && (
                    <div className="flex items-center gap-1 font-mono font-bold tracking-widest text-chrono-dark/70 text-[9px]">
                      <Lock className="w-2.5 h-2.5" />
                      <span>LOCKED</span>
                    </div>
                  )}
                  
                  {!protocol.locked && protocol.id !== "01" && (
                    <span className="font-mono text-[9px] font-bold text-chrono-red animate-pulse">COMPLETED</span>
                  )}

                  {protocol.id === "01" && (
                    <span className="font-mono text-[9px] font-black tracking-widest">ACTIVE</span>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Right: High-fidelity Protocol Information Panel (4 columns) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E4E0] p-6 shadow-sm flex flex-col justify-between"
             style={{
               minHeight: "410px",
               clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
             }}
        >
          <div className="space-y-4">
            {/* Stage Title and index header */}
            <div className="border-b border-chrono-panel/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-hud font-black text-chrono-red tracking-wider">
                  {selectedProtocol.id}
                </span>
                <h3 className="text-base font-hud font-extrabold text-chrono-black tracking-[0.1em] uppercase">
                  {selectedProtocol.name}
                </h3>
              </div>
              <span className="text-[10px] text-chrono-dark/70 font-mono font-bold uppercase tracking-widest">
                {selectedProtocol.category}
              </span>
            </div>

            {/* Simulated Stage Visual Diagram Vector Preview */}
            <div className="relative w-full h-[120px] bg-chrono-bg/50 border border-chrono-panel/60 rounded overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 tactical-grid opacity-20" />
              
              {/* Chrome visual representation in preview */}
              <div 
                className="w-14 h-14 rounded-full relative z-10 shadow-lg" 
                style={{
                  background: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #D5D5D2 35%, #999999 65%, #444444 100%)",
                  boxShadow: "inset 0 4px 8px rgba(255,255,255,0.8), inset 0 -4px 8px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.2)"
                }}
              />
              
              {/* Complex Vector laser sight explosion diagram around sphere in selected preview */}
              <svg className="absolute inset-0 w-full h-full stroke-chrono-red/40 pointer-events-none" strokeWidth="0.75">
                {/* Outward laser rays */}
                <line x1="30" y1="30" x2="200" y2="100" />
                <line x1="220" y1="20" x2="110" y2="90" />
                <line x1="240" y1="100" x2="40" y2="40" />
                <line x1="120" y1="05" x2="120" y2="115" />
                {/* Accent red diamonds or particles diagram */}
                <polygon points="45,45 50,42 47,51" fill="#FF1744" />
                <polygon points="175,30 180,32 176,38" fill="#FF1744" />
                <polygon points="85,90 92,86 89,95" fill="#FF1744" opacity="0.6" />
                <rect x="180" y="80" width="4" height="4" fill="#FF1744" transform="rotate(45 182 82)" />
              </svg>

              <div className="absolute inset-x-0 top-0 h-[25%] bg-gradient-to-b from-white/10 to-transparent" />
            </div>

            {/* Sector Description paragraph */}
            <p className="text-xs text-[#444444] font-sans leading-relaxed pt-1">
              {selectedProtocol.description}
            </p>

            {/* Run Statics dashboard (Clock, Score, Enemies) */}
            <div className="grid grid-cols-3 gap-2 bg-[#E5E5E2]/30 p-3 rounded border border-chrono-panel/40 font-mono text-[10px]">
              <div>
                <span className="text-[9px] text-[#444444] block font-bold tracking-wider mb-1">BEST TIME</span>
                <span className="text-chrono-red font-bold font-hud tracking-tight">
                  {selectedProtocol.bestTime}
                </span>
              </div>
              <div className="border-l border-chrono-panel/60 pl-2">
                <span className="text-[9px] text-[#444444] block font-bold tracking-wider mb-1">BEST SCORE</span>
                <span className="text-chrono-black font-semibold font-hud tracking-tight">
                  {selectedProtocol.bestScore}
                </span>
              </div>
              <div className="border-l border-chrono-panel/60 pl-2">
                <span className="text-[9px] text-[#444444] block font-bold tracking-wider mb-1">ENEMIES</span>
                <span className="text-chrono-black font-extrabold font-hud tracking-tight">
                  {selectedProtocol.enemies}
                </span>
              </div>
            </div>
          </div>

          {/* Symmetrical Rewards layout */}
          <div className="pt-4 border-t border-chrono-panel/40 mt-3 space-y-2">
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#444444] uppercase">REWARDS</span>
            
            <div className="flex gap-4">
              {/* XP payout */}
              <div className="flex items-center gap-1.5 font-mono text-xs text-[#111111] font-bold">
                <div className="w-5 h-5 rounded bg-chrono-black text-white text-[9px] font-black font-hud flex items-center justify-center">
                  XP
                </div>
                <span>{selectedProtocol.rewards.xp}</span>
              </div>

              {/* Gold cash payout */}
              <div className="flex items-center gap-1.5 font-mono text-xs text-[#111111] font-bold">
                <div className="w-5 h-5 rounded-full border border-chrono-dark flex items-center justify-center bg-transparent">
                  <div className="w-2.5 h-2.5 bg-chrono-red rotate-45" />
                </div>
                <span>{selectedProtocol.rewards.credits}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <details className="group md:hidden px-1 mb-4">
        <summary className="cursor-pointer list-none flex justify-between items-center bg-[#ECEBE7] px-4 py-3 rounded border border-chrono-panel/40 font-mono text-xs font-bold tracking-widest text-[#444444]">
          <span>VIEW LOADOUT & UPGRADES</span>
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-4 flex flex-col gap-6">
          {/* LOADOUT & UPGRADES FOR MOBILE */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-mono font-extrabold text-[#444444] tracking-widest border-b border-chrono-panel/40 pb-1.5">
              <span className="text-chrono-black">CORES LOADOUT</span>
              <span className="text-chrono-red uppercase">3 / 3 ACTIVE</span>
            </div>

            <div className="flex overflow-x-auto snap-x hide-scrollbar gap-2.5 pt-1 pb-2">
              {loadouts.map((load) => (
                <motion.div
                  key={load.id}
                  onClick={() => toggleLoadout(load.id)}
                  whileHover={{ scale: 1.03 }}
                  className={`min-w-[140px] snap-center shrink-0 p-3 border rounded text-center cursor-pointer transition-all flex flex-col justify-between items-center gap-2 ${
                    load.active 
                      ? "bg-white border-chrono-black/40 shadow-sm" 
                      : "bg-[#ECEBE7]/50 border-[#D5D5D2] opacity-50"
                  }`}
                  style={{
                    height: "105px",
                    clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-chrono-bg border border-chrono-panel/80 flex items-center justify-center text-chrono-dark group-hover:text-chrono-red">
                    {load.icon === "pierce" && <Zap className="w-4 h-4 text-chrono-red animate-pulse" />}
                    {load.icon === "slow" && <Timer className="w-4 h-4 text-chrono-black" />}
                    {load.icon === "shield" && <Shield className="w-4 h-4 text-chrono-dark" />}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-hud font-black tracking-wide text-chrono-black leading-none">
                      {load.name}
                    </h4>
                    <p className="text-[9px] text-chrono-dark/80 font-sans leading-none line-clamp-2 pt-0.5">
                      {load.desc}
                    </p>
                  </div>

                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    load.active ? "bg-chrono-red border-transparent" : "border-chrono-panel"
                  }`}>
                    {load.active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-mono font-extrabold text-[#444444] tracking-widest border-b border-chrono-panel/40 pb-1.5">
              <span className="text-chrono-black">PERMANENT SYSTEMS UPGRADES</span>
            </div>

            <div className="flex overflow-x-auto snap-x hide-scrollbar gap-2 pt-1 pb-2">
              {upgrades.map((upg, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className="min-w-[110px] snap-center shrink-0 p-3 border border-[#E5E4E0] bg-[#FAF9F6] shadow-sm flex flex-col justify-between items-center rounded cursor-pointer gap-2"
                  style={{
                    height: "105px",
                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  }}
                  onClick={() => {
                    AudioManager.getInstance().playSFX("menu_click");
                    alert(`Upgrade item ${upg.name} is permanently active in game blueprints simulation!`);
                  }}
                >
                  <div className="w-7 h-7 rounded bg-chrono-black/5 flex items-center justify-center text-chrono-dark text-[10px]">
                    {idx === 0 && <Sparkles className="w-3.5 h-3.5 text-chrono-red" />}
                    {idx === 1 && <Flame className="w-3.5 h-3.5 text-chrono-dark animate-pulse" />}
                    {idx === 2 && <Timer className="w-3.5 h-3.5 text-chrono-dark" />}
                    {idx === 3 && <Compass className="w-3.5 h-3.5 text-chrono-dark" />}
                    {idx === 4 && <Activity className="w-3.5 h-3.5 text-chrono-red" />}
                    {idx === 5 && <Zap className="w-3.5 h-3.5 text-chrono-dark" />}
                  </div>

                  <div className="text-center">
                    <h5 className="text-[8px] font-hud font-black tracking-tighter text-chrono-dark leading-tight line-clamp-2 uppercase">
                      {upg.name}
                    </h5>
                  </div>

                  <div className="bg-[#111111] text-[#E0DFDC] text-[8px] font-mono px-2 py-0.5 rounded font-bold">
                    LVL {upg.level}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* 4. LOADOUT & UPGRADES COMBINED SUB-HEADER GRID (DESKTOP) */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-6 my-2 pt-2 border-t border-chrono-panel/40">
        
        {/* Loadout Section (5/12 slots) */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[10px] font-mono font-extrabold text-[#444444] tracking-widest border-b border-chrono-panel/40 pb-1.5">
            <span className="text-chrono-black">CORES LOADOUT</span>
            <span className="text-chrono-red uppercase">3 / 3 ACTIVE</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {loadouts.map((load) => (
              <motion.div
                key={load.id}
                onClick={() => toggleLoadout(load.id)}
                whileHover={{ scale: 1.03 }}
                className={`p-3 border rounded text-center cursor-pointer transition-all flex flex-col justify-between items-center gap-2 ${
                  load.active 
                    ? "bg-white border-chrono-black/40 shadow-sm" 
                    : "bg-[#ECEBE7]/50 border-[#D5D5D2] opacity-50"
                }`}
                style={{
                  height: "105px",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                }}
              >
                {/* Render corresponding customized action icons */}
                <div className="w-8 h-8 rounded-full bg-chrono-bg border border-chrono-panel/80 flex items-center justify-center text-chrono-dark group-hover:text-chrono-red">
                  {load.icon === "pierce" && <Zap className="w-4 h-4 text-chrono-red animate-pulse" />}
                  {load.icon === "slow" && <Timer className="w-4 h-4 text-chrono-black" />}
                  {load.icon === "shield" && <Shield className="w-4 h-4 text-chrono-dark" />}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-hud font-black tracking-wide text-chrono-black leading-none">
                    {load.name}
                  </h4>
                  <p className="text-[9px] text-chrono-dark/80 font-sans leading-none line-clamp-2 pt-0.5">
                    {load.desc}
                  </p>
                </div>

                {/* Real checkout bullet tick box */}
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  load.active ? "bg-chrono-red border-transparent" : "border-chrono-panel"
                }`}>
                  {load.active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upgrades panel Section (7/12 slots) */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[10px] font-mono font-extrabold text-[#444444] tracking-widest border-b border-chrono-panel/40 pb-1.5">
            <span className="text-chrono-black">PERMANENT SYSTEMS UPGRADES</span>
            <span className="text-[9px] text-[#444444]">CALIBRATED OVERVIEW</span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 pt-1">
            {upgrades.map((upg, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="p-3 border border-[#E5E4E0] bg-[#FAF9F6] shadow-sm flex flex-col justify-between items-center rounded cursor-pointer gap-2"
                style={{
                  height: "105px",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
                onClick={() => {
                  AudioManager.getInstance().playSFX("menu_click");
                  alert(`Upgrade item ${upg.name} is permanently active in game blueprints simulation!`);
                }}
              >
                {/* Standard mini representations */}
                <div className="w-7 h-7 rounded bg-chrono-black/5 flex items-center justify-center text-chrono-dark text-[10px]">
                  {idx === 0 && <Sparkles className="w-3.5 h-3.5 text-chrono-red" />}
                  {idx === 1 && <Flame className="w-3.5 h-3.5 text-chrono-dark animate-pulse" />}
                  {idx === 2 && <Timer className="w-3.5 h-3.5 text-chrono-dark" />}
                  {idx === 3 && <Compass className="w-3.5 h-3.5 text-chrono-dark" />}
                  {idx === 4 && <Activity className="w-3.5 h-3.5 text-chrono-red" />}
                  {idx === 5 && <Zap className="w-3.5 h-3.5 text-chrono-dark" />}
                </div>

                <div className="text-center">
                  <h5 className="text-[8px] font-hud font-black tracking-tighter text-chrono-dark leading-tight line-clamp-2 uppercase">
                    {upg.name}
                  </h5>
                  <span className="text-[8px] font-mono font-black text-chrono-red block tracking-wide mt-0.5">
                    LV. {upg.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. BOTTOM CTA ROW ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-3 border-t border-chrono-panel/40">
        
        {/* Left Option Group: Protocols/Back toggle */}
        <motion.button
          onClick={() => {
            AudioManager.getInstance().playSFX("menu_back");
            onBackToMenu();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="w-full md:w-auto h-11 px-5 border border-[#E0DFDC] hover:border-chrono-dark text-chrono-dark font-hud font-extrabold text-[11px] tracking-widest flex items-center justify-center gap-2.5 cursor-pointer bg-white"
          style={{
            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
          }}
        >
          <div className="grid grid-cols-2 gap-0.5 rotate-45 w-3 h-3 justify-center items-center">
            <span className="w-1 h-1 bg-chrono-red" />
            <span className="w-1 h-1 bg-chrono-dark" />
            <span className="w-1 h-1 bg-chrono-dark" />
            <span className="w-1 h-1 bg-chrono-red" />
          </div>
          PROTOCOLS LIST
        </motion.button>

        {/* Center Primary Action CTA */}
        <motion.button
          onClick={handleStartProtocol}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full max-w-[340px] md:max-w-[420px] h-[52px] cursor-pointer outline-none select-none play-btn-clip bg-chrono-red text-white flex items-center justify-center gap-4 font-hud font-black tracking-[0.25em] text-sm md:text-base shadow-lg shadow-chrono-red/25 hover:bg-chrono-accent"
        >
          {/* Internal gradient shine */}
          <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          
          <Play className="w-4.5 h-4.5 fill-white stroke-none animate-pulse" />
          <span>START PROTOCOL</span>
        </motion.button>

        {/* Right Option Group: Shop button */}
        <motion.button
          onClick={() => {
            AudioManager.getInstance().playSFX("menu_click");
            onOpenShop();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="w-full md:w-auto h-11 px-6 border border-[#E0DFDC] hover:border-chrono-dark text-chrono-dark font-hud font-extrabold text-[11px] tracking-widest flex items-center justify-center gap-2 cursor-pointer bg-white"
          style={{
            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
          }}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          SHOP EXTRAS
        </motion.button>

      </div>

      {/* 6. CENTER FOOTER TACTICAL DIAGRAM TIP */}
      <div className="w-full text-center py-2 select-none">
        <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-[#444444] opacity-55">
          ⓘ TIP: Time only moves while you drag the pinball sphere. Use gravity bounds to sync strikes.
        </span>
      </div>

    </div>
  );
}
