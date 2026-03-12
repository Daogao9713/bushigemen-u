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
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const modelRef = useRef(null);
  const physicsPulseRef = useRef(null);

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
    let pointerDownHandler = null;
    let pointerLeaveHandler = null;
    let randomIdleHandler = null;
    let hitHandler = null;

    const normalizeHitAreas = (hitAreaNames = []) => {
      return hitAreaNames.map((name) => String(name).toLowerCase());
    };

    const dispatchUserTouched = (text = '轻轻碰了碰你') => {
      window.dispatchEvent(
        new CustomEvent('roxy_interaction', {
          detail: text,
        })
      );

      window.dispatchEvent(
        new CustomEvent('roxy_user_touched', {
          detail: {
            source: 'live2d',
            text,
            at: Date.now(),
          },
        })
      );
    };

    const dispatchInteractionByHit = (hitAreaNames = []) => {
      const names = normalizeHitAreas(hitAreaNames);

      if (
        names.some(
          (n) =>
            n.includes('head') ||
            n.includes('face') ||
            n.includes('hair') ||
            n.includes('forehead') ||
            n.includes('cheek')
        )
      ) {
        dispatchUserTouched('摸了摸你的头');
        return 'head';
      }

      if (
        names.some(
          (n) =>
            n.includes('ear') ||
            n.includes('ears')
        )
      ) {
        dispatchUserTouched('捏了捏你的耳朵');
        return 'ear';
      }

      if (
        names.some(
          (n) =>
            n.includes('body') ||
            n.includes('bust') ||
            n.includes('torso') ||
            n.includes('chest') ||
            n.includes('breast')
        )
      ) {
        dispatchUserTouched('戳了戳你的身体');
        return 'body';
      }

      if (names.length > 0) {
        dispatchUserTouched('轻轻碰了碰你');
        return 'generic';
      }

      dispatchUserTouched('轻轻碰了碰你');
      return 'generic';
    };

    const getCoreModel = () => {
      return modelRef.current?.internalModel?.coreModel || null;
    };

    const setCoreParam = (paramId, value, weight = 1) => {
      const coreModel = getCoreModel();
      if (!coreModel || !paramId) return false;

      try {
        if (typeof coreModel.addParameterValueById === 'function') {
          coreModel.addParameterValueById(paramId, value, weight);
          return true;
        }

        if (typeof coreModel.setParameterValueById === 'function') {
          coreModel.setParameterValueById(paramId, value, weight);
          return true;
        }
      } catch (err) {
        console.warn('[BGU] 参数注入失败:', paramId, err);
      }

      return false;
    };

    const clearPhysicsPulse = () => {
      if (physicsPulseRef.current) {
        cancelAnimationFrame(physicsPulseRef.current);
        physicsPulseRef.current = null;
      }
    };

    const startPhysicsPulse = (type = 'generic') => {
      clearPhysicsPulse();

      // 这些是“候选参数”，不一定都存在
      // 你后续应该根据 physics3.json / cdi3.json 精确替换
      const paramCandidatesByType = {
        head: [
          'ParamPad1',
          'ParamTouch',
          'ParamAngleX',
          'ParamAngleY',
          'ParamHeadX',
          'ParamHeadY',
        ],
        ear: [
          'ParamPad1',
          'ParamTouch',
          'ParamEarL',
          'ParamEarR',
          'ParamAngleX',
        ],
        body: [
          'ParamPad1',
          'ParamTouch',
          'ParamBodyAngleX',
          'ParamBodyAngleY',
          'ParamBreath',
        ],
        generic: [
          'ParamPad1',
          'ParamTouch',
          'ParamAngleX',
          'ParamBodyAngleX',
        ],
      };

      const candidates = paramCandidatesByType[type] || paramCandidatesByType.generic;

      let frame = 0;
      const totalFrames = 40;

      const tick = () => {
        if (destroyed || !modelRef.current) return;

        const t = frame / totalFrames;
        const pulse = Math.sin((1 - t) * Math.PI) * (1 - t) * 20;

        for (const id of candidates) {
          setCoreParam(id, pulse, 1);
        }

        frame += 1;

        if (frame <= totalFrames) {
          physicsPulseRef.current = requestAnimationFrame(tick);
        } else {
          physicsPulseRef.current = null;
          // 结束时尝试归零，避免某些模型停在高值
          for (const id of candidates) {
            setCoreParam(id, 0, 1);
          }
        }
      };

      physicsPulseRef.current = requestAnimationFrame(tick);
    };

    const boot = async () => {
      if (!containerRef.current || !canvasRef.current || !modelUrl) return;

      try {
        setStatus('loading');
        setErrorText('');

        window.PIXI = PIXI;
        // 强制开启高质量纹理缩放算法
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR; 

// 增加各向异性过滤等级（如果硬件支持，会让侧面和细节更锐利）
        PIXI.settings.ANISOTROPIC_LEVEL = 16;
        const live2dModule = await import('pixi-live2d-display/cubism4');
        const Live2DModel = live2dModule.Live2DModel;

        if (destroyed) return;

        const app = new PIXI.Application({
          view: canvasRef.current,
          autoStart: true,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(Math.max(window.devicePixelRatio || 1, 2), 3),
          resizeTo: containerRef.current,
          hello: false,
        });

        if (destroyed) {
          app.destroy(false, { children: true });
          return;
        }

        appRef.current = app;

        // 继续彻底关闭 Pixi 事件系统
        if (app.stage) {
          app.stage.interactive = false;
          app.stage.interactiveChildren = false;
          if ('eventMode' in app.stage) {
            app.stage.eventMode = 'none';
          }
        }

        const model = await Live2DModel.from(modelUrl, {
          autoInteract: false,
          idleMotionGroup: 'Idle',
        });

        if (destroyed) {
          try {
            app.destroy(false, { children: true });
          } catch (_) {}
          return;
        }

        modelRef.current = model;
        app.stage.addChild(model);

        model.anchor.set(0.5, 0.5);
        model.interactive = false;
        model.interactiveChildren = false;
        if ('eventMode' in model) {
          model.eventMode = 'none';
        }

        const fitModel = () => {
          if (!containerRef.current || !appRef.current || !modelRef.current) return;

          const w = containerRef.current.clientWidth || window.innerWidth;
          const h = containerRef.current.clientHeight || window.innerHeight;
          const m = modelRef.current;
          const a = appRef.current;

          m.scale.set(1);

          const rawWidth = m.width || 1000;
          const rawHeight = m.height || 1000;

          const scaleX = (w * 0.6) / rawWidth;
          const scaleY = (h * 0.85) / rawHeight;
          const finalScale = Math.min(scaleX, scaleY);

          m.scale.set(finalScale);
          m.position.set(a.screen.width / 2, a.screen.height / 2);
        };

        const toCanvasPoint = (clientX, clientY) => {
          const canvas = canvasRef.current;
          const app = appRef.current;

          if (!canvas || !app) {
            return { x: 0, y: 0 };
          }

          const rect = canvas.getBoundingClientRect();

          if (!rect.width || !rect.height) {
            return {
              x: app.screen.width / 2,
              y: app.screen.height / 2,
            };
          }

          return {
            x: ((clientX - rect.left) / rect.width) * app.screen.width,
            y: ((clientY - rect.top) / rect.height) * app.screen.height,
          };
        };

        const safeHitTest = (x, y) => {
          const model = modelRef.current;
          if (!model) return [];

          try {
            if (typeof model.hitTest === 'function') {
              const result = model.hitTest(x, y);
              if (Array.isArray(result)) return result;
              if (typeof result === 'string') return [result];
              if (result) return ['unknown'];
            }
          } catch (err) {
            console.warn('[BGU] model.hitTest 失败', err);
          }

          try {
            if (typeof model.internalModel?.hitTest === 'function') {
              const result = model.internalModel.hitTest(x, y);
              if (Array.isArray(result)) return result;
              if (typeof result === 'string') return [result];
              if (result) return ['unknown'];
            }
          } catch (err) {
            console.warn('[BGU] internalModel.hitTest 失败', err);
          }

          return [];
        };

        hitHandler = (hitAreaNames) => {
          console.log('[BGU] Live2D hit areas:', hitAreaNames);
        };

        if (typeof model.on === 'function') {
          model.on('hit', hitHandler);
        }

        pointerMoveHandler = (e) => {
          if (!modelRef.current || !appRef.current || !canvasRef.current) return;
          if (typeof modelRef.current.focus !== 'function') return;

          try {
            const point = toCanvasPoint(e.clientX, e.clientY);
            modelRef.current.focus(point.x, point.y);
          } catch (err) {
            console.warn('[BGU] focus 跟随失败', err);
          }
        };

        pointerDownHandler = async (e) => {
          if (!modelRef.current || !appRef.current || !canvasRef.current) return;

          const rect = canvasRef.current.getBoundingClientRect();
          const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

          if (!inside) return;

          const point = toCanvasPoint(e.clientX, e.clientY);

          try {
            if (typeof modelRef.current.focus === 'function') {
              modelRef.current.focus(point.x, point.y);
            }
          } catch (_) {}

          let hitAreas = safeHitTest(point.x, point.y);

          try {
            if (typeof modelRef.current.tap === 'function') {
              modelRef.current.tap(point.x, point.y);
            }
          } catch (err) {
            console.warn('[BGU] tap 命中检测失败', err);
          }

          console.log('[BGU] pointerdown point:', point, 'hitAreas:', hitAreas);

          const interactionType = dispatchInteractionByHit(hitAreas);

          // 🚀 点击物理激振
          startPhysicsPulse(interactionType);

          // 可选视觉反馈
          try {
            if (typeof modelRef.current.expression === 'function') {
              if (interactionType === 'head' || interactionType === 'ear') {
                await modelRef.current.expression('Smile');
              } else {
                await modelRef.current.expression('Blush');
              }
            }
          } catch (err) {
            console.warn('[BGU] 点击表情反馈失败', err);
          }
        };

        pointerLeaveHandler = () => {
          if (!modelRef.current || !appRef.current) return;
          if (typeof modelRef.current.focus !== 'function') return;

          try {
            modelRef.current.focus(
              appRef.current.screen.width / 2,
              appRef.current.screen.height / 2
            );
          } catch (_) {}
        };

        randomIdleHandler = async () => {
          if (!modelRef.current) return;

          const fallback = ['Idle', 'Idle_01', 'Idle_02'];
          const pick = fallback[Math.floor(Math.random() * fallback.length)];

          try {
            await modelRef.current.motion(pick);
          } catch (_) {}
        };

        fitModel();

        resizeHandler = () => fitModel();

        window.addEventListener('resize', resizeHandler);
        window.addEventListener('roxy_random_idle', randomIdleHandler);
        window.addEventListener('pointermove', pointerMoveHandler, {
          passive: true,
        });

        containerRef.current.addEventListener('pointerdown', pointerDownHandler);
        containerRef.current.addEventListener('pointerleave', pointerLeaveHandler);

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

      clearPhysicsPulse();

      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }

      if (randomIdleHandler) {
        window.removeEventListener('roxy_random_idle', randomIdleHandler);
      }

      if (pointerMoveHandler) {
        window.removeEventListener('pointermove', pointerMoveHandler);
      }

      if (containerRef.current && pointerDownHandler) {
        containerRef.current.removeEventListener('pointerdown', pointerDownHandler);
      }

      if (containerRef.current && pointerLeaveHandler) {
        containerRef.current.removeEventListener('pointerleave', pointerLeaveHandler);
      }

      try {
        if (modelRef.current && hitHandler && typeof modelRef.current.off === 'function') {
          modelRef.current.off('hit', hitHandler);
        }
      } catch (err) {
        console.warn('[BGU] 移除 hit 监听失败', err);
      }

      try {
        if (appRef.current) {
          appRef.current.destroy(false, {
            children: true,
            texture: false,
            baseTexture: false,
          });
        }
      } catch (err) {
        console.warn('[BGU] 链路切断时出现非致命干扰', err);
      }

      modelRef.current = null;
      appRef.current = null;
    };
  }, [modelUrl]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative pointer-events-auto"
      style={{ minHeight: '500px' }}
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full transition-opacity duration-1000 ${
          status === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      />

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center text-cyan-400 text-xs font-mono tracking-[0.3em] animate-pulse pointer-events-none">
          INIT_HD_LINKING...
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 font-mono px-6 pointer-events-none">
          <div className="text-sm font-black mb-2 border-b border-red-400/30 pb-1">
            BGU_LINK_ERROR
          </div>
          <div className="text-[10px] opacity-60 break-all">{errorText}</div>
        </div>
      )}
    </div>
  );
});

Live2DMascot.displayName = 'Live2DMascot';

export default Live2DMascot;