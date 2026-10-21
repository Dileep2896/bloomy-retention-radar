import type { EchoOutcome } from '../data/types';
/** Fixed demo plan: 16 checks across three small groups; one lapse returns to practice. */
export const echoOutcomes: EchoOutcome[] = [
  ...Array.from({ length: 6 }, (_, i) => ({
    studentId: `student-${i + 1}`,
    skillId: 'evidence',
    correct: i === 1 ? 1 : 3,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    studentId: `student-${i + 7}`,
    skillId: 'inference',
    correct: 3,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    studentId: `student-${i + 13}`,
    skillId: 'context',
    correct: 3,
  })),
];
