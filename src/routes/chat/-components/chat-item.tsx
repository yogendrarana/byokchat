import React from "react";
import { Check, Loader, Trash2, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { useChat } from "../-hooks/useChat";
import { Button } from "@/components/ui/button";
import type { ChatsSelect } from "@/lib/db/schema";

interface PropType {
  chat: ChatsSelect;
}

type DeleteState = "idle" | "confirm" | "loading";

function ChatItem({ chat }: PropType) {
  const location = useLocation();
  const { deleteChat } = useChat();
  const [state, setState] = React.useState<DeleteState>("idle");

  const handleDeleteChatItem = (e: React.MouseEvent) => {
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
        deleteChat.mutate(chat.id);
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
        to="/chat/$id"
        params={{ id: chat.id }}
        className={cn(
          "block p-3 border-b text-muted-foreground text-sm truncate transition-colors",
          location.pathname === `/chat/${chat.id}` && "text-primary"
        )}
      >
        <span className="truncate">{chat.title}</span>
      </Link>

      <ActionButtons
        state={state}
        showButtons={showButtons}
        onTrash={handleDeleteChatItem}
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

export default ChatItem;
