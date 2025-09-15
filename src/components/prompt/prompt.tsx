import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Paperclip, ArrowUp, Mic, Loader, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// --- Context and Hook ---
interface PromptContextState {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imagePreviews: string[];
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
}

const PromptContext = React.createContext<PromptContextState | undefined>(undefined);

export function usePrompt() {
  const context = React.useContext(PromptContext);
  if (!context) throw new Error("usePrompt must be used within PromptProvider");
  return context;
}

interface PromptProviderProps {
  initialModel?: string;
  initialPrompt?: string;
  children: React.ReactNode;
}

export function PromptProvider({
  initialModel = "gpt-4",
  children,
  initialPrompt = ""
}: PromptProviderProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState(initialModel);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState(initialPrompt);

  React.useEffect(() => {
    setInputValue(initialPrompt);
  }, [initialPrompt]);

  return (
    <PromptContext.Provider
      value={{
        inputValue,
        setInputValue,
        selectedModel,
        setSelectedModel,
        isSubmitting,
        setIsSubmitting,
        selectedFiles,
        setSelectedFiles,
        imagePreviews,
        setImagePreviews
      }}
    >
      {children}
    </PromptContext.Provider>
  );
}

// --- PromptInputContainer ---
export interface PromptInputContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxLength?: number;
  showCredits?: boolean;
  creditsText?: string;
  upgradeLink?: string;
  ref?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}

export function PromptInputContainer({
  className,
  maxLength = 2000,
  showCredits = false,
  creditsText = "Free users get 3 generations per day.",
  upgradeLink = "/pricing",
  ref,
  children,
  ...props
}: PromptInputContainerProps) {
  const { inputValue, imagePreviews, setImagePreviews, setSelectedFiles } = usePrompt();

  const handleRemoveImage = (idx: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div
      ref={ref}
      className={cn(
        "w-full p-1 mx-auto shadow-sm bg-muted rounded-xl border border-border",
        className
      )}
      {...props}
    >
      {showCredits && (
        <div className="p-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {creditsText}{" "}
            <Link to={upgradeLink} className="underline">
              Upgrade for more credits
            </Link>
          </span>
          <span className="text-muted-foreground/70">
            {inputValue.length}/{maxLength}
          </span>
        </div>
      )}

      <div className="bg-background rounded-xl shadow-sm relative">
        {imagePreviews.length > 0 && (
          <div className="p-2 flex flex-wrap gap-2 border-b border-border">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative w-12 h-12 bg-muted rounded-md overflow-hidden">
                <img src={src} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 h-5 w-5 p-0 bg-background text-red-500 hover:text-red-600"
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
}

export function PromptTextarea({
  className,
  ref,
  placeholder = "Create a summer campaign for eco-friendly water bottles targeting young professionals...",
  onChange,
  ...props
}: PromptTextareaProps) {
  const { inputValue, setInputValue } = usePrompt();

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange?.(e);
    setInputValue(e.target.value);

    // Auto-grow
    e.target.style.height = "auto"; // reset
    e.target.style.height = `${e.target.scrollHeight}px`; // set to content height
  }

  return (
    <textarea
      ref={ref}
      placeholder={placeholder}
      className={cn(
        "w-full min-h-[50px] px-4 py-3 text-sm resize-none border-0 outline-none bg-transparent placeholder:text-gray-400 focus:ring-0",
        className
      )}
      value={inputValue}
      onChange={handleChange}
      {...props}
    />
  );
}

// --- PromptActions ---
export interface PromptActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  onSubmit?: () => void;
  onVoiceInput?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

const defaultModels = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3", label: "Claude 3" },
  { value: "gemini-pro", label: "Gemini Pro" }
];

export function PromptActions({
  className,
  onSubmit,
  onVoiceInput,
  ref,
  ...props
}: PromptActionsProps) {
  const {
    selectedModel,
    setSelectedModel,
    isSubmitting,
    inputValue,
    setIsSubmitting,
    setSelectedFiles,
    setImagePreviews
  } = usePrompt();

  const fileInputId = React.useId();

  async function handleSubmit() {
    if (!onSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);

      const readers = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((newPreviews) => {
        setImagePreviews((prev) => [...prev, ...newPreviews]);
      });
    }
  };

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-2 border-t", className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        <label htmlFor={fileInputId} className="cursor-pointer">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 p-2 bg-transparent"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">Attach files</TooltipContent>
          </Tooltip>
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onVoiceInput}
              className="h-8 w-8 p-2 bg-transparent"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">Dictation</TooltipContent>
        </Tooltip>

        {/* Model Select */}
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="h-8 w-32 text-xs cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {defaultModels.map((model) => (
              <SelectItem key={model.value} value={model.value} className="cursor-pointer">
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      {isSubmitting ? (
        <Button variant="outline" disabled className="h-8 w-8">
          <Loader className="animate-spin" />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={handleSubmit}
          disabled={inputValue.trim().length === 0 || isSubmitting}
        >
          <ArrowUp />
        </Button>
      )}
    </div>
  );
}
