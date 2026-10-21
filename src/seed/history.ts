import type { Snapshot, SkillState, InProgress } from '../data/types';
import { skills } from './skills';
import { students } from './students';
import { DEMO_NOW, DAY } from '../lib/clock';
import { initialStability, applyEcho } from '../lib/forgetting';
function random(seed = 20261021) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
export function createSeed(): Snapshot {
  const rand = random();
  const states: SkillState[] = [];
  const inProgress: InProgress[] = [];
  const add = (studentIndex: number, skillId: string, retained: boolean) => {
    const score = 0.9 + Math.floor(rand() * 11) / 100;
    const masteredAt = new Date(
      Date.UTC(2026, 7, 25) + Math.floor(rand() * 54) * DAY,
    ).toISOString();
    const stabilityDays = retained ? 18 + Math.floor(rand() * 15) : initialStability(score);
    const elapsed = retained
      ? 3 + Math.floor(rand() * 5)
      : Math.ceil(stabilityDays * (2.5 + rand() * 3));
    const state: SkillState = {
      studentId: students[studentIndex].id,
      skillId,
      masteryScore: score,
      masteredAt,
      stabilityDays,
      lastReviewedAt: new Date(DEMO_NOW.getTime() - elapsed * DAY).toISOString(),
      reviews: 0,
      status: 'mastered',
      history: [],
    };
    // The mastery check always predates subsequent reviews, and all mastery passes are Aug 25–Oct 17.
    if (Date.parse(state.masteredAt) > Date.parse(state.lastReviewedAt))
      state.masteredAt = state.lastReviewedAt;
    if (retained) {
      // Generate a genuine successful review through the same model used by the UI.
      const reviewAt = new Date(state.lastReviewedAt);
      state.masteredAt = new Date(
        Math.max(Date.UTC(2026, 7, 25), reviewAt.getTime() - (7 + Math.floor(rand() * 14)) * DAY),
      ).toISOString();
      states.push(
        applyEcho(
          { ...state, stabilityDays: initialStability(score), lastReviewedAt: state.masteredAt },
          3,
          reviewAt,
        ),
      );
    } else {
      state.masteredAt = state.lastReviewedAt;
      states.push(state);
    }
  };
  const faded: [string, number, number][] = [
    ['evidence', 6, 0],
    ['inference', 6, 6],
    ['context', 6, 12],
    ['punctuation', 3, 18],
    ['mainidea', 2, 21],
    ['argument', 1, 23],
    ['grammar', 1, 3],
    ['compare', 1, 8],
    ['writing', 1, 16],
  ];
  for (const [id, count, start] of faded)
    for (let i = 0; i < count; i++) add((start + i) % 24, id, false);
  // A frequently reviewed prerequisite: Destiny's next successful Echo schedules ~19 days out.
  let destiny: SkillState = {
    ...states[0],
    masteryScore: 0.9,
    stabilityDays: 4,
    reviews: 0,
    masteredAt: '2026-08-25T15:00:00Z',
    lastReviewedAt: '2026-08-25T15:00:00Z',
    history: [],
  };
  // Five prior checks, with guided relearning between lapses. Choose the final
  // interval by inverting the pass formula so the last stability is four days.
  for (const [at, correct] of [
    ['2026-08-28T15:00:00Z', 1],
    ['2026-09-05T15:00:00Z', 1],
    ['2026-09-05T21:00:00Z', 3],
  ] as const)
    destiny = applyEcho(destiny, correct, new Date(at));
  const lastAt = new Date('2026-10-11T15:00:00Z');
  const lastR = 1 - (4 - 1.3) / (16 * Math.exp(-0.15 * 4));
  const gap = 9 * (1 / lastR - 1) * DAY;
  destiny = applyEcho(destiny, 1, new Date(lastAt.getTime() - gap));
  destiny = applyEcho(destiny, 3, lastAt);
  states[0] = destiny;
  for (let i = 0; i < 43; i++) add(i % 24, skills[17 + Math.floor(i / 24)].id, true);
  for (let i = 0; i < 4; i++)
    inProgress.push({ studentId: students[i].id, skillId: 'theme', stage: 'Practice' });
  for (let i = 6; i < 12; i++)
    inProgress.push({ studentId: students[i].id, skillId: 'character', stage: 'Practice' });
  for (let i = 12; i < 18; i++)
    inProgress.push({ studentId: students[i].id, skillId: 'figurative', stage: 'Lesson' });
  for (let i = 21; i < 23; i++)
    inProgress.push({ studentId: students[i].id, skillId: 'summary', stage: 'Practice' });
  return structuredClone({ skills, students, states, inProgress });
}
