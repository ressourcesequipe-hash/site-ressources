import Layout from '../components/Layout'
import SEO from '../components/SEO'

export default function Confidentialite() {
  return (
    <Layout>
      <SEO
        title="Politique de confidentialité | Association Ressources"
        description="Politique de confidentialité et protection des données personnelles de l'association Ressources, recyclerie solidaire dans les Landes (40). Conformité RGPD."
        canonical="/confidentialite/"
      />

      <section className="bg-beige py-12 md:py-16 border-b border-beige-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Protection des données
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre">Politique de confidentialité</h1>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          <div className="space-y-10 text-terre/70 text-sm leading-relaxed">

            {/* Responsable */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Responsable du traitement</h2>
              <p>
                L'association Ressources (80 allée des Cigales, 40560 Vielle-Saint-Girons)
                est responsable du traitement des données personnelles collectées via ce site.
              </p>
              <p className="mt-2">
                Contact :{' '}
                <a href="mailto:contact@ressourcesrecyclerie.fr" className="text-ocre hover:underline">
                  contact@ressourcesrecyclerie.fr
                </a>
              </p>
            </div>

            {/* Données collectées */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Données collectées</h2>
              <p>Nous collectons uniquement les données que vous nous transmettez volontairement via :</p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside text-terre/60">
                <li>Le formulaire de contact (nom, email, message)</li>
                <li>Le formulaire de demande d'enlèvement (nom, téléphone, email, commune, description du matériel)</li>
                <li>Le formulaire de bénévolat (nom, email, disponibilités, compétences)</li>
              </ul>
              <p className="mt-3">
                Nous ne collectons pas de données de navigation, de cookies publicitaires,
                ni de données sensibles au sens du RGPD.
              </p>
            </div>

            {/* Finalités */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Finalités du traitement</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-beige">
                  <thead>
                    <tr className="bg-beige">
                      <th className="text-left p-3 text-terre font-semibold">Données</th>
                      <th className="text-left p-3 text-terre font-semibold">Finalité</th>
                      <th className="text-left p-3 text-terre font-semibold">Durée de conservation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige">
                    <tr>
                      <td className="p-3">Nom, email, message</td>
                      <td className="p-3">Répondre à votre demande de contact</td>
                      <td className="p-3">3 ans après le dernier contact</td>
                    </tr>
                    <tr>
                      <td className="p-3">Nom, téléphone, adresse, matériel</td>
                      <td className="p-3">Organiser un enlèvement de matériel</td>
                      <td className="p-3">1 an après l'enlèvement</td>
                    </tr>
                    <tr>
                      <td className="p-3">Nom, email, compétences</td>
                      <td className="p-3">Gestion des bénévoles</td>
                      <td className="p-3">Durée de la relation bénévole + 1 an</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Base légale */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Base légale</h2>
              <p>
                Les traitements reposent sur votre <strong className="text-terre">consentement</strong> (formulaires)
                et sur l'<strong className="text-terre">intérêt légitime</strong> de l'association
                (gestion des opérations de collecte et de bénévolat).
              </p>
            </div>

            {/* Partage */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Partage des données</h2>
              <p>
                Vos données ne sont jamais vendues ni cédées à des tiers à des fins commerciales.
                Elles peuvent être transmises à des prestataires techniques (hébergement, email)
                dans le strict cadre de la fourniture de leur service et sous contrat de traitement de données.
              </p>
            </div>

            {/* Droits */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Vos droits</h2>
              <p>Conformément au RGPD (Règlement UE 2016/679), vous disposez des droits suivants :</p>
              <ul className="mt-3 space-y-1.5 list-disc list-inside text-terre/60">
                <li><strong className="text-terre">Accès</strong> — connaître les données que nous détenons sur vous</li>
                <li><strong className="text-terre">Rectification</strong> — corriger des données inexactes</li>
                <li><strong className="text-terre">Effacement</strong> — demander la suppression de vos données</li>
                <li><strong className="text-terre">Opposition</strong> — vous opposer à un traitement</li>
                <li><strong className="text-terre">Portabilité</strong> — recevoir vos données dans un format structuré</li>
                <li><strong className="text-terre">Limitation</strong> — restreindre un traitement en cours</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous :{' '}
                <a href="mailto:contact@ressourcesrecyclerie.fr" className="text-ocre hover:underline">
                  contact@ressourcesrecyclerie.fr
                </a>
              </p>
              <p className="mt-3">
                En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la{' '}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ocre hover:underline"
                >
                  CNIL
                </a>.
              </p>
            </div>

            {/* Sécurité */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Sécurité</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles adaptées
                pour protéger vos données contre tout accès non autorisé, perte ou divulgation.
                Le site est servi en HTTPS. Les accès aux données sont restreints aux membres
                de l'équipe qui en ont besoin.
              </p>
            </div>

            <p className="text-terre/40 text-xs border-t border-beige pt-6">
              Dernière mise à jour : juin 2026
            </p>

          </div>
        </div>
      </section>
    </Layout>
  )
}
