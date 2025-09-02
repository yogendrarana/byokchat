import { ProjectsSidebar } from '@/components/projects-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      {/* sidebar */}
      <ProjectsSidebar />

      {/* dynamic content */}
      <SidebarInset>
        <header
          className={cn(
            'h-16 border-b border-border sticky top-0 bg-background z-50',
            'flex items-center gap-2 shrink-0',
            'transition-[width,height] ease-linear',
            // 'group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
          )}
        >
          <div className="w-full px-4 flex justify-between items-center gap-2">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
