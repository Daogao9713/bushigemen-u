import React, { useState, useEffect, useMemo } from 'react';
import Live2DMascot from '../components/Live2DMascot'; 
import Building3D from '../components/Building3D';
import CampusMap from '../components/CampusMap';
import TerminalChat from '../components/TerminalChat';
import { useWeather } from '../hooks/useWeather';

const CampusView = () => {
  const { condition, city, temp } = useWeather();

  // ✅ 1. 重新注入主题逻辑 (解决 theme is not defined 报错)
  const theme = useMemo(() => {
    const map = {
      Clear: { 
        via: 'via-emerald-500', 
        text: 'text-emerald-500', 
        borderSoft: 'border-emerald-500/20', 
        glow: 'shadow-emerald-500/50' 
      },
      Rain: { 
        via: 'via-sky-400', 
        text: 'text-sky-400', 
        borderSoft: 'border-sky-400/20', 
        glow: 'shadow-sky-400/50' 
      },
      Storm: { 
        via: 'via-amber-500', 
        text: 'text-amber-500', 
        borderSoft: 'border-amber-500/20', 
        glow: 'shadow-amber-500/50' 
      },
    };
    return map[condition] || map.Clear;
  }, [condition]);

  const hackerPhrases = useMemo(() => [
    'DECRYPTING_SAT_LINK...', 
    'INIT_NERV_PROTOCOL_v2.5', 
    'MAGI_SYSTEM_STABLE', 
    'TRACE_IP: 127.0.0.1'
  ], []);
  
  const [terminalLogs, setTerminalLogs] = useState(['> BGU_OS v2.1_STABLE', '> ENCRYPTING...']);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = hackerPhrases[Math.floor(Math.random() * hackerPhrases.length)];
      setTerminalLogs((prev) => [...prev, `> ${randomMsg}`].slice(-4));
    }, 2000);
    return () => clearInterval(interval);
  }, [hackerPhrases]);

  const buildings = [
    { id: 1, name: '金陵科技大楼', color: 'bg-blue-600', top: '15%', left: '25%' },
    { id: 2, name: '北平第二教学楼', color: 'bg-red-700', top: '40%', left: '60%' },
    { id: 3, name: '剥虾工程实验室', color: 'bg-orange-600', top: '65%', left: '25%' },
    { id: 4, name: '教务行政塔', color: 'bg-slate-700', top: '10%', left: '55%' },
  ];

  const gridRGBA = condition === 'Rain' ? 'rgba(56,189,248,0.12)' : condition === 'Storm' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)';
  const userName = (typeof window !== 'undefined' && localStorage.getItem('bgu_user_name')) || 'anonymous';

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-32 relative overflow-hidden flex flex-col transition-all">
      <div className="bg-scanner" />

      {/* 2. 数据流层 */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none z-0">
        <div className="flex justify-around h-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`w-[1px] h-full bg-gradient-to-b from-transparent ${theme.via} to-transparent animate-data-stream`} />
          ))}
        </div>
      </div>

      {/* 3. 3D 核心区 */}
      <div className="flex-grow relative z-10">
        <div className="absolute inset-0 origin-center opacity-30" style={{
            backgroundImage: `linear-gradient(${gridRGBA} 1px, transparent 1px), linear-gradient(90deg, ${gridRGBA} 1px, transparent 1px)`,
            backgroundSize: '50px 50px', transform: 'rotateX(60deg) scale(2.5)',
        }} />

        <div className="absolute inset-0">
          {buildings.map((b, index) => (
            <div 
              key={b.id} 
              className="absolute animate-bgu-float"
              style={{ 
                top: b.top, 
                left: b.left,
                animationDelay: `${index * 0.7}s`
              }}
            >
              <Building3D {...b} />
            </div>
          ))}
        </div>
      </div>

      {/* 4. 左侧终端 */}
      <div className={`fixed bottom-24 md:bottom-8 left-4 right-4 md:right-auto md:left-8 z-[50] md:w-80 bg-black/90 border ${theme.borderSoft} p-3 font-mono backdrop-blur-xl shadow-2xl ${theme.glow}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse`} />
            <span className="text-[10px] text-white font-black uppercase">Command_Center</span>
          </div>
          <span className={`text-[8px] ${theme.text} opacity-50`}>{city} // {temp}°C</span>
        </div>
        
        <div className="text-[8px] text-emerald-500/50 mb-2 font-mono italic">
          {terminalLogs.map((log, i) => <p key={i}>{log}</p>)}
        </div>
        <TerminalChat theme={theme} userName={userName} />
      </div>

      <div className="fixed top-24 right-4 md:top-auto md:bottom-8 md:right-8 w-24 h-24 md:w-40 md:h-40 z-40">
         <CampusMap />
      </div>
    </div>
  );
};

export default CampusView;