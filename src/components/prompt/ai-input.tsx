import {
  PromptAudioInput,
  PromptFileInput,
  PromptInputContainer,
  PromptProvider,
  PromptSendButton,
  PromptTextarea
} from "./prompt";
import ModelSelector from "./model-selector";

interface AiInputProps {
  onSubmit: () => Promise<void>;
  defaultPrompt?: string;
  onPromptChange?: (prompt: string) => void;
}

function AiInput({ onSubmit, defaultPrompt, onPromptChange }: AiInputProps) {
  return (
    <PromptProvider value={defaultPrompt} onSubmit={onSubmit} onChange={onPromptChange}>
      <PromptInputContainer>
        <PromptTextarea rows={5} />
        <div className="p-2 border-t flex justify-between">
          <div className="space-x-2 flex">
            <PromptFileInput />
            <PromptAudioInput />
            <ModelSelector />
          </div>
          <PromptSendButton onSubmit={onSubmit} />
        </div>
      </PromptInputContainer>
    </PromptProvider>
  );
}

export default AiInput;
