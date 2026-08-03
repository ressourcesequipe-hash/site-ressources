import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Notre processus' },
]

const ETAPES = [
  {
    num: '01',
    titre: 'Collecter',
    desc: 'Le matériel est récupéré sur les points de collecte partenaires ou lors d\'enlèvements à domicile. Un bordereau de réception est remis au donateur.',
    detail: 'Points de collecte sur le territoire · Enlèvements organisés · Événements de collecte',
  },
  {
    num: '02',
    titre: 'Trier',
    desc: 'Chaque appareil est identifié, enregistré et classé selon son état. Un identifiant unique lui est attribué pour assurer la traçabilité.',
    detail: 'Inventaire · Classification par état · Attribution d\'ID unique',
  },
  {
    num: '03',
    titre: 'Sécuriser',
    desc: 'Effacement sécurisé des données personnelles, selon un protocole adapté au type de support. Notre démarche s\'appuie notamment sur les recommandations du standard NIST SP 800-88 Rev. 2. Lorsque le traitement et le support le permettent, une attestation d\'effacement peut être établie.',
    detail: 'NIST SP 800-88 Rev. 2 · Traçabilité · Démarche RGPD',
  },
  {
    num: '04',
    titre: 'Diagnostiquer',
    desc: 'Contrôle technique approfondi : batterie, écran, clavier, connectiques, carte mère. Les appareils non récupérables sont orientés vers le recyclage responsable.',
    detail: 'Diagnostic complet · Taux de récupération estimé > 70% · Recyclage certifié pour le reste',
  },
  {
    num: '05',
    titre: 'Reconditionner',
    desc: 'Nettoyage, réparation si nécessaire, installation d\'un système d\'exploitation libre (GNU/Linux) ou sous licence, tests de fonctionnement complets.',
    detail: 'GNU/Linux · Nettoyage physique · Tests fonctionnels',
  },
  {
    num: '06',
    titre: 'Remettre en circulation',
    desc: 'Plusieurs voies complémentaires : actions solidaires, remise à des bénéficiaires identifiés avec nos partenaires, vente à prix accessible au grand public, ou orientation vers d\'autres filières de réemploi.',
    detail: 'Voies solidaires · Vente accessible · Territoire landais',
  },
]

export default function Reconditionnement() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Reconditionnement Informatique Solidaire Landes | Ressources"
        description="Découvrez les 6 étapes de la filière informatique de l'association Ressources : collecte, tri, effacement des données, diagnostic, reconditionnement et redistribution solidaire dans les Landes."
        canonical="/recyclerie-informatique/reconditionnement/"
      />

      <section className="bg-kaki text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Recyclerie informatique
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Notre processus de reconditionnement
          </h1>
          <p className="text-white/65 max-w-xl leading-relaxed">
            De la collecte à la redistribution, chaque appareil suit un processus
            rigoureux pour garantir qualité, sécurité et traçabilité.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-0">
            {ETAPES.map(({ num, titre, desc, detail }, i) => (
              <div key={num} className="relative flex gap-6 pb-10 last:pb-0">
                {/* Ligne verticale */}
                {i < ETAPES.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-px bg-beige-dark" aria-hidden />
                )}
                {/* Numéro */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-beige-light border-2 border-ocre flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-serif text-ocre text-xs font-bold">{num}</span>
                </div>
                {/* Contenu */}
                <div className="flex-1 pt-1">
                  <h2 className="font-serif text-xl text-terre mb-2">{titre}</h2>
                  <p className="text-sm text-terre/65 leading-relaxed mb-3">{desc}</p>
                  <p className="text-xs text-ocre font-medium">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-beige border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-serif text-lg text-terre mb-1">Prêt·e à donner votre matériel ?</p>
            <p className="text-sm text-terre/55">Votre don part entre de bonnes mains.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/recyclerie-informatique/comment-donner/" className="btn-ocre text-sm">
              Je donne du matériel
            </Link>
            <Link to="/recyclerie-informatique/effacement-donnees/" className="btn-outline-ocre text-sm">
              Sécurité des données
            </Link>
          </div>
        </div>
      </section>

      <section className="py-6 bg-beige border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/recyclerie-informatique/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie informatique
          </Link>
        </div>
      </section>
    </Layout>
  )
}

