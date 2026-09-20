import { Helmet } from 'react-helmet-async'
import { Link, NavLink } from 'react-router-dom'
import { authClient } from '../lib/authClient'

// Section « à venir » : le module existe dans les maquettes validées mais
// pas encore dans le code (Étape 2/3). Affiché sans lien plutôt que de
// pointer vers une page qui n'existe pas.
function LienAVenir({ label }) {
  return (
    <span className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13.5px] font-medium text-white/30 cursor-default">
      {label}
      <span className="text-[9px] uppercase tracking-wider">à venir</span>
    </span>
  )
}

function LienActif({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
          isActive ? 'bg-ocre text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

function EtiquetteSection({ children }) {
  return (
    <div className="text-[10.5px] tracking-[0.13em] uppercase text-white/40 font-bold px-3.5 pt-4 pb-1.5">
      {children}
    </div>
  )
}

export default function AdminLayout({ titre, children }) {
  const { data: session } = authClient.useSession()

  return (
    <div className="flex h-screen bg-beige-light overflow-hidden">
      <Helmet>
        {/* Jamais indexé : c'est un espace de gestion, pas du contenu public
            (§15 de l'audit — à compléter en plus du Disallow de robots.txt). */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <aside className="w-[248px] shrink-0 bg-kaki-dark flex flex-col py-5 box-border">
        <div className="flex items-center gap-2.5 px-3.5 pb-5 border-b border-white/10 mb-2">
          <div className="w-[34px] h-[34px] rounded-lg bg-ocre flex items-center justify-center text-white font-serif font-bold text-base shrink-0">
            R
          </div>
          <div>
            <div className="text-white text-sm font-semibold leading-tight">Ressources</div>
            <div className="text-white/50 text-[10.5px] tracking-[0.08em] uppercase">Back-office</div>
          </div>
        </div>

        <nav className="overflow-y-auto flex-1 px-2 flex flex-col gap-0.5">
          <LienActif to="/admin/" label="Tableau de bord" end />

          <EtiquetteSection>Contenus</EtiquetteSection>
          <LienAVenir label="Pages" />
          <LienAVenir label="Actualités" />
          <LienAVenir label="Événements" />
          <LienAVenir label="Ateliers" />
          <LienAVenir label="Partenaires" />
          <LienAVenir label="Points de collecte" />
          <LienAVenir label="Médiathèque" />

          <EtiquetteSection>Demandes</EtiquetteSection>
          <LienAVenir label="Boîte de demandes" />

          <EtiquetteSection>Administration</EtiquetteSection>
          <LienAVenir label="Utilisateurs & rôles" />
        </nav>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[68px] shrink-0 bg-white border-b border-beige-dark flex items-center justify-between px-8 box-border">
          <h1 className="font-serif text-lg text-terre">{titre}</h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[13px] text-olive font-semibold hover:underline">
              Voir le site ↗
            </Link>
            {session && (
              <div className="flex items-center gap-2 pl-4 border-l border-beige-dark">
                <div className="w-8 h-8 rounded-full bg-kaki-pale text-kaki flex items-center justify-center text-xs font-bold">
                  {session.user.name?.slice(0, 2).toUpperCase() || '?'}
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-terre">{session.user.name}</div>
                  <div className="text-[11px] text-terre/60">{session.user.role}</div>
                </div>
                <button
                  type="button"
                  onClick={() => authClient.signOut()}
                  className="ml-2 text-[12px] text-terre/50 hover:text-ocre-dark"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 box-border">{children}</main>
      </div>
    </div>
  )
}
