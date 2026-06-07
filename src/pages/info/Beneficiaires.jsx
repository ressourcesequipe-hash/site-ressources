import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { IconFamille, IconEcole, IconPartenaires, IconBriefcase, IconMaison, IconSenior } from '../../components/Icons'

const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Acheter du matériel reconditionné' },
]

export default function Beneficiaires() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Acheter un Ordinateur Reconditionné Landes | Ressources"
        description="Achetez un ordinateur, tablette ou smartphone reconditionné à prix solidaire dans les Landes (40). L'association Ressources propose des équipements remis en état, bien en dessous du prix du marché."
        canonical="/recyclerie-informatique/beneficiaires/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Vente solidaire
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Acheter du matériel reconditionné
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Les équipements reconditionnés par Ressources sont proposés à la vente
            à prix solidaire — bien en dessous du marché. Accessible à tous,
            avec des conditions adaptées pour les structures sociales et partenaires.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Principe */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">Une vente solidaire</h2>
            <p className="text-terre/65 leading-relaxed mb-4">
              Notre modèle repose sur la <strong className="text-terre">revalorisation</strong> :
              les équipements collectés sont reconditionnés par des bénévoles compétents,
              puis vendus à des prix inférieurs au marché du reconditionné classique.
              Cette approche permet à l'association de couvrir ses frais et d'assurer
              la pérennité de la filière.
            </p>
            <p className="text-terre/65 leading-relaxed">
              Quelques équipements peuvent faire l'objet d'une mise à disposition
              pour des structures partenaires dans le cadre d'accords spécifiques.
            </p>
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

          {/* Chiffres */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { val: '120', label: 'équipements revendus par an (objectif)' },
              { val: '100%', label: 'des appareils réemployés ou valorisés' },
              { val: '-50%', label: 'en dessous du prix du marché en moyenne' },
              { val: '3', label: 'communes partenaires à l\'ouverture' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center bg-beige-light border border-beige-dark p-4">
                <p className="font-serif text-3xl text-ocre leading-none mb-1">{val}</p>
                <p className="text-xs text-terre/50 leading-snug">{label}</p>
              </div>
            ))}
          </div>

          {/* Processus */}
          <div className="mb-10">
            <h2 className="font-serif text-2xl text-terre mb-6">Comment acheter un équipement ?</h2>
            <div className="space-y-4">
              {[
                { num: '1', title: 'Nous contacter', desc: 'Décrivez votre besoin (type d\'appareil, usage prévu) par email ou via le formulaire. Nous vérifions la disponibilité du stock.' },
                { num: '2', title: 'Proposition et prix', desc: 'Nous vous proposons l\'équipement disponible correspondant à vos besoins, avec son prix solidaire et une description de son état.' },
                { num: '3', title: 'Achat sur place', desc: 'La transaction se fait sur le point de collecte de Vielle-Saint-Girons. Un reçu vous est remis.' },
                { num: '4', title: 'Prise en main', desc: 'Nos bénévoles peuvent vous accompagner brièvement dans la prise en main de l\'équipement si nécessaire.' },
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
                  a: 'Nous offrons une garantie de bon fonctionnement au moment de la vente. En cas de défaut constaté rapidement après l\'achat, nous étudions chaque situation au cas par cas.',
                },
                {
                  q: 'Puis-je donner et racheter un équipement reconditionné ?',
                  a: 'Oui, tout à fait. Le cycle de vie est exactement celui-là : vous donnez votre ancien matériel, et vous pouvez acheter un équipement reconditionné par d\'autres donateurs.',
                },
                {
                  q: 'Les données des anciens propriétaires sont-elles effacées ?',
                  a: 'Absolument. Chaque équipement passe par un effacement certifié de ses données avant tout reconditionnement ou vente. Voir notre page dédiée à la sécurité des données.',
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

          <Link to="/recyclerie-informatique/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie informatique
          </Link>
        </div>
      </section>
    </Layout>
  )
}

