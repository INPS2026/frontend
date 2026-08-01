'use client';

import { AppSidebar } from '../app-sidebar';
import { LayoutDashboard, UserPlus, Users } from 'lucide-react';

const navLinks = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Student',
    items: [
      {
        label: 'Register Student',
        path: '/dashboard/student/new',
        icon: UserPlus,
      },
      { label: 'All Students', path: '/dashboard/student/all', icon: Users },
    ],
  },
];

export function ParentDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar links={navLinks} />
      <main className="bg-muted grow">{children}</main>
    </>
  );
}
