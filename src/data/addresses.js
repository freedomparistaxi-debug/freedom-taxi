/**
 * Base locale d'adresses proposées dans le formulaire de réservation.
 *
 * Pourquoi une base locale plutôt qu'un service d'autocomplétion externe :
 * un service type Google Places exige une clé d'API et envoie les saisies du
 * client chez un tiers. Le site ne relève pas de la politique cookies sans
 * traceur, il n'y a donc aucune clé. Cette base couvre le secteur réel
 * d'intervention et les destinations courantes (hôpitaux, gares,
 * aéroports, grands pôles de Paris). Le client reste libre de taper une
 * adresse absente de la liste : le champ n'est jamais bloqué.
 */

/** Lieux fréquemment demandés comme destination. */
export const KNOWN_PLACES = [
  { street: 'Aéroport Charles de Gaulle', city: 'Roissy-en-France', postcode: '95700' },
  { street: 'Aéroport Charles de Gaulle - Terminal 1', city: 'Roissy-en-France', postcode: '95700' },
  { street: 'Aéroport Charles de Gaulle - Terminal 2', city: 'Roissy-en-France', postcode: '95700' },
  { street: 'Aéroport Paris Orly', city: 'Paray-Vieille-Poste', postcode: '94390' },
  { street: 'Aéroport Paris Beauvais', city: 'Beauvais', postcode: '60000' },

  { street: 'Gare du Blanc-Mesnil', city: 'Le Blanc-Mesnil', postcode: '93150' },
  { street: 'Gare de Drancy', city: 'Drancy', postcode: '93700' },
  { street: 'Gare du Bourget', city: 'Le Bourget', postcode: '93150' },
  { street: 'Gare d’Aulnay-sous-Bois', city: 'Aulnay-sous-Bois', postcode: '93600' },
  { street: 'Gare du Nord', city: 'Paris', postcode: '75010' },
  { street: 'Gare de l’Est', city: 'Paris', postcode: '75010' },
  { street: 'Gare de Lyon', city: 'Paris', postcode: '75012' },
  { street: 'Gare Saint-Lazare', city: 'Paris', postcode: '75008' },
  { street: 'Gare Montparnasse', city: 'Paris', postcode: '75015' },
  { street: 'Gare d’Austerlitz', city: 'Paris', postcode: '75013' },

  { street: 'Hôpital Avicenne', city: 'Bobigny', postcode: '93000' },
  { street: 'Hôpital Cochin', city: 'Paris', postcode: '75014' },
  { street: 'Hôpital Henri-Mondor', city: 'Créteil', postcode: '94010' },
  { street: 'Hôpital Pitié-Salpêtrière', city: 'Paris', postcode: '75013' },
  { street: 'Hôpital Robert-Debré', city: 'Paris', postcode: '75019' },
  { street: 'Hôpital Saint-Antoine', city: 'Paris', postcode: '75012' },
  { street: 'CHU de Bobigny', city: 'Bobigny', postcode: '93000' },
  { street: 'Centre hospitalier André Grégoire', city: 'Montreuil', postcode: '93100' },
  { street: 'Hôpital Robert Ballanger', city: 'Trappes', postcode: '78000' },

  { street: 'Préfecture de la Seine-Saint-Denis', city: 'Bobigny', postcode: '93000' },
  { street: 'Hôtel de Ville du Blanc-Mesnil', city: 'Le Blanc-Mesnil', postcode: '93150' },
  { street: 'Hôtel de Ville de Drancy', city: 'Drancy', postcode: '93700' },
  { street: 'Hôtel de Ville d’Aulnay-sous-Bois', city: 'Aulnay-sous-Bois', postcode: '93600' },
  { street: 'Parc du Sausset', city: 'Villepinte', postcode: '93420' },
  { street: 'Centre commercial Les Quatre Temps', city: 'Les Halles', postcode: '95000' },
  { street: 'Centre commercial Beaugrenelle', city: 'Paris', postcode: '75015' },
  { street: 'Stade de France', city: 'Saint-Denis', postcode: '93200' },
];

