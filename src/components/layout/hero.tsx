import { toast } from "sonner";
import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";

import {
  PromptActions,
  PromptProvider,
  PromptTextarea,
  PromptInputContainer
} from "../prompt/prompt";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { HERO_PAGE_PROMPT } from "@/constants/localstorage";
import { postUserChat } from "@/routes/chat/-lib/functions";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "../ui/dialog";
import MaxWidthContainer from "../max-width-container";

export default function Hero({ className }: { className?: string }) {
  const router = useRouter();
  const session = authClient.useSession();

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [prompt, setPrompt] = useLocalStorage(HERO_PAGE_PROMPT, "");

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
  };

  const handlePromptSubmit = async () => {
    if (!session?.data?.user) {
      setShowLoginDialog(true);
      return;
    }

    const truncatedTitle = prompt.length > 255 ? prompt.slice(0, 255) : prompt;

    try {
      const {
        success,
        message,
        data: createdChat
      } = await postUserChat({ data: { title: truncatedTitle } });

      if (success && createdChat?.id) {
        toast.success(message || "Chat created successfully!");
        router.navigate({ to: `/chat/${createdChat.id}` });
        setPrompt("");
      } else {
        toast.error(message || "Failed to create chat");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error creating chat");
    }
  };

  return (
    <section id="hero" className="flex-1 flex flex-col border-b">
      <MaxWidthContainer className="flex-1 flex flex-col sm:border-l sm:border-r">
        <main className="max-w-3xl mx-auto flex-1 flex flex-col justify-center py-30">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
              Chat with AI Instantly
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Ask questions, brainstorm ideas, or get insights—our AI delivers smart responses in
              real time.
            </p>
          </div>

          <PromptProvider initialPrompt={prompt} initialModel="gpt-4">
            <PromptInputContainer showCredits>
              <PromptTextarea onChange={handlePromptChange} rows={5} />
              <PromptActions onSubmit={handlePromptSubmit} />
            </PromptInputContainer>
          </PromptProvider>
        </main>

        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="sm:max-w-md ">
            <DialogHeader className="mb-6 text-center">
              <DialogTitle className="text-2xl font-semibold text-gray-900">
                Sign in to continue
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                You need an account to generate ads
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <Link className={cn(buttonVariants())} to="/auth/login">
                Login
              </Link>
              <Link to="/auth/register" className={cn(buttonVariants({ variant: "outline" }))}>
                Register
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      </MaxWidthContainer>
    </section>
  );
}
