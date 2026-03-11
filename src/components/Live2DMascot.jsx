import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import * as PIXI from 'pixi.js';

const Live2DMascot = forwardRef(({ modelUrl }, ref) => {
  const containerRef = useRef(null);
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
      if (!containerRef.current) return;

      try {
        setStatus('loading');
        setErrorText('');

        window.PIXI = PIXI;

        const live2dModule = await import('pixi-live2d-display/cubism4');
        const Live2DModel = live2dModule.Live2DModel;

        if (destroyed || !containerRef.current) return;

        containerRef.current.innerHTML = '';

        const app = new PIXI.Application({
          width: containerRef.current.clientWidth || 800,
          height: containerRef.current.clientHeight || 600,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          resizeTo: containerRef.current,
        });

        if (destroyed) {
          app.destroy(true);
          return;
        }

        appRef.current = app;
        containerRef.current.appendChild(app.view);

        // ✅ 关键：关闭 stage 的交互命中，规避 Pixi 事件系统递归 hitTest
        if (app.stage) {
          app.stage.interactive = false;
          app.stage.interactiveChildren = false;
          if ('eventMode' in app.stage) {
            app.stage.eventMode = 'none';
          }
        }

        // ✅ 让 canvas 本身不吃鼠标事件，避免 pointerover/out 进入 Pixi EventSystem
        app.view.style.pointerEvents = 'none';

        const model = await Live2DModel.from(modelUrl, {
          autoInteract: false,
        });

        if (destroyed) {
          try {
            app.destroy(true, { children: true });
          } catch (e) {}
          return;
        }

        modelRef.current = model;
        app.stage.addChild(model);

        model.anchor.set(0.5, 0.5);

        // ✅ 再次显式关闭模型交互
        model.interactive = false;
        model.interactiveChildren = false;
        if ('eventMode' in model) {
          model.eventMode = 'none';
        }

        const fitModel = () => {
          if (!containerRef.current || !appRef.current || !modelRef.current) return;

          const w = containerRef.current.clientWidth || window.innerWidth;
          const h = containerRef.current.clientHeight || window.innerHeight;
          const currentModel = modelRef.current;

          currentModel.scale.set(1);

          const modelWidth = currentModel.width || 1000;
          const modelHeight = currentModel.height || 1000;

          const scaleX = (w * 0.55) / modelWidth;
          const scaleY = (h * 0.82) / modelHeight;
          const finalScale = Math.min(scaleX, scaleY);

          currentModel.scale.set(finalScale);
          currentModel.position.set(w / 2, h / 2);
        };

        fitModel();

        resizeHandler = () => {
          fitModel();
        };
        window.addEventListener('resize', resizeHandler);

        // ✅ 用全局 pointermove 做注视跟随，不依赖 Pixi 命中系统
        pointerMoveHandler = (e) => {
          if (!modelRef.current) return;
          if (typeof modelRef.current.focus === 'function') {
            modelRef.current.focus(e.clientX, e.clientY);
          }
        };
        window.addEventListener('pointermove', pointerMoveHandler);

        randomIdleHandler = async () => {
          if (!modelRef.current) return;

          const fallbackMotions = ['Idle_01', 'Idle_02'];
          const pick =
            fallbackMotions[Math.floor(Math.random() * fallbackMotions.length)];

          try {
            await modelRef.current.motion(pick);
          } catch (err) {
            console.warn('[BGU] 随机 Idle 播放失败:', pick, err);
          }
        };
        window.addEventListener('roxy_random_idle', randomIdleHandler);

        setStatus('ready');
      } catch (err) {
        console.error('[BGU_FATAL] Live2D 启动失败:', err);
        setStatus('error');
        setErrorText(err?.message || '未知错误');
      }
    };

    console.log('PIXI VERSION =>', PIXI.VERSION);boot();

    return () => {
      destroyed = true;

      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }
      if (pointerMoveHandler) {
        window.removeEventListener('pointermove', pointerMoveHandler);
      }
      if (randomIdleHandler) {
        window.removeEventListener('roxy_random_idle', randomIdleHandler);
      }

      try {
        if (appRef.current) {
          appRef.current.destroy(true, {
            children: true,
            texture: true,
            baseTexture: true,
          });
        }
      } catch (err) {
        console.warn('[BGU] Pixi 销毁时出现非致命错误:', err);
      }

      modelRef.current = null;
      appRef.current = null;
    };
  }, [modelUrl]);

  return (
    <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-700 ${
          status === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center text-cyan-300 text-sm font-mono tracking-widest">
          LIVE2D_LINKING...
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-300 text-xs font-mono px-6 text-center">
          <div className="mb-2 text-sm font-bold">LIVE2D INIT FAILED</div>
          <div className="opacity-80 break-all">{errorText}</div>
        </div>
      )}
    </div>
  );
});

export default Live2DMascot;