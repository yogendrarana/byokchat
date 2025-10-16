import { create } from "zustand";

export interface UploadedFile {
  key: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress?: number;
}

export interface ChatState {
  threadId: string | undefined;
  pendingThreads: Record<string, boolean>;
  uploadedFiles: UploadedFile[];
  isUploadingFiles: boolean;
  isUploading: boolean;
}

export interface ChatActions {
  setThreadId: (threadId: string | undefined) => void;
  setPendingThreads: (threadId: string, pending: boolean) => void;
  setUploadedFiles: (files: UploadedFile[]) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (key: string) => void;
  updateFileProgress: (key: string, progress: number) => void;
  setIsUploadingFiles: (uploading: boolean) => void;
  setIsUploading: (uploading: boolean) => void;
  resetChat: () => void;
  clearUploadedFiles: () => void;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  // initial states
  threadId: undefined,
  uploadedFiles: [],
  pendingThreads: {},
  isUploadingFiles: false,
  isUploading: false,

  // actions
  setThreadId: (threadId) => set({ threadId }),

  setPendingThreads: (threadId, pending) =>
    set((state) => ({
      pendingThreads: { ...state.pendingThreads, [threadId]: pending }
    })),

  setUploadedFiles: (files) => set({ uploadedFiles: files }),

  addUploadedFile: (file) =>
    set((state) => ({
      uploadedFiles: [...state.uploadedFiles, file]
    })),

  removeUploadedFile: (key) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((file) => file.key !== key)
    })),

  updateFileProgress: (key, progress) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.map((file) =>
        file.key === key ? { ...file, progress } : file
      )
    })),

  setIsUploadingFiles: (isUploadingFiles) => set({ isUploadingFiles }),

  setIsUploading: (isUploading) => set({ isUploading }),

  clearUploadedFiles: () => set({ uploadedFiles: [] }),

  resetChat: () =>
    set({
      threadId: undefined,
      uploadedFiles: [],
      pendingThreads: {},
      isUploading: false,
      isUploadingFiles: false
    })
}));
