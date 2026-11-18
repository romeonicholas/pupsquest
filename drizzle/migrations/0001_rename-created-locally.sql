ALTER TABLE "user_analytics" RENAME COLUMN "created_locally" TO "created_on_kiosk";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "created_locally" TO "created_on_kiosk";