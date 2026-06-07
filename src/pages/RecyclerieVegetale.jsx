import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { IconPlante, IconPot, IconNousRejoindre, IconFeuille, IconGlobe, IconReemploi, IconSolidarite } from '../components/Icons'

const PAGES_FILLES = [
  { to: '/recyclerie-vegetale/comment-donner/', title: 'Comment donner', desc: 'Démarche de don, points de collecte végétale', Icon: IconPlante },
  { to: '/recyclerie-vegetale/ce-que-nous-acceptons/', title: 'Ce que nous acceptons', desc: 'Plantes, contenants, outils et matériels de jardin', Icon: IconPot },
  { to: '/recyclerie-vegetale/redistribution/', title: 'Vente solidaire', desc: 'Acheter des plantes et matériels collectés à prix solidaire', Icon: IconNousRejoindre },
  { to: '/recyclerie-vegetale/partenaires-vegetaux/', title: 'Partenaires végétaux', desc: 'Communes, campings, pépinières et fleuristes partenaires', Icon: IconFeuille },
]

export default function RecyclerieVegetale() {
  return (
    <Layout>
      <SEO
        title="Recyclerie végétale solidaire dans les Landes"
        description="Donnez vos plantes, contenants et outils de jardin dans les Landes (40). L'association Ressources redistribue vos végétaux aux habitants et structures du territoire landais."
        canonical="/recyclerie-vegetale/"
      />

      {/* Hero silo végétal */}
      <section style={{ backgroundColor: "#EDECCE" }} className="py-14 md:py-20 relative overflow-hidden border-b border-[#6c7c49]/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#6c7c49]" />


        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: '#6c7c49' }}>
            Filière végétale
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-terre leading-tight mb-4">
            Recyclerie végétale<br />solidaire dans les Landes
          </h1>
          <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: '#6c7c49' }} />
          <p className="text-terre/65 max-w-xl leading-relaxed mb-8">
            Plantes, contenants, outils et matériels de jardinage collectés
            et proposés à la vente solidaire sur le territoire des Landes.
            Parce que vos végétaux méritent un nouvel avenir — et un nouveau propriétaire.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/recyclerie-vegetale/comment-donner/" className="btn-veg">
              Je donne des plantes
            </Link>
            <Link to="/recyclerie-vegetale/redistribution/" className="btn-outline-veg">
              Vente solidaire
            </Link>
          </div>
        </div>
      </section>

      {/* Pages filles */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#6c7c49' }}>
              Explorer la filière
            </p>
            <h2 className="font-serif text-3xl text-terre">Tout savoir sur la recyclerie végétale</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {PAGES_FILLES.map(({ to, title, desc, Icon }) => (
              <Link
                key={to}
                to={to}
                className="group card-base p-6 flex gap-4 border-l-4 border-transparent transition-all"
                style={{}}
                onMouseEnter={e => e.currentTarget.style.borderLeftColor = '#6c7c49'}
                onMouseLeave={e => e.currentTarget.style.borderLeftColor = 'transparent'}
              >
                <div className="w-10 h-10 shrink-0 flex items-center justify-center transition-all duration-200"
                  style={{ border: '1px solid rgba(108,124,73,0.2)', background: 'rgba(108,124,73,0.05)', color: '#6c7c49' }}
                  aria-hidden><Icon className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-serif text-lg text-terre mb-1.5 transition-colors group-hover:text-[#6c7c49]">
                    {title}
                  </h3>
                  <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi une filière végétale */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ backgroundColor: '#EDECCE' }}>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#6c7c49' }}>
                Notre démarche
              </p>
              <h2 className="font-serif text-3xl text-terre mb-4">
                Pourquoi une recyclerie végétale ?
              </h2>
              <div className="w-10 h-0.5 mb-6" style={{ backgroundColor: '#6c7c49' }} />
              <p className="text-terre/65 leading-relaxed mb-4">
                Dans les Landes, de nombreux foyers, campings, communes et commerces
                se retrouvent avec des plantes ou du matériel de jardin dont ils
                n'ont plus l'usage. Plutôt que de jeter, donnez !
              </p>
              <p className="text-terre/65 leading-relaxed mb-6">
                La filière végétale de Ressources crée un circuit court local :
                les végétaux collectés sont remis en état puis proposés à la vente
                à prix solidaire — bien en dessous du marché. Les recettes contribuent
                à financer le projet associatif.
              </p>
              <Link to="/recyclerie-vegetale/ce-que-nous-acceptons/" className="btn-veg">
                Voir ce que nous acceptons
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { icon: <IconGlobe className="w-5 h-5" />, title: 'Réemploi local', desc: 'Vos végétaux restent sur le territoire, au profit des habitants des Landes.' },
                { icon: <IconReemploi className="w-5 h-5" />, title: 'Zéro gaspillage', desc: 'Chaque plante, contenant et outil récupéré évite un déchet et un achat neuf.' },
                { icon: <IconSolidarite className="w-5 h-5" />, title: 'Circuit court', desc: 'La filière végétale crée du lien entre donateurs et acheteurs solidaires du territoire.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4 bg-white p-5" style={{ border: '1px solid rgba(108,124,73,0.1)' }}>
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center" style={{ border: '1px solid rgba(108,124,73,0.2)', background: 'rgba(108,124,73,0.05)', color: '#6c7c49' }} aria-hidden>{icon}</div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-terre mb-1">{title}</p>
                    <p className="text-xs text-terre/55 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partenaires végétaux */}
      <section className="py-14 bg-white border-t border-beige">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl text-terre mb-4">
            Communes, campings, fleuristes — rejoignez la filière
          </h2>
          <p className="text-terre/55 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            Vous gérez un espace vert, une pépinière, un commerce ou un site touristique ?
            Devenez partenaire de collecte ou de redistribution végétale.
          </p>
          <Link to="/recyclerie-vegetale/partenaires-vegetaux/" className="btn-outline-veg text-sm">
            Devenir partenaire végétal
          </Link>
        </div>
      </section>
    </Layout>
  )
}

