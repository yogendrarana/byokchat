import { type TextareaHTMLAttributes } from "react";
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
  value?: string;
  onPromptChange?: (prompt: string) => void;
  textAreaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

function AiInput({ onSubmit, value = "", onPromptChange, textAreaProps }: AiInputProps) {
  return (
    <PromptProvider value={value} onSubmit={onSubmit} onChange={onPromptChange}>
      <PromptInputContainer>
        <PromptTextarea rows={5} {...textAreaProps} />
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
