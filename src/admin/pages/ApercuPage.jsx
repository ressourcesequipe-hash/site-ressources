import { PageCmsVue } from '../../pages/PageCms'

// Aperçu d'une page institutionnelle, avec le gabarit public lui-même. Même
// principe que l'aperçu des actualités (voir ApercuActualite.jsx) : le
// formulaire passe par localStorage, modifications non enregistrées comprises.
export const CLE_APERCU_PAGE = 'apercu-page'

export default function ApercuPage() {
  let form = null
  try { form = JSON.parse(localStorage.getItem(CLE_APERCU_PAGE) || 'null') } catch { /* rien à montrer */ }

  if (!form) {
    return (
      <p className="p-10 text-center text-terre/60 text-sm">
        Aucun aperçu à afficher. Ouvrez-le depuis la fiche de la page.
      </p>
    )
  }

  // Même correspondance que l'export (scripts/contenus.mjs).
  const page = {
    slug: form.slug || 'apercu',
    titre: form.titrePublic || form.titreInterne,
    extrait: form.extrait,
    contenu: form.contenu,
    image: form.image || null,
    imageAlt: form.imageAlt || null,
    imageCredit: form.imageCredit || null,
    seo: {},
  }

  return (
    <>
      <div className="sticky top-0 z-[100] bg-terre text-beige-light text-center text-[13px] py-2 px-4">
        Aperçu — cette version n'est pas encore en ligne.{' '}
        <button type="button" onClick={() => window.close()} className="underline font-semibold">Fermer</button>
      </div>
      <PageCmsVue page={page} />
    </>
  )
}
