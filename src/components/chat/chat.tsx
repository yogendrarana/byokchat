import { toast } from "sonner";

import AiInput from "@/components/ai/ai-input";
import { authClient } from "@/lib/auth/auth-client";
import { USER_PROMPT } from "@/constants/localstorage";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { useChatHelpers } from "@/hooks/use-chat-helpers";

interface ChatProps {
  threadId?: string;
}

function Chat({ threadId }: ChatProps) {
  const promptKey = threadId ? `${USER_PROMPT}_${threadId}` : USER_PROMPT;

  const session = authClient.useSession();
  const [prompt, setPrompt] = useLocalStorage(promptKey, "");
  const { handleSubmit } = useChatHelpers({ threadId: threadId || undefined });

  const handlePromptChange = (prompt: string) => {
    setPrompt(promptKey, prompt);
  };

  const handlePromptSubmit = async () => {
    if (!session?.data?.user) {
      toast.error("You must be logged in to send a message.");
      return;
    }

    try {
      handleSubmit(prompt, []);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      return;
    } finally {
      setPrompt(promptKey, "");
    }
  };

  return (
    <div>
      {/* TODO: if thread id is present render messages */}
      <AiInput onPromptChange={handlePromptChange} value={prompt} onSubmit={handlePromptSubmit} />
    </div>
  );
}

export default Chat;
