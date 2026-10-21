import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Link2,
  RotateCcw,
  Sparkles,
  Check,
  Info,
  Search,
  ChevronDown,
  Leaf,
  Clock3,
} from 'lucide-react';
import { useRadar } from '../hooks/useRadar';
import { useDemoAction } from '../hooks/useRunEcho';
import { buildQueue } from '../lib/queue';
import { buildGroups } from '../lib/groups';
import { classRetention, counts } from '../lib/metrics';
import { DEMO_NOW } from '../lib/clock';
import type { SkillState } from '../data/types';
import { RetentionGauge } from '../components/RetentionGauge';
import { RadarSweep } from '../components/RadarSweep';
import { GroupCard } from '../components/GroupCard';
import { StudentRow, Avatar } from '../components/StudentRow';
import { EchoCheckDialog } from '../components/EchoCheckDialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Tooltip } from '../components/ui/tooltip';
export function RadarPage() {
  const { data, isPending, isError, refetch } = useRadar();
  const run = useDemoAction('run');
  const reset = useDemoAction('reset');
  const [selected, setSelected] = useState<SkillState | null>(null);
  const [blockingOnly, setBlockingOnly] = useState(false);
  const [domain, setDomain] = useState('all');
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [params, setParams] = useSearchParams();
  const roster = params.get('view') === 'students';
  const queue = useMemo(
    () => (data ? buildQueue(data.states, data.skills, data.inProgress, DEMO_NOW) : []),
    [data],
  );
  if (isPending)
    return (
      <div className="loading-state" role="status">
        <RadarSkeleton />
        Loading your classroom…
      </div>
    );
  if (isError || !data)
    return (
      <div className="empty-state" role="alert">
        <h1>Your classroom could not load.</h1>
        <Button onClick={() => refetch()}>Try again</Button>
      </div>
    );
  const metrics = counts(queue);
  const retention = Math.round(classRetention(data.states, DEMO_NOW) * 100);
  const { groups, individuals } = buildGroups(
    queue.filter(
      (i) =>
        (!blockingOnly || i.blockingCount > 0) && (domain === 'all' || i.skill.domain === domain),
    ),
    { maxSize: 6 },
  );
  const completed = data.states.filter((s) => s.lastReviewedAt === DEMO_NOW.toISOString()).length;
  const relearn = data.states.filter((s) => s.status === 'relearn');
  const allDone = data.suggestedChecksRemaining === 0;
  return (
    <div className="radar-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">A LITTLE REVIEW GOES A LONG WAY</div>
          <h1>
            Retention Radar
            <span className="title-orbit" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p>Keep yesterday’s learning ready for what comes next.</p>
        </div>
        <div className="class-label">
          <span className="status-dot green" />
          Period 3 · Grade 7 ELA<span className="class-students">24 students</span>
        </div>
      </div>
      <section className="overview-panel" aria-label="Class retention overview">
        <div className="overview-retention">
          <div className="overview-label">
            THE BIG PICTURE
            <Tooltip content="Share of mastered skills with at least 80% estimated retrievability. Relearn skills are excluded.">
              <button aria-label="About class retention" className="icon-link">
                <Info size={14} />
              </button>
            </Tooltip>
          </div>
          <RetentionGauge value={retention} />
          <div className="retention-caption">
            <span className="status-dot green" />
            {retention >= 80
              ? 'Growing stronger, one check at a time.'
              : 'A good moment to reconnect the dots.'}
          </div>
        </div>
        <div className="overview-stats">
          <div className="overview-stat">
            <div className="stat-icon amber">
              <Leaf size={18} />
            </div>
            <div>
              <strong>
                {metrics.fading}
                <span>skills fading</span>
              </strong>
              <p>Previously mastered. Ready for a refresh.</p>
            </div>
          </div>
          <div className="overview-stat">
            <div className="stat-icon coral">
              <Link2 size={18} />
            </div>
            <div>
              <strong>
                {metrics.blocking}
                <span>blocking new learning</span>
              </strong>
              <p>Catch the gap before the next practice round.</p>
            </div>
          </div>
          <div className="risk-note">
            <span className="status-dot coral" />
            {metrics.atRisk} student skills at risk<span>·</span>
            {completed} checks completed
          </div>
        </div>
        <div className="overview-radar">
          <RadarSweep snapshot={data} />
          <div className="radar-legend">
            <span>
              <i className="status-dot green" />
              Solid
            </span>
            <span>
              <i className="status-dot amber" />
              Fading
            </span>
            <span>
              <i className="status-dot coral" />
              At risk
            </span>
          </div>
        </div>
      </section>
      <section className="plan-banner">
        <div className="plan-icon">
          <Sparkles size={21} />
        </div>
        <div>
          <h2>
            {allDone
              ? 'A stronger foundation for the week.'
              : 'Your next small step, already planned.'}
          </h2>
          <p>
            {allDone
              ? `${completed} checks completed. ${relearn.length} skill ${relearn.length === 1 ? 'needs' : 'need'} guided practice.`
              : `${data.suggestedChecksRemaining ?? 16} quick Echo checks across 3 small groups. Start with what’s blocking.`}
          </p>
        </div>
        <Button onClick={() => run.mutate()} disabled={run.isPending || allDone || reset.isPending}>
          {run.isPending ? (
            'Running checks…'
          ) : allDone ? (
            <>
              <Check size={16} />
              Suggested checks complete
            </>
          ) : (
            <>
              Run suggested checks
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </section>
      {(run.isError || reset.isError) && (
        <p role="alert" className="error-message">
          The demo could not update. Please try again.
        </p>
      )}
      {run.isSuccess && (
        <p role="status" className="demo-result">
          Scripted demo complete: {retention}% retained mastery. Each check updated the same model
          used by individual Echo checks.
        </p>
      )}
      <div className="radar-body">
        <section className="review-workspace">
          <div className="work-tabs" role="tablist" aria-label="Classroom view">
            <button role="tab" aria-selected={!roster} onClick={() => setParams({})}>
              Review groups <span>{buildGroups(queue, { maxSize: 6 }).groups.length}</span>
            </button>
            <button
              role="tab"
              aria-selected={roster}
              onClick={() => setParams({ view: 'students' })}
            >
              All students <span>24</span>
            </button>
          </div>
          {roster ? (
            <div className="roster-panel">
              <label className="search-field">
                <Search size={16} />
                <input
                  placeholder="Find a student…"
                  aria-label="Find a student"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <div className="roster-list">
                {data.students
                  .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
                  .map((student) => {
                    const states = data.states.filter((s) => s.studentId === student.id);
                    const needs = queue.filter((i) => i.state.studentId === student.id).length;
                    return (
                      <Link
                        key={student.id}
                        to={`/radar/student/${student.id}`}
                        className="roster-row"
                      >
                        <Avatar student={student} />
                        <div>
                          <strong>{student.name}</strong>
                          <small>
                            {states.filter((s) => s.status === 'mastered').length} mastered in demo
                          </small>
                        </div>
                        <Badge variant={needs ? 'amber' : 'default'}>
                          {needs ? `${needs} to review` : 'Looking solid'}
                        </Badge>
                        <ArrowUpRight size={17} />
                      </Link>
                    );
                  })}
                {!data.students.some((s) =>
                  s.name.toLowerCase().includes(search.toLowerCase()),
                ) && <p className="empty-state">No students match “{search}”. Try a first name.</p>}
              </div>
            </div>
          ) : (
            <>
              <div className="section-heading">
                <div>
                  <h2>A little attention, right here.</h2>
                  <p>Grouped by skill. Prioritized by what comes next.</p>
                </div>
              </div>
              <div className="group-filters">
                <div className="segmented">
                  <button aria-pressed={!blockingOnly} onClick={() => setBlockingOnly(false)}>
                    All skills
                  </button>
                  <button aria-pressed={blockingOnly} onClick={() => setBlockingOnly(true)}>
                    <Link2 size={13} />
                    Blocking only
                  </button>
                </div>
                <label className="domain-filter">
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    aria-label="Filter by domain"
                  >
                    <option value="all">All domains</option>
                    <option value="LIT">Literature</option>
                    <option value="INFO">Informational text</option>
                    <option value="VOCAB">Vocabulary</option>
                    <option value="GRAM">Grammar</option>
                    <option value="MECH">Mechanics</option>
                    <option value="WRIT">Writing</option>
                  </select>
                  <ChevronDown size={13} />
                </label>
              </div>
              <div className="group-list">
                {(showAll ? groups : groups.slice(0, 3)).map((group, index) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    snapshot={data}
                    index={index}
                    onEcho={setSelected}
                  />
                ))}
              </div>
              {groups.length > 3 && (
                <button className="show-more" onClick={() => setShowAll((v) => !v)}>
                  {showAll
                    ? 'Show priority groups'
                    : `View ${groups.length - 3} more review groups`}
                  <ChevronDown size={15} />
                </button>
              )}
              {groups.length === 0 && (
                <div className="empty-state">
                  <Leaf size={28} />
                  <h3>
                    {queue.length
                      ? 'No groups match this filter.'
                      : 'These skills are looking solid.'}
                  </h3>
                  <p>
                    {queue.length
                      ? 'Try another domain or check the individual list below.'
                      : 'The next reviews will appear as memories need a refresh.'}
                  </p>
                </div>
              )}
              {individuals.length > 0 && (
                <section className="individuals">
                  <h2>
                    Individual Echo checks <span>{individuals.length}</span>
                  </h2>
                  <p>A focused moment for a skill that’s unique to one learner.</p>
                  {individuals.map((item) => (
                    <div
                      key={`${item.state.studentId}-${item.skill.id}`}
                      className="individual-item"
                    >
                      <div className="individual-skill">
                        {item.skill.name}
                        <span>{item.skill.code}</span>
                      </div>
                      <StudentRow
                        state={item.state}
                        student={data.students.find((s) => s.id === item.state.studentId)!}
                        onEcho={() => setSelected(item.state)}
                      />
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
          {relearn.length > 0 && (
            <section className="relearn-list">
              <h2>Back to practice</h2>
              <p>These learners need guided practice before another independent check.</p>
              {relearn.map((s) => (
                <Link key={`${s.studentId}-${s.skillId}`} to={`/radar/student/${s.studentId}`}>
                  {data.students.find((st) => st.id === s.studentId)?.name}
                  <span>{data.skills.find((sk) => sk.id === s.skillId)?.name}</span>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </section>
          )}
        </section>
        <aside className="insight-column">
          <Card className="week-card">
            <div className="eyebrow">
              <Clock3 size={13} /> THIS WEEK’S FOCUS
            </div>
            <h2>
              Make room for
              <br />
              remembering.
            </h2>
            <p>Short checks now can save a much longer detour later.</p>
            <ol>
              {['Citing textual evidence', 'Making inferences', 'Using context clues'].map(
                (s, i) => (
                  <li key={s}>
                    <span>{i + 1}</span>
                    {s}
                  </li>
                ),
              )}
            </ol>
            <div className="week-card-foot">
              <span>3 small groups</span>
              <span>16 checks</span>
            </div>
          </Card>
          <div className="echo-explainer">
            <span className="echo-icon">
              <RotateCcw size={19} />
            </span>
            <h3>What’s an Echo check?</h3>
            <p>
              Three questions. No extra help. Just a quick check that the learning is still there.
            </p>
            <div>
              <span>
                <Check size={13} />
                Pass
              </span>
              Memory strengthened
            </div>
            <div>
              <span>
                <RotateCcw size={13} />
                Not yet
              </span>
              Back to guided practice
            </div>
            <Link to="/story#model">
              How the model works
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="demo-note">
            <Badge variant="neutral">CONCEPT DEMO</Badge>
            <p>
              A fixed classroom on October 21, 2026. Suggested checks use scripted outcomes. Changes
              last until you reload.
            </p>
            <button
              onClick={() => {
                reset.mutate();
                run.reset();
                setSelected(null);
              }}
              disabled={reset.isPending || run.isPending}
            >
              <RotateCcw size={12} />
              {reset.isPending ? 'Resetting…' : 'Reset demo classroom'}
            </button>
          </div>
        </aside>
      </div>
      {selected && (
        <EchoCheckDialog
          key={`${selected.studentId}-${selected.skillId}`}
          state={selected}
          skill={data.skills.find((s) => s.id === selected.skillId)!}
          student={data.students.find((s) => s.id === selected.studentId)!}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
function RadarSkeleton() {
  return (
    <div className="loading-rings">
      <span />
      <span />
      <span />
    </div>
  );
}
