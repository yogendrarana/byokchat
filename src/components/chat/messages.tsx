import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";

interface MessagesProps {
  messages: UIMessage[];
  className?: string;
}

export function Messages({ messages, className }: MessagesProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}
    </div>
  );
}

interface MessageItemProps {
  message: UIMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  return (
    <div className={cn("w-full", isUser ? "text-right" : "text-left")}>
      <div
        className={cn(
          "inline-block max-w-full whitespace-pre-wrap rounded-xl px-3 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        )}
      >
        {message.role}
      </div>
    </div>
  );
}
