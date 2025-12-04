import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

import db from "@/lib/db/db";
import { auth } from "@/lib/auth/auth";
import { settingSchema } from "@/lib/db/schema";
import type { StorageConfig, DatabaseConfig, EmailConfig } from "@/services/storage-service";

export const Route = createFileRoute("/api/settings/storage")({
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

          const {
            storageConfig,
            databaseConfig,
            emailConfig
          }: {
            storageConfig: StorageConfig;
            databaseConfig: DatabaseConfig;
            emailConfig: EmailConfig;
          } = await request.json();

          // Validate configurations
          if (!storageConfig?.provider) {
            return json({ success: false, message: "Storage provider is required" }, { status: 400 });
          }

          if (!databaseConfig?.provider) {
            return json({ success: false, message: "Database provider is required" }, { status: 400 });
          }

          // Update or create user settings
          const existingSettings = await db.query.settingSchema.findFirst({
            where: (table, { eq }) => eq(table.userId, session.user.id)
          });

          if (existingSettings) {
            // Update existing settings
            await db
              .update(settingSchema)
              .set({
                storageConfig,
                databaseConfig,
                emailConfig,
                updatedAt: new Date()
              })
              .where(eq(settingSchema.userId, session.user.id));
          } else {
            // Create new settings
            await db.insert(settingSchema).values({
              userId: session.user.id,
              storageConfig,
              databaseConfig,
              emailConfig
            });
          }

          return json({
            success: true,
            message: "Storage and database configurations saved successfully"
          });
        } catch (error) {
          console.error("Storage settings save error:", error);
          return json(
            {
              success: false,
              message: error instanceof Error ? error.message : "Failed to save storage configuration"
            },
            { status: 500 }
          );
        }
      },

      GET: async ({ request }) => {
        try {
          // Authenticate user
          const session = await auth.api.getSession({
            headers: request.headers
          });

          if (!session?.user?.id) {
            return json({ success: false, message: "Unauthorized" }, { status: 401 });
          }

          // Get user settings
          const settings = await db.query.settingSchema.findFirst({
            where: (table, { eq }) => eq(table.userId, session.user.id)
          });

          const storageConfig = settings?.storageConfig || {
            provider: "local" as const,
            credentials: {},
            options: {}
          };

          const emailConfig = settings?.emailConfig || {
            provider: "resend" as const,
            credentials: {
              apiKey: ""
            },
            options: {}
          };

          const databaseConfig = settings?.databaseConfig || {
            provider: "postgresql",
            credentials: {
              host: "",
              port: "",
              database: "",
              username: "",
              password: ""
            },
            options: {}
          };

          return json(
            {
              success: true,
              data: {
                storageConfig,
                databaseConfig,
                emailConfig
              }
            },
            { status: 200 } // Fixed: was 400, should be 200 for success
          );
        } catch (error) {
          console.error("Storage settings get error:", error);
          return json(
            {
              success: false,
              message: error instanceof Error ? error.message : "Failed to get storage configuration"
            },
            { status: 500 }
          );
        }
      }
    }
  }
});
