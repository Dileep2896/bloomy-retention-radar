import type { RetentionRepository } from './RetentionRepository';
import type { EchoOutcome } from './types';
import { createSeed } from '../seed/history';
import { echoItems } from '../seed/echoItems';
import { echoOutcomes } from '../seed/echoOutcomes';
import { CLASS_ID } from '../seed/students';
import { applyEcho } from '../lib/forgetting';
import { demoClock, type Clock } from '../lib/clock';
export class MemoryRetentionRepository implements RetentionRepository {
  private snapshot = createSeed();
  private completed = new Set<string>();
  constructor(private readonly clock: Clock = demoClock) {}
  async getClassSnapshot(classId: string) {
    if (classId !== CLASS_ID) throw new Error('Class not found');
    return structuredClone({
      ...this.snapshot,
      suggestedChecksRemaining: echoOutcomes.filter(
        (o) => !this.completed.has(`${o.studentId}:${o.skillId}`),
      ).length,
    });
  }
  async getStudentSkills(studentId: string) {
    return structuredClone(this.snapshot.states.filter((s) => s.studentId === studentId));
  }
  async getEchoItems(skillId: string) {
    const items = echoItems[skillId];
    if (!items) throw new Error('Echo items not found');
    return structuredClone(items);
  }
  async recordEcho(outcome: EchoOutcome) {
    const index = this.snapshot.states.findIndex(
      (s) => s.studentId === outcome.studentId && s.skillId === outcome.skillId,
    );
    if (index < 0) throw new Error('Student skill not found');
    const next = applyEcho(this.snapshot.states[index], outcome.correct, this.clock());
    this.snapshot.states[index] = next;
    this.completed.add(`${outcome.studentId}:${outcome.skillId}`);
    return structuredClone(next);
  }
  async runSuggestedChecks() {
    let count = 0;
    for (const outcome of echoOutcomes) {
      if (!this.completed.has(`${outcome.studentId}:${outcome.skillId}`)) {
        await this.recordEcho(outcome);
        count++;
      }
    }
    return count;
  }
  async reset() {
    this.snapshot = createSeed();
    this.completed.clear();
  }
}
