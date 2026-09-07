// Vérifie api/contact.js sans jamais appeler Brevo : fetch est remplacé par un
// espion qui note les appels et répond OK. Rien n'est envoyé, aucune clé réelle
// n'est nécessaire.
//
//   npm run brevo:test                       — mode repli, sans BREVO_LISTS
//   BREVO_LISTS='{"newsletter":2,…}' npm run brevo:test
//
// Voir docs/brevo.md.

// Clé factice : le handler refuse de démarrer sans, et fetch est de toute façon
// remplacé ci-dessous — elle n'atteint jamais Brevo.
process.env.BREVO_API_KEY ||= 'cle-de-test'

const appels = []


globalThis.fetch = async (url, opts = {}) => {
  appels.push({ url, methode: opts.method || 'GET', body: opts.body ? JSON.parse(opts.body) : null })
  return { ok: true, status: 200, text: async () => '{}' }
}

function faussesReponses() {
  const res = {}
  res.setHeader = () => {}
  res.status = (c) => { res._code = c; return res }
  res.json = (j) => { res._json = j; return res }
  res.end = () => res
  return res
}

const { default: handler } = await import(new URL('../api/contact.js', import.meta.url).href)

async function envoie(body) {
  appels.length = 0
  const res = faussesReponses()
  await handler({ method: 'POST', body, on: () => {} }, res)
  return { code: res._code, json: res._json, appels: [...appels] }
}

let echecs = 0
function ok(label, condition, detail = '') {
  console.log(`${condition ? '  ok  ' : ' ÉCHEC'} ${label}${detail ? ' — ' + detail : ''}`)
  if (!condition) { echecs++; process.exitCode = 1 }
}

const contactsDe = (r) => r.appels.find((a) => a.url.endsWith('/v3/contacts') && a.methode === 'POST')
const doiDe = (r) => r.appels.find((a) => a.url.includes('doubleOptinConfirmation'))
const mailDe = (r) => r.appels.find((a) => a.url.endsWith('/smtp/email'))

const LISTES = process.env.BREVO_LISTS ? JSON.parse(process.env.BREVO_LISTS) : null
const DOI = Boolean(process.env.BREVO_DOI_TEMPLATE_ID)

console.log(`\nBREVO_LISTS = ${process.env.BREVO_LISTS || '(absente)'}`)
console.log(`DOI         = ${DOI ? 'activé' : 'désactivé'}\n`)

// Vérifie qu'un envoi aboutit dans exactement ces listes (par clé, pas par id).
async function routage(label, body, clesAttendues) {
  const r = await envoie(body)
  ok(`${label} → 200`, r.code === 200)
  if (!LISTES) return r
  const c = contactsDe(r)
  const attendus = clesAttendues.map((k) => LISTES[k])
  const obtenus = c ? c.body.listIds : null
  ok(`${label} → listes`, JSON.stringify(obtenus) === JSON.stringify(attendus),
    `${JSON.stringify(obtenus)} au lieu de ${JSON.stringify(attendus)}`)
  return r
}

console.log('── Routage des huit formulaires ──')

// Opt-in implicite : s'inscrire est l'acte de consentement.
await routage('newsletter', { type: 'newsletter', email: 'Alice@Example.FR' }, DOI ? [] : ['newsletter'])
await routage('événement', { type: 'evenement', prenom: 'Léa', nom: 'Roy', email: 'l@r.fr', commune: 'Dax' }, DOI ? [] : ['newsletter'])

// Listes fixes.
await routage('bénévole', { type: 'benevole', nom: 'Marie Dupont', email: 'm@d.fr', telephone: '06 12 34 56 78', commune: 'Dax', mission: 'Collecte' }, ['benevoles'])
await routage('don de matériel', { type: 'donMateriel', nom: 'Jean Bon', email: 'j@b.fr', telephone: '05', adresse: '3 rue des Pins, Dax' }, ['donateurs'])
await routage('point de collecte', { type: 'pointCollecte', structure: 'Mairie', nom: 'A B', email: 'a@b.fr', commune: 'Dax', typeStructure: 'Commune ou collectivité' }, ['partenaires'])
await routage('partenaire végétal', { type: 'partenaireVegetal', structure: 'Jardinerie', contact: 'C D', email: 'c@d.fr', commune: 'Dax' }, ['partenaires'])

console.log('\n── Routage selon le menu déroulant ──')

await routage('rejoindre / bénévolat végétal', { type: 'rejoindre', nom: 'E F', email: 'e@f.fr', engagement: 'Bénévolat — filière végétale' }, ['benevoles'])
await routage('rejoindre / mécénat', { type: 'rejoindre', nom: 'G H', email: 'g@h.fr', engagement: 'Mécénat / Sponsoring' }, ['partenaires'])
await routage('rejoindre / partenariat institutionnel', { type: 'rejoindre', nom: 'I J', email: 'i@j.fr', engagement: 'Partenariat institutionnel' }, ['partenaires'])
await routage('rejoindre / menu vide (défaut)', { type: 'rejoindre', nom: 'K L', email: 'k@l.fr', engagement: '' }, ['benevoles'])

