import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import type { TProviderId } from "./model-providers";

export function createAiSdkProvider({
  providerId,
  apiKey
}: {
  providerId: TProviderId;
  apiKey: string | "internal";
}) {
  if (apiKey !== "internal" && (!apiKey || apiKey.trim() === "")) {
    throw new Error("Missing api key");
  }

  switch (providerId) {
    case "openai":
      return createOpenAI({
        apiKey: apiKey === "internal" ? process.env.OPENAI_API_KEY : apiKey
      });

    case "anthropic":
      return createAnthropic({
        apiKey: apiKey === "internal" ? process.env.ANTHROPIC_API_KEY : apiKey
      });

    case "google":
      return createGoogleGenerativeAI({
        apiKey: apiKey === "internal" ? process.env.GOOGLE_API_KEY : apiKey
      });

    case "groq":
      return createGroq({
        apiKey: apiKey === "internal" ? process.env.GROQ_API_KEY : apiKey
      });

    default: {
      throw new Error(`Unsupported provider: ${providerId}`);
    }
  }
}
