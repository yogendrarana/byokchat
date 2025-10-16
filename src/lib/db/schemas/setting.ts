import { pgTable, jsonb, timestamp, serial, text } from "drizzle-orm/pg-core";

import { userSchema } from "@/lib/db/schemas/auth";
import type { AppearanceSettings } from "@/types/preference";
import type { StorageConfig, DatabaseConfig, EmailConfig } from "@/services/storage-service";

// table schema
export const settingSchema = pgTable("setting", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),

  appearanceSettings: jsonb("appearance_settings")
    .notNull()
    .default({})
    .$type<AppearanceSettings>(),

  storageConfig: jsonb("storage_config").default({}).$type<StorageConfig>(),
  databaseConfig: jsonb("database_config").default({}).$type<DatabaseConfig>(),
  emailConfig: jsonb("email_config").default({}).$type<EmailConfig>(),

  // time stamps
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// types
export type PreferenceSelect = typeof settingSchema.$inferSelect;
export type PreferenceInsert = typeof settingSchema.$inferInsert;
