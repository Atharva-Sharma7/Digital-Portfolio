'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 50;
const PRELOAD_COUNT = 10;

interface Props {
  onProgress: (p: number) => void;
}

export default function HeroCanvas({ onProgress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frames = useRef<(ImageBitmap | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrame = useRef(0);
  const targetFrame = useRef(0);
  const rafId = useRef(0);
  const loadedRef = useRef(0);
  const isMobile = useRef(false);

  // ---------- Draw one frame -------------------------------------------
  const draw = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const img = frames.current[idx];
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const ir = img.width / img.height;
    const cr = cw / ch;

    let sw = cw, sh = ch, sx = 0, sy = 0;
    if (cr > ir) {
      sh = cw / ir;
      sy = (ch - sh) / 2;
    } else {
      sw = ch * ir;
      sx = (cw - sw) / 2;
    }

    ctx.fillStyle = '#05050a';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // ---------- Resize handler ------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      isMobile.current = window.innerWidth <= 768;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      draw(currentFrame.current);
    };
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, [draw]);

  // ---------- Frame loader --------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const loadFrame = async (i: number) => {
      if (cancelled || frames.current[i]) return;
      const n = String(i + 1).padStart(4, '0');
      const url = `/sequence/desktop/${n}.webp`;
      try {
        const res = await fetch(url);
        if (!res.ok || cancelled) return;
        const blob = await res.blob();
        const bmp = await createImageBitmap(blob);
        frames.current[i] = bmp;
        loadedRef.current++;
        const pct = Math.round((loadedRef.current / TOTAL_FRAMES) * 100);
        onProgress(pct);
        if (i === 0) draw(0);
      } catch {
        // frame unavailable
      }
    };

    // Eager-load first 10
    const first: Promise<void>[] = [];
    for (let i = 0; i < PRELOAD_COUNT; i++) first.push(loadFrame(i));

    Promise.all(first).then(() => {
      // Idle-batch the rest
      let i = PRELOAD_COUNT;
      const scheduleNext = () => {
        if (cancelled || i >= TOTAL_FRAMES) return;
        const end = Math.min(i + 5, TOTAL_FRAMES);
        const batch: Promise<void>[] = [];
        for (; i < end; i++) batch.push(loadFrame(i));
        Promise.all(batch).then(scheduleNext);
      };
      scheduleNext();
    });

    return () => { cancelled = true; };
  }, [draw, onProgress]);

  // ---------- Scroll → frame scrub ------------------------------------
  useEffect(() => {
    const RAF_MAX_DELTA = 1; // skip frames ≤ 1 apart to avoid jitter

    const tick = () => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const raw = Math.max(0, Math.min(1, -rect.top / scrollable));

        // On mobile skip every 2nd frame
        const maxF = isMobile.current ? Math.floor(TOTAL_FRAMES / 2) - 1 : TOTAL_FRAMES - 1;
        targetFrame.current = Math.round(raw * maxF);
        if (isMobile.current) targetFrame.current *= 2; // map back

        // Smooth lerp between frames
        const diff = targetFrame.current - currentFrame.current;
        if (Math.abs(diff) > RAF_MAX_DELTA) {
          currentFrame.current += Math.sign(diff) * Math.max(1, Math.floor(Math.abs(diff) * 0.3));
          currentFrame.current = Math.max(0, Math.min(TOTAL_FRAMES - 1, currentFrame.current));
        } else {
          currentFrame.current = targetFrame.current;
        }

        draw(currentFrame.current);
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [draw]);

  return (
    <div ref={containerRef} style={{ height: '500vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', position: 'absolute', inset: 0 }}
        />
        {/* Bottom fade into next section */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '35vh',
            background: 'linear-gradient(to bottom, transparent, #05050a)',
            pointerEvents: 'none',
          }}
        />
        {/* Top vignette */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '20vh',
            background: 'linear-gradient(to top, transparent, rgba(5,5,10,0.6))',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
