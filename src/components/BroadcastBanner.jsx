import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const BroadcastBanner = ({ onActiveChange }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let channel;
    const init = async () => {
      const { data: initialData, error } = await supabase
        .from('broadcast')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('[BroadcastBanner] 信号同步失败:', error);
        return;
      }
      if (initialData) {
        setData(initialData);
        if (onActiveChange) onActiveChange(initialData.is_active);
      }
    };

    channel = supabase
      .channel('broadcast-changes')
      .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'broadcast',
          filter: 'id=eq.1',
        },
        (payload) => {
          setData(payload.new);
          if (onActiveChange) onActiveChange(payload.new.is_active);
        }
      )
      .subscribe();

    init();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, [onActiveChange]);

  if (!data?.is_active) return null;

  return (
    /* 🚨 核心改动：删掉了 fixed, top-0, left-0。它现在会占用 32px 的高度并把下面的元素顶开 */
    <div className="w-full bg-black border-b-2 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)] z-[100]">
      <div className="flex items-center overflow-hidden h-8 bg-black">
        {/* 左侧：NERV 风格标识 */}
        <div className="bg-red-600 text-black font-black px-4 h-full flex items-center italic text-[10px] md:text-xs animate-pulse tracking-tighter">
          EMERGENCY
        </div>

        {/* 中间：滚动文字 */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee-fast whitespace-nowrap py-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="text-red-600 font-black text-xs md:text-sm tracking-tighter mx-10 uppercase italic"
              >
                {data.message} • PATTERN BLUE CONFIRMED • {data.message} •
              </span>
            ))}
          </div>
        </div>

        {/* 右侧：等级标识 */}
        <div className="bg-red-600 text-black font-black px-4 h-full flex items-center italic text-[10px] md:text-xs animate-pulse tracking-tighter hidden md:flex">
          TOP SECRET
        </div>
      </div>
      {/* 装饰底线 */}
      <div className="h-[1px] bg-red-600 opacity-80"></div>
    </div>
  );
};

export default BroadcastBanner;