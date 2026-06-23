import React from "react";
import { Award, Zap } from "lucide-react";

interface RewardsPanelProps {
  xpReward?: number;
  creditsReward?: number;
}

export default function RewardsPanel({
  xpReward = 1250,
  creditsReward = 750
}: RewardsPanelProps) {
  return (
    <div 
      className="bg-white border border-[#E0DFDC] p-5 shadow-sm relative flex flex-col justify-between flex-1"
      style={{
        clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
      }}
    >
      <div className="space-y-4">
        {/* Panel header title */}
        <span className="text-[10px] font-hud font-black tracking-[0.25em] text-[#444444] border-b border-[#E5E5E2] pb-2 text-center block uppercase">
          REWARDS
        </span>

        {/* Double badge grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          
          {/* XP Reward badge */}
          <div className="flex flex-col items-center justify-center bg-chrono-bg/10 border border-[#FAF9F6] p-3 rounded text-center group">
            <div 
              className="w-12 h-12 flex items-center justify-center bg-[#111111] text-white relative flex-col shadow-sm group-hover:scale-105 transition-transform"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
              }}
            >
              <span className="font-hud text-[10px] tracking-tighter leading-none">XP</span>
            </div>
            
            <span className="font-hud text-sm font-black text-[#111111] mt-2.5">
              {xpReward.toLocaleString()}
            </span>
          </div>

          {/* Credits Reward badge */}
          <div className="flex flex-col items-center justify-center bg-chrono-bg/10 border border-[#FAF9F6] p-3 rounded text-center group">
            <div 
              className="w-12 h-12 flex items-center justify-center bg-[#FF1744] text-white relative flex-col shadow-sm group-hover:scale-105 transition-transform"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
              }}
            >
              <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center bg-transparent">
                <div className="w-1.5 h-1.5 bg-white rotate-45" />
              </div>
            </div>
            
            <span className="font-hud text-sm font-black text-[#111111] mt-2.5">
              {creditsReward.toLocaleString()}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
