import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// 页面引入
import Home from './pages/Home';
import About from './pages/About'; 
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
    // 针对移动端优化了 AOS 动画，防止滚动卡顿
    AOS.init({ 
      once: true, 
      offset: 20, 
      duration: 600,
      disable: window.innerWidth < 768 // 手机端可选禁用动画以提升流畅度
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="bg-gray-50 text-slate-800 font-sans min-h-screen flex flex-col">
        
        {/* 全局导航栏 - 极致适配版 */}
        <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-2.5 md:py-4">
          <div className="max-w-7xl mx-auto px-3 md:px-6 flex justify-between items-center">
            
            {/* Logo 和 校名区域：取消隐藏逻辑，确保校名在手机端可见 */}
            <Link to="/" className="flex items-center gap-1.5 md:gap-3 group shrink-0">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-7 h-7 md:w-10 md:h-10 object-contain group-hover:rotate-12 transition-transform duration-500" 
              />
              <div className="text-left">
                {/* 手机端 text-[13px]，电脑端 text-xl，保证校名不换行 */}
                <h1 className="text-[13px] md:text-xl font-bold tracking-tighter text-slate-900 leading-none">
                  BUSHIGEMEN
                </h1>
                <p className="text-[6px] md:text-[10px] uppercase tracking-[0.1em] text-slate-500 mt-0.5">
                  University
                </p>
              </div>
            </Link>
            
            {/* 导航链接区域：通过 space-x-1 和较小字号适配窄屏 */}
            <div className="flex items-center space-x-1 md:space-x-8 font-semibold text-[11px] md:text-base">
              <Link to="/" className="px-1.5 py-1 hover:text-blue-900 transition">Home</Link>
              <Link to="/about" className="px-1.5 py-1 hover:text-orange-600 transition">About</Link>
              
              {/* Faculties 在宽度小于 360px 的超窄手机上隐藏，防止挤压 */}
              <Link to="/faculties" className="hidden xs:block px-1.5 py-1 hover:text-blue-900 transition">Faculties</Link>
              
              {/* Apply 按钮在手机端精简文字 */}
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
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/apply" element={<Admission />} />
            <Route path="*" element={<Home />} /> 
          </Routes>
        </div>

        {/* 全局页脚 */}
        <footer className="bg-slate-950 text-slate-400 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center text-[10px] md:text-xs">
            <div className="mb-4 text-xl">🦐</div>
            <p className="tracking-widest uppercase opacity-60 leading-relaxed">
              © 2026 Bushigemen University. <br/>
              Where "Bro" is not just a word, it's a thesis.
            </p>
          </div>
        </footer>
      </div>

      {/* 补充一点点全局 CSS 解决窄屏溢出 */}
      <style>{`
        @media (max-width: 320px) {
          .tracking-tighter { letter-spacing: -0.05em; }
        }
      `}</style>
    </Router>
  );
}

export default App;