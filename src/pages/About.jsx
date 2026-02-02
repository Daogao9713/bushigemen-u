import React from 'react';
// 确保 image.jpg 和 signature.png 确实在 src 文件夹下
import founderImg from '../image.jpg';
import signatureImg from '../signature.png';

function About() {
  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-slate-800">
      
      {/* 1. 顶部 Hero：模拟历史感 */}
      <div className="relative bg-slate-900 text-white py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h1 className="relative z-10 text-5xl md:text-7xl font-serif italic mb-6" data-aos="fade-up">Our Legacy</h1>
        <p className="relative z-10 text-lg opacity-80 max-w-2xl mx-auto font-light tracking-wide" data-aos="fade-up" data-aos-delay="100">
          Built on the foundation of brotherhood, sustained by the spirit of mediocrity.
        </p>
      </div>

      {/* 主体内容容器 */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        
        {/* 2. 创始人板块 */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative" data-aos="fade-right">
            <div className="w-full aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden shadow-2xl relative border border-gray-100">
              <img 
                src={founderImg} 
                alt="Founder SUZUMIYA" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-left">
                <h3 className="text-white text-2xl font-serif font-bold tracking-tight">SUZUMIYA</h3>
                <p className="text-orange-400 text-xs uppercase tracking-[0.2em] font-semibold">Founder & Supreme Leader</p>
              </div>
            </div>
            <div className="absolute -top-10 -left-10 text-9xl text-slate-100 font-serif z-[-1] select-none">“</div>
          </div>
          
          <div className="text-left" data-aos="fade-left">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-8 leading-tight italic">
              "We don't just peel shrimp.<br/>We peel back the layers of <span className="text-orange-600">society</span>."
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-light text-justify">
              <p>When I founded Bushigemen University in 2026, people called me crazy. They said, "SUZUMIYA, you can't build a university based entirely on vibes and snacks."</p>
              <p>They were right. But I did it anyway.</p>
              <p>Our mission is simple: to provide a sanctuary for those who believe that academic success is inversely proportional to mental health. Here, we honor the procrastinators and the kings of "barely passing."</p>
              <div className="pt-4">
                <img 
                  src={signatureImg} 
                  className="h-20 opacity-80 mt-4 -rotate-3 hover:rotate-0 transition-transform duration-500" 
                  alt="Official Signature"
                />
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">Digitally Certified by the Office of the Supreme Leader</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The Grand Chronology | 编年史 */}
        <div className="border-t border-gray-200 pt-20">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-3xl font-serif text-slate-900 mb-3 tracking-tight">The Grand Chronology</h2>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-bold">A timeline of questionable milestones</p>
          </div>
          
          <div className="space-y-24 relative border-l border-gray-100 ml-6 md:ml-1/2 pl-8 md:pl-0">
            
            {/* 2026.02 - 创始时刻 */}
            <div className="relative md:flex items-center justify-between" data-aos="fade-up">
              <div className="absolute -left-[41px] md:left-1/2 md:-ml-[10px] w-5 h-5 bg-orange-600 rounded-full border-4 border-white shadow-md"></div>
              <div className="md:w-[45%] mb-4 md:mb-0 md:text-right md:pr-14">
                <span className="text-4xl font-serif italic text-slate-200 block mb-1">Feb. 2026</span>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-orange-50 md:border-b-0 inline-block md:block">The Napkin Charter</h3>
                <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                  创始人 SUZUMIYA 以“世界太无聊”为由，单方面决定自己必须成为改变世界的那个人。确立了以“哥们义气”为核心的办学基石。
                </p>
              </div>
              <div className="md:w-[45%]"></div>
            </div>

            {/* 2026.09 - 技术突破 */}
            <div className="relative md:flex items-center justify-between" data-aos="fade-up">
              <div className="absolute -left-[41px] md:left-1/2 md:-ml-[10px] w-5 h-5 bg-slate-900 rounded-full border-4 border-white shadow-md"></div>
              <div className="md:w-[45%]"></div>
              <div className="md:w-[45%] md:pl-14 text-left">
                <span className="text-4xl font-serif italic text-slate-200 block mb-1">Sept. 2026</span>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-50 md:border-b-0 inline-block md:block">AI-Driven Laziness</h3>
                <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                  工程学院成功开发出首个“代剥虾机器人”原型。虽然目前只能在《Minecraft》中运行，但已获得校方 5 亿“虚拟币”注资。
                </p>
              </div>
            </div>

            {/* 2027.04 - 文化冲突 */}
            <div className="relative md:flex items-center justify-between" data-aos="fade-up">
              <div className="absolute -left-[41px] md:left-1/2 md:-ml-[10px] w-5 h-5 bg-slate-900 rounded-full border-4 border-white shadow-md"></div>
              <div className="md:w-[45%] mb-4 md:mb-0 md:text-right md:pr-14">
                <span className="text-4xl font-serif italic text-slate-200 block mb-1">April 2027</span>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-50 md:border-b-0 inline-block md:block text-left md:text-right">The Translation War</h3>
                <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                  由于翻译学院试图将所有课程翻译成“歌德语”，导致系统崩溃。校方举办了首届 Phigros 全校锦标赛作为补偿。
                </p>
              </div>
              <div className="md:w-[45%]"></div>
            </div>

            {/* 2030 - 最终结局 */}
            <div className="relative md:flex items-center justify-between" data-aos="fade-up">
              <div className="absolute -left-[41px] md:left-1/2 md:-ml-[10px] w-5 h-5 bg-slate-900 rounded-full border-4 border-white shadow-md"></div>
              <div className="md:w-[45%]"></div>
              <div className="md:w-[45%] md:pl-14 text-left">
                <span className="text-4xl font-serif italic text-slate-200 block mb-1">2030</span>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-50 md:border-b-0 inline-block md:block">Existential Transcendence</h3>
                <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                  本校正式宣布取消实体校舍。毕业生被授予“数字哥们”终身头衔，学费账单将永存于区块链中。
                </p>
              </div>
            </div>

          </div> {/* 结束 space-y-24 */}
        </div> {/* 结束 border-t */}

      </div> {/* 结束 max-w-5xl */}
    </div> 
  );
}

export default About;