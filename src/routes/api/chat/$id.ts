import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import db from "@/lib/db/db";
import { chatsSchema } from "@/lib/db/schema";

export const ServerRoute = createServerFileRoute("/api/chat/$id").methods({
  DELETE: async ({ params }) => {
    try {
      const { id } = params;
      if (!id) {
        return json({
          success: false,
          message: "ID is required!"
        });
      }

      await db.delete(chatsSchema).where(eq(chatsSchema.id, id));

      return json({ success: true, message: "API key deleted successfully." });
    } catch (err: any) {
      return json({
        success: false,
        message: err?.message
      });
    }
  }
});
