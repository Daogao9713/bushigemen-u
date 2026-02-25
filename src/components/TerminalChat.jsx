import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { playSound } from '../utils/audioHelper';

const TerminalChat = ({ theme, userName }) => {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // 1. 初始化 + 实时订阅
  useEffect(() => {
    const fetchMsgs = async () => {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(15);
      if (data) setMsgs(data.reverse());
    };
    fetchMsgs();

    // 🚨 核心：修正实时订阅逻辑
    const channel = supabase.channel('room1')
      .on('postgres_changes', { event: 'INSERT', table: 'messages' }, (payload) => {
        // 使用函数式更新确保拿到最新的 msgs 数组
        setMsgs((current) => {
           // 防止重复添加
           if (current.find(m => m.id === payload.new.id)) return current;
           return [...current, payload.new].slice(-15);
        });
        playSound('hover'); 
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs]);

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!input.trim() || input.length > 30) return;
    
    const tempInput = input;
    setInput(''); // 立即清空，提升手感
    playSound('confirm');

    const { error } = await supabase.from('messages').insert([{ 
      user_name: userName || 'Bro', 
      content: tempInput,
      theme_color: theme.text 
    }]);

    if (error) {
      console.error(error);
      setInput(tempInput); // 出错则回填
    }
  };

  return (
    <div className="flex flex-col h-full font-mono">
      {/* 消息展示区 */}
      <div 
        ref={scrollRef}
        className="h-32 md:h-40 overflow-y-auto mb-2 space-y-1.5 pr-2 scrollbar-hide text-[10px]"
      >
        {msgs.length === 0 && <p className="opacity-20 italic text-[8px]">Waiting for signal...</p>}
        {msgs.map((m, i) => (
          <div key={m.id || i} className="animate-in fade-in slide-in-from-left-2 duration-300">
            <span className={`${m.theme_color || theme.text} font-bold`}>{m.user_name}:</span>
            <span className="ml-2 text-white/80 break-all">{m.content}</span>
          </div>
        ))}
      </div>
      
      {/* 输入区 */}
      <form onSubmit={sendMsg} className="flex gap-1 border-t border-white/10 pt-2">
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="SEND_MSG..."
          className="flex-grow bg-white/5 border border-white/10 px-2 py-1 text-[10px] text-white focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button className={`px-2 py-1 bg-white/10 border border-white/20 text-[9px] text-white hover:bg-emerald-600 transition-colors`}>
          EXEC
        </button>
      </form>
    </div>
  );
};

export default TerminalChat;