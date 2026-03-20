// src/lib/live2dCommands.js

export const ALLOWED_MOTIONS = ['Idle']; // 暂时只有一个通用动作

export const ALLOWED_EXPRESSIONS = [
  'Init_Clean', 'LoveEyes', 'Crying', 'Breath', 'DotsEyes', 'Tongue', 'Blank',
  'PropMic', 'PropGamepad', 'OutfitCoat', 'PropEarSpoon' // ✅ 加入新道具
];

export function sanitizeMotion(name) {
  return 'Idle';
}

export function sanitizeExpression(name) {
  return ALLOWED_EXPRESSIONS.includes(name) ? name : 'Init_Clean';
}