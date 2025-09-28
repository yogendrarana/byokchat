import React from "react";
import { nanoid } from "nanoid";
import { useChat } from "@ai-sdk/react";
import { authClient } from "@/lib/auth/auth-client";

export interface PropTypes {
  threadId?: string;
  modelId: string | undefined;
  providerId?: string;
}

export function useAiSdkChat({ threadId, modelId, providerId }: PropTypes) {
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    authClient.getSession().then((session) => {
      setToken(session.data?.session.token || null);
    });
  }, []);

  const chat = useChat({
    id: threadId ?? nanoid(),
    headers: token ? { authorization: `Bearer ${token}` } : undefined,
    expertimental_throttle: 100,
    body: { id: threadId, modelId, providerId }
  } as any);

  return chat;
}
