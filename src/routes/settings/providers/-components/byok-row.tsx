import { Trash2 } from "lucide-react";

import { cn, maskKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ApiKeySelect } from "@/lib/db/schema";
import { useApiKeys } from "../-hooks/useApiKeys";

interface PropType {
  apiKey: ApiKeySelect;
}

export function BYOKKeyRow({ apiKey }: PropType) {
  const { deleteKey, patchKey } = useApiKeys();

  return (
    <div className="p-3 border border-dashed flex items-center justify-between rounded-lg">
      <div className="space-y-1">
        <div className="font-medium text-sm">{apiKey.name}</div>
        <div className="text-xs text-muted-foreground font-mono">{maskKey(apiKey.key)}</div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant={apiKey.active ? "secondary" : "outline"}
          size="sm"
          onClick={() => patchKey.mutate(apiKey)}
          className={"min-w-[60px] border text-xs"}
        >
          {apiKey.active ? "Active" : "Inactive"}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => deleteKey.mutate(apiKey.id)}
          className={cn("text-destructive border hover:text-destructive h-8 w-8 p-0")}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
