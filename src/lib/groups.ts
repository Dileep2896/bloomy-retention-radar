import type { ReviewItem, Group } from '../data/types';
export function buildGroups(
  queue: ReviewItem[],
  { maxSize }: { maxSize: number },
): { groups: Group[]; individuals: ReviewItem[] } {
  if (!Number.isInteger(maxSize) || maxSize < 2)
    throw new RangeError('Groups must hold at least two students.');
  const bySkill = new Map<string, ReviewItem[]>();
  for (const item of queue) {
    const list = bySkill.get(item.skill.id) ?? [];
    if (!list.some((x) => x.state.studentId === item.state.studentId)) list.push(item);
    bySkill.set(item.skill.id, list);
  }
  const groups: Group[] = [];
  const individuals: ReviewItem[] = [];
  for (const [id, items] of bySkill) {
    if (items.length < 2) {
      individuals.push(...items);
      continue;
    }
    items.sort((a, b) => a.R - b.R || b.priority - a.priority);
    for (let i = 0; i < items.length; i += maxSize) {
      const chunk = items.slice(i, i + maxSize);
      groups.push({
        id: `${id}-${i / maxSize}`,
        skill: chunk[0].skill,
        items: chunk,
        priority: chunk.reduce((sum, item) => sum + item.priority, 0),
      });
    }
  }
  return {
    groups: groups.sort((a, b) => b.priority - a.priority),
    individuals: individuals.sort((a, b) => b.priority - a.priority),
  };
}
