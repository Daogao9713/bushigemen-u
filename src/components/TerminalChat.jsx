import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const TerminalChat = ({ theme, userName }) => {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // 🚨 震动助手：为了增加手感，定义不同的震动模式
  const triggerHaptic = (type) => {
    if (!("vibrate" in navigator)) return;
    if (type === 'click') navigator.vibrate(10);      // 轻微点击感
    if (type === 'success') navigator.vibrate([15, 30, 15]); // 确认感
    if (type === 'error') navigator.vibrate([50, 100, 50]);  // 警告感
  };

  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(15);
        if (error) throw error;
        if (data) setMsgs(data.reverse());
      } catch (err) {
        console.error("Supabase link failed:", err.message);
      }
    };
    fetchMsgs();

    // 实时订阅
    const channel = supabase.channel('bgu_public_chat')
      .on('postgres_changes', { event: 'INSERT', table: 'messages' }, (payload) => {
        setMsgs((current) => {
          if (current.find(m => m.id === payload.new.id)) return current;
          return [...current, payload.new].slice(-15);
        });
        triggerHaptic('click'); // 新消息进来，震一下
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!input.trim() || input.length > 30) return;

    const tempInput = input;
    setInput('');
    triggerHaptic('success'); // 发送动作，震一下

    const { error } = await supabase.from('messages').insert([{ 
      user_name: userName || 'Bro', 
      content: tempInput,
      theme_color: theme.text 
    }]);

    if (error) {
      triggerHaptic('error'); // 失败了，长震提醒
      setInput(tempInput);
    }
  };

  return (
    <div className="flex flex-col h-full font-mono">
      <div ref={scrollRef} className="h-32 md:h-40 overflow-y-auto mb-2 space-y-1.5 pr-2 scrollbar-hide text-[10px]">
        {msgs.length === 0 && <p className="opacity-20 italic text-[8px]">WAITING_FOR_SATELLITE_LINK...</p>}
        {msgs.map((m, i) => (
          <div key={m.id || i} className="animate-in fade-in slide-in-from-left-1 duration-300">
            <span className={`${m.theme_color || theme.text} font-bold`}>{m.user_name}:</span>
            <span className="ml-2 text-white/80 break-all uppercase">{m.content}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={sendMsg} className="flex gap-1 border-t border-white/10 pt-2">
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="COMMUNICATE..."
          className="flex-grow bg-white/5 border border-white/10 px-2 py-1 text-[10px] text-white focus:outline-none focus:border-emerald-500"
        />
        <button className={`px-2 py-1 bg-white/10 border border-white/20 text-[9px] text-white active:bg-emerald-600`}>
          EXEC
        </button>
      </form>
    </div>
  );
};

export default TerminalChat;