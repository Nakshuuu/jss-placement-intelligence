import { Link, useRouterState } from "@tanstack/react-router";
import { Building2, LayoutGrid, Radar, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { COLLEGE_SHORT } from "@/config/college";

const NAV = [
  { title: "Company Intelligence", to: "/company/intelligence", icon: Radar, isNew: false },
  { title: "Skill Intelligence", to: "/company/skills", icon: Sparkles, isNew: true },
] as const;

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const close = () => isMobile && setOpenMobile(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-10 items-center gap-2 px-1">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy font-heading text-xs font-bold text-primary-foreground">
            {COLLEGE_SHORT.slice(0, 2)}
          </span>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate font-heading text-sm font-semibold text-foreground">{COLLEGE_SHORT}</p>
              <p className="truncate text-[11px] text-muted-foreground">Placement Intelligence Hub</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={pathname === item.to} tooltip={item.title}>
                    <Link to={item.to} onClick={close}>
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.isNew && !collapsed && (
                        <span className="rounded-full bg-link px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground animate-glow">
                          New
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="All Companies">
              <Link to="/" onClick={close}>
                {collapsed ? <LayoutGrid className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                <span>All Companies</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
