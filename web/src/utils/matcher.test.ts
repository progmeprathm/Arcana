import { describe, it, expect } from 'vitest';
import { matchRecipeAvailability } from './matcher';
import { SpellRecipe, PantryItem } from '../types';

describe('Recipe Auto-Matcher', () => {
  const samplePantry: PantryItem[] = [
    {
      id: 'p1',
      user_id: 'u1',
      name: 'Mugwort',
      category: 'Flora',
      quantity: 20,
      unit: 'g',
      min_threshold: 5
    },
    {
      id: 'p2',
      user_id: 'u1',
      name: 'Frankincense',
      category: 'Flora',
      quantity: 5,
      unit: 'g',
      min_threshold: 5
    }
  ];

  const readyRecipe: SpellRecipe = {
    id: 'r1',
    name: 'Dream Blend',
    category: 'Oneiromancy',
    difficulty: 'Beginner',
    affinity: 'Water',
    duration_minutes: 15,
    safety_warnings: [],
    instructions: ['Blend herbs'],
    required_supplies: [
      { name: 'Mugwort', quantity: 10, unit: 'g' }
    ]
  };

  const missingOneRecipe: SpellRecipe = {
    id: 'r2',
    name: 'Warding Smoke',
    category: 'Protection',
    difficulty: 'Initiate',
    affinity: 'Fire',
    duration_minutes: 20,
    safety_warnings: [],
    instructions: ['Burn resin and tourmaline'],
    required_supplies: [
      { name: 'Frankincense', quantity: 5, unit: 'g' },
      { name: 'Black Tourmaline', quantity: 1, unit: 'pcs' }
    ]
  };

  const insufficientRecipe: SpellRecipe = {
    id: 'r3',
    name: 'Master Ritual',
    category: 'High Craft',
    difficulty: 'Master',
    affinity: 'Aether',
    duration_minutes: 60,
    safety_warnings: [],
    instructions: ['High invocation'],
    required_supplies: [
      { name: 'Mugwort', quantity: 50, unit: 'g' }, // short
      { name: 'Gold Leaf', quantity: 1, unit: 'sheet' }, // missing
      { name: 'Cedar Oil', quantity: 10, unit: 'ml' } // missing
    ]
  };

  it('flags recipe as Ready to Cast when all supplies are satisfied', () => {
    const res = matchRecipeAvailability(readyRecipe, samplePantry);
    expect(res.status).toBe('Ready to Cast');
    expect(res.missingItemsCount).toBe(0);
  });

  it('flags recipe as Missing 1 Item when exactly one supply is insufficient', () => {
    const res = matchRecipeAvailability(missingOneRecipe, samplePantry);
    expect(res.status).toBe('Missing 1 Item');
    expect(res.missingItemsCount).toBe(1);
    expect(res.missingDetails[0].name).toBe('Black Tourmaline');
  });

  it('flags recipe as Insufficient Stock when 2 or more supplies are missing', () => {
    const res = matchRecipeAvailability(insufficientRecipe, samplePantry);
    expect(res.status).toBe('Insufficient Stock');
    expect(res.missingItemsCount).toBe(3);
  });
});
