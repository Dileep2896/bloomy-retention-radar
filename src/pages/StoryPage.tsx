import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Radar, ArrowRight, ArrowUpRight, Check, ArrowDown, Link2 } from 'lucide-react';
import {
  Reveal,
  FadingChip,
  Count,
  LearningPath,
  ForgettingDiagram,
  BeforeAfter,
  ImpactGauge,
} from '../story/StoryVisuals';
import { Button } from '../components/ui/button';
export default function StoryPage() {
  const reduced = useReducedMotion();
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo?.(0, 0);
  }, [hash]);
  return (
    <div
      className="story-page"
      data-testid="story-page"
      data-reduced-motion={String(Boolean(reduced))}
    >
      <header className="story-nav">
        <Link to="/radar" className="brand">
          <span className="brand-mark">
            <Radar size={20} />
          </span>
          Retention Radar
        </Link>
        <span>A CONCEPT FOR LEARNING THAT LASTS</span>
        <Button asChild variant="outline" size="sm">
          <Link to="/radar">
            Open the Radar
            <ArrowUpRight size={15} />
          </Link>
        </Button>
      </header>
      <section className="story-hero story-section" aria-labelledby="story-hero-title">
        <Reveal>
          <div className="eyebrow">
            <span className="status-dot green" />
            Spaced review for mastered skills in K-12 learning
          </div>
          <h1 id="story-hero-title">
            Mastered
            <br />
            isn’t forever.
          </h1>
          <p>
            Passing a mastery check is a beginning.
            <br />
            Let’s make sure the learning stays.
          </p>
          <a className="story-scroll-link" href="#company">
            <span>THE CASE FOR RETENTION RADAR</span>
            <ArrowDown size={17} />
          </a>
        </Reveal>
        <FadingChip />
        <div className="hero-footnote">
          <span>01 / THE IDEA</span>
          <span>An independent project · Built with Codex, verified by Claude Code</span>
        </div>
      </section>
      <section
        id="company"
        className="story-section company-section"
        aria-labelledby="company-title"
      >
        <Reveal>
          <div className="eyebrow">FIRST, A LITTLE CONTEXT</div>
          <h2 id="company-title">How mastery learning works.</h2>
          <p className="story-lede">
            Adaptive K-12 platforms put each learner on a path of their own: learn the idea, practice
            with support, then prove it independently on a mastery check.
          </p>
        </Reveal>
        <LearningPath />
        <div className="company-numbers">
          <Reveal>
            <strong>
              <Count value={24} />
            </strong>
            <span>learners in the demo class</span>
          </Reveal>
          <Reveal delay={0.1}>
            <strong>
              <Count value={28} />
            </strong>
            <span>skills in a prerequisite graph</span>
          </Reveal>
          <Reveal delay={0.2}>
            <strong>
              <Count value={70} />
            </strong>
            <span>mastered skills tracked for decay</span>
          </Reveal>
        </div>
        <p className="source-note">
          A synthetic Grade 7 ELA class. Every learner, skill and outcome on this page is demo data.
        </p>
      </section>
      <section className="story-section pain-section" aria-labelledby="pain-title">
        <div className="pain-intro">
          <Reveal>
            <div className="eyebrow">THE PART AFTER “MASTERED”</div>
            <h2 id="pain-title">
              But memory
              <br />
              keeps moving.
            </h2>
            <p className="story-lede">
              A pass tells us a student knew it then. It doesn’t tell us what they can retrieve
              today.
            </p>
            <p>
              A fading prerequisite can become tomorrow’s failed practice round. The gap is time,
              not potential.
            </p>
          </Reveal>
          <div className="story-quotes">
            <Reveal delay={0.1}>
              <blockquote>
                “Spacing out whole skills is harder than spacing out flashcards.”
                <cite>A common theme from builders of adaptive learning tools</cite>
              </blockquote>
            </Reveal>
            <Reveal delay={0.2}>
              <blockquote>
                “A mastery gate tells you they arrived. Does the mastery hold over time?”
                <cite>A recurring question from learning-science reviewers</cite>
              </blockquote>
            </Reveal>
          </div>
        </div>
        <Reveal className="pain-chart">
          <ForgettingDiagram />
        </Reveal>
      </section>
      <section className="story-section decision-section" aria-labelledby="decision-title">
        <Reveal>
          <div className="eyebrow">THE PRODUCT DECISION</div>
          <h2 id="decision-title">A signal worth building.</h2>
          <p className="story-lede">
            Most mastery tools count skills that only go up. The missing piece is what happens after.
          </p>
        </Reveal>
        <div className="decision-options">
          <motion.div
            className="decision-card alternative"
            initial={reduced ? false : { opacity: 1, x: -20 }}
            whileInView={{ opacity: 0.6, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 0.6 }}
          >
            <span>THE OTHER DIRECTION</span>
            <h3>Misconception groups</h3>
            <p>
              Useful, but it needs tutor conversation data that a standalone demo would have to fake.
            </p>
            <small>Dependent on another system.</small>
          </motion.div>
          <motion.div
            className="decision-card chosen"
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 0.6 }}
          >
            <span>THE CHOSEN DIRECTION</span>
            <h3>
              Retention Radar <span>✳</span>
            </h3>
            {[
              'Covers the “after mastered” gap',
              'Keeps LLMs out of mastery decisions',
              'Turns the signal into small groups anyway',
            ].map((reason, i) => (
              <motion.div
                className="decision-reason"
                key={reason}
                initial={reduced ? false : { opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduced ? 0 : 0.3 + i * 0.2, duration: reduced ? 0 : 0.3 }}
              >
                <Check size={17} />
                {reason}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="story-section change-section" aria-labelledby="change-title">
        <Reveal>
          <div className="eyebrow">SAME CLASSROOM. A CLEARER PICTURE.</div>
          <h2 id="change-title">
            From a count to
            <br />a clear next step.
          </h2>
          <p className="story-lede">
            See what’s fading. Put blocking prerequisites first.
            <br />
            Bring the learning back with a three-question Echo.
          </p>
        </Reveal>
        <BeforeAfter />
        <p className="source-note">
          Illustrative student row. All learners, questions, and retention values in this concept
          are synthetic.
        </p>
      </section>
      <section className="story-section impact-section" aria-labelledby="impact-title">
        <Reveal>
          <div className="eyebrow">THE DIFFERENCE A FEW MINUTES CAN MAKE</div>
          <h2 id="impact-title">
            Small checks.
            <br />
            Lasting learning.
          </h2>
          <p className="story-lede">
            A week’s suggested checks brings the class’s retained mastery from 61% to 84% in our
            deterministic demo.
          </p>
        </Reveal>
        <ImpactGauge />
        <div className="impact-facts">
          <Reveal>
            <strong>4</strong>
            <p>
              blocking prerequisites
              <br />
              caught before practice
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <strong>3</strong>
            <p>
              small groups planned
              <br />
              in one click
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <strong>0</strong>
            <p>
              LLM calls in the
              <br />
              mastery decision
            </p>
          </Reveal>
        </div>
        <span className="seed-label">
          DEMO SEED DATA · MODELED RETENTION, NOT MEASURED LEARNING GAINS
        </span>
      </section>
      <section className="story-section cta-section" aria-labelledby="cta-title">
        <Reveal>
          <Radar size={36} />
          <h2 id="cta-title">
            Keep the learning
            <br />
            with them.
          </h2>
          <p>
            Meet Ms. Rivera’s class. Find a fading skill.
            <br />
            Give yesterday’s learning a little attention.
          </p>
          <div className="story-ctas">
            <Button asChild>
              <Link to="/radar">
                Open the Radar
                <ArrowRight size={17} />
              </Link>
            </Button>
            <a href="#model">
              How the model works
              <ArrowDown size={15} />
            </a>
          </div>
        </Reveal>
        <div id="model" className="formula-block">
          <div>
            <span className="eyebrow">
              <Link2 size={13} /> UNDER THE SURFACE
            </span>
            <h3>A small model, made visible.</h3>
            <p>
              An FSRS-style power curve estimates retrievability (R) from stability in days (S) and
              elapsed time (t). This concept uses a heuristic Echo update, not a fitted FSRS
              scheduler.
            </p>
          </div>
          <div>
            <code>R = (1 + t / (9 × S))⁻¹</code>
            <p>
              A 90–100% mastery check starts with 4–10 days of stability. A passing Echo grows stability; a
              failed check returns the skill to practice. The next review is due at{' '}
              <strong>R = 0.85</strong>.
            </p>
            <small>Priority = (1 − R) × (1 + 1.5 × blocking count) × domain weight.</small>
          </div>
        </div>
      </section>
      <footer className="story-footer">
        <Link to="/radar" className="brand">
          Retention Radar
        </Link>
        <p>
          Independent project built with Codex, verified by Claude Code.
          <br />
          All classroom data is synthetic.
        </p>
        <Link to="/radar">
          Open the Radar
          <ArrowUpRight size={14} />
        </Link>
      </footer>
    </div>
  );
}
