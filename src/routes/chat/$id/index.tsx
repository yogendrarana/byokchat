import AiInput from "@/components/prompt/ai-input";
import { createFileRoute } from "@tanstack/react-router";

import React from "react";

export const Route = createFileRoute("/chat/$id/")({
  component: RouteComponent
});

function RouteComponent() {
  const { id } = Route.useParams();
  const [prompt, setPrompt] = React.useState("");

  const handleSubmitPrompt = async () => {
    console.log(prompt);
  };

  return (
    <div className="p-4 h-full">
      <div className="w-9/10 lg:w-2/5  absolute bottom-4 left-1/2 -translate-x-1/2 ">
        <AiInput
          onPromptChange={(value) => setPrompt(value)}
          defaultPrompt={prompt}
          onSubmit={handleSubmitPrompt}
          textAreaProps={{ rows: 2 }}
        />
      </div>
    </div>
  );
}
