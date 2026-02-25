import React, { useState, useRef } from 'react';
import { playSound } from '../utils/audioHelper';

const Building3D = ({ name, colorClass, info, status }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverPlayedRef = useRef(false);

  const handleMouseEnter = () => {
    setIsHovered(true);

    // 防止快速抖动反复触发
    if (!hoverPlayedRef.current) {
      playSound('hover');
      hoverPlayedRef.current = true;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    hoverPlayedRef.current = false;
  };

  return (
    <div
      className="relative transition-all duration-700"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: 'rotateX(60deg) rotateZ(-45deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 信息浮层 */}
      <div
        className={`absolute -top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
          isHovered
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-10 scale-90'
        }`}
        style={{
          transform: 'rotateZ(45deg) rotateX(-60deg) translateZ(120px)',
          pointerEvents: 'none'
        }}
      >
        <div className="bg-slate-900/95 border border-emerald-500/50 p-3 shadow-[0_0_30px_rgba(16,185,129,0.4)] backdrop-blur-xl min-w-[140px]">
          <div className="flex justify-between items-start mb-1">
            <span className="text-emerald-400 font-black text-xs uppercase tracking-tighter italic">
              {name}
            </span>
            <span className="text-[8px] text-emerald-600 font-mono">
              ID: {Math.floor(Math.random() * 999)}
            </span>
          </div>

          <p className="text-[9px] text-slate-400 font-mono leading-tight border-t border-emerald-500/20 pt-1">
            {info}
          </p>

          <div className="flex items-center gap-1 mt-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
            <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">
              {status}
            </p>
          </div>
        </div>
      </div>

      {/* 建筑主体 */}
      <div
        className="relative w-16 h-16 group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 顶面 */}
        <div
          className={`absolute inset-0 ${colorClass} brightness-125 border border-white/20 shadow-inner`}
          style={{
            transform: 'translateZ(80px)',
            transition: 'transform 0.5s'
          }}
        >
          <div className="absolute inset-2 border border-white/10 flex items-center justify-center">
            <span className="text-[8px] opacity-20">BGU</span>
          </div>
        </div>

        {/* 正面 */}
        <div
          className={`absolute inset-0 ${colorClass} brightness-100 border border-white/10 origin-bottom`}
          style={{
            height: '80px',
            transform: 'rotateX(-90deg)'
          }}
        >
          <div className="grid grid-cols-4 gap-1 p-2 opacity-20">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-2 bg-white rounded-sm"></div>
            ))}
          </div>
        </div>

        {/* 侧面 */}
        <div
          className={`absolute inset-0 ${colorClass} brightness-75 border border-white/10 origin-right`}
          style={{
            width: '80px',
            transform: 'rotateY(90deg)'
          }}
        >
          <div className="w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>
        </div>

        {/* 地基阴影 */}
        <div className="absolute inset-0 bg-black/40 blur-xl -z-10"></div>
      </div>
    </div>
  );
};

export default Building3D;