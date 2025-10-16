import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

import { threadSchema } from "./thread";
import type { MessagePart } from "@/types/message";
import type { LanguageModelUsage } from "ai";

// Messages schema
export const messageSchema = pgTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => threadSchema.id, { onDelete: "cascade" }),

  role: text("role").$type<"user" | "assistant" | "system" | "tool">().notNull(),
  status: text("status").$type<"in_progress" | "completed" | "failed">().default("completed"),

  // content for user message and parts for assistant message
  content: text("content").default(""),
  parts: jsonb("parts").$type<MessagePart[]>().notNull(),

  // metadata
  metadata: jsonb("metadata").default({}).$type<{
    providerId?: string;
    modelId?: string;
    keySource?: "user" | "internal";
    promptTokens?: number;
    serverDurationMs?: number;
    tokenUsage?: LanguageModelUsage;
  }>(),

  // timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
});

// Relations
export const messagesRelations = relations(messageSchema, ({ one }) => ({
  thread: one(threadSchema, {
    fields: [messageSchema.threadId],
    references: [threadSchema.id]
  })
}));

// Types for convenience
export type MessagesSelect = typeof messageSchema.$inferSelect;
export type MessagesInsert = typeof messageSchema.$inferInsert;
