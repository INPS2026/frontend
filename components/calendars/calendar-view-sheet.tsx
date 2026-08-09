'use client';

import { useMemo, useState } from 'react';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { HOLIDAY_TYPE_STYLES } from '@/lib/calendar-utils';
import { HolidayFormDialog } from './holiday-form-dialog';
import { DeleteHolidayDialog } from './delete-holiday-dialog';
import type { Calendar, Holiday, HolidayType } from '@/types/calendar';
import { formatTerm } from '@/lib/format';
import { Button } from '../ui/button';

type CalendarViewSheetProps = {
  calendar: Calendar | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Mirrors the ActiveDialog pattern from TermRow: one state slot instead of
// juggling separate booleans for add / edit / delete.
type ActiveHolidayDialog =
  | { type: 'create' }
  | { type: 'update'; holiday: Holiday }
  | { type: 'delete'; holiday: Holiday }
  | null;

export function CalendarViewSheet({
  calendar,
  open,
  onOpenChange,
}: CalendarViewSheetProps) {
  const [activeDialog, setActiveDialog] = useState<ActiveHolidayDialog>(null);

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
    <>
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
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold">Holidays</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveDialog({ type: 'create' })}
                >
                  <Plus className="mr-1.5 size-4" />
                  Add Holiday
                </Button>
              </div>

              {sortedHolidays.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No holidays recorded for this term.
                </p>
              ) : (
                <ul className="space-y-2">
                  {sortedHolidays.map((holiday) => (
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
                      <div className="flex items-center gap-2">
                        <Badge
                          className={HOLIDAY_TYPE_STYLES[holiday.type].badge}
                          variant="outline"
                        >
                          {HOLIDAY_TYPE_STYLES[holiday.type].label}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() =>
                            setActiveDialog({ type: 'update', holiday })
                          }
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:text-destructive"
                          onClick={() =>
                            setActiveDialog({ type: 'delete', holiday })
                          }
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <HolidayFormDialog
        open={activeDialog?.type === 'create'}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setActiveDialog(null);
        }}
        calendarId={calendar.id}
        mode="create"
      />

      <HolidayFormDialog
        open={activeDialog?.type === 'update'}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setActiveDialog(null);
        }}
        calendarId={calendar.id}
        mode="update"
        holiday={activeDialog?.type === 'update' ? activeDialog.holiday : null}
      />

      <DeleteHolidayDialog
        holiday={activeDialog?.type === 'delete' ? activeDialog.holiday : null}
        open={activeDialog?.type === 'delete'}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setActiveDialog(null);
        }}
      />
    </>
  );
}
