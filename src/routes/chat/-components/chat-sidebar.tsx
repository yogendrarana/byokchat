import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import ChatItem from "./chat-item";
import type { ChatsSelect } from "@/lib/db/schema";
import { buttonVariants } from "@/components/ui/button";

interface PropType {
  chats: Array<ChatsSelect>;
}

export default function ChatSidebar({ chats }: PropType) {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b border-border px-3 flex items-center justify-between">
        <div className="h-full w-full flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            <Link to="/">BYOK</Link>
          </h2>

          <Link to="/chat" className={buttonVariants({ size: "sm", variant: "secondary" })}>
            <Plus />
            <span>New Chat</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="gap-0">
          {chats.map((chat) => {
            return (
              <SidebarMenuItem key={chat.id} className="">
                <ChatItem chat={chat} />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
