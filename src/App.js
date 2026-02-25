import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { playSound } from './utils/audioHelper';
import Preloader from './components/Preloader';
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
import CampusView from './pages/CampusView';

import logo from './logo.jpg';

// === 1. 转场外壳 ===
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="w-full"
  >
    {children}
  </motion.div>
);

// === 2. 动画路由逻辑 ===
const AnimatedRoutes = ({ loggedInUserName }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home userName={loggedInUserName} /></PageWrapper>} />
        <Route path="/cny" element={<PageWrapper><HomeCNY userName={loggedInUserName} /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/alumni" element={<PageWrapper><Alumni /></PageWrapper>} />
        <Route path="/rankings" element={<PageWrapper><Rankings /></PageWrapper>} />
        <Route path="/faculties" element={<PageWrapper><Faculties /></PageWrapper>} />
        <Route path="/pass" element={<PageWrapper><PassHub userName={loggedInUserName} /></PageWrapper>} />
        <Route path="/apply" element={<PageWrapper><Admission userName={loggedInUserName} /></PageWrapper>} />
        <Route path="/id-card" element={<PageWrapper><AlumniCard userName={loggedInUserName} /></PageWrapper>} />
        <Route path="/news" element={<PageWrapper><NewsArchive /></PageWrapper>} />
        <Route path="/news/:id" element={<PageWrapper><NewsDetail /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
        <Route path="/campus" element={<PageWrapper><CampusView /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><Home userName={loggedInUserName} /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => { AOS.refresh(); }, 100);
  }, [pathname]);
  return null;
}

function App() {
  const [showPreloader, setShowPreloader] = useState(() => {
    try { return !localStorage.getItem('bgu_user_name'); } catch { return true; }
  });

  const [loggedInUserName, setLoggedInUserName] = useState(() => {
    try { return localStorage.getItem('bgu_user_name') || ''; } catch { return ''; }
  });

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isBroadcastActive, setIsBroadcastActive] = useState(false);

  useEffect(() => {
    AOS.init({ once: true, offset: 10, duration: 500 });
  }, []);

  useEffect(() => {
    if (showPreloader) return;
    const handleGlobalClick = (e) => {
      const target = e.target.closest('button, a, input');
      if (target && 'vibrate' in navigator) navigator.vibrate(15);
    };
    document.addEventListener('pointerdown', handleGlobalClick);
    return () => document.removeEventListener('pointerdown', handleGlobalClick);
  }, [showPreloader]);

  const BANNER_H = 32;
  const NAV_H = 64;
  const topPadding = useMemo(() => (isBroadcastActive ? BANNER_H : 0) + NAV_H, [isBroadcastActive]);

  const closeAllMenus = () => {
    setIsNavMenuOpen(false);
    setIsThemeMenuOpen(false);
  };

  const handleNameSubmitted = (name) => {
    setLoggedInUserName(name);
    try { localStorage.setItem('bgu_user_name', name); } catch {}
  };

  if (showPreloader) {
    return <Preloader onLoaded={() => setShowPreloader(false)} onNameSubmitted={handleNameSubmitted} />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="bg-gray-50 dark:bg-slate-950 min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden">
        
        {/* --- HEADER --- */}
        <header className="fixed top-0 w-full z-[100] flex flex-col transition-all duration-500">
          <BroadcastBanner onActiveChange={setIsBroadcastActive} />
          
          <nav className="h-16 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800/50 flex items-center text-slate-800 dark:text-slate-100 transition-colors">
            <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
              
              {/* Style 按钮 */}
              <div className="flex-1 flex justify-start relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsThemeMenuOpen(!isThemeMenuOpen);
                    setIsNavMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-200"
                >
                  <span>✨</span> <span className="hidden md:inline">Style</span>
                </button>

                {isThemeMenuOpen && (
                  <div className="absolute top-12 left-0 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                    <div className="p-2 text-left space-y-1">
                      <Link onClick={closeAllMenus} to="/" className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">🏛️ Main Campus</Link>
                      <Link onClick={closeAllMenus} to="/cny" className="block px-3 py-2 text-sm text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">🧧 Lunar New Year</Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex flex-col items-center group select-none" onClick={closeAllMenus}>
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Logo" className="w-7 h-7 object-contain rounded-full shadow-sm" />
                  <h1 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white transition-colors">BGU</h1>
                </div>
                <p className="text-[6px] uppercase tracking-[0.3em] opacity-60 font-bold text-slate-500 dark:text-slate-400">Bushigemen</p>
              </Link>

              {/* 菜单按钮 */}
              <div className="flex-1 flex justify-end relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNavMenuOpen(!isNavMenuOpen);
                    setIsThemeMenuOpen(false);
                  }}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  {isNavMenuOpen ? <span className="text-2xl leading-none">×</span> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16"/></svg>}
                </button>

                {isNavMenuOpen && (
                  <div className="absolute top-12 right-0 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 p-3 z-[110] animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                    <div className="flex flex-col gap-1">
                      <NavMenuItem to="/" icon="🏠" label="Home" onClick={closeAllMenus} />
                      <NavMenuItem to="/about" icon="📖" label="About Us" onClick={closeAllMenus} />
                      <NavMenuItem to="/alumni" icon="🤝" label="Alumni Wall" onClick={closeAllMenus} />
                      <NavMenuItem to="/campus" icon="🧊" label="3D Campus" onClick={closeAllMenus} />
                      <NavMenuItem to="/pass" icon="🗂️" label="Student Portal" onClick={closeAllMenus} highlight />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* --- MAIN --- */}
        <main className="flex-grow overflow-x-hidden relative" style={{ paddingTop: topPadding }} onClick={closeAllMenus}>
          <AnimatedRoutes loggedInUserName={loggedInUserName} />
        </main>

        {/* --- MOBILE NAV --- */}
        <div className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/90 border-t border-gray-200 dark:border-slate-800/50 backdrop-blur-2xl z-[100] py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] flex justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transition-colors">
          <BottomNavLink to="/" icon="🏠" label="Home" />
          <BottomNavLink to="/about" icon="📖" label="About" />
          <BottomNavLink to="/pass" icon="🗂️" label="Portal" isMain />
          <BottomNavLink to="/alumni" icon="🤝" label="Alumni" />
          <BottomNavLink to="/campus" icon="🗺️" label="Campus" />
        </div>
      </div>
    </Router>
  );
}

// --- 子组件 (已修复暗色文字) ---
function NavMenuItem({ to, icon, label, onClick, highlight }) {
  return (
    <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold text-sm ${highlight ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
      <span className="text-lg">{icon}</span><span>{label}</span>
    </Link>
  );
}

function BottomNavLink({ to, icon, label, isMain }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/pass' && ['/pass', '/apply', '/id-card'].includes(location.pathname));
  
  return (
    <Link to={to} className={isMain ? 'relative -top-5' : `flex flex-col items-center gap-1 p-1 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500'}`}>
      {isMain ? (
        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50 dark:border-slate-950 transition-transform active:scale-90 ${isActive ? 'bg-orange-500 text-white' : 'bg-slate-800 dark:bg-slate-700 text-white'}`}>
          {icon}
        </div>
      ) : (
        <>
          <span className="text-xl transition-transform duration-300">{icon}</span>
          <span className="text-[10px] font-medium">{label}</span>
        </>
      )}
    </Link>
  );
}

export default App;