/** Communes couvertes en priorité, avec leurs principales voies. */
export const KNOWN_STREETS = [
  { street: 'Avenue Charles Floquet', city: 'Le Blanc-Mesnil', postcode: '93150' },
  { street: 'Avenue Pierre et Marie Curie', city: 'Le Blanc-Mesnil', postcode: '93150' },
  { street: 'Avenue de la République', city: 'Le Blanc-Mesnil', postcode: '93150' },
  { street: 'Rue du Capitaine Dreyfus', city: 'Le Blanc-Mesnil', postcode: '93150' },
  { street: 'Rue Maxime Gorki', city: 'Le Blanc-Mesnil', postcode: '93150' },
  { street: 'Rue Gabriel Péri', city: 'Le Blanc-Mesnil', postcode: '93150' },

  { street: 'Avenue Marceau', city: 'Drancy', postcode: '93700' },
  { street: 'Avenue Jean Jaurès', city: 'Drancy', postcode: '93700' },
  { street: 'Rue Anatole France', city: 'Drancy', postcode: '93700' },
  { street: 'Rue Sadi Carnot', city: 'Drancy', postcode: '93700' },
  { street: 'Rue Auguste Blanqui', city: 'Drancy', postcode: '93700' },

  { street: 'Avenue du Général de Gaulle', city: 'Le Bourget', postcode: '93150' },
  { street: 'Avenue Francis de Pressensé', city: 'Le Bourget', postcode: '93150' },
  { street: 'Rue de l’Abbé Niort', city: 'Le Bourget', postcode: '93150' },
  { street: 'Avenue de la Division Leclerc', city: 'Le Bourget', postcode: '93150' },

  { street: 'Route de Bondy', city: 'Aulnay-sous-Bois', postcode: '93600' },
  { street: 'Rue Jacques Duclos', city: 'Aulnay-sous-Bois', postcode: '93600' },
  { street: 'Rue de Mitry', city: 'Aulnay-sous-Bois', postcode: '93600' },
  { street: 'Avenue Anatole France', city: 'Aulnay-sous-Bois', postcode: '93600' },
  { street: 'Avenue du Clocher', city: 'Aulnay-sous-Bois', postcode: '93600' },
  { street: 'Rue Jules Princet', city: 'Aulnay-sous-Bois', postcode: '93600' },

  { street: 'Avenue de la Résistance', city: 'Bobigny', postcode: '93000' },
  { street: 'Rue de la République', city: 'Bobigny', postcode: '93000' },
  { street: 'Avenue Paul Vaillant-Couturier', city: 'Bobigny', postcode: '93000' },
  { street: 'Avenue Henri Barbusse', city: 'Bondy', postcode: '93140' },
  { street: 'Rue Arthur Grimaud', city: 'Bondy', postcode: '93140' },
  { street: 'Avenue Pasteur', city: 'Le Pré-Saint-Gervais', postcode: '93310' },
  { street: 'Rue André Joineau', city: 'Pantin', postcode: '93500' },
  { street: 'Avenue Jean Jaurès', city: 'Pantin', postcode: '93500' },
  { street: 'Avenue de la Porte de Montreuil', city: 'Montreuil', postcode: '93100' },
  { street: 'Avenue Walwein', city: 'Neuilly-sur-Marne', postcode: '93330' },
  { street: 'Rue Arthur Chevalier', city: 'Neuilly-sur-Marne', postcode: '93330' },
  { street: 'Avenue du Général de Gaulle', city: 'Villepinte', postcode: '93420' },
  { street: 'Rue de Paris', city: 'Villepinte', postcode: '93420' },
  { street: 'Avenue Aristide Briand', city: 'Livry-Gargan', postcode: '93190' },
  { street: 'Rue du Colonel Fabien', city: 'Gagny', postcode: '93220' },

  { street: 'Avenue de la République', city: 'Paris', postcode: '75011' },
  { street: 'Rue de Rivoli', city: 'Paris', postcode: '75004' },
  { street: 'Avenue des Champs-Élysées', city: 'Paris', postcode: '75008' },
  { street: 'Boulevard Saint-Germain', city: 'Paris', postcode: '75005' },
  { street: 'Rue de la Convention', city: 'Paris', postcode: '75015' },
  { street: 'Avenue de la Porte de la Villette', city: 'Paris', postcode: '75019' },
];

/** Normalise pour la recherche : minuscules, sans accents ni apostrophes. */
const normalize = (value) =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const ALL_ADDRESSES = [...KNOWN_PLACES, ...KNOWN_STREETS].map((entry) => ({
  ...entry,
  label: `${entry.street}, ${entry.postcode} ${entry.city}`,
  search: normalize(`${entry.street} ${entry.city} ${entry.postcode}`),
}));

/**
 * Renvoie les adresses qui correspondent à la saisie, la meilleure en premier.
 * Le nombre de caractères saisi est pris en compte : sans minimum, la
 * première lettre afficherait toute la base, ce qui est inutile.
 */
export const searchAddresses = (query, limit = 6) => {
  const q = normalize(query);
  if (q.length < 2) return [];

  const terms = q.split(' ').filter(Boolean);
  const startsWith = [];
  const contains = [];

  for (const entry of ALL_ADDRESSES) {
    if (entry.search.startsWith(q)) {
      startsWith.push(entry);
    } else if (terms.every((term) => entry.search.includes(term))) {
      contains.push(entry);
    }
  }

  return [...startsWith, ...contains].slice(0, limit);
};

