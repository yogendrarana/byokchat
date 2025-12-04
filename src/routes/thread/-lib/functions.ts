import { auth } from "@/lib/auth/auth";
import { createServerFn, json } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import db from "@/lib/db/db";
import { ThreadSchema, type TThreadSchema } from "./validations";
import {
  threadSchema,
  type MessagesSelect,
  type ThreadsSelect,
} from "@/lib/db/schema";

export type ThreadsWithMessages = ThreadsSelect & {
  messages: MessagesSelect[];
};

// get user threads
export const getUserThreads = createServerFn().handler(async () => {
  try {
    const request = getRequest();
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const threads = await db.query.threadSchema.findMany({
      where: (table, { eq }) => eq(table.userId, session.user.id),
      orderBy: (table, { desc }) => desc(table.createdAt),
      with: {
        messages: {
          orderBy(table, { desc }) {
            return desc(table.createdAt);
          },
        },
      },
    });

    return {
      success: true,
      message: "Fetched user threads successfully!",
      data: threads || [],
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Something went wrong!",
    };
  }
});

// post user thread
export const postThread = createServerFn({ method: "POST" })
  .inputValidator((data: TThreadSchema) => {
    const result = ThreadSchema.safeParse(data);
    if (!result.success || result.error) {
      throw json(
        { success: false, message: "Invalid input data." },
        { status: 400 }
      );
    }

    return result.data;
  })
  .handler(async ({ data }) => {
    try {
      const request = getRequest();
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user?.id) {
        return {
          success: false,
          message: "Unauthorized",
        };
      }

      const threads = await db
        .insert(threadSchema)
        .values({
          ...data,
          userId: session.user.id,
        })
        .returning();

      return {
        success: true,
        message: "Inserted new threads successfully.",
        data: threads[0],
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Something went wrong!",
      };
    }
  });
