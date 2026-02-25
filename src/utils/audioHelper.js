// src/utils/audioHelper.js

const sounds = {
  startup: "/sounds/startup.mp3",
  hover: "/sounds/hover.mp3",
  confirm: "/sounds/confirm.mp3",
};

/**
 * 每次播放都创建一次性 Audio 对象，避免同一个对象高频播放导致的延迟。
 * @param {"startup"|"hover"|"confirm"} type
 */
export const playSound = (type) => {
  const src = sounds[type];

  if (!src) {
    console.warn(`[audioHelper] Unknown sound type: ${type}`);
    return;
  }

  try {
    // ✅ 一次性 Audio 对象（不复用）
    const audio = new Audio(src);

    // 音量策略：confirm 更“有确认感”，hover 更轻
    if (type === "confirm") {
      audio.volume = 1.0;
    } else if (type === "hover") {
      audio.volume = 0.1;
    } else {
      audio.volume = 0.4;
    }

    // 🚨 强行重置进度并播放（对部分浏览器更稳）
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((error) => {
        // 常见原因：未发生用户交互前的自动播放被拦截
        console.warn("[audioHelper] Audio interaction deferred:", error);
      });
    }
  } catch (error) {
    console.error("[audioHelper] Audio system error:", error);
  }
};