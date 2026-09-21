CREATE TABLE "campagnes" (
	"id" serial PRIMARY KEY NOT NULL,
	"titre_interne" text NOT NULL,
	"message" text NOT NULL,
	"lien" text,
	"texte_bouton" text,
	"type" text DEFAULT 'information' NOT NULL,
	"emplacement" text DEFAULT 'bandeau_global' NOT NULL,
	"page_cible" text,
	"debut_le" timestamp,
	"fin_le" timestamp,
	"actif" boolean DEFAULT false NOT NULL,
	"ordre" integer DEFAULT 0 NOT NULL,
	"auteur_id" text,
	"modifie_par_id" text,
	"version" integer DEFAULT 1 NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	"maj_le" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campagnes" ADD CONSTRAINT "campagnes_auteur_id_user_id_fk" FOREIGN KEY ("auteur_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campagnes" ADD CONSTRAINT "campagnes_modifie_par_id_user_id_fk" FOREIGN KEY ("modifie_par_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;