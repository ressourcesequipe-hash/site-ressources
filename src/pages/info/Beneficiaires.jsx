import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { IconFamille, IconEcole, IconPartenaires, IconBriefcase, IconMaison, IconSenior } from '../../components/Icons'
import { FINANCEMENT_PAR_LA_VENTE, VOIES_REMISE_CIRCULATION } from '../../data/redistribution'

// Le fil d'Ariane reprend le libelle du menu et le mot de l'URL. Les trois
// disaient des choses differentes — « Beneficiaires » en navigation, /beneficiaires/
// en adresse, « Acheter du materiel reconditionne » en titre — et cette page
// se retrouvait a promettre la meme chose que la boutique.
const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Bénéficiaires' },
]

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quels équipements reconditionnés sont disponibles à la vente ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ordinateurs portables et fixes, tablettes, smartphones, écrans et périphériques. Le stock du jour est consultable en ligne sur la page « Matériel disponible », avec photos, état et prix. Il dépend des dons reçus, et tous les appareils sont testés et reconditionnés avant vente.' },
    },
    {
      '@type': 'Question',
      name: 'Quelle garantie sur le matériel reconditionné par Ressources ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Les équipements vendus par Ressources bénéficient des garanties légales applicables à la vente de biens d\'occasion ou reconditionnés. Les conditions générales de vente préciseront les modalités avant le lancement effectif des ventes.' },
    },
    {
      '@type': 'Question',
      name: 'Puis-je donner mon appareil et en racheter un reconditionné ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oui, tout à fait. Vous donnez votre ancien matériel et vous pouvez acheter un équipement reconditionné par d\'autres donateurs à prix solidaire.' },
    },
    {
      '@type': 'Question',
      name: 'Les données des anciens propriétaires sont-elles effacées avant la vente ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Absolument. Chaque équipement passe par un effacement sécurisé de ses données avant tout reconditionnement ou vente.' },
    },
  ],
}

