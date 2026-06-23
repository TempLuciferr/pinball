import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Trophy, Clock, Target, Star, Zap, Activity } from "lucide-react";
import { SaveData } from "../game/SaveSystem";

interface StatisticsPageProps {
  onBack: () => void;
  saveData: SaveData;
}

export default function StatisticsPage({ onBack, saveData }: StatisticsPageProps) {
  const stats = {
    totalRuns: saveData.stats?.totalRuns || 0,
    totalPlayTimeMs: saveData.stats?.totalPlayTimeMs || 0,
    totalTurretsDestroyed: saveData.stats?.totalTurretsDestroyed || 0,
    totalPerfectWaves: saveData.stats?.totalPerfectWaves || 0,
    highestScore: saveData.stats?.highestScore || 0,
    highestWave: saveData.stats?.highestWave || 0,
    highestComboMultiplier: saveData.stats?.highestComboMultiplier || 1.0,
    highestComboKills: saveData.stats?.highestComboKills || 0,
    lifetimeChronoEnergyUsed: saveData.stats?.lifetimeChronoEnergyUsed || 0,
    lifetimeChronoEnergyRecovered: saveData.stats?.lifetimeChronoEnergyRecovered || 0,
  };

  const profile = {
    playerLevel: saveData.profile?.playerLevel || 1,
    currentXP: saveData.profile?.currentXP || 0,
  };

  const achievements = {
    firstBlood: saveData.achievements?.firstBlood || false,
    waveRider: saveData.achievements?.waveRider || false,
    chronoMaster: saveData.achievements?.chronoMaster || false,
    perfectExecution: saveData.achievements?.perfectExecution || false,
    coreCollector: saveData.achievements?.coreCollector || false,
    pinballGod: saveData.achievements?.pinballGod || false,
  };

  const formatTime = (ms: number) => {
    if (!ms || isNaN(ms)) return "0m 0s";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${seconds}s`;
  };

  const nextLevelXP = profile.playerLevel * 100;
  const progressPercent = Math.min(100, Math.max(0, (profile.currentXP / nextLevelXP) * 100)) || 0;

  return (
    <div className="relative w-full h-full flex flex-col bg-chrono-bg/95 p-6 md:p-12 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center border border-chrono-panel hover:bg-chrono-panel/10 hover:text-chrono-red transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-hud font-black tracking-widest uppercase text-chrono-black">
              Player Profile
            </h1>
            <p className="text-xs font-mono tracking-[0.2em] text-chrono-dark/60 uppercase">
              Terminal Statistics & Records
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full pb-12">
        
        {/* Profile Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-[#E0DFDC] p-6 shadow-sm flex flex-col md:flex-row gap-8 items-center"
             style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}>
          
          <div className="w-24 h-24 rounded bg-chrono-bg border border-chrono-panel flex items-center justify-center shrink-0">
            <span className="font-hud font-black text-4xl text-chrono-red">{profile.playerLevel}</span>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="flex justify-between items-baseline mb-1">
              <h2 className="font-hud font-bold tracking-widest text-lg">LEVEL {profile.playerLevel}</h2>
              <span className="font-mono text-xs font-bold text-chrono-dark">{profile.currentXP} / {nextLevelXP} XP</span>
            </div>
            
            <div className="w-full h-3 bg-chrono-bg border border-[#E0DFDC] overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-chrono-red"
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] font-mono tracking-wider text-chrono-dark/60 uppercase">
              Current progress to next clearance level
            </p>
          </div>
        </div>

        {/* Stats Category: Performance */}
        <div className="bg-white border border-[#E0DFDC] p-5 space-y-4 shadow-sm"
             style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
          <div className="flex items-center gap-2 border-b border-[#FAF9F6] pb-2">
            <Trophy className="w-4 h-4 text-chrono-red" />
            <h3 className="font-hud font-bold tracking-widest text-sm uppercase">Performance</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono border-b border-dashed border-[#FAF9F6] pb-1">
              <span className="text-chrono-dark/60 uppercase">Highest Score</span>
              <span className="font-bold text-chrono-black">{stats.highestScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono border-b border-dashed border-[#FAF9F6] pb-1">
              <span className="text-chrono-dark/60 uppercase">Highest Wave</span>
              <span className="font-bold text-chrono-black">{stats.highestWave}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono border-b border-dashed border-[#FAF9F6] pb-1">
              <span className="text-chrono-dark/60 uppercase">Perfect Waves</span>
              <span className="font-bold text-chrono-black">{stats.totalPerfectWaves}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-chrono-dark/60 uppercase">Max Combo</span>
              <span className="font-bold text-chrono-red">{stats.highestComboMultiplier.toFixed(1)}x</span>
            </div>
          </div>
        </div>

        {/* Stats Category: Milestones */}
        <div className="bg-white border border-[#E0DFDC] p-5 space-y-4 shadow-sm"
             style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
          <div className="flex items-center gap-2 border-b border-[#FAF9F6] pb-2">
            <Activity className="w-4 h-4 text-chrono-red" />
            <h3 className="font-hud font-bold tracking-widest text-sm uppercase">Totals</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono border-b border-dashed border-[#FAF9F6] pb-1">
              <span className="text-chrono-dark/60 uppercase">Total Runs</span>
              <span className="font-bold text-chrono-black">{stats.totalRuns}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono border-b border-dashed border-[#FAF9F6] pb-1">
              <span className="text-chrono-dark/60 uppercase">Play Time</span>
              <span className="font-bold text-chrono-black">{formatTime(stats.totalPlayTimeMs)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono border-b border-dashed border-[#FAF9F6] pb-1">
              <span className="text-chrono-dark/60 uppercase">Total Kills</span>
              <span className="font-bold text-chrono-black">{stats.totalTurretsDestroyed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-chrono-dark/60 uppercase">Earned Cores</span>
              <span className="font-bold text-chrono-black">{saveData.lifetimeCores.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Stats Category: Achievements */}
        <div className="bg-white border border-[#E0DFDC] p-5 space-y-4 shadow-sm"
             style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
          <div className="flex items-center gap-2 border-b border-[#FAF9F6] pb-2">
            <Star className="w-4 h-4 text-chrono-red" />
            <h3 className="font-hud font-bold tracking-widest text-sm uppercase">Achievements</h3>
          </div>
          
          <div className="space-y-2">
            <AchievementRow title="FIRST BLOOD" desc="Destroy first turret" unlocked={achievements.firstBlood} />
            <AchievementRow title="WAVE RIDER" desc="Reach wave 10" unlocked={achievements.waveRider} />
            <AchievementRow title="CHRONO MASTER" desc="Reach 3.0x combo" unlocked={achievements.chronoMaster} />
            <AchievementRow title="PERFECT EXECUTION" desc="5 perfect waves in one run" unlocked={achievements.perfectExecution} />
            <AchievementRow title="CORE COLLECTOR" desc="Earn 5000 lifetime cores" unlocked={achievements.coreCollector} />
            <AchievementRow title="PINBALL GOD" desc="Reach wave 25" unlocked={achievements.pinballGod} />
          </div>
        </div>

      </div>
    </div>
  );
}

function AchievementRow({ title, desc, unlocked }: { title: string, desc: string, unlocked: boolean }) {
  return (
    <div className={`flex items-center justify-between p-2 text-[10px] font-mono border ${unlocked ? 'border-chrono-red/30 bg-chrono-red/5' : 'border-transparent opacity-50'}`}>
      <div className="flex flex-col">
        <span className={`font-bold tracking-wider uppercase ${unlocked ? 'text-chrono-red' : 'text-chrono-dark'}`}>{title}</span>
        <span className="text-chrono-dark/60">{desc}</span>
      </div>
      {unlocked && <Star className="w-3 h-3 text-chrono-red fill-chrono-red" />}
    </div>
  );
}
