// src/hooks/useWeather.js
import { useState, useEffect } from 'react';

export const useWeather = () => {
  const [envData, setEnvData] = useState({
    condition: 'Clear', // Clear, Rain, Storm
    temp: '22',
    location: 'Suginami',
    theme: 'emerald' // 颜色主题
  });

  useEffect(() => {
    const fetchEnvironment = async () => {
      try {
        // wttr.in 会根据用户 IP 自动判断地点
        const res = await fetch('https://wttr.in/?format=j1');
        const data = await res.json();
        const desc = data.current_condition[0].weatherDesc[0].value.toLowerCase();
        const temp = data.current_condition[0].temp_C;
        const region = data.nearest_area[0].areaName[0].value;

        let cond = 'Clear';
        let color = 'emerald';

        if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('mist')) {
          cond = 'Rain';
          color = 'sky'; // 雨天切换为忧郁 SAO 蓝
        } else if (desc.includes('thunder') || desc.includes('storm')) {
          cond = 'Storm';
          color = 'amber'; // 极端天气切换为预警橙
        }

        setEnvData({ condition: cond, temp, location: region, theme: color });
      } catch (e) {
        console.warn("Satellite Sync Failed. Defaulting to Suginami HQ.");
      }
    };

    fetchEnvironment();
  }, []);

  return envData;
};