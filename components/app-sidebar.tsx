'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from './ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, type LucideIcon } from 'lucide-react';
import { TokenService } from '@/lib/token-service';

type AppSidebarProps = {
  links: {
    label: string;
    items: { label: string; path: string; icon: LucideIcon }[];
  }[];
};

export const AppSidebar = ({ links }: AppSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        {links.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton isActive={isActive}>
                      <span>
                        <item.icon />
                      </span>
                      <Link href={item.path}>{item.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton
          onClick={() => {
            TokenService.clear();
            router.push('/');
          }}
        >
          <span>
            <LogOut />
          </span>
          <span>Sign out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
