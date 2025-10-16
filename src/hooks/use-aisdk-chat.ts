import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { useHydrated } from "@/hooks/use-hydrated";
import { authClient } from "@/lib/auth/auth-client";

export interface UseAiSdkChatProps {
  threadId?: string;
  modelId?: string;
  providerId?: string;
}

export function useAiSdkChat({ threadId, modelId, providerId }: UseAiSdkChatProps) {
  const isHydrated = useHydrated();
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isHydrated) return;
    authClient.getSession().then((session) => {
      setToken(session.data?.session.token || null);
    });
  }, [isHydrated]);

  // TODO: provide initial message to the transporter
  const transport = React.useMemo(() => {
    if (!token) return null;
    return new DefaultChatTransport({
      api: "/api/chat",
      credentials: "include",
      headers: () => ({
        Authorization: `Bearer ${token}`
      }),
      body: {
        modelId,
        providerId
      }
    });
  }, [token, threadId, modelId, providerId]);

  // init the chat
  return useChat(
    isHydrated && transport
      ? {
          id: threadId ?? uuidv4(),
          transport,
          onFinish: () => {},
          onError: (err) => console.error("Chat error", err),
          generateId: () => uuidv4()
        }
      : undefined
  );
}
