import React, { useEffect } from "react";
import { type TModel } from "@/store/model-store";

import { getProviderKeys } from "@/routes/settings/providers/-lib/functions";
import { MODEL_PROVIDERS, type TCoreProvider } from "@/lib/model";

type TAvailableModels = Partial<Record<TCoreProvider, TModel[]>>;

export const useAvailableModels = () => {
  const [availableModels, setAvailablModels] = React.useState<TAvailableModels>({});

  useEffect(() => {
    const loadModels = async () => {
      const { data } = await getProviderKeys();

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
