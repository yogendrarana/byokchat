import { betterAuth } from 'better-auth';
import { reactStartCookies } from 'better-auth/react-start';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import db from '@/lib/db/db';
import { userSchema } from '@/lib/db/schemas/user-schema';
import { accountSchema, sessionSchema, verificationSchema } from '@/lib/db/schemas/auth-schema';

export const auth = betterAuth({
  trustedOrigins: ['http://localhost:3000', 'https://localhost:3000'],
  baseURL: process.env.VITE_BETTER_AUTH_URL || 'http://localhost:3000',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: userSchema,
      session: sessionSchema,
      account: accountSchema,
      verification: verificationSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [reactStartCookies()],
});
