import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type TRegisterUserSchema = z.infer<typeof RegisterUserSchema>;
