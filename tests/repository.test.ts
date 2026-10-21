import { describe, it, expect } from 'vitest';
import { MemoryRetentionRepository } from '../src/data/memoryRepo';
import { DEMO_NOW } from '../src/lib/clock';
import { classRetention } from '../src/lib/metrics';
import { skills } from '../src/seed/skills';
import { CLASS_ID } from '../src/seed/students';
describe('RetentionRepository', () => {
  it('returns isolated snapshots', async () => {
    const repo = new MemoryRetentionRepository();
    const s = await repo.getClassSnapshot(CLASS_ID);
    s.states.length = 0;
    expect((await repo.getClassSnapshot(CLASS_ID)).states).toHaveLength(70);
  });
  it('records a pass and persists history', async () => {
    const repo = new MemoryRetentionRepository();
    const before = await repo.getStudentSkills('student-1');
    const after = await repo.recordEcho({
      studentId: 'student-1',
      skillId: 'evidence',
      correct: 3,
    });
    expect(after.reviews).toBe(before[0].reviews + 1);
    expect((await repo.getStudentSkills('student-1'))[0]).toEqual(after);
  });
  it('persists failure as relearn', async () => {
    const repo = new MemoryRetentionRepository();
    const result = await repo.recordEcho({
      studentId: 'student-2',
      skillId: 'evidence',
      correct: 1,
    });
    expect(result.status).toBe('relearn');
  });
  it('rejects unknown students and classes', async () => {
    const repo = new MemoryRetentionRepository();
    await expect(
      repo.recordEcho({ studentId: 'no', skillId: 'evidence', correct: 3 }),
    ).rejects.toThrow();
    await expect(repo.getClassSnapshot('no')).rejects.toThrow();
  });
  it('has three valid authored questions for every skill', async () => {
    const repo = new MemoryRetentionRepository();
    for (const s of skills) {
      const items = await repo.getEchoItems(s.id);
      expect(items).toHaveLength(3);
      expect(new Set(items.map((i) => i.question)).size).toBe(3);
      for (const item of items) {
        expect(item.options).toHaveLength(4);
        expect(item.options[item.answer]).toBeTruthy();
      }
    }
  });
  it('scripted plan is idempotent and reaches 84%', async () => {
    const repo = new MemoryRetentionRepository();
    await repo.runSuggestedChecks();
    const first = await repo.getClassSnapshot(CLASS_ID);
    expect(Math.round(classRetention(first.states, DEMO_NOW) * 100)).toBe(84);
    await repo.runSuggestedChecks();
    expect(await repo.getClassSnapshot(CLASS_ID)).toEqual(first);
  });
  it('does not overwrite a manually completed Echo in the demo plan', async () => {
    const repo = new MemoryRetentionRepository();
    const manual = await repo.recordEcho({
      studentId: 'student-1',
      skillId: 'evidence',
      correct: 2,
    });
    await repo.runSuggestedChecks();
    expect((await repo.getStudentSkills('student-1'))[0]).toEqual(manual);
  });
  it('reset restores the initial demo', async () => {
    const repo = new MemoryRetentionRepository();
    const before = await repo.getClassSnapshot(CLASS_ID);
    await repo.runSuggestedChecks();
    await repo.reset();
    expect(await repo.getClassSnapshot(CLASS_ID)).toEqual(before);
  });
});
