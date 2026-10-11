import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Soutenir', href: '/soutenir/' },
  { label: 'Mécénat & partenariat' },
]

// Le dossier de mécénat 2026 reste un document qu'on envoie sur demande : la
// page en donne l'esprit, pas les montants, le budget ni le détail des
// contreparties.
const MAIL_DOSSIER =
  'mailto:contact@ressourcesrecyclerie.fr?subject=' +
  encodeURIComponent('Dossier de mécénat 2026') +
  '&body=' +
  encodeURIComponent(
    "Bonjour,\n\nJe souhaite recevoir le dossier de mécénat 2026 de l'association Ressources.\n\nEntreprise :\nContact :\n",
  )

const NIVEAUX = [
  { nom: 'Soutien solidaire', texte: 'Rejoindre les entreprises qui soutiennent Ressources.' },
  { nom: 'Mécène Ressources', texte: 'Un statut de mécène, la découverte de nos activités, un bilan annuel.' },
  { nom: 'Mécène engagé', texte: 'Une reconnaissance renforcée et un atelier découverte pour vos équipes.', accent: true },
  { nom: "Mécène d'honneur", texte: 'La place la plus engagée dans le lancement de Ressources.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Un mécénat auprès de Ressources ouvre-t-il droit à une réduction d'impôt ?",
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
        text: "Le premier emploi de coordination de Ressources, puis le renforcement de l'équipe. Le mécénat ne finance pas une opération ponctuelle : il donne à Ressources les moyens d'agir durablement.",
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
            Mécénat & partenariats
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Donnez à Ressources les moyens d'agir durablement
          </h1>
          <p className="text-white/65 max-w-xl leading-relaxed mb-7">
            Rejoignez les entreprises qui accompagnent le lancement de la recyclerie
            solidaire des Landes, pour le réemploi informatique et végétal.
          </p>
          <a href={MAIL_DOSSIER} className="btn-ocre text-sm">Recevoir le dossier de mécénat</a>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Priorité */}
          <div className="mb-14">
            <p className="text-terre/70 leading-relaxed max-w-2xl mb-3">
              Votre mécénat finance ce qui permet de tenir dans la durée : le premier
              emploi de coordination de Ressources, puis le renforcement de l'équipe.
            </p>
            <p className="text-sm text-terre font-medium border-l-2 border-ocre pl-4 max-w-2xl">
              Il ne finance pas une opération ponctuelle : il donne à Ressources les
              moyens d'agir durablement.
            </p>
          </div>

          {/* Niveaux */}
          <div className="mb-14">
            <h2 className="font-serif text-2xl text-terre mb-5">Quatre niveaux d'engagement</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {NIVEAUX.map(({ nom, texte, accent }) => (
                <div key={nom} className={`p-5 border-t-2 ${accent ? 'border-ocre bg-ocre-pale' : 'border-kaki bg-beige-light'}`}>
                  <h3 className="font-serif text-lg text-terre mb-1.5">{nom}</h3>
                  <p className="text-sm text-terre/65 leading-relaxed">{texte}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-terre/60 leading-relaxed">
              Tous les soutiens sont remerciés et suivis d'un bilan d'impact. Le détail
              et les montants figurent dans notre dossier, envoyé sur demande.
            </p>
          </div>

          {/* Autrement */}
          <p className="text-sm text-terre/65 leading-relaxed mb-14 max-w-2xl">
            <strong className="text-terre">Vous pouvez aussi contribuer autrement</strong> :
            mise à disposition d'un lieu, d'un véhicule utilitaire, de matériel ou de
            compétences, ou don de matériel informatique inutilisé.
          </p>

          {/* Fiscalité + contact */}
          <div className="bg-beige p-6 md:p-8">
            <h2 className="font-serif text-xl text-terre mb-3">60 % de réduction d'impôt pour les entreprises</h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-5">
              Les dons à une association d'intérêt général ouvrent droit à une réduction
              d'impôt de 60 % du montant versé, dans la limite de 20 000 € ou 5 ‰ du
              chiffre d'affaires HT, le montant le plus élevé étant retenu (CGI, art. 238 bis).
              Une attestation fiscale est délivrée. Sous réserve de votre situation
              fiscale et des plafonds légaux ; pour un don en nature, consultez votre
              conseiller fiscal.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href={MAIL_DOSSIER} className="btn-ocre text-sm">Recevoir le dossier de mécénat</a>
              <a href="tel:+33662660484" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">06 62 66 04 84</a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
