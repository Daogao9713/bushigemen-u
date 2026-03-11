import React from 'react';
import { useSoulStore } from '../store/useSoulStore';
import { getMoodStage } from '../lib/mood';

export default function MoodHUD() {
  // 订阅 Zustand 中的心情值
  const mood = useSoulStore((s) => s.mood);
  const stage = getMoodStage(mood);

  return (
    <div className="absolute left-6 top-6 z-50 rounded-2xl border border-sky-500/20 bg-slate-900/60 backdrop-blur-md px-5 py-3 shadow-xl pointer-events-none transition-all duration-500">
      <div className="flex items-center justify-between gap-6 mb-1">
        <span className="text-[9px] font-black tracking-widest text-sky-500/70 uppercase">Sync_Rate</span>
        {/* 呼吸灯 */}
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current ${stage.color}`} />
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-black italic tracking-tighter ${stage.color} transition-colors duration-500`}>
          {mood}<span className="text-lg opacity-50">%</span>
        </span>
      </div>
      <div className="text-[10px] font-mono text-slate-300 mt-1 uppercase tracking-widest opacity-80">
        Status: [{stage.label}]
      </div>
    </div>
  );
}