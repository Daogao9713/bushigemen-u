const TTS_URL = 'https://mcpferrkabvnkwklotlg.supabase.co/functions/v1/tts';

export async function speak(text, voice = 'nova') {
  if (!text) return null;

  try {
    const response = await fetch(TTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[BGU_TTS_ERROR_BODY]', errText);
      throw new Error('TTS 请求失败');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('[BGU_TTS] 语音合成中断:', err);
    return null;
  }
}