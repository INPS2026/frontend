'use client';

import { useState } from 'react';
import { TopBar } from '@/components/top-bar';
import { useGetSchoolCalendars } from '@/service/api/admin/config.api';
import {
  CalendarFilters,
  type CalendarFiltersValue,
} from '@/components/calendars/calendar-filters';
import { CalendarList } from '@/components/calendars/calendar-list';
import { CreateCalendarDialog } from '@/components/calendars/create-calendar-dialog';
import { getCurrentAcademicYear } from '@/lib/calendar-utils';

export default function CalendarManagementPage() {
  const [filters, setFilters] = useState<CalendarFiltersValue>({
    academicYear: getCurrentAcademicYear(),
    term: 'FIRST_TERM',
  });

  const { data: calendarsData, isLoading } = useGetSchoolCalendars({
    academicYear:
      filters.academicYear === 'ALL' ? undefined : filters.academicYear,
    term: filters.term === 'ALL' ? undefined : filters.term,
  });

  return (
    <div className="space-y-4">
      <TopBar
        title="Calendar Management"
        subtitle="Manage school calendars and holidays"
      />
      <div className="flex items-center justify-between px-4">
        <CalendarFilters value={filters} onChange={setFilters} />
        <CreateCalendarDialog />
      </div>
      {isLoading ? (
        <div className="px-4">Loading...</div>
      ) : (
        <CalendarList calendars={calendarsData?.data ?? []} />
      )}
    </div>
  );
}
