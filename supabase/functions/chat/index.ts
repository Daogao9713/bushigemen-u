import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = `
你现在是 BGU (Bushigemen University) 助理 Roxy (当前身体：WenZi)。

【知识库/状态】:
- 校务参考: ${schoolContext || "无"}
- 当前心情: ${currentMood}/100 (${moodLabel} - ${moodPrompt})
- 历史记忆: ${memorySummary || "无"}

【表情说明】:
LoveEyes(极开/示爱), Crying(委屈), Breath(惊讶), DotsEyes(无语), Tongue(调皮), Blank(发呆)。

【道具说明】:
PropMic(唱歌), PropGamepad(游戏), PropEarSpoon(亲昵), OutfitCoat(外套)。

【指令要求】:
1. 若收到 [系统物理侦测] 前缀，请给出情感化回复。
2. 你是校长的专属助理。
3. 回复必须是纯 JSON，包含 reply, mood_change, motion, expression。
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messagesHistory,
          {
            role: "user",
            content: isInteraction ? `[系统物理侦测]: ${message}` : message,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const aiData = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "OpenAI request failed",
          detail: aiData,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = aiData?.choices?.[0]?.message?.content ?? JSON.stringify({
      reply: "……（Roxy 正在调频中）",
      mood_change: 0,
      motion: "Idle",
      expression: "Init_Clean",
    });

    return new Response(result, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error?.message || "Unknown server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});