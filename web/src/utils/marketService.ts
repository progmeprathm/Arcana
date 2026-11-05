import { MarketItem, MarketOrderItem, MarketOrder, PantryItem, VendorQuote } from '../types';

/**
 * Normalizes any package size and currency to standard $/100g (or $/unit for tools/items).
 * Conversions:
 * 1 oz = 28.3495 g
 * 1 lb = 453.592 g
 * 100g = 100 g
 */
export function calculateNormalizedPricePer100g(
  rawPrice: number,
  packageSize: number,
  packageUnit: string
): number {
  if (packageSize <= 0) return rawPrice;

  const unitLower = packageUnit.toLowerCase().trim();
  let weightInGrams = packageSize;

  if (unitLower === 'oz' || unitLower === 'ounces') {
    weightInGrams = packageSize * 28.3495;
  } else if (unitLower === 'lb' || unitLower === 'lbs' || unitLower === 'pound' || unitLower === 'pounds') {
    weightInGrams = packageSize * 453.592;
  } else if (unitLower === 'kg') {
    weightInGrams = packageSize * 1000;
  } else if (unitLower === 'pcs' || unitLower === 'item' || unitLower === 'items') {
    // For individual items or crystal shards, normalize per individual piece
    return Math.round((rawPrice / packageSize) * 100) / 100;
  }

  // Calculate price per 100g
  const pricePerGram = rawPrice / weightInGrams;
  return Math.round(pricePerGram * 100 * 100) / 100;
}

/**
 * Returns the best-value quote from an item's available vendor quotes.
 */
export function getBestQuote(item: MarketItem): VendorQuote {
  if (!item.vendor_quotes || item.vendor_quotes.length === 0) {
    return {
      id: `default-${item.id}`,
      vendor_name: item.supplier_name,
      vendor_url: '#',
      raw_price: item.unit_price,
      currency: item.currency,
      package_size: item.package_size,
      package_unit: item.unit,
      normalized_price_per_100g: item.unit_price,
      rating: 4.8,
      purity_certification: item.ethical_harvest_grade,
      in_stock: item.in_stock
    };
  }

  // Sort by lowest normalized price per 100g
  const sorted = [...item.vendor_quotes].sort(
    (a, b) => a.normalized_price_per_100g - b.normalized_price_per_100g
  );
  return sorted[0];
}

/**
 * Returns average normalized price across all quotes for an item.
 */
export function getAverageMarketPrice(item: MarketItem): number {
  if (!item.vendor_quotes || item.vendor_quotes.length === 0) return item.unit_price;
  const sum = item.vendor_quotes.reduce((acc, q) => acc + q.normalized_price_per_100g, 0);
  return Math.round((sum / item.vendor_quotes.length) * 100) / 100;
}

/**
 * Fulfills an order from the Apothecary Marketplace and replenishes pantry stock balances,
 * taking into account specific vendor quotes if selected.
 */
export function fulfillMarketOrder(
  cartItems: { marketItem: MarketItem; quantity: number; selectedQuote?: VendorQuote }[],
  existingPantry: PantryItem[],
  userId: string = 'usr-rowan'
): {
  order: MarketOrder;
  updatedPantry: PantryItem[];
  replenishedSummary: string[];
} {
  const orderItems: MarketOrderItem[] = cartItems.map(({ marketItem, quantity, selectedQuote }) => {
    const quote = selectedQuote || getBestQuote(marketItem);
    
    // Convert package size to grams if imperial
    let addedQuantity = quote.package_size;
    if (quote.package_unit.toLowerCase() === 'oz') {
      addedQuantity = Math.round(quote.package_size * 28.3495 * 10) / 10;
    } else if (quote.package_unit.toLowerCase() === 'lb') {
      addedQuantity = Math.round(quote.package_size * 453.592 * 10) / 10;
    }

    return {
      market_item: marketItem,
      selected_quote: quote,
      order_quantity: quantity,
      total_units: Math.round(addedQuantity * quantity * 10) / 10
    };
  });

  const totalAmount = orderItems.reduce((sum, item) => {
    const price = item.selected_quote ? item.selected_quote.raw_price : item.market_item.unit_price;
    return sum + price * item.order_quantity;
  }, 0);

  const order: MarketOrder = {
    id: `ord-${Date.now()}`,
    items: orderItems,
    total_amount: Math.round(totalAmount * 100) / 100,
    currency: 'USD',
    status: 'Delivered',
    created_at: new Date().toISOString()
  };

  const updatedPantry = [...existingPantry];
  const replenishedSummary: string[] = [];

  for (const item of orderItems) {
    const marketItem = item.market_item;
    const quote = item.selected_quote || getBestQuote(marketItem);
    const addedQuantity = item.total_units;
    const vendorName = quote.vendor_name;

    // Search for existing pantry item matching name or botanical name
    const matchIndex = updatedPantry.findIndex(
      (p) =>
        p.name.toLowerCase().includes(marketItem.name.toLowerCase().split('(')[0].trim()) ||
        (marketItem.botanical_name && p.name.toLowerCase().includes(marketItem.botanical_name.toLowerCase()))
    );

    if (matchIndex >= 0) {
      // Replenish existing item
      const current = updatedPantry[matchIndex];
      const newQty = Math.round((current.quantity + addedQuantity) * 10) / 10;
      updatedPantry[matchIndex] = {
        ...current,
        quantity: newQty,
        notes: current.notes
          ? `${current.notes} (Restocked +${addedQuantity}${current.unit} via ${vendorName} @ $${quote.raw_price})`
          : `Restocked +${addedQuantity}${current.unit} via ${vendorName} @ $${quote.raw_price}`
      };
      replenishedSummary.push(`${marketItem.name}: +${addedQuantity}${current.unit} from ${vendorName} (New Total: ${newQty}${current.unit})`);
    } else {
      // Add as new pantry item
      const newItem: PantryItem = {
        id: `pan-mkt-${Date.now()}-${marketItem.id}`,
        user_id: userId,
        name: marketItem.name,
        category: marketItem.category,
        quantity: addedQuantity,
        unit: marketItem.unit,
        harvest_date: new Date().toISOString(),
        min_threshold: Math.max(1, Math.round(addedQuantity * 0.2)),
        notes: `Acquired from ${vendorName} (${quote.purity_certification}).`
      };
      updatedPantry.unshift(newItem);
      replenishedSummary.push(`${marketItem.name}: Added ${addedQuantity}${marketItem.unit} from ${vendorName} to Pantry`);
    }
  }

  return {
    order,
    updatedPantry,
    replenishedSummary
  };
}
