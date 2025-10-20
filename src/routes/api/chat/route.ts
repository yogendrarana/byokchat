import {
  type LanguageModel,
  type ImageModel,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  generateText,
  smoothStream,
  type LanguageModelUsage
} from "ai";
import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import type { OpenAIProvider } from "@ai-sdk/openai";
import { createServerFileRoute } from "@tanstack/react-start/server";

import {
  type MessagesInsert,
  type MessagesSelect,
  messageSchema,
  threadSchema
} from "@/lib/db/schema";
import db from "@/lib/db/db";
import { auth } from "@/lib/auth/auth";
import { createThreadAndMessage } from "@/lib/thread";
import { createAiSdkProvider } from "@/helpers/model";
import { MODEL_PROVIDERS, type TCoreProvider } from "@/lib/model";
import { generateAndStoreImage } from "@/services/image-service";

// helper functions
function getFinalModel({
  providerId,
  modelId,
  apiKey,
  isImageModel
}: {
  providerId: TCoreProvider;
  modelId: string;
  apiKey: string;
  isImageModel?: boolean;
}): LanguageModel | ImageModel | null {
  const sdkProvider = createAiSdkProvider({ providerId, apiKey });

  if (isImageModel) {
    if (!("imageModel" in sdkProvider)) {
      return null;
    }
    return sdkProvider.imageModel(modelId);
  }

  if (providerId === "openai" && "responses" in sdkProvider) {
    return (sdkProvider as OpenAIProvider).responses(modelId);
  }

  if ("languageModel" in sdkProvider) {
    return sdkProvider.languageModel(modelId);
  }

  return null;
}

function toModelMessage({ messages }: { messages: Array<MessagesSelect> }) {
  return messages.map((message) => {
    const content: any[] = [];

    // Process each part of the message
    for (const part of message.parts) {
      switch (part.type) {
        case "text":
          content.push({
            type: "text",
            text: part.text
          });
          break;
        case "image":
          /**
           * @todo we can fetch image and put the image blob here, or provide image url maybe?
           */
          content.push({
            type: "image",
            image: part.image,
            mimeType: part.mimeType
          });
          break;
        case "file":
          content.push({
            type: "file",
            data: part.data,
            filename: part.filename,
            mimeType: part.mimeType
          });
          break;
        case "tool-invocation":
          // Convert tool invocation to tool call format for AI SDK
          if (part.toolInvocation.state === "call") {
            content.push({
              type: "tool-call",
              toolCallId: part.toolInvocation.toolCallId,
              toolName: part.toolInvocation.toolName,
              args: part.toolInvocation.args
            });
          } else if (part.toolInvocation.state === "result") {
            content.push({
              type: "tool-result",
              toolCallId: part.toolInvocation.toolCallId,
              toolName: part.toolInvocation.toolName,
              result: part.toolInvocation.result
            });
          }
          break;
      }
    }

    return {
      role: message.role,
      content: content.length === 1 && content[0].type === "text" ? content[0].text : content
    };
  });
}

