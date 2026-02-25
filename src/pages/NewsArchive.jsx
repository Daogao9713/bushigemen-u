import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AOS from 'aos';

function NewsArchive() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const fetchNews = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setNews(data ?? []);
        }
      } catch (err) {
        setErrorMsg("接入校务系统失败，请检查网络");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-20 px-6 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* 1) 页面头部：修复 text-slate-900 在暗色下的表现 */}
        <div className="mb-16 text-center" data-aos="fade-down">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-slate-50 mb-4 italic transition-colors">
            Campus Gazette
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            “不止哥们大学” 官方校报全集
          </p>
          <div className="w-20 h-1 bg-orange-600 mx-auto mt-6 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.5)]"></div>
        </div>

        {/* 2) 加载状态 */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm animate-pulse tracking-tighter">
              CONNECTING_TO_BGU_DATABASE...
            </p>
          </div>
        )}

        {/* 3) 错误显示 */}
        {!loading && errorMsg && (
          <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
            <div className="text-4xl mb-4">📡</div>
            <p className="text-red-600 dark:text-red-400 font-bold px-4">
              SIGNAL_LOST: {errorMsg}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full text-xs font-black transition-transform active:scale-95"
            >
              RECONNECT
            </button>
          </div>
        )}

        {/* 4) 无数据状态：给校长取材加点戏 */}
        {!loading && !errorMsg && news.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-bounce">📭</div>
            <p className="text-slate-500 dark:text-slate-400 font-mono">
              [SYSTEM_MESSAGE]: NO_DATA_FOUND.<br/>
              校长正在杉并区进行深度取材中...
            </p>
          </div>
        )}

        {/* 5) 新闻列表：核心修复区 */}
        {!loading && !errorMsg && news.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => {
              const displayImage = item.image_url || item.image || 'https://via.placeholder.com/800x600?text=BGU+News';
              const tagColor = item.tagColor || 'bg-slate-700';
              const dateText = item.date || (item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently');

              return (
                <Link 
                  key={item.id} 
                  to={`/news/${item.id}`} 
                  className="block group h-full"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <div className="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 h-full flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
                    
                    {/* 图片区域 */}
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={displayImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute top-4 left-4 ${tagColor} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg`}>
                        {item.category || 'News'}
                      </div>
                    </div>

                    {/* 文字区域 */}
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        {dateText}
                      </div>
                      {/* 🚨 重点修复：暗色下文字显现 */}
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                        {item.title}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed flex-grow">
                        {item.summary || '点击阅读全文以获取更多“不止哥们大学”详情。'}
                      </p>
                      
                      <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600">
                          Read Story
                        </span>
                        <span className="text-orange-600 transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsArchive;