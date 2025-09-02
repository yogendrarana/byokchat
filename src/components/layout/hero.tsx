import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { HERO_PAGE_PROMPT } from "@/constants/localstorage";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "../ui/dialog";
import {
    PromptActions,
    PromptProvider,
    PromptTextarea,
    PromptInputContainer
} from "../prompt/prompt";

export default function Hero({ className }: { className?: string }) {
    const { data } = authClient.useSession();

    const [prompt, setPrompt] = useLocalStorage(HERO_PAGE_PROMPT, "");
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    const handleGenerateAiResponse = () => {
        if (!data?.user) {
            setShowLoginDialog(true);
            return;
        }
    };

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setPrompt(value);
    };

    return (
        <div className={cn("px-4 flex flex-col justify-center", className)}>
            <main className="max-w-3xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
                        Chat with AI Instantly
                    </h1>
                    <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Ask questions, brainstorm ideas, or get insights—our AI delivers smart
                        responses in real time.
                    </p>
                </div>

                <PromptProvider initialPrompt={prompt} initialModel="gpt-4">
                    <PromptInputContainer>
                        <PromptTextarea onChange={handlePromptChange} className="min-h-[125px]" />
                        <PromptActions onSubmit={handleGenerateAiResponse} />
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
                        <Link
                            to="/auth/register"
                            className={cn(buttonVariants({ variant: "outline" }))}
                        >
                            Register
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
