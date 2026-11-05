import React, { useState, useEffect } from 'react';
import { MarketItem, PantryCategory, PantryItem } from '../../types';
import { INITIAL_MARKET_ITEMS } from '../../data/seedMarket';
import { fulfillMarketOrder } from '../../utils/marketService';
import { ShoppingBag, Search, Leaf, Bird, Gem, Wrench, ShieldCheck, Zap, ArrowRight, PackageCheck } from 'lucide-react';

interface MarketplaceModuleProps {
  pantryItems: PantryItem[];
  onRestockPantry: (updatedPantry: PantryItem[], notice: string) => void;
  initialQuery?: string;
}

export const MarketplaceModule: React.FC<MarketplaceModuleProps> = ({
  pantryItems,
  onRestockPantry,
  initialQuery = ''
}) => {
  const [marketItems] = useState<MarketItem[]>(INITIAL_MARKET_ITEMS);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const filteredItems = marketItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.botanical_name && item.botanical_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat: PantryCategory) => {
    switch (cat) {
      case 'Flora': return <Leaf className="w-4 h-4 text-emerald-400" />;
      case 'Fauna': return <Bird className="w-4 h-4 text-amber-300" />;
      case 'Mineral': return <Gem className="w-4 h-4 text-cyan-400" />;
      case 'Tool': return <Wrench className="w-4 h-4 text-purple-300" />;
    }
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const handleInstantBuy = (item: MarketItem) => {
    const result = fulfillMarketOrder([{ marketItem: item, quantity: 1 }], pantryItems);
    onRestockPantry(
      result.updatedPantry,
      `Instant Reorder Dispatched: Received +${item.package_size}${item.unit} ${item.name} from ${item.supplier_name}. Pantry balance replenished!`
    );
    setOrderNotice(`Delivered +${item.package_size}${item.unit} ${item.name} to Pantry.`);
    setTimeout(() => setOrderNotice(null), 4000);
  };

  const handleCheckoutCart = () => {
    const cartEntries = Object.entries(cart)
      .map(([id, qty]) => {
        const item = marketItems.find((m) => m.id === id);
        return item ? { marketItem: item, quantity: qty } : null;
      })
      .filter((x): x is { marketItem: MarketItem; quantity: number } => x !== null);

    if (cartEntries.length === 0) return;

    const result = fulfillMarketOrder(cartEntries, pantryItems);
    onRestockPantry(
      result.updatedPantry,
      `Market Order Delivered ($${result.order.total_amount}): ${result.replenishedSummary.join(', ')}.`
    );

    setCart({});
    setOrderNotice(`Consolidated shipment received! ${result.replenishedSummary.length} supplies restocked into Pantry.`);
    setTimeout(() => setOrderNotice(null), 5000);
  };

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalCartPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = marketItems.find((m) => m.id === id);
    return sum + (item ? item.unit_price * qty : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Restock Notification Banner */}
      {orderNotice && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-600/60 rounded-lg text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{orderNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono">Pantry Auto-Synced</span>
        </div>
      )}

      {/* Header & Cart Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-gold-400">Apothecary Marketplace & Reagents</h2>
          <p className="text-xs text-vellum-200/70">
            Source ethically gathered botanicals, rare minerals, and ritual tools with instant pantry restocking.
          </p>
        </div>

        {totalCartCount > 0 && (
          <div className="flex items-center gap-3 bg-obsidian-800 border border-gold-500/40 px-3.5 py-1.5 rounded-lg shadow-sm">
            <div className="text-xs">
              <span className="text-vellum-200/60">{totalCartCount} items • </span>
              <span className="font-bold text-gold-400 font-mono">${totalCartPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckoutCart}
              className="flex items-center gap-1.5 px-3 py-1 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs rounded transition"
            >
              <span>Restock Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between text-xs">
        <div className="flex bg-obsidian-800 p-1 rounded-lg border border-obsidian-700/80">
          {['All', 'Flora', 'Fauna', 'Mineral', 'Tool'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                selectedCategory === cat
                  ? 'bg-sage-600 text-vellum-50 shadow-xs'
                  : 'text-vellum-200/70 hover:text-vellum-100 hover:bg-obsidian-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-vellum-200/40" />
          <input
            type="text"
            placeholder="Search apothecary market..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-8 pr-3 py-1.5 bg-obsidian-800 border border-obsidian-700 rounded-md text-vellum-100 placeholder-vellum-200/40 focus:outline-hidden focus:border-gold-500"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          // Check if item is currently in pantry and low-stock
          const existingInPantry = pantryItems.find((p) =>
            p.name.toLowerCase().includes(item.name.toLowerCase().split('(')[0].trim())
          );
          const currentPantryQty = existingInPantry ? existingInPantry.quantity : 0;
          const isLowInPantry = existingInPantry && existingInPantry.quantity <= existingInPantry.min_threshold;
          const cartQuantity = cart[item.id] || 0;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border bg-obsidian-800/90 flex flex-col justify-between transition shadow-md ${
                isLowInPantry ? 'border-amber-500/60 shadow-amber-950/20' : 'border-obsidian-700/80 hover:border-gold-500/40'
              }`}
            >
              <div>
                {/* Header: Category & Provenance Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {getCategoryIcon(item.category)}
                    <span className="text-[10px] uppercase tracking-wider text-vellum-200/60 font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded bg-sage-950/60 text-sage-300 border border-sage-800/40">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    {item.ethical_harvest_grade}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-sm text-vellum-100">{item.name}</h3>

                {item.botanical_name && (
                  <p className="text-[10px] text-vellum-200/50 italic mb-1.5">{item.botanical_name}</p>
                )}

                <p className="text-xs text-vellum-200/70 mb-3 line-clamp-2">{item.description}</p>

                {/* Supplier & In-Pantry Status */}
                <div className="p-2 bg-obsidian-900/60 rounded border border-obsidian-700/40 text-[11px] space-y-1 mb-3">
                  <div className="flex justify-between text-vellum-200/60">
                    <span>Supplier:</span>
                    <span className="text-vellum-200 text-right font-medium">{item.supplier_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-vellum-200/60">Your Pantry Balance:</span>
                    <span className={`font-mono font-medium ${isLowInPantry ? 'text-amber-400' : 'text-vellum-100'}`}>
                      {currentPantryQty} {item.unit} {isLowInPantry && '(Low Stock!)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing & Reorder Actions */}
              <div className="pt-3 border-t border-obsidian-700/60">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-base font-bold font-mono text-gold-400">
                      ${item.unit_price.toFixed(2)}
                    </span>
                    <span className="text-vellum-200/50 text-[11px] ml-1">
                      / {item.package_size} {item.unit} lot
                    </span>
                  </div>

                  <span className="text-[10px] text-emerald-400 font-semibold">
                    ● In Stock
                  </span>
                </div>

                <div className="flex gap-2 text-xs">
                  {cartQuantity === 0 ? (
                    <button
                      onClick={() => updateCartQty(item.id, 1)}
                      className="flex-1 py-1.5 px-2 bg-obsidian-700 hover:bg-obsidian-600 text-vellum-200 rounded font-medium flex items-center justify-center gap-1 transition"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Order</span>
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-between bg-obsidian-900 border border-gold-500/40 rounded px-2 py-1">
                      <button
                        onClick={() => updateCartQty(item.id, -1)}
                        className="text-vellum-200/60 hover:text-vellum-100 px-1 font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono text-gold-400 font-bold">{cartQuantity}</span>
                      <button
                        onClick={() => updateCartQty(item.id, 1)}
                        className="text-vellum-200/60 hover:text-vellum-100 px-1 font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleInstantBuy(item)}
                    className="py-1.5 px-3 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-semibold rounded flex items-center gap-1 transition shadow-xs"
                    title="1-Click Instant Restock directly into Pantry"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Instant Restock</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-vellum-200/50 text-xs">
          No supplies match the current search query or category filter.
        </div>
      )}
    </div>
  );
};
