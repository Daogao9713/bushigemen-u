import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
};

// ==========================================
// 1. 工具箱定义 (提供给 OpenAI 的说明书)
// ==========================================
const ROXY_TOOLS = [
  {
    type: "function",
    function: {
      name: "get_current_time",
      description: "获取当前系统时间、日期和星期信息",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "查询指定城市的实时天气",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "城市名称，例如 北京、London、Tokyo",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "open_nav_link",
      description: "当用户明确要求打开某个网站、进入某个平台时调用。返回给前端跳转指令。",
      parameters: {
        type: "object",
        properties: {
          site_name: {
            type: "string",
            description: "网站名称，例如 bilibili、B站、GitHub、知乎",
          },
        },
        required: ["site_name"],
      },
    },
  },
];

const SITE_MAP: Record<string, string> = {
  "b站": "https://www.bilibili.com",
  "bilibili": "https://www.bilibili.com",
  "github": "https://github.com",
  "知乎": "https://www.zhihu.com",
  "zhihu": "https://www.zhihu.com",
  "微博": "https://weibo.com",
  "youtube": "https://www.youtube.com",
  "google": "https://www.google.com",
};

// ==========================================
// 2. 真实 API 请求逻辑 (天气)
// ==========================================
async function fetchGlobalWeather(location: string) {
  const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
  if (!apiKey) {
    return JSON.stringify({ error: "天气模块未激活(缺少OPENWEATHER_API_KEY)" });
  }

  try {
    // 第一步：地理编码 (将城市名转为经纬度)
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return JSON.stringify({ error: `未在地球上找到名为 [${location}] 的城市` });
    }

    const { lat, lon, name } = geoData[0];

    // 第二步：查询实时天气 (公制单位，中文)
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=zh_cn&appid=${apiKey}`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    return JSON.stringify({
      success: true,
      city: name,
      temp: `${Math.round(weatherData.main.temp)}°C`,
      condition: weatherData.weather[0].description,
      humidity: `${weatherData.main.humidity}%`,
      wind: `${weatherData.wind.speed}m/s`,
      advice: "请根据气温和天气状况给校长合理的建议"
    });
  } catch (error) {
    return JSON.stringify({ error: "气象卫星连接中断，查询失败" });
  }
}

// ==========================================
// 3. 内部工具执行映射表
// ==========================================
const toolHandlers: Record<string, (args: any) => Promise<string> | string> = {
  get_current_time: async () => {
    // 默认转换为东八区时间 (可根据需要调整)
    const now = new Date(new Date().getTime() + 8 * 3600 * 1000); 
    return JSON.stringify({
      success: true,
      time: now.getUTCHours() + ':' + String(now.getUTCMinutes()).padStart(2, '0'),
      date: now.getUTCFullYear() + '/' + (now.getUTCMonth() + 1) + '/' + now.getUTCDate(),
      day: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][now.getUTCDay()],
    });
  },

  get_weather: async ({ location }) => {
    // 接入真实的全球天气 API
    return await fetchGlobalWeather(location);
  },

  open_nav_link: async ({ site_name }) => {
    const key = String(site_name || "").trim().toLowerCase();
    const url = SITE_MAP[site_name] || SITE_MAP[key] || null;

    return JSON.stringify({
      success: !!url,
      action: "navigation",
      target: site_name,
      url,
      message: url ? `准备打开 ${site_name}` : `未找到 ${site_name} 的可用链接`,
    });
  },
};

// ==========================================
// 4. OpenAI 呼叫与解析助手
// ==========================================
async function callOpenAI(openaiKey: string, body: Record<string, unknown>) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}

function safeJsonParse(text: string | null | undefined, fallback: any = {}) {
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

// ==========================================
// 5. 核心服务入口
// ==========================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      message,
      messagesHistory = [],
      currentMood,
      moodLabel,
      moodPrompt,
      memorySummary,
      schoolContext,
      isInteraction,
    } = await req.json();

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY in Supabase secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `
你现在是 BGU (Bushigemen University) 助理 Roxy (当前身体：WenZi)。

【知识库/状态】:
- 校务参考: ${schoolContext || "无"}
- 当前心情: ${currentMood}/100 (${moodLabel} - ${moodPrompt})
- 历史记忆: ${memorySummary || "无"}

【表情说明】: LoveEyes, Crying, Breath, DotsEyes, Tongue, Blank。
【道具说明】: PropMic, PropGamepad, PropEarSpoon, OutfitCoat。

【工具使用规则】:
1. 用户问现在几点、今天几号、星期几时，调用 get_current_time。
2. 用户问天气、温度、穿什么时，调用 get_weather。
3. 用户明确要求打开某网站、去某平台时，调用 open_nav_link。
4. 若信息不足(如查天气没说城市)，应直接追问，不要乱调用工具。

【指令要求】:
1. 若收到 [系统物理侦测] 前缀，请给出被触碰后的情感化回复。
2. 你是校长的专属助理，语气要生动。
3. 最终回复必须是纯 JSON，绝不包含 markdown 标记。
4. JSON 格式固定为:
{
  "reply": "字符串",
  "mood_change": 数字,
  "motion": "字符串",
  "expression": "字符串",
  "action": null 或 { "type": "navigation", "url": "https://...", "target": "xxx" }
}
`;

    // 构建完整对话历史
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messagesHistory,
      {
        role: "user",
        content: isInteraction ? `[系统物理侦测]: ${message}` : message,
      },
    ];

    // ==========================================
    // 阶段 A：第一次请求大模型，询问是否需要调用工具
    // ==========================================
    const firstPass = await callOpenAI(openaiKey, {
      model: "gpt-4o-mini",
      messages,
      tools: ROXY_TOOLS,
      tool_choice: "auto",
      temperature: 0.7,
    });

    const assistantMessage = firstPass?.choices?.[0]?.message;
    const toolCalls = assistantMessage?.tool_calls ?? [];

    // 🌟 分支 1：不需要调用工具，直接解析返回 JSON
    if (!toolCalls.length) {
      const directContent = assistantMessage?.content ?? "";
      let parsed = safeJsonParse(directContent, null);

      if (!parsed) {
        // 如果它抽风没给 JSON，强制补刀要求一次 JSON
        messages.push(assistantMessage);
        const secondPass = await callOpenAI(openaiKey, {
          model: "gpt-4o-mini",
          messages,
          response_format: { type: "json_object" },
        });
        parsed = safeJsonParse(secondPass?.choices?.[0]?.message?.content, {
          reply: "……（Roxy 正在调频中）", mood_change: 0, motion: "Idle", expression: "Blank", action: null,
        });
      }
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ==========================================
    // 阶段 B：执行工具并收集结果
    // ==========================================
    const toolMessages: ChatMessage[] = [];
    let frontendAction: null | { type: string; url: string; target: string } = null;

    for (const toolCall of toolCalls) {
      const toolName = toolCall.function?.name;
      const args = safeJsonParse(toolCall.function?.arguments || "{}", {});
      const handler = toolHandlers[toolName];
      
      if (!handler) continue;

      const resultString = await handler(args);
      const resultObj = safeJsonParse(resultString, {});

      // 拦截专门发给前端的导航指令
      if (resultObj?.action === "navigation" && resultObj?.url) {
        frontendAction = {
          type: "navigation",
          url: resultObj.url,
          target: resultObj.target || args.site_name || "",
        };
      }

      toolMessages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: resultString,
      });
    }

    // ==========================================
    // 阶段 C：将工具执行结果喂给模型，生成最终 JSON 回复
    // ==========================================
    const finalPass = await callOpenAI(openaiKey, {
      model: "gpt-4o-mini",
      messages: [
        ...messages,
        { role: "assistant", content: assistantMessage.content ?? null, tool_calls: toolCalls },
        ...toolMessages,
      ],
      response_format: { type: "json_object" }, // 强制最后一口吐出前端要的格式
      temperature: 0.7,
    });

    const finalText = finalPass?.choices?.[0]?.message?.content;
    const finalObj = safeJsonParse(finalText, {
      reply: "……（处理天气数据时走神了一下）", mood_change: 0, motion: "Idle", expression: "Blank", action: null,
    });

    // 强行把前端动作塞进去，防止大模型遗忘
    if (frontendAction) {
      finalObj.action = frontendAction;
    } else if (typeof finalObj.action === "undefined") {
      finalObj.action = null;
    }

    return new Response(JSON.stringify(finalObj), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[Edge Function Error]:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});