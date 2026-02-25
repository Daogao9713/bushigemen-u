import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

// ✅ 引入 CampusMap
import CampusMap from '../components/CampusMap';

import avatar1 from '../assets/images/alumni/suzumiya.jpg';
import avatar2 from '../assets/images/alumni/hanzhi_m.jpg';
import avatar3 from '../assets/images/alumni/logo.jpg';
import avatar4 from '../assets/images/alumni/usamiharu.jpg';

// 动画预设
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

function Home({ userName: propUserName }) {
  // 🚨 这里的状态初始化逻辑直接引用 propUserName 或 localStorage
  const [userName, setUserName] = useState(() => {
    return propUserName || localStorage.getItem('bgu_user_name') || '';
  });

  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // 🌍 实时获取最新 3 条新闻
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

  // ✅ 监听 propUserName 的变化，确保从 Preloader 进来后能秒刷
  useEffect(() => {
    if (propUserName) {
      setUserName(propUserName);
    }
  }, [propUserName]);

  return (
    <>
      {/* --- 英雄区 --- */}
      <header className="h-[90vh] flex items-center justify-center relative bg-slate-950 text-white overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1950&q=80')] bg-fixed bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative text-center px-4 z-10 flex flex-col items-center"
        >
          {/* ✅ 欢迎语显示区域：HUD 动效 */}
          {userName && (
            <motion.div variants={fadeUpVariant} className="mb-10 relative inline-block group">
              {/* 背景装饰框 */}
              <div className="absolute -inset-4 border-l-2 border-t-2 border-emerald-500/30 scale-x-90 scale-y-90 group-hover:scale-100 group-hover:opacity-100 opacity-50 transition-all duration-700" />
              <div className="absolute -inset-4 border-r-2 border-b-2 border-emerald-500/10 scale-x-90 scale-y-90 group-hover:scale-100 group-hover:opacity-100 opacity-30 transition-all duration-700" />

              <div className="relative">
                <p className="text-2xl md:text-5xl font-black italic text-emerald-400 tracking-wider drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                  <span className="opacity-40 text-sm md:text-base font-mono not-italic mr-3 tracking-tighter">LOGGED_AS:</span>
                  {userName}
                </p>

                <div className="flex flex-col items-center mt-3">
                  <p className="text-slate-300 font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
                    Welcome to BGU 
                  </p>
                  {/* 扫描线效果 */}
                  <div className="w-32 h-[1px] bg-emerald-500/20 mt-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-400/60 animate-[marquee_2s_linear_infinite]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.p
            variants={fadeUpVariant}
            className="text-sm font-bold tracking-[0.4em] uppercase mb-4 text-orange-500"
          >
            Est. 2026 • Mars
          </motion.p>

          <motion.h1
            variants={fadeUpVariant}
            className="text-5xl md:text-8xl font-serif italic mb-6 leading-tight drop-shadow-2xl"
          >
            Think Less.<br />
            Eat More.
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="max-w-xl mx-auto text-lg font-light text-gray-300 mb-10 leading-relaxed"
          >
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
            { icon: '💸', title: 'Zero ROI', desc: 'Invest in memories, not in your future career.' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <div className="text-6xl mb-6 transform hover:scale-110 transition-transform cursor-default">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 校园雷达地图 --- */}
      <section className="py-24 bg-slate-950 border-y border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 py-20">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-black italic text-white uppercase">
                实时校区监测 <span className="text-emerald-500 text-sm font-mono ml-2">Design by Suzumiya</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                通过 BGU 专用卫星链路，校长可实时监控金陵、北平等据点的运行状态。
                虚拟校园系统已全面接入 MAGI 核心。
              </p>
              <Link to="/campus" className="inline-block px-6 py-3 bg-emerald-600 text-white font-black text-xs rounded-full hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20">
                进入虚拟校园
              </Link>
            </div>
            <div className="w-full max-w-[240px] md:max-w-[280px] aspect-square">
              <div className="transform hover:scale-105 transition-transform duration-500">
                <CampusMap />
              </div>
              <div className="mt-4 flex justify-between items-center px-4 font-mono text-[8px] text-emerald-500/50 uppercase tracking-widest">
                <span>Signal: Stable</span>
                <span>Lat: 35.69N</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 校园新闻板块 --- */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl md:text-6xl font-serif italic text-slate-900 dark:text-white mb-2">Latest Updates</h2>
              <p className="text-slate-500 dark:text-slate-400">“不止哥们大学” 官方实时播报</p>
            </motion.div>
            <Link to="/news" className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition bg-orange-100 dark:bg-orange-900/20 px-4 py-2 rounded-full">
              View All News <span className="text-lg">→</span>
            </Link>
          </div>

          {loadingNews ? (
            <div className="text-center py-20 animate-pulse text-slate-400 font-mono">📡 Fetching data...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {latestNews.map((news, index) => (
                <motion.div key={news.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.15 }}>
                  <Link to={`/news/${news.id}`} className="block group h-full">
                    <div className="bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800 group-hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                      <div className="h-56 overflow-hidden relative">
                        <img src={news.image_url || 'https://via.placeholder.com/800x600?text=BGU+News'} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-xs text-orange-600 font-bold mb-3 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                          {new Date(news.created_at).toLocaleDateString()}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-snug group-hover:text-orange-600 transition-colors">{news.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">{news.summary || 'Click to read.'}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- 知名校友区 --- */}
      <section className="py-32 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-6xl font-serif italic mb-6">Distinguished Alumni</h2>
            <Link to="/alumni" className="group inline-block">
              <div className="flex justify-center -space-x-6 mb-12">
                {[avatar1, avatar2, avatar3, avatar4].map((img, i) => (
                  <div key={i} className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-900 overflow-hidden shadow-2xl transition-transform group-hover:-translate-y-2 duration-500">
                    <img src={img} alt="Alumnus" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-900 bg-orange-600 text-white flex items-center justify-center text-lg font-black shadow-2xl z-10">+99</div>
              </div>
              <div className="bg-white text-slate-900 px-10 py-5 rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-xl">
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