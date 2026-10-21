import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Link2, ChevronUp, BookOpen } from 'lucide-react';
import type { Group, Snapshot, SkillState } from '../data/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, StudentRow } from './StudentRow';
export function GroupCard({
  group,
  snapshot,
  index,
  onEcho,
}: {
  group: Group;
  snapshot: Snapshot;
  index: number;
  onEcho: (state: SkillState) => void;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const blocking = group.items.filter((i) => i.blockingCount > 0);
  const target = blocking[0]?.blockingFor[0];
  const targetName = snapshot.skills.find((s) => s.id === target)?.name;
  const average = Math.round(
    (group.items.reduce((sum, i) => sum + i.R, 0) / group.items.length) * 100,
  );
  return (
    <motion.article
      className={`group-card ${open ? 'expanded' : ''}`}
      data-testid="group-card"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduced ? 0 : index * 0.05, duration: reduced ? 0 : 0.35 }}
    >
      <div className="group-main">
        <div className={`group-icon domain-${group.skill.domain.toLowerCase()}`}>
          <BookOpen size={21} />
        </div>
        <div className="group-copy">
          <div className="group-meta">
            <span>{group.skill.code}</span>
            <span>·</span>
            <span>{group.items.length} students</span>
            {blocking.length > 0 && (
              <Badge variant="amber">
                <Link2 size={11} />
                Blocking
              </Badge>
            )}
          </div>
          <h3>{group.skill.name}</h3>
          <p>
            {blocking.length > 0 ? (
              <>
                Needed for <strong>{targetName}</strong> by {blocking.length} students
              </>
            ) : (
              'A short review will help this learning stick.'
            )}
          </p>
          <div className="group-bottom">
            <div className="avatar-stack">
              {group.items.map((item) => (
                <Avatar
                  key={item.state.studentId}
                  student={snapshot.students.find((s) => s.id === item.state.studentId)!}
                  small
                />
              ))}
            </div>
            <span>
              <span className="status-dot amber" />
              {average}% avg. retrievability
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="group-action"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`group-${group.id}`}
        >
          {open ? 'Close group' : 'View group'}
          {open ? <ChevronUp size={15} /> : <ArrowRight size={15} />}
        </Button>
      </div>
      {open && (
        <div className="group-students" id={`group-${group.id}`}>
          <div className="group-instruction">
            A quick, independent check. Three questions per student.
          </div>
          {group.items.map((item) => (
            <StudentRow
              key={item.state.studentId}
              state={item.state}
              student={snapshot.students.find((s) => s.id === item.state.studentId)!}
              onEcho={() => onEcho(item.state)}
            />
          ))}
        </div>
      )}
    </motion.article>
  );
}
