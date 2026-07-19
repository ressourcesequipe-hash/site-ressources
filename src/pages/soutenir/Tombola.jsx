import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import TombolaModal from '../../components/TombolaModal'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Peut-on acheter des billets de tombola sans venir à l\'événement ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Les billets sont disponibles en ligne via HelloAsso. En cas de gain, nous vous contacterons directement pour organiser la remise de votre lot.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment se déroule le tirage au sort de la tombola ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le tirage a lieu en public le 03 octobre 2026 à Vielle-Saint-Girons, en présence des participants et des partenaires. Les résultats seront publiés sur nos actualités.',
      },
    },
    {
      '@type': 'Question',
      name: 'La tombola solidaire est-elle déclarée en préfecture ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Conformément à la réglementation française, cette tombola est organisée par une association loi 1901 à but non lucratif et respecte les obligations légales applicables.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel est le prix d\'un billet de tombola ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le tarif est précisé directement sur la billetterie HelloAsso. Plusieurs billets peuvent être achetés pour augmenter ses chances.',
      },
    },
  ],
}

const BREADCRUMBS = [
  { label: 'Soutenir', href: '/soutenir/' },
  { label: 'Tombola solidaire' },
]

export default function Tombola() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <TombolaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <SEO
        title="Tombola solidaire Landes 2026 — 3 000 € de lots · Association Ressources"
        description="Participez à la tombola solidaire de l'association Ressources le 03 octobre 2026 à Vielle-Saint-Girons. Achetez vos billets en ligne, soutenez la recyclerie solidaire des Landes et tentez de gagner plus de 3 000 € de lots offerts par nos partenaires locaux."
        canonical="/soutenir/tombola/"
        schema={faqSchema}
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
              +3 000 €
            </p>
            <p className="font-sans text-xl text-terre/60 mb-2">de lots offerts par nos partenaires</p>
            <p className="text-sm text-terre/50 max-w-md mx-auto mb-6">
              Des lots d'une valeur totale estimée à plus de 3 000 €, sélectionnés avec
              nos partenaires locaux. Annonce complète en septembre 2026.
            </p>
            <button onClick={() => setModalOpen(true)} className="btn-ocre">
              Acheter mes billets maintenant
            </button>
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
                  { num: '1', text: 'Achetez vos billets de tombola en ligne via HelloAsso' },
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
          <div className="bg-kaki-pale border border-kaki/15 p-6 mb-12">
            <h2 className="font-serif text-xl text-terre mb-3">Les lots à gagner</h2>
            <p className="text-sm text-terre/60 leading-relaxed">
              Les lots sont en cours de définition avec nos partenaires locaux.
              Des lots d'une valeur totale estimée à plus de 3 000 € seront mis en jeu.
              Restez informé·e en vous inscrivant à notre newsletter ou en consultant
              nos actualités. Annonce prévue pour septembre 2026.
            </p>
          </div>

          {/* Pourquoi une tombola */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">Pourquoi une tombola solidaire ?</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  ),
                  title: 'Un don qui rapporte',
                  desc: 'Chaque billet est un soutien direct à la recyclerie, avec la chance de repartir avec un lot offert par nos partenaires locaux.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                    </svg>
                  ),
                  title: 'Un impact local concret',
                  desc: 'Les fonds récoltés financent l\'équipement de l\'atelier, les collectes et la redistribution solidaire sur le territoire landais.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                    </svg>
                  ),
                  title: 'Un moment festif',
                  desc: 'Le tirage au sort a lieu en public le 03 octobre à Vielle-Saint-Girons, lors de la journée de lancement de l\'association.',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="border-t-2 border-ocre/30 pt-5">
                  <div className="text-ocre mb-3">{icon}</div>
                  <h3 className="font-serif text-lg text-terre mb-2">{title}</h3>
                  <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* À quoi servent les fonds */}
          <div className="bg-beige-light border border-beige-dark p-6 md:p-8 mb-12">
            <h2 className="font-serif text-xl text-terre mb-5">À quoi servent les fonds récoltés ?</h2>
            <div className="space-y-3">
              {[
                { pct: '35%', label: 'Collectes et logistique territoriale' },
                { pct: '25%', label: 'Diagnostic, tri et reconditionnement informatique et végétal' },
                { pct: '15%', label: 'Stockage sécurisé, manutention et traçabilité' },
                { pct: '15%', label: 'Redistribution solidaire et ateliers de sensibilisation' },
                { pct: '10%', label: 'Communication locale et mobilisation citoyenne' },
              ].map(({ pct, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="font-serif text-ocre text-lg w-12 shrink-0">{pct}</span>
                  <div className="flex-1">
                    <div className="h-1 bg-beige-dark rounded-full mb-1">
                      <div className="h-full bg-ocre/60 rounded-full" style={{ width: pct }} />
                    </div>
                    <p className="text-xs text-terre/60">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Peut-on acheter des billets sans venir à l\'événement ?',
                  r: 'Oui. Les billets sont disponibles en ligne via HelloAsso. En cas de gain, nous vous contacterons directement pour organiser la remise de votre lot.',
                },
                {
                  q: 'Comment se déroule le tirage au sort ?',
                  r: 'Le tirage a lieu en public le 03 octobre 2026 à Vielle-Saint-Girons, en présence des participants et des partenaires. Les résultats seront publiés sur nos actualités.',
                },
                {
                  q: 'La tombola est-elle déclarée en préfecture ?',
                  r: 'Oui. Conformément à la réglementation française, cette tombola est organisée par une association loi 1901 à but non lucratif et respecte les obligations légales applicables.',
                },
                {
                  q: 'Quel est le prix d\'un billet ?',
                  r: 'Le tarif est précisé directement sur la billetterie HelloAsso. Plusieurs billets peuvent être achetés pour augmenter ses chances.',
                },
              ].map(({ q, r }) => (
                <div key={q} className="border-l-2 border-ocre/25 pl-5 py-1">
                  <p className="font-sans text-sm font-semibold text-terre mb-1.5">{q}</p>
                  <p className="text-sm text-terre/60 leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => setModalOpen(true)} className="btn-ocre">
              Acheter des billets
            </button>
            <Link to="/evenement-lancement-03-octobre-2026/" className="btn-kaki">
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
