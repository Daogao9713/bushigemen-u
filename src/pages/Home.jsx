// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import CampusMap from '../components/CampusMap';

// 动画预设
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function Home({ userName: propUserName }) {
  const [userName, setUserName] = useState(() => propUserName || localStorage.getItem('bgu_user_name') || '');
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isSphereHovered, setIsSphereHovered] = useState(false);

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

  useEffect(() => {
    if (propUserName) setUserName(propUserName);
  }, [propUserName]);

  // 引力球卫星菜单数据
  const sphereNodes = [
    { id: 'about', label: 'About Us', icon: '📖', to: '/about', angle: -180 },
    { id: 'alumni', label: 'Alumni Wall', icon: '🤝', to: '/alumni', angle: -108 },
    { id: 'campus', label: '3D Campus', icon: '🧊', to: '/campus', angle: -36 },
    { id: 'pass', label: 'Student Portal', icon: '🗂️', to: '/pass', angle: 36 },
    { id: 'news', label: 'Meme Archive', icon: '🗞️', to: '/news', angle: 108 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-700 font-sans">
      
      {/* 注入流动动画关键帧 */}
      <style>{`
        @keyframes heroMarquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-hero-marquee { animation: heroMarquee 20s linear infinite; }
      `}</style>

      {/* ================= 1. 首屏英雄区 ================= */}
      <header className="h-[85vh] flex items-center justify-center relative overflow-hidden bg-white dark:bg-slate-950">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 opacity-20 dark:opacity-40 bg-[url('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1950&q=80')] bg-fixed bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 dark:from-transparent dark:via-slate-950/80 dark:to-slate-950" />

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 flex flex-col items-center px-4 w-full">
          
          {userName && (
            <motion.div variants={fadeUpVariant} className="mb-6 relative inline-block group">
              <div className="absolute -inset-4 border-l-2 border-t-2 border-sky-500/30 scale-x-90 scale-y-90 group-hover:scale-100 group-hover:opacity-100 opacity-50 transition-all duration-700" />
              <div className="absolute -inset-4 border-r-2 border-b-2 border-sky-500/10 scale-x-90 scale-y-90 group-hover:scale-100 group-hover:opacity-100 opacity-30 transition-all duration-700" />
              <div className="relative text-center">
                <p className="text-xl md:text-3xl font-black italic text-sky-600 dark:text-sky-400 tracking-wider">
                  <span className="opacity-40 text-xs md:text-sm font-mono not-italic mr-3">LOGGED_AS:</span>
                  {userName}
                </p>
              </div>
            </motion.div>
          )}

          <motion.p variants={fadeUpVariant} className="text-xs font-bold tracking-[0.4em] uppercase mb-4 text-orange-600 dark:text-orange-500">
            Est. 2026 • Global
          </motion.p>

          <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl lg:text-8xl font-black italic mb-2 tracking-tighter text-slate-900 dark:text-white drop-shadow-lg text-center">
            BUSHIGEMEN
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-sm md:text-xl font-light text-slate-600 dark:text-slate-300 tracking-widest uppercase mb-8 text-center">
            The Highest Institution of Bro UNIVERSITY
          </motion.p>

          {/* ✅ S2 新增：流动弹幕信息带 (Claim) */}
          <motion.div variants={fadeUpVariant} className="w-full max-w-4xl mt-24 overflow-hidden relative border-y border-slate-300/40 dark:border-slate-700/50 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-sm shadow-inner">
            {/* 边缘渐变遮罩，让滚动更自然 */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />
            
            {/* 双倍文本保证无缝滚动 */}
            <div className="flex animate-hero-marquee whitespace-nowrap gap-12 text-xs md:text-sm font-mono tracking-widest text-slate-700 dark:text-slate-400 w-[200%]">
              <span className="flex items-center gap-12">
                <span>// 我们的目标是星辰大海 🚀</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">// ALERT: 学费真的好贵，但这是哥们的浪漫 💸</span>
                <span>// MAGI_SYSTEM_ONLINE 🟢</span>
                <span>// 拒绝内卷，从高级躺平开始 🛌</span>
                <span>// 剥虾工程系 2026 秋季持续扩招中 🦐</span>
              </span>
              <span className="flex items-center gap-12">
                <span>// 我们的目标是星辰大海 🚀</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">// ALERT: 学费真的好贵，但这是哥们的浪漫 💸</span>
                <span>// MAGI_SYSTEM_ONLINE 🟢</span>
                <span>// 拒绝内卷，从高级躺平开始 🛌</span>
                <span>// 剥虾工程系 2026 秋季持续扩招中 🦐</span>
              </span>
            </div>
          </motion.div>

        </motion.div>
      </header>

      {/* ================= 2. 科技核心引力球 (全息中控区) ================= */}
      <section className="relative py-32 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden z-20 transition-colors border-b border-slate-200 dark:border-slate-900">
        
        <div className="text-center mb-16 relative z-30">
          <h2 className="text-sm font-black tracking-[0.3em] uppercase text-slate-400 dark:text-slate-500">System_Nexus</h2>
        </div>

        {/* ✅ S2 新增：左侧全息数据面板 */}
        <div className="hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col gap-6 w-56 opacity-80 z-10">
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-[10px] font-black text-sky-600 dark:text-sky-400 font-mono border-b border-sky-500/20 pb-2 mb-3 uppercase tracking-widest">Sys.Telemetry</h3>
            <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 space-y-2">
              <p className="flex justify-between"><span>ETHER_LINK:</span> <span className="text-emerald-500 font-bold animate-pulse">STABLE</span></p>
              <p className="flex justify-between"><span>LATENCY:</span> <span>12ms</span></p>
              <p className="flex justify-between"><span>TUITION_DEBT:</span> <span className="text-red-500 font-bold">OVERFLOW</span></p>
            </div>
            {/* 动态柱状图 */}
            <div className="flex gap-1 items-end h-8 mt-4 border-b border-slate-300 dark:border-slate-700 pb-1">
              <div className="w-2 bg-sky-400/50 h-[60%] animate-pulse"></div>
              <div className="w-2 bg-sky-400/70 h-[40%]"></div>
              <div className="w-2 bg-sky-400/50 h-[80%]"></div>
              <div className="w-2 bg-sky-500 h-[100%]"></div>
            </div>
          </div>
        </div>

        {/* ✅ S2 新增：右侧全息指标面板 */}
        <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-6 w-56 opacity-80 z-10">
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl text-right">
            <h3 className="text-[10px] font-black text-orange-600 dark:text-orange-500 font-mono border-b border-orange-500/20 pb-2 mb-3 uppercase tracking-widest">Global.Metrics</h3>
            <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 space-y-2">
              <p className="flex justify-between"><span>ACTIVE_BROS:</span> <span>9,024</span></p>
              <p className="flex justify-between"><span>SLEEP_INDEX:</span> <span className="text-emerald-500 font-bold">MAX</span></p>
              <p className="flex justify-between"><span>SHRIMP_PEELED:</span> <span>88,412</span></p>
            </div>
            {/* 动态雷达指示器 */}
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-orange-500/50 animate-[spin_10s_linear_infinite] ml-auto mt-4 flex items-center justify-center">
               <div className="w-4 h-4 rounded-full bg-orange-500/20 animate-ping"></div>
            </div>
          </div>
        </div>

        {/* 核心引力球区 */}
        <div 
          className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] flex items-center justify-center z-30"
          onMouseEnter={() => setIsSphereHovered(true)}
          onMouseLeave={() => setIsSphereHovered(false)}
          onClick={() => setIsSphereHovered(!isSphereHovered)}
        >
          {/* 环境光晕 */}
          <div className="absolute inset-0 bg-sky-500/5 dark:bg-sky-400/5 blur-[80px] rounded-full pointer-events-none" />

          {/* 阵法底纹 */}
          <div className="absolute inset-0 border border-dashed border-slate-300 dark:border-sky-400/20 rounded-full animate-[spin_40s_linear_infinite]" />
          <div className="absolute inset-12 border border-slate-200 dark:border-sky-400/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />

          {/* 卫星节点 (展开动画) */}
          <AnimatePresence>
            {isSphereHovered && sphereNodes.map((node) => {
              const radius = window.innerWidth < 768 ? 140 : 200;
              const x = Math.sin((node.angle * Math.PI) / 180) * radius;
              const y = -Math.cos((node.angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: 1, x, y, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="absolute z-10"
                >
                  <Link 
                    to={node.to} 
                    className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-full shadow-2xl hover:scale-110 hover:border-sky-500 dark:hover:border-sky-400 transition-all group"
                  >
                    <span className="text-xl md:text-2xl mb-1 group-hover:animate-bounce">{node.icon}</span>
                    <span className="text-[8px] md:text-[9px] font-bold text-slate-800 dark:text-slate-200 tracking-tighter text-center leading-tight px-1">
                      {node.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* 正中心 AI 核心 */}
          <Link to="/airi" className="relative z-20 group">
            <div className="absolute inset-0 bg-sky-400 dark:bg-sky-500 blur-2xl opacity-30 group-hover:opacity-100 transition-opacity duration-500 rounded-full animate-pulse" />
            
            <div className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-blue-500 to-sky-400 dark:from-sky-500 dark:to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(14,165,233,0.4)] border-4 border-white dark:border-slate-900 group-hover:scale-110 transition-transform duration-300">
              <div className="text-center">
                <span className="block text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-lg">AI</span>
                <span className="block text-[9px] md:text-[11px] text-sky-100 font-mono tracking-widest mt-1">TERMINAL</span>
              </div>
            </div>
            
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-slate-500 dark:text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              &lt; ENTER_NEURAL_LINK &gt;
            </div>
          </Link>

        </div>
      </section>

      {/* ================= 3. 新闻跑马灯 ================= */}
      <div className="bg-orange-600 dark:bg-orange-700 text-white py-3 overflow-hidden relative shadow-inner z-30">
        <div className="flex animate-marquee whitespace-nowrap gap-10 text-xs md:text-sm font-bold tracking-widest uppercase">
          <span>★ BREAKING: SUZUMIYA President declares "Shrimp Peeling" a mandatory course</span>
          <span>★ CAMPUS UPDATE: Cafeteria ran out of coffee, riots expected</span>
          <span>★ WEATHER: 100% chance of procrastination today</span>
          <Link to="/alumni" className="underline decoration-dotted hover:text-slate-900 transition-colors">
            ★ HALL OF FAME: MEET OUR LEGENDS
          </Link>
        </div>
      </div>

      {/* ================= 4. 校园新闻推流 ================= */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-4xl md:text-5xl font-serif italic text-slate-900 dark:text-white mb-2">Latest Updates</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm tracking-widest uppercase">“不止哥们大学” 实时播报</p>
            </motion.div>
            <Link to="/news" className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 bg-orange-100 dark:bg-orange-900/20 px-6 py-3 rounded-full uppercase tracking-widest transition-all">
              View All <span className="text-lg leading-none">→</span>
            </Link>
          </div>

          {loadingNews ? (
            <div className="text-center py-20 animate-pulse text-slate-400 dark:text-slate-500 font-mono">📡 Fetching data stream...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((news, index) => (
                <motion.div key={news.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.15 }}>
                  <Link to={`/news/${news.id}`} className="block group h-full">
                    <div className="bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group-hover:-translate-y-2 group-hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                      <div className="h-48 overflow-hidden relative">
                        <img src={news.image_url || 'https://via.placeholder.com/800x600?text=BGU+News'} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-[10px] text-orange-600 dark:text-orange-400 font-black mb-3 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 animate-pulse" />
                          {new Date(news.created_at).toLocaleDateString()}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">{news.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">{news.summary || 'Click to read full article.'}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= 5. 实时校区监测 (雷达图) ================= */}
      <section className="py-24 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 transition-colors relative">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-black italic text-slate-900 dark:text-white uppercase tracking-tighter">
                实时校区监测 <span className="text-emerald-500 text-sm font-mono ml-2 block md:inline mt-2 md:mt-0">Design by Suzumiya</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-lg">
                通过 BGU 专用卫星链路，校长可实时监控金陵、北平等据点的运行状态。虚拟校园系统已全面接入 MAGI 核心。
              </p>
              <Link to="/campus" className="inline-block px-8 py-3 bg-emerald-600 text-white font-black text-xs tracking-widest uppercase rounded-full hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20">
                INITIATE_CAMPUS_VIEW
              </Link>
            </div>
            
            <div className="w-full max-w-[280px] md:max-w-[320px] aspect-square relative bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="absolute top-4 left-4 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="w-full h-full transform hover:scale-105 transition-transform duration-500 mt-4">
                <CampusMap />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center font-mono text-[9px] text-slate-500 dark:text-emerald-500/50 uppercase tracking-widest border-t border-slate-200 dark:border-slate-800 pt-2">
                <span>Signal: Stable</span>
                <span>Lat: 35.69N</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. BGU 办学理念 (底部沉淀) ================= */}
      <section className="bg-white dark:bg-slate-950 py-24 border-t border-slate-200 dark:border-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif italic text-slate-900 dark:text-white mb-4">The BGU Philosophy</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">颠覆传统的终极教育真理</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { icon: '😴', title: 'Advanced Napping', desc: 'Our libraries are equipped with 5-star beds. Sleep is the foundation of innovation.' },
              { icon: '🎮', title: 'E-Sports First', desc: 'GPA is calculated based on your Steam achievements. Git gud or drop out.' },
              { icon: '💸', title: 'Zero ROI', desc: 'Invest in memories, not in your future career. Money is temporary, brotherhood is forever.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 transition-colors"
              >
                <div className="text-5xl md:text-6xl mb-6 transform hover:scale-110 transition-transform cursor-default">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}