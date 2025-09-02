import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userSchema } from './user-schema';

// space schema
export const workspaceSchema = pgTable('space', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull().$defaultFn(() => 'team'), // 'personal' or 'team'
  ownerId: text('owner_id')
    .notNull()
    .references(() => userSchema.id, { onDelete: 'cascade' }),
  isActive: boolean('is_active').$defaultFn(() => true).notNull(),
  // timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});

// space member schema
export const spaceMemberSchema = pgTable('space_member', {
  id: text('id').primaryKey(),
  spaceId: text('space_id')
    .notNull()
    .references(() => workspaceSchema.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => userSchema.id, { onDelete: 'cascade' }),
  role: text('role').notNull().$defaultFn(() => 'member'), // 'owner', 'admin', 'member'
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  // timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});

// space invitation schema
export const spaceInvitationSchema = pgTable('space_invitation', {
  id: text('id').primaryKey(),
  spaceId: text('space_id')
    .notNull()
    .references(() => workspaceSchema.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role').notNull().$defaultFn(() => 'member'),
  invitedBy: text('invited_by')
    .notNull()
    .references(() => userSchema.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  isAccepted: boolean('is_accepted').$defaultFn(() => false).notNull(),
  acceptedAt: timestamp('accepted_at'),
  // timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});

// Relations
export const spaceRelations = relations(workspaceSchema, ({ many, one }) => ({
  members: many(spaceMemberSchema),
  invitations: many(spaceInvitationSchema),
  owner: one(userSchema, {
    fields: [workspaceSchema.ownerId],
    references: [userSchema.id],
  }),
}));

export const spaceMemberRelations = relations(spaceMemberSchema, ({ one }) => ({
  space: one(workspaceSchema, {
    fields: [spaceMemberSchema.spaceId],
    references: [workspaceSchema.id],
  }),
  user: one(userSchema, {
    fields: [spaceMemberSchema.userId],
    references: [userSchema.id],
  }),
}));

export const spaceInvitationRelations = relations(spaceInvitationSchema, ({ one }) => ({
  space: one(workspaceSchema, {
    fields: [spaceInvitationSchema.spaceId],
    references: [workspaceSchema.id],
  }),
  invitedBy: one(userSchema, {
    fields: [spaceInvitationSchema.invitedBy],
    references: [userSchema.id],
  }),
}));

// Types
export type SpaceSelect = typeof workspaceSchema.$inferSelect;
export type SpaceInsert = typeof workspaceSchema.$inferInsert;
export type SpaceMemberSelect = typeof spaceMemberSchema.$inferSelect;
export type SpaceMemberInsert = typeof spaceMemberSchema.$inferInsert;
export type SpaceInvitationSelect = typeof spaceInvitationSchema.$inferSelect;
export type SpaceInvitationInsert = typeof spaceInvitationSchema.$inferInsert;
