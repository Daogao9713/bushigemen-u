import React, { useState, useEffect } from 'react';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({});
  
  useEffect(() => {
    // 设定目标日期：2026年4月1日
    const targetDate = new Date('2026-04-01T00:00:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-orange-600 text-white py-3 px-6 rounded-full shadow-lg flex items-center gap-4 animate-pulse">
      <span className="font-bold text-sm tracking-widest uppercase">Entrance Ceremony Countdown:</span>
      <div className="font-mono font-bold flex gap-2">
        <span>{timeLeft.days}d</span>
        <span>{timeLeft.hours}h</span>
        <span>{timeLeft.mins}m</span>
      </div>
    </div>
  );
};

export default Countdown;