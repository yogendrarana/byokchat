import React from "react";
import { Check, Loader, Trash2, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ThreadsSelect } from "@/lib/db/schema";
import { useThreadApi } from "@/lib/hooks/use-thread-api";

interface PropType {
  thread: ThreadsSelect;
}

type DeleteState = "idle" | "confirm" | "loading";

function ThreadItem({ thread }: PropType) {
  const location = useLocation();
  const { deleteThread } = useThreadApi();
  const [state, setState] = React.useState<DeleteState>("idle");

  const handleDeleteThreadItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (state === "idle") setState("confirm");
  };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (state === "confirm") {
      setState("loading");
      setTimeout(() => {
        deleteThread.mutate(thread.id);
        setState("idle");
      }, 1200);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === "confirm") setState("idle");
  };

  const showButtons = state === "confirm" || state === "loading";

  return (
    <div className="relative group/item">
      <Link
        to="/thread/$id"
        params={{ id: thread.id }}
        className={cn(
          "block p-3 border-b text-muted-foreground text-sm truncate transition-colors",
          location.pathname === `/thread/${thread.id}` && "text-primary"
        )}
      >
        <span className="truncate">{thread.title}</span>
      </Link>

      <ActionButtons
        state={state}
        showButtons={showButtons}
        onTrash={handleDeleteThreadItem}
        onConfirm={handleDeleteConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

/**Action buttons */
interface ActionButtonsProps {
  state: DeleteState;
  showButtons: boolean;
  onTrash: (e: React.MouseEvent) => void;
  onConfirm: (e: React.MouseEvent) => void;
  onCancel: (e: React.MouseEvent) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  state,
  showButtons,
  onTrash,
  onConfirm,
  onCancel
}) => {
  return (
    <div
      className={cn(
        "px-2 absolute right-0 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200",
        {
          "opacity-100 bg-background": showButtons
        }
      )}
    >
      {state === "loading" ? (
        <Button
          size="icon"
          variant="ghost"
          className="size-8 bg-muted text-foreground rounded-xl border"
          onClick={onCancel}
        >
          <Loader className="w-4 h-4 animate-spin text-foreground" />
        </Button>
      ) : state === "confirm" ? (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 bg-muted text-foreground rounded-xl border"
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 bg-muted text-foreground rounded-xl border"
            onClick={onConfirm}
          >
            <Check className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          className="size-8 bg-muted text-foreground rounded-xl border"
          onClick={onTrash}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default ThreadItem;
