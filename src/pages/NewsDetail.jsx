// src/pages/NewsDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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

      // 同理，通过 id 查询单条
      const { data: article, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        setError(error);
        setArticle(null);
      } else {
        setArticle(article);
      }

      setLoading(false);
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-600">
        Loading...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-800 dark:text-white">
        <h1 className="text-6xl mb-4">🫥</h1>
        <h2 className="text-2xl font-bold">404 - News Not Found</h2>
        <p className="text-slate-500 mt-2">
          这篇新闻可能被删除了，或者你输入了错误的 id。
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-8 text-orange-600 font-bold underline"
        >
          返回上一页
        </button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pb-20 transition-colors duration-500">
      {/* 顶部 Hero */}
      <div className="w-full h-[40vh] md:h-[60vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={article.image_url || article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition"
        >
          ←
        </button>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              {article.category}
            </span>

            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-4 drop-shadow-lg">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-xs font-mono text-white/70 uppercase tracking-wider">
              <span>{article.date}</span>
              <span>•</span>
              <span>BY {article.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 正文 */}
      <div className="max-w-3xl mx-auto px-6 mt-12">
        <div className="prose prose-lg dark:prose-invert prose-orange max-w-none">
          {article.content}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="text-sm text-slate-500 font-bold">分享：</div>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-orange-600 transition">
              🔗
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:text-red-500 transition">
              ❤️
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default NewsDetail;