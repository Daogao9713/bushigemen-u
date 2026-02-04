import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas'; // 引入拍照库
// 1. 导入 Logo 确保路径正确 (假设它在上一级目录)
import logo from '../logo.jpg';

const AlumniCard = () => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  // 随机 6 位编号
  const [idNumber] = useState(() => Math.floor(Math.random() * 900000 + 100000));
  const [isGenerated, setIsGenerated] = useState(false);

  // 用于指向要截图的卡片容器
  const cardRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  // 📸 核心下载函数
  const handleDownload = async () => {
    if (cardRef.current) {
      // 拍照！
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true, // 允许跨域图片
        backgroundColor: null, // 透明背景
        scale: 3, // 提高清晰度到3倍，确保文字边缘锐利
      });

      // 转成图片链接
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `BGU_AlumniID_${idNumber}.png`; // 设置更有仪式感的文件名
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* 标题区 */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-3xl md:text-5xl font-serif italic text-slate-900 dark:text-white mb-4">
            Alumni ID Portal
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            输入身份信息，领取你的“不止哥们大学”永久校友证
          </p>
        </div>

        {!isGenerated ? (
          /* 输入表单 (保持不变) */
          <div
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl max-w-md mx-auto border border-gray-100 dark:border-slate-800"
            data-aos="zoom-in"
          >
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                FullName / 姓名
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-orange-500 transition-all outline-none dark:text-white"
                placeholder="YOUR NAME..."
              />
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Upload Photo / 证件照
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-slate-800 dark:file:text-orange-500"
              />
            </div>

            <button
              onClick={() => name && photo && setIsGenerated(true)}
              className="w-full bg-slate-900 dark:bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              GENERATE ID CARD
            </button>
          </div>
        ) : (
          /* 生成后的结果页 */
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            
            {/* 📸 核心修复区域：电子卡片容器 */}
            {/* 📸 究极修复版：电子卡片容器 */}
<div
  ref={cardRef}
  className="w-full max-w-sm aspect-[1.58/1] bg-gradient-to-br from-slate-900 to-black rounded-2xl p-3.5 md:p-6 pb-2 relative overflow-hidden shadow-2xl border border-white/10"
>
  {/* 背景装饰 */}
  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
    <div className="absolute top-[-10%] right-[-10%] w-40 h-40 border border-white rounded-full"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-60 h-60 border border-orange-500 rounded-full"></div>
  </div>

  <div className="relative z-10 h-full flex flex-col justify-between">
    
    {/* 顶部：校名和编号 */}
    <div className="flex justify-between items-start">
      <div className="leading-none">
        <h2 className="text-white font-bold tracking-tighter text-[13px] md:text-lg">
          BUSHIGEMEN UNIVERSITY
        </h2>
        <p className="text-[6px] md:text-[8px] text-orange-400 uppercase tracking-[0.2em] mt-0.5">
          Official Alumni Identity
        </p>
      </div>
      <div className="text-right">
        <span className="text-[8px] md:text-[10px] text-white/40 font-mono">
          NO.{idNumber}
        </span>
      </div>
    </div>

    {/* 中间：照片和姓名 (重构布局防止遮挡) */}
    <div className="flex items-center gap-3 my-1">
      
      {/* 照片容器 - 缩小到 70px 腾出空间 */}
      <div
        style={{ width: '70px', height: '70px' }}
        className="rounded-lg bg-gray-800 border border-white/20 overflow-hidden shrink-0 shadow-lg"
      >
        <img
          src={photo}
          alt="Alumni"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* 文字信息 - 确保不重叠 */}
      <div className="flex-1 min-w-0">
        <p className="text-[6px] md:text-[8px] text-white/40 uppercase tracking-wider">
          Name of Holder
        </p>
        <h3 className="text-base md:text-xl font-bold text-white font-serif leading-tight break-words">
          {name}
        </h3>
        <p className="text-[6px] md:text-[8px] text-orange-500 mt-0.5 font-mono">
          ISSUED: FEB 2026
        </p>
      </div>
    </div>

    {/* 底部：校训和Logo (最底部保持呼吸感) */}
    <div className="flex justify-between items-end border-t border-white/10 pt-1.5">
      <div className="flex gap-1.5 text-[5px] md:text-[7px] text-white/30 uppercase tracking-[0.1em] font-medium">
        <span>Loyalty</span>
        <span className="text-orange-600">•</span>
        <span>Brotherhood</span>
        <span className="text-orange-600">•</span>
        <span>Shrimp</span>
      </div>
      <div className="w-6 h-6 md:w-8 md:h-8 opacity-60">
        <img
          src={logo}
          alt="logo"
          className="rounded-full w-full h-full object-contain"
        />
      </div>
    </div>
  </div>
</div>
            {/* 卡片结束 */}

            {/* 下载按钮区域 */}
            <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-sm">
              <button
                onClick={handleDownload}
                className="w-full bg-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <span>📥 保存到相册</span>
              </button>

              <div className="p-4 bg-orange-50 dark:bg-slate-900 rounded-2xl border border-orange-100 dark:border-slate-800 text-center w-full">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  🎉 恭喜！请截图或下载此卡片，发送给校长以解锁荣誉殿堂权限。
                </p>
                <button
                  onClick={() => setIsGenerated(false)}
                  className="text-xs text-orange-600 font-bold underline mt-3 p-2"
                >
                  信息有误？重新填写
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniCard;