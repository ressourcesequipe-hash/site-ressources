import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { IconSecurite, IconDocument, IconTracabilite, IconConformite } from '../../components/Icons'

const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Sécurité des données' },
]

export default function EffacementDonnees() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Effacement sécurisé des données — don informatique Landes"
        description="Avant toute remise en circulation, l'association Ressources applique un protocole d'effacement sécurisé des données, appuyé sur les recommandations du standard NIST SP 800-88 Rev. 2, dans les Landes."
        canonical="/recyclerie-informatique/effacement-donnees/"
      />

      <section className="py-12 md:py-16 border-b border-kaki/10" style={{ backgroundColor: "#E5E4D5" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Sécurité & RGPD
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Effacement sécurisé des données
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Avant toute remise en circulation d'un équipement informatique,
            Ressources applique un protocole d'effacement sécurisé adapté au type
            de support concerné.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 mb-14">
            <div>
              <h2 className="font-serif text-2xl text-terre mb-4">Notre protocole d'effacement</h2>
              <div className="space-y-5">
                {[
                  { icon: <IconSecurite className="w-5 h-5" />, title: 'Protocole adapté au support', desc: 'Notre démarche s\'appuie notamment sur les recommandations du standard NIST SP 800-88 Rev. 2 relatives à la sanitisation des supports numériques. La méthode retenue dépend de la technologie du support (disque magnétique, SSD, mémoire embarquée).' },
                  { icon: <IconDocument className="w-5 h-5" />, title: 'Attestation d\'effacement', desc: 'Lorsque le traitement et le support le permettent, une traçabilité de l\'opération peut être conservée et un certificat ou une attestation d\'effacement peut être établi. Indiquez-nous votre besoin au moment du don.' },
                  { icon: <IconTracabilite className="w-5 h-5" />, title: 'Traçabilité du matériel', desc: 'Chaque appareil est tracé de sa réception jusqu\'à sa remise en circulation ou son orientation vers une filière de recyclage.' },
                  { icon: <IconConformite className="w-5 h-5" />, title: 'Démarche RGPD', desc: 'Notre protocole s\'inscrit dans le cadre du Règlement Général sur la Protection des Données (RGPD).' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-9 h-9 shrink-0 border border-ocre/25 bg-ocre/5 flex items-center justify-center text-ocre mt-0.5" aria-hidden>{icon}</div>
                    <div>
                      <p className="font-sans text-sm font-semibold text-terre mb-1">{title}</p>
                      <p className="text-xs text-terre/55 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-beige-light border border-beige-dark p-6 mb-5">
                <h3 className="font-serif text-lg text-terre mb-3">Que deviennent vos données ?</h3>
                <p className="text-sm text-terre/65 leading-relaxed mb-3">
                  L'effacement sécurisé vise à rendre les données du support
                  inexploitables avant toute remise en circulation. Le niveau
                  atteint dépend de la technologie du support et de l'état de
                  l'appareil, ce qui détermine la méthode appliquée.
                </p>
                <p className="text-sm text-terre/65 leading-relaxed">
                  Lorsque l'effacement sécurisé d'un support n'est pas techniquement
                  possible ou présente un niveau de risque insuffisant, le support
                  peut être orienté vers une procédure adaptée de destruction ou de
                  traitement spécialisé.
                </p>
              </div>
              <div className="bg-ocre-pale border border-ocre/20 p-6">
                <p className="text-xs text-ocre font-semibold tracking-wider uppercase mb-2">Conseil pratique</p>
                <p className="text-sm text-terre/65 leading-relaxed">
                  Si vous le souhaitez, vous pouvez effectuer une sauvegarde de vos données
                  importantes avant de nous remettre votre équipement. Nous vous
                  recommandons de déconnecter les comptes en ligne (Google, Apple, etc.)
                  si vous en avez la possibilité.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/recyclerie-informatique/comment-donner/" className="btn-ocre">
              Je donne mon matériel en toute confiance
            </Link>
            <Link to="/recyclerie-informatique/" className="btn-outline-ocre">
              Retour à la recyclerie
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}


