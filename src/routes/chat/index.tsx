import React from "react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";
import { createFileRoute } from "@tanstack/react-router";

import {
  PromptProvider,
  PromptInputContainer,
  PromptActions,
  PromptTextarea
} from "@/components/prompt/prompt";

export const Route = createFileRoute("/chat/")({
  component: RouteComponent
});

function RouteComponent() {
  const { data } = authClient.useSession();
  const [prompt, setPrompt] = React.useState("");

  // ⏰ Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = data?.user?.name ?? "there";
  return (
    <div className="h-full w-full relative flex flex-1 flex-col justify-center items-center px-4 sm:px-6">
      <div className={cn("text-center mb-6", "text-muted-foreground", "text-base sm:text-lg")}>
        {getGreeting()}, {userName}!
        <br />
        Want to explore something today?
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <PromptProvider initialPrompt={prompt} initialModel="gpt-4">
          <PromptInputContainer>
            <PromptTextarea onChange={(e) => setPrompt(e.target.value)} rows={5} />
            <PromptActions onSubmit={() => console.log("submit")} />
          </PromptInputContainer>
        </PromptProvider>
      </div>
    </div>
  );
}
