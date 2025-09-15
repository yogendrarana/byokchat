import { relations } from "drizzle-orm";
import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { userSchema } from "./auth-schema";

export const chatsSchema = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const chatMessagesSchema = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatsSchema.id, { onDelete: "cascade" }),
  modelName: varchar("model_name", { length: 100 }).notNull(),
  requestText: text("request_text").notNull(),
  responseText: text("response_text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

// relations
export const chatsRelations = relations(chatsSchema, ({ many }) => ({
  messages: many(chatMessagesSchema)
}));

export const chatMessagesRelations = relations(chatMessagesSchema, ({ one }) => ({
  chat: one(chatsSchema, {
    fields: [chatMessagesSchema.chatId],
    references: [chatsSchema.id]
  })
}));

// types
export type ChatsSelect = typeof chatsSchema.$inferSelect;
export type ChatsInsert = typeof chatsSchema.$inferInsert;
export type ChatMessagesSelect = typeof chatMessagesSchema.$inferSelect;
export type ChatMessagesInsert = typeof chatMessagesSchema.$inferSelect;
