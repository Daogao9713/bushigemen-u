import { sanitizeMotion, sanitizeExpression } from './live2dCommands';
import { getMoodStage } from './mood';
import { supabase } from './supabase'; 

/**
 * 发送信息至边缘函数，由后端安全呼叫 LLM
 */
export async function sendToLLM({ 
  message, 
  messagesHistory = [], 
  currentMood, 
  memorySummary,
  isInteraction = false 
}) {
  const stage = getMoodStage(currentMood);
  let schoolContext = "";

  // 1. 🔍 检索 BGU 本地知识库 (RAG)
  const msg = message.toLowerCase();
  const bguKeywords = ['bgu', '学校', '校规', '校长', '在哪', '什么', '谁', '蚊子'];
  const shouldSearch = !isInteraction && bguKeywords.some(k => msg.includes(k));

  if (shouldSearch) {
    try {
      const { data } = await supabase
        .from('bgu_knowledge')
        .select('content')
        .ilike('content', `%${message.slice(0, 4)}%`) 
        .limit(2);
      if (data?.length > 0) {
        schoolContext = data.map(d => d.content).join("\n");
      }
    } catch (err) {
      console.warn("[BGU_RAG] 知识检索暂不可用", err);
    }
  }

  try {
    // 2. 🚀 呼叫 Supabase 边缘函数 (名为 'chat')
    // 注意：我们将原本沉重的 systemPrompt 逻辑移到后端，前端只传必要参数
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { 
        message, 
        messagesHistory: messagesHistory.slice(-6), // 只传最近6条，省流量
        currentMood, 
        moodLabel: stage.label,
        moodPrompt: stage.prompt,
        memorySummary,
        schoolContext,
        isInteraction
      }
    });

    if (error) throw error;

    // 3. 解析结果 (边缘函数返回的内容通常已经是 JSON 对象)
    const content = typeof data === 'string' ? JSON.parse(data) : data;

    return {
      reply: content?.reply || "……（Roxy 正在调频中）",
      mood_change: content?.mood_change ?? 0,
      motion: sanitizeMotion(content?.motion),
      expression: sanitizeExpression(content?.expression)
    };

  } catch (err) {
    console.error("[BGU_LLM] 链路异常:", err);
    return {
      reply: "……（信号同步中断，请检查校长端的网络链路）",
      mood_change: 0,
      motion: "Idle",
      expression: "Neutral"
    };
  }
}