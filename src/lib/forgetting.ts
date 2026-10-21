import type { SkillState, RetentionStatus } from '../data/types';
import { DAY, elapsedDays } from './clock';
export function retrievability(stabilityDays: number, elapsed: number): number {
  if (!Number.isFinite(stabilityDays) || stabilityDays <= 0 || !Number.isFinite(elapsed))
    throw new RangeError('Stability must be positive and elapsed days must be finite.');
  return 1 / (1 + Math.max(0, elapsed) / (9 * stabilityDays));
}
export function initialStability(masteryScore: number): number {
  if (!Number.isFinite(masteryScore) || masteryScore < 0.9)
    throw new RangeError('A mastery-check pass requires at least 90%.');
  return masteryScore >= 1 ? 10 : 4 + (masteryScore - 0.9) * 60;
}
export function applyEcho(state: SkillState, correct: number, now: Date): SkillState {
  if (!Number.isInteger(correct) || correct < 0 || correct > 3)
    throw new RangeError('Echo checks have exactly three questions.');
  if (!Number.isFinite(now.getTime()) || now.getTime() < Date.parse(state.lastReviewedAt))
    throw new RangeError('An Echo must follow the last review.');
  const R = retrievability(state.stabilityDays, elapsedDays(state.lastReviewedAt, now));
  const stabilityDays =
    correct >= 2
      ? Math.min(
          180,
          state.stabilityDays * (1 + 1.6 * Math.exp(-0.15 * state.reviews) * (1 - R) * 10 + 0.3),
        )
      : Math.max(1, state.stabilityDays * 0.35);
  return {
    ...state,
    stabilityDays,
    status: correct >= 2 ? 'mastered' : 'relearn',
    lastReviewedAt: now.toISOString(),
    reviews: state.reviews + 1,
    history: [
      ...state.history.map((h) => ({ ...h })),
      {
        at: now.toISOString(),
        correct,
        beforeR: R,
        stabilityBefore: state.stabilityDays,
        stabilityAfter: stabilityDays,
      },
    ],
  };
}
export function nextReviewDate(state: SkillState): Date {
  return new Date(
    Date.parse(state.lastReviewedAt) + state.stabilityDays * 9 * (1 / 0.85 - 1) * DAY,
  );
}
export function statusOf(R: number, status?: SkillState['status']): RetentionStatus {
  return status === 'relearn' ? 'relearn' : R >= 0.85 ? 'solid' : R >= 0.7 ? 'fading' : 'at_risk';
}
