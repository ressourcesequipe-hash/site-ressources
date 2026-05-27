import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Événement de lancement — Association Ressources',
  startDate: '2026-10-17',
  endDate: '2026-10-17',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Vielle-Saint-Girons',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vielle-Saint-Girons',
      postalCode: '40560',
      addressCountry: 'FR',
    },
  },
  description:
    'Journée de lancement de l\'association Ressources — recyclerie informatique et végétale solidaire dans les Landes. Challenge collecte 1 tonne, tombola solidaire, festivités.',
  organizer: {
    '@type': 'Organization',
    name: 'Association Ressources',
    url: 'https://www.association-ressources.fr',
  },
}

export default function Evenement() {
  return (
    <Layout>
      <SEO
        title="Événement de lancement — 17 octobre 2026"
        description="Rejoignez le lancement de l'association Ressources le 17 octobre 2026 à Vielle-Saint-Girons (Landes). Challenge collecte 1 tonne de matériel, tombola solidaire 15 000 €, festivités."
        canonical="/evenement-lancement-17-octobre-2026/"
        type="event"
        schema={eventSchema}
      />

      {/* Hero événement */}
      <section className="bg-kaki text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-ocre/5 rounded-tl-full" />
          <div className="absolute left-0 top-0 w-64 h-64 bg-white/[0.02] rounded-br-full" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-6">
            Événement de lancement
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-4">
            17 octobre 2026
          </h1>
          <p className="font-serif text-xl md:text-2xl text-white/70 mb-6">
            Vielle-Saint-Girons, Landes (40560)
          </p>
          <div className="w-12 h-0.5 bg-ocre mx-auto mb-8" />
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed">
            Une journée festive et solidaire pour célébrer le lancement officiel
            de l'association Ressources — recyclerie informatique et végétale du territoire landais.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 md:py-16 bg-beige-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <HighlightCard
              num="01"
              label="Challenge collecte"
              title="1 tonne de matériel"
              desc="Apportez vos équipements informatiques ce jour-là. Objectif : 1 000 kg collectés en une journée pour marquer le démarrage de la filière."
              accent="ocre"
            />
            <HighlightCard
              num="02"
              label="Tombola solidaire"
              title="Objectif 15 000 €"
              desc="Des lots attractifs à gagner, des partenaires locaux mobilisés. Chaque billet finance directement l'équipement de l'association."
              accent="ocre"
            />
            <HighlightCard
              num="03"
              label="Festivités"
              title="Une journée en commun"
              desc="Rencontrez l'équipe, découvrez le projet, échangez avec les partenaires. Un moment de convivialité ancré dans le territoire."
              accent="kaki"
            />
          </div>
        </div>
      </section>

      {/* Tombola */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="section-label">Tombola solidaire</p>
              <h2 className="font-serif text-3xl md:text-4xl text-terre mb-4">
                Soutenez le projet,<br />tentez votre chance
              </h2>
              <div className="decorative-line" />
              <p className="text-terre/60 leading-relaxed mb-6">
                La tombola est notre principal levier de financement pour cette
                première année. Elle nous permettra d'acquérir les équipements
                nécessaires au reconditionnement et de pérenniser la filière.
              </p>
              <div className="bg-ocre-pale border border-ocre/20 p-6 mb-6">
                <p className="font-sans text-xs text-ocre font-semibold tracking-wider uppercase mb-2">
                  Objectif
                </p>
                <p className="font-serif text-4xl text-ocre mb-1">15 000 €</p>
                <p className="text-sm text-terre/50">pour financer l'équipement de l'association</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/soutenir/tombola/" className="btn-ocre">
                  En savoir plus sur la tombola
                </Link>
                <Link to="/soutenir/don/" className="btn-outline-ocre">
                  Faire un don
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-terre">Comment participer ?</h3>
              {[
                { step: '1', text: 'Achetez vos billets de tombola (prix à définir)' },
                { step: '2', text: 'Venez à l\'événement le 17 octobre 2026' },
                { step: '3', text: 'Tentez de gagner l\'un des lots offerts par nos partenaires' },
                { step: '4', text: 'Votre participation finance directement l\'association' },
              ].map(({ step, text }) => (
                <div key={step} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ocre text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {step}
                  </span>
                  <p className="text-sm text-terre/65 leading-relaxed pt-0.5">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Challenge collecte */}
      <section className="py-16 md:py-20 bg-kaki text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label text-ocre">Challenge collecte</p>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
            1 tonne de matériel informatique
          </h2>
          <div className="w-12 h-0.5 bg-ocre mx-auto mb-8" />
          <p className="text-white/65 max-w-xl mx-auto leading-relaxed mb-10">
            Le 17 octobre 2026, mobilisez-vous ! Apportez vos équipements informatiques
            hors d'usage ou dont vous n'avez plus besoin. Ordinateurs, écrans, câbles,
            smartphones, tablettes… tout est bon.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left max-w-2xl mx-auto">
            {[
              'Ordinateurs portables & fixes',
              'Écrans et moniteurs',
              'Tablettes & smartphones',
              'Câbles & chargeurs',
              'Claviers, souris, accessoires',
              'Consoles de jeux',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ocre shrink-0" />
                <span className="text-sm text-white/70">{item}</span>
              </div>
            ))}
          </div>
          <Link to="/recyclerie-informatique/comment-donner/" className="btn-ocre">
            Je prépare ma donation
          </Link>
        </div>
      </section>

      {/* Inscription / Contact */}
      <section className="py-16 md:py-20 bg-beige-light">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="section-label">Inscription</p>
            <h2 className="font-serif text-3xl text-terre mb-3">
              Restez informé·e
            </h2>
            <p className="text-terre/55 text-sm leading-relaxed">
              Laissez-nous vos coordonnées pour recevoir le programme complet
              et les informations pratiques de l'événement.
            </p>
          </div>
          <ContactForm />
          <div className="mt-10 text-center text-sm text-terre/40">
            <p>
              Questions ?{' '}
              <a href="mailto:ressources.equipe@gmail.com" className="text-ocre hover:underline">
                ressources.equipe@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Liens silos */}
      <section className="py-10 bg-beige border-t border-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap gap-4 justify-center text-sm">
          <Link to="/recyclerie-informatique/" className="text-kaki hover:text-ocre transition-colors">
            ← Recyclerie informatique
          </Link>
          <span className="text-terre/20">|</span>
          <Link to="/soutenir/tombola/" className="text-kaki hover:text-ocre transition-colors">
            Tombola solidaire →
          </Link>
        </div>
      </section>
    </Layout>
  )
}

function HighlightCard({ num, label, title, desc, accent }) {
  return (
    <div className={`bg-white border-t-2 ${accent === 'ocre' ? 'border-ocre' : 'border-kaki'} p-6`}>
      <p className={`font-serif text-4xl ${accent === 'ocre' ? 'text-ocre/20' : 'text-kaki/20'} mb-3 leading-none`}>
        {num}
      </p>
      <p className={`font-sans text-xs font-semibold tracking-widest uppercase mb-2 ${accent === 'ocre' ? 'text-ocre' : 'text-kaki'}`}>
        {label}
      </p>
      <h3 className="font-serif text-xl text-terre mb-3">{title}</h3>
      <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
    </div>
  )
}

function ContactForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Prénom *</label>
          <input type="text" required className="input-field" placeholder="Votre prénom" />
        </div>
        <div>
          <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Nom *</label>
          <input type="text" required className="input-field" placeholder="Votre nom" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Email *</label>
        <input type="email" required className="input-field" placeholder="votre@email.fr" />
      </div>
      <div>
        <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Commune</label>
        <input type="text" className="input-field" placeholder="Votre commune" />
      </div>
      <div>
        <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Message (facultatif)</label>
        <textarea rows={3} className="input-field resize-none" placeholder="Une question, une idée…" />
      </div>
      <p className="text-xs text-terre/40 leading-relaxed">
        Vos données sont utilisées uniquement pour vous informer sur l'événement.
        Conformément au RGPD, vous pouvez demander leur suppression à tout moment.
      </p>
      <button type="submit" className="btn-ocre w-full text-center">
        Je m'inscris à la newsletter événement
      </button>
    </form>
  )
}
