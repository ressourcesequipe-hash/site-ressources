import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { DEFI } from '../data/defiCollecte'
import { AFFICHE, PHOTO_ELUS } from '../data/evenement'
import { useReveal } from '../hooks/useReveal'
import { IconFeuille, IconTicket, IconTransport } from '../components/Icons'

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Événement de lancement — Association Ressources · Tombola solidaire & Challenge collecte',
  startDate: '2026-10-03T10:00:00+02:00',
  endDate: '2026-10-03T18:00:00+02:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Vielle-Saint-Girons — 80 allée des Cigales',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '80 allée des Cigales',
      addressLocality: 'Vielle-Saint-Girons',
      postalCode: '40560',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.9516,
      longitude: -1.3019,
    },
  },
  description: "Journée de lancement de l'association Ressources — recyclerie informatique et végétale solidaire dans les Landes. Annonce du résultat du challenge collecte (objectif d'une demi-tonne dépassé), tombola solidaire avec plus de 30 lots offerts par les partenaires locaux, festivités à Vielle-Saint-Girons (40560).",
  image: 'https://www.ressourcesrecyclerie.fr/photos/banniere3ocotobre.jpg',
  organizer: {
    '@type': 'NGO',
    name: 'Association Ressources',
    url: 'https://www.ressourcesrecyclerie.fr',
    email: 'contact@ressourcesrecyclerie.fr',
  },
  keywords: 'tombola solidaire Landes, recyclerie informatique, réemploi numérique, Vielle-Saint-Girons',
}

const PHOTOS = [
  { f: 'bienvenue', l: 1400, h: 647, alt: "La salle Yvonne Meister et la banderole « Festival du réemploi, l'E-Waste Day », avec les food trucks à l'entrée", legende: 'Bienvenue au Festival du Réemploi' },
  { f: 'village-associatif', l: 1400, h: 1050, alt: 'Le village associatif dans la salle Yvonne Meister', legende: 'Le village associatif' },
  { f: 'stand-ressources', l: 1400, h: 631, alt: "Le stand de l'association Ressources", legende: 'Le stand Ressources' },
  { f: 'atelier-numerique', l: 1400, h: 788, alt: 'Atelier de sensibilisation au numérique', legende: 'Atelier numérique' },
  { f: 'atelier-numerique-2', l: 1400, h: 788, alt: 'Atelier numérique, participants autour du matériel', legende: 'Atelier numérique' },
  { f: 'atelier-vegetal', l: 1400, h: 631, alt: 'Atelier de sauvetage de plantes', legende: 'Atelier végétal' },
  { f: 'atelier-maquillage', l: 788, h: 1400, alt: 'Atelier maquillage pour les enfants', legende: 'Atelier maquillage' },
  { f: 'tirage-tombola', l: 1400, h: 631, alt: 'Tirage au sort public de la tombola solidaire', legende: 'Le tirage de la tombola' },
  { f: 'equipe-benevoles', l: 1400, h: 1050, alt: "L'équipe des bénévoles de l'association Ressources", legende: 'Les bénévoles' },
  { f: 'equipe-benevoles-2', l: 1400, h: 1050, alt: "L'équipe des bénévoles de l'association Ressources, deuxième vue", legende: 'Les bénévoles' },
  { f: 'collecte', l: 1054, h: 1400, alt: 'Matériel informatique collecté, prêt à être pesé', legende: 'Le matériel collecté' },
]

const VIDEOS = [
  { f: 'video-concert-gospel-1', titre: 'Mini-concert gospel' },
  { f: 'video-concert-gospel-2', titre: 'Mini-concert gospel, deuxième extrait' },
  { f: 'video-concert-gospel-3', titre: 'Mini-concert gospel, troisième extrait' },
]

export default function Evenement() {
  const [heroVisible, setHeroVisible] = useState(false)
  const tombola = useReveal()
  const concert = useReveal()
  const challenge = useReveal()
  const inscription = useReveal()

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <Layout newsletter={false}>
      <SEO
        title="Retour sur le lancement de la Recyclerie Solidaire — 03 octobre 2026 | Ressources"
        description={`Retour sur le lancement de l'association Ressources, le 03 octobre 2026 à Vielle-Saint-Girons (Landes) : ${DEFI.collecteKg} kg collectés pour le challenge d'une demi-tonne, tirage de la tombola solidaire, village associatif, ateliers et concert.`}
        canonical="/evenement-lancement-03-octobre-2026/"
        type="event"
        schema={eventSchema}
        ogImage="https://www.ressourcesrecyclerie.fr/photos/banniere3ocotobre.jpg"
        ogImageWidth={1280}
        ogImageHeight={640}
        ogImageAlt="Programme de la journée du 3 octobre 2026 : village associatif, ateliers, tombola et concert solidaire, à Vielle-Saint-Girons"
      />

      {/* Hero événement */}
      <section className="bg-kaki text-white py-16 md:py-28 relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-kaki-dark via-kaki to-kaki-light/20" aria-hidden />
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-ocre/5 rounded-tl-full blur-3xl" />
          <div className="absolute left-0 top-0 w-64 h-64 bg-white/[0.02] rounded-br-full" />
          <div className="absolute right-20 top-20 w-80 h-80 border border-ocre/10 rounded-full animate-spin-slow" />
          <div className="absolute right-32 top-32 w-48 h-48 border border-white/5 rounded-full animate-[spin_50s_linear_infinite_reverse]" />
          <div className="absolute top-16 left-[40%] w-2 h-2 rounded-full bg-ocre/50 animate-float" />
          <div className="absolute bottom-20 left-[30%] w-1.5 h-1.5 rounded-full bg-white/30 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Titre, au-dessus de la banniere : événement, date et lieu d'abord,
            l'image vient ensuite illustrer le programme qu'ils annoncent. */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 mb-8 md:mb-10">
          <div className="text-center md:max-w-2xl md:mx-auto">
          <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-ocre/15 border border-ocre/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocre opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ocre" />
              </span>
              <span className="font-sans text-ocre text-xs font-semibold tracking-[0.15em] uppercase">
                Retour sur le lancement
              </span>
            </div>
          </div>

          <h1 className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4 transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            03 octobre 2026
          </h1>
          <p className={`font-serif text-xl md:text-2xl text-white/70 transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Vielle-Saint-Girons, Landes (40560)
          </p>
          </div>
        </div>

        {/* Bannière pleine largeur, candidate au LCP : ni transition
            d'apparition ni chargement différé. */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 mb-10 md:mb-14">
          <img
            src="/photos/banniere3ocotobre.jpg"
            width={1280}
            height={640}
            fetchpriority="high"
            decoding="async"
            alt="Bannière de l'événement de lancement de l'association Ressources, le 3 octobre 2026 à Vielle-Saint-Girons"
            className="w-full h-auto block rounded-xl border-4 border-beige-light shadow-2xl shadow-black/30"
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center md:max-w-2xl md:mx-auto">
          <div className={`w-12 h-0.5 bg-ocre mx-auto mb-8 transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />

          <p className={`text-white/60 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-400 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Une journée festive et solidaire pour célébrer le lancement officiel
            de l'association Ressources — recyclerie informatique et végétale du
            territoire landais. Merci à toutes celles et ceux qui sont venus, aux
            bénévoles, aux associations et aux partenaires.
          </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 md:py-16 bg-beige-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { num: '01', label: 'Challenge collecte', title: `${DEFI.collecteKg} kg de matériel`, desc: `Lancé le 1er septembre dans les points de collecte du territoire, le challenge s'est achevé le 3 octobre. Objectif : ${DEFI.objectifKg} kg, dépassé ${DEFI.multiple} fois.`, accent: 'ocre', delay: 0 },
              { num: '02', label: 'Tombola solidaire', title: 'Plus de 30 lots', desc: 'Plus de 30 lots offerts par les commerçants, artisans et producteurs du territoire. Chaque billet a soutenu directement la recyclerie.', accent: 'ocre', delay: 100 },
              { num: '03', label: 'Village associatif', title: 'Des associations invitées', desc: "Des associations locales du réemploi et de l'économie circulaire étaient présentes pour partager leurs actions, aux côtés de l'équipe Ressources.", accent: 'kaki', delay: 200 },
            ].map((card) => (
              <HighlightCard key={card.num} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Programme de la journée */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-12">
          <p className="section-label">Programme</p>
          <h2 className="font-serif text-3xl md:text-4xl text-terre mb-3">
            Le programme de la journée du 3 octobre
          </h2>
          <p className="text-terre/55 max-w-md mx-auto leading-relaxed mb-6">
            Une journée pour découvrir, réparer, partager et célébrer le réemploi : voici ce qui s'est passé.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ocre/10 border border-ocre/25 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-ocre shrink-0" aria-hidden />
            <span className="font-sans text-xs text-ocre font-semibold tracking-wide">
              10 h – soirée · Vielle-Saint-Girons
            </span>
          </div>
        </div>

        {/* Les 3 temps forts, en un coup d'oeil : le detail vient juste apres,
            mais un visiteur presse doit pouvoir saisir la journee sans lire
            toute la frise. */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { heure: '10 h – 17h30', titre: 'Village associatif', desc: 'Ateliers, stands, animations', icon: <IconFeuille className="w-5 h-5" /> },
              { heure: '18 h – 19 h', titre: 'Tombola & challenge', desc: 'Tirage public, remise des lots, résultat du challenge', icon: <IconTicket className="w-5 h-5" /> },
              { heure: '20 h', titre: 'Concert solidaire', desc: 'DuoDangar et Evie', icon: <IconMusique className="w-5 h-5" /> },
            ].map((tf) => (
              <div key={tf.titre} className="bg-beige-light border border-beige-dark rounded-xl p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-ocre/12 text-ocre flex items-center justify-center mx-auto mb-3">
                  {tf.icon}
                </div>
                <p className="font-serif text-lg text-terre mb-1">{tf.heure}</p>
                <p className="font-sans text-xs font-semibold text-ocre tracking-wide uppercase mb-1">{tf.titre}</p>
                <p className="text-xs text-terre/50">{tf.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Frise detaillee : l'affiche en colonne de gauche (collee pendant le
            defilement), la frise a droite avec ses trois grands moments en
            cartes vert profond et les ateliers en lignes legeres entre eux. */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[300px_1fr] gap-10 lg:gap-14 items-start">
            <div className="hidden lg:block lg:sticky lg:top-28">
              <img
                src={AFFICHE.src}
                width={AFFICHE.largeur}
                height={AFFICHE.hauteur}
                loading="lazy"
                decoding="async"
                alt={AFFICHE.alt}
                className="w-full h-auto block rounded-xl border-4 border-beige-light shadow-xl"
              />

              <div className="mt-6 bg-gradient-to-br from-ocre-pale to-beige border border-ocre/20 p-5 rounded-xl text-center">
                <div className="w-10 h-10 rounded-full bg-ocre/12 text-ocre flex items-center justify-center mx-auto mb-3">
                  <IconTransport className="w-5 h-5" />
                </div>
                <p className="text-sm text-terre/70 leading-relaxed">
                  Buvette et food truck sur place toute la journée pour se restaurer.
                </p>
              </div>
            </div>

            <div>
              <MomentCle
                heure="10 h"
                fin="ouvert jusqu'à 17h30"
                titre="Ouverture du village associatif"
                desc="Stands des associations partenaires du réemploi et de l'économie circulaire, à la salle Yvonne Meister (route de Pichelèbe)."
              />

              {[
                { heure: '11 h – 12 h', text: 'Atelier de sauvetage de plantes' },
                { heure: '13h30 – 14 h', text: 'Mini-concert Gospel' },
                { heure: '14 h – 15 h', text: 'Atelier de sensibilisation' },
                { heure: '15 h – 16 h', text: 'Atelier repair' },
              ].map(({ heure, text }) => (
                <AtelierLigne key={heure} heure={heure} text={text} />
              ))}

              <MomentCle
                heure="18 h"
                fin="jusqu'à 19 h"
                titre="Le grand rendez-vous"
                desc={`Tirage public de la tombola et remise des lots, puis annonce du résultat du challenge de collecte informatique : ${DEFI.collecteKg} kg.`}
              />

              <MomentCle
                heure="20 h"
                titre="Concert solidaire"
                desc="DuoDangar et Evie, en clôture de la journée. Entrée à prix libre."
                dernier
              >
              </MomentCle>

              {/* Sur desktop, la meme information vit sous l'affiche a gauche :
                  pas de doublon la ou les deux colonnes sont visibles. */}
              <div className="lg:hidden mt-2 bg-gradient-to-br from-ocre-pale to-beige border border-ocre/20 p-6 rounded-xl text-center">
                <div className="w-10 h-10 rounded-full bg-ocre/12 text-ocre flex items-center justify-center mx-auto mb-3">
                  <IconTransport className="w-5 h-5" />
                </div>
                <p className="text-terre/70 leading-relaxed">
                  Buvette et food truck sur place toute la journée pour se restaurer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Retour en images */}
      <section id="retour-en-images" className="py-16 md:py-20 bg-beige-light scroll-mt-28 md:scroll-mt-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="section-label">Retour en images</p>
            <h2 className="font-serif text-3xl md:text-4xl text-terre mb-3">La journée en photos et en vidéos</h2>
            <p className="text-terre/55 max-w-md mx-auto leading-relaxed">
              Village associatif, ateliers, tirage de la tombola, concert : quelques
              moments de la journée.
            </p>
          </div>

          <figure className="mb-8 bg-white rounded-xl overflow-hidden border border-beige-dark shadow-sm">
            <img
              src={PHOTO_ELUS.src}
              width={PHOTO_ELUS.largeur}
              height={PHOTO_ELUS.hauteur}
              loading="lazy"
              decoding="async"
              alt={PHOTO_ELUS.alt}
              className="w-full h-auto block"
            />
            <figcaption className="font-sans text-xs text-terre/60 leading-relaxed px-4 py-3">
              {PHOTO_ELUS.legende}
            </figcaption>
          </figure>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>figure]:mb-4">
            {PHOTOS.map(({ f, l, h, alt, legende }) => (
              <figure key={f} className="break-inside-avoid bg-white rounded-xl overflow-hidden border border-beige-dark shadow-sm">
                <img
                  src={`/photos/3-octobre/${f}.webp`}
                  width={l}
                  height={h}
                  loading="lazy"
                  decoding="async"
                  alt={alt}
                  className="w-full h-auto block"
                />
                <figcaption className="font-sans text-xs text-terre/60 px-4 py-2.5">{legende}</figcaption>
              </figure>
            ))}
          </div>

          <h3 className="font-serif text-2xl text-terre text-center mt-14 mb-6">En vidéo</h3>
          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {VIDEOS.map(({ f, titre }) => (
              <figure key={f}>
                {/* preload="none" : aucun fichier n'est téléchargé tant que
                    personne ne lance la lecture. */}
                <video
                  controls
                  playsInline
                  preload="none"
                  poster={`/photos/3-octobre/${f}.jpg`}
                  aria-label={titre}
                  className="w-full aspect-[9/16] bg-black object-contain rounded-xl"
                >
                  <source src={`/photos/3-octobre/${f}.mp4`} type="video/mp4" />
                </video>
                <figcaption className="font-sans text-xs text-terre/60 mt-2">{titre}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Tombola */}
      <section className="py-16 md:py-20 bg-kaki text-white relative overflow-hidden" ref={tombola.ref}>
        <div className="absolute inset-0 bg-gradient-to-br from-kaki-dark via-kaki to-kaki" aria-hidden />
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-ocre/5 rounded-tr-full blur-3xl" aria-hidden />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className={`transition-all duration-700 ${tombola.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <p className="section-label">Tombola solidaire</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                Merci aux participants<br />de la tombola
              </h2>
              <div className="decorative-line" />
              <p className="text-white/60 leading-relaxed mb-6">
                La tombola a été notre principal levier de financement pour cette
                première année. Elle nous permettra d'acquérir les équipements
                nécessaires au reconditionnement et de pérenniser la filière.
              </p>
              <div className="bg-white/5 border border-ocre/25 p-6 mb-6 rounded-xl">
                <p className="font-sans text-xs text-ocre font-semibold tracking-wider uppercase mb-2">Tirage effectué</p>
                <p className="font-serif text-4xl text-ocre mb-1">+ de 30 lots</p>
                <p className="text-sm text-white/50">
                  mis en jeu lors du tirage au sort public, le samedi 3 octobre 2026
                  à Vielle-Saint-Girons
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/soutenir/tombola/" className="btn-ocre rounded-lg">Revoir les lots de la tombola</Link>
                <Link to="/soutenir/don/" className="btn-outline-white rounded-lg">Faire un don</Link>
              </div>
            </div>
            <div className={`space-y-4 transition-all duration-700 delay-200 ${tombola.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <h3 className="font-serif text-xl text-white">Comment ça s'est passé</h3>
              {[
                { step: '1', text: 'Les billets de tombola étaient en vente en ligne et chez nos commerçants partenaires' },
                { step: '2', text: 'Le tirage au sort public a eu lieu le samedi 3 octobre 2026 à Vielle-Saint-Girons' },
                { step: '3', text: "Les gagnants ont été contactés et ont reçu l'un des lots offerts par nos partenaires" },
                { step: '4', text: 'Chaque billet a financé directement l\'association' },
              ].map(({ step, text }) => (
                <div key={step} className="flex gap-4 group">
                  <span className="w-7 h-7 rounded-full bg-ocre text-white text-xs font-bold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {step}
                  </span>
                  <p className="text-sm text-white/65 leading-relaxed pt-0.5">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Concert solidaire */}
      <section className="py-16 md:py-20 bg-beige-light" ref={concert.ref}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className={`order-2 md:order-1 max-w-[240px] mx-auto md:mx-0 transition-all duration-700 ${concert.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <img
                src={AFFICHE.src}
                width={AFFICHE.largeur}
                height={AFFICHE.hauteur}
                loading="lazy"
                decoding="async"
                alt={AFFICHE.alt}
                className="w-full h-auto block rounded-xl border-4 border-white shadow-xl"
              />
            </div>
            <div className={`order-1 md:order-2 transition-all duration-700 delay-200 ${concert.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <p className="section-label">Concert solidaire</p>
              <h2 className="font-serif text-3xl md:text-4xl text-terre mb-4">
                DuoDangar & Evie,<br />en clôture de journée
              </h2>
              <div className="decorative-line" />
              <p className="text-terre/60 leading-relaxed mb-6">
                La journée s'est terminée en musique, à 20 h, avec un mini concert de
                DuoDangar et Evie, pour soutenir le lancement de la recyclerie.
                Merci aux artistes et au public.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge collecte */}
      <section className="py-16 md:py-20 bg-kaki text-white relative overflow-hidden" ref={challenge.ref}>
        <div className="absolute inset-0 bg-gradient-to-br from-kaki-dark via-kaki to-kaki" aria-hidden />
        <div className="absolute right-0 top-0 w-80 h-80 bg-ocre/5 rounded-bl-full blur-3xl" aria-hidden />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className={`transition-all duration-700 ${challenge.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label text-ocre">Challenge collecte</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
              {DEFI.collecteKg} kg de matériel informatique
            </h2>
            <div className="w-12 h-0.5 bg-ocre mx-auto mb-8" />
            <p className="text-white/65 max-w-xl mx-auto leading-relaxed mb-10">
              L'objectif était d'une demi-tonne : il a été dépassé {DEFI.multiple} fois.
              Du 1<sup>er</sup> septembre au 3 octobre, habitants, entreprises et
              collectivités ont déposé leurs équipements informatiques dans les points
              de collecte du territoire. Tout a été pesé au fil des semaines, jusqu'au
              résultat annoncé le 3 octobre. Merci à toutes et à tous.
            </p>
            <p className="font-sans text-xs text-ocre font-semibold tracking-wider uppercase mb-4">
              Ce que nous collectons toujours
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left max-w-2xl mx-auto">
              {[
                'Ordinateurs portables & fixes',
                'Écrans et moniteurs',
                'Tablettes & smartphones',
                'Câbles & chargeurs',
                'Claviers, souris, accessoires',
                'Consoles de jeux',
              ].map((item, i) => (
                <div key={item} className={`flex items-center gap-2 transition-all duration-500 ${challenge.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${200 + i * 60}ms` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-ocre shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/defi-collecte/" className="btn-ocre rounded-lg">
                Le bilan du challenge collecte
              </Link>
              <Link
                to="/recyclerie-informatique/comment-donner/"
                className="border border-white/25 text-white/75 px-6 py-3 text-sm font-medium rounded-lg hover:border-white/50 hover:text-white transition-all duration-200"
              >
                Je prépare un don de matériel
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Inscription / Contact */}
      <section className="py-16 md:py-20 bg-beige-light" ref={inscription.ref}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-10 transition-all duration-700 ${inscription.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label">Contact</p>
            <h2 className="font-serif text-3xl text-terre mb-3">Restons en contact</h2>
            <p className="text-terre/55 text-sm leading-relaxed">
              Laissez-nous vos coordonnées pour recevoir les prochaines nouvelles
              de la recyclerie et ses rendez-vous.
            </p>
          </div>
          <div className={`transition-all duration-700 delay-200 ${inscription.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <ContactForm />
          </div>
          <div className="mt-10 text-center text-sm text-terre/40">
            <p>
              Questions ?{' '}
              <a href="mailto:contact@ressourcesrecyclerie.fr" className="text-ocre hover:underline">
                contact@ressourcesrecyclerie.fr
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Liens silos */}
      <section className="py-10 bg-beige border-t border-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap gap-4 justify-center text-sm">
          <Link to="/recyclerie-informatique/" className="text-kaki hover:text-ocre transition-colors">
            ← Recyclerie informatique
          </Link>
          <span className="text-terre/20">|</span>
          <Link to="/soutenir/tombola/" className="text-kaki hover:text-ocre transition-colors">
            Tombola solidaire →
          </Link>
        </div>
      </section>
    </Layout>
  )
}

function HighlightCard({ num, label, title, desc, accent, delay = 0 }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`group bg-white border-t-2 ${accent === 'ocre' ? 'border-ocre' : 'border-kaki'} p-6 rounded-b-xl
        hover:shadow-xl hover:-translate-y-1 transition-all duration-400 cursor-default
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      <p className={`font-serif text-4xl ${accent === 'ocre' ? 'text-ocre/20 group-hover:text-ocre/30' : 'text-kaki/20 group-hover:text-kaki/30'} mb-3 leading-none transition-colors duration-300`}>
        {num}
      </p>
      <p className={`font-sans text-xs font-semibold tracking-widest uppercase mb-2 ${accent === 'ocre' ? 'text-ocre' : 'text-kaki'}`}>
        {label}
      </p>
      <h3 className="font-serif text-xl text-terre mb-3">{title}</h3>
      <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
    </div>
  )
}

// Grand moment de la frise (ouverture du village, tirage de la tombola, concert) :
// une carte vert profond pleine largeur, pour les distinguer d'un coup d'oeil
// des lignes d'ateliers qui les separent. `dernier` coupe le trait de frise a
// mi-hauteur du repere plutot que de le laisser deborder sous la carte.
function MomentCle({ heure, fin, titre, desc, children, dernier = false }) {
  return (
    <div className="flex gap-4 md:gap-5 pb-6">
      <div className="relative w-3 shrink-0 flex justify-center">
        <div className={`absolute top-0 w-px bg-kaki/20 ${dernier ? 'h-9' : 'bottom-0'}`} aria-hidden />
        <div className="relative z-10 mt-7 w-3.5 h-3.5 rounded-full bg-ocre ring-4 ring-white" aria-hidden />
      </div>
      <div className="flex-1 bg-kaki text-white rounded-xl p-6 md:p-7 shadow-lg shadow-kaki/15">
        <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mb-2">
          <span className="font-serif text-3xl md:text-4xl text-ocre leading-none">{heure}</span>
          {fin && <span className="text-xs text-white/45 font-sans">{fin}</span>}
        </div>
        <h3 className="font-serif text-xl text-white mb-1.5">{titre}</h3>
        <p className="text-sm text-white/65 leading-relaxed max-w-md">{desc}</p>
        {children}
      </div>
    </div>
  )
}

// Ligne d'atelier : plus legere qu'un MomentCle, elle n'a pas besoin de sa
// propre carte. Le meme motif de colonne (trait + puce) que MomentCle garde
// la frise continue entre les deux.
function AtelierLigne({ heure, text }) {
  return (
    <div className="flex gap-4 md:gap-5 pb-5">
      <div className="relative w-3 shrink-0 flex justify-center">
        <div className="absolute top-0 bottom-0 w-px bg-kaki/20" aria-hidden />
        <div className="relative z-10 mt-1.5 w-2 h-2 rounded-full bg-white border-2 border-ocre" aria-hidden />
      </div>
      <div className="flex-1 flex flex-wrap items-baseline gap-x-3">
        <span className="font-sans text-xs font-semibold text-ocre tracking-wide whitespace-nowrap">{heure}</span>
        <p className="text-sm text-terre/65">{text}</p>
      </div>
    </div>
  )
}

function IconMusique({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', commune: '', message: '' })
  const [status, setStatus] = useState(null)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'evenement', ...form }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'ok') return (
    <p className="text-sm text-kaki font-medium py-3">Inscription enregistrée ! Nous vous tiendrons informé·e de l'événement.</p>
  )
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Prénom *</label>
          <input type="text" required className="input-field rounded-lg" placeholder="Votre prénom" value={form.prenom} onChange={set('prenom')} disabled={status === 'loading'} />
        </div>
        <div>
          <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Nom *</label>
          <input type="text" required className="input-field rounded-lg" placeholder="Votre nom" value={form.nom} onChange={set('nom')} disabled={status === 'loading'} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Email *</label>
        <input type="email" required className="input-field rounded-lg" placeholder="votre@email.fr" value={form.email} onChange={set('email')} disabled={status === 'loading'} />
      </div>
      <div>
        <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Commune</label>
        <input type="text" className="input-field rounded-lg" placeholder="Votre commune" value={form.commune} onChange={set('commune')} disabled={status === 'loading'} />
      </div>
      <div>
        <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Message (facultatif)</label>
        <textarea rows={3} className="input-field resize-none rounded-lg" placeholder="Une question, une idée…" value={form.message} onChange={set('message')} disabled={status === 'loading'} />
      </div>
      {/* Pas de case à cocher ici : s'inscrire est déjà l'acte de consentement.
          Le texte dit donc exactement ce à quoi on s'inscrit — la lettre de
          l'association — puisque c'est bien là que le contact atterrit. */}
      <p className="text-xs text-terre/40 leading-relaxed">
        En vous inscrivant, vous rejoignez la lettre d'information de l'association :
        vous recevrez les nouvelles de l'événement, puis quelques envois par an.
        Désabonnement en un clic, à tout moment.
      </p>
      {status === 'error' && <p className="text-xs text-red-500">Une erreur est survenue, veuillez réessayer.</p>}
      <button type="submit" className="btn-ocre w-full text-center rounded-lg" disabled={status === 'loading'}>
        {status === 'loading' ? 'Envoi…' : 'Je m\'inscris et je reste informé·e'}
      </button>
    </form>
  )
}

