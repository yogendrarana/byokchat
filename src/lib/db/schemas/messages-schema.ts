import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

import { threadsSchema } from "./threads-schema";

// Message Part Types
export type TextPart = {
  type: "text";
  text: string;
};

export type ImagePart = {
  type: "image";
  image: string;
  mimeType: string;
};

export type ReasoningPart = {
  type: "reasoning";
  reasoning: string;
  signature?: string;
  duration?: number;
  details?: Array<{
    type: "text" | "redacted";
    text?: string;
    data?: string;
    signature?: string;
  }>;
};

export type FilePart = {
  type: "file";
  data: string;
  filename?: string;
  mimeType?: string;
};

export type ErrorUIPart = {
  type: "error";
  error: {
    code: string;
    message: string;
  };
};

export type ToolInvocationUIPart = {
  type: "tool-invocation";
  toolInvocation: {
    state: "call" | "result" | "partial-call";
    args?: any;
    result?: any;
    toolCallId: string;
    toolName: string;
    step?: number;
  };
};

// Union of all parts
export type MessagePart =
  | TextPart
  | ImagePart
  | ReasoningPart
  | FilePart
  | ErrorUIPart
  | ToolInvocationUIPart;

// Messages schema
export const messagesSchema = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => threadsSchema.id, { onDelete: "cascade" }),

  role: text("role").$type<"user" | "assistant" | "system" | "tool">().notNull(),
  status: text("status").$type<"in_progress" | "completed" | "failed">().default("completed"),

  // content = array of message parts
  content: jsonb("content").$type<MessagePart[]>().notNull(),

  // metadata
  metadata: jsonb("metadata").default({}).$type<{
    providerId?: string;
    modelId?: string;
    promptTokens?: number;
    completionTokens?: number;
    reasoningTokens?: number;
    serverDurationMs?: number;
  }>(),

  // timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
});

// Relations
export const messagesRelations = relations(messagesSchema, ({ one }) => ({
  thread: one(threadsSchema, {
    fields: [messagesSchema.threadId],
    references: [threadsSchema.id]
  })
}));

// Types for convenience
export type MessagesSelect = typeof messagesSchema.$inferSelect;
export type MessagesInsert = typeof messagesSchema.$inferInsert;
