import React, { useState, useEffect } from 'react';
import { MarketItem, PantryCategory, PantryItem, VendorQuote } from '../../types';
import { REAL_MARKET_ITEMS } from '../../data/realMarketData';
import { fulfillMarketOrder, getBestQuote, getAverageMarketPrice } from '../../utils/marketService';
import {
  ShoppingBag,
  Search,
  Leaf,
  Bird,
  Gem,
  Wrench,
  Zap,
  ArrowRight,
  PackageCheck,
  ExternalLink,
  Layers,
  Table as TableIcon,
  Star,
  Clock,
  TrendingDown,
  Sparkles
} from 'lucide-react';

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
  const [marketItems] = useState<MarketItem[]>(REAL_MARKET_ITEMS);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');
  const [cart, setCart] = useState<{ [itemId: string]: { quantity: number; selectedQuote?: VendorQuote } }>({});
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  // Quote comparison modal state
  const [activeItemForComparison, setActiveItemForComparison] = useState<MarketItem | null>(null);

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
      item.vendor_quotes?.some((q) => q.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
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

  const updateCartQty = (item: MarketItem, delta: number, quote?: VendorQuote) => {
    setCart((prev) => {
      const current = prev[item.id]?.quantity || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }
      return {
        ...prev,
        [item.id]: {
          quantity: next,
          selectedQuote: quote || prev[item.id]?.selectedQuote || getBestQuote(item)
        }
      };
    });
  };

  const handleInstantBuy = (item: MarketItem, chosenQuote?: VendorQuote) => {
    const quote = chosenQuote || getBestQuote(item);
    const result = fulfillMarketOrder(
      [{ marketItem: item, quantity: 1, selectedQuote: quote }],
      pantryItems
    );
    onRestockPantry(
      result.updatedPantry,
      `Instant Reorder Dispatched: Received supply from ${quote.vendor_name} ($${quote.raw_price}). Pantry balance replenished!`
    );
    setOrderNotice(`Delivered ${item.name} (${quote.vendor_name}) into Pantry.`);
    setActiveItemForComparison(null);
    setTimeout(() => setOrderNotice(null), 4000);
  };

  const handleCheckoutCart = () => {
    const cartEntries: { marketItem: MarketItem; quantity: number; selectedQuote?: VendorQuote }[] = [];
    for (const [id, entry] of Object.entries(cart)) {
      const item = marketItems.find((m) => m.id === id);
      if (item) {
        cartEntries.push({ marketItem: item, quantity: entry.quantity, selectedQuote: entry.selectedQuote });
      }
    }

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

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b.quantity, 0);
  const totalCartPrice = Object.entries(cart).reduce((sum, [id, entry]) => {
    const item = marketItems.find((m) => m.id === id);
    if (!item) return sum;
    const price = entry.selectedQuote ? entry.selectedQuote.raw_price : item.unit_price;
    return sum + price * entry.quantity;
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

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-gold-400">
            Apothecary Marketplace & Price Comparison
          </h2>
          <p className="text-xs text-vellum-200/70">
            Real-world e-commerce prices (Mountain Rose Herbs, Starwest, Frontier, Etsy, Amazon) compared at one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-obsidian-800 p-0.5 rounded-lg border border-obsidian-700 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                viewMode === 'grid'
                  ? 'bg-sage-600 text-vellum-50'
                  : 'text-vellum-200/70 hover:text-vellum-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                viewMode === 'matrix'
                  ? 'bg-sage-600 text-vellum-50'
                  : 'text-vellum-200/70 hover:text-vellum-100'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Comparison Matrix</span>
            </button>
          </div>

          {/* Cart Checkout */}
          {totalCartCount > 0 && (
            <div className="flex items-center gap-3 bg-obsidian-800 border border-gold-500/40 px-3 py-1.5 rounded-lg shadow-sm">
              <div className="text-xs">
                <span className="text-vellum-200/60">{totalCartCount} items • </span>
                <span className="font-bold text-gold-400 font-mono">${totalCartPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckoutCart}
                className="flex items-center gap-1 px-2.5 py-1 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs rounded transition"
              >
                <span>Restock</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
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
            placeholder="Search real supplies or vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-8 pr-3 py-1.5 bg-obsidian-800 border border-obsidian-700 rounded-md text-vellum-100 placeholder-vellum-200/40 focus:outline-hidden focus:border-gold-500"
          />
        </div>
      </div>

      {/* VIEW 1: COMPARATIVE PRICE MATRIX (ALL VENDORS SIDE-BY-SIDE) */}
      {viewMode === 'matrix' && (
        <div className="bg-obsidian-800/90 border border-obsidian-700 rounded-lg overflow-x-auto shadow-md">
          <table className="w-full text-left text-xs text-vellum-200">
            <thead className="bg-obsidian-900 text-vellum-100 uppercase tracking-wider text-[10px] border-b border-obsidian-700">
              <tr>
                <th className="px-4 py-3">Supply & Botanical Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Pantry Stock</th>
                <th className="px-4 py-3">Best Vendor Quote</th>
                <th className="px-4 py-3">Normalized ($/100g)</th>
                <th className="px-4 py-3">Compare All Stores</th>
                <th className="px-4 py-3 text-right">Instant Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-700/60">
              {filteredItems.map((item) => {
                const bestQuote = getBestQuote(item);
                const avgPrice = getAverageMarketPrice(item);
                const savings = Math.round(((avgPrice - bestQuote.normalized_price_per_100g) / avgPrice) * 100);

                const existingInPantry = pantryItems.find((p) =>
                  p.name.toLowerCase().includes(item.name.toLowerCase().split('(')[0].trim())
                );
                const currentPantryQty = existingInPantry ? existingInPantry.quantity : 0;
                const isLow = existingInPantry && existingInPantry.quantity <= existingInPantry.min_threshold;

                return (
                  <tr key={item.id} className="hover:bg-obsidian-700/30 transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-vellum-100">{item.name}</div>
                      {item.botanical_name && (
                        <div className="text-[10px] text-vellum-200/50 italic">{item.botanical_name}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-vellum-200/80">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-xs ${isLow ? 'text-amber-400 font-bold' : 'text-vellum-200'}`}>
                        {currentPantryQty} {item.unit} {isLow && '⚠️'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gold-400">
                        ${bestQuote.raw_price.toFixed(2)}{' '}
                        <span className="text-[10px] text-vellum-200/60 font-normal">
                          ({bestQuote.package_size} {bestQuote.package_unit})
                        </span>
                      </div>
                      <div className="text-[10px] text-sage-300">{bestQuote.vendor_name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-emerald-400 font-bold">
                        ${bestQuote.normalized_price_per_100g.toFixed(2)}
                      </div>
                      {savings > 0 && (
                        <div className="text-[9px] text-emerald-400/80 flex items-center gap-0.5">
                          <TrendingDown className="w-2.5 h-2.5" /> {savings}% vs avg
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setActiveItemForComparison(item)}
                        className="px-2.5 py-1 bg-obsidian-700 hover:bg-gold-500/20 text-vellum-100 hover:text-gold-300 border border-obsidian-600 rounded text-[11px] font-medium transition"
                      >
                        Compare {item.vendor_quotes?.length || 1} Quotes
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleInstantBuy(item, bestQuote)}
                        className="px-3 py-1 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-[11px] rounded transition shadow-xs"
                      >
                        Buy (${bestQuote.raw_price})
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: CARDS GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const bestQuote = getBestQuote(item);
            const avgPrice = getAverageMarketPrice(item);
            const savings = Math.round(((avgPrice - bestQuote.normalized_price_per_100g) / avgPrice) * 100);

            const existingInPantry = pantryItems.find((p) =>
              p.name.toLowerCase().includes(item.name.toLowerCase().split('(')[0].trim())
            );
            const currentPantryQty = existingInPantry ? existingInPantry.quantity : 0;
            const isLowInPantry = existingInPantry && existingInPantry.quantity <= existingInPantry.min_threshold;
            const cartQty = cart[item.id]?.quantity || 0;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border bg-obsidian-800/90 flex flex-col justify-between transition shadow-md ${
                  isLowInPantry
                    ? 'border-amber-500/60 shadow-amber-950/20'
                    : 'border-obsidian-700/80 hover:border-gold-500/40'
                }`}
              >
                <div>
                  {/* Category & Best Value Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      {getCategoryIcon(item.category)}
                      <span className="text-[10px] uppercase tracking-wider text-vellum-200/60 font-semibold">
                        {item.category}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      <Sparkles className="w-2.5 h-2.5" /> Best Deal: ${bestQuote.raw_price.toFixed(2)} {savings > 0 && `(-${savings}%)`}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-vellum-100">{item.name}</h3>

                  {item.botanical_name && (
                    <p className="text-[10px] text-vellum-200/50 italic mb-1.5">{item.botanical_name}</p>
                  )}

                  <p className="text-xs text-vellum-200/70 mb-3 line-clamp-2">{item.description}</p>

                  {/* Multi-Vendor Comparison Highlight Box */}
                  <div className="p-2.5 bg-obsidian-900/80 rounded border border-obsidian-700/50 text-[11px] space-y-1.5 mb-3">
                    <div className="flex justify-between items-center text-vellum-200/70">
                      <span>Lowest Quote:</span>
                      <span className="text-gold-400 font-semibold">{bestQuote.vendor_name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-vellum-200/60">Normalized Cost:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ${bestQuote.normalized_price_per_100g.toFixed(2)} / 100g
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-1 border-t border-obsidian-800">
                      <span className="text-vellum-200/50">Your Pantry Count:</span>
                      <span className={`font-mono ${isLowInPantry ? 'text-amber-400 font-bold' : 'text-vellum-200'}`}>
                        {currentPantryQty} {item.unit} {isLowInPantry && '(Low!)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Comparison Actions */}
                <div className="pt-3 border-t border-obsidian-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold font-mono text-gold-400">
                        ${bestQuote.raw_price.toFixed(2)}
                      </span>
                      <span className="text-vellum-200/50 text-[11px] ml-1">
                        / {bestQuote.package_size} {bestQuote.package_unit}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveItemForComparison(item)}
                      className="text-[11px] text-sage-300 hover:text-gold-300 underline font-medium"
                    >
                      Compare {item.vendor_quotes?.length || 1} Stores →
                    </button>
                  </div>

                  <div className="flex gap-2 text-xs">
                    {cartQty === 0 ? (
                      <button
                        onClick={() => updateCartQty(item, 1)}
                        className="flex-1 py-1.5 px-2 bg-obsidian-700 hover:bg-obsidian-600 text-vellum-200 rounded font-medium flex items-center justify-center gap-1 transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add Cart</span>
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-between bg-obsidian-900 border border-gold-500/40 rounded px-2 py-1">
                        <button
                          onClick={() => updateCartQty(item, -1)}
                          className="text-vellum-200/60 hover:text-vellum-100 px-1 font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono text-gold-400 font-bold">{cartQty}</span>
                        <button
                          onClick={() => updateCartQty(item, 1)}
                          className="text-vellum-200/60 hover:text-vellum-100 px-1 font-bold"
                        >
                          +
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => handleInstantBuy(item, bestQuote)}
                      className="py-1.5 px-3 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-semibold rounded flex items-center gap-1 transition shadow-xs"
                      title="Instant Restock using the Best Quote"
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
      )}

      {/* MULTI-VENDOR QUOTE COMPARISON MODAL */}
      {activeItemForComparison && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-gold-500/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-obsidian-800 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-sage-400 font-bold">
                  Multi-Store Price Comparison Matrix
                </span>
                <h3 className="text-lg font-serif font-bold text-vellum-100">
                  {activeItemForComparison.name}
                </h3>
                {activeItemForComparison.botanical_name && (
                  <p className="text-xs text-vellum-200/50 italic">{activeItemForComparison.botanical_name}</p>
                )}
              </div>
              <button
                onClick={() => setActiveItemForComparison(null)}
                className="text-vellum-200/50 hover:text-vellum-100 text-sm px-2"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-obsidian-800/80 rounded border border-obsidian-700/60 text-xs flex items-center justify-between">
              <div>
                <span className="text-vellum-200/60 block text-[10px]">Average Market Price:</span>
                <span className="font-mono font-bold text-gold-400">
                  ${getAverageMarketPrice(activeItemForComparison).toFixed(2)} / 100g
                </span>
              </div>
              <div>
                <span className="text-vellum-200/60 block text-[10px]">Your Current Stock:</span>
                <span className="font-mono text-vellum-100">
                  {pantryItems.find((p) => p.name.toLowerCase().includes(activeItemForComparison.name.toLowerCase().split('(')[0].trim()))?.quantity || 0}{' '}
                  {activeItemForComparison.unit}
                </span>
              </div>
            </div>

            {/* Vendor Quotes Grid */}
            <div className="space-y-3">
              {activeItemForComparison.vendor_quotes?.map((quote) => {
                const bestQuote = getBestQuote(activeItemForComparison);
                const isBest = quote.id === bestQuote.id;

                return (
                  <div
                    key={quote.id}
                    className={`p-3.5 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isBest
                        ? 'bg-emerald-950/20 border-emerald-500/50 shadow-xs'
                        : 'bg-obsidian-800/70 border-obsidian-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-vellum-100">{quote.vendor_name}</span>
                        {isBest && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-obsidian-950">
                            BEST VALUE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-vellum-200/60">
                        <span className="flex items-center gap-1 text-gold-400">
                          <Star className="w-3 h-3 fill-gold-400 text-gold-400" /> {quote.rating}
                        </span>
                        {quote.shipping_estimate_days && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-sage-400" /> ~{quote.shipping_estimate_days}d Delivery
                          </span>
                        )}
                        <span className="text-vellum-200/80">{quote.purity_certification}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-obsidian-700">
                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-vellum-50">
                          ${quote.raw_price.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          ${quote.normalized_price_per_100g.toFixed(2)} / 100g ({quote.package_size} {quote.package_unit})
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={quote.vendor_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-obsidian-700 hover:bg-obsidian-600 rounded text-vellum-200 hover:text-gold-300 transition"
                          title="View on Vendor Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleInstantBuy(activeItemForComparison, quote)}
                          className="px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-bold text-xs rounded transition shadow-xs"
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-obsidian-800 text-right">
              <button
                onClick={() => setActiveItemForComparison(null)}
                className="px-4 py-1.5 text-xs bg-obsidian-800 hover:bg-obsidian-700 text-vellum-200 rounded"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
