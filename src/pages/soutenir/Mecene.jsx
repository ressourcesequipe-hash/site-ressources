import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { DEFI } from '../../data/defiCollecte'
import { communes } from '../../data/defiConfig'

const BREADCRUMBS = [
  { label: 'Soutenir', href: '/soutenir/' },
  { label: 'Mécénat & partenariat' },
]

// Le dossier de mécénat 2026 reste un document qu'on envoie sur demande : la
// page en donne l'esprit et l'architecture, pas les montants ni le budget.
const MAIL_DOSSIER =
  'mailto:contact@ressourcesrecyclerie.fr?subject=' +
  encodeURIComponent('Dossier de mécénat 2026') +
  '&body=' +
  encodeURIComponent(
    "Bonjour,\n\nJe souhaite recevoir le dossier de mécénat 2026 de l'association Ressources.\n\nEntreprise :\nContact :\n",
  )

const FILIERES = [
  { titre: 'Collecter', texte: 'Du matériel informatique et des végétaux inutilisés ou destinés à être jetés.' },
  { titre: 'Réemployer', texte: 'Trier, diagnostiquer, reconditionner et remettre en circulation.' },
  {
    titre: 'Transmettre',
    texte: 'Donner accès à du matériel reconditionné et sensibiliser habitants, collectivités et entreprises.',
  },
]

const ETAPES = [
  { titre: 'Coordination de projet', texte: 'Un premier poste structurant, pour tenir la durée.' },
  { titre: 'Atelier informatique', texte: 'Développer les capacités de diagnostic et de reconditionnement.' },
  { titre: 'Filière végétale', texte: "Développer un atelier dédié, avec à terme la possibilité d'implanter une serre." },
]

// Quatre niveaux, du plus simple au plus engagé. Les montants figurent dans le
// dossier : la page décrit ce que chaque niveau apporte, pas combien il coûte.
const NIVEAUX = [
  {
    nom: 'Soutien solidaire',
    texte: 'Vous rejoignez les entreprises et acteurs qui soutiennent le développement de Ressources.',
    plus: [],
  },
  {
    nom: 'Mécène Ressources',
    texte: 'Le statut de mécène de Ressources, et la possibilité de découvrir nos activités.',
    plus: ['Statut Mécène Ressources', 'Visite et découverte des activités', "Bilan annuel d'impact"],
  },
  {
    nom: 'Mécène engagé',
    texte: 'Une reconnaissance renforcée et un lien direct avec vos équipes.',
    plus: [
      'Tout ce qui précède',
      'Un atelier découverte pour vos collaborateurs, informatique ou végétal',
      'Une rencontre annuelle autour du projet et de son impact',
    ],
    accent: true,
  },
  {
    nom: "Mécène d'honneur",
    texte: "Le niveau le plus engagé, avec une place à part dans le lancement de Ressources.",
    plus: [
      'Tous les autres statuts',
      "Distinction « mécène d'honneur de lancement 2026 »",
      'Espace dédié sur le Mur des mécènes',
      "Bilan d'impact personnalisé et rencontre annuelle dédiée",
      'Ateliers découverte, informatique et végétal',
      'Des ordinateurs reconditionnés remis solidairement grâce à votre soutien',
    ],
  },
]

const AUTRES = [
  {
    titre: 'Un lieu',
    texte:
      "Un terrain, un local ou un bâtiment, pour accueillir le public, stocker, reconditionner, organiser des ateliers et développer la filière végétale.",
  },
  { titre: 'Une mobilité', texte: "Le don ou la mise à disposition d'un véhicule utilitaire pour les collectes." },
  { titre: 'Du matériel et des compétences', texte: 'Outillage, équipements professionnels, expertise ou mécénat de compétences.' },
  {
    titre: 'Votre matériel informatique',
    texte: "Du matériel inutilisé, confié à Ressources pour favoriser son réemploi, avec effacement sécurisé des données.",
  },
]

