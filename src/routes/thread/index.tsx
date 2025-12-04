import React from "react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";
import { createFileRoute } from "@tanstack/react-router";

import AiInput from "@/components/ai/ai-input";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const Route = createFileRoute("/thread/")({
  component: RouteComponent
});

function RouteComponent() {
  const { data } = authClient.useSession();
  const [prompt, setPrompt] = React.useState("");

  const userName = data?.user?.name ?? "there";

  const handleSubmitPrompt = async () => {
    console.log(prompt);
  };

  return (
    <div className="h-full w-full relative flex flex-1 flex-col justify-center items-center px-4 sm:px-6">
      <div className={cn("text-center mb-6", "text-muted-foreground", "text-base sm:text-lg")}>
        {getGreeting()}, {userName}!
        <br />
        Want to explore something today?
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <AiInput
          onPromptChange={(value) => setPrompt(value)}
          value={prompt}
          onSubmit={handleSubmitPrompt}
        />
      </div>
    </div>
  );
}
