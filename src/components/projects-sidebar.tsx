import * as React from 'react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

export async function ProjectsSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  //   const session = await auth.api.getSession({
  //     headers: await headers(),
  //   });

  //   if (!session?.user?.id) {
  //     redirect('/login');
  //   }

  //   const spaces = await getUserSpaces({ userId: Number(session.user.id) });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mb-8">Header</SidebarHeader>

      <SidebarContent>Nav</SidebarContent>

      <SidebarFooter>Footer</SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
