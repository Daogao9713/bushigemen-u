import React, { useState, useRef } from 'react';
import { toJpeg } from 'html-to-image'; // 引入转换库
import logo from '../logo.jpg';
import signatureImg from '../signature.png';

function Admission() {
  const [name, setName] = useState('');
  const [major] = useState('School of Business');
  const [showOffer, setShowOffer] = useState(false);
  const offerRef = useRef(null); // 用于定位通知书节点

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // 生成逻辑
  const handleGenerate = () => {
    if (!name) { alert("Please identify yourself."); return; }
    setShowOffer(true);
    setTimeout(() => {
      offerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // 保存为 JPG 的逻辑
  const downloadJpg = () => {
    if (offerRef.current === null) return;
    
    // 提示用户正在生成
    const btn = document.getElementById('save-btn');
    btn.innerText = "Generating...";

    toJpeg(offerRef.current, { quality: 0.95, backgroundColor: '#fdfbf7' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `BG-University-Offer-${name}.jpg`;
        link.href = dataUrl;
        link.click();
        btn.innerText = "Save as JPG";
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
        btn.innerText = "Error, try again";
      });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex flex-col items-center font-sans no-print-bg">
      
      {/* 控制台 - 增加 no-print 类名，打印时不显示 */}
      <div className="text-center mb-12 max-w-2xl mx-auto w-full no-print">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admission Portal</h1>
        <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2 overflow-hidden">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-slate-50 border-none rounded-xl px-6 py-4 outline-none font-medium"
          />
          <button 
            onClick={handleGenerate}
            className="bg-blue-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg"
          >
            APPLY
          </button>
        </div>
      </div>

      {/* --- 录取通知书 --- */}
      {showOffer && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-1000">
          
          <div 
            ref={offerRef}
            id="offer-section"
            className="w-full max-w-[210mm] aspect-[1/1.414] bg-[#fdfbf7] text-black relative p-[20mm] md:p-[25mm] overflow-hidden border-[1px] border-slate-200 md:shadow-2xl print:shadow-none print:border-none"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {/* 纸张纹理 */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start border-b-[3px] border-blue-900 pb-8 mb-10">
              <div className="flex items-center gap-5 text-left">
                <img src={logo} alt="Logo" className="h-24 w-auto grayscale contrast-125 mix-blend-multiply" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tighter text-blue-900 uppercase leading-[0.9]">Bushigemen<br/>University</h1>
                  <p className="text-[10px] uppercase tracking-[0.3em] mt-2 text-slate-500 font-bold">Office of Admissions</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-left mb-12">
              <p className="mb-8 text-slate-700 font-serif">{date}</p>
              <div className="pl-6 border-l-[3px] border-slate-200">
                <p className="font-bold text-2xl mb-1 tracking-tight">{name}</p>
                <p className="text-xs text-slate-400 font-sans uppercase">Ref: #BG-{Math.floor(1000 + Math.random() * 9000)}-2026</p>
              </div>
            </div>

            <div className="relative z-10 text-[12pt] leading-[1.7] text-justify mb-12 space-y-6 font-serif">
              <p>Dear {name},</p>
              <p>It is my honor to extend an offer of admission to <strong>Bushigemen University</strong>. You have been placed within the <strong>{major}</strong> faculty. This decision is based on our rigorous evaluation of your potential to contribute absolutely nothing to society, but much to the brotherhood.</p>
              <p>Welcome to the 2026 cohort. Don't be late for lunch.</p>
            </div>

            {/* Signature & Seal */}
            <div className="relative z-10 mt-16 text-left flex items-end justify-between">
              <div className="relative inline-block">
                <img 
                  src={signatureImg} 
                  className="h-20 w-auto opacity-95 -rotate-3 mb-[-15px] relative z-20 mix-blend-multiply transition-all grayscale contrast-150" 
                  alt="Sig" 
                />
                <div className="border-t-[1.5px] border-black pt-3 pr-20 relative z-10">
                  <p className="font-serif font-bold text-2xl text-slate-900">SUZUMIYA</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">University President</p>
                </div>
              </div>

              {/* Seal */}
              <div className="w-32 h-32 border-[4px] border-red-700/60 rounded-full flex items-center justify-center pointer-events-none mix-blend-multiply -rotate-12" 
                   style={{maskImage: 'url("https://www.transparenttextures.com/patterns/dust.png")'}}>
                 <div className="text-red-700/70 font-bold text-[8px] uppercase text-center">
                    Bushigemen University<br/>★<br/>Official Seal
                 </div>
              </div>
            </div>
          </div>

          {/* 操作按钮组 - no-print */}
          <div className="flex gap-4 mt-8 pb-20 no-print">
            <button 
              id="save-btn"
              onClick={downloadJpg}
              className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-all shadow-lg flex items-center gap-2"
            >
              Save as JPG
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-700 transition-all shadow-lg flex items-center gap-2"
            >
              Print to PDF
            </button>
          </div>
        </div>
      )}

      {/* 针对打印的样式注入 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, html { visibility: hidden; background: white !important; }
          .no-print { display: none !important; }
          #offer-section { 
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 25mm !important;
            box-shadow: none !important;
            border: none !important;
          }
          #offer-section * { visibility: visible !important; }
        }
      `}} />
    </div>
  );
}

export default Admission;