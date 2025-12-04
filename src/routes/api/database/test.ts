import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth/auth";
import { testDatabaseConnection, type DatabaseConfig } from "@/services/storage-service";

export const Route = createFileRoute("/api/database/test")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Authenticate user
          const session = await auth.api.getSession({
            headers: request.headers
          });

          if (!session?.user?.id) {
            return json({ success: false, message: "Unauthorized" }, { status: 401 });
          }

          const databaseConfig: DatabaseConfig = await request.json();

          // Validate database configuration
          if (!databaseConfig.provider) {
            return json({ success: false, message: "Database provider is required" }, { status: 400 });
          }

          // Test the database connection
          const result = await testDatabaseConnection(
            databaseConfig.provider,
            databaseConfig
          );

          if (result.success) {
            return json({
              success: true,
              message: result.message
            });
          } else {
            return json({
              success: false,
              message: result.message
            });
          }
        } catch (error) {
          console.error("Database test error:", error);
          return json(
            { success: false, message: error instanceof Error ? error.message : "Database test failed" },
            { status: 500 }
          );
        }
      }
    }
  }
});
