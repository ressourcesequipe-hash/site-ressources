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
                <li>Le formulaire de contact (nom, email, téléphone, sujet, message)</li>
                <li>Le formulaire de demande d'enlèvement (nom, téléphone, email, adresse, description du matériel)</li>
                <li>Le formulaire de bénévolat (nom, email, téléphone, commune, mission souhaitée, message)</li>
                <li>Le formulaire « nous rejoindre » (nom, email, commune, type d'engagement, message)</li>
                <li>Les formulaires partenaires — point de collecte et filière végétale (structure, nom du contact, email, téléphone, commune)</li>
                <li>Le formulaire d'inscription à l'événement de lancement (prénom, nom, email, commune, message)</li>
                <li>Le formulaire d'inscription à la newsletter (email)</li>
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
                    <tr>
                      <td className="p-3">Structure, nom du contact, email, téléphone, commune</td>
                      <td className="p-3">Suivi des points de collecte et des partenariats</td>
                      <td className="p-3">Durée du partenariat + 3 ans</td>
                    </tr>
                    <tr>
                      <td className="p-3">Email (et nom si vous l'avez indiqué)</td>
                      <td className="p-3">Envoi de la newsletter de l'association</td>
                      <td className="p-3">Jusqu'à votre désabonnement</td>
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
              <p className="mt-3">
                Les données transmises par les formulaires sont traitées par{' '}
                <strong className="text-terre">Brevo</strong>, société française qui héberge ses
                données dans l'Union européenne, agissant comme sous-traitant de l'association.
                Brevo assure l'acheminement des messages et la gestion des listes de diffusion.
                Son traitement relève de sa propre politique de confidentialité, consultable sur{' '}
                <a
                  href="https://www.brevo.com/fr/legal/privacypolicy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ocre hover:underline"
                >
                  brevo.com
                </a>.
              </p>
            </div>

            {/* Newsletter */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Newsletter</h2>
              <p>
                Vous ne recevez la newsletter de l'association que si vous l'avez
                <strong className="text-terre"> explicitement demandé</strong> : en utilisant le
                formulaire d'inscription à la newsletter, ou en cochant la case prévue à cet effet
                sur un autre formulaire. Cette case est toujours décochée par défaut.
              </p>
              <p className="mt-3">
                Écrire à l'association pour une autre raison — proposer un don de matériel, poser
                une question, candidater comme bénévole — ne vous inscrit à aucune communication.
              </p>
              <p className="mt-3">
                Chaque envoi comporte un lien de désabonnement. Une fois désabonné, vous ne pouvez
                pas être réinscrit sans une nouvelle démarche de votre part.
              </p>
            </div>

            {/* Cartes OpenStreetMap */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Cartes OpenStreetMap</h2>
              <p>
                La page de contact et la page de la tombola affichent une carte fournie par
                <strong className="text-terre"> OpenStreetMap</strong>. Pour l'afficher, votre
                navigateur contacte directement les serveurs d'OpenStreetMap, qui reçoivent
                à cette occasion votre adresse IP et les informations techniques que tout
                navigateur transmet lors d'une requête. L'association ne leur communique
                aucune donnée vous concernant et n'utilise ces cartes à aucune fin de suivi.
              </p>
              <p className="mt-3">
                Sur la page de la tombola, la carte n'est chargée qu'au moment où vous faites
                défiler la page jusqu'à elle : si vous ne l'atteignez pas, aucune requête
                n'est envoyée. Le traitement des données par OpenStreetMap relève de sa
                propre politique de confidentialité, consultable sur{' '}
                <a
                  href="https://osmfoundation.org/wiki/Privacy_Policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ocre hover:underline"
                >
                  osmfoundation.org
                </a>.
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
