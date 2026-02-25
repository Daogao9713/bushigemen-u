import React, { useState, useEffect } from "react";

const Preloader = ({ onLoaded, onNameSubmitted }) => {
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [userName, setUserName] = useState("");
  const [logs, setLogs] = useState([
    "> INITIALIZING BGU_OS...",
    "> ESTABLISHING SATELLITE LINK...",
  ]);

  // ✅ 自动感知系统颜色偏好（避免 SSR 报错）
  const [isDarkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
  });

  // 🎨 主题配色定义（把所有会动态拼接的类名改成固定字符串）
  const theme = isDarkMode
    ? {
        bg: "bg-black",
        text: "text-emerald-500",
        border: "border-emerald-500",
        via: "via-emerald-500",
        placeholder: "placeholder-emerald-900/50",
        hoverBg: "hover:bg-emerald-500",
        progressBg: "bg-emerald-500",
        glow: "shadow-emerald-500/50",
        progressGlow: "shadow-[0_0_15px_rgba(16,185,129,0.55)]", // emerald-500
      }
    : {
        bg: "bg-slate-50",
        text: "text-sky-500",
        border: "border-sky-500",
        via: "via-sky-500",
        placeholder: "placeholder-sky-900/50",
        hoverBg: "hover:bg-sky-500",
        progressBg: "bg-sky-500",
        glow: "shadow-sky-500/50",
        progressGlow: "shadow-[0_0_15px_rgba(14,165,233,0.55)]", // sky-500
      };

  // 📝 随机终端语料
  const phrases = [
    "RE-SCANNING BIOMETRIC...",
    "BYPASSING FIREWALL...",
    "NEURAL_SYNC_ERROR: RE-TRYING",
    "MAGI_SYSTEM_HANDSHAKE...",
    "UPLOADING_SHRIMP_PROTOCOLS...",
    "CLEARING_CACHE...",
  ];

  useEffect(() => {
    let interval;
    if (isLocked) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 67) {
            setLogs((l) =>
              [...l, `> ${phrases[Math.floor(Math.random() * phrases.length)]}`].slice(-5)
            );
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

    if ("vibrate" in navigator) {
      navigator.vibrate([50, 30, 50]);
    }

    setIsLocked(false);
    localStorage.setItem("bgu_user_name", userName.trim());
    onNameSubmitted(userName.trim());

    let p = progress;
    const fast = setInterval(() => {
      p += 4;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        clearInterval(fast);
        setTimeout(() => setIsExiting(true), 200);
        setTimeout(() => onLoaded(), 1000);
      } else {
        setProgress(p);
      }
    }, 30);
  };

  return (
    <div
      className={`fixed inset-0 ${theme.bg} ${theme.text} z-[99999] flex flex-col items-center justify-center font-mono transition-all duration-700 ease-in-out ${
        isExiting ? "opacity-0 scale-110 blur-2xl" : "opacity-100"
      }`}
    >
      {/* 1. 背景：流动的数字雨/线条（整合版） */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-[0.1] pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`absolute top-0 h-full w-[1px] bg-gradient-to-b from-transparent ${theme.via} to-transparent animate-data-stream`}
            style={{
              left: `${(i / 12) * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* 2. 核心 UI (SAO 圆环) */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`w-64 h-64 rounded-full border-[1px] ${theme.border} flex items-center justify-center relative mb-12 shadow-[0_0_40px] ${theme.glow}`}
        >
          <div className={`absolute inset-[-8px] border-t-2 ${theme.border} rounded-full animate-spin`} />
          <div className="text-center">
            <h1 className={`text-6xl font-black italic tracking-tighter ${theme.text}`}>BGU</h1>
            <p className="text-[10px] font-bold opacity-60 tracking-[0.5em] mt-1 uppercase animate-pulse">
              {isLocked ? "Authenticating" : "Verified"}
            </p>
          </div>
        </div>

        {/* 3. 输入交互面板 */}
        <div className="w-80 px-4">
          <form onSubmit={handleAccess} className="space-y-4">
            <div className={`relative border ${theme.border} bg-white/5 p-1 backdrop-blur-md group`}>
              <div className={`absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 ${theme.border}`} />
              <div className={`absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 ${theme.border}`} />

              <input
                type="text"
                className={`w-full bg-transparent border-none ${theme.text} p-3 text-center focus:ring-0 ${theme.placeholder} uppercase text-sm font-bold`}
                placeholder="INPUT ACCESS KEY"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
                disabled={!isLocked}
              />
            </div>

            <button
              disabled={!isLocked}
              className={`w-full py-3 border ${theme.border} ${theme.text} font-black text-xs tracking-[0.6em] transition-all duration-300 ${
                isLocked ? `${theme.hoverBg} hover:text-white` : "opacity-30 cursor-not-allowed"
              }`}
            >
              {isLocked ? "CONFIRM IDENTITY" : "ACCESS GRANTED"}
            </button>
          </form>
        </div>
      </div>

      {/* 4. 底部进度与终端日志 */}
      <div className="fixed bottom-12 w-80 px-4">
        <div className="flex justify-between text-[10px] mb-2 font-bold tracking-tighter">
          <span>{isLocked ? "SYSTEM_LOCKED_PENDING_ID" : "IDENTITY_VERIFIED_SUCCESS"}</span>
          <span className="animate-pulse">{Math.floor(progress)}%</span>
        </div>

        <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
          <div
            className={`h-full ${theme.progressBg} ${theme.progressGlow} transition-all duration-300 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 h-16 overflow-hidden">
          {logs.map((log, i) => (
            <p key={i} className="text-[9px] opacity-40 font-mono italic leading-relaxed truncate">
              {log}
            </p>
          ))}
        </div>
      </div>

      {isExiting && <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />}
    </div>
  );
};

export default Preloader;