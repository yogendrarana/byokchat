import React from "react";
import { toast } from "sonner";
import { Key, LoaderIcon, Save, Shield, X } from "lucide-react";

import { router } from "@/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ApiKeyInsert } from "@/lib/db/schema";
import { authClient } from "@/lib/auth/auth-client";
import { useMutation } from "@tanstack/react-query";
import { postProviderKeys } from "../-lib/functions";
import type { TModelProvider } from "@/lib/model-providers";

interface BYOKKeyFormProps {
  onCancelAddingKey: () => void;
  isEditing?: boolean;
  provider: TModelProvider;
}

export function BYOKKeyForm({ onCancelAddingKey, isEditing = false, provider }: BYOKKeyFormProps) {
  const session = authClient.useSession();

  const [keyName, setKeyName] = React.useState("");
  const [keyValue, setKeyValue] = React.useState("");

  const insertKeyMutation = useMutation({
    mutationFn: async (newKey: Omit<ApiKeyInsert, "userId">) => {
      if (!newKey.name || !newKey.key) {
        throw new Error("Key name and key value are required");
      }
      const response = await postProviderKeys({ data: newKey });
      if (!response.success) {
        throw new Error(response.message || "Failed to save key");
      }
      return response;
    },
    onSuccess: async (response) => {
      setKeyName("");
      setKeyValue("");
      onCancelAddingKey?.();
      toast.success("Success", { description: response.message });
      await router.invalidate({
        filter: (match) => match.id === "/settings/providers"
      });
    },
    onError: (error: any) => {
      toast.error("Error", { description: error.message || "Unexpected error saving key" });
    }
  });

  const handleSaveKey = () => {
    insertKeyMutation.mutate({
      name: keyName,
      key: keyValue,
      providerId: provider.id,
      active: true
    });
  };

  return (
    <div className="p-4 border border-dashed rounded-lg space-y-4">
      {/* Form fields */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label
            htmlFor={`${isEditing ? "edit" : "add"}-name-${provider.id}`}
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Key className="w-4 h-4" />
            Key Name
          </Label>
          <Input
            id={`${isEditing ? "edit" : "add"}-name-${provider.id}`}
            placeholder="e.g., Production Key"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="mt-1.5"
            required
          />
        </div>
        <div className="flex-1">
          <Label
            htmlFor={`${isEditing ? "edit" : "add"}-key-${provider.id}`}
            className="text-sm font-medium flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4" />
            API Key
          </Label>
          <Input
            id={`${isEditing ? "edit" : "add"}-key-${provider.id}`}
            type="password"
            placeholder={provider.placeholder}
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            className="mt-1.5"
            required
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancelAddingKey}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSaveKey}
          disabled={!keyName || !keyValue || session.isPending || insertKeyMutation.isPending}
        >
          {insertKeyMutation.isPending ? (
            <LoaderIcon size={14} className="animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save
        </Button>
      </div>
    </div>
  );
}
