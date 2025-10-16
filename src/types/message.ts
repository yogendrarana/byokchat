export type TextPart = {
  type: "text";
  text: string;
};

export type ImagePart = {
  type: "image";
  image: string;
  mimeType: string;
};

export type ReasoningPart = {
  type: "reasoning";
  reasoning: string;
  signature?: string;
  duration?: number;
  details?: Array<{
    type: "text" | "redacted";
    text?: string;
    data?: string;
    signature?: string;
  }>;
};

export type FilePart = {
  type: "file";
  data: string;
  filename?: string;
  mimeType?: string;
};

export type ErrorPart = {
  type: "error";
  error: {
    code: string;
    message: string;
  };
};

export type ToolInvocationPart = {
  type: "tool-invocation";
  toolInvocation: {
    state: "call" | "result" | "partial-call";
    args?: any;
    result?: any;
    toolCallId: string;
    toolName: string;
    step?: number;
  };
};

// Union of all parts
export type MessagePart =
  | ReasoningPart
  | TextPart
  | ImagePart
  | FilePart
  | ToolInvocationPart
  | ErrorPart;
