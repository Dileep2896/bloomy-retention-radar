import { useEffect, useState, useRef } from 'react';
import { animate, motion, useReducedMotion } from 'motion/react';
export function RetentionGauge({
  value,
  from,
  label = 'Class retention',
}: {
  value: number;
  from?: number;
  label?: string;
}) {
  const reduced = useReducedMotion();
  const previous = useRef(from ?? value);
  const [display, setDisplay] = useState(reduced ? value : (from ?? value));
  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      previous.current = value;
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setDisplay,
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduced]);
  return (
    <div className="retention-gauge" role="img" aria-label={`${label}: ${Math.round(value)}%`}>
      <svg viewBox="0 0 240 150" aria-hidden="true">
        <path d="M 28 123 A 92 92 0 0 1 212 123" className="gauge-track" />
        <motion.path
          d="M 28 123 A 92 92 0 0 1 212 123"
          className="gauge-fill"
          initial={false}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: reduced ? 0 : 1.3 }}
        />
        <circle cx="28" cy="123" r="3" className="gauge-cap" />
      </svg>
      <div className="gauge-value">
        <strong>
          {Math.round(display)}
          <span>%</span>
        </strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
