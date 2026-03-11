// 因为没有动作文件，Motion 全部限制为 Idle
export const ALLOWED_MOTIONS = ['Idle'];

// 表情使用我们刚刚手搓的两个，加上默认的 Neutral
export const ALLOWED_EXPRESSIONS = ['Neutral', 'Smile', 'Blush'];

export function sanitizeMotion(name) {
  return 'Idle'; // 强制写死，目前只能 Idle
}

export function sanitizeExpression(name) {
  return ALLOWED_EXPRESSIONS.includes(name) ? name : 'Neutral';
}