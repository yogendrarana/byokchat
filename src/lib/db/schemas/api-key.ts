import { relations } from "drizzle-orm";
import { pgTable, text, varchar, serial, boolean, timestamp } from "drizzle-orm/pg-core";

import { userSchema } from "./auth";

// Provider Keys table (BYOK)
export const apiKeySchema = pgTable("api_key", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),
  providerId: varchar("provider_id", { length: 50 }).notNull(),
  name: text("name").notNull(),
  key: text("key").notNull(),
  active: boolean("active").default(false).notNull(),

  // time stamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

export const usersRelations = relations(userSchema, ({ many }) => ({
  keys: many(apiKeySchema)
}));

export const providerKeySchemaRelations = relations(apiKeySchema, ({ one }) => ({
  user: one(userSchema, { fields: [apiKeySchema.userId], references: [userSchema.id] })
}));

// types

export type ApiKeySelect = typeof apiKeySchema.$inferSelect;
export type ApiKeyInsert = typeof apiKeySchema.$inferInsert;
