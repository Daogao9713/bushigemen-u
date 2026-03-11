// src/store/useSoulStore.js
import { create } from 'zustand';

// 辅助函数：物理锁死心情值域（0 最差，100 最好）
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export const useSoulStore = create((set, get) => ({
  // ==========================================
  // 1. 用户与环境状态 (User & Env)
  // ==========================================
  loggedInUserName: '校长', // 默认尊称，防止未输入时出现空数据
  isDayMode: true,

  // ==========================================
  // 2. 核心情绪状态 (Core Emotion)
  // ==========================================
  // 页面初次加载时，注入 20-80 的随机心情，制造每次相遇的“盲盒感”
  mood: Math.floor(Math.random() * 60) + 20, 
  
  // ==========================================
  // 3. 记忆与剧本状态 (Memory & Script)
  // ==========================================
  messages: [],       // 本次相遇的对话流，格式: [{ role: 'user'|'assistant', content: '...' }]
  memorySummary: '',  // 从 .bgu 结晶中提取的过往记忆摘要

  // ==========================================
  // 4. 演出控制状态 (Performance Control)
  // ==========================================
  currentMotion: null,
  currentExpression: null,

  // ==========================================
  // 🛠️ 动作派发器 (Actions)
  // ==========================================
  
  // 环境与用户设定
  setUserName: (name) => set({ loggedInUserName: name || '校长' }),
  setDayMode: (isDayMode) => set({ isDayMode }),

  // 情绪控制：绝对值设定 (主要用于拖拽导入记忆时，瞬间恢复心情)
  setMood: (value) => set({ mood: clamp(value, 0, 100) }),
  
  // 情绪控制：相对增减 (主要用于聊天时，根据 AI 的反馈涨跌心情)
  changeMood: (delta) => {
    const next = clamp(get().mood + delta, 0, 100);
    set({ mood: next });
  },

  // 记忆与对话链路管理
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setMemorySummary: (summary) => set({ memorySummary: summary }),

  // 外部驱动 Live2D 的状态预留 (应对未来脱离 ref 控制的架构)
  setMotion: (motion) => set({ currentMotion: motion }),
  setExpression: (expression) => set({ currentExpression: expression }),

  // ==========================================
  // ♻️ 离场清理协议 (Reset Protocol)
  // ==========================================
  resetEncounter: () => set({
    messages: [],               // 清空对话
    currentMotion: null,        
    currentExpression: null,
    memorySummary: '',          // 遗忘前置记忆
    // 重新随机一个心情值，准备迎接下一次全新的相遇
    mood: Math.floor(Math.random() * 60) + 20, 
  }),
}));