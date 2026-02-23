import React, { useState } from 'react';

const CampusMap = () => {
  const [activeSite, setActiveSite] = useState(null);
  const sites = [
    { id: 'command', name: '金陵科技楼', x: 120, y: 80, info: 'BGU 算力核心' },
    { id: 'hall', name: '北平二教', x: 220, y: 180, info: '名人堂档案' },
    { id: 'news', name: '临时据点', x: 80, y: 220, info: '杉并区观测站' },
  ];

  return (
    /* 🚨 修复点：取消 overflow-hidden，允许 UI 溢出显示 */
    <div className="relative w-full aspect-square bg-slate-950/80 rounded-full border border-emerald-500/30 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.1)]">
      
      {/* 扫描动画层 */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[50%] h-[100px] bg-gradient-to-t from-emerald-500/40 to-transparent origin-bottom -translate-x-1/2 -translate-y-full animate-[spin_4s_linear_infinite] pointer-events-none"></div>
      </div>

      <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full overflow-visible z-20">
        {sites.map(site => (
          <g key={site.id} className="cursor-pointer group" onMouseEnter={() => setActiveSite(site)}>
            <circle cx={site.x} cy={site.y} r="4" className="fill-emerald-400 animate-pulse" />
            <circle cx={site.x} cy={site.y} r="10" className="stroke-emerald-500 fill-transparent stroke-1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            
            {/* 🚨 修复点：确保文字始终在最上层，且背景半透明增加可读性 */}
            <g className={`transition-opacity duration-300 ${activeSite?.id === site.id ? 'opacity-100' : 'opacity-0'}`}>
              <rect x={site.x + 10} y={site.y - 25} width="80" height="20" rx="4" className="fill-black/80" />
              <text x={site.x + 15} y={site.y - 11} className="fill-emerald-400 text-[10px] font-bold uppercase italic font-mono">
                {site.name}
              </text>
            </g>
          </g>
        ))}
      </svg>
      
      {/* 装饰同心圆 */}
      <div className="absolute inset-[15%] border border-emerald-500/10 rounded-full pointer-events-none"></div>
      <div className="absolute inset-[35%] border border-emerald-500/10 rounded-full pointer-events-none"></div>
    </div>
  );
};

export default CampusMap;