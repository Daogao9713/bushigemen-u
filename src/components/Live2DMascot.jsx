import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import * as PIXI from 'pixi.js';

const Live2DMascot = forwardRef(({ modelUrl }, ref) => {
  // ✅ 双 Ref 护航：container 管尺寸，canvas 管渲染
  const containerRef = useRef(null); 
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const modelRef = useRef(null);

  const [status, setStatus] = useState('loading');
  const [errorText, setErrorText] = useState('');

  useImperativeHandle(ref, () => ({
    playMotion: async (motionName) => {
      try {
        if (!modelRef.current || !motionName) return;
        await modelRef.current.motion(motionName);
      } catch (err) {
        console.warn('[BGU] motion 播放失败:', motionName, err);
      }
    },
    setExpression: async (expressionName) => {
      try {
        if (!modelRef.current || !expressionName) return;
        await modelRef.current.expression(expressionName);
      } catch (err) {
        console.warn('[BGU] expression 切换失败:', expressionName, err);
      }
    },
  }));

  useEffect(() => {
    let destroyed = false;
    let resizeHandler = null;
    let pointerMoveHandler = null;
    let randomIdleHandler = null;

    const boot = async () => {
      // ✅ 必须确认两个 DOM 节点都已经就绪
      if (!containerRef.current || !canvasRef.current) return;

      try {
        setStatus('loading');
        setErrorText('');

        window.PIXI = PIXI;

        const live2dModule = await import('pixi-live2d-display/cubism4');
        const Live2DModel = live2dModule.Live2DModel;

        if (destroyed) return;

        // 🚀 初始化 Pixi 引擎，直接接管 React 渲染的 canvas
        const app = new PIXI.Application({
          view: canvasRef.current, // 👈 绑定内部 Canvas
          autoStart: true,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(Math.max(window.devicePixelRatio || 1, 2), 3),
          resizeTo: containerRef.current, // 👈 监听外部 Div 缩放
          hello: false,
        });

        if (destroyed) {
          app.destroy(true);
          return;
        }

        appRef.current = app;

        // 🛡️ 关闭 Pixi 的事件系统，防止与 React 冲突引发报错
        if (app.stage) {
          app.stage.interactive = false;
          app.stage.interactiveChildren = false;
          if ('eventMode' in app.stage) app.stage.eventMode = 'none';
        }

        // 🚀 加载模型
        const model = await Live2DModel.from(modelUrl, {
          autoInteract: false,
          idleMotionGroup: 'Idle'
        });

        if (destroyed) {
          app.destroy(true);
          return;
        }

        modelRef.current = model;
        app.stage.addChild(model);
        model.anchor.set(0.5, 0.5);

        // 自适应缩放逻辑
        const fitModel = () => {
          if (!containerRef.current || !app || !model) return;
          const w = containerRef.current.clientWidth || window.innerWidth;
          const h = containerRef.current.clientHeight || window.innerHeight;

          model.scale.set(1);
          const modelWidth = model.width || 1000;
          const modelHeight = model.height || 1000;

          const scaleX = (w * 0.6) / modelWidth;
          const scaleY = (h * 0.85) / modelHeight;
          const finalScale = Math.min(scaleX, scaleY);

          model.scale.set(finalScale);
          model.position.set(app.screen.width / 2, app.screen.height / 2);
        };

        fitModel();
        
        resizeHandler = () => fitModel();
        window.addEventListener('resize', resizeHandler);

        pointerMoveHandler = (e) => {
          if (modelRef.current && typeof modelRef.current.focus === 'function') {
            modelRef.current.focus(e.clientX, e.clientY);
          }
        };
        window.addEventListener('pointermove', pointerMoveHandler);

        randomIdleHandler = async () => {
          if (modelRef.current) {
            const fallback = ['Idle_01', 'Idle_02'];
            const pick = fallback[Math.floor(Math.random() * fallback.length)];
            try { await modelRef.current.motion(pick); } catch (e) {}
          }
        };
        window.addEventListener('roxy_random_idle', randomIdleHandler);

        setStatus('ready');
      } catch (err) {
        console.error('[BGU_FATAL] Roxy 唤醒失败:', err);
        setStatus('error');
        setErrorText(err?.message || '渲染引擎同步中断');
      }
    };

    boot();

    return () => {
      destroyed = true;
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (pointerMoveHandler) window.removeEventListener('pointermove', pointerMoveHandler);
      if (randomIdleHandler) window.removeEventListener('roxy_random_idle', randomIdleHandler);
      
      try {
        if (appRef.current) {
          appRef.current.destroy(true, {
            children: true,
            // ⚠️ 极其关键：开发环境下 React 热更新频繁，
            // 设为 false 防止 WebGL 纹理被误删导致黑屏！
            texture: false, 
            baseTexture: false,
          });
        }
      } catch (err) {
        console.warn('[BGU] 链路切断时出现非致命干扰');
      }
      modelRef.current = null;
      appRef.current = null;
    };
  }, [modelUrl]);

  return (
    // ✅ 修复点 1：补回了 ref={containerRef}，让引擎知道该监听谁
    <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: '500px' }}>
      
      {/* 🚀 物理画布层 */}
      <canvas
        ref={canvasRef}
        style={{ pointerEvents: 'none' }} 
        className={`w-full h-full transition-opacity duration-1000 ${
          status === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 🔮 加载状态 */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center text-cyan-400 text-xs font-mono tracking-[0.3em] animate-pulse">
          INIT_HD_LINKING...
        </div>
      )}

      {/* ⚠️ 报错状态 */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 font-mono px-6">
          <div className="text-sm font-black mb-2 border-b border-red-400/30 pb-1">BGU_LINK_ERROR</div>
          <div className="text-[10px] opacity-60 break-all">{errorText}</div>
        </div>
      )}
    </div>
  );
});

export default Live2DMascot;