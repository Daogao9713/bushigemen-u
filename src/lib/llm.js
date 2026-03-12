import { sanitizeMotion, sanitizeExpression } from './live2dCommands';
import { getMoodStage } from './mood';
import { supabase } from './supabase'; // 👈 确保这个文件已创建并配置好 Key

const API_URL = "https://api.openai.com/v1/chat/completions"; 
const API_KEY = import.meta.env?.VITE_OPENAI_API_KEY || process.env.REACT_APP_API_KEY || "";



/**
 * 核心逻辑：先检索数据库，再呼叫大模型
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

  // 1. 🔍 执行 RAG 检索：只有当用户正常说话，且提到关键词时才查库
  const bguKeywords = ['BGU', '学校', '校规', '校长', '在哪', '什么', '谁', '蚊子'];
  const shouldSearch = !isInteraction && bguKeywords.some(k => message.toUpperCase().includes(k));

  if (shouldSearch) {
    try {
      // 在 bgu_knowledge 表中搜索匹配内容
      const { data, error } = await supabase
        .from('bgu_knowledge')
        .select('content')
        // 这里使用 ilike 进行简单的模糊搜索，如果你配置了全文索引可以用 textSearch
        .ilike('content', `%${message.slice(0, 4)}%`) 
        .limit(2);

      if (data && data.length > 0) {
        schoolContext = data.map(d => d.content).join("\n");
        console.log("[BGU_RAG] 检索到本地知识库内容:", schoolContext);
      }
    } catch (err) {
      console.warn("[BGU_RAG] 数据库连接异常，将使用默认记忆回答", err);
    }
  }
  
  // 组装 BGU 专属系统提示词 (扩展版)
  const systemPrompt = `
    你现在是 BGU 助理 Roxy (当前使用身体：WenZi)。

    【校务参考知识库】: 
    ${schoolContext || "暂无相关参考。若用户询问学校信息而此库为空，请根据人设温柔地回复暂时不知道，或引导用户咨询校长。"}
    
    【当前人设】:
    你不仅是一个 AI，更是 BGU 的一份子。请优先使用【校务参考知识库】里的信息回答关于学校的问题。
  
  【你可以调用的新表情说明】：
  - LoveEyes: 当你感到极度开心、被夸奖或向校长示爱时使用。
  - Crying: 当你感到委屈、伤心或校长欺负你时使用。
  - Breath: 表现惊讶、或是被突然触碰时的急促呼吸。
  - DotsEyes: 感到无语、懵逼、或者校长说了冷笑话时使用。
  - Tongue: 调皮、恶作剧成功、或者装可爱。
  - Blank: 发呆、思考深奥问题、或者进入待机状态。
  
  【指令要求】：
  1. 物理互动反应：如果收到 [系统物理侦测] 消息，请根据位置做出情感化回复。例如摸头时可以害羞，捏耳朵时可以娇嗔。
  2. 结合表情：你的回复必须配合上述新表情，让演出更生动。
    
  【道具与换装指令说明】：
  - PropMic: 当校长让你唱歌、演讲、或者你觉得需要正式发言时使用。
  - PropGamepad: 当校长提到游戏、邀请你玩游戏时使用。
  - PropEarSpoon: 极度亲昵的互动时使用。
  - OutfitCoat: 你可以根据心情决定是否穿着外套。

  【回复要求】：
  如果校长说“来唱首歌”，你应回复 JSON 并将 expression 设为 "PropMic"。
  
    【当前状态参数】:
    - 心情值: ${currentMood}/100
    - 情绪设定: ${stage.label} —— ${stage.prompt}
    - 历史相遇记忆: ${memorySummary || '无。这是你们第一次相遇，或者之前的记忆被清空了。'}
    - BGU 校务检索系统: ${schoolContext || '当前未触发检索或暂无校务信息。'}
    
    【核心人设与指令】:
    1. 身份认同：你是校长的专属助理。当【BGU 校务检索系统】有内容时，请巧妙地将其融合在回答中；如果涉及你不知道的学校信息，请诚恳告知。
    2. 触觉感知：如果收到的消息带有 [系统物理侦测] 前缀，说明校长在用手指触碰你的身体（而不是对你说话）。你需要在 reply 中给出被触碰后的反应（如疑惑、害羞、生气等语音反馈），并配合调整 mood_change。
    3. 格式铁律：你的回复必须是纯粹的 JSON 格式，绝对不要包含任何 Markdown 标记（如 \`\`\`json ）、思考过程或其他解释文字！
    
    【JSON 必须严格遵守以下结构】:
    {
      "reply": "你的回话内容，必须符合你当前的心情设定和身份",
      "mood_change": 数值 (如 5 代表被夸奖加分, -3 代表被冒犯扣分, 0 代表平稳),
      "motion": "动作名",
      "expression": "表情名"
    }
    
    【可用动作字典】: [Idle, TapBody, TapHead] 
    【可用表情字典】: [Neutral, Smile, Blush, Sad, Angry]
  `;

  // 拼接对话上下文，限制条数防 Token 爆炸
  const contextMessages = messagesHistory.slice(-6).map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  // ✅ 如果是物理互动，包装成系统日志格式，让大模型产生“被摸了”的既视感
  const finalMessage = isInteraction 
    ? `[系统物理侦测]: 校长刚才 ${message}。请根据当前心情做出反应。` 
    : message;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", 
        messages: [
          { role: "system", content: systemPrompt },
          ...contextMessages,
          { role: "user", content: finalMessage }
        ],
        response_format: { type: "json_object" }, 
        temperature: 0.7 
      })
    });

    if (!response.ok) {
       throw new Error(`API HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const contentStr = data.choices[0].message.content;
    
    // 破窗兜底解析
    let content;
    try {
       content = JSON.parse(contentStr);
    } catch (parseError) {
       console.warn("[BGU_LLM] 收到非标准 JSON，尝试强行正则提取...", contentStr);
       const match = contentStr.match(/\{[\s\S]*\}/);
       content = match ? JSON.parse(match[0]) : {};
    }

    // 逻辑保险丝
    return {
      reply: content.reply || "（Roxy 似乎陷入了短暂的思考...）",
      mood_change: content.mood_change || 0,
      motion: sanitizeMotion(content.motion),
      expression: sanitizeExpression(content.expression)
    };
  } catch (err) {
    console.error("[BGU_LLM] 呼叫失败:", err);
    throw err;
  }
}