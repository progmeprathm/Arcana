import { PantryItem, SpellRecipe, JournalEntry, ArcaneProfile, BarterListing } from '../types';

export const INITIAL_PANTRY: PantryItem[] = [
  {
    id: 'pan-01',
    user_id: 'usr-rowan',
    name: 'Mugwort (Artemisia vulgaris)',
    category: 'Flora',
    quantity: 45,
    unit: 'g',
    harvest_date: '2026-10-18T22:30:00Z',
    lunar_phase: 'Waxing Gibbous',
    min_threshold: 15,
    shelf_life_days: 180,
    notes: 'Wild harvested by the northern ridge under waxing gibbous.'
  },
  {
    id: 'pan-02',
    user_id: 'usr-rowan',
    name: 'Frankincense Resin (Boswellia carterii)',
    category: 'Flora',
    quantity: 8,
    unit: 'g',
    harvest_date: '2026-08-12T14:00:00Z',
    lunar_phase: 'New Moon',
    min_threshold: 10,
    shelf_life_days: 720,
    notes: 'Tears from Hadhramaut. Low stock!'
  },
  {
    id: 'pan-03',
    user_id: 'usr-rowan',
    name: 'Black Tourmaline Shards',
    category: 'Mineral',
    quantity: 4,
    unit: 'pcs',
    harvest_date: '2026-05-01T10:00:00Z',
    lunar_phase: 'Full Moon',
    min_threshold: 2,
    shelf_life_days: 9999,
    notes: 'Salt cleansed and moonlight charged.'
  },
  {
    id: 'pan-04',
    user_id: 'usr-rowan',
    name: 'Raven Feather Molt',
    category: 'Fauna',
    quantity: 3,
    unit: 'pcs',
    harvest_date: '2026-09-04T08:15:00Z',
    lunar_phase: 'Last Quarter',
    min_threshold: 1,
    shelf_life_days: 365,
    notes: 'Ethically gathered naturally shed molt.'
  },
  {
    id: 'pan-05',
    user_id: 'usr-rowan',
    name: 'Cast Iron Mortar & Pestle',
    category: 'Tool',
    quantity: 1,
    unit: 'item',
    harvest_date: '2025-01-01T00:00:00Z',
    lunar_phase: 'New Moon',
    min_threshold: 1,
    shelf_life_days: 9999,
    notes: 'Seasoned with beeswax and lavender oil.'
  },
  {
    id: 'pan-06',
    user_id: 'usr-rowan',
    name: 'Dried Star Anise',
    category: 'Flora',
    quantity: 25,
    unit: 'g',
    harvest_date: '2026-09-20T17:00:00Z',
    lunar_phase: 'First Quarter',
    min_threshold: 10,
    shelf_life_days: 360,
    notes: 'Whole pod eight-point stars.'
  }
];

export const INITIAL_SPELLS: SpellRecipe[] = [
  {
    id: 'spl-01',
    name: 'Apothecary Lucid Dream Sachet',
    category: 'Oneiromancy & Slumber',
    difficulty: 'Beginner',
    affinity: 'Water',
    duration_minutes: 20,
    safety_warnings: ['Do not ingest raw mugwort if pregnant or nursing.', 'Keep dry.'],
    instructions: [
      'Grind 10g Mugwort coarsely in mortar.',
      'Blend with crushed star anise seeds in equal ratio.',
      'Tie firmly into unbleached linen or silk pouch.',
      'Slip beneath pillow casing prior to sleep.'
    ],
    required_supplies: [
      { name: 'Mugwort (Artemisia vulgaris)', quantity: 10, unit: 'g' },
      { name: 'Dried Star Anise', quantity: 5, unit: 'g' }
    ]
  },
  {
    id: 'spl-02',
    name: 'Calamity Ward & Threshold Cleanse',
    category: 'Warding & Sanctification',
    difficulty: 'Initiate',
    affinity: 'Earth',
    duration_minutes: 35,
    safety_warnings: ['Ensure ventilation when burning resin.', 'Use fireproof ceramic or iron vessel.'],
    instructions: [
      'Ignite charcoal disc in the cast iron mortar.',
      'Scatter Frankincense resin until aromatic smoke billows.',
      'Position black tourmaline at the four cardinal corners of the perimeter.'
    ],
    required_supplies: [
      { name: 'Frankincense Resin (Boswellia carterii)', quantity: 5, unit: 'g' },
      { name: 'Black Tourmaline Shards', quantity: 4, unit: 'pcs' },
      { name: 'Cast Iron Mortar & Pestle', quantity: 1, unit: 'item' }
    ]
  },
  {
    id: 'spl-03',
    name: 'Corvid Veil of Perception',
    category: 'Astromancy & Sight',
    difficulty: 'Adept',
    affinity: 'Air',
    duration_minutes: 45,
    safety_warnings: ['Avoid direct inhalation of concentrated vapors.'],
    instructions: [
      'Hold the raven feather above smoldering sage.',
      'Focus the mind upon unseen threads between realms.',
      'Inscribe personal sigil upon black parchment with cedar ink.'
    ],
    required_supplies: [
      { name: 'Raven Feather Molt', quantity: 1, unit: 'pcs' },
      { name: 'Frankincense Resin (Boswellia carterii)', quantity: 10, unit: 'g' } // Intentionally requires 10g when only 8g available to show "Missing 1 Item"
    ]
  }
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'jrn-01',
    user_id: 'usr-rowan',
    title: 'Autumn Equinox Herbal Distillation',
    raw_ocr_text: 'Distilled Artemisia under waxing moon. Potency very sharp. Oil yield 12 drops. Note: check mortar seasoning.',
    formatted_body: 'Completed distillation of **Artemisia vulgaris** gathered during dusk. Aroma was intensely herbal with notes of camphor. Yielded approximately 12 amber drops of essential extract. Cleaned all iron tools thoroughly.',
    linked_spell_id: 'spl-01',
    linked_pantry_ids: ['pan-01', 'pan-05'],
    outcome_rating: 5,
    lunar_phase: 'Waxing Gibbous',
    weather_conditions: 'Clear, 12°C, Light NW Breeze',
    created_at: '2026-10-19T21:15:00Z'
  }
];

export const INITIAL_PROFILE: ArcaneProfile = {
  id: 'usr-rowan',
  arcane_name: 'Rowan of the Green Bough',
  tradition: 'Folk Herbalism & Traditional Witchcraft',
  affinities: ['Earth', 'Water'],
  focus_item: 'Athame',
  verification_status: 'Initiate',
  is_profile_public: false,
  created_at: '2026-01-15T00:00:00Z'
};

export const INITIAL_BARTER: BarterListing[] = [
  {
    id: 'bar-01',
    author_id: 'usr-morgan',
    author_arcane_name: 'Morgan Nightshade',
    offering_item: 'Mountain Cedar Resin (100g)',
    offering_quantity: '100g',
    requesting_item: 'Ethically shed Owl or Raven feather',
    circle_visibility: 'Public',
    notes: 'Pure resin harvested from high elevation Sierra junipers. Willing to exchange by postal dead-drop.',
    created_at: '2026-11-01T14:20:00Z'
  },
  {
    id: 'bar-02',
    author_id: 'usr-eldrich',
    author_arcane_name: 'Vane Blackthorn',
    offering_item: 'Hand-carved Bog Oak Wand blank',
    offering_quantity: '1 pc',
    requesting_item: 'Himalayan Shilajit or Dragon’s Blood resin',
    circle_visibility: 'Public',
    notes: 'Submerged 3000-year bog oak from peat reserve.',
    created_at: '2026-11-03T18:45:00Z'
  }
];
