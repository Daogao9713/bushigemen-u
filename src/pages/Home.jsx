// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* 英雄区 */}
      <header className="h-[90vh] flex items-center justify-center relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1950&q=80')] bg-fixed bg-cover bg-center"></div>
        <div className="relative text-center px-4" data-aos="zoom-in">
          <p className="text-sm font-bold tracking-[0.3em] uppercase mb-4 text-orange-400">Since 2026</p>
          <h1 className="text-5xl md:text-8xl font-serif italic mb-6 leading-tight">Think Less.<br />Eat More.</h1>
          <p className="max-w-xl mx-auto text-lg font-light text-gray-200 mb-10">
            全球首家以“剥虾效率”为核心指标的研究型大学。<br/>我们致力于解决“谁去拿外卖”这一世纪难题。
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/faculties" className="border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all">
              Explore Academics
            </Link>
            <Link to="/apply" className="bg-orange-600 text-white px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-orange-700 transition-all shadow-lg shadow-orange-900/50">
              Apply Now
            </Link>
          </div>
        </div>
      </header>

      {/* 讽刺数据 */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div data-aos="fade-up">
            <div className="text-6xl mb-4">😴</div>
            <h3 className="text-xl font-bold text-slate-900">Advanced Napping</h3>
            <p className="text-gray-500 mt-2 text-sm">Our libraries are equipped with 5-star beds.</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="100">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-slate-900">E-Sports First</h3>
            <p className="text-gray-500 mt-2 text-sm">GPA is calculated based on your Steam achievements.</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="200">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-xl font-bold text-slate-900">Zero ROI</h3>
            <p className="text-gray-500 mt-2 text-sm">Invest in memories, not in your future career.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;