import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // 确保路径对应你的配置

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        setError(error);
      } else {
        setArticle(data);
      }
      setLoading(false);
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [id]);

  // 🚨 加载状态的赛博优化
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-mono text-xs tracking-widest animate-pulse uppercase">
          Decrypting_Data_Stream...
        </p>
      </div>
    );
  }

  // 🚨 404 状态的暗色修复
  if (error || !article) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center px-6">
        <h1 className="text-8xl mb-6 opacity-20 dark:text-white">🫥</h1>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          404 - Archive Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-center max-w-sm font-medium leading-relaxed">
          该报讯文件可能已被校长加密或从校务数据库中抹除。
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-10 px-8 py-3 bg-orange-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-600/20"
        >
          Back to Archives
        </button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pb-32 transition-colors duration-1000">
      
      {/* 顶部 Hero 区域 */}
      <div className="w-full h-[50vh] md:h-[70vh] relative overflow-hidden group">
        {/* 动态遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-950/90 z-10" />
        
        <img
          src={article.image_url || article.image || 'https://via.placeholder.com/1200x800'}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />

        {/* 返回按钮：增加模糊感 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 z-30 w-12 h-12 bg-black/30 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-500 transition-all duration-300"
        >
          ←
        </button>

        {/* 标题悬浮层 */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-sm mb-6 shadow-xl">
              {article.category || 'Gazette'}
            </span>

            <h1 className="text-3xl md:text-6xl font-serif font-black text-white leading-[1.1] mb-8 drop-shadow-2xl italic">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono text-white/60 uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                {article.date || new Date(article.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <span className="opacity-40">WRITTEN_BY:</span>
                <span className="text-white font-bold tracking-normal">{article.author || 'ROXY'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 正文区域 */}
      <div className="max-w-3xl mx-auto px-6 mt-16 md:mt-24">
        {/* 🚨 增加了一个 id="bgu-article-content" 方便精准打击 */}
        <div 
          id="bgu-article-content"
          className="
            prose prose-slate dark:prose-invert prose-orange prose-lg md:prose-xl max-w-none 
            transition-colors duration-500
            /* 强制暗色模式下，无论内联样式写了什么，统统洗掉 */
            dark:text-slate-300
            [&_*]:dark:text-slate-300 
            [&_h1]:dark:text-white [&_h2]:dark:text-white [&_h3]:dark:text-white
            [&_strong]:dark:text-white
            [&_a]:dark:text-orange-400
          "
        >
          {/* 💡 如果内容里有 HTML 标签，请使用 dangerouslySetInnerHTML */}
          {article.content && article.content.includes('<') ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            article.content?.split('\n').map((para, index) => (
              <p key={index} className="mb-4">{para}</p>
            ))
          )}
        </div>

        {/* 底部交互区：协议化设计 */}
        <div className="mt-24 pt-10 border-t-2 border-slate-100 dark:border-slate-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Data_Protocol: BGU_v2.1
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-600 italic">
                本文档受“哥们儿共同体”协议保护，禁止非授权复制。
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase mr-2">Export:</span>
              <button className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                🔗
              </button>
              <button className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                ❤️
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default NewsDetail;