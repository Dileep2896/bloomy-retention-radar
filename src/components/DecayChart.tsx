import { motion, useReducedMotion } from 'motion/react';
import type { SkillState } from '../data/types';
import { retrievability } from '../lib/forgetting';
import { DEMO_NOW, DAY } from '../lib/clock';
export function DecayChart({ state }: { state: SkillState }) {
  const reduced = useReducedMotion();
  const start = Date.parse(state.masteredAt),
    end = DEMO_NOW.getTime() + 14 * DAY,
    span = Math.max(DAY, end - start);
  const reviews = state.history
    .filter((h) => Date.parse(h.at) >= start)
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  let last = start,
    stability = reviews[0]?.stabilityBefore ?? state.stabilityDays;
  const points: string[] = [];
  const point = (t: number, r: number) => `${12 + ((t - start) / span) * 376},${12 + (1 - r) * 85}`;
  points.push(`M${point(start, 1)}`);
  for (const review of [
    ...reviews,
    { at: new Date(end).toISOString(), stabilityAfter: state.stabilityDays },
  ]) {
    const t = Date.parse(review.at);
    for (let day = last + DAY; day < t; day += DAY)
      points.push(`L${point(day, retrievability(stability, (day - last) / DAY))}`);
    points.push(`L${point(t, retrievability(stability, (t - last) / DAY))}`);
    if (t < end) points.push(`L${point(t, 1)}`);
    last = t;
    stability = review.stabilityAfter;
  }
  return (
    <svg
      viewBox="0 0 400 118"
      role="img"
      aria-label={`Retention history for ${state.skillId}`}
      className="decay-chart"
    >
      <path d="M12 29H388" className="chart-target" />
      <text x="385" y="25" textAnchor="end">
        85% review target
      </text>
      <motion.path
        d={points.join(' ')}
        className="chart-line"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduced ? 0 : 1.4 }}
      />
      <text x="12" y="113">
        Mastered
      </text>
      <text x="388" y="113" textAnchor="end">
        Next 14 days →
      </text>
    </svg>
  );
}
