import Layout from '../components/Layout'
import SEO from '../components/SEO'

export default function MentionsLegales() {
  return (
    <Layout>
      <SEO
        title="Mentions légales | Association Ressources"
        description="Mentions légales de l'association Ressources, recyclerie solidaire dans les Landes (40). Éditeur, hébergeur, propriété intellectuelle, responsabilité."
        canonical="/mentions-legales/"
      />

      <section className="bg-beige py-12 md:py-16 border-b border-beige-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Informations légales
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre">Mentions légales</h1>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose-legale">

          <div className="space-y-10 text-terre/70 text-sm leading-relaxed">

            {/* Éditeur */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Éditeur du site</h2>
              <p><strong className="text-terre">Dénomination sociale :</strong> Association Ressources</p>
              <p><strong className="text-terre">Forme juridique :</strong> Association loi 1901</p>
              <p><strong className="text-terre">Siège social :</strong> 80 allée des Cigales, 40560 Vielle-Saint-Girons</p>
              <p><strong className="text-terre">SIRET :</strong> en cours d'attribution</p>
              <p><strong className="text-terre">Email :</strong>{' '}
                <a href="mailto:contact@ressourcesrecyclerie.fr" className="text-ocre hover:underline">
                  contact@ressourcesrecyclerie.fr
                </a>
              </p>
              <p><strong className="text-terre">Directeur de la publication :</strong> Sandrine Vestris (présidente)</p>
            </div>

            {/* Hébergeur */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Hébergement</h2>
              <p><strong className="text-terre">Hébergeur :</strong> Vercel Inc.</p>
              <p><strong className="text-terre">Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <p><strong className="text-terre">Site :</strong>{' '}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-ocre hover:underline">
                  vercel.com
                </a>
              </p>
            </div>

            {/* Propriété intellectuelle */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu de ce site (textes, visuels, structure, code) est la propriété exclusive
                de l'association Ressources, sauf mention contraire. Toute reproduction, même partielle,
                est soumise à autorisation préalable.
              </p>
            </div>

            {/* Responsabilité */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Limitation de responsabilité</h2>
              <p>
                L'association Ressources s'efforce de maintenir les informations publiées sur ce site
                exactes et à jour. Elle ne saurait être tenue responsable des erreurs ou omissions,
                ni de l'utilisation qui en serait faite.
              </p>
              <p className="mt-3">
                Les liens hypertextes vers des sites tiers sont fournis à titre informatif.
                L'association Ressources n'exerce aucun contrôle sur ces sites et décline
                toute responsabilité quant à leur contenu.
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Cookies</h2>
              <p>
                Ce site n'utilise pas de cookies de traçage publicitaire. Des cookies techniques
                strictement nécessaires au fonctionnement du site peuvent être déposés.
                Aucune donnée à caractère personnel n'est collectée sans votre consentement explicite.
              </p>
            </div>

            {/* Droit applicable */}
            <div>
              <h2 className="font-serif text-xl text-terre mb-4">Droit applicable</h2>
              <p>
                Le présent site et ses mentions légales sont soumis au droit français.
                En cas de litige, les tribunaux français seront seuls compétents.
              </p>
              <p className="mt-3 text-terre/50 text-xs">
                Dernière mise à jour : juin 2026
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  )
}
