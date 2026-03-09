// src/pages/AiriRoom.jsx
import React, { useState, useEffect } from 'react';
import Live2DMascot from '../components/Live2DMascot';

// 安全调用手机硬件震动
const vibrateDevice = (pattern) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch (e) {}
  }
};

const AiriRoom = () => {
  // --- 1. 系统模式侦测 ---
  const [isDayMode, setIsDayMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDayMode(!e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // --- 2. 调律参数 (✅ 已固化校长调试的黄金参数) ---
  const [brightness, setBrightness] = useState(196);      // 预设亮度: 196
  const [magicScale, setMagicScale] = useState(0.6);      // 预设阵法大小: 0.6
  const [roxyScale, setRoxyScale] = useState(2.35);       // 预设 Roxy 大小: 2.35
  const [roxyX, setRoxyX] = useState(119);                // 预设水平位移: 119
  const [roxyY, setRoxyY] = useState(257);                // 预设垂直位移: 257
  const [spinSpeed, setSpinSpeed] = useState(2.5);        // 预设转速: 2.5
  const [showPanel, setShowPanel] = useState(false);
  
  // --- 3. 仪式感三阶段加载 ---
  const [isLoading, setIsLoading] = useState(true);
  const [loadStage, setLoadStage] = useState('INIT');

  useEffect(() => {
    vibrateDevice(50);
    const t1 = setTimeout(() => { setLoadStage('SCAN'); vibrateDevice([100, 50, 100]); }, 1500);
    const t2 = setTimeout(() => { setLoadStage('DEPLOY'); vibrateDevice(400); }, 3000);
    const t3 = setTimeout(() => setIsLoading(false), 4500); 
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // --- 4. 对话系统 ---
  const [speaker, setSpeaker] = useState('ROXY');
  const [message, setMessage] = useState('吾在此处感受汝之内心，来诉说吧');
  const [displayedText, setDisplayedText] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isLoading) return;
    let i = 0; setDisplayedText('');
    const timer = setInterval(() => {
      if (i < message.length) { setDisplayedText(prev => prev + message.charAt(i)); i++; }
      else clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [message, isLoading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    vibrateDevice(30);
    setSpeaker('CHANCELLOR');
    setMessage(inputValue);
    setInputValue('');
    setTimeout(() => {
      setSpeaker('ROXY');
      setMessage('指令已确认。正在调用 BGU 底层权限，正在执行重构操作。');
    }, 1800);
  };

  const theme = isDayMode ? {
    bg: 'from-white via-sky-50 to-blue-100',
    magicColor: 'border-sky-400',
    magicGlow: 'shadow-[0_0_30px_rgba(56,189,248,0.5)]',
    box: 'bg-white/85 border-sky-300 shadow-sky-200/50',
    name: 'bg-sky-500 text-white',
    inputLine: 'border-sky-400/20',
    inputText: 'text-sky-900 placeholder:text-sky-500/50',
    icon: 'text-sky-500'
  } : {
    bg: 'from-indigo-950 via-slate-950 to-black',
    magicColor: 'border-purple-500',
    magicGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
    box: 'bg-slate-900/90 border-purple-500 text-purple-100 shadow-purple-900/50',
    name: 'bg-purple-600 text-white',
    inputLine: 'border-purple-500/50',
    inputText: 'text-purple-50 placeholder:text-purple-400/60',
    icon: 'text-purple-400'
  };

  return (
    <div className={`h-[100dvh] w-screen relative overflow-hidden transition-all duration-1000 bg-gradient-to-br ${theme.bg}`}>
      
      <style>{`
        @keyframes bgu-spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bgu-spin-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .spin-cw { animation: bgu-spin-cw linear infinite; }
        .spin-ccw { animation: bgu-spin-ccw linear infinite; }
      `}</style>

      {/* 🔮 加载层 */}
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className={`absolute w-6 h-6 rounded-full bg-current ${theme.icon} animate-ping ${theme.magicGlow}`} />
            <div className={`absolute w-2 h-2 rounded-full bg-current ${theme.icon}`} />
            {loadStage !== 'INIT' && (
              <>
                <div className={`absolute w-40 h-40 border-4 border-dashed ${theme.magicColor} rounded-full spin-cw`} style={{ animationDuration: '3s' }} />
                <div className={`absolute w-56 h-56 border-y-4 border-transparent border-x-4 ${theme.magicColor} opacity-50 rounded-full spin-ccw`} style={{ animationDuration: '1.5s' }} />
              </>
            )}
            {loadStage === 'DEPLOY' && <div className={`absolute w-full h-full border-8 ${theme.magicColor} rounded-full animate-ping opacity-0`} style={{ animationDuration: '1.5s' }} />}
          </div>
          <div className="mt-16 flex flex-col items-center gap-3">
            <p className={`font-mono text-[10px] ${theme.icon} tracking-[0.5em] font-black`}>
              {loadStage === 'INIT' ? 'CORE_IGNITION...' : loadStage === 'SCAN' ? 'SCANNING_ENVIRONMENT...' : 'MAGIC_LINK_DEPLOYED!'}
            </p>
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full bg-current ${theme.icon} transition-all ease-out`} style={{ width: loadStage === 'INIT' ? '15%' : loadStage === 'SCAN' ? '60%' : '100%', transitionDuration: '1.5s' }} />
            </div>
          </div>
        </div>
      )}

      {/* 🔮 魔法阵背景 */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none transition-transform duration-700"
           style={{ transform: `scale(${magicScale})`, filter: `brightness(${brightness}%)` }}>
        <div className="relative w-full h-full flex items-center justify-center opacity-40">
            <div className={`absolute w-[900px] h-[900px] border-[2px] border-dashed ${theme.magicColor} spin-cw`} style={{ animationDuration: `${40/spinSpeed}s` }} />
            <div className={`absolute w-[700px] h-[700px] border-2 ${theme.magicColor} spin-ccw`} style={{ animationDuration: `${25/spinSpeed}s` }} />
            <div className={`absolute w-[450px] h-[450px] border-[4px] ${theme.magicColor} animate-pulse ${theme.magicGlow}`} />
            <div className={`absolute w-[350px] h-[350px] ${isDayMode ? 'bg-sky-400' : 'bg-purple-600'} blur-[120px] rounded-full opacity-20`} />
        </div>
      </div>

      {/* 🎭 Roxy 展示区 (✅ 应用黄金比例) */}
      <div className="absolute inset-x-0 top-0 h-[70vh] flex items-center justify-center z-10 pointer-events-none overflow-hidden"
         style={{ transform: `translate(${roxyX}px, ${roxyY}px) scale(${roxyScale})`, transformOrigin: 'center center'}}>
        <div className="w-full h-full max-w-4xl">
          <Live2DMascot modelUrl="/live2d/Rory/Roxy_V1.model3.json" />
        </div>
      </div>

      {/* 💬 对话框 */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl z-20">
      
      <div className={`relative backdrop-blur-3xl border-2 rounded-xl p-6 md:p-8 pb-20 md:pb-8 shadow-2xl transition-all ${theme.box}`}>

      <div className={`absolute -top-5 left-8 px-8 py-2 rounded-lg font-black tracking-widest text-sm shadow-xl ${theme.name}`}>
      {speaker}
    </div>

    <div className="min-h-[80px] md:min-h-[100px] text-lg md:text-xl font-medium leading-relaxed mb-4">
      {displayedText}
      <span className="inline-block w-1.5 h-5 ml-2 bg-current animate-bounce" />
    </div>

    <form onSubmit={handleSend} className={`relative flex items-center pt-4 border-t ${theme.inputLine}`}>
      <span className={`mr-3 animate-pulse font-black ${theme.icon}`}>▶</span>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="请在这里诉说 TELL ME HERE"
        className={`bg-transparent w-full outline-none font-mono text-sm tracking-widest ${theme.inputText}`}
      />

    </form>

  </div>

</div>

      {/* 🛠️ 侧边调律面板 */}
      <div className={`fixed top-1/2 -translate-y-1/2 left-0 z-[110] transition-all duration-500 ${showPanel ? 'translate-x-0' : '-translate-x-[calc(100%-24px)]'}`}>
        <div className="flex">
          <div className={`p-6 rounded-r-3xl border-y border-r shadow-2xl w-64 backdrop-blur-xl ${isDayMode ? 'bg-white/95 border-sky-200' : 'bg-slate-900/95 border-purple-500/40'}`}>
            <h3 className={`text-[10px] font-black mb-6 tracking-widest uppercase opacity-70 ${isDayMode ? 'text-sky-900' : 'text-purple-100'}`}>Alignment_Tuning</h3>
            <ControlSlider label="ROXY_SCALE" val={roxyScale} set={setRoxyScale} min={0.5} max={3.0} step={0.01} isDay={isDayMode} />
            <ControlSlider label="Y_OFFSET (上下)" val={roxyY} set={setRoxyY} min={-100} max={400} isDay={isDayMode} />
            <ControlSlider label="X_OFFSET (左右)" val={roxyX} set={setRoxyX} min={-300} max={300} isDay={isDayMode} />
            <ControlSlider label="MAGIC_SIZE" val={magicScale} set={setMagicScale} min={0.2} max={1.3} step={0.01} isDay={isDayMode} />
            <ControlSlider label="BRIGHTNESS" val={brightness} set={setBrightness} min={50} max={250} isDay={isDayMode} />
            <ControlSlider label="SPIN_RATE" val={spinSpeed} set={setSpinSpeed} min={0.1} max={8} step={0.1} isDay={isDayMode} />
            <div className="mt-8 pt-4 border-t border-current/10 flex items-center justify-between text-[10px] font-bold">
              {/* ✅ RESET 现在会重置到校长的黄金参数 */}
              <button onClick={() => {setRoxyScale(2.35); setRoxyX(119); setRoxyY(257); setMagicScale(0.6); setBrightness(196); setSpinSpeed(2.5);}} className="opacity-40 hover:opacity-100 transition-opacity">RESET_CHANCELLOR</button>
              <button onClick={() => setIsDayMode(!isDayMode)} className={`w-10 h-5 rounded-full relative transition-colors ${isDayMode ? 'bg-slate-300' : 'bg-purple-600'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDayMode ? 'left-1' : 'left-6'}`} />
              </button>
            </div>
          </div>
          <button onClick={() => setShowPanel(!showPanel)} className={`w-6 h-32 self-center rounded-r-xl flex items-center justify-center shadow-lg ${isDayMode ? 'bg-sky-500' : 'bg-purple-600'} text-white`}>
            <span className="text-[10px] font-black" style={{ writingMode: 'vertical-lr' }}>{showPanel ? 'CLOSE' : 'VALVE'}</span>
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 z-50 ${
        isDayMode 
        ? 'bg-[radial-gradient(circle_at_center,transparent_40%,rgba(255,255,255,0.3)_100%)]' 
        : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.9)_100%)]'
      }`} />
    </div>
  );
};

const ControlSlider = ({ label, val, set, min, max, step = 1, isDay }) => (
  <div className="mb-4">
    <div className={`flex justify-between text-[9px] mb-1 font-mono font-bold ${isDay ? 'text-sky-900' : 'text-purple-100'}`}>
      <span>{label}</span><span>{val}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(parseFloat(e.target.value))}
           className={`w-full h-1 appearance-none rounded-full cursor-pointer ${isDay ? 'bg-sky-200 accent-sky-500' : 'bg-slate-800 accent-purple-500'}`} />
  </div>
);

export default AiriRoom;