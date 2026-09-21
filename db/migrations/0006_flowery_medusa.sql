CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"titre_interne" text NOT NULL,
	"titre_public" text,
	"extrait" text,
	"contenu" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image" text,
	"image_alt" text,
	"image_credit" text,
	"protegee" boolean DEFAULT false NOT NULL,
	"statut" text DEFAULT 'brouillon' NOT NULL,
	"date_publication" timestamp,
	"ordre" integer DEFAULT 0,
	"seo" jsonb DEFAULT '{}'::jsonb,
	"auteur_id" text,
	"modifie_par_id" text,
	"version" integer DEFAULT 1 NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	"maj_le" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_auteur_id_user_id_fk" FOREIGN KEY ("auteur_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_modifie_par_id_user_id_fk" FOREIGN KEY ("modifie_par_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;