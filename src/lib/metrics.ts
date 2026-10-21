import type { SkillState, ReviewItem, EchoOutcome } from '../data/types';
import { retrievability, applyEcho } from './forgetting';
import { elapsedDays } from './clock';
export function classRetention(states: SkillState[], now: Date): number {
  const mastered = states.filter((s) => s.status !== 'relearn');
  return mastered.length
    ? mastered.filter(
        (s) => retrievability(s.stabilityDays, elapsedDays(s.lastReviewedAt, now)) >= 0.8,
      ).length / mastered.length
    : 0;
}
export function counts(queue: ReviewItem[]) {
  return {
    fading: new Set(queue.map((i) => i.skill.id)).size,
    atRisk: queue.filter((i) => i.status === 'at_risk').length,
    blocking: new Set(queue.filter((i) => i.blockingCount > 0).map((i) => i.skill.id)).size,
  };
}
export function projectedRetention(
  states: SkillState[],
  outcomes: EchoOutcome[],
  now: Date,
): number {
  return classRetention(
    states.map((s) => {
      const o = outcomes.find((o) => o.skillId === s.skillId && o.studentId === s.studentId);
      return o ? applyEcho(s, o.correct, now) : s;
    }),
    now,
  );
}
