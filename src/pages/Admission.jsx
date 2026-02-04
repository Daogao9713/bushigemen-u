// src/pages/Admission.jsx (or Admission.js)
import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { toJpeg } from "html-to-image";

import logo from "../logo.jpg";
import signatureImg from "../signature.png";

const guidelines = [
  { title: "募集人数", content: "若干名 (哥们名额有限，先到先得)" },
  { title: "応募資格", content: "具备为哥们剥虾，摸鱼的技能，或拥有1000小时以上的galgame游戏时长等。" },
  { title: "選択方法", content: "書類审查 及び 面接。" },
  { title: "入学時期", content: "20xx年4月1日" },
];

function Admission() {
  const [name, setName] = useState("");
  const [major, setMajor] = useState("School of Business");
  const [showOffer, setShowOffer] = useState(false);

  const offerRef = useRef(null);
  const refCodeRef = useRef(`#BG-${Math.floor(1000 + Math.random() * 9000)}-2026`);

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    // 轻量初始化：手机端禁用动画（更流畅）
    AOS.init({ once: true, duration: 600, offset: 20, disable: "mobile" });
  }, []);

  // showOffer 切换后刷新一次，确保 data-aos 生效
  useEffect(() => {
    AOS.refresh?.();
  }, [showOffer]);

  const handleGenerate = () => {
    if (!name) {
      alert("Please identify yourself.");
      return;
    }
    setShowOffer(true);
    setTimeout(() => {
      offerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const downloadJpg = async () => {
    if (!offerRef.current) return;

    const btn = document.getElementById("save-btn");
    const originalText = btn?.innerText;

    try {
      if (btn) btn.innerText = "Generating...";

      const dataUrl = await toJpeg(offerRef.current, {
        quality: 0.95,
        backgroundColor: "#fdfbf7",
      });

      const link = document.createElement("a");
      link.download = `BG-University-Offer-${name}.jpg`;
      link.href = dataUrl;
      link.click();

      if (btn) btn.innerText = originalText || "Save as JPG";
    } catch (err) {
      console.error("Download failed", err);
      if (btn) btn.innerText = "Error, try again";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex flex-col items-center font-sans no-print-bg">
      {/* Control Console */}
      <div className="text-center mb-8 max-w-2xl mx-auto w-full no-print">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admission Portal</h1>
        <p className="text-gray-500 text-sm mb-6 font-light">
          Enter details to generate your official acceptance letter.
        </p>

        <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row gap-3 overflow-hidden">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-slate-50 border-none rounded-xl px-6 py-4 outline-none font-medium focus:ring-2 focus:ring-blue-900/20 transition-all"
          />

          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-4 outline-none font-medium cursor-pointer focus:ring-2 focus:ring-blue-900/20 transition-all"
          >
            <option value="School of Business">School of Business</option>
            <option value="Shrimp Engineering">Shrimp Engineering</option>
            <option value="Meme Studies">Meme Studies</option>
            <option value="Procrastination">Procrastination</option>
          </select>

          <button
            onClick={handleGenerate}
            className="bg-blue-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-blue-800 active:scale-95 transition-all shadow-lg"
          >
            APPLY
          </button>
        </div>
      </div>

      {/* Guidelines + Offer wrapper */}
      <div className="max-w-4xl mx-auto w-full mt-6 mb-20 no-print">
        {/* 募集要项板块（未生成录取通知书时显示） */}
        {!showOffer && (
          <div data-aos="fade-up">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-300 flex-grow" />
              <h2 className="text-xl font-serif italic text-slate-500 uppercase tracking-widest">
                Application Guidelines
              </h2>
              <div className="h-px bg-slate-300 flex-grow" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guidelines.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/70 p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-orange-600 font-bold text-xs uppercase tracking-tighter mb-2">
                    ● {item.title}
                  </h3>
                  <p className="text-slate-800 font-medium">{item.content}</p>
                </div>
              ))}
            </div>

            {/* 特别声明 */}
            <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm leading-relaxed border-l-4 border-orange-600">
              <p>
                <strong>学園長から：</strong> ただの人間には興味ありません。 この中に、宇宙人、未来人、異世界人、超能力者がいたら、あたしのところに来なさい。—— SUZUMIYA
              </p>
            </div>
          </div>
        )}

        {/* 录取通知书生成部分 */}
        {showOffer && (
          <div className="mt-10">
            <div className="text-center mb-8">
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Application Accepted
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Offer Letter Section */}
      {showOffer && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-1000">
          {/* Scroll wrapper for mobile devices */}
          <div className="w-full overflow-x-auto pb-8 no-print flex justify-start md:justify-center">
            <div
              ref={offerRef}
              id="offer-section"
              className="min-w-[800px] md:min-w-0 w-full max-w-[210mm] aspect-[1/1.414] bg-[#fdfbf7] text-black relative p-[20mm] md:p-[25mm] overflow-hidden border-[1px] border-slate-200 md:shadow-2xl print:shadow-none print:border-none"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {/* Paper Texture */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Header */}
              <div className="relative z-10 flex justify-between items-start border-b-[3px] border-blue-900 pb-8 mb-10">
                <div className="flex items-center gap-5 text-left text-blue-900">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-24 w-auto grayscale contrast-125 mix-blend-multiply"
                  />
                  <div>
                    <h1 className="text-3xl font-bold tracking-tighter uppercase leading-[0.9]">
                      Bushigemen
                      <br />
                      University
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] mt-2 text-slate-500 font-bold">
                      Office of Admissions
                    </p>
                  </div>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="relative z-10 text-left mb-12">
                <p className="mb-8 text-slate-700 font-serif">{date}</p>
                <div className="pl-6 border-l-[3px] border-slate-200">
                  <p className="font-bold text-2xl mb-1 tracking-tight">{name}</p>
                  <p className="text-xs text-slate-400 font-sans uppercase">
                    Ref: {refCodeRef.current}
                  </p>
                </div>
              </div>

              {/* Body Text */}
              <div className="relative z-10 text-[12pt] leading-[1.7] text-justify mb-12 space-y-6 font-serif">
                <p>Dear {name},</p>
                <p>
                  It is my honor to extend an offer of admission to{" "}
                  <strong>Bushigemen University</strong>. You have been placed within the{" "}
                  <strong>{major}</strong> faculty. This decision is based on our rigorous
                  evaluation of your potential to contribute absolutely nothing to society,
                  but much to the brotherhood.
                </p>
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
                    <p className="font-serif font-bold text-2xl text-slate-900 tracking-tighter">
                      SUZUMIYA
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                      University President
                    </p>
                  </div>
                </div>

                <div
                  className="w-32 h-32 border-[4px] border-red-700/60 rounded-full flex items-center justify-center pointer-events-none mix-blend-multiply -rotate-12"
                  style={{ maskImage: 'url("https://www.transparenttextures.com/patterns/dust.png")' }}
                >
                  <div className="text-red-700/70 font-bold text-[8px] uppercase text-center">
                    Bushigemen University
                    <br />★<br />
                    Official Seal
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pb-20 no-print w-full max-w-sm sm:max-w-none">
            <button
              id="save-btn"
              onClick={downloadJpg}
              className="flex-1 bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Save as JPG
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Print to PDF
            </button>
          </div>
        </div>
      )}

      {/* Global CSS for Print and Mobile */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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

        .overflow-x-auto::-webkit-scrollbar { height: 4px; }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `,
        }}
      />
    </div>
  );
}

export default Admission;