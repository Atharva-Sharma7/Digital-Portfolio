'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contact } from '@/data/contact';

const NAV_LINKS = [
  { label: 'Stack', href: '#stack' },
  { label: 'Works', href: '#works' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[50] flex items-center justify-between px-8 md:px-14 py-5 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(5,5,10,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div
            className="w-7 h-7 rounded-sm flex items-center justify-center font-mono font-bold text-[11px] transition-all duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #00f0ff22, #7b2fff22)',
              border: '1px solid rgba(0,240,255,0.25)',
              color: '#00f0ff',
              boxShadow: '0 0 12px rgba(0,240,255,0.15)',
            }}
          >
            AS
          </div>
          <span className="font-mono text-xs tracking-widest text-white/60 hidden sm:block">
            ATHARVA SHARMA
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-mono text-[11px] tracking-[0.25em] transition-colors duration-300"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#00f0ff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
            >
              {label.toUpperCase()}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`mailto:${contact.email}`} // TODO: real email
            className="font-mono text-[11px] tracking-widest px-5 py-2 rounded-full transition-all duration-300"
            style={{
              border: '1px solid rgba(0,240,255,0.25)',
              color: '#00f0ff',
              background: 'rgba(0,240,255,0.04)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,240,255,0.1)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(0,240,255,0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,240,255,0.04)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}
          >
            GET IN TOUCH
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <motion.span
            className="block w-5 h-[1px] bg-white/60"
            animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block w-5 h-[1px] bg-white/60"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="block w-5 h-[1px] bg-white/60"
            animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[49] flex flex-col items-center justify-center gap-10"
            style={{ background: 'rgba(5,5,10,0.97)', backdropFilter: 'blur(30px)' }}
          >
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="font-black tracking-tight"
                style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', color: 'rgba(255,255,255,0.85)' }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
