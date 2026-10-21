import type { SkillState, Skill, InProgress, ReviewItem } from '../data/types';
import { retrievability, statusOf } from './forgetting';
import { elapsedDays } from './clock';
import { prereqsOf } from './graph';
export function priority(item: Pick<ReviewItem, 'R' | 'blockingCount' | 'skill'>): number {
  return (1 - item.R) * (1 + 1.5 * item.blockingCount) * item.skill.domainWeight;
}
export function buildQueue(
  states: SkillState[],
  graph: Skill[],
  inProgress: InProgress[],
  now: Date,
): ReviewItem[] {
  const byId = new Map(graph.map((s) => [s.id, s]));
  return states
    .flatMap((state) => {
      const skill = byId.get(state.skillId);
      if (!skill || state.status === 'relearn') return [];
      const R = retrievability(state.stabilityDays, elapsedDays(state.lastReviewedAt, now));
      const status = statusOf(R);
      if (status === 'solid') return [];
      const blockingFor = [
        ...new Set(
          inProgress
            .filter(
              (p) =>
                p.studentId === state.studentId &&
                prereqsOf(p.skillId, graph, 2).includes(state.skillId),
            )
            .map((p) => p.skillId),
        ),
      ];
      const item = {
        state,
        skill,
        R,
        status,
        blockingCount: blockingFor.length,
        blockingFor,
        priority: 0,
      };
      item.priority = priority(item);
      return [item];
    })
    .sort(
      (a, b) =>
        b.priority - a.priority ||
        Date.parse(a.state.lastReviewedAt) - Date.parse(b.state.lastReviewedAt) ||
        a.state.studentId.localeCompare(b.state.studentId),
    );
}
