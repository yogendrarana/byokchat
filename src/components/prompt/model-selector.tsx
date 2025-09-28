import { useModelStore } from "@/store/model-store";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { BUILTIN_MODELS } from "@/lib/model-providers";
import { PromptAction } from "./prompt";
import { useAvailableModels } from "@/hooks/use-available-models";
import type { TModel } from "@/store/model-store";

function ModelSelectItem({ model }: { model: TModel }) {
  return (
    <SelectItem key={model.id} value={model.id}>
      {model.name}
    </SelectItem>
  );
}

export default function ModelSelector() {
  const { availableModels } = useAvailableModels();
  const { selectedModel, setSelectedModel } = useModelStore();

  return (
    <div>
      <PromptAction tooltip="Select model">
        <Select
          value={selectedModel?.id}
          onValueChange={(id) => {
            let foundModel: TModel | undefined;

            for (const models of Object.values(availableModels)) {
              foundModel = models.find((m) => m.id === id);
              if (foundModel) break;
            }

            if (!foundModel) {
              foundModel = BUILTIN_MODELS.find((m) => m.id === id);
            }

            if (foundModel) {
              setSelectedModel(foundModel);
            }
          }}
        >
          <SelectTrigger size="sm" className="h-8 w-32 text-xs cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(availableModels).map(([providerId, models]) => {
              if (!models || models.length === 0) return null;
              return (
                <SelectGroup key={providerId}>
                  <SelectLabel>{providerId}</SelectLabel>
                  {models.map((model) => (
                    <ModelSelectItem key={model.id} model={model} />
                  ))}
                </SelectGroup>
              );
            })}
            <SelectGroup key="builtin">
              <SelectLabel>Built-in</SelectLabel>
              {BUILTIN_MODELS.map((model) => (
                <ModelSelectItem key={model.id} model={model} />
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </PromptAction>
    </div>
  );
}
