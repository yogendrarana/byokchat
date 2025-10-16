import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import db from "@/lib/db/db";
import { auth } from "@/lib/auth/auth";
import type { ApiResponse } from "@/types/api";
import { MODEL_PROVIDERS } from "@/lib/model";
import { apiKeySchema, type ApiKeyInsert } from "@/lib/db/schema";

// get provider keys
export const getProviderKeys = createServerFn().handler(async () => {
  const request = getWebRequest();
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const keys = await db.query.apiKeySchema.findMany({
    where: (table, { eq }) => eq(table.userId, session.user.id),
    orderBy: (table, { desc }) => desc(table.createdAt)
  });

  const providers = MODEL_PROVIDERS.map((provider) => provider.id);

  const grouped = keys.reduce<Record<string, typeof keys>>((acc, item) => {
    if (!acc[item.providerId]) {
      acc[item.providerId] = [];
    }
    acc[item.providerId].push(item);
    return acc;
  }, {});

  // Ensure every providerId has at least an empty array
  const normalized = providers.reduce<Record<string, typeof keys>>((acc, provider) => {
    acc[provider] = grouped[provider] ?? [];
    return acc;
  }, {});

  return {
    success: true,
    message: "Fetched user keys successfully!",
    data: normalized
  };
});

// post provider keys
export const postProviderKeys = createServerFn({ method: "POST" })
  .validator((data: Omit<ApiKeyInsert, "userId">) => data)
  .handler(async (context): Promise<ApiResponse<ApiKeyInsert>> => {
    const { name, key, providerId, active } = context.data;

    try {
      const request = getWebRequest();
      const session = await auth.api.getSession({
        headers: request.headers
      });

      if (!session) {
        return { success: false, message: "Unauthorized" };
      }

      const [inserted] = await db
        .insert(apiKeySchema)
        .values({
          name,
          key,
          userId: session.user.id,
          providerId,
          active
        })
        .returning();

      return {
        success: true,
        message: "Provider key inserted successfully",
        data: inserted
      };
    } catch (error: any) {
      return { success: false, message: error.message || "Failed inserting provider key" };
    }
  });
