import { streamText } from "ai";
import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import db from "@/lib/db/db";
import { auth } from "@/lib/auth/auth";
import { createAiSdkProvider } from "@/lib/model";
import { messagesSchema, threadsSchema } from "@/lib/db/schema";

export const ServerRoute = createServerFileRoute("/api/chat").methods({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const { id, messages = [], modelName: rawModelName = "", providerId } = body;
      const modelName = rawModelName.toString();

      // Authenticate user from request headers
      const session = await auth.api.getSession({
        headers: request.headers
      });

      if (!session?.user?.id) {
        return json({ success: false, message: "Unauthorized" }, { status: 401 });
      }

      if (!id) {
        return json({ success: false, message: "ID is required!" }, { status: 400 });
      }

      const chat = await db.query.threadsSchema.findFirst({
        where: (table, { and, eq }) => and(eq(table.id, id), eq(table.userId, session.user.id))
      });

      if (!chat) {
        return json({ success: false, message: "Chat not found" }, { status: 404 });
      }

      if (!messages || messages.length === 0) {
        return json({ success: false, message: "Messages are required" }, { status: 400 });
      }

      if (!modelName) {
        return json({ success: false, message: "modelName is required" }, { status: 400 });
      }

      if (!providerId) {
        return json(
          { success: false, message: "Unable to infer provider for model" },
          { status: 400 }
        );
      }

      // Find active API key for user/provider
      const userActiveKey = await db.query.apiKeySchema.findFirst({
        where: (table, { and, eq }) =>
          and(
            eq(table.userId, session.user.id),
            eq(table.providerId, providerId!),
            eq(table.active, true)
          )
      });

      const apiKeyToUse = userActiveKey?.key ?? "internal";

      // Create AI SDK client with provider and key
      const providerClient = createAiSdkProvider({
        providerId,
        apiKey: apiKeyToUse
      });

      // Save the last user message to database
      const lastUserMessage = messages.filter((msg: any) => msg.role === "user").pop();

      if (lastUserMessage) {
        await db.insert(messagesSchema).values({
          threadId: id,
          role: "user",
          content: lastUserMessage.content
        });
      }

      // Insert an empty assistant message to be updated as streaming occurs
      const aiMessage = await db
        .insert(messagesSchema)
        .values({
          threadId: id,
          role: "assistant",
          content: { parts: [] }
        })
        .returning();

      const aiMessageId = aiMessage[0].id;

      // Format messages to AI SDK format
      const aiSdkMessages = messages.map((msg: any) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content
      }));

      // Stream AI response and capture chunks to update DB
      const result = streamText({
        model: providerClient(modelName),
        messages: aiSdkMessages
      });

      let fullResponse = "";

      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          try {
            const text = new TextDecoder().decode(chunk);
            fullResponse += text;

            if (fullResponse.length % 200 === 0) {
              await db
                .update(messagesSchema)
                .set({
                  content: { parts: [{ type: "text", text: fullResponse }] },
                  updatedAt: new Date()
                })
                .where(eq(messagesSchema.id, aiMessageId));
            }

            controller.enqueue(chunk);
          } catch (error) {
            console.error("Error saving chunk:", error);
            controller.enqueue(chunk);
          }
        },

        async flush() {
          try {
            await db
              .update(messagesSchema)
              .set({
                content: { parts: [{ type: "text", text: fullResponse }] },
                updatedAt: new Date()
              })
              .where(eq(messagesSchema.id, aiMessageId));

            await db
              .update(threadsSchema)
              .set({ updatedAt: new Date() })
              .where(eq(threadsSchema.id, id));
          } catch (error) {
            console.error("Error saving final response:", error);
          }
        }
      });

      return new Response(result.toUIMessageStream().pipeThrough(transformStream), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked"
        }
      });
    } catch (err: any) {
      return json(
        { success: false, message: err?.message || "Failed to generate" },
        { status: 500 }
      );
    }
  }
});