const INDICATEURS = [
  { titre: 'Réemploi', texte: 'Kilos de matériel collecté, équipements diagnostiqués, reconditionnés et remis en circulation.' },
  { titre: 'Mobilisation', texte: 'Ateliers réalisés, personnes sensibilisées, collectivités et entreprises mobilisées.' },
  { titre: 'Impact solidaire', texte: 'Bénéficiaires et ordinateurs remis solidairement.' },
  { titre: 'Structuration', texte: 'Végétaux remis en circulation, et emploi structuré grâce au mécénat.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Un mécénat auprès de Ressources ouvre-t-il droit à une réduction d\'impôt ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Les dons à une association d'intérêt général ouvrent droit, pour les entreprises, à une réduction d'impôt de 60 % du montant versé, dans la limite de 20 000 € ou 5 ‰ du chiffre d'affaires HT, le montant le plus élevé étant retenu (CGI, art. 238 bis). Une attestation fiscale est délivrée.",
      },
    },
    {
      '@type': 'Question',
      name: 'Que finance le mécénat ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "La priorité de Ressources est de créer et pérenniser son premier emploi de coordination, puis de renforcer l'équipe, pour développer les partenariats, coordonner les collectes, structurer les filières et assurer le suivi et la traçabilité. Le mécénat ne finance pas une opération ponctuelle : il donne à Ressources les moyens d'agir durablement.",
      },
    },
    {
      '@type': 'Question',
      name: 'Une entreprise peut-elle aider autrement que financièrement ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui : en mettant à disposition un lieu, un véhicule utilitaire, du matériel ou des compétences, ou en confiant son matériel informatique inutilisé à Ressources.",
      },
    },
  ],
}

