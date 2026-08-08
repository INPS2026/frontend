'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { formatTerm } from '@/lib/format';
import type { GetAllAcademicSessionsResponse } from '@/types/config';
import { UpdateSessionDialog } from './update-session-dialog';
import { DeleteSessionDialog } from './delete-session-dialog';
import { TermStatusBadge } from './term-status-badge';
import { AddTermDialog } from './add-term-dialog';

type Session = Awaited<GetAllAcademicSessionsResponse>['data'][number];

export function SessionAccordionList({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground border rounded-md p-6 text-center">
        No academic sessions yet. Create one to get started.
      </div>
    );
  }

  return (
    <Accordion className="w-full space-y-2 bg-sidebar">
      {sessions.map((session) => (
        <AccordionItem
          key={session.id}
          value={session.id}
          className="border rounded-md px-4"
        >
          <div className="flex items-center justify-between">
            <AccordionTrigger className="flex-1 hover:no-underline">
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">{session.session}</span>
                <span className="text-xs text-muted-foreground">
                  Created {format(new Date(session.createdAt), 'PP')}
                </span>
              </div>
            </AccordionTrigger>

            <div
              className="flex items-center gap-1 pl-2"
              onClick={(e) => e.stopPropagation()}
            >
              <UpdateSessionDialog
                session={session}
                trigger={
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
              />
              <DeleteSessionDialog
                session={session}
                trigger={
                  <Button size="icon" variant="ghost">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                }
              />
            </div>
          </div>

          <AccordionContent>
            <div className="space-y-3 pb-2">
              {session.terms.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No terms added for this session.
                </p>
              ) : (
                <div className="space-y-2">
                  {session.terms.map((term) => (
                    <div
                      key={term.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {formatTerm(term.term)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(term.startDate), 'PP')} –{' '}
                          {format(new Date(term.endDate), 'PP')}
                        </span>
                      </div>
                      <TermStatusBadge status={term.status} />
                    </div>
                  ))}
                </div>
              )}

              <AddTermDialog
                sessionId={session.id}
                trigger={
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Term
                  </Button>
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
