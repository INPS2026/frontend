'use client';

import { useMemo } from 'react';
import { eachDayOfInterval, format, parseISO, startOfMonth } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Calendar as CalendarWidget } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { HOLIDAY_TYPE_STYLES } from '@/lib/calendar-utils';
import type { Calendar, Holiday, HolidayType } from '@/types/calendar';
import { formatTerm } from '@/lib/format';

type CalendarViewSheetProps = {
  calendar: Calendar | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CalendarViewSheet({
  calendar,
  open,
  onOpenChange,
}: CalendarViewSheetProps) {
  const modifiers = useMemo(() => {
    const map: Record<HolidayType, Date[]> = {
      PUBLIC: [],
      SCHOOL: [],
      EXAM: [],
    };
    if (!calendar) return map;
    for (const holiday of calendar.holidays) {
      const days = eachDayOfInterval({
        start: parseISO(holiday.startDate),
        end: parseISO(holiday.endDate),
      });
      map[holiday.type].push(...days);
    }
    return map;
  }, [calendar]);

  const sortedHolidays = useMemo(() => {
    if (!calendar) return [];
    return [...calendar.holidays].sort(
      (a, b) =>
        parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime(),
    );
  }, [calendar]);

  if (!calendar) return null;

  const termStart = parseISO(calendar.startDate);
  const termEnd = parseISO(calendar.endDate);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {formatTerm(calendar.term)} · {calendar.academicYear}
          </SheetTitle>
          <SheetDescription>
            {format(termStart, 'PP')} – {format(termEnd, 'PP')}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-6 px-4">
          <div>
            <CalendarWidget
              defaultMonth={termStart}
              startMonth={startOfMonth(termStart)}
              endMonth={startOfMonth(termEnd)}
              modifiers={modifiers}
              modifiersClassNames={{
                PUBLIC: HOLIDAY_TYPE_STYLES.PUBLIC.dayClassName,
                SCHOOL: HOLIDAY_TYPE_STYLES.SCHOOL.dayClassName,
                EXAM: HOLIDAY_TYPE_STYLES.EXAM.dayClassName,
              }}
              className="rounded-md border w-full"
            />
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {(Object.keys(HOLIDAY_TYPE_STYLES) as HolidayType[]).map(
                (type) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <span
                      className={`size-2 rounded-full ${HOLIDAY_TYPE_STYLES[type].dot}`}
                    />
                    {HOLIDAY_TYPE_STYLES[type].label}
                  </div>
                ),
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">Holidays</h4>
            {sortedHolidays.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No holidays recorded for this term.
              </p>
            ) : (
              <ul className="space-y-2">
                {sortedHolidays.map((holiday: Holiday) => (
                  <li
                    key={holiday.id}
                    className="flex items-center justify-between rounded-md border p-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium">{holiday.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(holiday.startDate), 'PP')}
                        {holiday.startDate !== holiday.endDate &&
                          ` – ${format(parseISO(holiday.endDate), 'PP')}`}
                      </p>
                    </div>
                    <Badge
                      className={HOLIDAY_TYPE_STYLES[holiday.type].badge}
                      variant="outline"
                    >
                      {HOLIDAY_TYPE_STYLES[holiday.type].label}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
