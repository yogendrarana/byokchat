import Grok from "@/components/icons/groq";
import Gemini from "@/components/icons/gemini";
import OpenAI from "@/components/icons/opeanai";
import Anthropic from "@/components/icons/anthropic";
import type { TModel } from "@/store/model-store";

export type TProviderId = "openai" | "anthropic" | "google" | "groq";

export interface TModelProvider {
  id: TProviderId;
  name: string;
  description: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }> | string;
  models: TModel[];
}

export const MODEL_PROVIDERS: TModelProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Access AI models from OpenAI such as GPT-4, GPT-4o, o3, and more.",
    placeholder: "sk-...",
    icon: OpenAI,
    models: [
      {
        id: "gpt-4o",
        name: "GPT-4o",
        abilities: ["chat", "reasoning", "code", "vision", "multimodal"]
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        abilities: ["chat", "reasoning", "code"]
      },
      {
        id: "o3",
        name: "O3",
        abilities: ["chat", "completion"]
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        abilities: ["chat", "completion", "code"]
      },
      {
        id: "whisper-1",
        name: "Whisper 1",
        abilities: ["audio"]
      },
      {
        id: "dall-e-3",
        name: "DALL·E 3",
        abilities: ["vision"]
      }
    ]
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Access AI models from Anthropic such as Claude 3.5 Sonnet, Opus, and others.",
    placeholder: "sk-...",
    icon: Anthropic,
    models: [
      {
        id: "claude-3.5-sonnet",
        name: "Claude 3.5 Sonnet",
        abilities: ["chat", "reasoning", "completion"]
      },
      {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        abilities: ["chat", "reasoning", "completion"]
      },
      {
        id: "claude-2",
        name: "Claude 2",
        abilities: ["chat", "reasoning", "completion"]
      }
    ]
  },
  {
    id: "google",
    name: "Google",
    description: "Access AI models from Google such as Gemini 2.5, Gemini 2.0 Flash, and more.",
    placeholder: "AIza...",
    icon: Gemini,
    models: [
      {
        id: "gemini-2.5",
        name: "Gemini 2.5",
        abilities: ["chat", "reasoning", "code", "vision"]
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        abilities: ["chat", "reasoning"]
      },
      {
        id: "bard",
        name: "Bard",
        abilities: ["chat", "reasoning"]
      }
    ]
  },
  {
    id: "groq",
    name: "Groq",
    description:
      "Access AI models hosted by Groq for ultra-fast inference, including Llama and Mixtral.",
    placeholder: "gsk_...",
    icon: Grok,
    models: [
      {
        id: "llama-3",
        name: "LLaMA-3",
        abilities: ["chat", "reasoning", "completion"]
      },
      {
        id: "mixtral-8x7b",
        name: "Mixtral 8×7B",
        abilities: ["chat", "reasoning"]
      }
    ]
  }
];

// free model providers
export const BUILTIN_MODELS: TModel[] = [
  {
    id: "gpt-3.5-turbo-free",
    name: "GPT-3.5 Turbo (Free Tier)",
    abilities: ["chat", "completion", "code"]
  }
];
