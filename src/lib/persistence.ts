import { USER_PROMPT } from "@/constants/localstorage";

export const getHeroPagePrompt = (): string => {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem(USER_PROMPT);
  return stored?.trim() ?? "";
};
