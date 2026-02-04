import React from 'react';
import { Link } from 'react-router-dom';

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
          <span>★ ADMISSIONS: Now accepting applicants for 2026</span>
          <span>★ BREAKING: SUZUMIYA President declares "Shrimp Peeling" a mandatory course</span>
          <span>★ CAMPUS UPDATE: Cafeteria ran out of coffee, riots expected</span>
        </div>
      </div>

      {/* 讽刺数据 */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div data-aos="fade-up">
            <div className="text-6xl mb-4">😴</div>
            <h3 className="text-xl font-bold text-slate-900">Advanced Napping</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Our libraries are equipped with 5-star beds.
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-slate-900">E-Sports First</h3>
            <p className="text-gray-500 mt-2 text-sm">
              GPA is calculated based on your Steam achievements.
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-xl font-bold text-slate-900">Zero ROI</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Invest in memories, not in your future career.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
