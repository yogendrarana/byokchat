import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

import type { ApiKeySelect } from "@/lib/db/schema";

export function useApiKeys() {
  const router = useRouter();

  const deleteKey = useMutation({
    mutationFn: async (id: number) => {
      const toastId = toast("Loading...", {
        description: "Deleting the API key...",
      });
      try {
        const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (!res.ok || !data.success)
          throw new Error(data.message || "Failed to delete API key");

        toast.dismiss(toastId);
        toast("Deleted", { description: "API key deleted successfully." });
        return data;
      } catch (err: any) {
        toast.dismiss(toastId);
        toast("Error", { description: err.message || "Something went wrong." });
        throw err;
      }
    },
    onSuccess: async () => {
      await router.invalidate({
        filter: (match) => match.id === "/settings/providers",
      });
    },
  });

  const patchKey = useMutation({
    mutationFn: async (apiKey: ApiKeySelect) => {
      const toastId = toast("Loading...", {
        description: "Updating the API key...",
      });
      try {
        const res = await fetch(`/api/keys/${apiKey.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !apiKey.active }),
        });

        const data = await res.json();
        if (!res.ok || !data.success)
          throw new Error(data.message || "Failed to update API key");
        toast.dismiss(toastId);
        toast("Updated", { description: "API key updated successfully" });
        return data;
      } catch (err: any) {
        toast.dismiss(toastId);
        toast("Error", { description: err.message || "Something went wrong." });
        throw err;
      }
    },
    onSuccess: async () => {
      await router.invalidate({
        filter: (match) => match.id === "/settings/providers",
      });
    },
  });

  return { deleteKey, patchKey };
}
