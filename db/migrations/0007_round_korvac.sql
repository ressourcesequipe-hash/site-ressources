CREATE TABLE "demandes" (
	"id" serial PRIMARY KEY NOT NULL,
	"type_formulaire" text NOT NULL,
	"rubrique" text NOT NULL,
	"nom" text,
	"email" text,
	"telephone" text,
	"commune" text,
	"message" text,
	"donnees" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"statut" text DEFAULT 'nouveau' NOT NULL,
	"assigne_a_id" text,
	"empreinte_ip" text,
	"score_spam" integer,
	"cree_le" timestamp DEFAULT now() NOT NULL,
	"maj_le" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demande_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"demande_id" integer NOT NULL,
	"auteur_id" text,
	"destinataire" text NOT NULL,
	"sujet" text NOT NULL,
	"corps" text NOT NULL,
	"statut_envoi" text DEFAULT 'en_cours' NOT NULL,
	"brevo_message_id" text,
	"erreur" text,
	"tentative_le" timestamp DEFAULT now() NOT NULL,
	"confirme_le" timestamp
);
--> statement-breakpoint
CREATE TABLE "demande_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"demande_id" integer NOT NULL,
	"auteur_id" text,
	"contenu" text NOT NULL,
	"cree_le" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demande_verrous" (
	"demande_id" integer PRIMARY KEY NOT NULL,
	"verrouille_par_id" text,
	"verrouille_le" timestamp DEFAULT now() NOT NULL,
	"expire_le" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "demandes" ADD CONSTRAINT "demandes_assigne_a_id_user_id_fk" FOREIGN KEY ("assigne_a_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demande_emails" ADD CONSTRAINT "demande_emails_demande_id_demandes_id_fk" FOREIGN KEY ("demande_id") REFERENCES "public"."demandes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demande_emails" ADD CONSTRAINT "demande_emails_auteur_id_user_id_fk" FOREIGN KEY ("auteur_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demande_notes" ADD CONSTRAINT "demande_notes_demande_id_demandes_id_fk" FOREIGN KEY ("demande_id") REFERENCES "public"."demandes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demande_notes" ADD CONSTRAINT "demande_notes_auteur_id_user_id_fk" FOREIGN KEY ("auteur_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demande_verrous" ADD CONSTRAINT "demande_verrous_demande_id_demandes_id_fk" FOREIGN KEY ("demande_id") REFERENCES "public"."demandes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demande_verrous" ADD CONSTRAINT "demande_verrous_verrouille_par_id_user_id_fk" FOREIGN KEY ("verrouille_par_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;