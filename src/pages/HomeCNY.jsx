import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomeCNY() {
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0
  });

  useEffect(() => {
    const targetDate = new Date('April 1, 2026 09:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      const totalDays = Math.floor(distance / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365);
      const days = totalDays % 365;

      setTimeLeft({
        years: years,
        days: days,
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#5c0e0e] min-h-screen text-[#ffd700]">

      {/* Hero */}
      <header className="min-h-[85vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black opacity-[0.03] pointer-events-none whitespace-nowrap font-serif text-[#ffd700]">
          丙午大吉
        </div>

        <div className="relative text-center px-4">
          <div className="inline-block px-4 py-1 border border-[#ffd700]/50 rounded-full mb-6 bg-black/20 backdrop-blur-sm">
            <span className="text-xs font-bold tracking-widest uppercase">
              2026 LUNAR NEW YEAR EDITION
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-4 leading-tight drop-shadow-2xl text-[#ffeb85]">
            红 包 拿 来.<br />学 费 交 来.
          </h1>

          <p className="max-w-xl mx-auto text-lg md:text-xl font-light text-[#ffd700]/80 mb-10">
            全球首家支持“微信红包抵扣挂科费”的研究型大学。<br />
            恭祝各位哥们：剥虾不脏手，排位不遇狗。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/pass"
              className="bg-gradient-to-b from-[#ffd700] to-[#b8860b] text-[#5c0e0e] px-10 py-4 font-black uppercase text-sm tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,215,0,0.3)]"
            >
              🧧 领取赛博红包
            </Link>

            <Link
              to="/"
              className="border border-[#ffd700]/30 text-[#ffd700] bg-black/10 backdrop-blur-sm px-10 py-4 uppercase text-sm tracking-widest rounded-full hover:bg-[#ffd700]/10 transition-all"
            >
              返回高冷主校区
            </Link>
          </div>
        </div>
      </header>

      {/* 跑马灯 */}
      <div className="bg-black/40 py-3 overflow-hidden relative border-y border-[#ffd700]/20">
        <div className="flex animate-marquee whitespace-nowrap gap-10 text-xs md:text-sm font-bold tracking-widest text-[#ffd700]">
          <span>★ 喜报：SUZUMIYA 校长携全体教职员工给大家拜个晚年</span>
          <span>★ 警告：禁止在寝室走廊使用加特林烟花</span>
          <span>★ 招生：现在申请，送开光录取通知书一份</span>
          <span>★ 喜报：SUZUMIYA 校长携全体教职员工给大家拜个晚年</span>
          <span>★ 喜报：高校董赢牌3把</span>
        </div>
      </div>

      {/* 倒计时 */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-[#ffd700] font-serif italic text-2xl md:text-3xl mb-12">
            距离 2026 入学大典 (Entrance Ceremony) 还有...
          </h2>

          <div className="flex justify-center gap-4 md:gap-8">
            <TimeBlock value={timeLeft.years} label="年 (Years)" />
            <TimeBlock value={timeLeft.days} label="天 (Days)" />
            <TimeBlock value={timeLeft.hours} label="时 (Hrs)" />
            <TimeBlock value={timeLeft.mins} label="分 (Mins)" />
            <TimeBlock value={timeLeft.secs} label="秒 (Secs)" />
          </div>
        </div>
      </section>
    </div>
  );
}

const TimeBlock = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-20 md:w-28 md:h-32 bg-gradient-to-br from-[#8a1515] to-[#4a0808] border border-[#ffd700]/40 rounded-xl flex items-center justify-center shadow-2xl mb-3 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 rounded-b-full"></div>
      <span className="text-4xl md:text-7xl font-black font-mono text-[#ffeb85]">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <div className="text-[10px] md:text-xs tracking-widest font-bold text-[#ffd700]/70">
      {label}
    </div>
  </div>
);

export default HomeCNY;