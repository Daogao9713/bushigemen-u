import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Home from './pages/Home';
import About from './pages/About';
import Faculties from './pages/Faculties';
import Admission from './pages/Admission';
import logo from './logo.jpg';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    AOS.init({ once: true, offset: 50, duration: 800 });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="bg-gray-50 text-slate-800 font-sans min-h-screen flex flex-col">
        
        {/* 全局导航栏 - 移动端适配版 */}
        <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3 md:py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
            
            {/* Logo 区域：手机端隐藏文字只留图标，防止挤占空间 */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img src={logo} alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover:rotate-12 transition-transform duration-500" />
              <div className="hidden xs:block text-left">
                <h1 className="text-sm md:text-xl font-bold tracking-tight text-slate-900 leading-none">BUSHIGEMEN</h1>
                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">University</p>
              </div>
            </Link>
            
            {/* 导航链接：取消 hidden md:flex，改为全设备可见但缩小间距 */}
            <div className="flex items-center space-x-2 md:space-x-8 font-medium text-[13px] md:text-base">
              <Link to="/" className="px-1 py-1 hover:text-blue-900 transition">Home</Link>
              <Link to="/about" className="px-1 py-1 hover:text-orange-600 transition">About</Link>
              {/* Faculties 在超小屏幕隐藏，防止溢出 */}
              <Link to="/faculties" className="hidden sm:block px-1 py-1 hover:text-blue-900 transition">Faculties</Link>
              <Link to="/apply" className="bg-blue-900 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-full hover:bg-orange-600 transition shadow-md whitespace-nowrap">
                Apply
              </Link>
            </div>
          </div>
        </nav>

        {/* 页面出口 - 增加顶部边距防止被固定导航栏遮挡 */}
        <div className="flex-grow pt-16 md:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/apply" element={<Admission />} />
            <Route path="*" element={<Home />} /> 
          </Routes>
        </div>

        {/* 全局页脚 */}
        <footer className="bg-slate-950 text-slate-400 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center text-[10px] md:text-xs">
            <div className="mb-4 text-xl md:text-2xl">🦐</div>
            <p className="tracking-widest uppercase opacity-60 leading-relaxed">
              © 2026 Bushigemen University. <br/>
              Where "Bro" is not just a word, it's a thesis.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;