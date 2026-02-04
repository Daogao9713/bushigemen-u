import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';

// 页面引入
import Home from './pages/Home';
import About from './pages/About';
import Alumni from './pages/Alumni';
import Rankings from './pages/Rankings';
import Faculties from './pages/Faculties';
import Admission from './pages/Admission';

import logo from './logo.jpg';

// 自动滚动到顶部组件
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      offset: 20,
      duration: 600,
      disable: window.innerWidth < 768,
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />

      {/* 所有的全局背景都要加上 dark:bg-slate-950，确保深色模式下页面背景变黑 */}
      <div className="bg-gray-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans min-h-screen flex flex-col transition-colors duration-500">
        
        {/* 全局导航栏 - 修正嵌套版 */}
        <nav className="fixed w-full z-50 py-3 
                        bg-white/95 text-slate-800 border-b border-gray-100 
                        backdrop-blur-md shadow-sm transition-colors duration-500
                        dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-3 md:px-6 flex justify-between items-center">
            
            {/* Logo 和 校名区域 */}
            <Link to="/" className="flex items-center gap-1.5 md:gap-3 group shrink-0">
              <img
                src={logo}
                alt="Logo"
                className="w-7 h-7 md:w-10 md:h-10 object-contain group-hover:rotate-12 transition-transform duration-500"
              />
              <div className="text-left">
                <h1 className="text-[13px] md:text-xl font-bold tracking-tighter leading-none">
                  BUSHIGEMEN
                </h1>
                <p className="text-[6px] md:text-[10px] uppercase tracking-[0.1em] mt-0.5 text-slate-500 dark:text-slate-400">
                  University
                </p>
              </div>
            </Link>

            {/* 导航链接区域 - 统一管理 */}
            <div className="flex items-center space-x-1 md:space-x-4 lg:space-x-8 font-semibold text-[11px] md:text-base">
              <Link to="/" className="px-1.5 py-1 hover:text-blue-900 dark:hover:text-blue-400 transition">
                Home
              </Link>

              <Link to="/about" className="px-1.5 py-1 hover:text-orange-600 dark:hover:text-orange-400 transition">
                About
              </Link>

              <Link to="/alumni" className="px-1.5 py-1 hover:text-blue-900 dark:hover:text-blue-400 transition">
                Alumni
              </Link>

              {/* Rankings 在平板以上显示 */}
              <Link to="/rankings" className="hidden sm:block px-1.5 py-1 hover:text-orange-600 dark:hover:text-orange-400 transition">
                Rankings
              </Link>

              {/* Faculties 在电脑端显示 */}
              <Link to="/faculties" className="hidden md:block px-1.5 py-1 hover:text-blue-900 dark:hover:text-blue-400 transition">
                Faculties
              </Link>

              <Link to="/apply" className="bg-blue-900 text-white px-2.5 py-1.5 md:px-5 md:py-2 rounded-full hover:bg-orange-600 transition shadow-md whitespace-nowrap ml-1">
                <span className="md:hidden tracking-tighter">Apply</span>
                <span className="hidden md:inline">Apply Now</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* 页面内容出口 */}
        <div className="flex-grow pt-14 md:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/apply" element={<Admission />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>

        {/* 全局页脚 */}
        <footer className="bg-slate-950 text-slate-400 py-10 mt-auto border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-6 text-center text-[10px] md:text-xs">
            <div className="mb-4 text-xl">🦐</div>
            <p className="tracking-widest uppercase opacity-60 leading-relaxed">
              © 2026 Bushigemen University. <br />
              Where "Bro" is not just a word, it's a thesis.
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        @media (max-width: 320px) {
          .tracking-tighter { letter-spacing: -0.05em; }
        }
      `}</style>
    </Router>
  );
}

export default App;