CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" RENAME TO "authenticator";--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "credentialID" text NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "providerAccountId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "credentialPublicKey" text NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "counter" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "credentialDeviceType" text NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "credentialBackedUp" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticator" ADD COLUMN "transports" text;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "authenticator" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID");