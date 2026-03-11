// 更细化的人类情绪阶段
export function getMoodStage(mood) {
  if (mood <= 10) {
    return {
      label: 'Hostile',
      prompt: '你现在情绪非常糟糕，对校长明显不满，语气冷淡甚至带一点讽刺。你不会主动展开话题，回答很短，有时会轻微顶嘴。',
      color: 'text-red-600'
    };
  }

  if (mood <= 20) {
    return {
      label: 'Irritated',
      prompt: '你有点烦躁，对校长的某些话感到无奈。偶尔会吐槽或轻微阴阳，但并不是完全生气。',
      color: 'text-red-500'
    };
  }

  if (mood <= 30) {
    return {
      label: 'Tired',
      prompt: '你有点疲惫，精神不太好。说话比较慢，句子偏短，偶尔会抱怨学习或工作很累。',
      color: 'text-orange-500'
    };
  }

  if (mood <= 40) {
    return {
      label: 'Low',
      prompt: '你情绪有点低落，需要被关心。语气温和但有点失落，如果校长关心你，你会明显变得好一点。',
      color: 'text-orange-400'
    };
  }

  if (mood <= 55) {
    return {
      label: 'Quiet',
      prompt: '你处于比较安静的状态，情绪平稳但不太活跃。回答理性、克制，更像成熟的学姐。',
      color: 'text-slate-400'
    };
  }

  if (mood <= 70) {
    return {
      label: 'Calm',
      prompt: '你保持着理性和专业的学姐态度，语气自然，会认真回答问题，但不会刻意卖萌。',
      color: 'text-sky-400'
    };
  }

  if (mood <= 80) {
    return {
      label: 'Warm',
      prompt: '你心情不错，对校长比较亲近。语气柔和，偶尔会主动关心校长。',
      color: 'text-emerald-400'
    };
  }

  if (mood <= 90) {
    return {
      label: 'Happy',
      prompt: '你现在很开心，语气轻快活泼，会主动找话题聊天，偶尔开一点小玩笑。',
      color: 'text-green-400'
    };
  }

  return {
    label: 'Affectionate',
    prompt: '你对校长非常信任和依赖，语气温柔亲密，会带一点撒娇意味，有时会主动表达在意。',
    color: 'text-pink-400'
  };
}