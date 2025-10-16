import * as React from "react";
import { Paperclip, ArrowUp, Mic, Loader, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// --- Context and Hook ---
interface PromptContextState {
  internalValue: string;
  setInternalValue: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imagePreviews: string[];
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit?: () => void;
  onChange?: (value: string) => void;
}

// --- PromptInputContext and Hook ---
const PromptContext = React.createContext<PromptContextState | undefined>(undefined);

export function usePrompt() {
  const context = React.useContext(PromptContext);
  if (!context) throw new Error("usePrompt must be used within PromptProvider");
  return context;
}

// --- PromptProvider ---
interface PromptProviderProps {
  value?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onChange?: (value: string) => void;
}

function PromptProvider({
  value = "",
  onChange,
  onSubmit,
  children
}: PromptProviderProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <TooltipProvider>
      <PromptContext.Provider
        value={{
          internalValue,
          setInternalValue,
          isLoading,
          setIsLoading,
          selectedFiles,
          setSelectedFiles,
          imagePreviews,
          setImagePreviews,
          onSubmit,
          onChange
        }}
      >
        {children}
      </PromptContext.Provider>
    </TooltipProvider>
  );
}

// --- PromptInputContainer ---
export interface PromptInputContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}

function PromptInputContainer({
  className = "",
  ref,
  children,
  ...props
}: PromptInputContainerProps) {
  const { imagePreviews, setImagePreviews, setSelectedFiles } = usePrompt();

  const handleRemoveImage = (idx: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div
      ref={ref}
      className={cn("w-full p-1 bg-muted border border-border rounded-xl", className)}
      {...props}
    >
      <div className="bg-background rounded-xl border border-border relative">
        {imagePreviews.length > 0 && (
          <div className="p-2 flex flex-wrap gap-2 border-b border-border">
            {imagePreviews.map((src, idx) => (
              <div
                key={idx}
                className="group relative w-12 h-12 bg-muted rounded-md overflow-hidden"
              >
                <img src={src} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveImage(idx)}
                  className="opacity-0 group-hover:opacity-80 absolute top-1 right-1 h-5 w-5 p-0 bg-background text-red-500 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// --- PromptTextarea ---
export interface PromptTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.Ref<HTMLTextAreaElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

function PromptTextarea({
  className,
  ref,
  placeholder = "Create a summer campaign for eco-friendly water bottles targeting young professionals...",
  onKeyDown,
  ...props
}: PromptTextareaProps) {
  const { internalValue, setInternalValue, onSubmit, onChange } = usePrompt();

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);

    // Auto-grow
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <textarea
      ref={ref}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      value={internalValue}
      onChange={handleChange}
      className={cn(
        "w-full min-h-[50px] px-4 py-3 text-sm resize-none border-0 outline-none bg-transparent placeholder:text-gray-400 focus:ring-0",
        className
      )}
      {...props}
    />
  );
}

// --- PromptAction ---
type PromptInputActionProps = {
  className?: string;
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
} & React.ComponentProps<typeof Tooltip>;

function PromptAction({
  tooltip,
  children,
  className,
  side = "top",
  disabled = false,
  ...props
}: PromptInputActionProps) {
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled} onClick={(event) => event.stopPropagation()}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

// prompt file input
interface PromptFileInputProps {
  onFilesSelected?: (files: File[], previews: string[]) => void;
}

function PromptFileInput({ onFilesSelected }: PromptFileInputProps) {
  const fileInputId = React.useId();
  const { setImagePreviews, setSelectedFiles } = usePrompt();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];

    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);

      const previews = await Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            })
        )
      );

      setImagePreviews((prev) => [...prev, ...previews]);
      onFilesSelected?.(files, previews);
    }
  };

  return (
    <PromptAction tooltip="Attach files">
      <label htmlFor={fileInputId} className="cursor-pointer">
        <Button
          asChild
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-8 p-2 bg-transparent"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <input
          id={fileInputId}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </PromptAction>
  );
}

// prompt audio input
interface PromptAudioInputProps {
  onVoiceInput?: () => void;
}

function PromptAudioInput({ onVoiceInput }: PromptAudioInputProps) {
  return (
    <PromptAction tooltip="Dictation">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onVoiceInput}
        className="h-8 w-8 p-2 bg-transparent"
        asChild
      >
        <Mic className="h-4 w-4" />
      </Button>
    </PromptAction>
  );
}


// prompt send button
interface PromptSendButtonProps {
  onSubmit: () => Promise<void>;
}

function PromptSendButton({ onSubmit }: PromptSendButtonProps) {
  const { isLoading, internalValue } = usePrompt();

  return (
    <PromptAction tooltip="Send">
      {isLoading ? (
        <Button variant="outline" className="h-8 w-8">
          <Loader className="animate-spin" />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={onSubmit}
          disabled={internalValue.trim().length === 0 || isLoading}
        >
          <ArrowUp />
        </Button>
      )}
    </PromptAction>
  );
}

export {
  PromptProvider,
  PromptInputContainer,
  PromptTextarea,
  PromptFileInput,
  PromptAudioInput,
  PromptSendButton,
  PromptAction
};
