'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HOSPITAL, CONTACT, toTel } from '@/lib/site';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);

    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const closeMenu = () => setMenuOpen(false);

  /* Close the drawer on outside tap, Escape, or when the desktop nav returns. */
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  /* Keep the page behind the open drawer from scrolling. */
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav" ref={navRef}>
      <div className="container nav-inner">
        <Link href="/" className="logo" aria-label={`${HOSPITAL.fullName} home`} onClick={closeMenu}>
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 29V14" />
            <path d="M16 18c-5 0-9-3.5-9-9 5 0 9 3.5 9 9z" />
            <path d="M16 14c0-5 3.5-9 9-9 0 5-3.5 9-9 9z" />
          </svg>
          {HOSPITAL.name}
        </Link>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks" aria-label="Main navigation">
          <Link href="/#about" onClick={closeMenu}>About</Link>
          <Link href="/#programs" onClick={closeMenu}>Programs</Link>
          <Link href="/#journey" onClick={closeMenu}>Journey</Link>
          <Link href="/#branches" onClick={closeMenu}>Branches</Link>
          <Link href="/#team" onClick={closeMenu}>Team</Link>
          <Link href="/#stories" onClick={closeMenu}>Stories</Link>
          <Link href="/#faq" onClick={closeMenu}>FAQ</Link>
          <Link href="/#contact" className="btn btn-primary nav-cta-mobile" onClick={closeMenu}>
            Get Confidential Help
          </Link>
          <a
            href={`tel:${toTel(CONTACT.phones[0])}`}
            className="btn btn-ghost nav-helpline-mobile"
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
            24/7 Helpline: {CONTACT.phones[0]}
          </a>
        </nav>

        <div className="nav-actions">
          {/* Theme toggle */}
          <button
            className="icon-btn"
            id="themeToggle"
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
          >
            {theme === 'dark' ? (
              <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            ) : (
              <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            )}
          </button>

          {/* CTA */}
          <Link href="/#contact" className="btn btn-primary nav-cta-desktop">
            Get Help
          </Link>

          {/* Burger menu for mobile */}
          <button
            className="icon-btn burger"
            id="burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="navLinks"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
