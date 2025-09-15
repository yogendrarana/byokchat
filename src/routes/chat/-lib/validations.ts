import z from "zod";

export const ChatSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255, "Title must be less than 255 characters.")
});

export type TChatSchema = z.infer<typeof ChatSchema>;
