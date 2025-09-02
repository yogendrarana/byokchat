import { MODEL_STORE, HERO_PAGE_PROMPT } from "@/constants/localstorage";
import { ModelStoreSchema, type TModelStore } from "@/store/model-store";

// helper functions
export const getModelStore = (): TModelStore => {
    const stored = localStorage.getItem(MODEL_STORE);

    if (typeof window === "undefined" || !stored) {
        return { selectedModel: null };
    }

    try {
        const parsed = JSON.parse(stored);
        return ModelStoreSchema.parse(parsed);
    } catch (err) {
        return {
            selectedModel: null
        };
    }
};

export const getHeroPagePrompt = (): string => {
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem(HERO_PAGE_PROMPT);
    return stored?.trim() ?? "";
};
