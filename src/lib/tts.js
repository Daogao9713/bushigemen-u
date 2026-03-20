const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function speak(text) {
  if (!text) return null;

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'nova', // alloy, echo, fable, onyx, nova, shimmer
        response_format: 'mp3',
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      throw new Error('TTS 请求失败');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('[BGU_TTS] 语音合成中断:', err);
    return null;
  }
}