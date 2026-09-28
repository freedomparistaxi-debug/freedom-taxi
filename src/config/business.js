/**
 * Configuration centralisée de Freedom Taxi
 * Facilement modifiable par le client sans toucher au code structurel
 */
/**
 * Configuration centralisée de Freedom Taxi
 * Facilement modifiable par le client sans toucher au code structurel.
 *
 * ⚠️  Source de vérité unique : toute modification de l'entreprise
 *     (numéros, zone, services) se fait UNIQUEMENT dans ce fichier.
 */

export const BOOKING_RECIPIENT = 'freedom.paris.taxi@gmail.com';

export const BUSINESS_CONFIG = {
  name: "FREEDOM TAXI",
  legalName: "FREEDOM TAXI",
  tagline: "Taxi parisien — Taxi conventionné",
  positioning: "Taxi parisien — Taxi conventionné",

  // Secteur d'intervention principal.
  // Affichage public : uniquement la marque et la zone de desserte.
  sector: "Le Blanc-Mesnil, Drancy, Le Bourget, Aulnay-sous-Bois et alentours",
  sectorShort: "Le Blanc-Mesnil, Drancy, Le Bourget, Aulnay-sous-Bois",
  heroLine: "Le Blanc-Mesnil, Drancy, Le Bourget, Aulnay-sous-Bois et alentours",

  // Zone desservie (aucune commune exclusive)
  city: "Le Blanc-Mesnil, Drancy, Le Bourget, Aulnay-sous-Bois",
  area: "Le Blanc-Mesnil, Drancy, Le Bourget, Aulnay-sous-Bois et alentours",
  postalCode: "",
  department: "",
  region: "Île-de-France",

  // Coordonnées de contact
  phones: [
    { label: "07 61 13 56 73", raw: "+33761135673" },
  ],
  // Numéro principal (premier de la liste)
  phone: "07 61 13 56 73",
  phoneRaw: "+33761135673",
  email: BOOKING_RECIPIENT,
  address: "Paris / Seine-Saint-Denis et alentours",

  // Disponibilité
  availability: "Sur réservation, 7j/7",
  hours: "Sur réservation — 7j/7",
  legalHours: "Sur réservation",

  // Services phares (texte marketing, sans information inventée)
  services: {
    medical: {
      title: "Déplacements vers les établissements de santé",
      shortDesc: "Vos trajets pour vos consultations, soins et déplacements médicaux.",
      fullDesc:
        "Freedom Taxi assure vos déplacements vers les établissements de santé avec rigueur, discrétion et ponctualité pour vos rendez-vous de santé : consultations, examens, rééducation et déplacements vers les établissements de santé. Prise en charge en taxi conventionné.",
      points: [
        "Trajets vers les hôpitaux, cliniques et centres de soins",
        "Véhicule confortable et entretenu avec soin",
        "Ponctualité pour vos rendez-vous médicaux",
      ],
    },
    private: {
      title: "Transport de particuliers",
      shortDesc: "Vos trajets du quotidien, en toute simplicité et en toute sécurité.",
      fullDesc:
        "Un service de transport particulier fiable et flexible pour vos déplacements quotidiens, familiaux ou dépannages.",
      points: [
        "Prise en charge à votre domicile ou sur le lieu de votre choix",
        "Trajets locaux et longue distance",
        "Véhicule confortable, non-fumeur",
        "Réservation immédiate ou à l'avance",
      ],
    },
    business: {
      title: "Trajets professionnels",
      shortDesc: "Vos déplacements professionnels, rendez-vous et séminaires.",
      fullDesc:
        "Une solution de transport fiable pour les professionnels, dirigeants et collaborateurs : discrétion, sérieux et respect de vos horaires.",
      points: [
        "Rendez-vous et déplacements d'affaires",
        "Transferts vers les quartiers d'affaires parisiens",
        "Ponctualité et discrétion",
        "Facturation transparente sur demande",
      ],
    },
    longDistance: {
      title: "Trajets locaux et longue distance",
      shortDesc: "Le Blanc-Mesnil, Drancy, Le Bourget, Aulnay-sous-Bois et la proche région.",
      fullDesc:
        "Que ce soit un trajet local en Île-de-France ou une longue distance, Freedom Taxi organise votre déplacement sur réservation préalable.",
      points: [
        "Trajets locaux et régionaux",
        "Longues distances sur réservation",
        "Suivi de l'heure de départ",
        "Confort sur toute la durée du trajet",
      ],
    },
  },

  // Services listés sur le site
  serviceList: [
    "Transport de particuliers",
    "Trajets professionnels",
    "Taxi conventionné",
    "Déplacements vers les établissements de santé",
    "Trajets locaux et longue distance",
    "Prise en charge sur réservation",
  ],

  // Zones couvertes
  coverage: [
    "Le Blanc-Mesnil",
    "Drancy",
    "Le Bourget",
    "Aulnay-sous-Bois",
    "Seine-Saint-Denis et alentours",
    "Paris selon les trajets",
  ],
};
