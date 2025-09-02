export const MODELS = [
    {
        id: "gpt-4o",
        name: "GPT 4o",
        shortName: "4o",
        adapters: ["openai:gpt-4o", "openrouter:openai/gpt-4o"],
        abilities: ["vision", "function_calling", "pdf"]
    },
    {
        id: "gpt-4o-mini",
        name: "GPT 4o mini",
        shortName: "4o mini",
        adapters: ["i3-openai:gpt-4o-mini", "openai:gpt-4o-mini", "openrouter:openai/gpt-4o-mini"],
        abilities: ["vision", "function_calling", "pdf"]
    }
] as const;
