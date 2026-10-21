import * as Primitive from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';
export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  return (
    <Primitive.Provider delayDuration={800}>
      <Primitive.Root>
        <Primitive.Trigger asChild>{children}</Primitive.Trigger>
        <Primitive.Portal>
          <Primitive.Content className="tooltip" sideOffset={8}>
            {content}
            <Primitive.Arrow />
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
    </Primitive.Provider>
  );
}
