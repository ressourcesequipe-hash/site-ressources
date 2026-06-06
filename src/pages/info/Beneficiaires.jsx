import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { IconFamille, IconEcole, IconPartenaires, IconBriefcase, IconMaison, IconSenior } from '../../components/Icons'

const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Qui peut bénéficier' },
]

export default function Beneficiaires() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Qui peut recevoir du matériel informatique reconditionné — Landes"
        description="L'association Ressources redistribue les équipements reconditionnés aux personnes et structures prioritaires dans les Landes (40) : familles en précarité numérique, associations, écoles."
        canonical="/recyclerie-informatique/beneficiaires/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Inclusion numérique
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Qui peut bénéficier du matériel reconditionné ?
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Les équipements reconditionnés par Ressources sont redistribués selon des
            critères de priorité sociale et territoriale dans les Landes.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="font-serif text-2xl text-terre mb-6">Bénéficiaires prioritaires</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: <IconFamille className="w-5 h-5" />, title: 'Familles en précarité numérique', desc: 'Personnes sans équipement informatique, orientées par les travailleurs sociaux ou les structures d\'accompagnement.' },
                { icon: <IconEcole className="w-5 h-5" />, title: 'Établissements scolaires', desc: 'Écoles, collèges et lycées du territoire manquant d\'équipements pour les élèves.' },
                { icon: <IconPartenaires className="w-5 h-5" />, title: 'Associations locales', desc: 'Associations de proximité dont les ressources ne permettent pas l\'achat de matériel neuf.' },
                { icon: <IconBriefcase className="w-5 h-5" />, title: 'Structures d\'insertion', desc: 'ESAT, CHRS, centres sociaux et structures d\'accompagnement vers l\'emploi.' },
                { icon: <IconMaison className="w-5 h-5" />, title: 'Communes et collectivités', desc: 'Mairies et intercommunalités partenaires pour des usages citoyens et solidaires.' },
                { icon: <IconSenior className="w-5 h-5" />, title: 'Seniors isolés', desc: 'Personnes âgées souhaitant accéder au numérique sans moyens pour équipement neuf.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-5 bg-beige-light border border-beige">
                  <div className="w-9 h-9 shrink-0 border border-ocre/25 bg-ocre/5 flex items-center justify-center text-ocre" aria-hidden>{icon}</div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-terre mb-1">{title}</p>
                    <p className="text-xs text-terre/55 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact chiffré */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { val: '120', label: 'équipements redistribués par an (objectif)' },
              { val: '100%', label: 'des appareils réemployés ou valorisés' },
              { val: '4', label: 'types de bénéficiaires prioritaires' },
              { val: '3', label: 'communes partenaires' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center bg-beige-light border border-beige-dark p-4">
                <p className="font-serif text-3xl text-ocre leading-none mb-1">{val}</p>
                <p className="text-xs text-terre/50 leading-snug">{label}</p>
              </div>
            ))}
          </div>

          {/* Parcours type */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl text-terre mb-6">Comment ça fonctionne concrètement ?</h2>
            <div className="space-y-4">
              {[
                { num: '1', title: 'La demande', desc: 'Un travailleur social, une mairie ou un référent associatif identifie une personne ou structure ayant besoin d\'équipement et transmet la demande à Ressources.' },
                { num: '2', title: 'L\'évaluation', desc: 'L\'association vérifie la disponibilité du matériel reconditionné correspondant aux besoins et valide l\'attribution selon les critères de priorité.' },
                { num: '3', title: 'La remise', desc: 'L\'équipement est remis directement à la personne ou la structure, accompagné si besoin d\'une courte présentation des usages de base.' },
                { num: '4', title: 'Le suivi', desc: 'Un suivi ponctuel permet de s\'assurer que l\'équipement est bien utilisé et de recueillir des retours pour améliorer nos actions.' },
              ].map(({ num, title, desc }) => (
                <div key={num} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ocre text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{num}</span>
                  <div>
                    <p className="font-sans text-sm font-semibold text-terre mb-0.5">{title}</p>
                    <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ocre-pale border border-ocre/20 p-6 mb-8">
            <h2 className="font-serif text-xl text-terre mb-3">Comment faire une demande ?</h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-4">
              Les demandes de matériel se font via les structures partenaires (services sociaux,
              mairies, associations référentes) ou directement auprès de l'association.
              Le processus de demande sera formalisé lors de l'ouverture officielle en septembre 2026.
            </p>
            <a href="mailto:contact@ressourcesrecyclerie.fr" className="btn-ocre text-sm">
              Nous contacter pour une demande
            </a>
          </div>

          {/* CTA don — lien émotionnel */}
          <div className="bg-kaki text-white p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-ocre" />
            <div className="relative">
              <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ocre mb-2">Vous pouvez aider</p>
              <h3 className="font-serif text-xl text-white mb-2">
                Chaque don finance une redistribution concrète
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                100 € permettent de reconditionner et redistribuer un ordinateur complet
                à une famille, un senior ou une association qui en a besoin dans les Landes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/soutenir/don/" className="btn-ocre text-sm">Faire un don</Link>
                <Link to="/soutenir/tombola/" className="border border-white/25 text-white/75 px-5 py-2.5 text-sm hover:border-white/50 hover:text-white transition-all duration-200">
                  Tombola solidaire
                </Link>
              </div>
            </div>
          </div>

          <Link to="/recyclerie-informatique/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie informatique
          </Link>
        </div>
      </section>
    </Layout>
  )
}
