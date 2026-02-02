// src/pages/Admission.jsx
import React, { useState } from 'react';
import logo from '../logo.jpg'; // 注意这里的路径多了一层 ../

function Admission() {
  const [name, setName] = useState('');
  const [major, setMajor] = useState('Bachelor of Advanced Memeology (网络迷因学)');
  const [showOffer, setShowOffer] = useState(false);

  const handleGenerate = () => {
    if (!name) { alert("Please identify yourself."); return; }
    setShowOffer(true);
    setTimeout(() => {
      document.getElementById('offer-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      <div className="text-center mb-12" data-aos="fade-up">
        <span className="text-orange-600 font-bold tracking-widest text-xs uppercase">Office of Admissions</span>
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mt-4 mb-6">Join the Elite*</h1>
        <p className="text-gray-500 text-sm">*Elite definition may vary.</p>
      </div>

      {/* 输入框区域 */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-10" data-aos="fade-up" data-aos-delay="100">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Applicant Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hanzhi M" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-4 focus:outline-none focus:border-orange-500 transition font-serif text-lg" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Desired Major</label>
            <select 
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-4 focus:outline-none focus:border-orange-500 transition font-serif text-lg"
            >
              <option>Bachelor of Advanced Memeology (网络迷因学)</option>
              <option>PhD in Sleep Management (睡眠管理博士)</option>
              <option>BSc in Instant Noodle Chemistry (泡面化学)</option>
              <option>Master of Gacha Probability (抽卡概率学)</option>
              <option>BA in Excuse Fabrication (借口编造文学)</option>
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            className="w-full bg-slate-900 text-white font-bold py-5 rounded-lg hover:bg-orange-600 transition duration-300 shadow-lg text-sm tracking-widest uppercase"
          >
            Generate Acceptance Letter
          </button>
        </div>
      </div>

      {/* 录取通知书 (保持原样，只做微调) */}
      {showOffer && (
        <div id="offer-section" className="w-full max-w-3xl bg-white shadow-2xl p-10 md:p-16 relative border-8 border-double border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* 水印 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
             <div className="text-[200px] select-none">🦐</div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between border-b-2 border-slate-900 pb-6 mb-8">
               <img src={logo} className="h-20 w-auto" alt="logo" />
               <div className="text-right">
                  <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">Official<br/>Decision</h2>
               </div>
            </div>

            <div className="font-serif text-lg md:text-xl text-slate-800 leading-relaxed space-y-6">
              <p>Dear <span className="font-bold border-b-2 border-orange-500">{name}</span>,</p>
              <p>Congratulations! Or perhaps, our condolences.</p>
              <p>We are pleased to offer you admission to the <strong>{major}</strong> program for the Fall 2026 term.</p>
              <p>Your application demonstrated a unique ability to prioritize leisure over productivity, a trait we highly value at Bushigemen University.</p>
              <p>Please report to the cafeteria immediately upon arrival.</p>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-end">
               <div>
                  <p className="font-serif text-2xl italic text-slate-900">GTG</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Director of Admissions</p>
               </div>
               <div className="w-24 h-24 border-4 border-orange-600 rounded-full flex items-center justify-center text-orange-600 font-bold transform -rotate-12 opacity-80 text-xs text-center leading-tight">
                  OFFICIAL<br/>SEAL
               </div>
            </div>
          </div>
          
          <div className="mt-8 text-center no-print">
            <button onClick={() => window.print()} className="text-xs text-slate-400 hover:text-orange-600 underline">Download as PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admission;