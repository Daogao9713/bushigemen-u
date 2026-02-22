// src/App.js
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';

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
import Admin from './pages/Admin'; // ✅ 加上它（文件名建议 Admin.jsx）

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

  const closeAllMenus = () => {
    setIsNavMenuOpen(false);
    setIsThemeMenuOpen(false);
  };

  return (
    <Router>
      <ScrollToTop />

      <div className="bg-gray-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden">
        <nav className="fixed w-full z-50 top-0 h-16 bg-white/95 text-slate-800 border-b border-gray-100 backdrop-blur-md shadow-sm transition-colors duration-500 dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
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
                  <div className="p-2">
                    <Link
                      onClick={() => setIsThemeMenuOpen(false)}
                      to="/"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                      🏛️ <span>Main Campus</span>
                    </Link>

                    <Link
                      onClick={() => setIsThemeMenuOpen(false)}
                      to="/cny"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition mt-1"
                    >
                      🧧 <span>Lunar New Year</span>
                    </Link>

                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 cursor-not-allowed mt-1 opacity-50">
                      🎄 <span>Xmas '26 (Soon)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/"
              className="flex-shrink-0 flex flex-col items-center justify-center group select-none"
              onClick={closeAllMenus}
            >
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
                <h1 className="text-lg font-black tracking-tighter leading-none">
                  BGU
                </h1>
              </div>
              <p className="text-[6px] uppercase tracking-[0.3em] mt-0.5 opacity-60 font-bold">
                Bushigemen
              </p>
            </Link>

            <div className="flex-1 flex justify-end relative">
              <button
                onClick={() => {
                  setIsNavMenuOpen((v) => !v);
                  setIsThemeMenuOpen(false);
                }}
                className="p-2 -mr-2 text-slate-600 dark:text-slate-300 hover:text-orange-600 transition"
                aria-label="Open menu"
                aria-expanded={isNavMenuOpen}
              >
                {isNavMenuOpen ? (
                  <span className="text-2xl leading-none">×</span>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>

              {isNavMenuOpen && (
                <div className="absolute top-12 right-0 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 p-3 z-50">
                  <div className="flex flex-col gap-1">
                    <NavMenuItem
                      to="/"
                      icon="🏠"
                      label="Home"
                      onClick={() => setIsNavMenuOpen(false)}
                    />
                    <NavMenuItem
                      to="/about"
                      icon="📖"
                      label="About Us"
                      onClick={() => setIsNavMenuOpen(false)}
                    />
                    <NavMenuItem
                      to="/alumni"
                      icon="🤝"
                      label="Alumni Wall"
                      onClick={() => setIsNavMenuOpen(false)}
                    />
                    <NavMenuItem
                      to="/rankings"
                      icon="🏆"
                      label="Rankings"
                      onClick={() => setIsNavMenuOpen(false)}
                    />
                    <NavMenuItem
                      to="/faculties"
                      icon="🎓"
                      label="Faculties"
                      onClick={() => setIsNavMenuOpen(false)}
                    />

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                    <NavMenuItem
                      to="/pass"
                      icon="🗂️"
                      label="Student Portal"
                      onClick={() => setIsNavMenuOpen(false)}
                      highlight
                    />

                    <NavMenuItem
                      to="/apply"
                      icon="📝"
                      label="Apply Now"
                      onClick={() => setIsNavMenuOpen(false)}
                    />

                    <NavMenuItem
                      to="/id-card"
                      icon="🪪"
                      label="ID Portal"
                      onClick={() => setIsNavMenuOpen(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="flex-grow pt-16 pb-24 md:pb-0" onClick={closeAllMenus}>
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

            {/* ✅ 后台发布页 */}
            <Route path="/admin" element={<Admin />} />

            <Route path="*" element={<Home />} />
          </Routes>
        </div>

        <div className="md:hidden fixed bottom-0 w-full bg-white/95 dark:bg-slate-900/95 border-t border-gray-200 dark:border-slate-800 backdrop-blur-lg z-50 flex justify-around items-center py-2 pb-safe-area">
          <BottomNavLink to="/" icon="🏠" label="Home" />
          <BottomNavLink to="/about" icon="📖" label="About" />
          <BottomNavLink to="/pass" icon="🗂️" label="Portal" isMain />
          <BottomNavLink to="/alumni" icon="🤝" label="Alumni" />
          <BottomNavLink to="/faculties" icon="🎓" label="Faculties" />
        </div>

        <footer className="bg-slate-950 text-slate-400 py-10 mt-auto hidden md:block">
          <div className="max-w-7xl mx-auto px-6 text-center text-xs">
            <p className="tracking-widest uppercase opacity-60">
              © 2026 Bushigemen University.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

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

  const isPassActive =
    to === '/pass' &&
    (location.pathname === '/pass' ||
      location.pathname === '/apply' ||
      location.pathname === '/id-card');

  const isActive = location.pathname === to || isPassActive;

  if (isMain) {
    return (
      <Link to={to} className="relative -top-5">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-gray-50 dark:border-slate-950 transition-transform active:scale-90 ${
            isPassActive ? 'bg-orange-500 text-white' : 'bg-slate-800 text-white'
          }`}
        >
          {icon}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 p-1 ${
        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

export default App;