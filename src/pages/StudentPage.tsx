import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useRadar } from '../hooks/useRadar';
import { useStudentSkills } from '../hooks/useStudentSkills';
import type { SkillState } from '../data/types';
import { classRetention } from '../lib/metrics';
import { DEMO_NOW } from '../lib/clock';
import { Avatar, StudentRow } from '../components/StudentRow';
import { DecayChart } from '../components/DecayChart';
import { EchoCheckDialog } from '../components/EchoCheckDialog';
import { RetentionGauge } from '../components/RetentionGauge';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
export function StudentPage() {
  const { id = '' } = useParams();
  const snapshot = useRadar();
  const query = useStudentSkills(id);
  const [selected, setSelected] = useState<SkillState | null>(null);
  const student = snapshot.data?.students.find((s) => s.id === id);
  if (snapshot.isPending || query.isPending)
    return (
      <div role="status" className="loading-state">
        Loading learner’s skills…
      </div>
    );
  if (snapshot.isError || query.isError)
    return (
      <div className="empty-state" role="alert">
        <h1>Could not load this learner.</h1>
        <Button
          onClick={() => {
            snapshot.refetch();
            query.refetch();
          }}
        >
          Try again
        </Button>
      </div>
    );
  if (!student || !snapshot.data || !query.data)
    return (
      <div className="empty-state">
        <h1>Student not found</h1>
        <Link to="/radar">Back to Radar</Link>
      </div>
    );
  const { data } = snapshot;
  const states = query.data;
  return (
    <div className="student-page">
      <Link to="/radar" className="back-link">
        <ArrowLeft size={16} />
        Back to Radar
      </Link>
      <header className="student-heading">
        <div>
          <Avatar student={student} />
          <div>
            <div className="eyebrow">PERIOD 3 · GRADE 7 ELA</div>
            <h1>{student.name}</h1>
            <p>
              {states.filter((s) => s.status === 'mastered').length} mastered skills in this demo ·
              Kennedy Middle School
            </p>
          </div>
        </div>
        <RetentionGauge
          value={Math.round(classRetention(states, DEMO_NOW) * 100)}
          label="Retained mastery"
        />
      </header>
      <section>
        <h2>A foundation that keeps growing.</h2>
        <p className="muted">See what’s ready, what’s fading, and when to return.</p>
        <div className="student-skill-list">
          {states.map((state) => {
            const skill = data.skills.find((s) => s.id === state.skillId)!;
            return (
              <article className="student-skill-card" key={skill.id}>
                <header>
                  <div>
                    <Badge variant="neutral">{skill.code}</Badge>
                    <h3>{skill.name}</h3>
                  </div>
                  <span className="review-count">
                    <RotateCcw size={13} />
                    {state.reviews} reviews
                  </span>
                </header>
                <StudentRow state={state} student={student} onEcho={() => setSelected(state)} />
                <DecayChart state={state} />
              </article>
            );
          })}
        </div>
      </section>
      {selected && (
        <EchoCheckDialog
          state={selected}
          student={student}
          skill={data.skills.find((s) => s.id === selected.skillId)!}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
