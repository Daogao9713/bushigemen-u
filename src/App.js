import './App.css';
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
// 注意：确保 logo.jpg 就在 src 文件夹下
import logo from './logo.jpg'; 

function App() {
  const [name, setName] = useState('');
  const [major, setMajor] = useState('Bachelor of Advanced Memeology (网络迷因学)');
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    AOS.init({ once: true, offset: 50, duration: 800 });
  }, []);

  const handleGenerate = () => {
    if (!name) {
      alert("Please identify yourself before we can judge you.");
      return;
    }
    setShowOffer(true);
    // 稍后滚动到录取书位置
    setTimeout(() => {
      const el = document.getElementById('offer-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="bg-gray-50 text-gray-800 antialiased font-sans">
      {/* 导航栏 */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group">
            <img src={logo} alt="Logo" className="w-12 h-12 object-contain group-hover:rotate-12 transition-transform duration-500" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">BUSHIGEMEN</h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mt-1">University</p>
            </div>
          </div>
          <div className="hidden md:flex space-x-8 text-xs font-bold tracking-widest uppercase text-slate-600">
            <a href="#academics" className="hover:text-orange-600 transition">Academics</a>
            <a href="#apply" className="px-5 py-2 bg-slate-900 text-white hover:bg-orange-600 transition duration-300">Apply Now</a>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <header className="h-screen flex items-center justify-center relative bg-slate-900 text-white overflow-hidden">
        {/* 背景图模拟 */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1950&q=80')] bg-fixed bg-cover bg-center"></div>
        <div className="relative text-center px-4" data-aos="fade-up">
          <p className="text-sm font-bold tracking-[0.3em] uppercase mb-4 text-orange-400">Est. 2026 • Veritas in Caridibus</p>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-6 leading-tight">Redefining<br />Mediocrity.</h1>
          <p className="max-w-2xl mx-auto text-lg font-light text-gray-200 mb-10">
            在这里，我们不培养领袖。我们培养那些能够坐在领袖旁边，安静地剥虾并点头称是的人。
          </p>
          <a href="#apply" className="inline-block border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all">Start Your Failure</a>
        </div>
      </header>

      {/* 数据板块 */}
      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div data-aos="fade-up">
            <div className="text-4xl font-serif text-orange-500 mb-2">0%</div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Acceptance Rate</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="100">
            <div className="text-4xl font-serif text-orange-500 mb-2">#1</div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Ranked in Procrastination</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="200">
            <div className="text-4xl font-serif text-orange-500 mb-2">∞</div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Tuition (Soul Payable)</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="300">
            <div className="text-4xl font-serif text-orange-500 mb-2">24/7</div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Shrimp Service</p>
          </div>
        </div>
      </section>

      {/* 申请区域 */}
      <section id="apply" className="py-24 bg-slate-50 relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-slate-900">Claim Your Destiny</h2>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl mb-10 border border-white">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Legal Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hanzhi M" 
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Intended Major</label>
                <select 
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
                >
                  <option>Bachelor of Advanced Memeology (网络迷因学)</option>
                  <option>PhD in Sleep Management (睡眠管理博士)</option>
                  <option>BSc in Instant Noodle Chemistry (泡面化学)</option>
                  <option>Master of Gacha Probability (抽卡概率学)</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleGenerate}
              className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-orange-600 transition shadow-lg"
            >
              GENERATE OFFICIAL DECISION
            </button>
          </div>

          {/* 录取通知书部分 */}
          {showOffer && (
            <div id="offer-section" className="animate-in fade-in slide-in-from-bottom-10 duration-1000 bg-white shadow-2xl relative max-w-3xl mx-auto border-t-8 border-orange-500">
              <div className="p-12 md:p-16 relative">
                <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
                  <div className="flex items-center gap-4 text-left">
                    <img src={logo} className="h-20 w-auto" alt="logo" />
                    <h2 className="text-xl font-serif font-bold text-slate-900 uppercase">Bushigemen<br />University</h2>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-4xl text-orange-600 font-bold">2026</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">Official Admit</p>
                  </div>
                </div>

                <div className="font-serif text-lg text-slate-800 leading-relaxed space-y-6 text-left">
                  <p>Dear <span className="font-bold border-b-2 border-orange-200">{name}</span>,</p>
                  <p>It is with a mixture of pride and confusion that I welcome you to the <strong>{major}</strong> program at Bushigemen University.</p>
                  <p>At Bushigemen, we promise to equip you with absolutely no transferable skills, but a lifetime of "Bushi Gemen" memories. Try not to break anything.</p>
                </div>

                <div className="mt-16 flex justify-between items-end">
                  <div className="text-left">
                    <p className="text-3xl font-serif italic text-blue-900">GTG</p>
                    <div className="h-px w-32 bg-black mb-2"></div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Dean of Theoretical Affairs</p>
                  </div>
                  <div className="w-24 h-24 border-4 border-double border-orange-600 rounded-full flex items-center justify-center text-orange-600 font-bold -rotate-12">
                    SEAL OF<br />APPROVAL
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 flex justify-end no-print">
                <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-2 rounded text-sm">Print to PDF</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-slate-950 py-10 text-center text-xs text-gray-500">
        &copy; 2026 Bushigemen University. For Satire Only.
      </footer>
    </div>
  );
}

export default App;