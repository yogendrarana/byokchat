import { createFileRoute } from "@tanstack/react-router";
import {
  PromptProvider,
  PromptInputContainer,
  PromptActions,
  PromptTextarea
} from "@/components/prompt/prompt";
import React from "react";

export const Route = createFileRoute("/chat/$id/")({
  component: RouteComponent
});

function RouteComponent() {
  const { id } = Route.useParams();
  const [prompt, setPrompt] = React.useState("");

  const handleSubmitPrompt = () => {
    console.log(prompt);
  };

  return (
    <div className="p-4 h-full">

      <div className="w-9/10 lg:w-2/5  absolute bottom-4 left-1/2 -translate-x-1/2 ">
        <PromptProvider initialPrompt={prompt} initialModel="gpt-4">
          <PromptInputContainer>
            <PromptTextarea onChange={(e) => setPrompt(e.target.value)} className="min-h-[50px]" />
            <PromptActions onSubmit={handleSubmitPrompt} />
          </PromptInputContainer>
        </PromptProvider>
      </div>
    </div>
  );
}
