import { createServerFn, json } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import db from "../db/db";
import { auth } from "../auth/auth";
import type { ApiResponse } from "@/types/api";
import type { MessagesSelect } from "../db/schema";

export const getThreadMessages = createServerFn()
  .validator((data: { threadId: string }) => {
    if (!data.threadId || typeof data.threadId !== "string") {
      throw json({ success: false, message: "threadId is required and must be a string" });
    }
    return data;
  })
  .handler<ApiResponse<Array<MessagesSelect>>>(async ({ data }) => {
    try {
      const request = getWebRequest();
      const session = await auth.api.getSession({
        headers: request.headers
      });

      if (!session?.user?.id) {
        return {
          success: false,
          message: "Unauthorized"
        };
      }

      const threadId = data.threadId;

      const chatMessages = await db.query.messagesSchema.findMany({
        where: (table, { eq }) => eq(table.threadId, threadId),
        orderBy: (table, { desc }) => desc(table.createdAt)
      });

      return {
        success: true,
        message: "Fetched the chat messages successfully!",
        data: chatMessages || []
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "An error occurred",
        data: []
      };
    }
  });
