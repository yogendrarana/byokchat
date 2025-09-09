import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Key } from "lucide-react";
import { BYOKKeyForm } from "./byok-form";
import { BYOKKeyRow } from "./byok-row";
import type { TModelProvider } from "@/lib/model-providers";
import type { ApiKeySelect } from "@/lib/db/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface BYOKProviderCardProps {
  provider: TModelProvider;
  keys: Array<ApiKeySelect>;
}

export function BYOKProviderCard({ provider, keys }: BYOKProviderCardProps) {
  const [addingKey, setAddingKey] = useState(false);

  const cancelAddingKey = () => {
    setAddingKey(false);
  };

  const ProviderIcon = provider.icon;

  return (
    <Card className="overflow-hidden rounded-md shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="">
            <div className="flex gap-2 items-center">
              <ProviderIcon className="shrink-0 " />
              <h3 className=" font-semibold">{provider.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{provider.description}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddingKey(true)}
            disabled={addingKey}
            aria-label={`Add API key for ${provider.name}`}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Key
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {addingKey && (
          <div className="mb-3">
            <BYOKKeyForm onCancelAddingKey={cancelAddingKey} provider={provider} />
          </div>
        )}

        {keys.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Key className="w-4 h-4" />
              API Keys
            </div>
            <div className="space-y-2">
              {keys.map((key: ApiKeySelect) => (
                <div key={key.id}>
                  <BYOKKeyRow apiKey={key} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          !addingKey && (
            <div className="text-center py-4 text-sm text-muted-foreground border border-dashed border-border rounded-md">
              No API keys configured
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
