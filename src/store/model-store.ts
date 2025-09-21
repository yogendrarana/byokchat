import z from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { MODEL_STORE } from "@/constants/localstorage";

// schema and type
const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  abilities: z.array(
    z.enum([
      "chat",
      "completion",
      "reasoning",
      "vision",
      "code",
      "audio",
      "embedding",
      "multimodal"
    ])
  )
});

export const ModelStoreSchema = z.object({
  selectedModel: ModelSchema.nullable()
});

export type TModel = z.infer<typeof ModelSchema>;
export type TModelStore = z.infer<typeof ModelStoreSchema>;

// --- Initial State ---
const getAiConfig = (): TModelStore => {
  if (typeof window === "undefined") return { selectedModel: null };

  const stored = localStorage.getItem(MODEL_STORE);
  if (!stored) return { selectedModel: null };

  try {
    return ModelStoreSchema.parse(JSON.parse(stored));
  } catch {
    return { selectedModel: null };
  }
};

const initialState = getAiConfig();

// zustand store
export const useModelStore = create<
  TModelStore & {
    setSelectedModel: (model: TModel | null) => void;
  }
>()(
  persist(
    (set, get) => ({
      // states
      selectedModel: initialState.selectedModel,

      // actions
      setSelectedModel: (model) => {
        if (get().selectedModel?.id !== model?.id) {
          set({ selectedModel: model });
        }
      }
    }),
    {
      name: MODEL_STORE,
      partialize: (state) => ({
        selectedModel: state.selectedModel
      })
    }
  )
);
