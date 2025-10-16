import { type Transaction } from "./db/db";
import { messageSchema, threadSchema, type MessagesInsert, type ThreadsSelect } from "./db/schema";

export async function createThreadAndMessage(
  trx: Transaction,
  data: { threadId?: string; userId: string; userMessage: Partial<MessagesInsert> }
): Promise<
  { newThreadId: string; newUserMessageId: string; newAssistantMessageId: string } | undefined
> {
  let thread: ThreadsSelect | undefined = undefined;

  if (data?.threadId) {
    thread = await trx.query.threadSchema.findFirst({
      where: (table, { eq }) => eq(table.id, data.threadId as string)
    });
  } else {
    const newThreads = await trx
      .insert(threadSchema)
      .values({
        userId: data.userId,
        title: "Untitled"
      })
      .returning();

    thread = newThreads?.[0];
  }

  if (!thread) {
    return undefined;
  }

  const newUserMessages = await trx
    .insert(messageSchema)
    .values({
      threadId: thread.id,
      role: data.userMessage.role ?? "user",
      status: "completed",
      parts: data.userMessage.parts ?? [],
      metadata: {}
    })
    .returning();

  const newUserMessage = newUserMessages[0];

  const newAssistantMessages = await trx
    .insert(messageSchema)
    .values({
      threadId: thread.id,
      role: "assistant",
      status: "in_progress",
      parts: [],
      metadata: {}
    })
    .returning();

  const newAssistantMessage = newAssistantMessages[0];

  return {
    newThreadId: thread.id,
    newUserMessageId: newUserMessage.id,
    newAssistantMessageId: newAssistantMessage.id
  };
}
