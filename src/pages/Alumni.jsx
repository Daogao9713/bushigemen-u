import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Alumni = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching alumni:', error);
      } else {
        setAlumniList(data || []);
      }
      setLoading(false);
    };

    fetchAlumni();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="animate-pulse text-slate-400 font-mono tracking-widest uppercase">
        Loading Legends...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">

        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-serif italic">
            Hall of Fame
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light">
            Meet the legends who survived our rigorous curriculum of doing absolutely nothing.
            <br />
            <span className="text-xs opacity-60 uppercase tracking-tighter">(Wall approved by President SUZUMIYA)</span>
          </p>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alumniList.map((person) => {
            // 兼容性字段处理：代码里用 avatar/major，数据库用 image_url/role
            const displayAvatar = person.image_url || 'https://via.placeholder.com/150?text=BRO';
            const displayRole = person.role || 'Alumni';

            return (
              <div
                key={person.id}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-500 border border-slate-100 dark:border-slate-800 group"
              >
                {/* 头像背景 - 你设计的漂亮渐变 */}
                <div className="h-28 bg-gradient-to-r from-blue-900 via-slate-900 to-orange-900 relative">
                  <div className="absolute -bottom-10 left-6 p-1.5 bg-white dark:bg-slate-900 rounded-full shadow-lg">
                    <img
                      src={displayAvatar}
                      alt={person.name}
                      className="w-20 h-20 rounded-full object-cover bg-slate-100 dark:bg-slate-800"
                    />
                  </div>
                </div>

                {/* 内容区 */}
                <div className="pt-14 pb-8 px-8 text-left">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                      {person.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600 uppercase">
                      ID: {String(person.id).padStart(4, '0')}
                    </span>
                  </div>

                  <p className="text-sm text-orange-600 font-black uppercase tracking-widest mb-4">
                    {displayRole}
                  </p>

                  <p className="text-slate-600 dark:text-slate-400 italic text-sm mb-6 leading-relaxed font-light">
                    "{person.quote || 'This bro is too cool to leave a quote.'}"
                  </p>

                  {/* 自动生成的动态标签 */}
                  <div className="flex flex-wrap gap-2 opacity-80">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                      Certified Bro
                    </span>
                    {person.role && (
                      <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        {person.role.split(' ')[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部招募令 - 这里的设计非常棒 */}
        <div className="mt-24 text-center bg-slate-900 dark:bg-white rounded-[3rem] p-12 text-white dark:text-slate-900 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif italic font-bold mb-4">
              Want to be on the wall?
            </h2>
            <p className="mb-8 opacity-70 font-light text-lg">
              Send a bribe... I mean, an application to the President.
            </p>
            <a
              href="mailto:zxc13851407371@outlook.com"
              className="inline-block bg-orange-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-500 hover:scale-105 transition-all shadow-xl shadow-orange-600/20"
            >
              Contact President
            </a>
          </div>

          {/* 装饰背景 - 视觉强化 */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-orange-600 opacity-20 rounded-full blur-3xl"></div>
        </div>

      </div>
    </div>
  );
};

export default Alumni;