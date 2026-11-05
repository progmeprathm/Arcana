import React, { useState } from 'react';
import { SpellRecipe, PantryItem } from '../../types';
import { matchRecipeAvailability } from '../../utils/matcher';
import { Sparkles, ShieldAlert, Clock, Flame, Droplets, Wind, Mountain, Compass, ShoppingBag } from 'lucide-react';

interface ArchiveModuleProps {
  recipes: SpellRecipe[];
  pantryItems: PantryItem[];
  onExecuteRecipe: (recipe: SpellRecipe) => { success: boolean; message: string };
  onNavigateToMarket?: (reagentName: string) => void;
}

export const ArchiveModule: React.FC<ArchiveModuleProps> = ({
  recipes,
  pantryItems,
  onExecuteRecipe,
  onNavigateToMarket
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedAffinity, setSelectedAffinity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRecipe, setActiveRecipe] = useState<SpellRecipe | null>(null);
  const [executionNotice, setExecutionNotice] = useState<string | null>(null);

  const filteredRecipes = recipes.filter(r => {
    const matchesDiff = selectedDifficulty === 'All' || r.difficulty === selectedDifficulty;
    const matchesAffinity = selectedAffinity === 'All' || r.affinity === selectedAffinity;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.required_supplies.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDiff && matchesAffinity && matchesSearch;
  });

  const getAffinityIcon = (affinity: string) => {
    switch (affinity) {
      case 'Fire': return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'Water': return <Droplets className="w-3.5 h-3.5 text-blue-400" />;
      case 'Air': return <Wind className="w-3.5 h-3.5 text-amber-200" />;
      case 'Earth': return <Mountain className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Compass className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const handleCast = (recipe: SpellRecipe) => {
    const result = onExecuteRecipe(recipe);
    setExecutionNotice(result.message);
    setTimeout(() => setExecutionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Execution Alert Banner */}
      {executionNotice && (
        <div className="p-3 bg-gold-500/20 border border-gold-500/40 rounded-lg text-gold-300 text-xs flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{executionNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-gold-400">Archive of Rites & Formulations</h2>
          <p className="text-xs text-vellum-200/70">
            Action-oriented spell catalog with dynamic pantry reagent auto-matching and one-tap deduction.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-vellum-200/50">Difficulty:</span>
          {['All', 'Beginner', 'Initiate', 'Adept'].map(d => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-2.5 py-1 rounded transition ${
                selectedDifficulty === d
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-medium'
                  : 'bg-obsidian-800 text-vellum-200/70 hover:bg-obsidian-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-vellum-200/50">Affinity:</span>
          {['All', 'Earth', 'Water', 'Air', 'Fire'].map(a => (
            <button
              key={a}
              onClick={() => setSelectedAffinity(a)}
              className={`px-2.5 py-1 rounded transition ${
                selectedAffinity === a
                  ? 'bg-sage-600 text-vellum-100 font-medium'
                  : 'bg-obsidian-800 text-vellum-200/70 hover:bg-obsidian-700'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-56 px-3 py-1.5 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100 placeholder-vellum-200/40 focus:outline-hidden focus:border-gold-500"
        />
      </div>

      {/* Spells Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map(recipe => {
          const match = matchRecipeAvailability(recipe, pantryItems);
          const isReady = match.status === 'Ready to Cast';
          const isMissingOne = match.status === 'Missing 1 Item';

          return (
            <div
              key={recipe.id}
              className="bg-obsidian-800/90 border border-obsidian-700/80 hover:border-gold-500/50 rounded-lg p-5 flex flex-col justify-between transition group shadow-md"
            >
              <div>
                {/* Status Badge & Affinity */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isReady
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : isMissingOne
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {match.status}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs text-vellum-200/80">
                    {getAffinityIcon(recipe.affinity)} {recipe.affinity}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-vellum-100 group-hover:text-gold-400 transition mb-1">
                  {recipe.name}
                </h3>
                <p className="text-[11px] text-vellum-200/60 mb-3">{recipe.category}</p>

                {/* Supplies required */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-semibold tracking-wider text-vellum-200/40 uppercase block">
                    Required Reagents:
                  </span>
                  {recipe.required_supplies.map(req => {
                    const matchItem = pantryItems.find(p => p.name.toLowerCase() === req.name.toLowerCase());
                    const currentQty = matchItem ? matchItem.quantity : 0;
                    const hasEnough = currentQty >= req.quantity;

                    return (
                      <div
                        key={req.name}
                        className={`text-xs flex items-center justify-between px-2 py-1 rounded ${
                          hasEnough ? 'bg-obsidian-900/60 text-vellum-200' : 'bg-rose-950/30 text-rose-300 border border-rose-900/40'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{req.name}</span>
                          {!hasEnough && onNavigateToMarket && (
                            <button
                              onClick={() => onNavigateToMarket(req.name)}
                              className="text-[9px] bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 px-1.5 py-0.2 rounded border border-gold-500/40 flex items-center gap-0.5"
                              title="Order this missing supply from the Marketplace"
                            >
                              <ShoppingBag className="w-2.5 h-2.5" />
                              <span>Order</span>
                            </button>
                          )}
                        </span>
                        <span className="font-mono text-[11px]">
                          {req.quantity} {req.unit} <span className="opacity-50">({currentQty} in pantry)</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-obsidian-700/60 flex items-center justify-between gap-2">
                <span className="text-[11px] text-vellum-200/50 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {recipe.duration_minutes}m • {recipe.difficulty}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveRecipe(recipe)}
                    className="px-2.5 py-1 text-xs bg-obsidian-700 hover:bg-obsidian-600 text-vellum-200 rounded"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleCast(recipe)}
                    disabled={!isReady}
                    className={`px-3 py-1 text-xs font-semibold rounded flex items-center gap-1 transition ${
                      isReady
                        ? 'bg-gold-500 hover:bg-gold-600 text-obsidian-900 shadow-xs'
                        : 'bg-obsidian-700 text-vellum-200/30 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" /> Execute
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Detail Modal */}
      {activeRecipe && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-gold-500/30 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[11px] text-gold-400 font-mono tracking-wider uppercase">
                  {activeRecipe.difficulty} Tier • {activeRecipe.affinity} Affinity
                </span>
                <h3 className="text-lg font-serif font-bold text-vellum-100">{activeRecipe.name}</h3>
              </div>
              <button
                onClick={() => setActiveRecipe(null)}
                className="text-vellum-200/60 hover:text-vellum-100 text-lg px-2"
              >
                ✕
              </button>
            </div>

            {/* Warnings */}
            {activeRecipe.safety_warnings.length > 0 && (
              <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded text-amber-200 text-xs space-y-1">
                <div className="font-semibold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Operational & Safety Notes:
                </div>
                {activeRecipe.safety_warnings.map((w, idx) => (
                  <p key={idx} className="pl-4">• {w}</p>
                ))}
              </div>
            )}

            {/* Steps */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-vellum-200/50">
                Casting & Preparation Steps
              </h4>
              <ol className="space-y-2 text-xs text-vellum-200">
                {activeRecipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="font-mono text-gold-400 font-bold">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-obsidian-800">
              <button
                onClick={() => setActiveRecipe(null)}
                className="px-4 py-2 text-xs bg-obsidian-800 hover:bg-obsidian-700 text-vellum-200 rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCast(activeRecipe);
                  setActiveRecipe(null);
                }}
                className="px-4 py-2 text-xs bg-gold-500 hover:bg-gold-600 text-obsidian-900 font-semibold rounded flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Deduct Supplies & Cast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
