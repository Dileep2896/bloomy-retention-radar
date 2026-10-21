import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { Check, ArrowRight, BookOpen, PenLine, BadgeCheck, Link2 } from 'lucide-react';
import { RetentionGauge } from '../components/RetentionGauge';
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 24,
        delay: reduced ? 0 : delay,
        duration: reduced ? 0 : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}
export function Count({
  value,
  suffix = '',
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true });
  const [n, setN] = useState(reduced ? value : 0);
  useEffect(() => {
    if (reduced) {
      setN(value);
      return;
    }
    if (!visible) return;
    const a = animate(0, value, { duration: 1.5, onUpdate: setN });
    return () => a.stop();
  }, [visible, reduced, value]);
  return (
    <span ref={ref}>
      {n.toLocaleString('en-US', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
export function FadingChip() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const saturation = useTransform(scrollYProgress, [0, 1], ['saturate(1)', 'saturate(0)']);
  return (
    <div ref={ref} className="fading-chip-stage">
      <div className="chip-orbit orbit-one" />
      <div className="chip-orbit orbit-two" />
      <div className="chip-orbit orbit-three" />
      <motion.div
        className="mastered-chip"
        style={{ filter: reduced ? 'saturate(0)' : saturation }}
      >
        <span className="skill-chip-icon">
          <Check size={21} />
        </span>
        <div>
          <strong>Citing textual evidence</strong>
          <span>RL.7.1 · Mastery check passed</span>
        </div>
        <motion.span className="chip-check" style={{ opacity: reduced ? 0.25 : opacity }}>
          <Check size={13} />
          Mastered
        </motion.span>
      </motion.div>
      <span className="orbit-annotation annotation-top">DAY 01 · I’VE GOT THIS.</span>
      <span className="orbit-annotation annotation-bottom">WEEK 08 · STILL THERE?</span>
      <div className="orbit-dot dot-one" />
      <div className="orbit-dot dot-two" />
      <div className="orbit-dot dot-three" />
    </div>
  );
}
export function LearningPath() {
  const reduced = useReducedMotion();
  const stages = [
    { icon: BookOpen, title: 'Lesson', sub: 'Understand the idea' },
    { icon: PenLine, title: 'Practice', sub: 'Work it with support' },
    { icon: BadgeCheck, title: 'Mastery check', sub: '90% · All on your own' },
  ];
  return (
    <div className="learning-path">
      <svg
        className="learning-connector"
        viewBox="0 0 900 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M100 40H800"
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 1.3 }}
        />
      </svg>
      {stages.map(({ icon: Icon, title, sub }, i) => (
        <motion.div
          className="learning-stage"
          key={title}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: reduced ? 0 : i * 0.3, duration: reduced ? 0 : 0.4 }}
        >
          <span>
            <Icon size={22} />
          </span>
          <h3>{title}</h3>
          <p>{sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
export function ForgettingDiagram() {
  const reduced = useReducedMotion();
  return (
    <div className="forgetting-visual">
      <div className="chart-topline">
        <span>A MEMORY WITHOUT REVIEW</span>
        <span>Retrievability</span>
      </div>
      <svg
        viewBox="0 0 600 260"
        role="img"
        aria-label="Forgetting curve from 100% on Mastery day to 62% at week eight"
      >
        <path className="chart-grid" d="M45 35H570M45 110H570M45 185H570" />
        <text x="0" y="40">
          100%
        </text>
        <text x="8" y="115">
          80%
        </text>
        <text x="8" y="190">
          60%
        </text>
        <motion.path
          className="story-decay-line"
          d="M45 35 C145 58 170 95 245 117 S440 173 565 180"
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 2 }}
        />
        <motion.circle
          r="7"
          className="decay-traveler"
          initial={reduced ? false : { cx: 45, cy: 35 }}
          whileInView={{ cx: [45, 145, 245, 345, 455, 565], cy: [35, 67, 117, 145, 168, 180] }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 2, ease: 'linear' }}
          cx={565}
          cy={180}
        />
        <text x="45" y="235">
          Mastery day
        </text>
        <text x="565" y="235" textAnchor="end">
          Week 8
        </text>
      </svg>
      <div className="prereq-diagram">
        <motion.div
          className="prereq-node fading"
          initial={false}
          whileInView={{ opacity: [0.6, 1] }}
          transition={{ duration: reduced ? 0 : 1 }}
        >
          <span>PREREQUISITE</span>
          <strong>Citing evidence</strong>
          <small>Fading</small>
        </motion.div>
        <motion.div
          className="prereq-edge"
          initial={false}
          whileInView={{ opacity: reduced ? 1 : [0.2, 1, 0.2, 1] }}
          transition={{ duration: reduced ? 0 : 2 }}
        >
          <ArrowRight />
        </motion.div>
        <motion.div
          className="prereq-node blocked"
          initial={reduced ? false : { opacity: 0.4 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 0.8, duration: reduced ? 0 : 0.5 }}
        >
          <span>UP NEXT</span>
          <strong>Analyzing theme</strong>
          <small>Practice blocked</small>
        </motion.div>
      </div>
      <p className="diagram-caption">Practice failed: prerequisite faded, not “not ready”.</p>
    </div>
  );
}
export function BeforeAfter() {
  const reduced = useReducedMotion();
  return (
    <div className="before-after-diagram">
      <div className="before-panel">
        <span className="eyebrow">BEFORE · A NUMBER THAT ONLY GROWS</span>
        <div className="story-roster-row">
          <span className="avatar avatar-0">DG</span>
          <strong>Destiny G.</strong>
          <span>27 mastered</span>
        </div>
        <p>
          She passed the mastery check.
          <br />
          But what’s still with her?
        </p>
        <div className="before-count">
          27<span>mastered, forever?</span>
        </div>
      </div>
      <div className="after-panel">
        <span className="eyebrow">AFTER · A FOUNDATION YOU CAN SEE</span>
        <div className="story-roster-row">
          <span className="avatar avatar-0">DG</span>
          <strong>Destiny G.</strong>
          <span className="after-live">● Live retention</span>
        </div>
        {[
          { label: 'Citing textual evidence', value: 0.63, kind: 'amber' },
          { label: 'Making inferences', value: 0.89, kind: 'green' },
          { label: 'Using context clues', value: 0.96, kind: 'green' },
        ].map((row, i) => (
          <motion.div
            key={row.label}
            className="story-skill-bar"
            initial={reduced ? false : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reduced ? 0 : 0.2 + i * 0.2, duration: reduced ? 0 : 0.4 }}
          >
            <div>
              <span>{row.label}</span>
              <strong>{Math.round(row.value * 100)}%</strong>
            </div>
            <div className="story-bar-track">
              <motion.div
                className={row.kind}
                style={{ transformOrigin: 'left' }}
                initial={reduced ? { scaleX: row.value } : { scaleX: 0 }}
                whileInView={{ scaleX: row.value }}
                viewport={{ once: true }}
                transition={{ delay: reduced ? 0 : 0.4 + i * 0.2, duration: reduced ? 0 : 0.8 }}
              />
            </div>
          </motion.div>
        ))}
        <div className="story-echo-row">
          <span>
            <Link2 size={13} />
            Blocking: Analyzing theme
          </span>
          <span>
            Echo check <ArrowRight size={12} />
          </span>
        </div>
        <svg
          className="sawtooth"
          viewBox="0 0 440 100"
          role="img"
          aria-label="Successful reviews reset memory to 100% and slow the next decay"
        >
          <path d="M10 30H430" className="chart-target" />
          <motion.path
            d="M10 8 Q40 40 75 80 L75 8 Q130 40 175 62 L175 8 Q245 29 295 40 L295 8 Q370 19 430 25"
            className="chart-line"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 3 }}
          />
          <text x="10" y="97">
            Recall. Reset. Remember longer.
          </text>
        </svg>
      </div>
    </div>
  );
}
export function ImpactGauge() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className="impact-gauge">
      <span className="impact-start">
        61%<small>Before the week’s checks</small>
      </span>
      <ArrowRight size={28} />
      <RetentionGauge value={reduced || visible ? 84 : 61} from={reduced ? 84 : 61} />
    </div>
  );
}
