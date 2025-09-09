import { pgTable, jsonb, timestamp, serial, text } from "drizzle-orm/pg-core";

import { userSchema } from "@/lib/db/schemas/auth-schema";
import type { AppearanceSettings } from "@/types/preference";

// table schema
export const preferenceSchema = pgTable("preference", {
  id: serial("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),

  appearanceSettings: jsonb("appearance_settings")
    .notNull()
    .default({})
    .$type<AppearanceSettings>(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// types
export type PreferenceSelect = typeof preferenceSchema.$inferSelect;
export type PreferenceInsert = typeof preferenceSchema.$inferInsert;
