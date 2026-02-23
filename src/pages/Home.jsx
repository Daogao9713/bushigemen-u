// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // 引入高级动画库
import { supabase } from '../lib/supabase'; // 引入你的数据库

import avatar1 from '../assets/images/alumni/suzumiya.jpg';
import avatar2 from '../assets/images/alumni/hanzhi_m.jpg';
import avatar3 from '../assets/images/alumni/logo.jpg';
import avatar4 from '../assets/images/alumni/usamiharu.jpg';

// 动画预设：高级滑入
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

function Home() {
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // 🌍 实时获取最新 3 条新闻 (接入 Supabase)
  useEffect(() => {
    const fetchLatestNews = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      setLatestNews(data || []);
      setLoadingNews(false);
    };
    fetchLatestNews();
  }, []);

  return (
    <>
      {/* --- 英雄区 (Hero Section) 视差与交错动画 --- */}
      <header className="h-[90vh] flex items-center justify-center relative bg-slate-950 text-white overflow-hidden">
        {/* 背景视差层 */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1950&q=80')] bg-fixed bg-cover bg-center" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" /> {/* 高级感渐变遮罩 */}

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative text-center px-4 z-10"
        >
          <motion.p variants={fadeUpVariant} className="text-sm font-bold tracking-[0.4em] uppercase mb-4 text-orange-500">
            Est. 2026 • Tokyo
          </motion.p>

          <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-8xl font-serif italic mb-6 leading-tight drop-shadow-2xl">
            Think Less.<br />
            Eat More.
          </motion.h1>

          <motion.p variants={fadeUpVariant} className="max-w-xl mx-auto text-lg font-light text-gray-300 mb-10 leading-relaxed">
            The world&apos;s first world-class research university to use
            &quot;shrimp-peeling efficiency&quot; as its core indicator.
            <br className="hidden md:block" />
            Committed to solving the age-old problem of &quot;who picks up the takeout&quot;.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/faculties"
              className="w-full sm:w-auto border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all duration-500"
            >
              Explore Academics
            </Link>
            <Link
              to="/apply"
              className="w-full sm:w-auto bg-orange-600 text-white px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-orange-500 transition-all duration-500 shadow-xl shadow-orange-900/50"
            >
              Apply Now
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* --- 新闻跑马灯 --- */}
      <div className="bg-orange-600 text-white py-3 overflow-hidden relative shadow-inner">
        <div className="flex animate-marquee whitespace-nowrap gap-10 text-xs md:text-sm font-bold tracking-widest uppercase">
          <span>★ BREAKING: SUZUMIYA President declares "Shrimp Peeling" a mandatory course</span>
          <span>★ CAMPUS UPDATE: Cafeteria ran out of coffee, riots expected</span>
          <span>★ WEATHER: 100% chance of procrastination today</span>
          <Link to="/alumni" className="underline decoration-dotted hover:text-slate-900 transition-colors">
            ★ HALL OF FAME: MEET OUR LEGENDS
          </Link>
        </div>
      </div>

      {/* --- 讽刺数据区 --- */}
      <section className="bg-white dark:bg-slate-950 py-24 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16 text-center">
          {[
            { icon: '😴', title: 'Advanced Napping', desc: 'Our libraries are equipped with 5-star beds.' },
            { icon: '🎮', title: 'E-Sports First', desc: 'GPA is calculated based on your Steam achievements.' },
            { icon: '💸', title: 'Zero ROI', desc: 'Invest in memories, not in your future career.' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <div className="text-6xl mb-6 transform hover:scale-110 transition-transform cursor-default">{item.icon}</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 校园新闻板块 (连通 Supabase 后台) --- */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-serif italic text-slate-900 dark:text-white mb-2">
                Latest Updates
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                “不止哥们大学” 官方实时播报
              </p>
            </motion.div>

            {/* ✅ 修复的手机端按钮：移除了 hidden，改为 flex */}
            <motion.div
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
            >
              <Link
                to="/news"
                className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition group bg-orange-100 dark:bg-orange-900/20 px-4 py-2 rounded-full"
              >
                View All News <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          </div>

          {loadingNews ? (
             <div className="text-center py-20 animate-pulse text-slate-400 font-mono">
               📡 Fetching data from Suginami server...
             </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {latestNews.map((news, index) => {
                const displayImage = news.image_url || news.image || 'https://via.placeholder.com/800x600?text=BGU+News';
                const dateText = news.date ? news.date : new Date(news.created_at).toLocaleDateString();

                return (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                  >
                    <Link to={`/news/${news.id}`} className="block group h-full">
                      <div className="bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 group-hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                        <div className="h-56 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                          <img
                            src={displayImage}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
                            {news.category || 'News'}
                          </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 text-xs text-orange-600 font-bold mb-3 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                            {dateText}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-snug group-hover:text-orange-600 transition-colors">
                            {news.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">
                            {news.summary || 'Click to read full story.'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* --- 知名校友区 --- */}
      <section className="py-32 bg-slate-900 dark:bg-slate-950 text-white transition-colors relative overflow-hidden">
        {/* 装饰性背景 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-6">
              Distinguished Alumni
            </h2>
            <p className="text-slate-400 mb-12 text-lg font-light max-w-2xl mx-auto">
              Those who shaped the &quot;Bro&quot; culture and pioneered the art of chill.
            </p>

            <Link to="/alumni" className="group inline-block">
              <div className="flex justify-center -space-x-6 mb-12">
                {[avatar1, avatar2, avatar3, avatar4].map((imgSrc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-900 overflow-hidden shadow-2xl transition-transform group-hover:-translate-y-2 group-hover:rotate-6 duration-500"
                  >
                    <img src={imgSrc} alt={`Alumnus ${index + 1}`} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-900 bg-orange-600 text-white flex items-center justify-center text-lg font-black shadow-2xl z-10"
                >
                  +99
                </motion.div>
              </div>

              <div className="bg-white text-slate-900 px-10 py-5 rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(234,88,12,0.6)]">
                Enter Hall of Fame
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Home;