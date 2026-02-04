import React, { useEffect } from 'react';
import AOS from 'aos';
import { rankingsData } from '../data/rankings';

const Rankings = () => {
  useEffect(() => {
    AOS.init({ disable: 'mobile' }); // 手机端禁用 AOS 动画能极大提升流畅度
  }, []);

  return (
    <div 
      className="min-h-screen py-20 px-4 bg-cover bg-center bg-fixed relative flex items-center"
      style={{ 
        // 建议：图片链接后面加上 &w=1000 限制宽度，减少加载压力
        backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?q=80&w=1200&auto=format&fit=crop")' 
      }}
    >
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif tracking-tight">
            Global Rankings
          </h1>
          <p className="text-slate-300 text-lg border-t border-white/20 pt-6 mt-6 inline-block">
            Power of prove       Long long a way。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rankingsData.map((item, index) => (
            <div 
              key={item.id}
              data-aos="fade-up"
              data-aos-delay={index * 50}
              className="
                group
                relative overflow-hidden
                p-8 rounded-3xl transition-all duration-300
                /* 核心优化：降级模糊程度，增加硬件加速 */
                bg-white/10 border border-white/20
                md:backdrop-blur-md transform-gpu
                hover:bg-white/15 hover:border-orange-500/50
              "
            >
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-6">
                   <div>
                     <div className="text-5xl md:text-6xl font-black text-white leading-none mb-2">
                       {item.rank}
                     </div>
                     <h3 className="text-xl font-bold text-white tracking-wider uppercase opacity-80">{item.org}</h3>
                   </div>
                   <div className="text-4xl">{item.icon}</div>
                 </div>
                 
                 <div className="inline-block px-4 py-1 rounded-full bg-slate-900/50 text-orange-300 text-xs font-bold uppercase mb-4 border border-white/10">
                   {item.category}
                 </div>

                 <p className="text-slate-300 leading-relaxed font-light border-l-2 border-orange-500/50 pl-4">
                   {item.description}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rankings;