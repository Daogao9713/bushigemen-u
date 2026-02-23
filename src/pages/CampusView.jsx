import React, { useEffect, useState, useRef } from 'react';
import Building3D from '../components/Building3D';
import CampusMap from '../components/CampusMap';

const hackerPhrases = [
  "DECRYPTING_SAT_LINK...",
  "BYPASSING_SUGINAMI_FIREWALL...",
  "INIT_NERV_PROTOCOL_v2.5",
  "UPLOADING_SHRIMP_DATA...",
  "MAGI_SYSTEM_STABLE",
  "TRACE_IP: 127.0.0.1 (SELF)",
  "SYNCING_GOLDEN_LING_CORES...",
  "ACCESS_GRANTED: SUZUMIYA",
  "CLEANING_CACHE_FOR_BROTHERS...",
  "COFFEE_MACHINE_CONNECTED"
];

const CampusView = () => {
  const buildings = [
    { id: 1, name: '金陵科技大楼', info: 'BGU 云端计算中心 & MAGI 主机房', status: 'PROCESSING', color: 'bg-blue-600', top: '25%', left: '35%' },
    { id: 2, name: '北平第二教学楼', info: '哥们儿社会学研究院 & 荣誉室', status: 'SECURED', color: 'bg-red-700', top: '50%', left: '55%' },
    { id: 3, name: '剥虾工程实验室', info: '生命科学(深夜食堂)实验基地', status: 'FRYING', color: 'bg-orange-600', top: '65%', left: '20%' },
    { id: 4, name: '教务行政塔', info: '校长办公室 (SUZUMIYA 专用)', status: 'MONITORING', color: 'bg-slate-700', top: '15%', left: '60%' },
  ];

  // ✅ 左下角终端：动态日志
  const [terminalLogs, setTerminalLogs] = useState([
    '> BGU_OS v2.1_STABLE',
    '> ENCRYPTING CONNECTION...'
  ]);

  // 用 setTimeout 做“1~2秒随机间隔”，比 setInterval 更贴合需求
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const tick = () => {
      const randomDelay = 1000 + Math.floor(Math.random() * 1000); // 1000~1999ms

      timerRef.current = setTimeout(() => {
        if (cancelled) return;

        const randomMsg = hackerPhrases[Math.floor(Math.random() * hackerPhrases.length)];
        setTerminalLogs(prev => {
          const updated = [...prev, `> ${randomMsg}`];
          return updated.slice(-8); // 只保留最新 8 条
        });

        tick(); // 继续下一轮
      }, randomDelay);
    };

    tick();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 relative overflow-hidden flex flex-col transition-all duration-700">
      {/* 赛博装饰线条 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20"></div>

      {/* 1. 抬头文字：更有军用感 */}
      <div className="relative z-30 px-10">
        <div className="inline-block border-l-2 border-emerald-500 pl-4 py-1">
          <h2 className="text-emerald-500 font-black italic tracking-[0.3em] text-2xl md:text-3xl">
            SECTOR: BGU CAMPUS
          </h2>
          <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">
            Encryption: AES-256 | Connection: Suginami Satellite
          </p>
        </div>
      </div>

      {/* 2. 核心 3D 地形 */}
      <div className="flex-grow relative mt-10 perspective-[1200px]" style={{ perspective: '1200px' }}>
        {/* 动态地面网格 */}
        <div
          className="absolute inset-0 origin-center translate-y-[-10%]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16,185,129,0.1) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(16,185,129,0.1) 1.5px, transparent 1.5px)',
            backgroundSize: '80px 80px',
            transform: 'rotateX(60deg) scale(2.5)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* 在网格上画几条“能源传输线” */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
        </div>

        {/* 建筑布局 */}
        <div className="absolute inset-0 z-10">
          {buildings.map(b => (
            <div key={b.id} className="absolute transition-all hover:z-50" style={{ top: b.top, left: b.left }}>
              <Building3D {...b} />
            </div>
          ))}
        </div>
      </div>

      {/* 3. 雷达小地图（右下角） */}
      <div className="fixed bottom-8 right-8 w-44 h-44 z-40 group">
        <div className="absolute -top-5 right-0 text-emerald-500 text-[9px] font-black uppercase italic tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
          Tactical Monitor
        </div>
        <CampusMap />
      </div>

      {/* 4. 左侧状态终端（已改：随机模拟指令 + 宽度自适应） */}
      <div className="fixed bottom-6 left-6 z-40 w-[200px] md:w-72 bg-black/80 border border-emerald-500/30 p-3 font-mono shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-[8px] md:text-[10px] text-white font-bold uppercase tracking-tighter">
              Live Terminal
            </span>
          </div>
          <span className="text-[8px] text-emerald-500/30">ID_996</span>
        </div>

        <div className="text-[8px] md:text-[9px] text-emerald-500/80 space-y-1 transition-all">
          {terminalLogs.map((log, index) => (
            <p
              key={index}
              className={`truncate ${
                index === terminalLogs.length - 1
                  ? 'animate-pulse text-emerald-300'
                  : 'opacity-60'
              }`}
            >
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampusView;