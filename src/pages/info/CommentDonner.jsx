import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { POINTS_CONFIRMES, PARTENARIAT_SITCOM, ACCEPTE, DEFI } from '../../data/defiCollecte'

const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Comment donner' },
]

/* Les questions viennent de celles qu'on nous pose reellement. Elles
   alimentent aussi le schema FAQPage passe au composant SEO. */
const FAQ = [
  {
    q: 'Dois-je effacer mes données avant de donner mon appareil ?',
    a: 'Non, c\'est notre travail. Chaque appareil passe par un effacement sécurisé avant tout reconditionnement, selon un protocole documenté, et un certificat peut vous être remis sur demande. Si vous préférez malgré tout retirer votre disque dur avant de nous confier la machine, c\'est évidemment possible : dites-le nous simplement, cela change les pièces dont nous disposons.',
  },
  {
    q: 'Mon ordinateur ne fonctionne plus. Est-ce qu\'il vous intéresse quand même ?',
    a: 'Oui. Le diagnostic est notre métier, pas le vôtre : inutile de trier vous-même entre ce qui marche et ce qui ne marche plus. Un appareil en panne est souvent réparable à faible coût, et lorsqu\'il ne l\'est pas, ses composants — mémoire, disque, écran, chargeur — servent à en réparer d\'autres. Rien n\'est perdu.',
  },
  {
    q: 'Faut-il apporter le chargeur et les câbles ?',
    a: 'Oui, et c\'est important. Le chargeur est très souvent la pièce manquante qui empêche de remettre un appareil en service. Joignez-y les câbles, la souris, la sacoche : tout ce qui accompagne l\'appareil augmente ses chances d\'être réemployé tel quel.',
  },
  {
    q: 'Le don est-il payant ?',
    a: 'Non. Donner votre matériel est entièrement gratuit, y compris l\'enlèvement à domicile lorsque nous l\'organisons. Ressources est une association loi 1901 à but non lucratif.',
  },
  {
    q: 'Je n\'habite pas à côté de Vielle-Saint-Girons. Puis-je donner ?',
    a: 'Oui. Nous intervenons sur l\'ensemble du département des Landes. Selon le volume et votre situation, nous convenons ensemble d\'un dépôt dans l\'un des points de collecte ou d\'un enlèvement à votre adresse. Un message suffit pour en discuter.',
  },
  {
    q: 'Je représente une entreprise, une école ou une collectivité. Comment procéder ?',
    a: 'Contactez-nous directement : les modalités se définissent au cas par cas selon le volume, le calendrier de renouvellement de votre parc et vos exigences en matière de traçabilité et de confidentialité des données. Nous nous déplaçons pour les enlèvements groupés.',
  },
  {
    q: 'Un don de matériel ouvre-t-il droit à une réduction d\'impôt ?',
    a: 'Oui. L\'association relève de l\'intérêt général, et un don en nature ouvre les mêmes droits qu\'un don financier : 66 % de la valeur du don pour un particulier, dans la limite de 20 % du revenu imposable, et 60 % pour une entreprise. La valeur retenue est celle du bien au moment du don, pas son prix d\'achat. Demandez-nous le reçu au moment du dépôt.',
  },
  {
    q: 'Que devient concrètement le matériel que je donne ?',
    a: 'Il est trié, ses données sont effacées de façon sécurisée, puis il est diagnostiqué et reconditionné par des bénévoles. Il repart ensuite vers des habitants, des associations ou des structures d\'accompagnement du territoire. Ce qui ne peut être réemployé part vers les filières de recyclage agréées : notre priorité reste le réemploi, le recyclage n\'est que le dernier recours.',
  },
  {
    q: 'Puis-je participer au challenge des 500 kilos ?',
    a: `Oui, et c\'est le bon moment. Du ${DEFI.debut} au ${DEFI.fin}, chaque dépôt est pesé et enregistré, et le total progresse vers l\'objectif des ${DEFI.objectifKg} kilos. La pesée finale a lieu en public lors de la journée de lancement de l\'association.`,
  },
]

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const FACONS = [
  {
    num: '1',
    title: 'Déposer dans un point de collecte',
    desc: 'Plusieurs points sont ouverts sur le territoire landais pendant le challenge collecte. Le détail et les modalités figurent ci-dessous.',
    note: 'Voir les points',
  },
  {
    num: '2',
    title: 'Demander un enlèvement',
    desc: 'Vous avez plusieurs équipements, un volume encombrant ou une mobilité réduite ? Nous venons chercher le matériel à votre adresse, gratuitement.',
    note: 'Formulaire ci-dessous',
  },
  {
    num: '3',
    title: 'Apporter le 3 octobre',
    desc: 'Le jour de la journée de lancement à Vielle-Saint-Girons, vous pouvez déposer votre matériel sur place et assister à la pesée finale.',
    note: 'Challenge 1/2 tonne',
  },
]

const PROFILS = [
  {
    titre: 'Particuliers',
    desc: 'Un ordinateur au fond d\'un placard, une tablette remplacée, un téléphone dans un tiroir : c\'est le cas le plus fréquent, et le plus utile.',
  },
  {
    titre: 'Entreprises et artisans',
    desc: 'Renouvellement de parc, fin de bail matériel, déménagement. Nous organisons l\'enlèvement groupé et définissons avec vous les garanties de confidentialité.',
  },
  {
    titre: 'Collectivités et écoles',
    desc: 'Matériel administratif ou pédagogique sorti d\'inventaire. Le réemploi local prolonge sa durée de vie et bénéficie à des habitants du même territoire.',
  },
  {
    titre: 'Associations',
    desc: 'Vous cessez une activité ou renouvelez vos postes ? Le matériel repart vers d\'autres structures du tissu associatif landais.',
  },
]

const PREPARATION = [
  {
    titre: 'N\'effacez rien',
    desc: 'L\'effacement sécurisé fait partie de notre processus. Vous n\'avez pas à formater quoi que ce soit — pensez simplement à récupérer vos documents personnels avant de nous confier l\'appareil.',
  },
  {
    titre: 'Ne testez pas',
    desc: 'Inutile de vérifier si l\'appareil démarre encore. Le diagnostic est notre travail, et un matériel en panne nous intéresse autant qu\'un matériel fonctionnel.',
  },
  {
    titre: 'Gardez les accessoires',
    desc: 'Chargeur, câbles, souris, sacoche, télécommande : joignez tout ce qui va avec. Le chargeur manquant est la première cause d\'immobilisation d\'un appareil.',
  },
  {
    titre: 'Ne jetez pas les pièces détachées',
    desc: 'Une barrette mémoire seule, un disque dur nu, un bloc d\'alimentation : ces éléments servent directement à réparer d\'autres machines.',
  },
]

export default function CommentDonner() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Donner son Matériel Informatique dans les Landes | Ressources"
        description="Donnez gratuitement votre ordinateur, tablette ou smartphone dans les Landes (40) : points de collecte, enlèvement à domicile, effacement sécurisé des données. Association Ressources, Vielle-Saint-Girons."
        canonical="/recyclerie-informatique/comment-donner/"
        schema={FAQ_SCHEMA}
      />

      <section className="py-12 md:py-16 border-b border-kaki/10" style={{ backgroundColor: "#E5E4D5" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Recyclerie informatique
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Comment donner son matériel informatique
          </h1>
          <p className="text-terre/60 max-w-2xl leading-relaxed">
            Donner est gratuit, rapide, et ne demande aucune préparation de votre part.
            Nous collectons sur l'ensemble du département des Landes les ordinateurs,
            tablettes, smartphones et périphériques dont vous ne vous servez plus —
            qu'ils fonctionnent encore ou non.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Trois façons de donner */}
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {FACONS.map(({ num, title, desc, note }) => (
              <div key={num} className="border-t-2 border-ocre pt-6">
                <span className="font-serif text-3xl text-ocre/30 block mb-3 leading-none">{num}</span>
                <h2 className="font-serif text-xl text-terre mb-2">{title}</h2>
                <p className="text-sm text-terre/55 leading-relaxed mb-3">{desc}</p>
                <p className="text-xs text-ocre font-medium italic">{note}</p>
              </div>
            ))}
          </div>

          {/* Points de collecte — donnees partagees avec la page Defi collecte,
              pour que les deux pages ne divergent jamais. */}
          <div className="mb-14">
            <h2 className="font-serif text-2xl text-terre mb-5">Où déposer votre matériel</h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-6 max-w-2xl">
              Les points ci-dessous accueillent les dépôts pendant le challenge collecte,
              du {DEFI.debut} au {DEFI.fin}. Certains sont encore en cours de
              formalisation avec nos partenaires : un message avant de vous déplacer
              vous évitera un trajet inutile.
            </p>

            <div className="divide-y divide-beige-dark border-y border-beige-dark mb-6">
              {POINTS_CONFIRMES.map(({ nom, ville, adresse, type, mention }) => (
                <div key={nom + ville} className="py-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <div className="flex-1 min-w-[12rem]">
                    <p className="font-serif text-lg text-terre leading-snug">{nom}</p>
                    <p className="text-sm text-terre/55">
                      {adresse ? `${adresse}, ${ville}` : ville}
                    </p>
                  </div>
                  <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-terre/45">
                    {type}
                  </span>
                  {mention && (
                    <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-ocre bg-ocre/8 border border-ocre/20 px-2 py-0.5">
                      {mention}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="border-l-2 border-ocre bg-beige-light p-5 mb-6">
              <p className="font-sans text-xs font-bold tracking-widest uppercase text-ocre mb-1.5">
                En déchèterie
              </p>
              <p className="text-sm text-terre/65 leading-relaxed">
                Un partenariat a été convenu avec le {PARTENARIAT_SITCOM.nom} pour
                installer un point de collecte dans {PARTENARIAT_SITCOM.nombre} déchèteries
                du département.{' '}
                {PARTENARIAT_SITCOM.decheteries.length > 0
                  ? `Déchèteries concernées : ${PARTENARIAT_SITCOM.decheteries.join(' et ')}.`
                  : 'Les communes concernées seront annoncées dès qu\'elles seront arrêtées.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/defi-collecte/" className="text-kaki hover:text-ocre transition-colors font-medium">
                → Suivre le challenge collecte et la liste à jour
              </Link>
              <a href="mailto:contact@ressourcesrecyclerie.fr" className="text-kaki hover:text-ocre transition-colors font-medium">
                → Convenir d'une remise par mail
              </a>
            </div>
          </div>

          {/* Qui peut donner */}
          <div className="mb-14">
            <h2 className="font-serif text-2xl text-terre mb-5">Qui peut donner</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {PROFILS.map(({ titre, desc }) => (
                <div key={titre} className="border-l-2 border-ocre/30 pl-5">
                  <h3 className="font-serif text-lg text-terre mb-1.5">{titre}</h3>
                  <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation */}
          <div className="mb-14">
            <h2 className="font-serif text-2xl text-terre mb-2">Faut-il préparer son matériel ?</h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-6 max-w-2xl">
              Non, et c'est le point que l'on nous demande le plus souvent. Quatre
              réflexes suffisent, et ils vont plutôt dans le sens du moindre effort.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {PREPARATION.map(({ titre, desc }) => (
                <div key={titre} className="border border-ocre/25 bg-ocre/5 p-5">
                  <h3 className="font-serif text-lg text-terre mb-1.5">{titre}</h3>
                  <p className="text-sm text-terre/65 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ce que nous acceptons — renvoi vers la page dediee */}
          <div className="mb-14">
            <h2 className="font-serif text-2xl text-terre mb-4">Ce que nous acceptons</h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-5">
              {ACCEPTE.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-terre/65">
                  <span className="text-ocre mt-0.5 shrink-0" aria-hidden>—</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-terre/60 leading-relaxed">
              En état de marche ou en panne, sans distinction.{' '}
              <Link to="/recyclerie-informatique/materiel-accepte/" className="text-kaki hover:text-ocre underline underline-offset-2">
                La liste détaillée, et ce que nous ne pouvons pas prendre
              </Link>
              , figurent sur la page dédiée.
            </p>
          </div>

          {/* Apres le don */}
          <div className="mb-14">
            <h2 className="font-serif text-2xl text-terre mb-4">Ce qui se passe ensuite</h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-4 max-w-2xl">
              Votre matériel est pesé et enregistré, puis trié. Ses données sont
              effacées de façon sécurisée avant toute intervention technique. Vient
              ensuite le diagnostic, puis le reconditionnement par des bénévoles, et
              enfin la redistribution sur le territoire — à des habitants, des
              associations ou des structures d'accompagnement social des Landes.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link to="/recyclerie-informatique/effacement-donnees/" className="text-kaki hover:text-ocre transition-colors font-medium">
                → L'effacement de vos données en détail
              </Link>
              <Link to="/recyclerie-informatique/reconditionnement/" className="text-kaki hover:text-ocre transition-colors font-medium">
                → Notre processus de reconditionnement
              </Link>
              <Link to="/recyclerie-informatique/beneficiaires/" className="text-kaki hover:text-ocre transition-colors font-medium">
                → À qui profite le matériel
              </Link>
            </div>
          </div>

          {/* Reduction d'impot — l'association releve de l'interet general.
              Pour un don en nature, la valorisation n'est pas le prix d'achat :
              valeur venale pour un particulier, valeur nette comptable pour une
              entreprise. On le dit clairement plutot que de laisser esperer. */}
          <div className="mb-14">
            <h2 className="font-serif text-2xl text-terre mb-2">Votre don ouvre droit à une réduction d'impôt</h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-6 max-w-2xl">
              L'association Ressources relève de l'intérêt général. Un don de matériel
              ouvre les mêmes droits qu'un don financier, et le reçu fiscal vous est
              établi sur demande.
            </p>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div className="border-t-2 border-ocre/40 bg-beige-light px-5 py-4">
                <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-2">
                  Particuliers
                </p>
                <p className="font-serif text-2xl text-terre leading-none mb-2">66 %</p>
                <p className="text-sm text-terre/65 leading-relaxed">
                  de la valeur du don, dans la limite de 20 % du revenu imposable.
                  Pour un don en nature, c'est la valeur du bien au moment du don qui
                  compte — son prix sur le marché de l'occasion, pas son prix d'achat
                  d'origine. Vous l'estimez, nous établissons le reçu.
                </p>
              </div>
              <div className="border-t-2 border-ocre/40 bg-beige-light px-5 py-4">
                <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-2">
                  Entreprises
                </p>
                <p className="font-serif text-2xl text-terre leading-none mb-2">60 %</p>
                <p className="text-sm text-terre/65 leading-relaxed">
                  du don, dans la limite de 20 000 € ou 5 ‰ du chiffre d'affaires HT,
                  le montant le plus élevé étant retenu. Un point d'honnêteté : pour un
                  bien immobilisé, la valorisation retenue est la valeur nette comptable.
                  Un parc entièrement amorti n'ouvre donc quasiment aucun droit.
                </p>
              </div>
            </div>
            <p className="text-xs text-terre/45 leading-relaxed max-w-2xl">
              Reçu fiscal CERFA n° 11580, délivré sur demande (CGI, art. 200 et 238 bis).
              Si votre matériel est entièrement amorti, l'intérêt du don est ailleurs :
              traçabilité, effacement certifié des données, et un impact mesurable sur
              votre territoire.
            </p>
          </div>

          {/* Formulaire enlèvement */}
          <div className="mb-14">
            <h2 className="font-serif text-2xl text-terre mb-2">Demander un enlèvement</h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-6 max-w-2xl">
              Gratuit, sur l'ensemble du département. Décrivez simplement ce que vous
              avez à donner : nous revenons vers vous pour convenir d'un créneau.
            </p>
            <DonMaterielForm />
          </div>

          {/* FAQ */}
          <div className="border-t border-beige pt-10">
            <h2 className="font-serif text-2xl text-terre mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {FAQ.map(({ q, a }) => (
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

        </div>
      </section>

      <section className="py-8 bg-beige border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap gap-4 text-sm">
          <Link to="/recyclerie-informatique/" className="text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie informatique
          </Link>
          <span className="text-terre/20">|</span>
          <Link to="/recyclerie-informatique/materiel-accepte/" className="text-kaki hover:text-ocre transition-colors">
            Matériel accepté →
          </Link>
          <span className="text-terre/20">|</span>
          <Link to="/defi-collecte/" className="text-kaki hover:text-ocre transition-colors">
            Challenge collecte 1/2 tonne →
          </Link>
        </div>
      </section>
    </Layout>
  )
}

function DonMaterielForm() {
  const [form, setForm] = useState({ nom: '', telephone: '', email: '', adresse: '', materiel: '' })
  const [status, setStatus] = useState(null)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'donMateriel', ...form }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'ok') return (
    <p className="text-sm text-kaki font-medium py-3">Demande envoyée ! Nous vous contacterons pour organiser l'enlèvement.</p>
  )
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-terre/60 mb-1.5">Prénom & nom *</label>
          <input type="text" required className="input-field" value={form.nom} onChange={set('nom')} disabled={status === 'loading'} />
        </div>
        <div>
          <label className="block text-xs font-medium text-terre/60 mb-1.5">Téléphone *</label>
          <input type="tel" required className="input-field" value={form.telephone} onChange={set('telephone')} disabled={status === 'loading'} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-terre/60 mb-1.5">Email *</label>
        <input type="email" required className="input-field" value={form.email} onChange={set('email')} disabled={status === 'loading'} />
      </div>
      <div>
        <label className="block text-xs font-medium text-terre/60 mb-1.5">Adresse d'enlèvement *</label>
        <input type="text" required className="input-field" placeholder="Adresse + commune" value={form.adresse} onChange={set('adresse')} disabled={status === 'loading'} />
      </div>
      <div>
        <label className="block text-xs font-medium text-terre/60 mb-1.5">Matériel à donner *</label>
        <textarea rows={3} required className="input-field resize-none" placeholder="Ex : 2 ordinateurs portables, 1 écran, des câbles…" value={form.materiel} onChange={set('materiel')} disabled={status === 'loading'} />
      </div>
      {status === 'error' && <p className="text-xs text-red-500">Une erreur est survenue, veuillez réessayer.</p>}
      <button type="submit" className="btn-ocre" disabled={status === 'loading'}>{status === 'loading' ? 'Envoi…' : 'Envoyer la demande'}</button>
    </form>
  )
}
