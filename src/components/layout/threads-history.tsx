import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";
import MaxWidthContainer from "../max-width-container";
import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import type { ThreadsWithMessages } from "@/routes/thread/-lib/functions";

export function ThreadsHistory({ threads }: { threads: ThreadsWithMessages[] }) {
  const { isPending, error, data } = authClient.useSession();
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  if (isPending || error || !data?.user?.id || !threads.length) return null;

  return (
    <section id="home" className="border-b">
      <MaxWidthContainer className="sm:border-l sm:border-r">
        <div className="p-2 lg:p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium text-foreground">Recent Threads</h2>
              <p className="text-sm text-muted-foreground">Continue where you left off</p>
            </div>
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-7 px-2"
              >
                <List className="w-3 h-3" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-7 px-2"
              >
                <LayoutGrid className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "gap-3",
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col"
            )}
          >
            {threads.map((thread) => {
              if (viewMode === "list") {
                return (
                  <Link
                    to="/thread/$id"
                    params={{ id: thread.id }}
                    key={thread.id}
                    className="group border border-border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-foreground/80 transition-colors truncate text-sm">
                          {thread.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1 mb-2">
                          {thread.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{thread?.messages?.length} messages</span>
                          <span>
                            {thread.messages[0]?.createdAt
                              ? format(thread.messages[0].createdAt, "dd MMM yyyy, hh:mm a")
                              : "No messages"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  to="/thread/$id"
                  params={{ id: thread.id }}
                  key={thread.id}
                  className="group border border-border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium text-foreground mb-2 group-hover:text-foreground/80 transition-colors line-clamp-1 text-sm">
                    {thread.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{thread.title}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{thread?.messages?.length} messages</span>
                    <span>
                      {thread.messages[0]?.createdAt
                        ? format(thread.messages[0].createdAt, "dd MMM yyyy, hh:mm a")
                        : "No messages"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/thread"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }), "text-xs")}
            >
              View All Conversations
            </Link>
          </div>
        </div>
      </MaxWidthContainer>
    </section>
  );
}
