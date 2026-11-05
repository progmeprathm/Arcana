import { MarketItem, MarketOrderItem, MarketOrder, PantryItem } from '../types';

/**
 * Fulfills an order from the Apothecary Marketplace and replenishes pantry stock balances.
 */
export function fulfillMarketOrder(
  cartItems: { marketItem: MarketItem; quantity: number }[],
  existingPantry: PantryItem[],
  userId: string = 'usr-rowan'
): {
  order: MarketOrder;
  updatedPantry: PantryItem[];
  replenishedSummary: string[];
} {
  const orderItems: MarketOrderItem[] = cartItems.map(({ marketItem, quantity }) => ({
    market_item: marketItem,
    order_quantity: quantity,
    total_units: marketItem.package_size * quantity
  }));

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.market_item.unit_price * item.order_quantity,
    0
  );

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
    const addedQuantity = item.total_units;

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
          ? `${current.notes} (Restocked +${addedQuantity}${marketItem.unit} via ${marketItem.supplier_name})`
          : `Restocked +${addedQuantity}${marketItem.unit} via ${marketItem.supplier_name}`
      };
      replenishedSummary.push(`${marketItem.name}: +${addedQuantity}${marketItem.unit} (New Total: ${newQty}${marketItem.unit})`);
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
        notes: `Acquired from ${marketItem.supplier_name} (${marketItem.provenance}).`
      };
      updatedPantry.unshift(newItem);
      replenishedSummary.push(`${marketItem.name}: Added ${addedQuantity}${marketItem.unit} to Pantry`);
    }
  }

  return {
    order,
    updatedPantry,
    replenishedSummary
  };
}

