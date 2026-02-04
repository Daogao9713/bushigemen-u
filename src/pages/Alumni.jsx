import React from 'react';
import { alumniList } from '../data/alumni';

const Alumni = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-serif">
            Hall of Fame
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Meet the legends who survived our rigorous curriculum of doing absolutely nothing.
            <br/>
            (Wall approved by President SUZUMIYA)
          </p>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alumniList.map((person) => (
            <div key={person.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 border border-slate-100 group">
              {/* 头像背景 */}
              <div className="h-24 bg-gradient-to-r from-blue-900 to-slate-900 relative">
                <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-full">
                  <img 
                    src={person.avatar} 
                    alt={person.name} 
                    className="w-20 h-20 rounded-full bg-slate-100"
                  />
                </div>
              </div>
              
              {/* 内容 */}
              <div className="pt-12 pb-8 px-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{person.name}</h3>
                  <span className="text-xs font-mono text-slate-400">#00{person.id}</span>
                </div>
                <p className="text-sm text-orange-600 font-bold mb-4">{person.major}</p>
                
                <p className="text-slate-600 italic text-sm mb-6">"{person.quote}"</p>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {person.tags.map((tag, index) => (
                    <span key={index} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部招募令 */}
        <div className="mt-20 text-center bg-blue-900 rounded-3xl p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Want to be on the wall?</h2>
            <p className="mb-6 opacity-80">Send a bribe... I mean, an application to the President.</p>
            <a href="mailto:admin@bushigemen.edu" className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition">
              Contact President
            </a>
          </div>
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-orange-500 opacity-20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Alumni;