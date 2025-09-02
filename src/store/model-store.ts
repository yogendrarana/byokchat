import z from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getModelStore } from "@/lib/persistence";
import { MODEL_STORE } from "@/constants/localstorage";

export const ModelStoreSchema = z.object({
    selectedModel: z.string().nullable()
});

export type TModelStore = z.infer<typeof ModelStoreSchema>;

// initial state
const initialState = getModelStore();

export const useModelStore = create<TModelStore>()(
    persist<TModelStore>(
        (set, get) => ({
            // states
            selectedModel: initialState.selectedModel,

            // actions
            setSelectedModel: (model: string) => {
                const currentState = get();
                if (currentState.selectedModel !== model) {
                    set({ selectedModel: model });
                }
            }
        }),
        { name: MODEL_STORE }
    )
);
