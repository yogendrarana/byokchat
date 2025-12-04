import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";

import db from "@/lib/db/db";
import { threadSchema } from "@/lib/db/schema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/thread/$id")({
  server: {
    handlers: {
      DELETE: async ({ params }) => {
        try {
          const { id } = params;
          if (!id) {
            return json({
              success: false,
              message: "ID is required!",
            });
          }

          await db.delete(threadSchema).where(eq(threadSchema.id, id));

          return json(
            { success: true, message: "Thread key deleted successfully." },
            { status: 200 }
          );
        } catch (err: any) {
          return json(
            {
              success: false,
              message: err?.message,
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
