'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { projects, type Project } from '@/data/projects';

function ProjectCard({ project, i, onOpen }: { project: Project; i: number; onOpen: (p: Project) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const isLarge = project.size === 'large';

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const cardContent = (
    <>
      {/* ── Thumbnail image (if available) ─────────────────────────── */}
      {project.thumbnail && (
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes={isLarge ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
              priority={i < 2}
            />
          </motion.div>
          {/* Dark overlay so text is always readable */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(5,5,10,0.96) 0%, rgba(5,5,10,0.7) 45%, rgba(5,5,10,0.25) 100%)',
            }}
          />
          {/* Accent tint on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `linear-gradient(135deg, ${project.accent}15 0%, transparent 60%)`,
            }}
          />
        </div>
      )}

      {/* ── Fallback: abstract accent bg (no thumbnail) ─────────────── */}
      {!project.thumbnail && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 70% 40%, ${project.accent}12 0%, transparent 70%)`,
          }}
        />
      )}

      {/* ── Animated circuit SVG traces ─────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <motion.path
            d="M 350 0 L 350 80 L 280 80 L 280 150"
            stroke={project.accent}
            strokeWidth="0.6"
            fill="none"
            strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 0 220 L 80 220 L 80 150 L 180 150"
            stroke={project.accent}
            strokeWidth="0.6"
            fill="none"
            strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
          />
          <circle cx="350" cy="80" r="3" fill={project.accent} fillOpacity="0.5" />
          <circle cx="280" cy="150" r="3" fill={project.accent} fillOpacity="0.5" />
          <circle cx="80" cy="150" r="3" fill={project.accent} fillOpacity="0.5" />
        </svg>
      </div>

      {/* ── Top bar: index + category + link icon ───────────────────── */}
      <div className="relative z-10 p-7 flex items-start justify-between">
        <div>
          <span
            className="font-mono text-[10px] tracking-[0.4em]"
            style={{ color: `${project.accent}cc` }}
          >
            {project.index}
          </span>
          <p
            className="font-mono text-[10px] tracking-[0.25em] mt-1"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {project.category}
          </p>
        </div>

        {/* Link / modal icon */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `${project.accent}25`, border: `1px solid ${project.accent}50` }}
        >
          {project.liveUrl
            ? <ExternalLink size={13} color={project.accent} />
            : <ArrowUpRight size={13} color={project.accent} />
          }
        </div>
      </div>

      {/* ── Bottom: title + headline ─────────────────────────────────── */}
      <div className="relative z-10 absolute bottom-0 left-0 right-0 p-7">
        {/* Live badge */}
        {project.liveUrl && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 font-mono text-[10px] tracking-widest"
            style={{
              border: `1px solid ${project.accent}40`,
              background: `${project.accent}12`,
              color: project.accent,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: project.accent }}
            />
            LIVE
          </div>
        )}

        <h3
          className="font-black tracking-tight leading-tight mb-1.5"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#f0f0f5' }}
        >
          {project.title}
        </h3>
        <p className="text-sm text-white/50 font-mono leading-relaxed line-clamp-2">
          {project.headline}
        </p>
      </div>
    </>
  );

  const wrapperClass = `bento-card glass border border-white/[0.06] group cursor-pointer relative overflow-hidden block w-full
    ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`;
  const wrapperStyle = { minHeight: isLarge ? '360px' : '300px' };

  if (project.liveUrl) {
    return (
      <motion.a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        className={wrapperClass}
        style={wrapperStyle}
        onMouseMove={handleMouseMove}
        whileHover={{ scale: 1.05, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
        whileTap={{ scale: 0.98 }}
      >
        {cardContent}
      </motion.a>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={wrapperClass}
      style={wrapperStyle}
      onMouseMove={handleMouseMove}
      onClick={() => onOpen(project)}
      whileHover={{ scale: 1.05, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.98 }}
    >
      {cardContent}
    </motion.div>
  );
}

// ── Modal (for projects WITHOUT a liveUrl) ───────────────────────────
function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-8"
      style={{ background: 'rgba(5,5,10,0.85)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full md:max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-3xl"
        style={{
          background: 'rgba(12,12,18,0.98)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: `0 0 80px ${project.accent}22`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent top bar */}
        <div className="h-[2px] w-full rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${project.accent}, #7b2fff)` }} />

        {/* Thumbnail in modal */}
        {project.thumbnail && (
          <div className="relative w-full h-52 overflow-hidden">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="800px"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(12,12,18,0.98))' }} />
          </div>
        )}

        <div className="p-8 md:p-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="font-mono text-[10px] tracking-[0.4em] block mb-2" style={{ color: project.accent }}>
                {project.category}
              </span>
              <h2 className="font-black tracking-tight leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#f0f0f5' }}>
                {project.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <X size={16} color="rgba(255,255,255,0.6)" />
            </button>
          </div>

          <p className="text-base text-white/60 leading-relaxed mb-10">
            {/* TODO: Replace with final refined project description */}
            {project.description}
          </p>

          <div className="mb-10">
            <p className="font-mono text-[10px] tracking-[0.35em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
              TECHNOLOGIES
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full font-mono text-xs"
                  style={{ border: `1px solid ${project.accent}33`, color: project.accent, background: `${project.accent}0d` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* TODO: Add GitHub link / live demo / screenshots here */}
          <div
            className="p-4 rounded-2xl font-mono text-xs text-center"
            style={{ border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.25)' }}
          >
            [TODO: Add project links, screenshots, or demo embed here]
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────
export default function ProjectsBento() {
  const [selected, setSelected] = useState<Project | null>(null);
  const sectionRef = useRef(null);
  const titleInView = useInView(sectionRef, { once: true });

  return (
    <section ref={sectionRef} className="relative py-36 px-8 md:px-20 overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <p className="font-mono text-[11px] tracking-[0.4em] text-violet/70 mb-3 uppercase">Selected Works</p>
        <h2
          className="font-black tracking-tighter leading-none"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}
        >
          Projects<br />
          <span className="grad-text">&amp; Builds.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} i={i} onOpen={setSelected} />
        ))}
      </div>

      <AnimatePresence>
        {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
