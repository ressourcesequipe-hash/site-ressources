import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Soutenir', href: '/soutenir/' },
  { label: 'Tombola solidaire' },
]

export default function Tombola() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Tombola solidaire — Plus de 7 000 € de lots à gagner · Recyclerie Landes"
        description="Participez à la tombola solidaire de l'association Ressources le 03 octobre 2026. Plus de 7 000 € de lots à gagner offerts par nos partenaires locaux. Soutenez la recyclerie informatique et végétale des Landes."
        canonical="/soutenir/tombola/"
      />

      {/* Hero */}
      <section className="bg-kaki text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Soutenir
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Tombola solidaire — 03 octobre 2026
          </h1>
          <p className="text-white/65 max-w-xl leading-relaxed">
            Participez à une grande tombola solidaire et soutenez le lancement
            de la recyclerie informatique et végétale Ressources dans les Landes.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Mise en avant lots */}
          <div className="text-center bg-ocre-pale border border-ocre/20 p-10 mb-12">
            <p className="font-sans text-xs text-ocre font-semibold tracking-widest uppercase mb-3">
              Lots à gagner
            </p>
            <p className="font-serif text-5xl md:text-7xl text-ocre leading-none mb-2">
              +7 000 €
            </p>
            <p className="font-sans text-xl text-terre/60 mb-2">de lots offerts par nos partenaires</p>
            <p className="text-sm text-terre/50 max-w-md mx-auto">
              Des lots d'une valeur totale estimée à plus de 7 000 €, sélectionnés avec
              nos partenaires locaux. Annonce complète en septembre 2026.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div>
              <h2 className="font-serif text-2xl text-terre mb-4">Pourquoi participer ?</h2>
              <p className="text-sm text-terre/65 leading-relaxed mb-4">
                Chaque ticket contribue au financement des premiers équipements,
                des collectes, des ateliers de sensibilisation et de la redistribution
                solidaire de matériel reconditionné.
              </p>
              <div className="space-y-3">
                {[
                  'Outils et matériels de diagnostic et reconditionnement',
                  'Logiciels d\'effacement certifié des données',
                  'Matériel de stockage et de manutention',
                  'Communication et sensibilisation sur le territoire',
                  'Frais de déplacement pour les bénévoles',
                  'Consommables et petit équipement',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-terre/65">
                    <span className="text-ocre mt-1 shrink-0">→</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-terre mb-4">Comment participer ?</h2>
              <div className="space-y-4">
                {[
                  { num: '1', text: 'Achetez vos billets de tombola (tarif à confirmer)' },
                  { num: '2', text: 'Venez à l\'événement le 03 octobre 2026 à Vielle-Saint-Girons' },
                  { num: '3', text: 'Participez au tirage au sort et tentez de remporter l\'un des lots' },
                  { num: '4', text: 'Votre achat soutient directement la recyclerie solidaire des Landes' },
                ].map(({ num, text }) => (
                  <div key={num} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-ocre text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {num}
                    </span>
                    <p className="text-sm text-terre/65 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lots */}
          <div className="bg-kaki-pale border border-kaki/15 p-6 mb-8">
            <h2 className="font-serif text-xl text-terre mb-3">Les lots à gagner</h2>
            <p className="text-sm text-terre/60 leading-relaxed">
              Les lots sont en cours de définition avec nos partenaires locaux.
              Des lots d'une valeur totale estimée à plus de 7 000 € seront mis en jeu.
              Restez informé·e en vous inscrivant à notre newsletter ou en consultant
              nos actualités. Annonce prévue pour septembre 2026.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/evenement-lancement-03-octobre-2026/" className="btn-ocre">
              Voir l'événement du 03 octobre
            </Link>
            <Link to="/soutenir/don/" className="btn-outline-ocre">
              Faire un don directement
            </Link>
          </div>
        </div>
      </section>

      <section className="py-6 bg-beige border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/soutenir/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à soutenir
          </Link>
        </div>
      </section>
    </Layout>
  )
}
