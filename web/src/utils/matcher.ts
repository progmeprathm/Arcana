import { PantryItem, SpellRecipe } from '../types';

export type MatchStatus = 'Ready to Cast' | 'Missing 1 Item' | 'Insufficient Stock';

export interface RecipeMatchResult {
  recipe: SpellRecipe;
  status: MatchStatus;
  missingItemsCount: number;
  missingDetails: { name: string; required: number; available: number; unit: string }[];
}

export function matchRecipeAvailability(
  recipe: SpellRecipe,
  pantryItems: PantryItem[]
): RecipeMatchResult {
  const missingDetails: { name: string; required: number; available: number; unit: string }[] = [];

  for (const req of recipe.required_supplies) {
    // Find pantry item matching name (case-insensitive) or pantry_item_id
    const matched = pantryItems.find(
      p => (req.pantry_item_id && p.id === req.pantry_item_id) ||
           p.name.toLowerCase().trim() === req.name.toLowerCase().trim()
    );

    const available = matched ? matched.quantity : 0;
    if (available < req.quantity) {
      missingDetails.push({
        name: req.name,
        required: req.quantity,
        available,
        unit: req.unit
      });
    }
  }

  let status: MatchStatus;
  if (missingDetails.length === 0) {
    status = 'Ready to Cast';
  } else if (missingDetails.length === 1) {
    status = 'Missing 1 Item';
  } else {
    status = 'Insufficient Stock';
  }

  return {
    recipe,
    status,
    missingItemsCount: missingDetails.length,
    missingDetails
  };
}
