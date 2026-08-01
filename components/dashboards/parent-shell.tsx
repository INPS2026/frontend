'use client';

import { AppSidebar } from '../app-sidebar';
import { LayoutDashboard, Users } from 'lucide-react';

const navLinks = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Children',
    items: [
      {
        label: 'All Children',
        path: '/parent/dashboard/children',
        icon: Users,
      },
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
