import { describe, it, expect } from 'vitest';
import { fulfillMarketOrder } from './marketService';
import { MarketItem, PantryItem } from '../types';

describe('Marketplace Fulfillment & Pantry Replenishment', () => {
  const mockPantry: PantryItem[] = [
    {
      id: 'p1',
      user_id: 'u1',
      name: 'Mugwort (Artemisia vulgaris)',
      category: 'Flora',
      quantity: 5, // low stock!
      unit: 'g',
      min_threshold: 15
    }
  ];

  const sampleMarketItem: MarketItem = {
    id: 'm1',
    name: 'Mugwort (Artemisia vulgaris)',
    botanical_name: 'Artemisia vulgaris',
    category: 'Flora',
    unit_price: 12.50,
    currency: 'USD',
    unit: 'g',
    package_size: 50,
    in_stock: true,
    supplier_name: 'Elderwood Sanctuary',
    provenance: 'Highlands',
    ethical_harvest_grade: 'Wildcrafted',
    description: 'Dry leaves'
  };

  const newMarketItem: MarketItem = {
    id: 'm2',
    name: 'Dragon’s Blood Resin',
    category: 'Flora',
    unit_price: 24.00,
    currency: 'USD',
    unit: 'g',
    package_size: 30,
    in_stock: true,
    supplier_name: 'Rainforest Collective',
    provenance: 'Sumatra',
    ethical_harvest_grade: 'Wildcrafted',
    description: 'Red resin'
  };

  it('increments quantity of existing pantry item when restocked', () => {
    const { order, updatedPantry, replenishedSummary } = fulfillMarketOrder(
      [{ marketItem: sampleMarketItem, quantity: 2 }], // 2 * 50g = 100g
      mockPantry
    );

    expect(order.total_amount).toBe(25.00);
    expect(order.status).toBe('Delivered');

    const mugwort = updatedPantry.find(p => p.id === 'p1');
    expect(mugwort).toBeDefined();
    expect(mugwort!.quantity).toBe(105); // 5 + 100
    expect(replenishedSummary[0]).toContain('+100g');
  });

  it('creates new pantry item when acquiring new supply', () => {
    const { updatedPantry } = fulfillMarketOrder(
      [{ marketItem: newMarketItem, quantity: 1 }], // 30g
      mockPantry
    );

    expect(updatedPantry.length).toBe(2);
    const dragonsBlood = updatedPantry.find(p => p.name === newMarketItem.name);
    expect(dragonsBlood).toBeDefined();
    expect(dragonsBlood!.quantity).toBe(30);
    expect(dragonsBlood!.category).toBe('Flora');
  });
});

