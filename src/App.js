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

// === 修复 About 不加载的核心组件 ===
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // 1. 强制滚回顶部
    window.scrollTo(0, 0);
    // 2. 强制刷新动画（解决页面空白问题）
    setTimeout(() => {
      AOS.refresh(); 
    }, 100); 
  }, [pathname]);
  
  return null;
}

function App() {
  useEffect(() => {
    // 初始化动画
    AOS.init({
      once: true,
      offset: 10,
      duration: 500,
      // 手机端如果不想要动画（为了更流畅），可以把下面这行注释解开
      // disable: 'mobile', 
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />

      {/* 外层容器：overflow-x-hidden 彻底解决左右晃动 */}
      <div className="bg-gray-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden">
        
        {/* === 1. 顶部导航栏 (电脑端全显，手机端只显Logo) === */}
        <nav className="fixed w-full z-50 top-0 py-3 bg-white/95 text-slate-800 border-b border-gray-100 backdrop-blur-md shadow-sm transition-colors duration-500 dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            
            {/* Logo 区域 */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img src={logo} alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              <div className="text-left">
                <h1 className="text-sm md:text-xl font-bold tracking-tighter leading-none">BUSHIGEMEN</h1>
                <p className="text-[8px] md:text-[10px] uppercase tracking-widest mt-0.5 opacity-60">University</p>
              </div>
            </Link>

            {/* 电脑端导航链接 (手机端隐藏 hidden md:flex) */}
            <div className="hidden md:flex items-center space-x-8 font-semibold text-sm">
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              <Link to="/about" className="hover:text-orange-600 transition">About</Link>
              <Link to="/alumni" className="hover:text-blue-600 transition">Alumni</Link>
              <Link to="/rankings" className="hover:text-orange-600 transition">Rankings</Link>
              <Link to="/faculties" className="hover:text-blue-600 transition">Faculties</Link>
              <Link to="/apply" className="bg-blue-900 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition shadow-md">Apply Now</Link>
            </div>

            {/* 手机端占位符 (为了布局平衡) */}
            <div className="md:hidden w-8"></div> 
          </div>
        </nav>

        {/* === 页面内容区域 === */}
        {/* pb-24 是为了给底部导航栏留出空间，防止内容被遮挡 */}
        <div className="flex-grow pt-16 pb-24 md:pb-0">
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

        {/* === 2. 手机端底部导航栏 (仅手机可见 md:hidden) === */}
        <div className="md:hidden fixed bottom-0 w-full bg-white/95 dark:bg-slate-900/95 border-t border-gray-200 dark:border-slate-800 backdrop-blur-lg z-50 flex justify-around items-center py-2 pb-safe-area">
          <BottomNavLink to="/" icon="🏠" label="Home" />
          <BottomNavLink to="/about" icon="📖" label="About" />
          <BottomNavLink to="/apply" icon="✍️" label="Apply" isMain />
          <BottomNavLink to="/faculties" icon="🎓" label="Faculties" />
          <BottomNavLink to="/rankings" icon="🏆" label="Rank" />
        </div>

        {/* 全局页脚 (电脑端显示) */}
        <footer className="bg-slate-950 text-slate-400 py-10 mt-auto hidden md:block">
          <div className="max-w-7xl mx-auto px-6 text-center text-xs">
            <p className="tracking-widest uppercase opacity-60">© 2026 Bushigemen University.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// 底部导航单项组件
function BottomNavLink({ to, icon, label, isMain }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (isMain) {
    return (
      <Link to={to} className="relative -top-5">
        <div className="bg-blue-900 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-gray-50 dark:border-slate-950">
          {icon}
        </div>
      </Link>
    );
  }

  return (
    <Link to={to} className={`flex flex-col items-center gap-1 p-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

export default App;