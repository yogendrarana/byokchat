import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { preferenceSchema } from './preference-schema';

export const userSchema = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});

// relations
export const userRelations = relations(userSchema, ({ one }) => ({
  preference: one(preferenceSchema),
}));

export type UserSelect = typeof userSchema.$inferSelect;
export type UserInsert = typeof userSchema.$inferInsert;
