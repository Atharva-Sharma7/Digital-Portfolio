'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const skills = [
  {
    category: 'HARDWARE / SILICON',
    accent: '#00f0ff',
    items: ['Verilog / SystemVerilog', 'VLSI Design', 'RISC-V', 'Embedded C', 'C++', 'PCB Design'],
  },
  {
    category: 'SOFTWARE / WEB',
    accent: '#7b2fff',
    items: ['Python', 'Node.js', 'React / Next.js', 'TypeScript', 'REST APIs'],
  },
  {
    category: 'DATA / AI',
    accent: '#00f0ff',
    items: ['Machine Learning', 'Computer Vision', 'MySQL / DBMS', 'Data Analysis'],
  },
  {
    category: 'TOOLING',
    accent: '#7b2fff',
    items: ['Git / GitHub', 'Linux', 'Cloud AI Tooling', 'Flight Controllers'],
  },
];

const ticker = [
  'VERILOG', 'VLSI', 'RISC-V', 'EMBEDDED C', 'PYTHON', 'NEXT.JS', 'MACHINE LEARNING', 'DRONE SYSTEMS',
  'MYSQL', 'REACT', 'C++', 'CLOUD AI', 'PCB DESIGN', 'LINUX', 'NODE.JS', 'SYSTEM DESIGN',
];

function Card({ group, i }: { group: typeof skills[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Mouse glow
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bento-card glass p-7 border border-white/[0.06]"
      style={{ minHeight: '220px' }}
    >
      <p
        className="font-mono text-[10px] tracking-[0.35em] mb-5"
        style={{ color: group.accent }}
      >
        {group.category}
      </p>
      <ul className="flex flex-wrap gap-2">
        {group.items.map((item) => (
          <li
            key={item}
            className="px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300"
            style={{
              border: `1px solid ${group.accent}22`,
              color: 'rgba(240,240,245,0.75)',
              background: `${group.accent}08`,
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section className="relative py-36 overflow-hidden">
      {/* bg grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative px-8 md:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.4em] text-cyan/60 mb-3 uppercase">Capabilities</p>
            <h2
              className="font-black tracking-tighter leading-none"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
            >
              Core<br />
              <span className="grad-text">Stack.</span>
            </h2>
          </div>
          <p className="text-sm text-white/40 max-w-xs font-mono leading-relaxed">
            Comfortable scaling from bare-metal silicon constraints to cloud-native full-stack systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {skills.map((g, i) => <Card key={g.category} group={g} i={i} />)}
        </div>
      </div>

      {/* Ticker */}
      <div className="mt-24 overflow-hidden border-t border-b border-white/[0.05] py-4">
        <div className="ticker-track">
          {[...ticker, ...ticker].map((t, i) => (
            <span
              key={i}
              className="font-mono text-xs tracking-[0.3em] mr-12"
              style={{ color: i % 4 === 0 ? '#00f0ff' : 'rgba(255,255,255,0.2)' }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
