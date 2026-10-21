import { Link } from 'react-router-dom';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import type { SkillState, Student } from '../data/types';
import { retrievability, nextReviewDate, statusOf } from '../lib/forgetting';
import { DEMO_NOW, elapsedDays, formatDate } from '../lib/clock';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
export function Avatar({ student, small = false }: { student: Student; small?: boolean }) {
  return (
    <span
      className={`avatar avatar-${student.color} ${small ? 'avatar-small' : ''}`}
      title={student.name}
    >
      {student.initials}
    </span>
  );
}
export function StudentRow({
  state,
  student,
  onEcho,
}: {
  state: SkillState;
  student: Student;
  onEcho: () => void;
}) {
  const R = retrievability(state.stabilityDays, elapsedDays(state.lastReviewedAt, DEMO_NOW));
  const status = statusOf(R, state.status);
  const due = nextReviewDate(state);
  const isDue = due <= DEMO_NOW;
  return (
    <div className="student-row" data-testid={`student-row-${student.id}`}>
      <div className="student-name">
        <Avatar student={student} />
        <div>
          <Link to={`/radar/student/${student.id}`}>
            {student.name}
            <ArrowUpRight size={13} />
          </Link>
          <small>Mastery check passed {formatDate(state.masteredAt)}</small>
        </div>
      </div>
      <div className={`student-retention ${status}`}>
        <div>
          <span>Retrievability</span>
          <strong>{Math.round(R * 100)}%</strong>
        </div>
        <Progress value={R * 100} label={`${student.name} retrievability`} />
      </div>
      <div className="student-due">
        <Badge
          variant={
            status === 'relearn' || status === 'at_risk'
              ? 'coral'
              : status === 'fading'
                ? 'amber'
                : 'default'
          }
        >
          {status === 'relearn'
            ? 'Relearn → practice'
            : status === 'at_risk'
              ? 'At risk'
              : status === 'fading'
                ? 'Fading'
                : 'Solid'}
        </Badge>
        <small>
          {status === 'relearn'
            ? 'Resume guided practice'
            : isDue
              ? 'Review due today'
              : `Next review ${formatDate(due)}`}
        </small>
      </div>
      <Button size="sm" variant="outline" onClick={onEcho} disabled={status === 'relearn'}>
        <RotateCcw size={14} />
        Run Echo check
      </Button>
    </div>
  );
}
