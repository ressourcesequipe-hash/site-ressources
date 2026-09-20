import { authClient } from '../lib/authClient'

// Version Étape 1 : confirme que l'authentification et les rôles
// fonctionnent de bout en bout. Les compteurs de contenus/demandes des
// maquettes (actualités publiées, demandes non traitées…) arriveront avec
// les tables correspondantes en Étape 2/3 — aucune donnée fictive ici.
export default function TableauDeBord() {
  const { data: session } = authClient.useSession()

  return (
    <div>
      <p className="text-sm text-terre/70 mb-6">
        Bonjour {session?.user.name} — connecté avec le rôle{' '}
        <span className="font-semibold">{session?.user.role}</span>.
      </p>

      <div className="bg-white border border-beige-dark rounded-2xl p-6 max-w-xl">
        <p className="font-serif text-lg text-terre mb-2">Socle en place</p>
        <p className="text-sm text-terre/70 leading-relaxed">
          L'authentification, les rôles et la médiathèque sont opérationnels côté serveur.
          Les modules de contenu (actualités, événements, partenaires…) et la boîte de demandes
          rejoindront ce tableau de bord aux prochaines étapes du plan de développement.
        </p>
      </div>
    </div>
  )
}
