'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroCanvas from '@/components/canvas/HeroCanvas';
import HeroOverlay from '@/components/ui/HeroOverlay';
import Navbar from '@/components/ui/Navbar';
import Skills from '@/components/ui/Skills';
import ProjectsBento from '@/components/ui/ProjectsBento';
import Experience from '@/components/ui/Experience';
import Contact from '@/components/ui/Contact';
import LenisProvider from '@/components/SmoothScrolling';

const DroneCursor = dynamic(() => import('@/components/canvas/DroneCursor'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <LenisProvider>
      {/* 3D Drone cursor — desktop only, pointer-events:none */}
      {!isMobile && <DroneCursor />}

      {/* Fixed nav */}
      <Navbar />

      {/* ── HERO: 500vh scroll scrub ───────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        <HeroCanvas onProgress={setLoadProgress} />
        <HeroOverlay progress={loadProgress} />
      </div>

      {/* ── Content sections ─────────────────────────────────────── */}
      {/* position:relative + zIndex:10 renders above the fixed bg.
          Background is intentionally semi-transparent so the last
          hero frame bleeds through subtly. */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Top shadow/blend into hero */}
        <div
          style={{
            height: '120px',
            marginBottom: '-120px',
            position: 'relative',
            zIndex: 10,
            background: 'linear-gradient(to bottom, transparent, rgba(5,5,10,0.92))',
            pointerEvents: 'none',
          }}
        />

        {/* Each section has its own bg so the last-frame texture
            peeks through the gaps between sections */}
        <section
          id="stack"
          style={{ position: 'relative', zIndex: 10, background: 'rgba(5,5,10,0.88)' }}
        >
          <Skills />
        </section>
        <section
          id="works"
          style={{ position: 'relative', zIndex: 10, background: 'rgba(5,5,10,0.88)' }}
        >
          <ProjectsBento />
        </section>
        <section
          id="experience"
          style={{ position: 'relative', zIndex: 10, background: 'rgba(5,5,10,0.88)' }}
        >
          <Experience />
        </section>
        <section
          id="contact"
          style={{ position: 'relative', zIndex: 10, background: 'rgba(5,5,10,0.88)' }}
        >
          <Contact />
        </section>
      </div>
    </LenisProvider>
  );
}
