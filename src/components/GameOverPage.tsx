import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart, Hourglass, Timer, RefreshCw } from "lucide-react";
import ScoreCard from "./ScoreCard";
import RankCard from "./RankCard";
import PerformancePanel from "./PerformancePanel";
import RewardsPanel from "./RewardsPanel";
import LevelProgressBar from "./LevelProgressBar";
import RevivePanel from "./RevivePanel";
import GameOverActions from "./GameOverActions";
import ChronoSphere from "./ChronoSphere";
import ParticleBurst from "./ParticleBurst";

interface GameOverPageProps {
  score?: number;
  multiplier?: number;
  wavesCleared?: string;
  enemiesDestroyed?: number;
  accuracy?: string;
  longestChain?: number;
  timeFrozen?: string;
  damageTaken?: number;
  totalChronoUsed?: number;
  totalChronoRecovered?: number;
  highestSingleKill?: number;
  totalBounceBonuses?: number;
  perfectWaves?: number;
  highestComboReached?: number;
  highestComboMultiplier?: number;
  totalComboBonusEarned?: number;
  xpReward?: number;
  creditsReward?: number;
  currentXp?: number;
  maxXp?: number;
  currentLevel?: number;
  nextLevel?: number;
  onRestart: () => void;
  onMainMenu: () => void;
  onReviveSuccess?: () => void;
  onOpenShop?: () => void;
  onOpenLeaderboard?: () => void;
}

