import { createFileRoute, Outlet } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { getUserThreads } from "./-lib/functions";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import ChatSidebar from "./-components/chat-sidebar";
import { UserButton } from "@/components/user-button";

export const Route = createFileRoute("/thread")({
  component: RouteComponent,
  loader: async () => {
    const { data, success } = await getUserThreads();
    return success ? data : null;
  }
});

function RouteComponent() {
  const threads = Route.useLoaderData();
  if (!threads) return <div>Failed to load threads.</div>;

  return (
    <SidebarProvider>
      <ChatSidebar threads={threads} />

      <SidebarInset>
        <header
          className={cn(
            "h-16 border-b border-border sticky top-0 bg-background z-50",
            "flex items-center gap-2 shrink-0",
            "transition-[width,height] ease-linear"
          )}
        >
          <div className="w-full px-4 flex justify-between items-center gap-2">
            <SidebarTrigger className="cursor-pointer" />
            <UserButton />
          </div>
        </header>

        <main className="h-full w-full">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
