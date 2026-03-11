import { sanitizeMotion, sanitizeExpression } from './live2dCommands';
import { getMoodStage } from './mood';

// ⚠️ 校长注意：目前为了快速跑通，我们写死在这里。
// 以后项目上线时，强烈建议把 API_KEY 移到 .env 文件里 (例如 process.env.REACT_APP_API_KEY)
const API_URL = "https://api.openai.com/v1/chat/completions"; 
const API_KEY = process.env.REACT_APP_API_KEY || "";

/**
 * 发送信息给 LLM，并强制返回控制协议
 * @param {string} message - 用户当前输入的新消息
 * @param {Array} messagesHistory - 过去的对话上下文 (防金鱼记忆)
 * @param {number} currentMood - 当前心情值 0-100
 * @param {string} memorySummary - 从 .bgu 导入的过往记忆
 */
export async function sendToLLM({ message, messagesHistory = [], currentMood, memorySummary }) {
  // 1. 获取当前心情所在的“阶梯”设定
  const stage = getMoodStage(currentMood);
  
  // 2. 组装最强系统提示词 (System Prompt)
  const systemPrompt = `
    你现在是 BGU (Bushigemen University) 的 AI 助手 Roxy。
    
    【当前状态参数】:
    - 心情值: ${currentMood}/100
    - 情绪设定: ${stage.label} —— ${stage.prompt}
    - 历史相遇记忆: ${memorySummary || '无。这是你们第一次相遇，或者之前的记忆被清空了。'}
    
    【核心指令】:
    1. 你的回复必须是纯粹的 JSON 格式，绝对不要包含任何 Markdown 标记（如 \`\`\`json ）、思考过程或其他解释文字！
    2. 如果【历史相遇记忆】不为空，请在回复中自然地表现出“记得校长”的既视感。
    3. 根据【心情值】和用户的发言，决定本次心情的涨跌幅度（mood_change）。
    
    【JSON 必须严格遵守以下结构】:
    {
      "reply": "你的回话内容，必须符合你当前的心情设定和身份",
      "mood_change": 数值 (如 5 代表被夸奖加分, -3 代表被冒犯扣分, 0 代表平稳),
      "motion": "动作名",
      "expression": "表情名"
    }
    
    【可用动作字典】: [Idle_01, Idle_02, Shy_01, TapBody, TapHead, Angry_01]
    【可用表情字典】: [Neutral, Smile, Blush, Sad, Angry]
  `;

  // 3. 拼接对话上下文 (保留最近的 6 条对话，防止 Token 爆炸和费用超标)
  const contextMessages = messagesHistory.slice(-6).map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 使用支持 json_object 的模型
        messages: [
          { role: "system", content: systemPrompt },
          ...contextMessages,           // 注入历史上下文
          { role: "user", content: message } // 注入最新对话
        ],
        response_format: { type: "json_object" }, 
        temperature: 0.7 // 给 AI 一点情感波动的空间
      })
    });

    if (!response.ok) {
       throw new Error(`API HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const contentStr = data.choices[0].message.content;
    
    // 4. ✅ 破窗兜底解析 (防止大模型抽风带了多余的字符)
    let content;
    try {
       content = JSON.parse(contentStr);
    } catch (parseError) {
       console.warn("[BGU_LLM] 收到非标准 JSON，尝试强行正则提取...", contentStr);
       const match = contentStr.match(/\{[\s\S]*\}/);
       content = match ? JSON.parse(match[0]) : {};
    }

    // 5. ✅ 逻辑保险丝：过滤非法的动作和表情
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