import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

import db from "@/lib/db/db";
import { threadSchema } from "@/lib/db/schema";

export const Route = createFileRoute("/api/thread")({
  server: {
    handlers: {
      DELETE: async () => {
        try {
          await db.delete(threadSchema);

          return json(
            { success: true, message: "Threads deleted successfully." },
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
