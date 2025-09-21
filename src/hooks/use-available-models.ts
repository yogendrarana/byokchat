import React, { useEffect } from "react";
import { useModelStore, type TModel } from "@/store/model-store";

import { getProviderKeys } from "@/routes/settings/providers/-lib/functions";
import { BUILTIN_MODELS, MODEL_PROVIDERS, type TProviderId } from "@/lib/model-providers";

type TAvailableModels = Partial<Record<TProviderId, TModel[]>>;

export const useAvailableModels = () => {
  const [availableModels, setAvailablModels] = React.useState<TAvailableModels>({});

  useEffect(() => {
    const loadModels = async () => {
      let selectedModel = useModelStore.getState().selectedModel;

      const { success, data } = await getProviderKeys();

      if (!success || !data || !selectedModel) {
        selectedModel = BUILTIN_MODELS[0];
        useModelStore.setState({ selectedModel });
      }

      const availableModelsByProvider: TAvailableModels = {};

      for (const providerId in data) {
        const keysForProvider = data[providerId];
        if (keysForProvider.length === 0) continue;

        // Find the provider in MODEL_PROVIDERS
        const provider = MODEL_PROVIDERS.find((p) => p.id === providerId);
        if (!provider) continue;

        availableModelsByProvider[provider.id] = provider.models;
      }

      setAvailablModels(availableModelsByProvider);
    };

    loadModels();
  }, []);

  return { availableModels };
};
