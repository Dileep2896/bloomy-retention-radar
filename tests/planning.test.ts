import { describe, it, expect } from 'vitest';
import { prereqsOf, blockingSkills, isDAG } from '../src/lib/graph';
import { buildQueue, priority } from '../src/lib/queue';
import { buildGroups } from '../src/lib/groups';
import { classRetention } from '../src/lib/metrics';
import { applyEcho, initialStability } from '../src/lib/forgetting';
import { DEMO_NOW } from '../src/lib/clock';
import { skills } from '../src/seed/skills';
import { createSeed } from '../src/seed/history';
import { echoOutcomes } from '../src/seed/echoOutcomes';
import type { Skill, SkillState, ReviewItem } from '../src/data/types';
const graph: Skill[] = ['a', 'b', 'c', 'd'].map((id, i) => ({
  id,
  name: id,
  code: 'RL.7.1',
  domain: 'LIT',
  domainWeight: 1,
  prerequisites: i ? [String.fromCharCode(96 + i)] : [],
}));
const base: SkillState = {
  studentId: 's',
  skillId: 'a',
  masteryScore: 0.9,
  masteredAt: '2026-09-01T15:00:00Z',
  lastReviewedAt: '2026-09-01T15:00:00Z',
  stabilityDays: 4,
  reviews: 0,
  status: 'mastered',
  history: [],
};
function item(studentId: string, skillId = 'a', R = 0.6): ReviewItem {
  return {
    state: { ...base, studentId, skillId },
    skill: graph.find((s) => s.id === skillId)!,
    R,
    status: 'at_risk',
    blockingCount: 0,
    blockingFor: [],
    priority: 1 - R,
  };
}
describe('prerequisite graph', () => {
  it('finds direct prerequisites', () => expect(prereqsOf('d', graph, 1)).toEqual(['c']));
  it('stops at depth 2', () => expect(prereqsOf('d', graph, 2)).toEqual(['c', 'b']));
  it('excludes another student’s work', () =>
    expect(
      blockingSkills('other', graph, [{ studentId: 's', skillId: 'c', stage: 'Practice' }]),
    ).toEqual([]));
  it('finds current prerequisite blockers', () =>
    expect(
      blockingSkills('s', graph, [{ studentId: 's', skillId: 'c', stage: 'Lesson' }]),
    ).toEqual(['b', 'a']));
  it('filters to mastered states when supplied', () =>
    expect(
      blockingSkills('s', graph, [{ studentId: 's', skillId: 'c', stage: 'Practice' }], [base]),
    ).toEqual(['a']));
  it('handles cycles without recursion failure', () =>
    expect(prereqsOf('a', [{ ...graph[0], prerequisites: ['b'] }, graph[1]], 8)).toEqual(['b']));
  it('detects a cycle', () =>
    expect(isDAG([{ ...graph[0], prerequisites: ['b'] }, graph[1]])).toBe(false));
  it('seed is a DAG', () => expect(isDAG(skills)).toBe(true));
});
describe('queue and grouping', () => {
  it('weights blocking items above equal R', () =>
    expect(priority({ ...item('s'), blockingCount: 1 })).toBeGreaterThan(priority(item('s'))));
  it('weights the domain', () =>
    expect(priority({ ...item('s'), skill: { ...graph[0], domainWeight: 2 } })).toBeCloseTo(0.8));
  it('breaks priority ties by older review', () => {
    const states = [
      { ...base, studentId: 'new', stabilityDays: 8, lastReviewedAt: '2026-10-01T15:00:00Z' },
      { ...base, studentId: 'old', stabilityDays: 16, lastReviewedAt: '2026-09-11T15:00:00Z' },
    ];
    expect(buildQueue(states, graph, [], DEMO_NOW)[0].state.studentId).toBe('old');
  });
  it('ignores solid and relearn states', () =>
    expect(
      buildQueue(
        [
          { ...base, lastReviewedAt: DEMO_NOW.toISOString() },
          { ...base, status: 'relearn' },
        ],
        graph,
        [],
        DEMO_NOW,
      ),
    ).toHaveLength(0));
  it('only marks mastered prerequisites blocking', () => {
    const q = buildQueue(
      [base],
      graph,
      [{ studentId: 's', skillId: 'c', stage: 'Practice' }],
      DEMO_NOW,
    );
    expect(q[0].blockingCount).toBe(1);
    expect(q[0].blockingFor).toEqual(['c']);
  });
  it('moves singletons into individual checks', () =>
    expect(buildGroups([item('s')], { maxSize: 6 })).toMatchObject({
      groups: [],
      individuals: [item('s')],
    }));
  it('splits groups into max six lowest R first', () => {
    const q = Array.from({ length: 8 }, (_, i) => item(String(i), 'a', 0.6 - i * 0.02));
    const result = buildGroups(q, { maxSize: 6 });
    expect(result.groups.map((g) => g.items.length)).toEqual([6, 2]);
    expect(result.groups[0].items[0].R).toBeCloseTo(0.46);
  });
  it('orders groups by summed priority', () => {
    const result = buildGroups(
      [item('a', 'a', 0.6), item('b', 'a', 0.6), item('c', 'b', 0.2), item('d', 'b', 0.2)],
      { maxSize: 6 },
    );
    expect(result.groups[0].skill.id).toBe('b');
  });
  it('rejects an invalid max size', () => expect(() => buildGroups([], { maxSize: 0 })).toThrow());
});
describe('seed retention', () => {
  it('is deterministic', () => expect(createSeed()).toEqual(createSeed()));
  it('starts between 58 and 64 percent', () => {
    const rate = classRetention(createSeed().states, DEMO_NOW);
    expect(rate).toBeGreaterThanOrEqual(0.58);
    expect(rate).toBeLessThanOrEqual(0.64);
  });
  it('finishes between 80 and 88 percent after scripted checks', () => {
    let states = createSeed().states;
    for (const outcome of echoOutcomes) {
      states = states.map((s) =>
        s.studentId === outcome.studentId && s.skillId === outcome.skillId
          ? applyEcho(s, outcome.correct, DEMO_NOW)
          : s,
      );
    }
    const rate = classRetention(states, DEMO_NOW);
    expect(rate).toBeGreaterThanOrEqual(0.8);
    expect(rate).toBeLessThanOrEqual(0.88);
  });
  it('excludes relearn from the denominator', () =>
    expect(
      classRetention(
        [
          { ...base, status: 'relearn' },
          { ...base, lastReviewedAt: DEMO_NOW.toISOString() },
        ],
        DEMO_NOW,
      ),
    ).toBe(1));
  it('returns zero for an empty class', () => expect(classRetention([], DEMO_NOW)).toBe(0));
  it('has 24 unique students and at least 28 skills', () => {
    expect(createSeed().students).toHaveLength(24);
    expect(new Set(createSeed().students.map((s) => s.id)).size).toBe(24);
    expect(skills.length).toBeGreaterThanOrEqual(28);
  });
});
it('seed histories replay through the exact Echo model', () => {
  for (const state of createSeed().states) {
    let replay: SkillState = {
      ...state,
      lastReviewedAt: state.masteredAt,
      stabilityDays: initialStability(state.masteryScore),
      reviews: 0,
      status: 'mastered',
      history: [],
    };
    for (const review of state.history) {
      replay = applyEcho(replay, review.correct, new Date(review.at));
      expect(review.stabilityAfter).toBeCloseTo(replay.stabilityDays, 7);
    }
    expect(state.reviews).toBe(state.history.length);
    expect(state.stabilityDays).toBeCloseTo(replay.stabilityDays, 7);
  }
});
it('current learning does not overlap mastered skills', () => {
  const seed = createSeed();
  for (const p of seed.inProgress)
    expect(
      seed.states.some(
        (s) => s.studentId === p.studentId && s.skillId === p.skillId && s.status === 'mastered',
      ),
    ).toBe(false);
});
it('the evidence group leads with six students and four blockers', () => {
  const seed = createSeed();
  const { groups } = buildGroups(buildQueue(seed.states, seed.skills, seed.inProgress, DEMO_NOW), {
    maxSize: 6,
  });
  expect(groups[0].skill.id).toBe('evidence');
  expect(groups[0].items).toHaveLength(6);
  expect(groups[0].items.filter((i) => i.blockingCount > 0)).toHaveLength(4);
});
