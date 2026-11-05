import { describe, it, expect } from 'vitest';
import {
  calculateNormalizedPricePer100g,
  getBestQuote,
  getAverageMarketPrice,
  fulfillMarketOrder
} from './marketService';
import { MarketItem, PantryItem } from '../types';

describe('Apothecary Market Multi-Vendor Normalization & Comparison', () => {
  it('correctly normalizes 4 oz at $5.25 to price per 100g', () => {
    // 4 oz = 113.398 g. $5.25 / 113.398 * 100 = $4.63
    const normalized = calculateNormalizedPricePer100g(5.25, 4, 'oz');
    expect(normalized).toBeCloseTo(4.63, 1);
  });

  it('correctly normalizes 1 lb at $14.20 to price per 100g', () => {
    // 1 lb = 453.592 g. $14.20 / 453.592 * 100 = $3.13
    const normalized = calculateNormalizedPricePer100g(14.20, 1, 'lb');
    expect(normalized).toBeCloseTo(3.13, 1);
  });

  it('normalizes item pieces per individual piece', () => {
    const normalized = calculateNormalizedPricePer100g(18.00, 3, 'pcs');
    expect(normalized).toBe(6.00);
  });

  const sampleItem: MarketItem = {
    id: 'm1',
    name: 'Mugwort',
    category: 'Flora',
    unit_price: 5.25,
    currency: 'USD',
    unit: 'g',
    package_size: 113.4,
    in_stock: true,
    supplier_name: 'Mountain Rose Herbs',
    provenance: 'USA',
    ethical_harvest_grade: 'Organic',
    description: 'Dried herb',
    vendor_quotes: [
      {
        id: 'q1',
        vendor_name: 'Mountain Rose Herbs',
        vendor_url: 'https://mountainroseherbs.com',
        raw_price: 5.25,
        currency: 'USD',
        package_size: 4,
        package_unit: 'oz',
        normalized_price_per_100g: 4.63,
        rating: 4.9,
        purity_certification: 'Organic',
        in_stock: true
      },
      {
        id: 'q2',
        vendor_name: 'Starwest Botanicals',
        vendor_url: 'https://starwest-botanicals.com',
        raw_price: 14.20,
        currency: 'USD',
        package_size: 1,
        package_unit: 'lb',
        normalized_price_per_100g: 3.13,
        rating: 4.8,
        purity_certification: 'Organic',
        in_stock: true
      }
    ]
  };

  it('identifies best-value vendor quote accurately', () => {
    const best = getBestQuote(sampleItem);
    expect(best.vendor_name).toBe('Starwest Botanicals');
    expect(best.normalized_price_per_100g).toBe(3.13);
  });

  it('computes accurate market average price across quotes', () => {
    const avg = getAverageMarketPrice(sampleItem);
    // (4.63 + 3.13) / 2 = 3.88
    expect(avg).toBe(3.88);
  });

  it('fulfills order with selected vendor quote and updates pantry', () => {
    const pantry: PantryItem[] = [
      {
        id: 'p1',
        user_id: 'u1',
        name: 'Mugwort',
        category: 'Flora',
        quantity: 10,
        unit: 'g',
        min_threshold: 5
      }
    ];

    const starwestQuote = sampleItem.vendor_quotes![1]; // 1 lb = 453.6g
    const { order, updatedPantry, replenishedSummary } = fulfillMarketOrder(
      [{ marketItem: sampleItem, quantity: 1, selectedQuote: starwestQuote }],
      pantry
    );

    expect(order.total_amount).toBe(14.20);
    expect(updatedPantry[0].quantity).toBeCloseTo(463.6, 1); // 10 + 453.6
    expect(replenishedSummary[0]).toContain('Starwest Botanicals');
  });
});
