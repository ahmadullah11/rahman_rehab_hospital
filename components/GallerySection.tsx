'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FACILITY_SLIDES } from '@/lib/constants';

const TOTAL = FACILITY_SLIDES.length;
const AUTOPLAY_MS = 4800;

function getPerView() {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function GallerySection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });
  const lastDragEnd = useRef(0);

  const [perView, setPerView] = useState(3);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const maxIndex = Math.max(0, TOTAL - perView);

  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector<HTMLElement>('.facility-card');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    return card.getBoundingClientRect().width + gap;
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const step = getStep();
      if (!track || step <= 0) return;
      const clamped = Math.min(Math.max(index, 0), Math.max(0, TOTAL - perView));
      track.scrollTo({ left: clamped * step, behavior: 'smooth' });
    },
    [getStep, perView]
  );

  /* Track the visible card count so dots and clamping stay accurate. */
  useEffect(() => {
    const sync = () => setPerView(getPerView());
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  /* Re-align the track when the layout changes. */
  useEffect(() => {
    const clamped = Math.min(active, Math.max(0, TOTAL - perView));
    if (clamped !== active) setActive(clamped);
    const id = window.requestAnimationFrame(() => goTo(clamped));
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perView]);

  /* Keep the active dot in sync with manual scrolling, swipes and drags. */
  const handleScroll = () => {
    const track = trackRef.current;
    const step = getStep();
    if (!track || step <= 0) return;
    const index = Math.min(Math.max(Math.round(track.scrollLeft / step), 0), maxIndex);
    setActive(index);
  };

  /* Auto-play, paused on hover/focus and while the lightbox is open. */
  useEffect(() => {
    if (hovered || lightbox !== null || maxIndex === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      goTo(active >= maxIndex ? 0 : active + 1);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [active, goTo, hovered, lightbox, maxIndex]);

  /* Pointer drag for mouse users; touch devices scroll natively. */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = { active: true, startX: e.clientX, startLeft: track.scrollLeft, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    const delta = e.clientX - drag.current.startX;

    if (!drag.current.moved) {
      if (Math.abs(delta) < 6) return;
      drag.current.moved = true;
      track.classList.add('is-dragging');
    }

    track.scrollLeft = drag.current.startLeft - delta;
  };

  const onPointerUp = () => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;

    drag.current.active = false;
    track.classList.remove('is-dragging');

    if (drag.current.moved) {
      lastDragEnd.current = Date.now();
      const step = getStep();
      if (step > 0) goTo(Math.round(track.scrollLeft / step));
    }
  };

  const openSlide = (index: number) => {
    if (Date.now() - lastDragEnd.current < 300) return;
    setLightbox(index);
  };

  /* Lightbox keyboard controls + background scroll lock. */
  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % TOTAL));
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + TOTAL) % TOTAL));
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [lightbox]);

  const slide = lightbox === null ? null : FACILITY_SLIDES[lightbox];

  return (
    <section id="facility" className="facility">
      <div className="container">
        <header className="facility-head">
          <span className="facility-eyebrow">Restorative Spaces</span>
          <h2>A Sanctuary for Healing &amp; Mental Wellness</h2>
          <p>
            Designed specifically for calm, dignity and confidential clinical recovery. Explore the
            rooms, units and grounds that make up our Peshawar and Swat campuses.
          </p>
        </header>

        <div className="facility-carousel">
          <div
            className="facility-track"
            ref={trackRef}
            onScroll={handleScroll}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setHovered(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false);
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {FACILITY_SLIDES.map((item, index) => (
              <article
                key={item.id}
                className="facility-card"
                role="button"
                tabIndex={0}
                aria-label={`View ${item.title} in full`}
                onClick={() => openSlide(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openSlide(index);
                  }
                }}
              >
                <img
                  className="facility-card-img"
                  src={item.imageUrl}
                  alt={item.alt}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  draggable={false}
                />
                <span className="facility-card-shade" aria-hidden="true" />
                <div className="facility-card-body">
                  <span className="facility-tag">{item.tag}</span>
                  <h3 className="facility-card-title">{item.title}</h3>
                  <p className="facility-card-desc">{item.subtitle}</p>
                  <span className="facility-card-link" aria-hidden="true">
                    View Space
                    <Chevron />
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="facility-controls">
            <button
              type="button"
              className="facility-arrow"
              aria-label="Previous facilities"
              onClick={() => goTo(active <= 0 ? maxIndex : active - 1)}
            >
              <ArrowLeft />
            </button>

            <div className="facility-dots">
              {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`facility-dot${active === i ? ' is-active' : ''}`}
                  aria-label={`Go to space group ${i + 1}`}
                  aria-current={active === i ? 'true' : undefined}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>

            <span className="facility-count" aria-hidden="true">
              {String(active + 1).padStart(2, '0')}
              <em>/{String(maxIndex + 1).padStart(2, '0')}</em>
            </span>

            <button
              type="button"
              className="facility-arrow"
              aria-label="Next facilities"
              onClick={() => goTo(active >= maxIndex ? 0 : active + 1)}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      {slide && (
        <div
          className="facility-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${slide.title} preview`}
          onClick={() => setLightbox(null)}
        >
          <div className="facility-lightbox-panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="facility-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close preview"
              autoFocus
            >
              ✕
            </button>

            <div className="facility-lightbox-media">
              <img src={slide.imageUrl} alt={slide.alt} />
            </div>

            <div className="facility-lightbox-body">
              <span className="facility-tag">{slide.tag}</span>
              <h3>{slide.title}</h3>
              <p className="facility-lightbox-desc">{slide.description}</p>

              <div className="facility-lightbox-highlights">
                <h4>Clinical highlights</h4>
                <ul>
                  {slide.highlights.map((highlight) => (
                    <li key={highlight}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="facility-lightbox-actions">
                <Link href="/#contact" className="btn btn-primary btn-sm" onClick={() => setLightbox(null)}>
                  Book a Visit
                </Link>
                <div className="facility-lightbox-nav">
                  <button
                    type="button"
                    aria-label="Previous facility"
                    onClick={() => setLightbox((i) => (i === null ? i : (i - 1 + TOTAL) % TOTAL))}
                  >
                    <ArrowLeft />
                  </button>
                  <span>
                    {String((lightbox ?? 0) + 1).padStart(2, '0')}
                    <em>/{String(TOTAL).padStart(2, '0')}</em>
                  </span>
                  <button
                    type="button"
                    aria-label="Next facility"
                    onClick={() => setLightbox((i) => (i === null ? i : (i + 1) % TOTAL))}
                  >
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
