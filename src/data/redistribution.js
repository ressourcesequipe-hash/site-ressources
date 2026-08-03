// Modele de remise en circulation du materiel collecte.
//
// Les pages decrivaient chacune une partie du modele : la page reconditionnement
// parlait d'« attribution aux beneficiaires prioritaires », la page vente disait
// « accessible a tous sans conditions ». Les deux sont vraies, mais lues separement
// elles se contredisent — soit une redistribution caritative exclusive, soit un
// simple commerce. Source unique, rendue telle quelle partout ou le modele est
// explique, pour qu'il n'y ait plus qu'une version.

export const VOIES_REMISE_CIRCULATION = [
  {
    titre: 'Actions et dispositifs solidaires',
    desc: "Une partie des équipements est mobilisée dans le cadre d'actions solidaires menées avec les acteurs du territoire : ateliers, dispositifs d'inclusion numérique, opérations ponctuelles.",
  },
  {
    titre: 'Bénéficiaires identifiés avec nos partenaires',
    desc: "Des équipements sont remis à des bénéficiaires identifiés avec des partenaires ou des prescripteurs : structures sociales, établissements scolaires, associations, collectivités.",
  },
  {
    titre: 'Vente à prix accessible au grand public',
    desc: "Les équipements reconditionnés sont proposés à prix accessible à tout habitant du territoire, sans condition de ressources.",
  },
  {
    titre: "Orientation vers d'autres filières de réemploi",
    desc: "Lorsque Ressources ne peut pas traiter directement un équipement, il est orienté vers d'autres filières de réemploi ou de recyclage responsable, plutôt que mis au rebut.",
  },
]

// Phrase de transparence sur le modele economique : la vente n'est pas en
// contradiction avec l'objet solidaire, elle le finance.
export const FINANCEMENT_PAR_LA_VENTE =
  "La vente au grand public contribue au financement des activités de collecte, " +
  "de reconditionnement, de sensibilisation et de solidarité portées par l'association."
