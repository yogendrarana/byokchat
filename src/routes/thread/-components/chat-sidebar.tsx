import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import ThreaItem from "./thread-item";
import { buttonVariants } from "@/components/ui/button";
import type { ThreadsSelect } from "@/lib/db/schema";

interface PropType {
  threads: Array<ThreadsSelect>;
}

export default function ChatSidebar({ threads }: PropType) {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b border-border px-3 flex items-center justify-between">
        <div className="h-full w-full flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            <Link to="/">BYOK</Link>
          </h2>

          <Link to="/thread" className={buttonVariants({ size: "sm", variant: "secondary" })}>
            <Plus />
            <span>New Thread</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="gap-0">
          {threads.map((t) => {
            return (
              <SidebarMenuItem key={t.id} className="">
                <ThreaItem thread={t} />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
