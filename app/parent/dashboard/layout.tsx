import { ParentDashboardShell } from '@/components/dashboards/parent-shell';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <SidebarProvider>
        <ParentDashboardShell>{children}</ParentDashboardShell>
      </SidebarProvider>
    </div>
  );
}
