import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

import { AppSidebar } from "@/components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useCompany } from "@/context/CompanyContext";

export const Route = createFileRoute("/company")({
  component: AppLayout,
});

function AppLayout() {
  const { company } = useCompany();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const page = pathname.endsWith("/skills") ? "Skill Intelligence" : "Company Intelligence";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-surface">
        <AppSidebar />
        <SidebarInset className="min-w-0 bg-surface">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-surface px-3 sm:px-4">
            <SidebarTrigger />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbLink asChild>
                    <Link to="/">All Companies</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:block" />
                <BreadcrumbItem className="min-w-0">
                  <span className="truncate">{company?.shortName ?? "Company"}</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="truncate">{page}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
