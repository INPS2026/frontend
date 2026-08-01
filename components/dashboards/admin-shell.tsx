'use client';

import { AppSidebar } from '../app-sidebar';
import { LayoutDashboard, UserPlus, Users } from 'lucide-react';

const navLinks = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Student',
    items: [
      { label: 'All Students', path: '/dashboard/students', icon: Users },
      {
        label: 'Register Student',
        path: '/dashboard/students/new',
        icon: UserPlus,
      },
    ],
  },
];

export function AdminDashboardShell({
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
