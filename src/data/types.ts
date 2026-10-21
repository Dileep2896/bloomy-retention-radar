export type Domain = 'LIT' | 'INFO' | 'VOCAB' | 'GRAM' | 'MECH' | 'WRIT';
export type RetentionStatus = 'solid' | 'fading' | 'at_risk' | 'relearn';
export interface Skill {
  id: string;
  name: string;
  code: string;
  domain: Domain;
  prerequisites: string[];
  domainWeight: number;
}
export interface Student {
  id: string;
  name: string;
  initials: string;
  color: number;
}
export interface EchoReview {
  at: string;
  correct: number;
  beforeR: number;
  stabilityBefore: number;
  stabilityAfter: number;
}
export interface SkillState {
  studentId: string;
  skillId: string;
  masteryScore: number;
  masteredAt: string;
  stabilityDays: number;
  lastReviewedAt: string;
  reviews: number;
  status: 'mastered' | 'relearn';
  history: EchoReview[];
}
export interface InProgress {
  studentId: string;
  skillId: string;
  stage: 'Lesson' | 'Practice';
}
export interface EchoItem {
  id: string;
  passage: string;
  question: string;
  options: [string, string, string, string];
  answer: number;
}
export interface ReviewItem {
  state: SkillState;
  skill: Skill;
  R: number;
  status: RetentionStatus;
  blockingCount: number;
  blockingFor: string[];
  priority: number;
}
export interface Group {
  id: string;
  skill: Skill;
  items: ReviewItem[];
  priority: number;
}
export interface Snapshot {
  suggestedChecksRemaining?: number;
  skills: Skill[];
  students: Student[];
  states: SkillState[];
  inProgress: InProgress[];
}
export interface EchoOutcome {
  studentId: string;
  skillId: string;
  correct: number;
}
