import { useCallback } from "react";
import type { FileUIPart } from "ai";

import { useChatStore } from "@/store/chat-store";
import { useModelStore } from "@/store/model-store";
import { useAiSdkChat } from "@/hooks/use-aisdk-chat";

interface PropTypes {
  threadId?: string;
}

export function useChatHelpers({ threadId }: PropTypes) {
  const { selectedModel } = useModelStore();
  const { setPendingThreads, clearUploadedFiles } = useChatStore();

  const aiSdkChat = useAiSdkChat({
    threadId,
    modelId: selectedModel?.id,
    providerId: selectedModel?.providerId
  });

  const handleSubmit = useCallback(
    async (inputText: string, inputFiles: Array<FileUIPart> = []) => {
      if (aiSdkChat.status === "streaming") {
        aiSdkChat.stop();
        return;
      }

      if (aiSdkChat.status === "submitted") return;
      if (!inputText.trim() && inputFiles.length === 0) return;

      try {
        await aiSdkChat.sendMessage(
          {
            text: inputText.trim(),
            files: inputFiles || []
          },
          { body: { threadId } }
        );
      } finally {
        clearUploadedFiles();
      }
    },
    [aiSdkChat, threadId, setPendingThreads, clearUploadedFiles]
  );

  // Handle retry of a specific message
  const handleRetry = useCallback(
    async (messageId?: string) => {
      await aiSdkChat.regenerate({ messageId });
    },
    [threadId, setPendingThreads]
  );

  // Stop any active stream
  const handleStop = useCallback(() => {
    if (aiSdkChat.status === "streaming") {
      aiSdkChat.stop();
    }
  }, [aiSdkChat, threadId, setPendingThreads]);

  return {
    handleSubmit,
    handleRetry,
    handleStop
  };
}
