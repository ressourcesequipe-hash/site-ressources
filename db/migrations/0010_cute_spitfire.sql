ALTER TABLE "user" ADD COLUMN "actif" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "desactive_le" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "doit_definir_mot_de_passe" boolean DEFAULT false NOT NULL;