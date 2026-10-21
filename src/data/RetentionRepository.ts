import type { Snapshot, SkillState, EchoItem, EchoOutcome } from './types';
export interface RetentionRepository {
  getClassSnapshot(classId: string): Promise<Snapshot>;
  getStudentSkills(studentId: string): Promise<SkillState[]>;
  getEchoItems(skillId: string): Promise<EchoItem[]>;
  recordEcho(outcome: EchoOutcome): Promise<SkillState>;
  runSuggestedChecks(): Promise<number>;
  reset(): Promise<void>;
}
