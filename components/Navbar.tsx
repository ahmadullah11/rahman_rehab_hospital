'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HOSPITAL } from '@/lib/site';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
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
          <Link href="/products" onClick={closeMenu}>Store</Link>
          <Link href="/#faq" onClick={closeMenu}>FAQ</Link>
          <Link href="/#contact" className="btn btn-primary nav-cta-mobile" onClick={closeMenu}>
            Get Confidential Help
          </Link>
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
