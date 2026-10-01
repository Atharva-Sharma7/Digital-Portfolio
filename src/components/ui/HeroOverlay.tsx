'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface Props { progress: number }

const SECTIONS = [
  { index: '01', heading: 'Atharva\nSharma.', sub: 'Electronics Engineer  ·  Creative Developer' },
  { index: '02', heading: 'I design silicon,\nswarms & software.', sub: 'From bare-metal Verilog to full-stack web' },
  { index: '03', heading: 'Bridging hardware\nand intelligence.', sub: 'IIIT Nagpur ECE  ·  IIT Madras Data Science' },
  { index: '04', heading: "Let's build\nsomething.", sub: 'Scroll to explore →' },
];

export default function HeroOverlay({ progress }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const [sectionIdx, setSectionIdx] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  // map scroll → section
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setSectionIdx(Math.min(3, Math.floor(v * 4)));
    });
    return unsub;
  }, [scrollYProgress]);

  useEffect(() => {
    if (progress >= 20) setTimeout(() => setShowLoader(false), 600);
  }, [progress]);

  const progressBarH = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const currentSection = SECTIONS[sectionIdx];

  return (
    <>
      {/* ── Loader ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ background: '#05050a' }}
          >
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,240,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.4) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
            <motion.p
              className="font-mono text-xs tracking-[0.4em] text-cyan mb-6 uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Initializing
            </motion.p>
            <div className="w-56 h-[1px] bg-white/10 overflow-hidden">
              <motion.div
                className="h-full"
                style={{ background: 'linear-gradient(90deg,#00f0ff,#7b2fff)', width: `${progress * 5}%` }}
                animate={{ width: `${progress * 5}%` }}
                transition={{ ease: 'linear', duration: 0.1 }}
              />
            </div>
            <motion.p
              className="font-mono text-[10px] tracking-widest text-muted mt-3"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {progress}%
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero overlay container (matches HeroCanvas 500vh) ─────── */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '500vh',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        {/* Sticky panel */}
        <div style={{ position: 'sticky', top: 0, height: '100vh' }}>

          {/* ── Left progress rail ──────────────────────────────────── */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 z-30">
            <span className="font-mono text-[10px] tracking-widest text-white/30">01</span>
            <div className="relative h-28 w-[1px] bg-white/10">
              <motion.div
                className="absolute top-0 left-0 w-full"
                style={{ height: progressBarH, background: 'linear-gradient(to bottom, #00f0ff, #7b2fff)' }}
              />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-white/30">04</span>
          </div>

          {/* ── Section counter (bottom right) ──────────────────────── */}
          <motion.div
            className="absolute bottom-8 right-8 hidden md:flex items-center gap-1 z-30"
            key={sectionIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <span className="font-mono text-xs text-cyan">0{sectionIdx + 1}</span>
            <span className="font-mono text-xs text-white/20"> / 04</span>
          </motion.div>

          {/* ── Cinematic text ──────────────────────────────────────── */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 z-25">
            <AnimatePresence mode="wait">
              <motion.div
                key={sectionIdx}
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -40, filter: 'blur(8px)' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Section index */}
                <motion.span
                  className="font-mono text-[11px] tracking-[0.35em] text-cyan/70 block mb-4"
                >
                  {currentSection.index}
                </motion.span>

                {/* Main heading */}
                <h1
                  className="font-sans font-black tracking-tighter leading-[0.92] mb-6"
                  style={{
                    fontSize: 'clamp(2.8rem, 8vw, 7rem)',
                    color: '#f0f0f5',
                    textShadow: '0 0 80px rgba(0,240,255,0.08)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {currentSection.heading}
                </h1>

                {/* Sub */}
                <p className="font-mono text-sm text-white/50 tracking-wide">
                  {currentSection.sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Scroll hint (only first section) ───────────────────── */}
          <AnimatePresence>
            {sectionIdx === 0 && !showLoader && (
              <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1 }}
              >
                <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase">Scroll</span>
                <motion.div
                  className="w-[1px] h-8"
                  style={{ background: 'linear-gradient(to bottom, #00f0ff, transparent)' }}
                  animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}