async function generateThreadTitle({
  model,
  userMessage
}: {
  model: LanguageModel;
  userMessage: string;
}): Promise<string> {
  try {
    const { text } = await generateText({
      model,
      messages: [
        {
          role: "system",
          content:
            "Generate a concise, descriptive title (max 50 characters) for this conversation based on the user's first message. Return only the title, nothing else."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    return text.trim().slice(0, 50);
  } catch (error) {
    console.error("Failed to generate thread title:", error);
    return "Untitled";
  }
}

// api endpoint handler
export const ServerRoute = createServerFileRoute("/api/chat").methods({
  POST: async ({ request }) => {
    try {
      const body: {
        threadId?: string;
        messages: Partial<MessagesInsert>;
        modelId: string;
        providerId: TCoreProvider;
      } = await request.json();

      const { threadId, messages, modelId, providerId } = body;

      // Authenticate user from request headers
      const session = await auth.api.getSession({
        headers: request.headers
      });

      const userId = session?.user?.id;
      if (!userId) {
        return json({ success: false, message: "Unauthorized" }, { status: 401 });
      }

      // Validate required fields
      if (!modelId || !providerId) {
        return json(
          { success: false, message: "Missing provider and model name" },
          { status: 400 }
        );
      }

      if (!Array.isArray(messages) || messages.length === 0) {
        return json({ success: false, message: "Missing messages array" }, { status: 400 });
      }

      const latestMessage = messages[messages.length - 1];
      const lateseMessageParts = latestMessage?.parts ?? [];

      if (!Array.isArray(lateseMessageParts) || lateseMessageParts.length === 0) {
        return json(
          { success: false, message: "Message must have at least one part" },
          { status: 400 }
        );
      }

      // Step 1: Resolve provider/model and user key
      const userActiveKeys = await db.query.apiKeySchema.findMany({
        where: (table, { and, eq }) =>
          and(
            eq(table.userId, session.user.id),
            eq(table.providerId, providerId),
            eq(table.active, true)
          )
      });

      if (!userActiveKeys.length) {
        return json(
          { success: false, message: `No active api key found for ${providerId}` },
          { status: 401 }
        );
      }

      const apiKey = userActiveKeys[Math.floor(Math.random() * userActiveKeys.length)].key;

      const selectedProvider = MODEL_PROVIDERS.find((p) => p.id === providerId);
      const selectedModel = selectedProvider?.models.find((m) => m.id === modelId);
      const isImageModel = selectedModel?.mode === "image";

      const finalModel = getFinalModel({ providerId, modelId, apiKey, isImageModel });
      if (!finalModel) {
        return json({ success: false, message: "Invalid provider or model id" }, { status: 401 });
      }

      // Step 2: Prepare model messages (read-only) using existing thread messages if provided
      let modelMessagesInput: Array<any> = [];
      if (threadId) {
        const existingMessages = await db.query.messageSchema.findMany({
          where: (table, { eq }) => eq(table.threadId, threadId),
          orderBy: (table, { asc }) => [asc(table.createdAt)]
        });
        modelMessagesInput = toModelMessage({ messages: existingMessages });
      }

      // Always append current user message to prompt
      const userParts = latestMessage.parts;
      const userRole = latestMessage.role ?? "user";

      const currentUserMessage = toModelMessage({
        messages: [
          {
            id: "temp",
            threadId: threadId || "temp",
            role: userRole,
            status: "completed",
            parts: userParts,
            metadata: {},
            createdAt: new Date(),
            updatedAt: new Date()
          } as any
        ]
      });

      modelMessagesInput = [...modelMessagesInput, ...currentUserMessage];

      // Step 3: Stream AI response to client, then persist atomically at the end.
      const abortController = new AbortController();
      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          try {
            if (isImageModel) {
              const userSettings = await db.query.settingSchema.findFirst({
                where: (table, { eq }) => eq(table.userId, session.user.id)
              });
              const storageConfig = userSettings?.storageConfig || {
                provider: "database" as const,
                credentials: {},
                options: {}
              };

              const userTextContent = (userParts || [])
                .filter((p) => p?.type === "text")
                .map((p) => (p as any).text)
                .join(" ")
                .trim();

              if (!userTextContent) {
                writer.write({
                  type: "error",
                  errorText: "No prompt provided for image generation"
                });
                return;
              }

              const imageResult = await generateAndStoreImage({
                prompt: userTextContent,
                model: finalModel as ImageModel,
                storageConfig,
                filename: `generated-${Date.now()}.png`
              });

              if (!imageResult.success || !imageResult.url) {
                throw new Error(imageResult.error || "Failed to generate image");
              }

              // Stream the produced image file info
              writer.write({
                type: "file",
                url: imageResult.url as string,
                mediaType: "image/png"
              });

              // Persist atomically at the end
              await db.transaction(async (trx) => {
                const created = await createThreadAndMessage(trx, {
                  threadId,
                  userId,
                  userMessage: messages
                });

                if (!created) {
                  throw new Error("Unable to create thread or message");
                }

                await trx
                  .update(messageSchema)
                  .set({
                    parts: [
                      {
                        type: "image",
                        image: imageResult.url as string,
                        mimeType: "image/png"
                      }
                    ],
                    status: "completed",
                    metadata: {
                      providerId,
                      modelId,
                      keySource: "user",
                      serverDurationMs: 0
                    }
                  })
                  .where(eq(messageSchema.id, created.newAssistantMessageId));
              });
              return;
            }

            if (!isImageModel) {
              const tokenUsage: LanguageModelUsage = {
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0,
                reasoningTokens: 0,
                cachedInputTokens: 0
              };

              let accumulatedText = "";

              const result = streamText({
                model: finalModel as LanguageModel,
                abortSignal: abortController.signal,
                experimental_transform: smoothStream(),
                messages: modelMessagesInput || [],
                temperature: 0.7,
                onChunk: async ({ chunk }) => {
                  if (chunk.type === "text-delta") {
                    accumulatedText += chunk.text;
                    writer.write({ type: "text-delta", delta: chunk.text, id: "text-stream" });
                  }
                },
                onFinish: ({ totalUsage }) => {
                  tokenUsage.inputTokens = totalUsage.inputTokens;
                  tokenUsage.outputTokens = totalUsage.outputTokens;
                  tokenUsage.totalTokens = totalUsage.outputTokens;
                  tokenUsage.reasoningTokens = totalUsage.reasoningTokens;
                  tokenUsage.cachedInputTokens = totalUsage.cachedInputTokens;
                },
                onAbort: () => {}
              });

              for await (const _chunk of result.fullStream) {
                // streaming handled via onChunk above
              }

              // Optionally generate title for new thread
              let generatedTitle: string | undefined = undefined;
              const userTextOnly = (userParts || [])
                .filter((p) => p?.type === "text")
                .map((p) => (p as any).text)
                .join(" ")
                .trim();

              if (!threadId && userTextOnly) {
                try {
                  generatedTitle = await generateThreadTitle({
                    model: finalModel as LanguageModel,
                    userMessage: userTextOnly
                  });
                } catch {}
              }

              // Persist atomically at the end
              await db.transaction(async (trx) => {
                const created = await createThreadAndMessage(trx, {
                  threadId,
                  userId,
                  userMessage: messages
                });

                if (!created) {
                  throw new Error("Unable to create thread or message");
                }

                await trx
                  .update(messageSchema)
                  .set({
                    parts: [{ type: "text", text: accumulatedText }],
                    status: "completed",
                    metadata: {
                      providerId,
                      modelId,
                      keySource: "user",
                      tokenUsage,
                      serverDurationMs: 0
                    }
                  })
                  .where(eq(messageSchema.id, created.newAssistantMessageId));

                if (generatedTitle) {
                  await trx
                    .update(threadSchema)
                    .set({ title: generatedTitle })
                    .where(eq(threadSchema.id, created.newThreadId));
                }
              });
            }
          } catch (error) {
            writer.write({
              type: "error",
              errorText: error instanceof Error ? error.message : "An error occurred"
            });
          }
        },
        onError: (error: any) => {
          console.error("Stream error:", error);
          return error instanceof Error ? error.message : "An error occurred";
        },
        onFinish: () => {
          // stream finished
        }
      });

      return createUIMessageStreamResponse({ stream });
    } catch (err: any) {
      return json(
        { success: false, message: err instanceof Error ? err.message : "Failed to generate" },
        { status: 500 }
      );
    }
  }
});
