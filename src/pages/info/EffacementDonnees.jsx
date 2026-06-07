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
        title="Effacement certifié des données — don informatique sécurisé Landes"
        description="Donnez votre ordinateur l'esprit tranquille. L'association Ressources garantit l'effacement certifié de vos données personnelles (RGPD) avant tout reconditionnement dans les Landes."
        canonical="/recyclerie-informatique/effacement-donnees/"
      />

      <section className="py-12 md:py-16 border-b border-kaki/10" style={{ backgroundColor: "#E5E4D5" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Sécurité & RGPD
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Vos données personnelles sont en sécurité
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Avant tout reconditionnement ou recyclage, nous effaçons intégralement
            et de façon certifiée toutes les données présentes sur votre équipement.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 mb-14">
            <div>
              <h2 className="font-serif text-2xl text-terre mb-4">Notre processus d'effacement</h2>
              <div className="space-y-5">
                {[
                  { icon: <IconSecurite className="w-5 h-5" />, title: 'Effacement selon normes reconnues', desc: 'Nous appliquons les standards NIST SP 800-88 (écrasement multi-passes) sur tous les supports de stockage.' },
                  { icon: <IconDocument className="w-5 h-5" />, title: 'Certificat d\'effacement', desc: 'Un certificat nominatif est émis pour chaque appareil traité, attestant l\'effacement complet des données.' },
                  { icon: <IconTracabilite className="w-5 h-5" />, title: 'Traçabilité complète', desc: 'Chaque appareil est tracé de sa réception jusqu\'à sa redistribution ou son recyclage.' },
                  { icon: <IconConformite className="w-5 h-5" />, title: 'Conformité RGPD', desc: 'Notre processus est conforme au Règlement Général sur la Protection des Données (RGPD/GDPR).' },
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
                  Après effacement certifié, il est <strong className="text-terre">impossible</strong> de
                  récupérer les données qui étaient sur votre appareil. C'est une garantie absolue.
                </p>
                <p className="text-sm text-terre/65 leading-relaxed">
                  Si l'appareil est trop endommagé pour être effacé logiciellement,
                  le disque dur est physiquement détruit avant tout autre traitement.
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

