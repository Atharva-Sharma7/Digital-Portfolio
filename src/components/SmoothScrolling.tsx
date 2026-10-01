'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

// Singleton lenis for the page – avoids double-wrapping issues
let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      wheelMultiplier: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
