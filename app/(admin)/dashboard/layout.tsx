import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

const navLinks = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/dashboard' }],
  },
  {
    label: 'Student',
    items: [{ label: 'Register Student', path: 'dashboard/student/new' }],
  },
];

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar links={navLinks} />
        <main>{children}</main>
      </SidebarProvider>
    </div>
  );
}
