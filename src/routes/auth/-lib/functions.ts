import { json } from '@tanstack/react-start';
import { createServerFn } from '@tanstack/react-start';

import db from '@/lib/db/db';
import { auth } from '@/lib/auth/auth';
import { settingSchema } from '@/lib/db/schema';
import { setResponseStatus } from '@tanstack/react-start/server';
import { RegisterUserSchema, type TRegisterUserSchema } from '@/lib/validation/auth';

export const registerUser = createServerFn({
  method: 'POST',
})
  .validator((data: TRegisterUserSchema) => {
    const result = RegisterUserSchema.safeParse(data);
    if (!result.success) {
      throw json({ success: false, message: 'Invalid input data' }, { status: 400 });
    }
    return result.data;
  })
  .handler(async ({ data }) => {
    const { name, email, password } = data;

    try {
      const { user } = await auth.api.signUpEmail({
        body: { email, password, name },
      });

      if (!user) {
        setResponseStatus(400);
        return { success: false, message: 'Failed to create user' };
      }

      await db.insert(settingSchema).values({
        userId: user.id,
        appearanceSettings: { theme: 'light' },
      });

      setResponseStatus(200);
      return { success: true, message: 'User registered successfully' };
    } catch (error: any) {
      setResponseStatus(500);
      return { success: false, message: error.message || 'Registration failed' };
    }
  });
