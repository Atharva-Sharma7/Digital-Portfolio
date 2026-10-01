'use client';

import { useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, ArrowUpRight } from 'lucide-react';
import { contact } from '@/data/contact';

const GithubIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

/* ────────────────────────────────────────────────────────────────────
 * Shared helpers
 * ────────────────────────────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const;

function setGlow(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/* ────────────────────────────────────────────────────────────────────
 * Magnetic CTA button
 * ────────────────────────────────────────────────────────────────── */
function MagneticButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) * 0.18;
    const dy = (e.clientY - cy) * 0.18;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);

  const handleLeave = useCallback(() => {
    if (btnRef.current) btnRef.current.style.transform = 'translate(0,0)';
  }, []);

  return (
    <motion.a
      ref={btnRef}
      href={`mailto:${contact.email}`}
      className="bento-card group relative inline-flex items-center gap-3 px-10 py-5 rounded-full font-mono text-sm tracking-[0.2em] overflow-hidden transition-[box-shadow] duration-500"
      style={{
        border: '1px solid rgba(0,240,255,0.2)',
        background: 'rgba(0,240,255,0.03)',
        color: '#00f0ff',
        willChange: 'transform',
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,240,255,0.18)' }}
      whileTap={{ scale: 0.97 }}
    >
      {/* animated border shimmer */}
      <span
        className="absolute inset-[-1px] rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, #00f0ff, #7b2fff, #00f0ff)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 4s linear infinite',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
      <span className="relative z-10">START A CONVERSATION</span>
      <motion.span
        className="relative z-10 text-lg"
        initial={{ x: 0 }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.3 }}
      >
        →
      </motion.span>
    </motion.a>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Contact / social card
 * ────────────────────────────────────────────────────────────────── */
interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  accent: string;
  external?: boolean;
  delay: number;
}

