import { toast } from "sonner";
import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import AiInput from "../prompt/ai-input";
import { buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth/auth-client";
import MaxWidthContainer from "../max-width-container";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { USER_PROMPT } from "@/constants/localstorage";
import { postThread } from "@/routes/thread/-lib/functions";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "../ui/dialog";

export default function Hero({ className }: { className?: string }) {
  const router = useRouter();
  const session = authClient.useSession();

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [prompt, setPrompt] = useLocalStorage(USER_PROMPT, "");

  const handlePromptChange = (prompt: string) => {
    setPrompt(prompt);
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
        data: chreatedThread
      } = await postThread({ data: { title: truncatedTitle } });

      if (success && chreatedThread?.id) {
        router.navigate({ to: `/thread/${chreatedThread.id}` });
        setPrompt("");
      } else {
        toast.error(message || "Failed to create thread");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error creating thread");
    }
  };

  return (
    <section id="hero" className={cn("flex-1 flex flex-col border-b", className)}>
      <MaxWidthContainer className="flex-1 flex flex-col md:border-l md:border-r">
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

          <AiInput
            onPromptChange={handlePromptChange}
            defaultPrompt={prompt}
            onSubmit={handlePromptSubmit}
          />
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
