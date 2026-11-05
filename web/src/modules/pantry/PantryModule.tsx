import React, { useState } from 'react';
import { PantryItem, PantryCategory } from '../../types';
import { calculateLunarPhase, getLunarPhaseGlyph } from '../../utils/lunar';
import { Plus, AlertTriangle, Leaf, Bird, Gem, Wrench } from 'lucide-react';

interface PantryModuleProps {
  items: PantryItem[];
  onAddItem: (item: PantryItem) => void;
  onDeleteItem?: (id: string) => void;
}

export const PantryModule: React.FC<PantryModuleProps> = ({ items, onAddItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PantryCategory>('Flora');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState('g');
  const [minThreshold, setMinThreshold] = useState<number>(5);
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const currentLunar = calculateLunarPhase(harvestDate);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const lunar = calculateLunarPhase(harvestDate);
    const newItem: PantryItem = {
      id: `pan-${Date.now()}`,
      user_id: 'usr-rowan',
      name: name.trim(),
      category,
      quantity,
      unit,
      harvest_date: new Date(harvestDate).toISOString(),
      lunar_phase: lunar.phase,
      min_threshold: minThreshold,
      notes: notes.trim()
    };

    onAddItem(newItem);
    setName('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-gold-400">Pantry & Reagent Reserves</h2>
          <p className="text-xs text-vellum-200/70">
            Apothecary inventory, shelf-life thresholds, and lunar harvest alignment.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-gold-500 hover:bg-gold-600 text-obsidian-900 font-semibold text-xs rounded-md shadow-xs transition"
        >
          <Plus className="w-4 h-4" /> Log New Reagent
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex bg-obsidian-800 p-1 rounded-lg border border-obsidian-700/80 text-xs">
          {['All', 'Flora', 'Fauna', 'Mineral', 'Tool'].map(cat => (
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
          <input
            type="text"
            placeholder="Search supplies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 text-xs bg-obsidian-800 border border-obsidian-700 rounded-md text-vellum-100 placeholder-vellum-200/40 focus:outline-hidden focus:border-gold-500/80"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isLowStock = item.quantity <= item.min_threshold;
          const lunarGlyph = item.lunar_phase ? getLunarPhaseGlyph(item.lunar_phase as any) : '🌙';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border transition bg-obsidian-800/90 relative flex flex-col justify-between ${
                isLowStock ? 'border-amber-500/60 shadow-amber-900/10 shadow-lg' : 'border-obsidian-700/80 hover:border-gold-500/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(item.category)}
                    <span className="text-[11px] uppercase tracking-wider text-vellum-200/60 font-medium">
                      {item.category}
                    </span>
                  </div>
                  {isLowStock && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" /> LOW STOCK
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-vellum-100 mb-1">{item.name}</h3>

                {item.notes && (
                  <p className="text-xs text-vellum-200/70 mb-3 italic">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-obsidian-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-lg font-bold font-mono text-gold-400">
                    {item.quantity}
                  </span>
                  <span className="text-vellum-200/60 ml-1">{item.unit}</span>
                  <span className="text-[10px] text-vellum-200/40 block">
                    Min: {item.min_threshold} {item.unit}
                  </span>
                </div>

                {item.lunar_phase && (
                  <div className="text-right">
                    <span className="text-xs" title={item.lunar_phase}>
                      {lunarGlyph} {item.lunar_phase}
                    </span>
                    {item.harvest_date && (
                      <span className="text-[10px] text-vellum-200/40 block">
                        {new Date(item.harvest_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-vellum-200/50 text-xs">
          No supplies match the current category and query.
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-gold-500/30 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-serif font-bold text-gold-400 mb-4">Log Reagent to Apothecary</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-vellum-200/80 mb-1">Reagent Botanical/Common Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mugwort, Black Salt, Obsidian"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100 focus:outline-hidden focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-vellum-200/80 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PantryCategory)}
                    className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100 focus:outline-hidden"
                  >
                    <option value="Flora">Flora</option>
                    <option value="Fauna">Fauna</option>
                    <option value="Mineral">Mineral</option>
                    <option value="Tool">Tool</option>
                  </select>
                </div>
                <div>
                  <label className="block text-vellum-200/80 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="g, oz, pcs, ml"
                    className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-vellum-200/80 mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-vellum-200/80 mb-1">Low-Stock Alert Threshold</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-vellum-200/80 mb-1">Harvest Timestamp</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="flex-1 px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100"
                  />
                  <span className="text-[11px] px-2 py-1 bg-obsidian-800 rounded border border-obsidian-700 text-gold-300">
                    {getLunarPhaseGlyph(currentLunar.phase)} {currentLunar.phase} ({currentLunar.illumination}%)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-vellum-200/80 mb-1">Gathering Notes & Provenance</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Location, soil conditions, drying method..."
                  className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded bg-obsidian-800 hover:bg-obsidian-700 text-vellum-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-gold-500 hover:bg-gold-600 text-obsidian-900 font-semibold"
                >
                  Save Reagent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
