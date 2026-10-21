export const DAY = 86_400_000;
export const DEMO_NOW = new Date('2026-10-21T15:00:00Z');
export type Clock = () => Date;
export const demoClock: Clock = () => new Date(DEMO_NOW);
export const elapsedDays = (lastReviewedAt: string, now: Date) =>
  Math.max(0, (now.getTime() - Date.parse(lastReviewedAt)) / DAY);
export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(date),
  );
