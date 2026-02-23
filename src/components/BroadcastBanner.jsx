import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const BroadcastBanner = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 1. 初始获取状态
    const init = async () => {
      const { data: initialData } = await supabase
        .from('broadcast')
        .select('*')
        .eq('id', 1)
        .single();
      setData(initialData);
    };
    init();

    // 2. 📡 开启 Realtime 实时监听 (重点！不需要刷新就能闪烁)
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'broadcast' }, 
        payload => setData(payload.new)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (!data?.is_active) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[9999] bg-black border-b-2 border-red-600">
      <div className="flex items-center overflow-hidden h-8 bg-black">
        {/* 左侧固定警报标示 */}
        <div className="bg-red-600 text-black font-black px-6 h-full flex items-center italic text-xs animate-pulse">
          EMERGENCY
        </div>
        
        {/* 中间滚动文字 */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee-fast whitespace-nowrap py-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-red-600 font-black text-sm tracking-tighter mx-10 uppercase italic">
                {data.message} • PATTERN BLUE CONFIRMED • {data.message} • 
              </span>
            ))}
          </div>
        </div>

        {/* 右侧固定警报标示 */}
        <div className="bg-red-600 text-black font-black px-6 h-full flex items-center italic text-xs animate-pulse">
          TOP SECRET
        </div>
      </div>
      {/* EVA 风格的细横线装饰 */}
      <div className="h-[2px] bg-red-600 opacity-50 animate-bounce"></div>
    </div>
  );
};

export default BroadcastBanner;