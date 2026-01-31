export const PLACE_CATEGORIES = [
  'Plages',
  'Sites naturels',
  'Monuments et patrimoine',
  'Musees et culture',
  'Restaurants',
  'Hotels et hebergements',
  'Cafes et salons de the',
  'Shopping et souks',
  'Loisirs et divertissements',
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];
