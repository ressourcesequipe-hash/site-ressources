import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { IconCollecte, IconOrdinateur, IconOutil, IconSecurite, IconPartenaires, IconConformite, IconCalendar, IconTracabilite } from '../components/Icons'

const PAGES_FILLES = [
  { to: '/recyclerie-informatique/comment-donner/', title: 'Comment donner', desc: 'Points de collecte, enlèvements, démarche simplifiée', Icon: IconCollecte },
  { to: '/recyclerie-informatique/materiel-accepte/', title: 'Matériel accepté', desc: 'Liste complète des équipements que nous collectons', Icon: IconOrdinateur },
  { to: '/recyclerie-informatique/reconditionnement/', title: 'Notre processus', desc: 'Les 6 étapes de la filière, de la collecte à la redistribution', Icon: IconOutil },
  { to: '/recyclerie-informatique/effacement-donnees/', title: 'Sécurité des données', desc: 'Effacement certifié, traçabilité, conformité RGPD', Icon: IconSecurite },
  { to: '/recyclerie-informatique/beneficiaires/', title: 'Acheter du matériel', desc: 'Acquérir un équipement reconditionné à prix solidaire', Icon: IconPartenaires },
]

export default function RecyclerieInfo() {
  return (
    <Layout>
      <SEO
        title="Recyclerie informatique solidaire dans les Landes"
        description="Donnez votre ordinateur, tablette ou smartphone dans les Landes (40). L'association Ressources reconditionne les équipements pour l'inclusion numérique sur le territoire landais."
        canonical="/recyclerie-informatique/"
      />

      {/* Hero silo */}
      <section className="bg-kaki text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-ocre/5 rounded-tl-full pointer-events-none" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Filière informatique
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight mb-4">
            Recyclerie informatique<br />solidaire dans les Landes
          </h1>
          <div className="w-12 h-0.5 bg-ocre mb-6" />
          <p className="text-white/65 max-w-xl leading-relaxed mb-8">
            Vos équipements hors d'usage ou inutilisés — ordinateurs, tablettes, smartphones —
            sont collectés, reconditionnés par des bénévoles qualifiés, puis revendus
            à prix solidaire, bien en dessous du marché.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/recyclerie-informatique/comment-donner/" className="btn-ocre">
              Je donne du matériel
            </Link>
            <Link to="/recyclerie-informatique/beneficiaires/" className="btn-outline-white">
              Acheter du matériel reconditionné
            </Link>
          </div>
        </div>
      </section>

      {/* Bloc événement */}
      <section className="bg-ocre-pale border-y border-ocre/20 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-ocre/30 bg-ocre/5 flex items-center justify-center text-ocre shrink-0" aria-hidden>
              <IconCalendar className="w-4 h-4" />
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-terre">
                Événement de lancement — 03 octobre 2026
              </p>
              <p className="text-xs text-terre/55">Challenge collecte 1 tonne · Tombola solidaire</p>
            </div>
          </div>
          <Link to="/evenement-lancement-03-octobre-2026/" className="btn-ocre text-sm shrink-0">
            Participer
          </Link>
        </div>
      </section>

      {/* Pages filles */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="section-label">Explorer la filière</p>
            <h2 className="font-serif text-3xl text-terre">Tout savoir sur la recyclerie informatique</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAGES_FILLES.map(({ to, title, desc, Icon }) => (
              <Link
                key={to}
                to={to}
                className="group card-base p-6 flex gap-4"
              >
                <div className="w-10 h-10 shrink-0 border border-ocre/25 bg-ocre/5 flex items-center justify-center text-ocre transition-all duration-200 group-hover:bg-ocre/12 group-hover:border-ocre/50" aria-hidden><Icon className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-serif text-lg text-terre mb-1.5 group-hover:text-ocre transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-16 md:py-20 bg-beige">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="section-label">Nos engagements</p>
            <h2 className="font-serif text-3xl text-terre">Vous donnez en toute confiance</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <IconSecurite className="w-6 h-6" />, title: 'Effacement certifié', desc: 'Toutes vos données sont effacées selon les normes avant tout reconditionnement ou recyclage.' },
              { icon: <IconTracabilite className="w-6 h-6" />, title: 'Traçabilité totale', desc: 'Chaque appareil est tracé de la collecte à la redistribution ou au recyclage responsable.' },
              { icon: <IconConformite className="w-6 h-6" />, title: 'Conformité RGPD', desc: 'Nos processus respectent le Règlement Général sur la Protection des Données.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center bg-white p-6 border border-beige-dark">
                <div className="w-12 h-12 border border-ocre/25 bg-ocre/5 flex items-center justify-center text-ocre mx-auto mb-4" aria-hidden>{icon}</div>
                <h3 className="font-serif text-lg text-terre mb-2">{title}</h3>
                <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white border-t border-beige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <p className="section-label">Questions fréquentes</p>
            <h2 className="font-serif text-3xl text-terre">Tout ce que vous voulez savoir</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Quels appareils puis-je donner ?',
                a: 'Ordinateurs portables et fixes, tablettes, smartphones, écrans, imprimantes, câbles et accessoires. Voir la page "Matériel accepté" pour la liste complète.',
              },
              {
                q: 'Que deviennent mes données personnelles ?',
                a: 'Chaque appareil passe par un effacement certifié de ses données avant tout reconditionnement. Vous recevez une confirmation d\'effacement sur demande.',
              },
              {
                q: 'Puis-je acheter un équipement reconditionné ?',
                a: 'Oui ! C\'est même l\'un des objectifs principaux de la filière. Les équipements reconditionnés sont vendus à prix solidaire, bien en dessous du marché. Contactez-nous pour connaître les stocks disponibles.',
              },
              {
                q: 'Mon équipement est-il trop vieux pour être donné ?',
                a: 'Pas nécessairement. Même des appareils anciens peuvent être valorisés pour des usages simples ou en pièces détachées. En cas de doute, contactez-nous avant de vous déplacer.',
              },
              {
                q: 'Comment se passe un enlèvement à domicile ?',
                a: 'Vous remplissez le formulaire ci-dessous avec une description du matériel. Nous vous recontactons pour convenir d\'un créneau. L\'enlèvement est gratuit et sans engagement.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="border border-beige group">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-sans text-sm font-semibold text-terre hover:text-ocre transition-colors">
                  {q}
                  <span className="shrink-0 text-ocre/50 group-open:rotate-180 transition-transform duration-200">▾</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-terre/60 leading-relaxed border-t border-beige pt-4">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact enlèvement */}
      <section className="py-14 md:py-20 bg-kaki-pale">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="section-label">Vous avez beaucoup de matériel ?</p>
            <h2 className="font-serif text-3xl text-terre mb-3">
              Nous organisons un enlèvement
            </h2>
            <p className="text-terre/55 text-sm leading-relaxed">
              Contactez-nous pour convenir d'un enlèvement à votre domicile ou dans votre structure.
            </p>
          </div>
          <EnlevementForm />
        </div>
      </section>
    </Layout>
  )
}

function EnlevementForm() {
  return (
    <form className="space-y-4 bg-white border border-beige p-6 md:p-8" onSubmit={(e) => e.preventDefault()}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-terre/60 mb-1.5">Prénom & nom *</label>
          <input type="text" required className="input-field" placeholder="Marie Dupont" />
        </div>
        <div>
          <label className="block text-xs font-medium text-terre/60 mb-1.5">Téléphone *</label>
          <input type="tel" required className="input-field" placeholder="06 00 00 00 00" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-terre/60 mb-1.5">Email *</label>
        <input type="email" required className="input-field" placeholder="votre@email.fr" />
      </div>
      <div>
        <label className="block text-xs font-medium text-terre/60 mb-1.5">Commune *</label>
        <input type="text" required className="input-field" placeholder="Votre commune" />
      </div>
      <div>
        <label className="block text-xs font-medium text-terre/60 mb-1.5">Description du matériel *</label>
        <textarea
          rows={3}
          required
          className="input-field resize-none"
          placeholder="Ex : 3 ordinateurs portables, 2 écrans, divers câbles…"
        />
      </div>
      <button type="submit" className="btn-ocre w-full text-center">
        Demander un enlèvement
      </button>
    </form>
  )
}
