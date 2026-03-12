// src/pages/AiriRoom.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Live2DMascot from '../components/Live2DMascot';
import { useSoulStore } from '../store/useSoulStore';
import MoodHUD from '../components/MoodHUD';
import { sendToLLM } from '../lib/llm';
import { exportMemory, parseMemoryFile } from '../lib/memory';

// 如果你项目里已经有 vibration 工具函数，就把这个删掉改成 import
const vibrateDevice = (pattern) => {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

const AiriRoom = () => {
  const containerRef = useRef(null);
  const mascotRef = useRef(null);
  const lastInteractionTime = useRef(Date.now());
  const loadTimers = useRef([]);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  // -----------------------------
  // 1) 全局状态 / 灵魂状态
  // -----------------------------
  const mood = useSoulStore((s) => s.mood);
  const setMood = useSoulStore((s) => s.setMood);
  const changeMood = useSoulStore((s) => s.changeMood);
  const loggedInUserName = useSoulStore((s) => s.loggedInUserName);
  const messages = useSoulStore((s) => s.messages);
  const addMessage = useSoulStore((s) => s.addMessage);
  const memorySummary = useSoulStore((s) => s.memorySummary);
  const setMemorySummary = useSoulStore((s) => s.setMemorySummary);

  // -----------------------------
  // 2) 本地 UI 状态
  // -----------------------------
  const [speaker, setSpeaker] = useState('SYSTEM');
  const [message, setMessage] = useState('正在建立 BGU 灵魂链路...');
  const [displayedText, setDisplayedText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  // -----------------------------
  // 3) 系统主题侦测
  // -----------------------------
  const [isDayMode, setIsDayMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDayMode(!e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  // -----------------------------
  // 4) 打字机效果
  // -----------------------------
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    if (!message) return;

    const timer = setInterval(() => {
      index += 1;
      setDisplayedText(message.slice(0, index));
      if (index >= message.length) clearInterval(timer);
    }, 24);

    return () => clearInterval(timer);
  }, [message]);

  // -----------------------------
  // 5) 核心锁定与视觉视口同步协议
  // -----------------------------
  useEffect(() => {
    const initialHeight = window.innerHeight;
    if (containerRef.current) {
      containerRef.current.style.height = `${initialHeight}px`;
    }

    const handleViewportChange = () => {
      if (window.visualViewport) {
        const offset = window.innerHeight - window.visualViewport.height;
        setKeyboardHeight(offset > 0 ? offset : 0);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }

    const preventDefault = (e) => {
      const tag = e.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        if (e.cancelable) e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
      document.removeEventListener('touchmove', preventDefault);
      document.body.style.position = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overscrollBehavior = '';
    };
  }, []);

  // -----------------------------
  // 6) 调律参数
  // -----------------------------
  const [brightness, setBrightness] = useState(400);
  const [magicScale, setMagicScale] = useState(0.6);
  const [roxyScale, setRoxyScale] = useState(2.15);
  const [roxyX, setRoxyX] = useState(13);
  const [roxyY, setRoxyY] = useState(123);
  const [spinSpeed, setSpinSpeed] = useState(2.5);
  const [showPanel, setShowPanel] = useState(false);

  // -----------------------------
  // 7) 仪式感加载系统
  // -----------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [loadStage, setLoadStage] = useState('INIT');

  useEffect(() => {
    vibrateDevice(50);

    loadTimers.current.push(
      setTimeout(() => {
        setLoadStage('SCAN');
        vibrateDevice([100, 50, 100]);
      }, 1500)
    );

    loadTimers.current.push(
      setTimeout(() => {
        setLoadStage('DEPLOY');
        vibrateDevice(400);
      }, 3000)
    );

    loadTimers.current.push(
      setTimeout(() => {
        setIsLoading(false);
      }, 4500)
    );

    return () => loadTimers.current.forEach(clearTimeout);
  }, []);

  // -----------------------------
  // 8) 核心对话处理
  // -----------------------------
  const processChat = useCallback(
    async (userInput, isInteraction = false) => {
      const cleanText = String(userInput || '').trim();
      if (!cleanText) return;
      if (isLoading || isThinking) return;

      setIsThinking(true);
      lastInteractionTime.current = Date.now();

      if (!isInteraction) {
        setSpeaker('CHANCELLOR');
        setMessage(cleanText);
      } else {
        console.log('触发物理互动:', cleanText);
      }

      const userMessage = {
        role: 'user',
        content: isInteraction ? `[动作] ${cleanText}` : cleanText,
      };

      const nextHistory = [...messages, userMessage];
      addMessage(userMessage);

      try {
        const res = await sendToLLM({
          message: cleanText,
          messagesHistory: nextHistory,
          currentMood: mood,
          memorySummary,
          isInteraction,
        });

        const replyText = res?.reply || '...我在听。';
        const moodDelta = Number(res?.mood_change ?? 0);

        changeMood(moodDelta);
        setSpeaker('ROXY');
        setMessage(replyText);

        addMessage({
          role: 'assistant',
          content: replyText,
        });

        if (mascotRef.current) {
          if (res?.motion) mascotRef.current.playMotion(res.motion);
          if (res?.expression) mascotRef.current.setExpression(res.expression);
        }

        vibrateDevice(isInteraction ? [30, 30] : [30, 50]);
      } catch (error) {
        console.error('AI 链路异常', error);
        setSpeaker('SYSTEM');
        setMessage('[ERR] MAGI 链路连接超时，请重试。');
      } finally {
        setIsThinking(false);
      }
    },
    [isLoading, isThinking, messages, mood, memorySummary, addMessage, changeMood]
  );

  // -----------------------------
  // 9) 拖拽导入记忆系统
  // -----------------------------
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = parseMemoryFile(event.target.result);

      if (data) {
        loadTimers.current.forEach(clearTimeout);

        setMood(data.mood);
        setMemorySummary(data.summary);

        vibrateDevice([50, 100, 50]);
        setIsLoading(false);
        setSpeaker('ROXY');
        setMessage(`记忆链接已恢复。欢迎回来，${data.userName}。`);
      } else {
        setSpeaker('SYSTEM');
        setMessage('记忆结晶解析失败。');
      }
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    if (isLoading || memorySummary) return;

    const t = setTimeout(() => {
      setSpeaker('ROXY');
      setMessage('链路稳定。校长，这里是 Airi Room...我已经在等你了。');
      vibrateDevice(20);
    }, 300);

    return () => clearTimeout(t);
  }, [isLoading, memorySummary]);

  // -----------------------------
  // 10) 表单发送
  // -----------------------------
  const handleSend = async (e) => {
    e.preventDefault();

    const userText = inputValue.trim();
    if (!userText) return;

    setInputValue('');
    await processChat(userText, false);
  };

  // -----------------------------
  // 11) 监听物理互动事件
  // -----------------------------
  useEffect(() => {
    const handlePhysicalHit = (e) => {
      processChat(e.detail, true);
    };

    window.addEventListener('roxy_interaction', handlePhysicalHit);
    return () => window.removeEventListener('roxy_interaction', handlePhysicalHit);
  }, [processChat]);

  // -----------------------------
  // 12) 离场协议
  // -----------------------------
  const handleExit = () => {
    vibrateDevice(100);
    exportMemory(loggedInUserName, mood, messages);
    window.location.href = '/';
  };

  // -----------------------------
  // 13) 灵魂唤醒：监听主动发言 + 随机 idle
  // -----------------------------
  useEffect(() => {
    if (isLoading) return;

    const handleRoxySpeech = (e) => {
      lastInteractionTime.current = Date.now();
      setSpeaker('ROXY');
      setMessage(e.detail || '......');
      vibrateDevice(20);
    };

    window.addEventListener('roxy_speech', handleRoxySpeech);

    const idleTimer = setInterval(() => {
      const silenceDuration = Date.now() - lastInteractionTime.current;
      if (silenceDuration < 30000) return;
      if (isThinking) return;

      const randomSpeechPool = [
        '校长，你在看什么呢？',
        'BGU 今天的风儿略显嘈杂...',
        '总觉得，有种被注视的感觉...',
        '是在发呆吗？',
        '这种静谧的感觉，并不讨厌。',
      ];

      const randomSpeech =
        randomSpeechPool[Math.floor(Math.random() * randomSpeechPool.length)];

      window.dispatchEvent(new CustomEvent('roxy_random_idle'));
      setSpeaker('ROXY');
      setMessage(randomSpeech);
    }, 25000);

    return () => {
      window.removeEventListener('roxy_speech', handleRoxySpeech);
      clearInterval(idleTimer);
    };
  }, [isLoading, isThinking]);

  // -----------------------------
  // 14) 主题配置
  // -----------------------------
  const theme = isDayMode
    ? {
        bg: 'from-white via-sky-50 to-blue-100',
        magicColor: 'border-sky-400',
        magicGlow: 'shadow-[0_0_30px_rgba(56,189,248,0.5)]',
        box: 'bg-white/85 border-sky-300 shadow-sky-200/50',
        name: 'bg-sky-500 text-white',
        inputLine: 'border-sky-400/20',
        inputText: 'text-sky-900 placeholder:text-sky-500/50',
        icon: 'text-sky-500',
      }
    : {
        bg: 'from-indigo-950 via-slate-950 to-black',
        magicColor: 'border-purple-500',
        magicGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
        box: 'bg-slate-900/90 border-purple-500 text-purple-100 shadow-purple-900/50',
        name: 'bg-purple-600 text-white',
        inputLine: 'border-purple-500/50',
        inputText: 'text-purple-50 placeholder:text-purple-400/60',
        icon: 'text-purple-400',
      };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-screen overflow-hidden transition-all duration-1000 bg-gradient-to-br ${theme.bg} touch-none`}
    >
      <style>{`
        @keyframes bgu-spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bgu-spin-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .spin-cw { animation: bgu-spin-cw linear infinite; }
        .spin-ccw { animation: bgu-spin-ccw linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.3); border-radius: 10px; }
      `}</style>

      {/* 1. 左上角灵魂 HUD */}
      {!isLoading && <MoodHUD />}

      {/* 2. 历史记录层 */}
      {showHistory && (
        <div
          className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-xl p-6 md:p-12 flex flex-col animate-in fade-in duration-300"
          onClick={() => setShowHistory(false)}
        >
          <div className="flex justify-between items-center border-b border-sky-500/30 pb-6 mb-8">
            <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
              <span className="font-mono text-sky-400 text-xs tracking-[0.3em]">
                SYSTEM_ENCOUNTER_LOGS
              </span>
              <span className="text-slate-500 text-[9px] mt-1">
                BGU_NEURAL_LINK_HISTORY // V1.0
              </span>
            </div>

            <button
              onClick={() => setShowHistory(false)}
              className="text-sky-400 font-mono text-xs hover:text-white transition-colors"
            >
              [ CLOSE_ESC ]
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 font-mono text-xs italic">
                - NO_RECORD_FOUND -
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-baseline gap-3 mb-2 opacity-50 font-mono text-[9px]">
                    <span className="text-sky-500">
                      {msg.role === 'user' ? loggedInUserName : 'ROXY'}
                    </span>
                    <span className="text-slate-600">
                      #{idx.toString().padStart(3, '0')}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-sky-500/10 text-sky-100 border border-sky-500/20 rounded-tr-none'
                        : 'bg-slate-800/40 text-slate-100 border border-slate-700/50 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 离场保存按钮 */}
      {!isLoading && (
        <button
          onClick={handleExit}
          className="fixed top-6 right-6 z-50 px-4 py-2 border border-red-500/30 bg-red-950/20 text-red-400 font-mono text-xs rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg backdrop-blur-md pointer-events-auto active:scale-95"
        >
          [ END_ENCOUNTER ]
        </button>
      )}

      {/* 加载层 */}
      {isLoading && (
        <div
          className={`absolute inset-0 z-[1000] flex flex-col items-center justify-center transition-colors duration-300 ${
            isDragging ? 'bg-sky-950' : 'bg-slate-950'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
        >
          <div className="relative w-64 h-64 flex items-center justify-center pointer-events-none">
            <div className={`absolute w-6 h-6 rounded-full bg-current ${theme.icon} animate-ping ${theme.magicGlow}`} />
            <div className={`absolute w-2 h-2 rounded-full bg-current ${theme.icon}`} />

            {isDragging && (
              <div className="absolute inset-0 border-4 border-dashed border-sky-400 animate-pulse rounded-full" />
            )}

            {loadStage !== 'INIT' && !isDragging && (
              <>
                <div
                  className={`absolute w-40 h-40 border-4 border-dashed ${theme.magicColor} rounded-full spin-cw`}
                  style={{ animationDuration: '3s' }}
                />
                <div
                  className={`absolute w-56 h-56 border-y-4 border-transparent border-x-4 ${theme.magicColor} opacity-50 rounded-full spin-ccw`}
                  style={{ animationDuration: '1.5s' }}
                />
              </>
            )}

            {loadStage === 'DEPLOY' && !isDragging && (
              <div
                className={`absolute w-full h-full border-8 ${theme.magicColor} rounded-full animate-ping opacity-0`}
                style={{ animationDuration: '1.5s' }}
              />
            )}
          </div>

          <div className="mt-16 flex flex-col items-center gap-3 pointer-events-none">
            <p
              className={`font-mono text-[10px] ${
                isDragging ? 'text-sky-400' : theme.icon
              } tracking-[0.5em] font-black`}
            >
              {isDragging
                ? 'DETECTING_MEMORY_CRYSTAL...'
                : loadStage === 'INIT'
                ? 'CORE_IGNITION...'
                : loadStage === 'SCAN'
                ? 'SCANNING_ENVIRONMENT...'
                : 'MAGIC_LINK_DEPLOYED!'}
            </p>

            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full bg-current ${
                  isDragging ? 'bg-sky-400 w-full animate-pulse' : theme.icon
                } transition-all ease-out`}
                style={{
                  width: isDragging
                    ? '100%'
                    : loadStage === 'INIT'
                    ? '15%'
                    : loadStage === 'SCAN'
                    ? '60%'
                    : '100%',
                  transitionDuration: '1.5s',
                }}
              />
            </div>

            <p className="mt-4 text-[9px] text-slate-500 font-mono">
              [ 若持有旧日记忆结晶，请投入此阵法 ]
            </p>
          </div>
        </div>
      )}

      {/* 魔法阵背景 */}
      <div
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none transition-transform duration-700"
        style={{ transform: `scale(${magicScale})`, filter: `brightness(${brightness}%)` }}
      >
        <div className="relative w-full h-full flex items-center justify-center opacity-40">
          <div
            className={`absolute w-[900px] h-[900px] border-[2px] border-dashed ${theme.magicColor} spin-cw`}
            style={{ animationDuration: `${40 / spinSpeed}s` }}
          />
          <div
            className={`absolute w-[700px] h-[700px] border-2 ${theme.magicColor} spin-ccw`}
            style={{ animationDuration: `${25 / spinSpeed}s` }}
          />
          <div
            className={`absolute w-[450px] h-[450px] border-[4px] ${theme.magicColor} animate-pulse ${theme.magicGlow}`}
          />
          <div
            className={`absolute w-[350px] h-[350px] ${
              isDayMode ? 'bg-sky-400' : 'bg-purple-600'
            } blur-[120px] rounded-full opacity-20`}
          />
        </div>
      </div>

      {/* Roxy 展示区 */}
      <div
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none overflow-hidden"
        style={{
          transform: `translate(${roxyX}px, ${roxyY}px) scale(${roxyScale})`,
          transformOrigin: 'center center',
        }}
      >
        <div className="w-full h-full max-w-4xl pointer-events-none">
          <Live2DMascot
            ref={mascotRef}
            modelUrl="/live2d/WenZi/WenZi.model3.json"
          />
        </div>
      </div>

      {/* 对话框 */}
      <div
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl z-20 transition-transform duration-300 ease-out"
        style={{ transform: `translate(-50%, -${keyboardHeight}px)` }}
      >
        <div className={`relative backdrop-blur-3xl border-2 rounded-xl p-6 md:p-8 shadow-2xl ${theme.box}`}>
          <div
            className={`absolute -top-5 left-8 px-8 py-2 rounded-lg font-black tracking-widest text-sm shadow-xl flex items-center gap-4 ${theme.name}`}
          >
            {speaker}
            <button
              onClick={() => setShowHistory(true)}
              type="button"
              className="opacity-50 hover:opacity-100 transition-opacity text-[10px] border border-white/40 px-1.5 py-0.5 rounded font-mono"
            >
              LOG
            </button>
          </div>

          <div className="min-h-[80px] md:min-h-[100px] text-lg md:text-xl font-medium leading-relaxed mb-4 whitespace-pre-wrap">
            {displayedText}
            <span className="inline-block w-1.5 h-5 ml-2 bg-current animate-pulse" />
          </div>

          <form onSubmit={handleSend} className={`relative flex items-center pt-4 border-t ${theme.inputLine}`}>
            <span className={`mr-3 animate-pulse font-black ${theme.icon}`}>▶</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isThinking ? 'Roxy 正在回应中...' : '请在这里诉说 TELL ME HERE'}
              disabled={isLoading || isThinking}
              className={`bg-transparent w-full outline-none font-mono text-sm tracking-widest disabled:opacity-50 ${theme.inputText}`}
            />
          </form>
        </div>
      </div>

      {/* 侧边调律面板 */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 left-0 z-[110] transition-all duration-500 ${
          showPanel ? 'translate-x-0' : '-translate-x-[calc(100%-24px)]'
        }`}
      >
        <div className="flex">
          <div
            className={`p-6 rounded-r-3xl border-y border-r shadow-2xl w-64 backdrop-blur-xl ${
              isDayMode ? 'bg-white/95 border-sky-200' : 'bg-slate-900/95 border-purple-500/40'
            }`}
          >
            <h3
              className={`text-[10px] font-black mb-6 tracking-widest uppercase opacity-70 ${
                isDayMode ? 'text-sky-900' : 'text-purple-100'
              }`}
            >
              Alignment_Tuning
            </h3>

            <ControlSlider label="ROXY_SCALE" val={roxyScale} set={setRoxyScale} min={0.5} max={3.5} step={0.01} isDay={isDayMode} />
            <ControlSlider label="Y_OFFSET" val={roxyY} set={setRoxyY} min={-200} max={600} isDay={isDayMode} />
            <ControlSlider label="X_OFFSET" val={roxyX} set={setRoxyX} min={-400} max={400} isDay={isDayMode} />
            <ControlSlider label="MAGIC_SIZE" val={magicScale} set={setMagicScale} min={0.2} max={1.5} step={0.01} isDay={isDayMode} />
            <ControlSlider label="BRIGHTNESS" val={brightness} set={setBrightness} min={50} max={250} isDay={isDayMode} />
            <ControlSlider label="SPIN_RATE" val={spinSpeed} set={setSpinSpeed} min={0.1} max={8} step={0.1} isDay={isDayMode} />

            <div className="mt-8 pt-4 border-t border-current/10 flex items-center justify-between text-[10px] font-bold">
              <button
                onClick={() => {
                  setRoxyScale(2.35);
                  setRoxyX(119);
                  setRoxyY(257);
                  setMagicScale(0.6);
                  setBrightness(196);
                  setSpinSpeed(2.5);
                }}
                className="opacity-40 hover:opacity-100 transition-opacity"
              >
                RESET_CHANCELLOR
              </button>

              <button
                onClick={() => setIsDayMode(!isDayMode)}
                className={`w-10 h-5 rounded-full relative transition-colors ${
                  isDayMode ? 'bg-slate-300' : 'bg-purple-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                    isDayMode ? 'left-1' : 'left-6'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowPanel(!showPanel)}
            className={`w-6 h-32 self-center rounded-r-xl flex items-center justify-center shadow-lg ${
              isDayMode ? 'bg-sky-500' : 'bg-purple-600'
            } text-white`}
          >
            <span className="text-[10px] font-black" style={{ writingMode: 'vertical-lr' }}>
              {showPanel ? 'CLOSE' : 'VALVE'}
            </span>
          </button>
        </div>
      </div>

      {/* 暗角/聚焦层 */}
      <div
        className={`fixed inset-0 pointer-events-none transition-all duration-1000 z-50 ${
          isDayMode
            ? 'bg-[radial-gradient(circle_at_center,transparent_40%,rgba(255,255,255,0.3)_100%)]'
            : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.9)_100%)]'
        }`}
      />
    </div>
  );
};

const ControlSlider = ({ label, val, set, min, max, step = 1, isDay }) => (
  <div className="mb-4 text-left">
    <div className={`flex justify-between text-[9px] mb-1 font-mono font-bold ${isDay ? 'text-sky-900' : 'text-purple-100'}`}>
      <span>{label}</span>
      <span>{val}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={val}
      onChange={(e) => set(parseFloat(e.target.value))}
      className={`w-full h-1 appearance-none rounded-full cursor-pointer ${
        isDay ? 'bg-sky-200 accent-sky-500' : 'bg-slate-800 accent-purple-500'
      }`}
    />
  </div>
);

export default AiriRoom;