export default function GameOverPage({
  score = 128750,
  multiplier = 4.6,
  wavesCleared = "08 / 12",
  enemiesDestroyed = 248,
  accuracy = "92%",
  longestChain = 86,
  timeFrozen = "01:23:45",
  damageTaken = 10,
  totalChronoUsed = 0,
  totalChronoRecovered = 0,
  highestSingleKill = 0,
  totalBounceBonuses = 0,
  perfectWaves = 0,
  highestComboReached = 0,
  highestComboMultiplier = 1.0,
  totalComboBonusEarned = 0,
  xpReward = 1250,
  creditsReward = 750,
  currentXp = 2150,
  maxXp = 3000,
  currentLevel = 12,
  nextLevel = 13,
  onRestart,
  onMainMenu,
  onReviveSuccess,
  onOpenShop,
  onOpenLeaderboard,
}: GameOverPageProps) {
  return (
    <div className="relative w-full h-full z-15 flex flex-col justify-between select-none overflow-hidden text-chrono-black font-sans bg-chrono-bg/95 p-4 md:px-12 py-3">
      {/* 1. TOP BAR HUD (Symmetrical with other frames) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 z-10 border-b border-chrono-panel/40 pb-3">
        {/* Left HP layout - showing 0/10 HP on crash status */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Heart className="w-5.5 h-5.5 text-chrono-panel stroke-chrono-dark" />
              <div className="flex gap-1 items-center">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-2 bg-chrono-panel"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="text-[10px] font-mono font-black text-chrono-red tracking-widest mt-1 ml-7">
              0/10 HP
            </span>
          </div>

          <div className="h-6 w-px bg-chrono-panel" />

          {/* Symmetrical Hourglass */}
          <div className="flex items-center gap-2 bg-[#E1DFDB]/30 px-2.5 py-1 rounded border border-chrono-panel/60">
            <Hourglass className="w-4 h-4 text-chrono-dark/60" />
            <span className="text-sm font-hud font-extrabold text-chrono-dark/60">
              000
            </span>
          </div>
        </div>

        {/* Center Live Run Timer with "Temporal Synchronization" subtitle */}
        <div className="flex flex-col items-center select-none text-center">
          <div className="flex items-center gap-2 font-hud text-xl font-bold tracking-[0.2em] italic text-[#111111]">
            <Timer className="w-4.5 h-4.5 text-chrono-red animate-pulse" />
            <span>{timeFrozen}</span>
          </div>
          <span className="text-[9px] tracking-[0.22em] uppercase font-mono font-black text-chrono-red mt-1">
            TIME RESUMED
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

          <div className="text-right">
            <span className="text-[9px] block font-mono font-bold text-chrono-dark/70 tracking-widest uppercase">
              MULTIPLIER
            </span>
            <span className="text-lg font-hud font-black text-chrono-red tracking-wider">
              x{multiplier}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BLOCK & HERO BACKGROUND SHIELD RADIATING */}
      <div className="relative py-2 z-10 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side: Game Over announcement text */}
        <div className="text-center md:text-left py-2 flex flex-col items-center md:items-start select-none">
          <h1 className="text-4xl md:text-5xl font-hud font-black tracking-[0.26em] text-chrono-black uppercase animate-pulse">
            GAME OVER
          </h1>

          <div className="flex items-center gap-3 mt-1.5">
            <span className="w-6 h-px bg-chrono-panel/80 hidden md:block" />
            <span className="text-xs font-mono font-black tracking-[0.22em] text-[#FF1744] uppercase">
              TIME RESUMED. YOU WERE HIT.
            </span>
            <span className="w-16 h-px bg-chrono-panel/80" />
          </div>
        </div>

        {/* Right Side: Overlayed glowing Chrome Sphere with red burst behind the headings */}
        <div className="hidden md:flex absolute right-[4%] top-[-80px] md:top-[-110px] pointer-events-none w-[320px] md:w-[460px] h-[320px] md:h-[460px] items-center justify-center overflow-visible select-none">
          <div className="absolute transform scale-75 md:scale-95">
            <ParticleBurst />
          </div>
          <div className="absolute transform scale-65 md:scale-90 opacity-90">
            <ChronoSphere />
          </div>
        </div>
      </div>

      <div className="md:hidden w-full flex mb-4 z-10 sticky top-0">
        <GameOverActions
          onLeaderboards={() => {
            if (onOpenLeaderboard) {
              onOpenLeaderboard();
            } else {
              alert(
                "LEADERBOARDS SYNCHRONIZED\nAnalyzing global timelines and record holders.",
              );
            }
          }}
          onShop={() => {
            if (onOpenShop) {
              onOpenShop();
            } else {
              alert("Redirecting to the tactical Upgrade Shop.");
            }
          }}
          onRestart={onRestart}
          onMainMenu={onMainMenu}
        />
      </div>

      {/* 3. SYMMETRICAL THREE-COLUMN PANEL SETUPS */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 py-2 md:py-4 flex-1 z-10 hide-scrollbar overflow-y-auto md:overflow-visible">
        {/* COLUMN 1: Score & Rank + Performance Metrics list */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <ScoreCard score={score} />
            <RankCard rank="S" />
          </div>
          <details className="md:hidden group border border-[#E5E5E2] rounded bg-white mt-2 p-2">
            <summary className="font-mono text-xs font-bold font-hud tracking-widest text-[#444444] text-center list-none outline-none cursor-pointer">
              VIEW DETAILED STATS
            </summary>
            <div className="mt-4 flex flex-col gap-4">
               <PerformancePanel
                wavesCleared={wavesCleared}
                enemiesDestroyed={enemiesDestroyed}
                accuracy={accuracy}
                longestChain={longestChain}
                timeFrozen={timeFrozen}
                damageTaken={damageTaken}
                totalChronoUsed={totalChronoUsed}
                totalChronoRecovered={totalChronoRecovered}
                highestSingleKill={highestSingleKill}
                totalBounceBonuses={totalBounceBonuses}
                perfectWaves={perfectWaves}
                highestComboReached={highestComboReached}
                highestComboMultiplier={highestComboMultiplier}
                totalComboBonusEarned={totalComboBonusEarned}
               />
               <RewardsPanel xpReward={xpReward} creditsReward={creditsReward} />
               <LevelProgressBar
                currentXp={currentXp}
                maxXp={maxXp}
                currentLevel={currentLevel}
                nextLevel={nextLevel}
               />
            </div>
           </details>

           <div className="hidden md:block">
             <PerformancePanel
                wavesCleared={wavesCleared}
                enemiesDestroyed={enemiesDestroyed}
                accuracy={accuracy}
                longestChain={longestChain}
                timeFrozen={timeFrozen}
                damageTaken={damageTaken}
                totalChronoUsed={totalChronoUsed}
                totalChronoRecovered={totalChronoRecovered}
                highestSingleKill={highestSingleKill}
                totalBounceBonuses={totalBounceBonuses}
                perfectWaves={perfectWaves}
                highestComboReached={highestComboReached}
                highestComboMultiplier={highestComboMultiplier}
                totalComboBonusEarned={totalComboBonusEarned}
              />
           </div>
        </div>

        {/* COLUMN 2: Rewards and long-term level progression */}
        <div className="hidden md:flex flex-col gap-4">
          <RewardsPanel xpReward={xpReward} creditsReward={creditsReward} />
          <LevelProgressBar
            currentXp={currentXp}
            maxXp={maxXp}
            currentLevel={currentLevel}
            nextLevel={nextLevel}
          />
        </div>

        {/* COLUMN 3: Tactical Revive offers frame */}
        <div className="flex flex-col">
          <RevivePanel
            onReviveSuccess={() => {
              if (onReviveSuccess) {
                onReviveSuccess();
              } else {
                alert("TIME LOOP ACTUATED\nWave state recovered.");
                onRestart();
              }
            }}
            onQuit={onMainMenu}
          />
        </div>
      </div>

      {/* 4. ACTIONS CTA CONTROLS GROUP CONTAINER */}
      <div className="hidden md:block">
        <GameOverActions
          onLeaderboards={() => {
            if (onOpenLeaderboard) {
              onOpenLeaderboard();
            } else {
              alert(
                "LEADERBOARDS SYNCHRONIZED\nAnalyzing global timelines and record holders.",
              );
            }
          }}
          onShop={() => {
            if (onOpenShop) {
              onOpenShop();
            } else {
              alert("Redirecting to the tactical Upgrade Shop.");
            }
          }}
          onRestart={onRestart}
          onMainMenu={onMainMenu}
        />
      </div>

      {/* Footer tips */}
      <div className="w-full text-center py-1 opacity-40 font-mono text-[9.5px] uppercase tracking-widest text-[#444444] mt-2 select-none">
        ⓘ TIP: Bullet velocity scaling occurs exponentially over time ticks.
        Maintain static locks to clear paths.
      </div>
    </div>
  );
}
