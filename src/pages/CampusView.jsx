import React, { useState, useEffect } from 'react';
import Building3D from '../components/Building3D';
import CampusMap from '../components/CampusMap';

const CampusView = () => {
  // --- 模拟黑客代码语料库 ---
  const hackerPhrases = [
    "DECRYPTING_SAT_LINK...",
    "INIT_NERV_PROTOCOL_v2.5",
    "UPLOADING_SHRIMP_DATA...",
    "MAGI_SYSTEM_STABLE",
    "TRACE_IP: 127.0.0.1 (SELF)",
    "SYNCING_LING_CORES...",
    "ACCESS_GRANTED: CHANCELLOR",
    "CLEANING_CACHE...",
    "SIGNAL_STRENGTH: 99%",
    "COFFEE_MACHINE_ONLINE"
  ];

  const [terminalLogs, setTerminalLogs] = useState(['> BGU_OS v2.1_STABLE', '> ENCRYPTING...']);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = hackerPhrases[Math.floor(Math.random() * hackerPhrases.length)];
      setTerminalLogs(prev => [...prev, `> ${randomMsg}`].slice(-6)); // 手机端只留6行，防止过高
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const buildings = [
    { id: 1, name: '金陵科技大楼', info: '云端计算中心 & MAGI 主机', status: 'PROCESSING', color: 'bg-blue-600', top: '20%', left: '30%' },
    { id: 2, name: '北平第二教学楼', info: '哥们儿社会学研究院', status: 'SECURED', color: 'bg-red-700', top: '45%', left: '55%' },
    { id: 3, name: '剥虾工程实验室', info: '生命科学实验基地', status: 'FRYING', color: 'bg-orange-600', top: '65%', left: '20%' },
    { id: 4, name: '教务行政塔', info: '校长办公室', status: 'MONITORING', color: 'bg-slate-700', top: '10%', left: '60%' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-48 relative overflow-hidden flex flex-col">
      {/* 顶部标题 */}
      <div className="relative z-30 px-6">
        <div className="border-l-2 border-emerald-500 pl-4">
          <h2 className="text-emerald-500 font-black italic tracking-widest text-xl">SECTOR_01: BGU</h2>
          <p className="text-slate-500 text-[8px] font-mono">Suginami Satellite Link: Active</p>
        </div>
      </div>

      {/* 核心 3D 空间 */}
      <div className="flex-grow relative mt-4">
        {/* 背景网格 */}
        <div className="absolute inset-0 origin-center" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)',
               backgroundSize: '60px 60px',
               transform: 'rotateX(60deg) scale(2.5)',
             }}>
        </div>

        {/* 建筑布局 */}
        <div className="absolute inset-0 z-10">
          {buildings.map(b => (
            <div key={b.id} className="absolute" style={{ top: b.top, left: b.left }}>
              <Building3D {...b} />
            </div>
          ))}
        </div>
      </div>

      {/* 🚨 手机端 UI 避让逻辑：统一 bottom-24 (避开高度约 80px 的菜单栏) */}
      
      {/* 左侧：黑客终端 */}
      <div className="fixed bottom-24 md:bottom-10 left-4 md:left-10 z-40 w-44 md:w-72 bg-black/80 border border-emerald-500/20 p-3 font-mono backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-[8px] text-white font-bold uppercase">Live Terminal</span>
        </div>
        <div className="text-[8px] text-emerald-500/80 space-y-1">
          {terminalLogs.map((log, i) => (
            <p key={i} className="truncate opacity-70 italic">{log}</p>
          ))}
        </div>
      </div>

      {/* 右侧：雷达小地图 */}
      <div className="fixed bottom-24 md:bottom-10 right-4 md:right-10 w-32 h-32 md:w-44 md:h-44 z-40 scale-90 md:scale-100">
        <div className="absolute -top-4 right-0 text-emerald-500 text-[7px] font-black italic opacity-60">TACTICAL_MONITOR</div>
        <CampusMap />
      </div>
    </div>
  );
};

export default CampusView;