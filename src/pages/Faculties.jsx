// src/pages/Faculties.jsx
import React from 'react';

const faculties = [
  {
    id: 1,
    name: "School of Business Simulation",
    chineseName: "虚无主义商学院",
    desc: "专精于PPT美化、废话文学以及如何用'底层逻辑'和'颗粒度'把简单的事情搞复杂。",
    courses: ["PPT造车导论", "职场甩锅艺术", "如何在星巴克假装办公"],
    icon: "💼",
    color: "from-blue-900 to-slate-800"
  },
  {
    id: 2,
    name: "College of Reverse Engineering",
    chineseName: "暴力拆解工程院",
    desc: "我们的信条是：只要还能转，就别去动它。如果动坏了，就说是特性。",
    courses: ["胶带修复学", "拍打电器维修法", "Minecraft红石电路实战"],
    icon: "🔧",
    color: "from-orange-700 to-red-900"
  },
  {
    id: 3,
    name: "Institute of Anime History",
    chineseName: "二次元历史研究院",
    desc: "致力于考证《Fate》系列与真实历史的偏差，并试图用圣晶石贿赂历史老师。",
    courses: ["Saber脸识别概论", "抽卡概率统计学", "深夜番剧鉴赏"],
    icon: "⛩️",
    color: "from-purple-900 to-indigo-900"
  },
  {
    id: 4,
    name: "Dept. of Culinary Survival",
    chineseName: "极限生存烹饪系",
    desc: "研究如何在只有热水壶和泡面的情况下，做出一顿看起来像米其林的晚餐。",
    courses: ["泡面炼金术", "便利店打折便当抢购策略", "外卖满减算法"],
    icon: "🍜",
    color: "from-green-800 to-emerald-900"
  }
];

function Faculties() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-slate-900 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-serif italic mb-4" data-aos="fade-down">Our Faculties</h1>
        <p className="opacity-60 max-w-2xl mx-auto">
          Choose your path to mediocrity. We offer world-class education in fields that arguably shouldn't exist.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 grid md:grid-cols-2 gap-8">
        {faculties.map((f, index) => (
          <div 
            key={f.id} 
            data-aos="fade-up" 
            data-aos-delay={index * 100}
            className={`group relative overflow-hidden rounded-2xl shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
          >
            {/* 顶部的渐变色块 */}
            <div className={`h-32 bg-gradient-to-r ${f.color} flex items-center justify-center`}>
              <span className="text-6xl transform group-hover:scale-110 transition duration-500">{f.icon}</span>
            </div>
            
            <div className="p-8">
              <h3 className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-1">{f.name}</h3>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{f.chineseName}</h2>
              <p className="text-gray-600 leading-relaxed mb-6 border-l-4 border-gray-200 pl-4 italic">
                {f.desc}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Core Curriculum</h4>
                <div className="flex flex-wrap gap-2">
                  {f.courses.map(c => (
                    <span key={c} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faculties;