import React, { useState, useEffect } from 'react';

const Preloader = ({ onLoaded, onNameSubmitted }) => {
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [userName, setUserName] = useState('');
  const [logs, setLogs] = useState(['> INITIALIZING BGU_OS...', '> ESTABLISHING SATELLITE LINK...']);
  
  const [isDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = isDarkMode 
    ? { bg: 'bg-black', text: 'text-emerald-500', border: 'border-emerald-500', accent: 'emerald', glow: 'shadow-emerald-500/50' }
    : { bg: 'bg-slate-50', text: 'text-sky-500', border: 'border-sky-500', accent: 'sky', glow: 'shadow-sky-500/50' };

  const phrases = ["RE-SCANNING BIOMETRIC...", "BYPASSING FIREWALL...", "MAGI_SYSTEM_HANDSHAKE...", "UPLOADING_SHRIMP_DATA..."];

  useEffect(() => {
    let interval;
    if (isLocked) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 67) {
            setLogs(l => [...l, `> ${phrases[Math.floor(Math.random() * phrases.length)]}`].slice(-4));
            return Math.floor(Math.random() * 20) + 10;
          }
          return prev + Math.random() * 6;
        });
      }, 180);
    }
    return () => clearInterval(interval);
  }, [isLocked]);

  const handleAccess = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;
    if ("vibrate" in navigator) navigator.vibrate([50, 30, 50]);
    setIsLocked(false);
    localStorage.setItem('bgu_user_name', userName.trim());
    onNameSubmitted(userName.trim());
    let p = progress;
    const fast = setInterval(() => {
      p += 4;
      if (p >= 100) {
        setProgress(100); clearInterval(fast);
        setTimeout(() => setIsExiting(true), 200);
        setTimeout(() => onLoaded(), 1000);
      } else { setProgress(p); }
    }, 30);
  };

  return (
    <div className={`fixed inset-0 ${theme.bg} ${theme.text} z-[99999] flex flex-col items-center justify-between font-mono transition-all duration-700 ${isExiting ? 'opacity-0 scale-110 blur-2xl' : 'opacity-100'} py-12 px-6`}>
      
      {/* 1. 背景动画 */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
        <div className="flex justify-around h-full w-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`w-[1px] h-full bg-gradient-to-b from-transparent via-${theme.accent}-500 to-transparent animate-data-stream`} style={{ animationDelay: `${i * 0.8}s` }}></div>
          ))}
        </div>
      </div>

      {/* 2. 中间核心区：使用 flex-grow 自动撑开空间 */}
      <div className="flex-grow flex flex-col items-center justify-center w-full z-10">
        <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-[1px] ${theme.border} flex items-center justify-center relative mb-8 md:mb-12 shadow-[0_0_40px] ${theme.glow}`}>
          <div className={`absolute inset-[-8px] border-t-2 ${theme.border} rounded-full animate-spin-slow`}></div>
          <div className="text-center">
            <h1 className={`text-5xl md:text-6xl font-black italic tracking-tighter ${theme.text}`}>BGU</h1>
            <p className="text-[8px] font-bold opacity-60 tracking-[0.5em] mt-1 uppercase animate-pulse">Auth Mode</p>
          </div>
        </div>

        {/* 🚨 输入面板：去掉 absolute，改为自然流 */}
        <div className="w-full max-w-xs space-y-4">
          <form onSubmit={handleAccess} className="space-y-4">
            <div className={`relative border ${theme.border} bg-white/5 p-1 backdrop-blur-md`}>
              <div className={`absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 ${theme.border}`}></div>
              <div className={`absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 ${theme.border}`}></div>
              <input
                type="text"
                className={`w-full bg-transparent border-none ${theme.text} p-3 text-center focus:ring-0 placeholder-${theme.accent}-900/50 uppercase text-xs md:text-sm font-bold`}
                placeholder="INPUT ACCESS KEY"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
                disabled={!isLocked}
              />
            </div>
            <button 
              disabled={!isLocked}
              className={`w-full py-3 border ${theme.border} ${theme.text} font-black text-[10px] md:text-xs tracking-[0.5em] transition-all duration-300 active:scale-95 ${isLocked ? `hover:bg-${theme.accent}-500 hover:text-white` : 'opacity-30'}`}
            >
              {isLocked ? 'CONFIRM IDENTITY' : 'ACCESS GRANTED'}
            </button>
          </form>
        </div>
      </div>

      {/* 3. 底部进度区：去掉 fixed bottom，让它在 flex 容器底部排队 */}
      <div className="w-full max-w-xs pt-8">
        <div className="flex justify-between text-[10px] mb-2 font-bold tracking-tighter">
          <span className="truncate">{isLocked ? 'SYSTEM_LOCKED' : 'VERIFIED'}</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
          <div 
            className={`h-full bg-${theme.accent}-500 transition-all duration-300 ease-out`}
            style={{ width: `${progress}%`, boxShadow: `0 0 10px var(--tw-shadow-color)` }}
          ></div>
        </div>
        <div className="mt-3 h-12 overflow-hidden">
          {logs.map((log, i) => (
            <p key={i} className="text-[8px] opacity-40 font-mono italic truncate">{log}</p>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Preloader;