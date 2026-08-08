'use client';

import { CreateSessionDialog } from '@/components/school-management/create-session-dialog';
import { SessionAccordionList } from '@/components/school-management/session-accordion-list';
import { TopBar } from '@/components/top-bar';
import { useGetAllAcademicSessions } from '@/service/api/admin/config.api';

export default function SchoolManagementPage() {
  const { data: sessionsData, isLoading } = useGetAllAcademicSessions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TopBar
          title="School Management Page"
          subtitle="Manage and update sessions, terms, etc."
        />
        <div className="px-4">Loading...</div>
      </div>
    );
  }

  const sessions = sessionsData?.data ?? [];

  return (
    <div className="space-y-4">
      <TopBar
        title="School Management Page"
        subtitle="Manage and update sessions, terms, etc."
      />
      <div className="px-4 space-y-4">
        <div className="flex justify-end">
          <CreateSessionDialog />
        </div>
        <SessionAccordionList sessions={sessions} />
      </div>
    </div>
  );
}
