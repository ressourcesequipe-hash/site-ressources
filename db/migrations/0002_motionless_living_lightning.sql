CREATE TABLE "actualites" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"titre" text NOT NULL,
	"resume" text,
	"contenu" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image" text,
	"image_alt" text,
	"image_credit" text,
	"image_largeur" integer,
	"image_hauteur" integer,
	"image_cadrage" text,
	"image_position" text,
	"galerie" jsonb DEFAULT '[]'::jsonb,
	"categorie" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"lien_externe" text,
	"statut" text DEFAULT 'brouillon' NOT NULL,
	"date_publication" timestamp,
	"date_depublication" timestamp,
	"mise_en_avant" boolean DEFAULT false NOT NULL,
	"sur_accueil" boolean DEFAULT false NOT NULL,
	"temps_lecture_minutes" integer,
	"seo" jsonb DEFAULT '{}'::jsonb,
	"auteur_id" text,
	"modifie_par_id" text,
	"version" integer DEFAULT 1 NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	"maj_le" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "actualites_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"entite_type" text NOT NULL,
	"entite_id" integer NOT NULL,
	"utilisateur_id" text,
	"type_modification" text NOT NULL,
	"contenu_precedent" jsonb,
	"cree_le" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "actualites" ADD CONSTRAINT "actualites_auteur_id_user_id_fk" FOREIGN KEY ("auteur_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "actualites" ADD CONSTRAINT "actualites_modifie_par_id_user_id_fk" FOREIGN KEY ("modifie_par_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "versions" ADD CONSTRAINT "versions_utilisateur_id_user_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;