import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import Chat from "../chat/chat";
import { buttonVariants } from "../ui/button";
import MaxWidthContainer from "../max-width-container";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "../ui/dialog";

export default function Hero({ className }: { className?: string }) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

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

          <Chat threadId={undefined} />
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
