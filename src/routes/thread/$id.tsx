import React from "react";
import { createFileRoute } from "@tanstack/react-router";

import AiInput from "@/components/ai/ai-input";
import { useModelStore } from "@/store/model-store";
import { useAiSdkChat } from "@/hooks/use-aisdk-chat";
import { Messages } from "@/components/chat/messages";

export const Route = createFileRoute("/thread/$id")({
  component: RouteComponent
});

function RouteComponent() {
  const { id } = Route.useParams();
  
  const { selectedModel } = useModelStore();
  const chat = useAiSdkChat({ threadId: id, modelId: selectedModel?.id });

  const [prompt, setPrompt] = React.useState("");

  const handleSubmitPrompt = async () => {
    if (!selectedModel || prompt.trim().length === 0) return;
    // await chat.append({ role: "user", content: prompt });
    setPrompt("");
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
      <div className="max-w-3xl mx-auto mb-32">
        <Messages messages={chat.messages} />
      </div>
    </div>
  );
}
