'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const timeline = [
  {
    year: 'Present',
    title: 'VLSI Core Member',
    org: 'IOTICS Club · IIIT Nagpur',
    desc: 'Working on digital design projects, VLSI research, and running technical workshops for the college community.',
    accent: '#00f0ff',
  },
  {
    year: 'Past',
    title: 'Management Intern',
    org: 'CodeDuelz',
    desc: 'Managed project operations and coordinated hackathons and tech events, bridging engineering execution with product management.',
    accent: '#7b2fff',
  },
  // TODO: Add more roles, hackathons, internships here
  // {
  //   year: '[YEAR]',
  //   title: '[ROLE]',
  //   org: '[ORGANIZATION]',
  //   desc: '[DESCRIPTION]',
  //   accent: '#00f0ff',
  // },
];

const education = [
  {
    degree: 'B.Tech (Dual Degree) — Electronics & Communication Engineering',
    institution: 'IIIT Nagpur',
    period: '2nd Year · Ongoing',
    accent: '#00f0ff',
  },
  {
    degree: 'BS in Data Science (Diploma)',
    institution: 'IIT Madras',
    period: 'Ongoing',
    accent: '#7b2fff',
  },
];

function TimelineItem({ item, i }: { item: typeof timeline[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-10"
    >
      {/* Line */}
      <div
        className="absolute left-0 top-2 bottom-0 w-[1px]"
        style={{ background: `linear-gradient(to bottom, ${item.accent}60, transparent)` }}
      />
      {/* Dot */}
      <div
        className="absolute left-[-4px] top-2 w-[9px] h-[9px] rounded-full border-2"
        style={{ borderColor: item.accent, background: '#05050a', boxShadow: `0 0 10px ${item.accent}80` }}
      />

      <span
        className="font-mono text-[10px] tracking-[0.3em] block mb-2"
        style={{ color: item.accent }}
      >
        {item.year}
      </span>
      <h3 className="font-bold text-lg text-fg mb-0.5">{item.title}</h3>
      <p className="font-mono text-xs text-white/30 mb-3">{item.org}</p>
      <p className="text-sm text-white/50 leading-relaxed mb-10">{item.desc}</p>
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative py-36 px-8 md:px-20 overflow-hidden">
      {/* Left glow */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,47,255,0.06) 0%, transparent 70%)' }}
      />

      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative">
        {/* Experience column */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <p className="font-mono text-[11px] tracking-[0.4em] text-cyan/60 mb-3 uppercase">Timeline</p>
            <h2
              className="font-black tracking-tighter leading-none"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              Experience.
            </h2>
          </motion.div>
          <div>
            {timeline.map((item, i) => (
              <TimelineItem key={item.title} item={item} i={i} />
            ))}
          {/* Hackathon achievements */}
            <div className="ml-10 space-y-4">
              {[
                {
                  label: 'Mumbai Hacks',
                  detail: 'Invited for Final Round',
                  accent: '#00f0ff',
                  icon: '🏆',
                },
                {
                  label: 'Smart India Hackathon',
                  detail: 'Internal Round Qualified',
                  accent: '#7b2fff',
                  icon: '🚀',
                },
                // TODO: Add more hackathons, certifications, or achievements below
              ].map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{
                    background: `${item.accent}08`,
                    border: `1px solid ${item.accent}22`,
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-sm text-fg">{item.label}</p>
                    <p className="font-mono text-[11px] mt-0.5" style={{ color: item.accent }}>
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Education column */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-16"
          >
            <p className="font-mono text-[11px] tracking-[0.4em] text-violet/60 mb-3 uppercase">Background</p>
            <h2
              className="font-black tracking-tighter leading-none"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
            >
              Education.
            </h2>
          </motion.div>

          <div className="space-y-5">
            {education.map((ed, i) => (
              <motion.div
                key={ed.institution}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.12 }}
                className="bento-card glass p-7"
                style={{ border: `1px solid ${ed.accent}18` }}
              >
                <div
                  className="h-[1px] w-12 mb-5"
                  style={{ background: `linear-gradient(90deg, ${ed.accent}, transparent)` }}
                />
                <h3 className="font-bold text-base text-fg mb-1">{ed.degree}</h3>
                <p className="font-mono text-xs mb-2" style={{ color: ed.accent }}>{ed.institution}</p>
                <p className="font-mono text-[10px] text-white/25">{ed.period}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
