'use client';

import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TERM_ORDER } from '@/lib/calendar-utils';
import type { Calendar } from '@/types/calendar'; // adjust to your actual Calendar type import
import { formatTerm } from '@/lib/format';
import { CalendarViewSheet } from './calendar-view-sheet';
import { CalendarDays, Pencil } from 'lucide-react';
import { UpdateCalendarDialog } from './update-calendar-dialog';

type CalendarListProps = {
  calendars: Calendar[];
};

export function CalendarList({ calendars }: CalendarListProps) {
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(
    null,
  );
  const [calendarToEdit, setCalendarToEdit] = useState<Calendar | null>(null);

  const groupedByYear = useMemo(() => {
    const map: Record<string, Calendar[]> = {};
    for (const calendar of calendars) {
      (map[calendar.academicYear] ??= []).push(calendar);
    }
    for (const year of Object.keys(map)) {
      map[year].sort((a, b) => TERM_ORDER[a.term] - TERM_ORDER[b.term]);
    }
    return map;
  }, [calendars]);

  const sortedYears = useMemo(
    () => Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a)),
    [groupedByYear],
  );

  if (sortedYears.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        No calendars found for the selected filters.
      </div>
    );
  }

  return (
    <>
      <Accordion multiple defaultValue={[sortedYears[0]]} className="px-4">
        {sortedYears.map((year) => (
          <AccordionItem key={year} value={year}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{year}</span>
                <Badge variant="secondary">
                  {groupedByYear[year].length} calendar
                  {groupedByYear[year].length === 1 ? '' : 's'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pb-2">
                {groupedByYear[year].map((calendar) => (
                  <div
                    key={calendar.id}
                    className="flex items-center justify-between rounded-md border p-3 bg-sidebar"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {formatTerm(calendar.term)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(calendar.startDate), 'PP')} –{' '}
                        {format(parseISO(calendar.endDate), 'PP')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {calendar.holidays.length} holiday
                        {calendar.holidays.length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCalendarToEdit(calendar)}
                      >
                        <Pencil className="mr-1.5 size-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCalendar(calendar)}
                      >
                        <CalendarDays className="mr-1.5 size-4" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <CalendarViewSheet
        calendar={selectedCalendar}
        open={!!selectedCalendar}
        onOpenChange={(open: boolean) => {
          if (!open) setSelectedCalendar(null);
        }}
      />
      <UpdateCalendarDialog
        calendar={calendarToEdit}
        open={!!calendarToEdit}
        onOpenChange={(open) => {
          if (!open) setCalendarToEdit(null);
        }}
      />
    </>
  );
}
