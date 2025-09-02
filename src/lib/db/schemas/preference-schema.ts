import { userSchema } from '@/lib/db/schemas/user-schema';
import { pgTable, jsonb, timestamp, serial, text } from 'drizzle-orm/pg-core';
import type { AiDefaults, AppearanceSettings, BrandingPreferences, ExportPreferences, NotificationSettings, TeamSettings } from '@/types/preference';

// table schema
export const preferenceSchema = pgTable('preference', {
  id: serial('id').primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => userSchema.id, { onDelete: 'cascade' }),

  appearanceSettings: jsonb('appearance_settings').notNull().default({}).$type<AppearanceSettings>(),
  notificationSettings: jsonb('notification_settings').notNull().default({}).$type<NotificationSettings>(),
  aiDefaults: jsonb('ai_defaults').notNull().default({}).$type<AiDefaults>(),
  brandingPreferences: jsonb('branding_preferences').notNull().default({}).$type<BrandingPreferences>(),
  exportPreferences: jsonb('export_preferences').notNull().default({}).$type<ExportPreferences>(),
  teamSettings: jsonb('team_settings').notNull().default({}).$type<TeamSettings>(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// types
export type PreferenceSelect = typeof preferenceSchema.$inferSelect;
export type PreferenceInsert = typeof preferenceSchema.$inferInsert;
