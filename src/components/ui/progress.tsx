import * as Primitive from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';
export function Progress({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  return (
    <Primitive.Root
      value={value}
      className={cn('progress', className)}
      aria-label={label ?? 'Retrievability'}
    >
      <Primitive.Indicator
        className="progress-indicator"
        style={{ transform: `scaleX(${Math.max(0, Math.min(100, value)) / 100})` }}
      />
    </Primitive.Root>
  );
}
