'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { TermStatusBadge } from './term-status-badge';
import { UpdateTermStatusDialog } from './update-term-status-dialog';
import { UpdateTermDatesDialog } from './update-term-dates-dialog';
import { DeleteTermDialog } from './delete-term-dialog';

import type { Term } from '@/types/term';
import { formatTerm } from '@/lib/format';
import { useState } from 'react';

type ActiveDialog = 'status' | 'dates' | 'delete' | null;

export function TermRow({ term }: { term: Term }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);

  // Close the dropdown first, then open the dialog on the next tick.
  // Opening it in the same event cycle causes Radix's dropdown-close
  // focus/outside-click handling to immediately dismiss the dialog.
  const openDialog = (dialog: ActiveDialog) => {
    setMenuOpen(false);
    requestAnimationFrame(() => setActiveDialog(dialog));
  };

  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{formatTerm(term.term)}</span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(term.startDate), 'PP')} –{' '}
          {format(new Date(term.endDate), 'PP')}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <TermStatusBadge status={term.status} />

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger
            render={
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openDialog('status')}>
              Update Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog('dates')}>
              Edit Dates
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openDialog('delete')}
              className="text-destructive focus:text-destructive"
            >
              Delete Term
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UpdateTermStatusDialog
          term={term}
          open={activeDialog === 'status'}
          onOpenChange={(open) => setActiveDialog(open ? 'status' : null)}
        />
        <UpdateTermDatesDialog
          term={term}
          open={activeDialog === 'dates'}
          onOpenChange={(open) => setActiveDialog(open ? 'dates' : null)}
        />
        <DeleteTermDialog
          term={term}
          open={activeDialog === 'delete'}
          onOpenChange={(open) => setActiveDialog(open ? 'delete' : null)}
        />
      </div>
    </div>
  );
}