export default function Beneficiaires() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        // Titre volontairement eloigne de celui de la boutique : les deux
        // promettaient « acheter du reconditionne dans les Landes », et Google
        // devait en choisir un. Celui-ci vise les publics, l'autre l'achat.
        title="Matériel reconditionné pour associations, écoles et collectivités — Landes"
        description="Associations, écoles, collectivités, structures d'insertion, particuliers : à qui va le matériel reconditionné de Ressources (Landes) et à quelles conditions."
        canonical="/recyclerie-informatique/beneficiaires/"
        schema={FAQ_SCHEMA}
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Publics et conditions
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            À qui va le matériel reconditionné
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Le matériel remis en état ne part pas au hasard. Une partie alimente des actions
            solidaires et des bénéficiaires identifiés avec nos partenaires — écoles,
            associations, structures d'insertion, collectivités. Le reste est vendu à prix
            solidaire à tout habitant du territoire, sans condition de ressources.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Principe — la vente est une voie parmi d'autres, pas le modèle entier */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">
              La vente, une voie parmi plusieurs
            </h2>
            <p className="text-terre/65 leading-relaxed mb-6">
              Notre modèle repose sur la <strong className="text-terre">revalorisation</strong> :
              les équipements collectés sont reconditionnés par des bénévoles compétents,
              puis remis en circulation de plusieurs façons complémentaires.
            </p>

            <ul className="space-y-3 mb-6">
              {VOIES_REMISE_CIRCULATION.map(({ titre, desc }) => (
                <li key={titre} className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-ocre shrink-0 mt-2" aria-hidden />
                  <p className="text-sm text-terre/60 leading-relaxed">
                    <strong className="text-terre font-semibold">{titre}</strong> — {desc}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-l-2 border-ocre bg-beige-light p-5">
              <p className="text-sm text-terre/65 leading-relaxed">
                {FINANCEMENT_PAR_LA_VENTE}
              </p>
            </div>
          </div>

          {/* Qui peut acheter */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl text-terre mb-6">Qui peut acheter ?</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: <IconFamille className="w-5 h-5" />, title: 'Particuliers', desc: 'Tout habitant du territoire peut acheter un équipement reconditionné à prix solidaire, sans conditions particulières.' },
                { icon: <IconEcole className="w-5 h-5" />, title: 'Établissements scolaires', desc: 'Écoles, collèges et lycées peuvent acquérir des équipements à tarif adapté pour leurs élèves.' },
                { icon: <IconPartenaires className="w-5 h-5" />, title: 'Associations locales', desc: 'Les associations de proximité bénéficient d\'une tarification solidaire adaptée à leurs budgets limités.' },
                { icon: <IconBriefcase className="w-5 h-5" />, title: 'Structures d\'insertion', desc: 'ESAT, CHRS, centres sociaux et structures d\'accompagnement : contactez-nous pour discuter d\'une solution adaptée.' },
                { icon: <IconMaison className="w-5 h-5" />, title: 'Communes et collectivités', desc: 'Les mairies et intercommunalités partenaires peuvent acquérir des équipements pour des usages citoyens.' },
                { icon: <IconSenior className="w-5 h-5" />, title: 'Seniors', desc: 'Les personnes âgées souhaitant accéder au numérique trouvent ici des équipements simples et accessibles.' },
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

          {/* Pas de bloc de chiffres ici : sur une page de vente, des valeurs non
              qualifiees se lisent comme un bilan alors que la recyclerie n'a pas
              ouvert. Les objectifs de premiere annee sont affiches sur la page
              d'accueil, sous un intitule qui dit explicitement que ce sont des
              objectifs. Ne pas les reintroduire ici sans le meme cadrage. */}

          {/* Le pas-a-pas d'achat vivait ici ET sur la boutique, dans les memes
              termes : deux pages du site se disputaient la meme requete. Il ne
              reste qu'a un endroit, celui ou l'on achete. Cette page garde ce
              qu'elle est seule a dire — pour qui, a quelles conditions. */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl text-terre mb-4">Comment se passe un achat</h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-4 max-w-2xl">
              Le stock du jour, les prix et la marche à suivre sont sur la boutique : on vient
              voir l'appareil allumé à Vielle-Saint-Girons, rien ne se commande en ligne.
            </p>
            <p className="text-sm text-terre/65 leading-relaxed max-w-2xl">
              Pour un besoin en nombre — équiper une classe, une association, un chantier
              d'insertion —{' '}
              <Link to="/contact/" className="text-ocre underline underline-offset-4 hover:text-ocre-dark">
                écrivez-nous directement
              </Link>{' '}
              : nous cherchons dans les collectes à venir plutôt que dans le rayon du jour.
            </p>
          </div>

          <div className="bg-ocre-pale border border-ocre/20 p-6 mb-8">
            <h2 className="font-serif text-xl text-terre mb-3">Intéressé par un équipement ?</h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-4">
              La vente démarrera avec l'ouverture officielle de la filière en septembre 2026.
              Contactez-nous dès maintenant pour être informé des premiers stocks disponibles.
            </p>
            <Link to="/contact/" className="btn-ocre text-sm">
              Nous contacter
            </Link>
          </div>

          {/* FAQ */}
          <div className="border-t border-beige pt-10 mb-8">
            <h2 className="font-serif text-2xl text-terre mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Quels équipements seront disponibles à la vente ?',
                  a: 'Ordinateurs portables et fixes, tablettes, smartphones, écrans et périphériques. Les stocks dépendent des dons reçus. Tous les appareils sont testés et reconditionnés avant vente.',
                },
                {
                  q: 'Quelle garantie sur le matériel reconditionné ?',
                  a: 'Les équipements vendus par Ressources bénéficient des garanties légales applicables à la vente de biens d\'occasion ou reconditionnés. Les conditions générales de vente préciseront les modalités avant le lancement effectif des ventes.',
                },
                {
                  q: 'Puis-je donner et racheter un équipement reconditionné ?',
                  a: 'Oui, tout à fait. Le cycle de vie est exactement celui-là : vous donnez votre ancien matériel, et vous pouvez acheter un équipement reconditionné par d\'autres donateurs.',
                },
                {
                  q: 'Les données des anciens propriétaires sont-elles effacées ?',
                  a: 'Absolument. Chaque équipement passe par un effacement sécurisé de ses données avant tout reconditionnement ou vente. Voir notre page dédiée à la sécurité des données.',
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

          <div className="mb-10 border border-beige-dark border-l-2 border-l-ocre bg-beige-light p-6 md:p-8">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-ocre">
              En rayon en ce moment
            </p>
            <h2 className="mt-2 font-serif text-2xl text-terre">Voir le matériel disponible</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-terre/60">
              Le stock change au fil des collectes. Chaque appareil est présenté avec ses photos,
              son état réel, ses caractéristiques et son prix — et se voit sur place, allumé, avant
              tout achat.
            </p>
            {/* Ancre volontairement descriptive : « Voir ce qui est en rayon »
                ne disait a un moteur ni ou menait le lien, ni sur quoi. */}
            <Link to="/materiel-disponible/" className="btn-ocre mt-5 inline-block text-sm">
              Voir la boutique de matériel reconditionné
            </Link>
          </div>

          <Link to="/recyclerie-informatique/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie informatique
          </Link>
        </div>
      </section>
    </Layout>
  )
}

