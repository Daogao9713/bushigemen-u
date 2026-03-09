import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

const Live2DMascot = ({ modelUrl }) => {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    window.PIXI = PIXI;
    let app;

    const init = async () => {
      try {
        const { Live2DModel } = await import('pixi-live2d-display');
        
        app = new PIXI.Application({
          view: canvasRef.current,
          autoStart: true,
          backgroundAlpha: 0,
          resizeTo: canvasRef.current.parentElement,
          antialias: true,
          // ✅ 关键：解决像素模糊，强制使用设备原始分辨率 (通常是 2x 或 3x)
          resolution: window.devicePixelRatio || 1,
          autoDensity: true, 
          eventMode: 'none',
        });

        const model = await Live2DModel.from(modelUrl, {
          autoInteract: false,
          idleMotionGroup: 'Idle'
        });

        // ✅ 智能缩放逻辑：根据容器宽高自动适配，防止出框
        const fitScale = () => {
          const parent = canvasRef.current.parentElement;
          const scaleW = parent.offsetWidth / model.width;
          const scaleH = parent.offsetHeight / model.height;
          // 手机端取较小值，确保全身可见
          const finalScale = Math.min(scaleW, scaleH) * 0.9;
          model.scale.set(finalScale);
          model.position.set(app.screen.width / 2, app.screen.height / 2);
        };

        model.anchor.set(0.5, 0.5);
        fitScale();
        
        // 监听窗口大小变化，实时重绘
        window.addEventListener('resize', fitScale);

        app.stage.addChild(model);
        setIsReady(true);
      } catch (e) {
        console.error("❌ BGU_CORE: RENDER_ERROR", e);
      }
    };

    const timer = setTimeout(init, 500);
    return () => {
      clearTimeout(timer);
      if (app) app.destroy(true, true);
    };
  }, [modelUrl]);

  return (
    <div className="w-full h-full relative min-h-[350px] md:min-h-[500px]">
      <canvas ref={canvasRef} className={`w-full h-full transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default Live2DMascot;