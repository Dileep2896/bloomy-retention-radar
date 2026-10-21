import { motion, useReducedMotion } from 'motion/react';
import type { Snapshot } from '../data/types';
import { retrievability, statusOf } from '../lib/forgetting';
import { DEMO_NOW, elapsedDays } from '../lib/clock';
export function RadarSweep({ snapshot }: { snapshot: Snapshot }) {
  const reduced = useReducedMotion();
  return (
    <svg
      className="radar-svg"
      viewBox="0 0 300 300"
      role="img"
      aria-label="Retention radar: each dot is one student skill; outer dots need attention"
    >
      <defs>
        <radialGradient id="radar-field">
          <stop offset="0%" stopColor="var(--color-green-wash)" />
          <stop offset="100%" stopColor="var(--color-paper)" />
        </radialGradient>
        <linearGradient id="sweep-fill">
          <stop stopColor="var(--color-accent)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-accent)" stopOpacity=".13" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="150" r="132" fill="url(#radar-field)" />
      {[36, 68, 100, 132].map((r) => (
        <circle key={r} cx="150" cy="150" r={r} className="radar-ring" />
      ))}
      <path d="M18 150H282M150 18V282" className="radar-axis" />
      <motion.g
        initial={false}
        animate={{ rotate: reduced ? 35 : 360 }}
        transition={reduced ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '150px 150px' }}
      >
        <path d="M150 150L150 18A132 132 0 0 1 264 84Z" fill="url(#sweep-fill)" />
        <path d="M150 150L264 84" className="radar-sweep-line" />
      </motion.g>
      {snapshot.states.map((s, i) => {
        const R = retrievability(s.stabilityDays, elapsedDays(s.lastReviewedAt, DEMO_NOW));
        const radius = 18 + (1 - R) * 225;
        const angle = i * 2.399963;
        const status = statusOf(R, s.status);
        return (
          <circle
            key={`${s.studentId}-${s.skillId}`}
            cx={150 + Math.cos(angle) * radius}
            cy={150 + Math.sin(angle) * radius}
            r={status === 'solid' ? 3.2 : 4}
            className={`radar-dot ${status}`}
          >
            <title>
              {snapshot.students.find((st) => st.id === s.studentId)?.name} ·{' '}
              {snapshot.skills.find((sk) => sk.id === s.skillId)?.name} · {Math.round(R * 100)}% ·{' '}
              {status.replace('_', ' ')}
            </title>
          </circle>
        );
      })}
      <circle cx="150" cy="150" r="6" className="radar-center" />
      <text x="150" y="10" textAnchor="middle" className="radar-label">
        NEEDS A LITTLE ATTENTION
      </text>
    </svg>
  );
}
