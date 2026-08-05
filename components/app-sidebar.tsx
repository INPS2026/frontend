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

function matchesNavHref(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveNavHref(pathname: string, hrefs: string[]) {
  const matches = hrefs.filter((href) => matchesNavHref(pathname, href));
  if (matches.length === 0) return undefined;
  return matches.sort((a, b) => b.length - a.length)[0];
}

export const AppSidebar = ({ links }: AppSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        {links.map((group) => {
          const hrefs = group.items.map((i) => i.path);
          const activeHref = getActiveNavHref(pathname ?? '/', hrefs);

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = activeHref === item.path;

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
          );
        })}
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
