import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import db from "@/lib/db/db";
import { threadsSchema } from "@/lib/db/schema";

export const ServerRoute = createServerFileRoute("/api/thread/$id").methods({
  DELETE: async ({ params }) => {
    try {
      const { id } = params;
      if (!id) {
        return json({
          success: false,
          message: "ID is required!"
        });
      }

      await db.delete(threadsSchema).where(eq(threadsSchema.id, id));

      return json({ success: true, message: "Thread key deleted successfully." }, { status: 200 });
    } catch (err: any) {
      return json(
        {
          success: false,
          message: err?.message
        },
        { status: 500 }
      );
    }
  }
});
