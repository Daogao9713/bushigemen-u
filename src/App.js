// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Home from './pages/Home';
import Faculties from './pages/Faculties';
import Admission from './pages/Admission';
import logo from './logo.jpg'; // 确保路径正确

// 一个自动滚动到顶部的组件，防止跳转后停留在页面底部
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
        
        {/* 全局导航栏 */}
        <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-500" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">BUSHIGEMEN</h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mt-1">University</p>
              </div>
            </Link>
            
            {/* 真正的导航链接 */}
            <div className="hidden md:flex space-x-8 text-xs font-bold tracking-widest uppercase text-slate-600">
              <Link to="/" className="hover:text-orange-600 transition">Home</Link>
              <Link to="/faculties" className="hover:text-orange-600 transition">Faculties</Link>
              <Link to="/apply" className="px-5 py-2 bg-slate-900 text-white hover:bg-orange-600 transition duration-300">Admission</Link>
            </div>
          </div>
        </nav>

        {/* 页面路由出口 */}
        <div className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/apply" element={<Admission />} />
          </Routes>
        </div>

        {/* 全局页脚 */}
        <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-4 text-2xl">🦐</div>
            <p className="text-xs tracking-widest uppercase opacity-60">
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