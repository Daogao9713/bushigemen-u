// ✅ 必须加上 export 关键字
export function exportMemory(userName, mood, messages) {
  const date = new Date().toLocaleDateString();
  const fileName = `${date} 与校长的相遇.bgu`;
  
  // 构造记忆结晶的内容
  const content = `[BGU_MEMORY_V1]
DATE=${date}
USER=${userName || '未知校友'}
MOOD=${mood || 50}

[SUMMARY]
这是 Roxy 与校长的一次深刻同步。
记忆已凝结。

[RAW_DATA]
${JSON.stringify(messages || [])}
`;

  // 触发浏览器下载
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link); // 兼容性补丁
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseMemoryFile(text) {
  try {
    // 简单的正则抓取关键数据
    const moodMatch = text.match(/MOOD=(\d+)/);
    const userMatch = text.match(/USER=(.*)/);
    const summaryMatch = text.match(/\[SUMMARY\]\n([\s\S]*?)\n\n\[RAW_DATA\]/);

    return {
      mood: moodMatch ? parseInt(moodMatch[1]) : 50,
      userName: userMatch ? userMatch[1].trim() : '校友',
      summary: summaryMatch ? summaryMatch[1].trim() : '',
    };
  } catch (e) {
    console.error("解析记忆结晶失败", e);
    return null;
  }
}