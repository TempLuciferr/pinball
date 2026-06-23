import React from "react";
import {
  Target,
  Zap,
  Timer,
  Heart,
  Shield,
  Activity,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";

interface PerformancePanelProps {
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
}

export default function PerformancePanel({
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
}: PerformancePanelProps) {
  const items = [
    {
      label: "WAVES CLEARED",
      value: wavesCleared,
      icon: <Target className="w-4 h-4 text-[#111111]" />,
    },
    {
      label: "PERFECT WAVES",
      value: perfectWaves.toString(),
      icon: <Shield className="w-4 h-4 text-chrono-red" />,
    },
    {
      label: "ENEMIES DESTROYED",
      value: enemiesDestroyed,
      icon: <Sparkles className="w-4 h-4 text-[#111111]" />,
    },
    {
      label: "HIGHEST SINGLE KILL",
      value: highestSingleKill.toLocaleString(),
      icon: <Activity className="w-4 h-4 text-chrono-red" />,
    },
    {
      label: "TOTAL BOUNCE BONUS",
      value: totalBounceBonuses.toLocaleString(),
      icon: <LinkIcon className="w-4 h-4 text-[#FF9100]" />,
    },
    {
      label: "HIGHEST COMBO",
      value: highestComboReached.toString(),
      icon: <Target className="w-4 h-4 text-[#111111]" />,
    },
    {
      label: "MAX MULTIPLIER",
      value: `x${highestComboMultiplier.toFixed(1)}`,
      icon: <Zap className="w-4 h-4 text-chrono-red" />,
    },
    {
      label: "COMBO SCORE",
      value: totalComboBonusEarned.toLocaleString(),
      icon: <Sparkles className="w-4 h-4 text-[#FF9100]" />,
    },
    {
      label: "TIME FROZEN",
      value: timeFrozen,
      icon: <Timer className="w-4 h-4 text-[#111111]" />,
    },
    {
      label: "CHRONO USED",
      value: totalChronoUsed.toString(),
      icon: <Zap className="w-4 h-4 text-[#FF9100]" />,
    },
    {
      label: "CHRONO RECOVERED",
      value: totalChronoRecovered.toString(),
      icon: <RefreshCw className="w-4 h-4 text-chrono-red" />,
    },
  ];

  return (
    <div
      className="bg-white border border-[#E0DFDC] p-5 shadow-sm relative flex flex-col justify-between flex-1"
      style={{
        clipPath:
          "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
      }}
    >
      <div className="space-y-4">
        {/* Panel header title */}
        <span className="text-[10px] font-hud font-black tracking-[0.25em] text-[#444444] border-b border-[#E5E5E2] pb-2 block uppercase">
          PERFORMANCE
        </span>

        {/* Dynamic metrics rows */}
        <div className="space-y-3.5">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between font-mono text-[11px] leading-none py-1 border-b border-[#F6F5F2]/60 hover:bg-chrono-bg/10 rounded transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {it.icon}
                <span className="font-extrabold text-[#444444] tracking-wider uppercase">
                  {it.label}
                </span>
              </div>
              <span
                className={`font-hud font-black text-xs ${it.label === "DAMAGE TAKEN" ? "text-chrono-red" : "text-chrono-black"}`}
              >
                {it.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
