import React from 'react';
import { Link } from 'react-router-dom';
import avatar1 from '../assets/images/alumni/suzumiya.jpg'; 
import avatar2 from '../assets/images/alumni/hanzhi_m.jpg';
import avatar3 from '../assets/images/alumni/logo.jpg';
import avatar4 from '../assets/images/alumni/usamiharu.jpg';

function Home() {
  return (
    <>
      {/* 英雄区 */}
      <header className="h-[90vh] flex items-center justify-center relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1950&q=80')] bg-fixed bg-cover bg-center"></div>

        <div className="relative text-center px-4" data-aos="zoom-in">
          <p className="text-sm font-bold tracking-[0.3em] uppercase mb-4 text-orange-400">
            Since 2026
          </p>

          <h1 className="text-5xl md:text-8xl font-serif italic mb-6 leading-tight">
            Think Less.<br />Eat More.
          </h1>

          <p className="max-w-xl mx-auto text-lg font-light text-gray-200 mb-10">
            The world's first world-class research university to use "shrimp-peeling efficiency" as its core indicator.<br />
            We are committed to solving the age-old problem of "who picks up the takeout".
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              to="/faculties"
              className="border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all"
            >
              Explore Academics
            </Link>
            <Link
              to="/apply"
              className="bg-orange-600 text-white px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/50"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </header>

      {/* 新闻跑马灯 */}
      <div className="bg-slate-900 text-white py-2 overflow-hidden relative border-t border-white/10">
        <div className="flex animate-marquee whitespace-nowrap gap-10 text-xs md:text-sm font-mono tracking-widest uppercase">
          <span>★ BREAKING: SUZUMIYA President declares "Shrimp Peeling" a mandatory course</span>
          <span>★ CAMPUS UPDATE: Cafeteria ran out of coffee, riots expected</span>
          <span>★ WEATHER: 100% chance of procrastination today</span>
          <Link to="/alumni" className="hover:text-orange-400 underline decoration-dotted">★ HALL OF FAME: MEET OUR LEGENDS</Link>
          <span>★ ADMISSIONS: Now accepting applicants for 2026</span>
          <span>★ BREAKING: SUZUMIYA President declares "Shrimp Peeling" a mandatory course</span>
        </div>
      </div>

      {/* 讽刺数据 */}
      <section className="bg-white dark:bg-slate-950 py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div data-aos="fade-up">
            <div className="text-6xl mb-4">😴</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Advanced Napping</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Our libraries are equipped with 5-star beds.
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">E-Sports First</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              GPA is calculated based on your Steam achievements.
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Zero ROI</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Invest in memories, not in your future career.
            </p>
          </div>
        </div>
      </section>

      {/* === 新增：知名校友入口板块 === */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-serif italic text-slate-900 dark:text-white mb-6">
              Distinguished Alumni
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-12 text-lg font-light">
              Those who shaped the "Bro" culture and pioneered the art of chill.
            </p>
            
            <Link to="/alumni" className="group inline-block">
              {/* === 修改后的头像堆叠预览 === */}
<div className="flex justify-center -space-x-4 mb-10 transition-transform group-hover:scale-105 duration-500">
  {/* 定义一个局部数组，放入你刚才 import 的图片变量 */}
  {[avatar1, avatar2, avatar3, avatar4].map((imgSrc, index) => (
    <div 
      key={index} 
      className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden shadow-xl bg-gray-200 transition-transform group-hover:rotate-6"
      style={{ transitionDelay: `${index * 50}ms` }} // 增加一点错落的动画感
    >
      <img 
        src={imgSrc} 
        alt={`Alumnus ${index + 1}`} 
        className="w-full h-full object-cover"
      />
    </div>
  ))}
  
  {/* 最后的 +99 保持不变 */}
  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white dark:border-slate-800 bg-orange-600 text-white flex items-center justify-center text-sm font-bold shadow-xl z-10">
    +99
  </div>
</div>

              {/* 呼吁按钮 */}
              <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-full font-bold tracking-widest uppercase text-xs hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-xl">
                Enter Hall of Fame
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;