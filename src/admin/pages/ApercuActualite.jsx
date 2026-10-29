import { ArticleVue } from '../../pages/association/ArticlePage'
import { tempsLecture, versArticlePublic } from '../../../lib/actualites.js'

// Aperçu d'une actualité telle qu'elle paraîtra sur le site, avec la page
// publique elle-même : ce que l'on voit ici est ce qui sera mis en ligne.
//
// Le formulaire est transmis par localStorage plutôt que relu dans la base,
// pour montrer aussi les modifications pas encore enregistrées. localStorage
// et non sessionStorage : l'aperçu s'ouvre dans un nouvel onglet.
export const CLE_APERCU = 'apercu-actualite'

export default function ApercuActualite() {
  let form = null
  try { form = JSON.parse(localStorage.getItem(CLE_APERCU) || 'null') } catch { /* rien à montrer */ }

  if (!form) {
    return (
      <p className="p-10 text-center text-terre/60 text-sm">
        Aucun aperçu à afficher. Ouvrez-le depuis la fiche de l'actualité.
      </p>
    )
  }

  const article = versArticlePublic({
    ...form,
    datePublication: form.datePublication || new Date().toISOString(),
    tempsLectureMinutes: tempsLecture(form.contenu),
  })

  return (
    <>
      <div className="sticky top-0 z-[100] bg-terre text-beige-light text-center text-[13px] py-2 px-4">
        Aperçu — cette version n'est pas encore en ligne.{' '}
        <button type="button" onClick={() => window.close()} className="underline font-semibold">Fermer</button>
      </div>
      <ArticleVue article={article} />
    </>
  )
}
