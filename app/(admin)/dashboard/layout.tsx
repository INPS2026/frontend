import { AdminDashboardShell } from '@/components/dashboards/admin-shell';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <SidebarProvider>
        <AdminDashboardShell>{children}</AdminDashboardShell>
      </SidebarProvider>
    </div>
  );
}
