import { Link } from 'react-router-dom'

// Rendu des blocs d'une page du back-office — §8.3 du cahier : l'équipe
// choisit le contenu, la charte graphique reste ici. Un type de bloc inconnu
// n'affiche rien plutôt que de casser la page.

const interne = (href) => typeof href === 'string' && href.startsWith('/')

function Lien({ href, className, children }) {
  if (!href) return <span className={className}>{children}</span>
  if (interne(href)) return <Link to={href} className={className}>{children}</Link>
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}</a>
}

function Image({ src, alt, className }) {
  if (!src) return null
  return <img src={src} alt={alt || ''} loading="lazy" decoding="async" className={className} />
}

const RENDUS = {
  heading: (b) => <h2 className="font-serif text-2xl text-terre mt-10 mb-4 leading-snug">{b.text}</h2>,

  paragraph: (b) => <p className="text-terre/70 leading-relaxed mb-4 whitespace-pre-line">{b.text}</p>,

  image: (b) => (
    <figure className="my-8">
      <Image src={b.src} alt={b.alt} className="w-full h-auto rounded-xl" />
      {(b.legende || b.credit) && (
        <figcaption className="text-xs text-terre/45 mt-2">
          {b.legende}{b.legende && b.credit ? ' — ' : ''}{b.credit && <span className="italic">{b.credit}</span>}
        </figcaption>
      )}
    </figure>
  ),

  imageTexte: (b) => (
    <div className="my-8 grid sm:grid-cols-2 gap-6 items-center">
      <Image src={b.src} alt={b.alt} className="w-full h-auto rounded-xl" />
      <p className="text-terre/70 leading-relaxed whitespace-pre-line">{b.text}</p>
    </div>
  ),

  galerie: (b) => (
    <div className="my-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {(b.images || []).map((im, i) => (
        <Image key={i} src={im.src} alt={im.alt} className="w-full aspect-square object-cover rounded-lg" />
      ))}
    </div>
  ),

  chiffresCles: (b) => (
    <div className="my-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
      {(b.chiffres || []).map((c, i) => (
        <div key={i} className="bg-beige-light border border-beige-dark rounded-xl p-5 text-center">
          <p className="font-serif text-3xl text-ocre">{c.valeur}</p>
          <p className="text-sm text-terre/60 mt-1">{c.libelle}</p>
        </div>
      ))}
    </div>
  ),

  cartes: (b) => (
    <div className="my-8 grid sm:grid-cols-2 gap-4">
      {(b.cartes || []).map((c, i) => (
        <Lien key={i} href={c.href} className="block bg-beige-light border border-beige-dark rounded-xl p-5 hover:border-ocre transition-colors">
          <p className="font-serif text-lg text-terre mb-1">{c.titre}</p>
          <p className="text-sm text-terre/60 leading-relaxed">{c.texte}</p>
        </Lien>
      ))}
    </div>
  ),

  appelAction: (b) => (
    <div className="my-10 bg-kaki text-white rounded-2xl p-7 sm:p-9">
      {b.titre && <p className="font-serif text-2xl mb-2">{b.titre}</p>}
      {b.text && <p className="text-white/80 leading-relaxed mb-5">{b.text}</p>}
      {b.href && b.label && <Lien href={b.href} className="btn-ocre text-sm inline-block">{b.label}</Lien>}
    </div>
  ),

  citation: (b) => (
    <blockquote className="my-8 border-l-2 border-ocre pl-5">
      <p className="font-serif text-xl text-terre leading-snug">« {b.text} »</p>
      {(b.auteur || b.fonction) && (
        <footer className="text-sm text-terre/55 mt-2">
          {b.auteur}{b.auteur && b.fonction ? ', ' : ''}{b.fonction}
        </footer>
      )}
    </blockquote>
  ),

  faq: (b) => (
    <div className="my-8 divide-y divide-beige-dark border-y border-beige-dark">
      {(b.questions || []).map((q, i) => (
        <details key={i} className="py-4 group">
          <summary className="cursor-pointer font-semibold text-terre list-none flex justify-between gap-4">
            {q.question}<span className="text-ocre group-open:rotate-45 transition-transform">+</span>
          </summary>
          <p className="text-terre/70 leading-relaxed mt-3 whitespace-pre-line">{q.reponse}</p>
        </details>
      ))}
    </div>
  ),

  logos: (b) => (
    <div className="my-8 flex flex-wrap items-center gap-8">
      {(b.logos || []).map((l, i) => (
        <Lien key={i} href={l.href}>
          <Image src={l.src} alt={l.alt} className="h-14 w-auto object-contain" />
        </Lien>
      ))}
    </div>
  ),

  video: (b) => (
    <figure className="my-8">
      <div className="aspect-video">
        <iframe src={b.src} title={b.title || 'Vidéo'} className="w-full h-full rounded-xl" loading="lazy" allowFullScreen />
      </div>
      {(b.credit || b.sourceUrl) && (
        <figcaption className="text-xs text-terre/45 mt-2">
          {b.credit}{b.credit && b.sourceUrl ? ' — ' : ''}
          {b.sourceUrl && <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-ocre hover:underline">{b.sourceLabel || 'Source'}</a>}
        </figcaption>
      )}
    </figure>
  ),

  document: (b) => (
    <p className="my-5">
      <a href={b.href} className="inline-flex items-center gap-2 text-ocre font-semibold hover:underline" download>
        ↓ {b.label || 'Télécharger le document'}{b.poids ? <span className="text-terre/45 font-normal"> ({b.poids})</span> : null}
      </a>
    </p>
  ),

  encadre: (b) => (
    <div className="my-8 bg-beige-light border-l-2 border-ocre rounded-r-xl px-5 py-4">
      {b.titre && <p className="font-semibold text-terre mb-1">{b.titre}</p>}
      <p className="text-terre/70 leading-relaxed whitespace-pre-line">{b.text}</p>
    </div>
  ),

  liste: (b) => (
    <ul className="my-5 space-y-1.5 list-disc pl-5 text-terre/70 leading-relaxed">
      {(b.elements || []).map((e, i) => <li key={i}>{e.text}</li>)}
    </ul>
  ),

  tableau: (b) => {
    const entetes = Array.isArray(b.entetes) ? b.entetes : String(b.entetes || '').split(',').map((t) => t.trim()).filter(Boolean)
    const cellules = (l) => (Array.isArray(l.cellules) ? l.cellules : String(l.cellules || '').split(',').map((t) => t.trim()))
    return (
      <div className="my-8 overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          {entetes.length > 0 && (
            <thead>
              <tr>{entetes.map((t, i) => <th key={i} className="border-b-2 border-beige-dark py-2 pr-4 font-semibold text-terre">{t}</th>)}</tr>
            </thead>
          )}
          <tbody>
            {(b.lignes || []).map((l, i) => (
              <tr key={i}>{cellules(l).map((c, j) => <td key={j} className="border-b border-beige-dark py-2 pr-4 text-terre/70 align-top">{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },

  link: (b) => (
    <p className="my-5">
      <Lien href={b.href} className="text-ocre font-semibold hover:underline">{b.label || b.href} →</Lien>
    </p>
  ),
}

export default function BlocsPage({ blocs }) {
  return (
    <>
      {(blocs || []).map((b, i) => {
        const rendu = RENDUS[b?.type]
        return rendu ? <div key={i}>{rendu(b)}</div> : null
      })}
    </>
  )
}
