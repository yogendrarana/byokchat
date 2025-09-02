CREATE TABLE  IF NOT EXISTS "preference" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"appearance_settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notification_settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ai_defaults" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"branding_preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"export_preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"team_settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "preference" ADD CONSTRAINT "preference_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;