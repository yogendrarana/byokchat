import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import db from "@/lib/db/db";
import { apiKeySchema, type ApiKeyInsert } from "@/lib/db/schema";

export const ServerRoute = createServerFileRoute("/api/keys/$id").methods({
  DELETE: async ({ params }) => {
    try {
      const { id } = params;
      if (!id) {
        return json({
          success: false,
          message: "ID is required!"
        });
      }

      await db.delete(apiKeySchema).where(eq(apiKeySchema.id, Number(id)));

      return json({ success: true, message: "API key deleted successfully." });
    } catch (err: any) {
      return json({
        success: false,
        message: err?.message
      });
    }
  },
  PATCH: async ({ request, params }) => {
    try {
      const { id } = params;

      const body = (await request.json()) as ApiKeyInsert;
      const { active } = body;

      if (!id) {
        return json({
          success: false,
          message: "ID is required!"
        });
      }

      await db
        .update(apiKeySchema)
        .set({ active })
        .where(eq(apiKeySchema.id, Number(id)));

      return json({ success: true, message: "API key updated successfully." });
    } catch (err: any) {
      return json({
        success: false,
        message: err?.message
      });
    }
  }
});
