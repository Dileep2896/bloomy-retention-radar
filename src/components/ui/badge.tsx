import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
const variants = cva('badge', {
  variants: {
    variant: {
      default: 'badge-green',
      amber: 'badge-amber',
      coral: 'badge-coral',
      neutral: 'badge-neutral',
    },
  },
  defaultVariants: { variant: 'default' },
});
export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof variants>) {
  return <span className={cn(variants({ variant }), className)} {...props} />;
}
