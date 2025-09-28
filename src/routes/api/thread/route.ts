import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import db from "@/lib/db/db";
import { threadsSchema } from "@/lib/db/schema";

export const ServerRoute = createServerFileRoute("/api/thread").methods({
  DELETE: async () => {
    try {
      await db.delete(threadsSchema);

      return json({ success: true, message: "Threads deleted successfully." }, { status: 200 });
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