export default function Mecene() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Mécénat & partenariats d'entreprise · Recyclerie solidaire Landes | Association Ressources"
        description="Donnez à Ressources, recyclerie solidaire informatique et végétale des Landes, les moyens d'agir durablement : quatre niveaux d'engagement, soutien en nature, réduction d'impôt de 60 % pour les entreprises."
        canonical="/soutenir/mecene/"
        schema={faqSchema}
      />

      {/* Hero */}
      <section className="bg-kaki text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Mécénat & partenariats 2026
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Donnez à Ressources les moyens d'agir durablement
          </h1>
          <p className="text-white/65 max-w-xl leading-relaxed mb-7">
            Rejoignez les entreprises qui accompagnent le lancement de la recyclerie
            solidaire des Landes : réemploi informatique, réemploi végétal,
            solidarité, territoire.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={MAIL_DOSSIER} className="btn-ocre text-sm">Recevoir le dossier de mécénat</a>
            <a href="#niveaux" className="btn-outline-white text-sm">Les niveaux d'engagement</a>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Qui sommes-nous */}
          <div className="mb-16">
            <p className="section-label">Qui sommes-nous</p>
            <h2 className="font-serif text-2xl md:text-3xl text-terre mb-4">
              Un acteur territorial du réemploi solidaire
            </h2>
            <p className="text-sm text-terre/65 leading-relaxed max-w-2xl mb-8">
              Ressources développe dans les Landes deux filières locales de réemploi :
              l'informatique et le végétal. Notre objectif : prolonger la durée de vie
              des équipements et des végétaux, éviter le gaspillage et rendre ces
              ressources à nouveau utiles au territoire.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {FILIERES.map(({ titre, texte }) => (
                <div key={titre} className="border-t-2 border-ocre/40 pt-4">
                  <h3 className="font-serif text-xl text-terre mb-1.5">{titre}</h3>
                  <p className="text-sm text-terre/60 leading-relaxed">{texte}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Une dynamique déjà engagée */}
          <div className="mb-16 bg-beige-light border border-beige-dark p-6 md:p-8">
            <p className="section-label">Une dynamique déjà engagée</p>
            <h2 className="font-serif text-2xl md:text-3xl text-terre mb-6">
              Le territoire est déjà en mouvement
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="font-serif text-4xl text-ocre leading-none mb-1.5">{DEFI.collecteKg} kg</p>
                <p className="text-sm text-terre/60 leading-relaxed">
                  de matériel collectés lors du challenge territorial, pour un objectif d'une demi-tonne.
                </p>
              </div>
              <div>
                <p className="font-serif text-4xl text-ocre leading-none mb-1.5">{communes.length} communes</p>
                <p className="text-sm text-terre/60 leading-relaxed">
                  mobilisées, avec des associations, des commerces et des entreprises du territoire.
                </p>
              </div>
              <div>
                <p className="font-serif text-4xl text-ocre leading-none mb-1.5">{DEFI.multiple} fois</p>
                <p className="text-sm text-terre/60 leading-relaxed">
                  l'objectif d'une demi-tonne : un résultat qui dit l'envie du territoire d'agir.
                </p>
              </div>
            </div>
            <Link to="/defi-collecte/" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">
              → Le bilan du challenge
            </Link>
          </div>

          {/* La priorité */}
          <div className="mb-16">
            <p className="section-label">La priorité</p>
            <h2 className="font-serif text-2xl md:text-3xl text-terre mb-4">
              Structurer Ressources pour changer d'échelle
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <p className="text-sm text-terre/65 leading-relaxed">
                Notre première priorité en 2026 et 2027 : créer et pérenniser le premier
                emploi de coordination, puis renforcer progressivement l'équipe. Ce poste
                permettra de développer les partenariats, coordonner les collectes,
                structurer les filières, organiser les actions et assurer leur suivi et
                leur traçabilité.
              </p>
              <p className="text-sm text-terre font-medium leading-relaxed border-l-2 border-ocre pl-5">
                Le mécénat ne finance pas une opération ponctuelle : il donne à Ressources
                les moyens d'agir durablement.
              </p>
            </div>
            <ol className="grid sm:grid-cols-3 gap-6">
              {ETAPES.map(({ titre, texte }, i) => (
                <li key={titre} className="flex gap-4">
                  <span className="w-9 h-9 rounded-full bg-kaki-pale border border-kaki/30 text-kaki font-serif flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-terre mb-1">{titre}</h3>
                    <p className="text-sm text-terre/60 leading-relaxed">{texte}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Niveaux */}
          <div id="niveaux" className="mb-16 scroll-mt-28 md:scroll-mt-32">
            <p className="section-label">Quatre niveaux d'engagement</p>
            <h2 className="font-serif text-2xl md:text-3xl text-terre mb-4">Choisissez votre niveau</h2>
            <p className="text-sm text-terre/65 leading-relaxed max-w-2xl mb-3">
              <strong className="text-terre">Pour tous nos soutiens :</strong> votre logo sur
              la page partenaires, une présence sur le Mur des soutiens et mécènes, un
              remerciement, une invitation aux temps forts et le suivi de l'impact.
            </p>
            <p className="text-xs text-terre/45 italic max-w-2xl mb-8">
              Ces éléments de reconnaissance restent accessoires au don et ne constituent
              pas une prestation publicitaire.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              {NIVEAUX.map(({ nom, texte, plus, accent }) => (
                <div
                  key={nom}
                  className={`p-5 border-t-2 ${accent ? 'border-ocre bg-ocre-pale' : 'border-kaki bg-beige-light'}`}
                >
                  <h3 className="font-serif text-xl text-terre mb-2">{nom}</h3>
                  <p className="text-sm text-terre/65 leading-relaxed mb-4">{texte}</p>
                  {plus.length > 0 && (
                    <ul className="space-y-1.5">
                      {plus.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-xs text-terre/65 leading-relaxed">
                          <span className={`mt-0.5 shrink-0 ${accent ? 'text-ocre' : 'text-kaki'}`}>✓</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-terre/60 leading-relaxed">
              Les montants de chaque niveau sont détaillés dans notre dossier de mécénat,
              que nous vous envoyons sur simple demande.{' '}
              <a href={MAIL_DOSSIER} className="text-ocre hover:underline font-medium">
                Recevoir le dossier
              </a>
            </p>
          </div>

          {/* Autres formes de soutien */}
          <div className="mb-16">
            <p className="section-label">Contribuer autrement</p>
            <h2 className="font-serif text-2xl md:text-3xl text-terre mb-4">
              Une entreprise peut apporter des moyens
            </h2>
            <p className="text-sm text-terre/65 leading-relaxed max-w-2xl mb-8">
              Notre priorité reste le mécénat financier nécessaire à la structuration
              durable de Ressources, mais d'autres formes de soutien sont précieuses.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {AUTRES.map(({ titre, texte }) => (
                <div key={titre} className="border-l-2 border-ocre/40 pl-5">
                  <h3 className="font-serif text-lg text-terre mb-1">{titre}</h3>
                  <p className="text-sm text-terre/60 leading-relaxed">{texte}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="mb-16">
            <p className="section-label">Impact du mécénat</p>
            <h2 className="font-serif text-2xl md:text-3xl text-terre mb-4">Un engagement complet, un impact mesurable</h2>
            <p className="text-sm text-terre/65 leading-relaxed max-w-2xl mb-6">
              Ressources suit des indicateurs précis et transmet un bilan d'impact annuel
              à ses mécènes. Les équipements reconditionnés sont remis à des personnes
              rencontrant des difficultés d'accès au numérique ; l'entreprise peut
              suggérer des bénéficiaires ou des structures, Ressources conserve la
              validation finale des attributions.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {INDICATEURS.map(({ titre, texte }) => (
                <div key={titre} className="bg-kaki-pale border border-kaki/15 p-4">
                  <h3 className="font-sans text-xs font-bold tracking-[0.12em] uppercase text-kaki mb-1.5">{titre}</h3>
                  <p className="text-xs text-terre/65 leading-relaxed">{texte}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fiscalité */}
          <div className="bg-beige p-6 md:p-8 mb-16">
            <h2 className="font-serif text-xl text-terre mb-3">Avantages fiscaux du mécénat</h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-3">
              Les dons à une association d'intérêt général ouvrent droit à une réduction d'impôt
              de <strong className="text-terre">60 % du montant versé</strong> pour les entreprises, dans la limite
              de 20 000 € ou 5 ‰ du chiffre d'affaires HT — le montant le plus élevé étant retenu
              (CGI, art. 238 bis). Une attestation fiscale est délivrée.
            </p>
            <p className="text-xs text-terre/40 italic">
              Sous réserve de la situation fiscale de l'entreprise et des plafonds légaux applicables.
              L'association Ressources relève de l'intérêt général. Pour un don en nature, la
              valorisation retenue est la valeur nette comptable du bien : consultez votre conseiller fiscal.
            </p>
          </div>

          {/* Passer à l'action */}
          <div className="bg-kaki text-white p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-3">Passer à l'action</h2>
            <p className="text-white/70 leading-relaxed max-w-2xl mb-3">
              Ressources souhaite réunir autour de son projet les entreprises qui partagent
              une même ambition : réduire le gaspillage, favoriser le réemploi et créer
              de nouvelles solidarités sur le territoire.
            </p>
            <p className="text-white font-medium leading-relaxed max-w-2xl mb-6">
              Échangeons quelques minutes pour identifier la forme d'engagement la plus
              adaptée à votre entreprise.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href={MAIL_DOSSIER} className="btn-ocre text-sm">Recevoir le dossier de mécénat</a>
              <a href="tel:+33662660484" className="btn-outline-white text-sm">06 62 66 04 84</a>
              <a href="mailto:contact@ressourcesrecyclerie.fr" className="text-sm text-white/70 hover:text-white underline underline-offset-4">
                contact@ressourcesrecyclerie.fr
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
