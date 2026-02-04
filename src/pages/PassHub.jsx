import React from 'react';
import { Link } from 'react-router-dom';

const PassHub = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-6 transition-colors duration-500">
      <div className="max-w-md mx-auto h-full flex flex-col justify-center min-h-[70vh]">
        
        {/* 顶部标题 */}
        <div className="text-center mb-10" data-aos="fade-down">
          <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-xl mb-4">
            🗂️
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Manage your academic identity
          </p>
        </div>

        {/* 核心收纳按钮组 */}
        <div className="space-y-6">
          
          {/* 按钮 1: 入学申请 (Admission & Offer) */}
          <Link to="/apply" className="block group">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-3xl shadow-lg hover:shadow-xl hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 relative overflow-hidden">
              {/* 装饰背景 */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              
              <div className="relative z-10 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  ✍️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admissions</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    募集要项 / 录取通知书生成
                  </p>
                </div>
                <div className="ml-auto text-slate-300 group-hover:translate-x-1 transition-transform">
                  ➔
                </div>
              </div>
            </div>
          </Link>

          {/* 按钮 2: 校友证 (ID Card) */}
          <Link to="/id-card" className="block group">
            <div className="bg-slate-900 dark:bg-white/5 border border-slate-800 dark:border-white/10 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
              {/* 装饰背景 */}
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-500/10 rounded-tl-full -mr-6 -mb-6"></div>

              <div className="relative z-10 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  🪪
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Alumni ID</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    领取电子校友证 / 身份认证
                  </p>
                </div>
                <div className="ml-auto text-slate-500 group-hover:translate-x-1 transition-transform">
                  ➔
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* 底部提示 */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">
            Bushigemen Academic System v2.0
          </p>
        </div>

      </div>
    </div>
  );
};

export default PassHub;