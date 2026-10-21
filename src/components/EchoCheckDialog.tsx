import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ArrowRight, LockKeyhole, RotateCcw } from 'lucide-react';
import type { SkillState, Skill, Student } from '../data/types';
import { useRepository } from '../data/RepositoryProvider';
import { useRunEcho } from '../hooks/useRunEcho';
import { DEMO_NOW, elapsedDays, formatDate } from '../lib/clock';
import { retrievability, nextReviewDate } from '../lib/forgetting';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
export function EchoCheckDialog({
  state,
  skill,
  student,
  onClose,
}: {
  state: SkillState;
  skill: Skill;
  student: Student;
  onClose: () => void;
}) {
  const repo = useRepository();
  const {
    data: items,
    isError,
    refetch,
  } = useQuery({ queryKey: ['echo-items', skill.id], queryFn: () => repo.getEchoItems(skill.id) });
  const mutation = useRunEcho();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const result = mutation.data;
  const before = Math.round(
    retrievability(state.stabilityDays, elapsedDays(state.lastReviewedAt, DEMO_NOW)) * 100,
  );
  const submit = () => {
    if (!items || items.some((i) => answers[i.id] === undefined)) return;
    mutation.mutate({
      studentId: student.id,
      skillId: skill.id,
      correct: items.filter((i) => answers[i.id] === i.answer).length,
    });
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !mutation.isPending) onClose();
      }}
    >
      <DialogContent className="echo-dialog">
        <div className="eyebrow">
          <RotateCcw size={14} /> ECHO CHECK <span>·</span> {skill.code}
        </div>
        <DialogTitle>
          {result
            ? result.status === 'mastered'
              ? 'A little review. A stronger memory.'
              : 'A fresh practice round starts here.'
            : skill.name}
        </DialogTitle>
        <DialogDescription>
          {student.name} ·{' '}
          {result ? 'Check complete' : '3 questions · Independent check · 2 correct to pass'}
        </DialogDescription>
        {result ? (
          <div className="echo-result">
            <div className={`result-symbol ${result.status}`}>
              <Check size={32} />
            </div>
            <strong className="result-score">{result.history.at(-1)?.correct} / 3</strong>
            <Badge variant={result.status === 'mastered' ? 'default' : 'coral'}>
              {result.status === 'mastered' ? 'Echo passed' : 'Relearn → back to practice'}
            </Badge>
            <div className="before-after-score">
              <span>
                {before}%<small>Before check</small>
              </span>
              <ArrowRight />
              <span>
                {result.status === 'mastered' ? '100%' : 'Relearn'}
                <small>
                  {result.status === 'mastered'
                    ? 'Retrievability restored'
                    : 'Guided practice next'}
                </small>
              </span>
            </div>
            <p>
              {result.status === 'mastered'
                ? `Next review: ${formatDate(nextReviewDate(result))}. This skill has more time to grow.`
                : 'This skill needs another look. Return to guided practice before the next independent check.'}
            </p>
            <Button onClick={onClose}>
              Back to Radar
              <ArrowRight size={16} />
            </Button>
          </div>
        ) : (
          <>
            {isError ? (
              <div role="alert">
                <p>Could not load the questions.</p>
                <Button onClick={() => refetch()}>Try again</Button>
              </div>
            ) : !items ? (
              <p role="status">Loading questions…</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <blockquote className="echo-passage">{items[0].passage}</blockquote>
                {items.map((item, i) => (
                  <fieldset key={item.id} className="echo-question">
                    <legend>
                      <span>{i + 1}</span>
                      {item.question}
                    </legend>
                    {item.options.map((option, index) => (
                      <label key={option} className={answers[item.id] === index ? 'selected' : ''}>
                        <input
                          type="radio"
                          name={item.id}
                          value={index}
                          checked={answers[item.id] === index}
                          onChange={() => setAnswers((a) => ({ ...a, [item.id]: index }))}
                          disabled={mutation.isPending}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>
                ))}
                <div className="echo-submit">
                  <span>
                    <LockKeyhole size={13} /> Independent assessment
                  </span>
                  <Button
                    type="submit"
                    disabled={items.some((i) => answers[i.id] === undefined) || mutation.isPending}
                  >
                    {mutation.isPending ? 'Saving check…' : 'Submit Echo check'}
                    <ArrowRight size={16} />
                  </Button>
                </div>
                {mutation.isError && (
                  <p role="alert">The check could not be saved. Try submitting again.</p>
                )}
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
