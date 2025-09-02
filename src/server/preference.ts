import { eq } from 'drizzle-orm';
import { getWebRequest } from '@tanstack/react-start/server';

import db from '@/lib/db/db';
import { auth } from '@/lib/auth/auth';
import { preferenceSchema, userSchema } from '@/lib/db/schema';
import { createServerFn, json } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';

// update mode
export const updateMode = createServerFn({ method: 'POST' })
  .validator((input: { userId: string; theme: 'dark' | 'light' }) => {
    if (!input.userId || !input.theme) {
      throw json({ success: false, message: 'User id or data not provided' }, { status: 400 });
    }
    return input;
  })
  .handler(async ({ data }) => {
    const { userId, theme } = data;

    const [user] = await db.select().from(userSchema).where(eq(userSchema.id, userId));
    if (!user) {
      setResponseStatus(400);
      return { success: false, message: 'User not available!' };
    }

    const preference = await db
      .select()
      .from(preferenceSchema)
      .where(eq(preferenceSchema.userId, userId))
      .limit(1)
      .then(res => res[0]);

    await db
      .update(preferenceSchema)
      .set({
        appearanceSettings: {
          ...(preference.appearanceSettings ?? {}),
          theme,
        },
      })
      .where(eq(preferenceSchema.userId, userId));

    setResponseStatus(200);
    return { success: true, message: `Set the theme to ${theme}` };
  });

// get user preference
export const getUserPreference = createServerFn().handler(async () => {
  const request = getWebRequest();
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return { success: false, message: 'Unauthorized' };
  }

  const user = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.id, session?.user.id))
    .then(res => res[0]);
  if (!user) {
    setResponseStatus(400);
    return { success: false, message: 'User not available!' };
  }

  const preference = await db
    .select()
    .from(preferenceSchema)
    .where(eq(preferenceSchema.userId, session.user.id))
    .limit(1)
    .then(res => res[0]);

  setResponseStatus(200);
  return { success: true, message: 'Fetched user preference successfully!', data: preference };
});
