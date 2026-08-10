'use client';

import { useRouter } from 'next/navigation';
import { AppSidebar } from '../app-sidebar';
import {
  Calendar,
  CalendarRange,
  LayoutDashboard,
  School,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAuthContext } from '@/lib/auth-context';
import { useEffect } from 'react';

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
  {
    label: 'Classroom',
    items: [
      { label: 'All Classrooms', path: '/dashboard/classrooms', icon: School },
    ],
  },
  {
    label: 'Staff',
    items: [{ label: 'All Staffs', path: '/dashboard/staffs', icon: Users }],
  },
  {
    label: 'School Management',
    items: [
      {
        label: 'Session Management',
        path: '/dashboard/sessions',
        icon: CalendarRange,
      },
      {
        label: 'Calendar Management',
        path: '/dashboard/calendars',
        icon: Calendar,
      },
      {
        label: 'Policy Management',
        path: '/dashboard/promotion-policy',
        icon: TrendingUp,
      },
    ],
  },
];

export function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const authCtx = useAuthContext();

  useEffect(() => {
    if (!authCtx.isAuthenticated || !authCtx.user) {
      router.push('/login');
    }
  }, [authCtx.isAuthenticated, authCtx.user, router]);

  if (!authCtx.isAuthenticated || !authCtx.user) {
    return null; // or a loading spinner/skeleton
  }

  return (
    <>
      <AppSidebar links={navLinks} />
      <main className="bg-muted grow">{children}</main>
    </>
  );
}
