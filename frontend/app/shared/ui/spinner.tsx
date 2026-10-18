import { IconLoader2 } from '@tabler/icons-react';

import { cn } from '@/shared/lib/shadcn-utils';

const Spinner = ({ className, ...props }: React.ComponentProps<'svg'>) => (
  <IconLoader2
    aria-label='Loading'
    className={cn('size-4 animate-spin', className)}
    role='status'
    {...props}
  />
);

export { Spinner };
