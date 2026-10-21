import type { Skill, InProgress, SkillState } from '../data/types';
export function prereqsOf(skillId: string, graph: Skill[], depth = 2): string[] {
  const found = new Set<string>();
  const byId = new Map(graph.map((s) => [s.id, s]));
  function visit(id: string, remaining: number, path: Set<string>) {
    if (remaining <= 0) return;
    for (const p of byId.get(id)?.prerequisites ?? []) {
      if (path.has(p)) continue;
      found.add(p);
      visit(p, remaining - 1, new Set([...path, p]));
    }
  }
  visit(skillId, depth, new Set([skillId]));
  return [...found];
}
/** Without states this returns candidate prerequisites; buildQueue supplies mastered states. */
export function blockingSkills(
  studentId: string,
  graph: Skill[],
  inProgress: InProgress[],
  states?: SkillState[],
): string[] {
  const candidates = [
    ...new Set(
      inProgress
        .filter((p) => p.studentId === studentId)
        .flatMap((p) => prereqsOf(p.skillId, graph, 2)),
    ),
  ];
  return states
    ? candidates.filter((id) =>
        states.some(
          (s) => s.studentId === studentId && s.skillId === id && s.status === 'mastered',
        ),
      )
    : candidates;
}
export function isDAG(graph: Skill[]): boolean {
  const active = new Set<string>(),
    done = new Set<string>();
  const byId = new Map(graph.map((s) => [s.id, s]));
  function visit(id: string): boolean {
    if (active.has(id)) return false;
    if (done.has(id)) return true;
    active.add(id);
    for (const p of byId.get(id)?.prerequisites ?? []) {
      if (!byId.has(p) || !visit(p)) return false;
    }
    active.delete(id);
    done.add(id);
    return true;
  }
  return graph.every((s) => visit(s.id));
}
