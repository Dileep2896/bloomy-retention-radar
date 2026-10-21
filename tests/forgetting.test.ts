import { describe, it, expect } from 'vitest';
import {
  retrievability,
  initialStability,
  applyEcho,
  nextReviewDate,
  statusOf,
} from '../src/lib/forgetting';
import type { SkillState } from '../src/data/types';
const now = new Date('2026-10-21T15:00:00Z');
const state: SkillState = {
  studentId: 'a',
  skillId: 'evidence',
  masteryScore: 0.9,
  masteredAt: '2026-09-01T15:00:00Z',
  lastReviewedAt: '2026-10-01T15:00:00Z',
  stabilityDays: 4,
  reviews: 0,
  status: 'mastered',
  history: [],
};
describe('forgetting curve', () => {
  it('starts at 1', () => expect(retrievability(4, 0)).toBe(1));
  it('is .9 at S', () => expect(retrievability(4, 4)).toBeCloseTo(0.9, 14));
  it('decreases monotonically', () => {
    let previous = 1;
    for (let t = 1; t < 1000; t++) {
      const r = retrievability(4, t);
      expect(r).toBeLessThan(previous);
      previous = r;
    }
  });
  it('stays in (0,1]', () => {
    for (const t of [0, 1, 1e6]) {
      expect(retrievability(4, t)).toBeGreaterThan(0);
      expect(retrievability(4, t)).toBeLessThanOrEqual(1);
    }
  });
  it('clamps future review elapsed to zero', () => expect(retrievability(4, -4)).toBe(1));
  it.each([0, -1, NaN, Infinity])('rejects invalid stability %s', (s) =>
    expect(() => retrievability(s, 1)).toThrow(),
  );
  it('maps 90% to 4', () => expect(initialStability(0.9)).toBe(4));
  it('maps 100% to 10', () => expect(initialStability(1)).toBe(10));
  it('maps 95% linearly', () => expect(initialStability(0.95)).toBeCloseTo(7));
  it('clamps high scores', () => expect(initialStability(1.1)).toBe(10));
  it.each([0.89, 0, NaN])('rejects unmastered/invalid score %s', (s) =>
    expect(() => initialStability(s)).toThrow(),
  );
  it('uses the exact pass formula', () => {
    const r = retrievability(4, 20);
    expect(applyEcho(state, 3, now).stabilityDays).toBeCloseTo(4 * (1 + 1.6 * (1 - r) * 10 + 0.3));
  });
  it('passes at 2 of 3', () => expect(applyEcho(state, 2, now).status).toBe('mastered'));
  it('grows more at lower R', () =>
    expect(applyEcho(state, 3, now).stabilityDays).toBeGreaterThan(
      applyEcho({ ...state, lastReviewedAt: now.toISOString() }, 3, now).stabilityDays,
    ));
  it('growth shrinks with review count', () =>
    expect(applyEcho({ ...state, reviews: 8 }, 3, now).stabilityDays).toBeLessThan(
      applyEcho(state, 3, now).stabilityDays,
    ));
  it('caps stability at 180', () =>
    expect(applyEcho({ ...state, stabilityDays: 180 }, 3, now).stabilityDays).toBe(180));
  it.each([0, 1])('fails at %s of 3', (correct) => {
    const next = applyEcho(state, correct, now);
    expect(next.status).toBe('relearn');
    expect(next.stabilityDays).toBeCloseTo(1.4);
  });
  it('floors failed stability at 1', () =>
    expect(applyEcho({ ...state, stabilityDays: 1 }, 0, now).stabilityDays).toBe(1));
  it('appends history and does not mutate the input', () => {
    const original = structuredClone(state);
    const next = applyEcho(state, 3, now);
    expect(state).toEqual(original);
    expect(next.reviews).toBe(1);
    expect(next.lastReviewedAt).toBe(now.toISOString());
    expect(next.history).toHaveLength(1);
    expect(next.history[0].beforeR).toBeCloseTo(retrievability(4, 20));
  });
  it.each([-1, 4, 1.5, NaN])('rejects invalid correct count %s', (correct) =>
    expect(() => applyEcho(state, correct, now)).toThrow(),
  );
  it('schedules exactly at .85 target', () => {
    const elapsed = (nextReviewDate(state).getTime() - Date.parse(state.lastReviewedAt)) / 86400000;
    expect(retrievability(4, elapsed)).toBeCloseTo(0.85, 8);
  });
  it.each([
    [1, 'solid'],
    [0.85, 'solid'],
    [0.849, 'fading'],
    [0.7, 'fading'],
    [0.699, 'at_risk'],
  ])('classifies %s', (r, status) => expect(statusOf(Number(r))).toBe(status));
  it('overrides classification for relearn', () => expect(statusOf(1, 'relearn')).toBe('relearn'));
});
