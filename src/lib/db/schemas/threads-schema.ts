import { relations } from "drizzle-orm";
import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { userSchema } from "./auth-schema";
import { messagesSchema } from "./messages-schema";

// thread
export const threadsSchema = pgTable("threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
});

// relations
export const threadsRelations = relations(threadsSchema, ({ many }) => ({
  messages: many(messagesSchema)
}));

// types
export type ThreadsSelect = typeof threadsSchema.$inferSelect;
export type ThreadsInsert = typeof threadsSchema.$inferInsert;
