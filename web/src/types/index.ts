export type PantryCategory = 'Flora' | 'Fauna' | 'Mineral' | 'Tool';

export interface PantryItem {
  id: string;
  user_id: string;
  name: string;
  category: PantryCategory;
  quantity: number;
  unit: string;
  harvest_date?: string;
  lunar_phase?: string;
  min_threshold: number;
  shelf_life_days?: number;
  notes?: string;
}

export type DifficultyTier = 'Beginner' | 'Initiate' | 'Adept' | 'Master';
export type ElementalAffinity = 'Earth' | 'Air' | 'Fire' | 'Water' | 'Aether';

export interface RecipeSupplyReq {
  pantry_item_id?: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface SpellRecipe {
  id: string;
  name: string;
  category: string;
  difficulty: DifficultyTier;
  affinity: ElementalAffinity;
  duration_minutes: number;
  safety_warnings: string[];
  instructions: string[];
  required_supplies: RecipeSupplyReq[];
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  raw_ocr_text?: string;
  formatted_body: string;
  linked_spell_id?: string;
  linked_pantry_ids: string[];
  outcome_rating: number; // 1 to 5
  lunar_phase?: string;
  weather_conditions?: string;
  created_at: string;
}

export type FocusItem = 'Wand' | 'Athame' | 'Ring' | 'Chalice' | 'Pentacle' | 'Other';
export type VerificationStatus = 'Guest' | 'Initiate' | 'Adept' | 'CircleAdmin';

export interface ArcaneProfile {
  id: string;
  arcane_name: string;
  tradition: string;
  affinities: ElementalAffinity[];
  focus_item: FocusItem;
  verification_status: VerificationStatus;
  is_profile_public: boolean;
  created_at: string;
}

export interface InviteToken {
  token_id: string;
  issuer_user_id: string;
  ed25519_signature: string;
  public_key: string;
  nonce: string;
  is_redeemed: boolean;
  expires_at: string;
}

export interface BarterListing {
  id: string;
  author_id: string;
  author_arcane_name: string;
  offering_item: string;
  offering_quantity: string;
  requesting_item: string;
  circle_visibility: 'Public' | 'ApplicationOnly' | 'Hidden';
  notes?: string;
  created_at: string;
}

export interface MarketItem {
  id: string;
  name: string;
  botanical_name?: string;
  category: PantryCategory;
  unit_price: number;
  currency: string;
  unit: string;
  package_size: number;
  in_stock: boolean;
  supplier_name: string;
  provenance: string;
  ethical_harvest_grade: 'Wildcrafted' | 'Organic' | 'Artisanal' | 'EthicallySourced';
  description: string;
}

export interface MarketOrderItem {
  market_item: MarketItem;
  order_quantity: number; // number of packages
  total_units: number;    // package_size * order_quantity
}

export interface MarketOrder {
  id: string;
  items: MarketOrderItem[];
  total_amount: number;
  currency: string;
  status: 'Pending' | 'Dispatched' | 'Delivered';
  created_at: string;
}

