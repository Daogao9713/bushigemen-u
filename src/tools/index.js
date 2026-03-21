// src/tools/index.js

/**
 * 处理从 Agent 返回的指令动作
 * @param {Object} action - 格式如 { type: "navigation", url: "..." }
 */
export const handleAgentAction = (action) => {
  if (!action) return;

  switch (action.type) {
    case 'navigation':
      console.log(`[Agent Action] 准备跳转至: ${action.url}`);
      // 延迟一秒跳转，给 Roxy 说话的时间
      setTimeout(() => {
        if (action.url) {
          window.open(action.url, '_blank');
        }
      }, 1500);
      break;
    
    // 未来可以扩展更多的动作，比如：
    // case 'change_bg': ...
    // case 'play_music': ...
    
    default:
      console.warn("未定义的 Agent 动作:", action.type);
  }
};