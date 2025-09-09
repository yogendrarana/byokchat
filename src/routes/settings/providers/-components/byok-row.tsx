import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { router } from "@/router";
import { cn, maskKey } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ApiKeySelect } from "@/lib/db/schema";

interface PropType {
  apiKey: ApiKeySelect;
}

export function BYOKKeyRow({ apiKey }: PropType) {
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const toastId = toast("Loading...", { description: "Deleting the API key..." });

      try {
        const response = await fetch(`/api/keys/${id}`, { method: "DELETE" });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to delete API key");
        }

        toast.dismiss(toastId);
        toast("Deleted", { description: "API key deleted successfully." });

        return data;
      } catch (error: any) {
        toast.dismiss(toastId);
        toast("Error", { description: error.message || "Something went wrong." });
        throw error;
      }
    },
    onSuccess: async () => {
      await router.invalidate({
        filter: (match) => match.id === "/settings/providers"
      });
    }
  });

  const patchMutation = useMutation({
    mutationFn: async (apiKey: ApiKeySelect) => {
      const toastId = toast("Loading...", { description: "Updating the API key..." });

      try {
        const response = await fetch(`/api/keys/${apiKey.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !apiKey.active })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to update API key");
        }

        toast.dismiss(toastId);
        toast("Updated", { description: "API key updated successfully" });

        return data;
      } catch (error: any) {
        toast.dismiss(toastId);
        toast("Error", { description: error.message || "Something went wrong" });
        throw error;
      }
    },
    onSuccess: async () => {
      await router.invalidate({
        filter: (match) => match.id === "/settings/providers"
      });
    }
  });

  const handlePatchKey = (apiKey: ApiKeySelect) => {
    patchMutation.mutate(apiKey);
  };

  const handleDeleteKey = (id: number) => {
    deleteMutation.mutate(id);
  };

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
          onClick={() => handlePatchKey(apiKey)}
          className={"min-w-[60px] border text-xs"}
        >
          {apiKey.active ? "Active" : "Inactive"}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleDeleteKey(apiKey.id)}
          className={cn("text-destructive border hover:text-destructive h-8 w-8 p-0")}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
