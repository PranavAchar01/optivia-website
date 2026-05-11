'use client';

import { useEffect, useRef } from 'react';

export default function RippleBackground() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyed = false;
    let timer: ReturnType<typeof setTimeout>;

    const init = async () => {
      const $ = (await import('jquery')).default;
      await import('jquery.ripples');

      if (destroyed || !divRef.current) return;

      ($(divRef.current) as any).ripples({
        resolution: 512,
        dropRadius: 20,
        perturbance: 0.015,
        interactive: false,
        crossOrigin: '',
      });

      const el = divRef.current;

      // Fire multiple independent drop streams
      const drop = () => {
        if (destroyed || !el) return;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        // Drop 2-3 at once at different diagonal positions
        const count = 8 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
          const x = w * 0.75 * Math.random();
          const y = h * 0.08 * Math.random();
          ($(el) as any).ripples('drop', x, y, 18 + Math.random() * 12, 0.012 + Math.random() * 0.01);
        }
        timer = setTimeout(drop, 80 + Math.random() * 120);
      };

      drop();
    };

    init();

    return () => {
      destroyed = true;
      clearTimeout(timer);
      const cleanup = async () => {
        const $ = (await import('jquery')).default;
        if (divRef.current) {
          try { ($(divRef.current) as any).ripples('destroy'); } catch {}
        }
      };
      cleanup();
    };
  }, []);

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'transparent',
        zIndex: 8,
        mixBlendMode: 'screen' as const,
        pointerEvents: 'none',
      }}
    />
  );
}
