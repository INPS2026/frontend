'use client';

import { useParentContext } from '@/lib/parent-context';
import { AppSidebar } from '../app-sidebar';
import { LayoutDashboard, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const navLinks = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
    ],
  },
  // {
  //   label: 'Children',
  //   items: [
  //     {
  //       label: 'All Children',
  //       path: '/parent/dashboard/children',
  //       icon: Users,
  //     },
  //   ],
  // },
];

export function ParentDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const authCtx = useParentContext();

  useEffect(() => {
    if (!authCtx.isAuthenticated || !authCtx.user) {
      router.push('/parent/login');
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
