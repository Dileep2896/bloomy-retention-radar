import type { Student } from '../data/types';
export const CLASS_ID = 'period-3';
export const CLASS_NAME = 'Period 3 · Grade 7 ELA';
const names = [
  'Destiny G.',
  'Jonathan R.',
  'Amara O.',
  'Ethan W.',
  'Sofia M.',
  'Jayden T.',
  'Maya P.',
  'Noah C.',
  'Isabella L.',
  'Liam B.',
  'Aaliyah K.',
  'Lucas H.',
  'Zoe D.',
  'Mateo S.',
  'Chloe N.',
  'Elijah F.',
  'Aria V.',
  'Oliver J.',
  'Naomi A.',
  'Caleb E.',
  'Grace Y.',
  'Leo Q.',
  'Layla U.',
  'Miles Z.',
];
export const students: Student[] = names.map((name, i) => ({
  id: `student-${i + 1}`,
  name,
  initials: name
    .split(' ')
    .map((n) => n[0])
    .join(''),
  color: i % 5,
}));
