'use client';

import { useEffect, useRef } from 'react';

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elContainer = containerRef.current;
    if (!elContainer) return;

    const countEls = elContainer.querySelectorAll<HTMLElement>('[data-count]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const end = +(el.dataset.count || 0);
          const suffix = el.dataset.suffix || '';
          const dur = 1600;
          const start = performance.now();

          const tick = (now: number) => {
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 4);
            el.textContent = Math.round(end * eased).toLocaleString() + (t === 1 ? suffix : '');
            if (t < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );

    countEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="stats" ref={containerRef}>
      <div className="container">
        <div className="stats-grid reveal">
          <div className="stat">
            <b data-count="18" data-suffix="+">18+</b>
            <span>Years of experience</span>
          </div>
          <div className="stat">
            <b data-count="4200" data-suffix="+">4,200+</b>
            <span>Lives supported</span>
          </div>
          <div className="stat">
            <b data-count="92" data-suffix="%">92%</b>
            <span>Client satisfaction</span>
          </div>
          <div className="stat">
            <b data-count="40" data-suffix="+">40+</b>
            <span>Licensed specialists</span>
          </div>
        </div>
      </div>
    </div>
  );
}
