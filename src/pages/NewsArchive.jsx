import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AOS from 'aos';

function NewsArchive() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // 确保 AOS 动画在异步加载后依然能触发
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
          console.error("数据库报错：", error);
          setErrorMsg(error.message);
          setNews([]);
        } else {
          console.log("校长，我们拿到的数据是：", data);
          setNews(data ?? []);
        }
      } catch (err) {
        console.error("系统异常：", err);
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
        
        {/* 页面头部 */}
        <div className="mb-16 text-center" data-aos="fade-down">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">
            Campus Gazette
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            “不止哥们大学” 官方校报全集
          </p>
          <div className="w-20 h-1 bg-orange-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
            <p className="text-slate-500 font-mono text-sm animate-pulse">CONNECTING TO BGU DATABASE...</p>
          </div>
        )}

        {/* 错误显示 */}
        {!loading && errorMsg && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📡</div>
            <p className="text-red-600 dark:text-red-400 font-bold">
              Failed to load news: {errorMsg}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-full text-sm"
            >
              重新连接
            </button>
          </div>
        )}

        {/* 无数据状态 */}
        {!loading && !errorMsg && news.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-500 dark:text-slate-400">
              目前还没有新闻，校长正在杉并区取材中...
            </p>
          </div>
        )}

        {/* 新闻列表展示 */}
        {!loading && !errorMsg && news.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => {
              // 兼容性处理：数据库字段可能是 image_url 或 image
              const displayImage = item.image_url || item.image || 'https://via.placeholder.com/800x600?text=BGU+News';
              const tagColor = item.tagColor || 'bg-slate-700';
              
              const dateText = item.date
                ? item.date
                : item.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : 'Recently';

              return (
                <Link 
                  key={item.id} 
                  to={`/news/${item.id}`} 
                  className="block group"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 h-full flex flex-col hover:shadow-2xl transition-all duration-300">
                    
                    {/* 图片区域 */}
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={displayImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute top-4 left-4 ${tagColor} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-md`}>
                        {item.category || 'News'}
                      </div>
                    </div>

                    {/* 文字区域 */}
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="text-[10px] font-mono text-slate-400 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        {dateText}
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                        {item.title}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {item.summary || '点击阅读全文以获取更多“不止哥们大学”详情。'}
                      </p>
                      
                      {/* 阅读更多指示 */}
                      <div className="mt-auto pt-4 flex items-center text-[10px] font-black uppercase tracking-widest text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read Story →
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