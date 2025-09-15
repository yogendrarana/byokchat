import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { router } from "@/router";

export function useChat() {
  const deleteChat = useMutation({
    mutationFn: async (id: string) => {
      const toastId = toast("Loading...", { description: "Deleting the chat..." });
      try {
        const res = await fetch(`/api/chat/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete chat");

        toast.dismiss(toastId);
        toast("Deleted", { description: "Chat deleted successfully." });
        return data;
      } catch (err: any) {
        toast.dismiss(toastId);
        toast("Error", { description: err.message || "Something went wrong." });
        throw err;
      }
    },
    onSuccess: async () => {
      await router.invalidate({
        filter: (match) => match.id === "/chat" || match.id === "/chat/$id"
      });
    }
  });

  return { deleteChat };
}
