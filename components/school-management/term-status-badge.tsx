import { Badge } from '@/components/ui/badge';
import { TermStatus } from '@/types/term';

// TODO: replace 'string' with your real TermStatus type once imported
export function TermStatusBadge({ status }: { status: TermStatus }) {
  const variant =
    status === 'CURRENT'
      ? 'default'
      : status === 'UPCOMING'
        ? 'secondary'
        : 'outline';

  return <Badge variant={variant}>{status}</Badge>;
}
