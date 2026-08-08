import { Badge } from '@/components/ui/badge';
import { TermStatus } from '@/types/term';

export function TermStatusBadge({ status }: { status: TermStatus }) {
  const variant =
    status === 'CURRENT'
      ? 'default'
      : status === 'UPCOMING'
        ? 'secondary'
        : 'destructive';

  return <Badge variant={variant}>{status}</Badge>;
}
