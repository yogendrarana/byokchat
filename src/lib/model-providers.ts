import Grok from "@/components/icons/groq";
import Gemini from "@/components/icons/gemini";
import OpenAI from "@/components/icons/opeanai";
import Anthropic from "@/components/icons/anthropic";

export interface TModelProvider {
    id: string;
    name: string;
    description: string;
    placeholder: string;
    icon: React.ComponentType<{ className?: string }> | string;
}

export const MODEL_PROVIDERS: TModelProvider[] = [
    {
        id: "openai",
        name: "OpenAI",
        description: "Access AI models from OpenAI such as GPT-4, GPT-4o, o3, and more.",
        placeholder: "sk-...",
        icon: OpenAI
    },
    {
        id: "anthropic",
        name: "Anthropic",
        description: "Access AI models from Anthropic such as Claude 3.5 Sonnet, Opus, and others.",
        placeholder: "sk-...",
        icon: Anthropic
    },
    {
        id: "google",
        name: "Google",
        description: "Access AI models from Google such as Gemini 2.5, Gemini 2.0 Flash, and more.",
        placeholder: "AIza...",
        icon: Gemini
    },
    {
        id: "groq",
        name: "Groq",
        description:
            "Access AI models hosted by Groq for ultra-fast inference, including Llama and Mixtral.",
        placeholder: "gsk_...",
        icon: Grok
    }
];
