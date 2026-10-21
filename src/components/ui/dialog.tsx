import * as Primitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
export const Dialog = Primitive.Root;
export const DialogTitle = Primitive.Title;
export const DialogDescription = Primitive.Description;
export function DialogContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className="dialog-overlay" />
      <Primitive.Content className={cn('dialog-content', className)}>
        {children}
        <Primitive.Close className="dialog-close" aria-label="Close dialog">
          <X size={20} />
        </Primitive.Close>
      </Primitive.Content>
    </Primitive.Portal>
  );
}
