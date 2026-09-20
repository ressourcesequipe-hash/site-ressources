CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deploiements" (
	"id" serial PRIMARY KEY NOT NULL,
	"vercel_deployment_id" text,
	"statut" text NOT NULL,
	"contenus_inclus" jsonb DEFAULT '[]'::jsonb,
	"declenche_le" timestamp DEFAULT now() NOT NULL,
	"resolu_le" timestamp,
	"erreur" text
);
--> statement-breakpoint
CREATE TABLE "etat_deploiement" (
	"id" integer PRIMARY KEY NOT NULL,
	"statut" text DEFAULT 'repos' NOT NULL,
	"redemande" boolean DEFAULT false NOT NULL,
	"vercel_deployment_id" text,
	"declenche_le" timestamp,
	"maj_le" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "medias" (
	"id" serial PRIMARY KEY NOT NULL,
	"chemin" text NOT NULL,
	"titre" text,
	"alt" text,
	"credit" text,
	"categorie" text NOT NULL,
	"utilisateur_id" text,
	"sha_github" text,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "medias_chemin_unique" UNIQUE("chemin")
);
--> statement-breakpoint
CREATE TABLE "parametres_site" (
	"id" integer PRIMARY KEY NOT NULL,
	"nom_association" text,
	"logo" text,
	"favicon" text,
	"adresse" text,
	"telephone" text,
	"email_general" text,
	"email_presse" text,
	"siret" text,
	"facebook" text,
	"instagram" text,
	"linkedin" text,
	"lien_don" text,
	"lien_newsletter" text,
	"maj_le" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rubrique_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" text,
	"utilisateur_id" text,
	"rubrique_cle" text NOT NULL,
	"peut_consulter" boolean DEFAULT false NOT NULL,
	"peut_repondre" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text DEFAULT 'lecture_seule' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_utilisateur_id_user_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rubrique_permissions" ADD CONSTRAINT "rubrique_permissions_utilisateur_id_user_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;