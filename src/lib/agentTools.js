// src/lib/agentTools.js

export const ROXY_TOOLS = [
  {
    type: "function",
    function: {
      name: "get_current_time",
      description: "获取当前的真实时间、日期和星期。当用户询问现在几点或今天几号时使用。",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "获取指定城市的天气状况和气温。",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "城市名，例如：北京、上海" }
        },
        required: ["location"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "open_nav_link",
      description: "根据用户需求打开特定的网页。例如：B站、GitHub、谷歌。",
      parameters: {
        type: "object",
        properties: {
          site_name: { type: "string", enum: ["Bilibili", "GitHub", "Google", "YouTube"], description: "目标网站名称" }
        },
        required: ["site_name"]
      }
    }
  }
];