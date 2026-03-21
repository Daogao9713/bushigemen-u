import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lottie from 'lottie-react';

import Live2DMascot from '../components/Live2DMascot';
import MoodHUD from '../components/MoodHUD';

import { useSoulStore } from '../store/useSoulStore';
import { sendToLLM } from '../agent/llm';
import { exportMemory, parseMemoryFile } from '../lib/memory';
import { speak } from '../lib/tts';

import loadingMagic from '../assets/lottie/loading_magic.json';

// 如果你项目里已有 vibration 工具函数，可替换成 import
const vibrateDevice = (pattern) => {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

const DEFAULT_TUNING = {
  brightness: 180,
  magicScale: 0.62,
  roxyScale: 2.15,
  roxyX: 13,
  roxyY: 123,
  spinSpeed: 2.5,
};

const AiriRoom = () => {
  const containerRef = useRef(null);
  const mascotRef = useRef(null);
  const historyScrollRef = useRef(null);
  const lastInteractionTime = useRef(Date.now());
  const loadTimers = useRef([]);

  // TTS / Audio refs
  const currentAudioRef = useRef(null);
  const currentAudioUrlRef = useRef(null);
  const mouthTimerRef = useRef(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    if (!message) {
      setDisplayedText('');
      return;
    }

    let index = 0;
    setDisplayedText('');

    const timer = setInterval(() => {
      index += 1;
      setDisplayedText(message.slice(0, index));
      if (index >= message.length) clearInterval(timer);
    }, 20);

    return () => clearInterval(timer);
  }, [message]);

  // -----------------------------
  // 5) 视觉视口 / 键盘 / 触摸协议
  // -----------------------------
  useEffect(() => {
    const syncViewport = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight}px`;
      }

      if (window.visualViewport) {
        const vv = window.visualViewport;
        const offset = window.innerHeight - (vv.height + vv.offsetTop);
        setKeyboardHeight(offset > 0 ? offset : 0);
      } else {
        setKeyboardHeight(0);
      }
    };

    syncViewport();

    const preventDefault = (e) => {
      const target = e.target;

      if (
        target.closest('[data-allow-scroll="true"]') ||
        target.closest('[data-allow-touch="true"]')
      ) {
        return;
      }

      const tag = target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'BUTTON') {
        if (e.cancelable) e.preventDefault();
      }
    };

    window.addEventListener('resize', syncViewport);

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', syncViewport);
      window.visualViewport.addEventListener('scroll', syncViewport);
    }

    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      window.removeEventListener('resize', syncViewport);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', syncViewport);
        window.visualViewport.removeEventListener('scroll', syncViewport);
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
  const [brightness, setBrightness] = useState(DEFAULT_TUNING.brightness);
  const [magicScale, setMagicScale] = useState(DEFAULT_TUNING.magicScale);
  const [roxyScale, setRoxyScale] = useState(DEFAULT_TUNING.roxyScale);
  const [roxyX, setRoxyX] = useState(DEFAULT_TUNING.roxyX);
  const [roxyY, setRoxyY] = useState(DEFAULT_TUNING.roxyY);
  const [spinSpeed, setSpinSpeed] = useState(DEFAULT_TUNING.spinSpeed);
  const [showPanel, setShowPanel] = useState(false);

  const resetTuning = () => {
    setBrightness(DEFAULT_TUNING.brightness);
    setMagicScale(DEFAULT_TUNING.magicScale);
    setRoxyScale(DEFAULT_TUNING.roxyScale);
    setRoxyX(DEFAULT_TUNING.roxyX);
    setRoxyY(DEFAULT_TUNING.roxyY);
    setSpinSpeed(DEFAULT_TUNING.spinSpeed);
  };

  // -----------------------------
  // 7) 仪式感加载系统
  // -----------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [loadStage, setLoadStage] = useState('INIT');

  useEffect(() => {
    vibrateDevice(50);

    loadTimers.current = [];

    loadTimers.current.push(
      setTimeout(() => {
        setLoadStage('SCAN');
        vibrateDevice([100, 50, 100]);
      }, 1400)
    );

    loadTimers.current.push(
      setTimeout(() => {
        setLoadStage('DEPLOY');
        vibrateDevice(300);
      }, 2800)
    );

    loadTimers.current.push(
      setTimeout(() => {
        setIsLoading(false);
      }, 4300)
    );

    return () => {
      loadTimers.current.forEach(clearTimeout);
    };
  }, []);

  // -----------------------------
  // 8) TTS / 唇形同步
  // -----------------------------
  const stopCurrentSpeech = useCallback(() => {
    if (mouthTimerRef.current) {
      clearInterval(mouthTimerRef.current);
      mouthTimerRef.current = null;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    if (mascotRef.current?.setCoreParam) {
      mascotRef.current.setCoreParam('ParamMouthOpenY', 0);
    }

    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }
  }, []);

  const playRoxyVoice = useCallback(
    async (text) => {
      if (!text) return;

      stopCurrentSpeech();

      try {
        const audioUrl = await speak(text);
        if (!audioUrl) return;

        currentAudioUrlRef.current = audioUrl;

        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;

        if (mascotRef.current?.syncLipWithAudio) {
          await mascotRef.current.syncLipWithAudio(audio);
        }

const cleanup = async () => {
  if (mascotRef.current?.stopLipSync) {
    mascotRef.current.stopLipSync();
  }

  if (mascotRef.current?.closeMouth) {
    mascotRef.current.closeMouth();
  } else if (mascotRef.current?.setCoreParam) {
    mascotRef.current.setCoreParam('ParamMouthOpenY', 0, 1);
  }

  // 可选：恢复默认表情
  if (mascotRef.current?.resetFace) {
    await mascotRef.current.resetFace();
  }

  if (currentAudioUrlRef.current) {
    URL.revokeObjectURL(currentAudioUrlRef.current);
    currentAudioUrlRef.current = null;
  }

  currentAudioRef.current = null;
};

        audio.onended = cleanup;
        audio.onerror = cleanup;

        try {
          await audio.play();
        } catch (playError) {
          console.warn('[BGU_TTS] 自动播放失败:', playError);
          cleanup();
        }
      } catch (error) {
        console.error('[BGU_TTS] 播放流程异常:', error);
        stopCurrentSpeech();
      }
    },
    [stopCurrentSpeech]
  );

  useEffect(() => {
    return () => {
      stopCurrentSpeech();
    };
  }, [stopCurrentSpeech]);

  // -----------------------------
  // 9) 前端工具处理
  // 拦截并处理 LLM 返回的前端工具调用
  // 例如：open_nav_link（打开链接）
  // 这些工具必须在浏览器中执行，而不能在后端执行
  // -----------------------------
  const handleAgentAction = useCallback((action) => {
    if (!action) return null;

    if (action.type === 'navigation') {
      const url = action.url;
      const target = action.target || '未知';
      
      if (url) {
        window.open(url, '_blank');
        console.log(`[BGU_ACTION] 导航至 ${target}: ${url}`);
        return `[系统]: 已为校长跳转至 ${target}`;
      }
    }
    
    return null;
  }, []);

  // -----------------------------
  // 10) 核心对话处理
  // 核心逻辑：接收用户输入，发送到 LLM，处理回复和工具调用
  const processChat = useCallback(
    async (userInput, isInteraction = false) => {
      const cleanText = String(userInput || '').trim();
      if (!cleanText) return;
      if (isLoading || isThinking) return;

      setIsThinking(true);
      lastInteractionTime.current = Date.now();

      if (!isInteraction) {
        setSpeaker('ROXY');
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
          if (res?.motion) mascotRef.current.playMotion?.(res.motion);
          if (res?.expression) mascotRef.current.setExpression?.(res.expression);
        }

        // 🔧 处理前端工具调用
        if (res?.action) {
          const actionResult = handleAgentAction(res.action);
          if (actionResult) {
            console.log('[BGU_ACTION]', actionResult);
          }
        }

        // 🎤 AI 回复后播放语音并进行简易唇形同步
        void playRoxyVoice(replyText);

        vibrateDevice(isInteraction ? [30, 30] : [30, 50]);
      } catch (error) {
        console.error('AI 链路异常', error);
        setSpeaker('SYSTEM');
        setMessage('[ERR] MAGI 链路连接超时，请重试。');
      } finally {
        setIsThinking(false);
      }
    },
    [
      isLoading,
      isThinking,
      messages,
      mood,
      memorySummary,
      addMessage,
      changeMood,
      playRoxyVoice,
      handleAgentAction,
    ]
  );

  // -----------------------------
  // 10) 拖拽导入记忆系统
  // -----------------------------
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const rawText = event.target?.result;
      const data = parseMemoryFile(rawText);

      if (data) {
        loadTimers.current.forEach(clearTimeout);

        setMood(data.mood);
        setMemorySummary(data.summary);

        setLoadStage('RESTORE');
        setIsLoading(false);

        vibrateDevice([50, 100, 50]);
        setSpeaker('ROXY');
        setMessage(`记忆链接已恢复。欢迎回来，${data.userName || loggedInUserName || '校长'}。`);
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
  // 11) 表单发送
  // -----------------------------
  const handleSend = async (e) => {
    e.preventDefault();

    const userText = inputValue.trim();
    if (!userText) return;

    setInputValue('');
    await processChat(userText, false);
  };

  // -----------------------------
  // 12) 监听物理互动事件
  // -----------------------------
  useEffect(() => {
    const handlePhysicalHit = (e) => {
      processChat(e.detail, true);
    };

    window.addEventListener('roxy_interaction', handlePhysicalHit);
    return () => window.removeEventListener('roxy_interaction', handlePhysicalHit);
  }, [processChat]);

  // -----------------------------
  // 13) 离场协议
  // -----------------------------
  const handleExit = () => {
    stopCurrentSpeech();
    vibrateDevice(100);
    exportMemory(loggedInUserName, mood, messages);
    window.location.href = '/';
  };

  // -----------------------------
  // 14) 灵魂唤醒：主动发言 + idle
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
      lastInteractionTime.current = Date.now();
    }, 25000);

    return () => {
      window.removeEventListener('roxy_speech', handleRoxySpeech);
      clearInterval(idleTimer);
    };
  }, [isLoading, isThinking]);

  // -----------------------------
  // 15) 历史记录辅助效果
  // -----------------------------
  useEffect(() => {
    if (!showHistory) return;
    if (!historyScrollRef.current) return;

    historyScrollRef.current.scrollTop = historyScrollRef.current.scrollHeight;
  }, [showHistory, messages]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowHistory(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // -----------------------------
  // 16) 主题配置
  // -----------------------------
  const theme = isDayMode
    ? {
        bg: 'from-white via-sky-50 to-blue-100',
        magicColor: 'border-sky-400',
        magicGlow: 'shadow-[0_0_30px_rgba(56,189,248,0.5)]',
        box: 'bg-white/80 border-sky-300 shadow-sky-200/40 text-sky-950',
        name: 'bg-sky-500 text-white',
        inputLine: 'border-sky-400/20',
        inputText: 'text-sky-900 placeholder:text-sky-500/50',
        icon: 'text-sky-500',
        panel: 'bg-white/95 border-sky-200 text-sky-950',
        historyPanel: 'bg-white/85 border-sky-200 text-slate-800',
        sendBtn:
          'bg-sky-500 hover:bg-sky-600 text-white shadow-[0_0_16px_rgba(14,165,233,0.35)]',
      }
    : {
        bg: 'from-indigo-950 via-slate-950 to-black',
        magicColor: 'border-purple-500',
        magicGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.5)]',
        box: 'bg-slate-900/78 border-purple-500/60 text-purple-100 shadow-purple-900/40',
        name: 'bg-purple-600 text-white',
        inputLine: 'border-purple-500/40',
        inputText: 'text-purple-50 placeholder:text-purple-400/60',
        icon: 'text-purple-400',
        panel: 'bg-slate-900/95 border-purple-500/40 text-purple-100',
        historyPanel: 'bg-slate-900/90 border-slate-700 text-slate-100',
        sendBtn:
          'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_16px_rgba(168,85,247,0.35)]',
      };

  const loadProgress = isDragging
    ? 85
    : loadStage === 'INIT'
    ? 25
    : loadStage === 'SCAN'
    ? 62
    : 100;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-screen overflow-hidden bg-gradient-to-br transition-all duration-1000 ${theme.bg}`}
    >
      <style>{`
        @keyframes bgu-spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bgu-spin-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes soft-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes thinking-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .spin-cw { animation: bgu-spin-cw linear infinite; }
        .spin-ccw { animation: bgu-spin-ccw linear infinite; }
        .soft-float { animation: soft-float 3.5s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(125, 211, 252, 0.28);
          border-radius: 999px;
        }
        .thinking-dot {
          animation: thinking-bounce 1.2s infinite ease-in-out;
        }
      `}</style>

      {!isLoading && <MoodHUD />}

      {showHistory && (
        <div
          className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-xl p-4 md:p-8"
          onClick={() => setShowHistory(false)}
        >
          <div
            className={`mx-auto flex h-full max-w-5xl flex-col rounded-3xl border shadow-2xl ${theme.historyPanel}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-current/10 px-5 py-4 md:px-8 md:py-6">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] tracking-[0.3em] text-sky-400">
                  SYSTEM_ENCOUNTER_LOGS
                </span>
                <span className="mt-1 text-[9px] text-slate-500">
                  BGU_NEURAL_LINK_HISTORY // V1.1
                </span>
              </div>

              <button
                onClick={() => setShowHistory(false)}
                className="rounded-full border border-current/20 px-3 py-1 font-mono text-[11px] opacity-70 transition hover:opacity-100"
              >
                [ CLOSE_ESC ]
              </button>
            </div>

            <div
              ref={historyScrollRef}
              data-allow-scroll="true"
              className="custom-scrollbar flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8"
            >
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center font-mono text-xs italic text-slate-500">
                  - NO_RECORD_FOUND -
                </div>
              ) : (
                <div className="space-y-8">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="mb-2 flex items-baseline gap-3 opacity-60">
                        <span className="font-mono text-[10px] text-sky-400">
                          {msg.role === 'user'
                            ? loggedInUserName || 'ROXY'
                            : 'ROXY'}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500">
                          #{idx.toString().padStart(3, '0')}
                        </span>
                      </div>

                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:px-5 md:py-4 ${
                          msg.role === 'user'
                            ? 'rounded-tr-none border border-sky-500/20 bg-sky-500/10 text-sky-100'
                            : 'rounded-tl-none border border-slate-700/50 bg-slate-800/40 text-slate-100'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <button
          onClick={handleExit}
          className="fixed right-4 top-4 z-50 rounded-full border border-red-500/30 bg-red-950/20 px-4 py-2 font-mono text-xs text-red-400 shadow-lg backdrop-blur-md transition-all hover:bg-red-500 hover:text-white active:scale-95 md:right-6 md:top-6"
        >
          [ END_ENCOUNTER ]
        </button>
      )}

      {isLoading && (
        <div
          className={`absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-slate-950 px-6 transition-colors duration-500 ${
            isDragging ? 'bg-sky-950/95' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
        >
          <div
            className={`relative flex h-80 w-80 items-center justify-center rounded-full border transition-all duration-300 md:h-96 md:w-96 ${
              isDragging
                ? 'border-sky-400/60 shadow-[0_0_60px_rgba(56,189,248,0.18)]'
                : 'border-slate-800'
            }`}
          >
            <Lottie
              animationData={loadingMagic}
              loop={true}
              className="pointer-events-none h-full w-full drop-shadow-[0_0_20px_rgba(56,189,248,0.6)]"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="mt-40 rounded-full border border-sky-400/20 bg-slate-950/40 px-4 py-2 backdrop-blur-md">
                <p className="animate-pulse font-mono text-[10px] tracking-[0.35em] text-sky-400">
                  {isDragging ? 'DETECTING_MEMORY' : `${loadStage}_PROCEEDING`}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="h-1.5 w-56 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-sky-400 transition-all duration-700"
                style={{ width: `${loadProgress}%` }}
              />
            </div>

            <p className="font-mono text-[9px] text-slate-500 opacity-70">
              [ BGU_SOUL_LINK_STABILIZING ]
            </p>

            <p className="mt-2 text-center font-mono text-[10px] text-slate-600">
              {isDragging
                ? 'drop memory crystal here'
                : '你也可以将记忆文件拖入此处恢复链路'}
            </p>
          </div>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center transition-transform duration-700"
        style={{
          transform: `scale(${magicScale})`,
          filter: `brightness(${brightness}%)`,
        }}
      >
        <div className="relative flex h-full w-full items-center justify-center opacity-40">
          <div
            className={`absolute h-[900px] w-[900px] border-[2px] border-dashed ${theme.magicColor} spin-cw`}
            style={{ animationDuration: `${40 / spinSpeed}s` }}
          />
          <div
            className={`absolute h-[700px] w-[700px] border-2 ${theme.magicColor} spin-ccw`}
            style={{ animationDuration: `${25 / spinSpeed}s` }}
          />
          <div
            className={`absolute h-[450px] w-[450px] border-[4px] ${theme.magicColor} animate-pulse ${theme.magicGlow}`}
          />
          <div
            className={`absolute h-[350px] w-[350px] rounded-full blur-[120px] opacity-20 ${
              isDayMode ? 'bg-sky-400' : 'bg-purple-600'
            }`}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
        style={{
          transform: `translate(${roxyX}px, ${roxyY}px) scale(${roxyScale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          data-allow-touch="true"
          className="soft-float h-full w-full max-w-4xl pointer-events-auto"
        >
          <Live2DMascot
            ref={mascotRef}
            modelUrl="/live2d/WenZi/WenZi.model3.json"
          />
        </div>
      </div>

      <div
        className="absolute bottom-4 left-1/2 z-20 w-[94%] max-w-4xl -translate-x-1/2 transition-transform duration-300 ease-out md:bottom-8"
        style={{ transform: `translate(-50%, -${keyboardHeight}px)` }}
      >
        <div
          className={`relative rounded-2xl border-2 p-5 shadow-2xl backdrop-blur-xl md:p-7 ${theme.box}`}
        >
          <div
            className={`absolute -top-5 left-5 flex items-center gap-3 rounded-xl px-5 py-2 text-sm font-black tracking-widest shadow-xl ${theme.name}`}
          >
            <span>{speaker}</span>

            {isThinking && (
              <div className="flex items-center gap-1">
                <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-white" />
                <span
                  className="thinking-dot h-1.5 w-1.5 rounded-full bg-white"
                  style={{ animationDelay: '0.15s' }}
                />
                <span
                  className="thinking-dot h-1.5 w-1.5 rounded-full bg-white"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>
            )}

            <button
              onClick={() => setShowHistory(true)}
              type="button"
              className="rounded border border-white/40 px-1.5 py-0.5 font-mono text-[10px] opacity-60 transition hover:opacity-100"
            >
              LOG
            </button>
          </div>

          <div className="min-h-[96px] rounded-xl bg-black/5 px-1 py-3 text-base leading-relaxed md:min-h-[110px] md:text-xl">
            <div className="whitespace-pre-wrap break-words">
              {displayedText}
              <span className="ml-2 inline-block h-5 w-1.5 animate-pulse bg-current align-middle" />
            </div>
          </div>

          <form
            onSubmit={handleSend}
            className={`mt-4 flex items-center gap-3 border-t pt-4 ${theme.inputLine}`}
          >
            <span className={`animate-pulse font-black ${theme.icon}`}>▶</span>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isThinking
                  ? 'Roxy 正在回应中...'
                  : '请在这里诉说 / TELL ME HERE'
              }
              disabled={isLoading || isThinking}
              className={`w-full bg-transparent font-mono text-sm tracking-wider outline-none disabled:opacity-50 md:text-[15px] ${theme.inputText}`}
            />

            <button
              type="submit"
              disabled={isLoading || isThinking || !inputValue.trim()}
              className={`rounded-xl px-4 py-2 text-xs font-bold tracking-widest transition disabled:cursor-not-allowed disabled:opacity-40 ${theme.sendBtn}`}
            >
              SEND
            </button>
          </form>
        </div>
      </div>

      <div
        className={`fixed left-0 top-1/2 z-[110] -translate-y-1/2 transition-all duration-500 ${
          showPanel ? 'translate-x-0' : '-translate-x-[calc(100%-24px)]'
        }`}
      >
        <div className="flex">
          <div
            className={`w-64 rounded-r-3xl border-y border-r p-6 shadow-2xl backdrop-blur-xl ${theme.panel}`}
          >
            <h3 className="mb-6 text-[10px] font-black uppercase tracking-widest opacity-70">
              Alignment_Tuning
            </h3>

            <ControlSlider
              label="ROXY_SCALE"
              val={roxyScale}
              set={setRoxyScale}
              min={0.5}
              max={3.5}
              step={0.01}
              isDay={isDayMode}
            />
            <ControlSlider
              label="Y_OFFSET"
              val={roxyY}
              set={setRoxyY}
              min={-200}
              max={600}
              step={1}
              isDay={isDayMode}
            />
            <ControlSlider
              label="X_OFFSET"
              val={roxyX}
              set={setRoxyX}
              min={-400}
              max={400}
              step={1}
              isDay={isDayMode}
            />
            <ControlSlider
              label="MAGIC_SIZE"
              val={magicScale}
              set={setMagicScale}
              min={0.2}
              max={1.5}
              step={0.01}
              isDay={isDayMode}
            />
            <ControlSlider
              label="BRIGHTNESS"
              val={brightness}
              set={setBrightness}
              min={50}
              max={300}
              step={1}
              isDay={isDayMode}
            />
            <ControlSlider
              label="SPIN_RATE"
              val={spinSpeed}
              set={setSpinSpeed}
              min={0.1}
              max={8}
              step={0.1}
              isDay={isDayMode}
            />

            <div className="mt-8 flex items-center justify-between border-t border-current/10 pt-4 text-[10px] font-bold">
              <button
                onClick={resetTuning}
                className="opacity-50 transition-opacity hover:opacity-100"
              >
                RESET_ROXY
              </button>

              <button
                onClick={() => setIsDayMode(!isDayMode)}
                className={`relative h-5 w-10 rounded-full transition-colors ${
                  isDayMode ? 'bg-slate-300' : 'bg-purple-600'
                }`}
              >
                <div
                  className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${
                    isDayMode ? 'left-1' : 'left-6'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowPanel(!showPanel)}
            className={`flex h-32 w-6 items-center justify-center self-center rounded-r-xl text-white shadow-lg ${
              isDayMode ? 'bg-sky-500' : 'bg-purple-600'
            }`}
          >
            <span className="text-[10px] font-black" style={{ writingMode: 'vertical-lr' }}>
              {showPanel ? 'CLOSE' : 'VALVE'}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`pointer-events-none fixed inset-0 z-50 transition-all duration-1000 ${
          isDayMode
            ? 'bg-[radial-gradient(circle_at_center,transparent_42%,rgba(255,255,255,0.28)_100%)]'
            : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.88)_100%)]'
        }`}
      />
    </div>
  );
};

const ControlSlider = ({ label, val, set, min, max, step = 1, isDay }) => (
  <div className="mb-4 text-left">
    <div
      className={`mb-1 flex justify-between font-mono text-[9px] font-bold ${
        isDay ? 'text-sky-900' : 'text-purple-100'
      }`}
    >
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
      className={`h-1 w-full cursor-pointer appearance-none rounded-full ${
        isDay ? 'bg-sky-200 accent-sky-500' : 'bg-slate-800 accent-purple-500'
      }`}
    />
  </div>
);

export default AiriRoom;