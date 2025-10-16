import { relations } from "drizzle-orm";
import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { userSchema } from "./auth";
import { messageSchema } from "./message";

// thread
export const threadSchema = pgTable("threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
});

// relations
export const threadsRelations = relations(threadSchema, ({ many }) => ({
  messages: many(messageSchema)
}));

// types
export type ThreadsSelect = typeof threadSchema.$inferSelect;
export type ThreadsInsert = typeof threadSchema.$inferInsert;
