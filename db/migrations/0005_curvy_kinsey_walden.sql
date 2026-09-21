CREATE TABLE "ateliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nom" text NOT NULL,
	"theme" text,
	"public_cible" text,
	"image" text,
	"image_alt" text,
	"image_credit" text,
	"description" jsonb DEFAULT '[]'::jsonb,
	"objectifs" jsonb DEFAULT '[]'::jsonb,
	"programme" jsonb DEFAULT '[]'::jsonb,
	"duree" text,
	"capacite" integer,
	"lieu_possible" text,
	"materiel_necessaire" text,
	"modalites" text,
	"sur_devis" boolean DEFAULT false NOT NULL,
	"tarif" text,
	"disponible" boolean DEFAULT true NOT NULL,
	"motif_indisponibilite" text,
	"categories" jsonb DEFAULT '[]'::jsonb,
	"url_demande" text,
	"libelle_bouton_demande" text,
	"statut" text DEFAULT 'brouillon' NOT NULL,
	"date_publication" timestamp,
	"ordre" integer DEFAULT 0,
	"seo" jsonb DEFAULT '{}'::jsonb,
	"auteur_id" text,
	"modifie_par_id" text,
	"version" integer DEFAULT 1 NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	"maj_le" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ateliers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories_ateliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"cle" text NOT NULL,
	"libelle" text NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL,
	"actif" boolean DEFAULT true NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_ateliers_cle_unique" UNIQUE("cle")
);
--> statement-breakpoint
ALTER TABLE "ateliers" ADD CONSTRAINT "ateliers_auteur_id_user_id_fk" FOREIGN KEY ("auteur_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ateliers" ADD CONSTRAINT "ateliers_modifie_par_id_user_id_fk" FOREIGN KEY ("modifie_par_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;