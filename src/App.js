import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ✅ 引入 BroadcastBanner
import BroadcastBanner from './components/BroadcastBanner';

// === 页面引入 ===
import Home from './pages/Home';
import HomeCNY from './pages/HomeCNY';
import About from './pages/About';
import Alumni from './pages/Alumni';
import Rankings from './pages/Rankings';
import Faculties from './pages/Faculties';
import Admission from './pages/Admission';
import AlumniCard from './pages/AlumniCard';
import PassHub from './pages/PassHub';
import NewsDetail from './pages/NewsDetail';
import NewsArchive from './pages/NewsArchive';
import Admin from './pages/Admin';

// ✅ 新增：CampusView
import CampusView from './pages/CampusView';

import logo from './logo.jpg';

// === 滚动与动画修复组件 ===
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    AOS.init({ once: true, offset: 10, duration: 500 });
  }, []);

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  // ✅ 初始状态设为 false，由 Banner 内部获取数据库后回传
  const [isBroadcastActive, setIsBroadcastActive] = useState(false);

  // ✅ 高度常量定义
  const BANNER_H = 32; // 对应 h-8
  const NAV_H = 64; // 对应 h-16

  // ✅ 动态计算主内容的 PaddingTop，确保内容永远在 Header 下方开始
  const topPadding = useMemo(() => {
    return (isBroadcastActive ? BANNER_H : 0) + NAV_H;
  }, [isBroadcastActive]);

  const closeAllMenus = () => {
    setIsNavMenuOpen(false);
    setIsThemeMenuOpen(false);
  };

  return (
    <Router>
      <ScrollToTop />

      <div className="bg-gray-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden">
        {/* 🚨 核心方案：Header 设为 fixed，内部元素自然排列 */}
        <header className="fixed top-0 w-full z-50 flex flex-col transition-all duration-500">
          {/* 1. 警报条：务必确保 BroadcastBanner 内部没有 fixed 定位 */}
          <BroadcastBanner onActiveChange={setIsBroadcastActive} />

          {/* 2. 导航栏：它会根据 Banner 是否存在自动上下滑动 */}
          <nav className="h-16 w-full bg-white/95 text-slate-800 border-b border-gray-100 dark:border-slate-800 backdrop-blur-md shadow-sm dark:bg-slate-900/95 dark:text-slate-100 flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
              {/* 左侧：Style 按钮 */}
              <div className="flex-1 flex justify-start relative">
                <button
                  onClick={() => {
                    setIsThemeMenuOpen((v) => !v);
                    setIsNavMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <span>✨</span>
                  <span className="hidden md:inline">Style</span>
                </button>
                {isThemeMenuOpen && (
                  <div className="absolute top-10 left-0 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-50">
                    <div className="p-2 text-left">
                      <Link
                        onClick={() => setIsThemeMenuOpen(false)}
                        to="/"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        🏛️ Main Campus
                      </Link>
                      <Link
                        onClick={() => setIsThemeMenuOpen(false)}
                        to="/cny"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition mt-1"
                      >
                        🧧 Lunar New Year
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 中间：Logo */}
              <Link
                to="/"
                className="flex-shrink-0 flex flex-col items-center justify-center group select-none"
                onClick={closeAllMenus}
              >
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
                  <h1 className="text-lg font-black tracking-tighter leading-none text-slate-900 dark:text-white">
                    BGU
                  </h1>
                </div>
                <p className="text-[6px] uppercase tracking-[0.3em] mt-0.5 opacity-60 font-bold dark:text-slate-400">
                  Bushigemen
                </p>
              </Link>

              {/* 右侧：菜单按钮 */}
              <div className="flex-1 flex justify-end relative">
                <button
                  onClick={() => {
                    setIsNavMenuOpen((v) => !v);
                    setIsThemeMenuOpen(false);
                  }}
                  className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:text-orange-600 transition"
                >
                  {isNavMenuOpen ? (
                    <span className="text-2xl">×</span>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>

                {isNavMenuOpen && (
                  <div className="absolute top-12 right-0 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 p-3 z-50 text-left">
                    <div className="flex flex-col gap-1 text-left">
                      <NavMenuItem to="/" icon="🏠" label="Home" onClick={() => setIsNavMenuOpen(false)} />
                      <NavMenuItem to="/about" icon="📖" label="About Us" onClick={() => setIsNavMenuOpen(false)} />
                      <NavMenuItem to="/alumni" icon="🤝" label="Alumni Wall" onClick={() => setIsNavMenuOpen(false)} />
                      <NavMenuItem to="/campus" icon="🧊" label="3D Campus" onClick={() => setIsNavMenuOpen(false)} />
                      <NavMenuItem to="/pass" icon="🗂️" label="Student Portal" onClick={() => setIsNavMenuOpen(false)} highlight />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* 3. 内容区域：根据 Banner 状态动态调整 Padding */}
        <main
          className="flex-grow pb-24 md:pb-0 transition-all duration-500 ease-in-out"
          style={{ paddingTop: topPadding }}
          onClick={closeAllMenus}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cny" element={<HomeCNY />} />
            <Route path="/about" element={<About />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/pass" element={<PassHub />} />
            <Route path="/apply" element={<Admission />} />
            <Route path="/id-card" element={<AlumniCard />} />
            <Route path="/news" element={<NewsArchive />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/admin" element={<Admin />} />

            {/* ✅ 新增：3D 校园 */}
            <Route path="/campus" element={<CampusView />} />

            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* 移动端底部导航 */}
        <div className="md:hidden fixed bottom-0 w-full bg-white/95 dark:bg-slate-900/95 border-t border-gray-200 dark:border-slate-800 backdrop-blur-lg z-50 flex justify-around items-center py-2 pb-safe-area">
          <BottomNavLink to="/" icon="🏠" label="Home" />
          <BottomNavLink to="/about" icon="📖" label="About" />
          <BottomNavLink to="/pass" icon="🗂️" label="Portal" isMain />
          <BottomNavLink to="/alumni" icon="🤝" label="Alumni" />
          <BottomNavLink to="/faculties" icon="🎓" label="Faculties" />
        </div>

        {/* 页脚 */}
        <footer className="bg-slate-950 text-slate-400 py-10 mt-auto hidden md:block">
          <div className="max-w-7xl mx-auto px-6 text-center text-xs">
            <p className="tracking-widest uppercase opacity-60">© 2026 Bushigemen University.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// --- 辅助小组件 ---
function NavMenuItem({ to, icon, label, onClick, highlight }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold text-sm ${
        highlight
          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function BottomNavLink({ to, icon, label, isMain }) {
  const location = useLocation();
  const isActive =
    location.pathname === to || (to === '/pass' && ['/pass', '/apply', '/id-card'].includes(location.pathname));

  if (isMain)
    return (
      <Link to={to} className="relative -top-5">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-gray-50 dark:border-slate-950 transition-transform active:scale-90 ${
            isActive ? 'bg-orange-500 text-white' : 'bg-slate-800 text-white'
          }`}
        >
          {icon}
        </div>
      </Link>
    );

  return (
    <Link to={to} className={`flex flex-col items-center gap-1 p-1 ${isActive ? 'text-orange-600' : 'text-slate-400'}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

export default App;