import { auth } from "@/lib/auth/auth";

import db from "@/lib/db/db";
import type { ApiResponse } from "@/types/api";
import { chatsSchema, type ChatsSelect } from "@/lib/db/schema";
import { createServerFn, json } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { ChatSchema, type TChatSchema } from "./validations";

// get user chats
export const getUserChats = createServerFn().handler<ApiResponse<Array<ChatsSelect>>>(async () => {
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

    const chats = await db.query.chatsSchema.findMany({
      where: (table, { eq }) => eq(table.userId, session.user.id),
      orderBy: (table, { desc }) => desc(table.createdAt)
    });

    return {
      success: true,
      message: "Fetched user chats successfully!",
      data: chats || []
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Something went wrong!"
    };
  }
});

// post user chat
export const postUserChat = createServerFn({ method: "POST" })
  .validator((data: TChatSchema) => {
    const result = ChatSchema.safeParse(data);
    if (!result.success || result.error) {
      throw json({ success: false, message: "Invalid input data." }, { status: 400 });
    }

    return result.data;
  })
  .handler<ApiResponse<ChatsSelect>>(async ({ data }) => {
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

      const chats = await db
        .insert(chatsSchema)
        .values({
          ...data,
          userId: session.user.id
        })
        .returning();

      return {
        success: true,
        message: "Inserted new chat successfully.",
        data: chats[0]
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Something went wrong!"
      };
    }
  });
