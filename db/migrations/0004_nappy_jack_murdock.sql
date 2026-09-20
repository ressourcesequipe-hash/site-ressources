CREATE TABLE "organisations" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nom" text NOT NULL,
	"type" text,
	"description_courte" text,
	"site_internet" text,
	"commune" text,
	"email_public" text,
	"telephone_public" text,
	"logo" text,
	"logo_alt" text,
	"statut_partenariat" text DEFAULT 'prospect',
	"notes_internes" text,
	"debut_le" timestamp,
	"fin_le" timestamp,
	"categorie_affichage" text,
	"ordre" integer DEFAULT 0,
	"sur_accueil" boolean DEFAULT false NOT NULL,
	"statut" text DEFAULT 'brouillon' NOT NULL,
	"date_publication" timestamp,
	"seo" jsonb DEFAULT '{}'::jsonb,
	"auteur_id" text,
	"modifie_par_id" text,
	"version" integer DEFAULT 1 NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	"maj_le" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organisations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "points_collecte" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nom" text NOT NULL,
	"organisation_id" integer,
	"adresse" text,
	"complement_adresse" text,
	"code_postal" text,
	"commune" text,
	"latitude" text,
	"longitude" text,
	"horaires" jsonb DEFAULT '[]'::jsonb,
	"consignes" text,
	"informations_temporaires" text,
	"type" text,
	"campagne" text,
	"debut_le" timestamp,
	"fin_le" timestamp,
	"ferme_temporairement" boolean DEFAULT false NOT NULL,
	"motif_fermeture" text,
	"visible_carte" boolean DEFAULT true NOT NULL,
	"visible_liste" boolean DEFAULT true NOT NULL,
	"ordre" integer DEFAULT 0,
	"statut" text DEFAULT 'brouillon' NOT NULL,
	"date_publication" timestamp,
	"seo" jsonb DEFAULT '{}'::jsonb,
	"auteur_id" text,
	"modifie_par_id" text,
	"version" integer DEFAULT 1 NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	"maj_le" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "points_collecte_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "organisations" ADD CONSTRAINT "organisations_auteur_id_user_id_fk" FOREIGN KEY ("auteur_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisations" ADD CONSTRAINT "organisations_modifie_par_id_user_id_fk" FOREIGN KEY ("modifie_par_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_collecte" ADD CONSTRAINT "points_collecte_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_collecte" ADD CONSTRAINT "points_collecte_auteur_id_user_id_fk" FOREIGN KEY ("auteur_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_collecte" ADD CONSTRAINT "points_collecte_modifie_par_id_user_id_fk" FOREIGN KEY ("modifie_par_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;