function ContactCard({ icon, label, value, href, accent, external, delay }: CardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="bento-card glass group relative flex items-center gap-5 p-5 rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        border: '1px solid rgba(255,255,255,0.06)',
        willChange: 'transform',
      }}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      onMouseMove={setGlow}
      whileHover={{
        y: -4,
        borderColor: `${accent}44`,
        boxShadow: `0 8px 30px ${accent}18`,
        transition: { duration: 0.3 },
      }}
    >
      {/* Icon */}
      <motion.div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}10`, border: `1px solid ${accent}22` }}
        whileHover={{ rotate: 8, scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        {icon}
      </motion.div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] tracking-[0.3em] mb-1" style={{ color: `${accent}88` }}>
          {label}
        </p>
        <p className="text-sm text-white/50 group-hover:text-white/90 transition-colors duration-300 truncate">
          {value}
        </p>
        {/* Animated underline */}
        <div
          className="h-[1px] mt-2 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
      </div>

      {/* Arrow */}
      <motion.div
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ x: 0 }}
        whileHover={{ x: 3 }}
      >
        <ArrowUpRight size={14} color={accent} />
      </motion.div>
    </motion.a>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Floating particles background (CSS only, no extra canvas)
 * ────────────────────────────────────────────────────────────────── */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Faint grid */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,1) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />
      {/* Volumetric glow — top right */}
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px]"
        style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 65%)' }}
      />
      {/* Volumetric glow — bottom left */}
      <div
        className="absolute -bottom-60 -left-60 w-[600px] h-[600px]"
        style={{ background: 'radial-gradient(circle, rgba(123,47,255,0.05) 0%, transparent 65%)' }}
      />
      {/* Circuit traces SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <motion.path
          d="M 0 150 L 200 150 L 200 300 L 400 300 L 400 100 L 600 100"
          stroke="#00f0ff" strokeWidth="0.8" fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 800 450 L 650 450 L 650 350 L 500 350 L 500 500 L 300 500"
          stroke="#7b2fff" strokeWidth="0.8" fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 0.5, ease: 'easeInOut' }}
        />
        <circle cx="200" cy="150" r="3" fill="#00f0ff" fillOpacity="0.4" />
        <circle cx="400" cy="300" r="3" fill="#00f0ff" fillOpacity="0.4" />
        <circle cx="600" cy="100" r="3" fill="#00f0ff" fillOpacity="0.4" />
        <circle cx="650" cy="450" r="3" fill="#7b2fff" fillOpacity="0.4" />
        <circle cx="500" cy="350" r="3" fill="#7b2fff" fillOpacity="0.4" />
      </svg>
      {/* Floating fragments */}
      {[
        { x: '12%', y: '18%', s: 6, a: '#00f0ff', d: 7 },
        { x: '78%', y: '32%', s: 4, a: '#7b2fff', d: 9 },
        { x: '35%', y: '72%', s: 5, a: '#00f0ff', d: 11 },
        { x: '88%', y: '80%', s: 3, a: '#7b2fff', d: 8 },
        { x: '55%', y: '12%', s: 4, a: '#00f0ff', d: 10 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            left: p.x, top: p.y,
            width: p.s, height: p.s,
            background: p.a,
            opacity: 0.15,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: p.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Main export
 * ────────────────────────────────────────────────────────────────── */
export default function Contact() {
  const headRef = useRef(null);
  const headIn = useInView(headRef, { once: true, margin: '-80px' });

  const cards: Omit<CardProps, 'delay'>[] = [
    {
      icon: <Mail size={18} color="#00f0ff" />,
      label: 'EMAIL',
      value: contact.email,
      href: `mailto:${contact.email}`,
      accent: '#00f0ff',
    },
    {
      icon: <Phone size={18} color="#7b2fff" />,
      label: 'PHONE',
      value: contact.phoneDisplay,
      href: `tel:${contact.phone}`,
      accent: '#7b2fff',
    },
    {
      icon: <GithubIcon size={18} color="#00f0ff" />,
      label: 'GITHUB',
      value: contact.githubHandle,
      href: contact.github,
      accent: '#00f0ff',
      external: true,
    },
    {
      icon: <LinkedinIcon size={18} color="#7b2fff" />,
      label: 'LINKEDIN',
      value: contact.linkedinName,
      href: contact.linkedin,
      accent: '#7b2fff',
      external: true,
    },
    {
      icon: <InstagramIcon size={18} color="#00f0ff" />,
      label: 'INSTAGRAM',
      value: contact.instagramHandle,
      href: contact.instagram,
      accent: '#00f0ff',
      external: true,
    },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <Particles />

      {/* ── HERO BLOCK ─────────────────────────────────────────────── */}
      <div className="relative py-32 md:py-44 px-8 md:px-20 flex flex-col items-center text-center">
        <motion.p
          ref={headRef}
          className="font-mono text-[11px] tracking-[0.45em] uppercase mb-6"
          style={{ color: 'rgba(0,240,255,0.55)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          Initiate Connection
        </motion.p>

        <motion.h2
          className="font-black tracking-tighter leading-[0.92] mb-6"
          style={{ fontSize: 'clamp(2.6rem, 8vw, 7rem)' }}
          initial={{ opacity: 0, y: 40 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.08, ease }}
        >
          <span style={{ color: '#f0f0f5' }}>Let&apos;s build</span>
          <br />
          <span style={{ color: '#f0f0f5' }}>something</span>{' '}
          <span className="grad-text">extraordinary.</span>
        </motion.h2>

        <motion.p
          className="text-sm md:text-base text-white/35 font-mono max-w-lg mb-16 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={headIn ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease }}
        >
          Have an idea, project, collaboration, or just want to talk tech? Let&apos;s connect.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease }}
        >
          <MagneticButton />
        </motion.div>
      </div>

      {/* ── CONTACT CARDS ──────────────────────────────────────────── */}
      <div className="relative px-8 md:px-20 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
          {cards.map((c, i) => (
            <ContactCard key={c.label} {...c} delay={0.08 * i} />
          ))}
        </div>
      </div>

      {/* ── STATUS BAR ─────────────────────────────────────────────── */}
      <div className="relative px-8 md:px-20 py-10 flex flex-col items-center gap-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{
            border: '1px solid rgba(0,240,255,0.18)',
            background: 'rgba(0,240,255,0.04)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00f0ff' }} />
          <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: '#00f0ff' }}>
            AVAILABLE FOR COLLABORATION · 2026
          </span>
        </motion.div>

        <p className="font-mono text-[10px] tracking-[0.35em] text-white/20">
          ELECTRONICS × VLSI × AI × CREATIVE DEVELOPMENT
        </p>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <div
        className="relative px-8 md:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="text-center md:text-left">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/25">
            ATHARVA SHARMA © {new Date().getFullYear()}
          </p>
          <p className="font-mono text-[9px] tracking-[0.25em] text-white/12 mt-1">
            ENGINEER / CREATIVE DEVELOPER
          </p>
        </div>

        <div className="flex items-center gap-6">
          {[
            { label: 'GITHUB', href: contact.github },
            { label: 'LINKEDIN', href: contact.linkedin },
            { label: 'INSTAGRAM', href: contact.instagram },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.25em] text-white/20 hover:text-cyan transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