await routage('contact / don de plantes', { type: 'contact', nom: 'M N', email: 'm@n.fr', message: 'x', sujet: 'Don de plantes ou végétaux' }, ['donateurs'])
await routage('contact / bénévolat ou adhésion', { type: 'contact', nom: 'O P', email: 'o@p.fr', message: 'x', sujet: 'Bénévolat ou adhésion' }, ['benevoles'])
await routage('contact / partenariat ou mécénat', { type: 'contact', nom: 'Q R', email: 'q@r.fr', message: 'x', sujet: 'Partenariat ou mécénat' }, ['partenaires'])
await routage('contact / autre question', { type: 'contact', nom: 'S T', email: 's@t.fr', message: 'x', sujet: 'Autre question' }, [])
await routage('contact / achat solidaire', { type: 'contact', nom: 'U V', email: 'u@v.fr', message: 'x', sujet: 'Achat solidaire (équipement reconditionné)' }, [])

if (LISTES) {
  console.log('\n── Consentement ──')

  // Le contact « autre question » n'entre dans aucune liste, mais existe bien.
  {
    const r = await envoie({ type: 'contact', nom: 'S T', email: 's@t.fr', message: 'x', sujet: 'Autre question' })
    const c = contactsDe(r)
    ok('sans liste, le contact est quand même créé', Boolean(c))
    ok('ses attributs sont renseignés', c.body.attributes.SOURCE === 'Contact général', c.body.attributes.SOURCE)
  }

  // La case décochée ne doit jamais faire entrer dans la liste de diffusion.
  {
    const r = await envoie({ type: 'benevole', nom: 'Marie Dupont', email: 'm@d.fr', telephone: '06 12 34 56 78', commune: 'Dax', mission: 'Collecte' })
    const c = contactsDe(r)
    ok('case décochée → hors newsletter', !c.body.listIds.includes(LISTES.newsletter), JSON.stringify(c.body.listIds))
    ok('OPTIN_NEWSLETTER faux', c.body.attributes.OPTIN_NEWSLETTER === false)
    ok('téléphone en texte brut', c.body.attributes.TELEPHONE === '06 12 34 56 78')
    ok('pas d\'attribut SMS', !('SMS' in c.body.attributes))
    ok('nom découpé', c.body.attributes.PRENOM === 'Marie' && c.body.attributes.NOM === 'Dupont')
    ok('DATE_DERNIER_CONTACT au format date', /^\d{4}-\d{2}-\d{2}$/.test(c.body.attributes.DATE_DERNIER_CONTACT))
    ok('emailBlacklisted jamais envoyé', !('emailBlacklisted' in c.body))
  }

  // La case cochée l'y fait entrer, en plus de la liste métier.
  {
    const r = await envoie({ type: 'benevole', nom: 'Luc Martin', email: 'l@m.fr', optinNewsletter: true })
    const c = contactsDe(r)
    const doi = doiDe(r)
    ok('OPTIN_NEWSLETTER vrai', c.body.attributes.OPTIN_NEWSLETTER === true)
    if (DOI) {
      ok('DOI : newsletter retirée de l\'upsert direct', !c.body.listIds.includes(LISTES.newsletter), JSON.stringify(c.body.listIds))
      ok('DOI : liste métier conservée', c.body.listIds.includes(LISTES.benevoles))
      ok('DOI : confirmation demandée sur la newsletter', JSON.stringify(doi?.body.includeListIds) === JSON.stringify([LISTES.newsletter]))
      ok('DOI : redirection renseignée', Boolean(doi?.body.redirectionUrl))
    } else {
      ok('case cochée → entre en newsletter', c.body.listIds.includes(LISTES.newsletter), JSON.stringify(c.body.listIds))
      ok('liste métier conservée', c.body.listIds.includes(LISTES.benevoles))
      ok('pas d\'appel double opt-in', !doi)
    }
  }

  {
    const r = await envoie({ type: 'newsletter', email: 'Alice@Example.FR' })
    ok('email normalisé en minuscules', contactsDe(r)?.body.email === 'alice@example.fr')
  }

}

console.log('\n── Robustesse ──')

{
  const r = await envoie({ type: 'contact', nom: 'X', email: 'pas-un-email', message: 'bonjour' })
  ok('email invalide → toujours 200', r.code === 200)
  ok('email invalide → aucun contact écrit', !contactsDe(r))
  ok('email invalide → notification envoyée quand même', Boolean(mailDe(r)))
}

{
  const r = await envoie({ type: 'contact', nom: '<script>alert(1)</script>', email: 'a@b.fr', message: 'a & b' })
  const mail = mailDe(r)
  ok('HTML échappé', mail.body.htmlContent.includes('&lt;script&gt;') && !mail.body.htmlContent.includes('<script>'))
  ok('esperluette échappée', mail.body.htmlContent.includes('a &amp; b'))
  ok('replyTo pointe sur l\'expéditeur', mail.body.replyTo?.email === 'a@b.fr')
}

{
  const r = await envoie({ type: 'nimportequoi', email: 'a@b.fr' })
  ok('type inconnu → 400', r.code === 400)
  ok('type inconnu → aucun appel Brevo', r.appels.length === 0)
}

console.log(echecs ? `\n${echecs} vérification(s) en échec.\n` : '\nToutes les vérifications passent.\n')
