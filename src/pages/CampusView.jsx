import React, { useState, useEffect, useMemo } from 'react';
import Building3D from '../components/Building3D';
import CampusMap from '../components/CampusMap';
import TerminalChat from '../components/TerminalChat';
import { useWeather } from '../hooks/useWeather';

const CampusView = () => {
  const { condition, city, temp } = useWeather();

  const theme = useMemo(() => {
    const map = {
      Clear: {
        text: 'text-emerald-500',
        textDim: 'text-emerald-500/80',
        via: 'via-emerald-500',
        border: 'border-emerald-500',
        borderSoft: 'border-emerald-500/20',
        glow: 'shadow-emerald-500/50',
        accent: 'emerald'
      },
      Rain: {
        text: 'text-sky-400',
        textDim: 'text-sky-400/80',
        via: 'via-sky-400',
        border: 'border-sky-400',
        borderSoft: 'border-sky-400/20',
        glow: 'shadow-sky-400/50',
        accent: 'sky'
      },
      Storm: {
        text: 'text-amber-500',
        textDim: 'text-amber-500/80',
        via: 'via-amber-500',
        border: 'border-amber-500',
        borderSoft: 'border-amber-500/20',
        glow: 'shadow-amber-500/50',
        accent: 'amber'
      },
    };
    return map[condition] || map.Clear;
  }, [condition]);

  const hackerPhrases = ['DECRYPTING_SAT_LINK...', 'INIT_NERV_PROTOCOL_v2.5', 'UPLOADING_SHRIMP_DATA...', 'MAGI_SYSTEM_STABLE', 'TRACE_IP: 127.0.0.1 (SELF)'];
  const [terminalLogs, setTerminalLogs] = useState(['> BGU_OS v2.1_STABLE', '> ENCRYPTING...']);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = hackerPhrases[Math.floor(Math.random() * hackerPhrases.length)];
      setTerminalLogs((prev) => [...prev, `> ${randomMsg}`].slice(-4)); // 减少日志数量，腾出空间
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const buildings = [
    { id: 1, name: '金陵科技大楼', info: '计算中心', status: 'PROCESSING', color: 'bg-blue-600', top: '15%', left: '25%' },
    { id: 2, name: '北平第二教学楼', info: '研究院', status: 'SECURED', color: 'bg-red-700', top: '40%', left: '60%' },
    { id: 3, name: '剥虾工程实验室', info: '生命科学', status: 'FRYING', color: 'bg-orange-600', top: '65%', left: '25%' },
    { id: 4, name: '教务行政塔', info: '校长室', status: 'MONITORING', color: 'bg-slate-700', top: '10%', left: '55%' },
  ];

  const gridRGBA = condition === 'Rain' ? 'rgba(56,189,248,0.12)' : condition === 'Storm' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)';
  const userName = (typeof window !== 'undefined' && localStorage.getItem('bgu_user_name')) || 'anonymous';

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-32 relative overflow-hidden flex flex-col transition-all duration-1000">
      
      {/* 气象背景 */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none z-0">
        <div className="flex justify-around h-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`w-[1px] h-full bg-gradient-to-b from-transparent ${theme.via} to-transparent animate-data-stream`} />
          ))}
        </div>
      </div>

      {/* 3D 空间：调低 z-index 确保不挡住 UI */}
      <div className="flex-grow relative z-10">
        <div className="absolute inset-0 origin-center opacity-30" style={{
            backgroundImage: `linear-gradient(${gridRGBA} 1px, transparent 1px), linear-gradient(90deg, ${gridRGBA} 1px, transparent 1px)`,
            backgroundSize: '50px 50px', transform: 'rotateX(60deg) scale(2.5)',
        }} />
        <div className="absolute inset-0">
          {buildings.map((b) => (
            <div key={b.id} className="absolute" style={{ top: b.top, left: b.left }}>
              <Building3D {...b} />
            </div>
          ))}
        </div>
      </div>

      {/* 5) 左侧终端：优化移动端高度和遮挡 */}
      <div className={`fixed bottom-24 md:bottom-8 left-4 right-4 md:right-auto md:left-8 z-[50] md:w-80 bg-black/90 border ${theme.borderSoft} p-3 font-mono backdrop-blur-xl shadow-2xl ${theme.glow}`}>
        <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-1">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 ${condition === 'Storm' ? 'bg-orange-500' : 'bg-red-600'} rounded-full animate-pulse`} />
            <span className="text-[10px] text-white font-black uppercase">Command_Center</span>
          </div>
          <span className={`text-[8px] ${theme.text} opacity-50 uppercase tracking-tighter`}>{city} // {temp}°C</span>
        </div>

        {/* 电脑端显示日志，手机端隐藏日志以腾出空间 */}
        <div className={`hidden md:block text-[8px] ${theme.textDim} opacity-50 h-16 overflow-hidden mb-2`}>
          {terminalLogs.map((log, i) => <p key={i} className="truncate italic">{log}</p>)}
        </div>

        {/* 聊天组件 */}
        <TerminalChat theme={theme} userName={userName} />
      </div>

      {/* 6) 右侧雷达：手机端缩小 */}
      <div className="fixed top-24 right-4 md:top-auto md:bottom-8 md:right-8 w-24 h-24 md:w-40 md:h-40 z-40 opacity-80 md:opacity-100">
         <CampusMap />
      </div>

      {condition === 'Storm' && <div className="fixed inset-0 pointer-events-none bg-orange-500/5 animate-pulse mix-blend-overlay z-[60]" />}
    </div>
  );
};

export default CampusView;