import type { TModel } from "@/store/model-store";
import Gemini from "@/components/icons/gemini";
import OpenAI from "@/components/icons/opeanai";
import Anthropic from "@/components/icons/anthropic";

// constants
export const CoreProviders = ["openai", "anthropic", "google"] as const;
export const ModelAbilities = [
  "chat",
  "completion",
  "reasoning",
  "vision",
  "code",
  "audio",
  "embedding",
  "multimodal",
  "function-calling"
] as const;

export const ModelModes = ["text", "image", "speech-to-text"] as const;

export const ServerTypes = ["sse", "http"] as const;
export const SearchProviders = ["firecrawl", "brave", "tavily", "serper"] as const;
export const SafesearchLevels = ["off", "moderate", "strict"] as const;

// types
export type TCoreProvider = (typeof CoreProviders)[number];
export type TModelAbility = (typeof ModelAbilities)[number];
export type TSearchProvider = (typeof SearchProviders)[number];
export type TServerType = (typeof ServerTypes)[number];
export type TSafesearchLevel = (typeof SafesearchLevels)[number];

export interface TModelProvider {
  id: TCoreProvider;
  name: string;
  description: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }> | string;
  models: TModel[];
}

// model providers
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
        mode: "text",
        providerId: "openai",
        abilities: ["chat", "reasoning", "code", "vision", "multimodal"]
      },
      {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        mode: "text",
        providerId: "openai",
        abilities: ["chat", "reasoning", "code"]
      },
      {
        id: "o3",
        name: "O3",
        mode: "text",
        providerId: "openai",
        abilities: ["chat", "completion"]
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        mode: "text",
        providerId: "openai",
        abilities: ["chat", "completion", "code"]
      },
      {
        id: "whisper-1",
        name: "Whisper 1",
        providerId: "openai",
        mode: "speech-to-text",
        abilities: []
      },
      {
        id: "dall-e-3",
        name: "DALL·E 3",
        providerId: "openai",
        mode: "image",
        abilities: ["multimodal"]
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
        mode: "text",
        providerId: "anthropic",
        abilities: ["chat", "reasoning", "completion", "vision"]
      },
      {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        mode: "text",
        providerId: "anthropic",
        abilities: ["chat", "reasoning", "completion"]
      },
      {
        id: "claude-2",
        name: "Claude 2",
        mode: "text",
        providerId: "anthropic",
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
        mode: "text",
        providerId: "google",
        abilities: ["chat", "reasoning", "code", "vision", "multimodal"]
      },
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        mode: "text",
        providerId: "google",
        abilities: ["chat", "reasoning"]
      },
      {
        id: "bard",
        name: "Bard",
        mode: "text",
        providerId: "google",
        abilities: ["chat", "reasoning"]
      }
    ]
  }
];