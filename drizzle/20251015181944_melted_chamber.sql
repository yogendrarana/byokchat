ALTER TABLE "setting" ADD COLUMN "database_config" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "setting" ADD COLUMN "email_config" jsonb DEFAULT '{}'::jsonb;