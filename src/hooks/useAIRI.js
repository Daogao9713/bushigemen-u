// src/hooks/useAIRI.js (核心逻辑预览)
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useAIRI = (currentWeather) => {
  const [isStreaming, setIsStreaming] = useState(false);
  
  const planAndExecute = async (userMsg) => {
    // 1. 注入 BGU 全球上下文
    const context = {
      page: window.location.pathname,
      weather: currentWeather,
      user: localStorage.getItem('bgu_user_name'),
      timestamp: new Date().toISOString()
    };

    setIsStreaming(true);

    // 2. 调用 Supabase Edge Function (Planner)
    const { data, error } = await supabase.functions.invoke('airi-planner', {
      body: { prompt: userMsg, context }
    });

    // 3. 解析并派发 Action
    if (data) {
       dispatchBguAction(data.action); // 触发震动、路由等
       return data; // 返回给 TerminalChat 显示 text
    }
  };

  return { planAndExecute, isStreaming };
};