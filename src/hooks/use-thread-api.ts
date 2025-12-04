import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

export function useThreadApi() {
  const router = useRouter();

  const deleteThread = useMutation({
    mutationFn: async (id: string) => {
      const toastId = toast("Loading...", {
        description: "Deleting the thread...",
      });
      try {
        const res = await fetch(`/api/thread/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (!res.ok || !data.success)
          throw new Error(data.message || "Failed to delete thread");

        toast.dismiss(toastId);
        toast("Deleted", { description: "Thread deleted successfully." });
        return data;
      } catch (err: any) {
        toast.dismiss(toastId);
        toast("Error", { description: err.message || "Something went wrong." });
        throw err;
      }
    },
    onSuccess: async () => {
      await router.invalidate({
        filter: (match) => match.id === "/thread" || match.id === "/thread/$id",
      });
    },
  });

  return { deleteThread };
}
