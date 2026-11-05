import React, { useState, useEffect } from 'react';
import { PantryItem, SpellRecipe, JournalEntry, ArcaneProfile, BarterListing } from './types';
import { INITIAL_PANTRY, INITIAL_SPELLS, INITIAL_JOURNAL, INITIAL_PROFILE, INITIAL_BARTER } from './data/seed';
import { PantryModule } from './modules/pantry/PantryModule';
import { ArchiveModule } from './modules/archive/ArchiveModule';
import { MarketplaceModule } from './modules/market/MarketplaceModule';
import { ChronicleModule } from './modules/chronicle/ChronicleModule';
import { CovenModule } from './modules/coven/CovenModule';
import { SanctumModule } from './modules/sanctum/SanctumModule';
import { DiscretionCamouflage } from './components/DiscretionCamouflage';
import { calculateLunarPhase, getLunarPhaseGlyph } from './utils/lunar';
import { Package, BookOpen, Feather, Users, ShieldAlert, UserCircle, ShoppingBag } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pantry' | 'archive' | 'marketplace' | 'chronicle' | 'coven' | 'sanctum'>('pantry');
  const [marketSearchQuery, setMarketSearchQuery] = useState('');
  const [isPanicActive, setIsPanicActive] = useState(false);

  // Core reactive entities
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('arcana_pantry');
    return saved ? JSON.parse(saved) : INITIAL_PANTRY;
  });

  const [recipes] = useState<SpellRecipe[]>(() => {
    const saved = localStorage.getItem('arcana_recipes');
    return saved ? JSON.parse(saved) : INITIAL_SPELLS;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('arcana_journal');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL;
  });

  const [profile, setProfile] = useState<ArcaneProfile>(() => {
    const saved = localStorage.getItem('arcana_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [barterListings, setBarterListings] = useState<BarterListing[]>(() => {
    const saved = localStorage.getItem('arcana_barter');
    return saved ? JSON.parse(saved) : INITIAL_BARTER;
  });

  // Current lunar status
  const currentLunar = calculateLunarPhase();

  // Save changes to localStorage for offline persistence (NFR 5.2)
  useEffect(() => {
    localStorage.setItem('arcana_pantry', JSON.stringify(pantryItems));
  }, [pantryItems]);

  useEffect(() => {
    localStorage.setItem('arcana_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('arcana_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('arcana_barter', JSON.stringify(barterListings));
  }, [barterListings]);

  // Global hotkey listener for Discretion Mode (FR-SAN-02: <100ms response)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.ctrlKey && e.shiftKey && e.key === 'P')) {
        setIsPanicActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleAddItem = (item: PantryItem) => {
    setPantryItems(prev => [item, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setPantryItems(prev => prev.filter(i => i.id !== id));
  };

  // FR-ARC-02: One-tap Reagent Deduction Integration
  const handleExecuteRecipe = (recipe: SpellRecipe): { success: boolean; message: string } => {
    // Check all required items
    for (const req of recipe.required_supplies) {
      const match = pantryItems.find(
        p => (req.pantry_item_id && p.id === req.pantry_item_id) ||
             p.name.toLowerCase().trim() === req.name.toLowerCase().trim()
      );
      if (!match || match.quantity < req.quantity) {
        return {
          success: false,
          message: `Cannot execute ${recipe.name}: Insufficient ${req.name} (${match ? match.quantity : 0} of ${req.quantity} ${req.unit} available).`
        };
      }
    }

    // Decrement balances
    setPantryItems(prev =>
      prev.map(p => {
        const req = recipe.required_supplies.find(
          r => (r.pantry_item_id && r.pantry_item_id === p.id) ||
               r.name.toLowerCase().trim() === p.name.toLowerCase().trim()
        );
        if (req) {
          const newQty = Math.max(0, Math.round((p.quantity - req.quantity) * 100) / 100);
          return { ...p, quantity: newQty };
        }
        return p;
      })
    );

    // Auto-log to chronicle
    const executionEntry: JournalEntry = {
      id: `jrn-exec-${Date.now()}`,
      user_id: profile.id,
      title: `Rite Execution: ${recipe.name}`,
      formatted_body: `Executed ritual recipe **${recipe.name}** (${recipe.difficulty} tier, ${recipe.affinity} affinity).\n\nReagent balances deducted:\n` +
        recipe.required_supplies.map(r => `• -${r.quantity} ${r.unit} ${r.name}`).join('\n'),
      linked_spell_id: recipe.id,
      linked_pantry_ids: pantryItems
        .filter(p => recipe.required_supplies.some(r => r.name.toLowerCase() === p.name.toLowerCase()))
        .map(p => p.id),
      outcome_rating: 5,
      lunar_phase: currentLunar.phase,
      weather_conditions: 'Rite conducted under active sanctum conditions',
      created_at: new Date().toISOString()
    };

    setJournalEntries(prev => [executionEntry, ...prev]);

    return {
      success: true,
      message: `Successfully executed ${recipe.name}. Reagents decremented and chronicle entry auto-logged!`
    };
  };

  const handleAddJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => [entry, ...prev]);
  };

  const handleAddBarter = (listing: BarterListing) => {
    setBarterListings(prev => [listing, ...prev]);
  };

  const handleVerifyWithToken = (_tokenId: string) => {
    setProfile(prev => ({ ...prev, verification_status: 'Initiate' }));
  };

  const handleNavigateToMarket = (reagentQuery?: string) => {
    if (reagentQuery !== undefined) {
      setMarketSearchQuery(reagentQuery);
    }
    setActiveTab('marketplace');
  };

  const handleRestockPantry = (updatedPantry: PantryItem[], notice: string) => {
    setPantryItems(updatedPantry);

    // Auto-record restock log in chronicle
    const restockEntry: JournalEntry = {
      id: `jrn-restock-${Date.now()}`,
      user_id: profile.id,
      title: 'Apothecary Restock Order Received',
      formatted_body: `**Apothecary Supply Restock Fulfilled**\n\n${notice}\n\nPantry balances updated automatically under active lunar cycle.`,
      linked_pantry_ids: updatedPantry.slice(0, 3).map((p) => p.id),
      outcome_rating: 5,
      lunar_phase: currentLunar.phase,
      weather_conditions: 'Sanctum inventory restocked',
      created_at: new Date().toISOString()
    };
    setJournalEntries((prev) => [restockEntry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-obsidian-900 text-vellum-100 flex flex-col font-sans">
      {/* Panic / Discretion Camouflage Screen */}
      {isPanicActive && (
        <DiscretionCamouflage onDismiss={() => setIsPanicActive(false)} />
      )}

      {/* Top Header */}
      <header className="border-b border-obsidian-800 bg-obsidian-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-serif font-bold text-lg">
              🜚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black text-lg tracking-wider text-vellum-50">
                  ARCANA
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sage-950 text-sage-300 border border-sage-800/40">
                  v1.0.0
                </span>
              </div>
              <p className="text-[10px] text-vellum-200/50 hidden sm:block">
                Apothecary Inventory & Ritual Grimoire
              </p>
            </div>
          </div>

          {/* Lunar Phase Indicator & Discretion Button */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-gold-300/90 bg-obsidian-900 px-3 py-1.5 rounded-full border border-obsidian-800">
              <span>{getLunarPhaseGlyph(currentLunar.phase)}</span>
              <span>{currentLunar.phase}</span>
              <span className="text-vellum-200/40 text-[10px]">({currentLunar.illumination}%)</span>
            </div>

            <button
              onClick={() => setIsPanicActive(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/50 rounded-md text-xs font-semibold transition"
              title="Discretion Mode (Esc)"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discretion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-obsidian-800 bg-obsidian-900/90 px-4">
        <div className="max-w-6xl mx-auto flex overflow-x-auto no-scrollbar gap-1 text-xs">
          {[
            { id: 'pantry', label: 'Pantry (Supplies)', icon: Package },
            { id: 'archive', label: 'Archive (Spells)', icon: BookOpen },
            { id: 'marketplace', label: 'Market (Reagents)', icon: ShoppingBag },
            { id: 'chronicle', label: 'Chronicle (Notes)', icon: Feather },
            { id: 'coven', label: 'Coven (Exchange)', icon: Users },
            { id: 'sanctum', label: 'Sanctum (Profile)', icon: UserCircle },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 font-medium border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-gold-400 text-gold-400'
                    : 'border-transparent text-vellum-200/60 hover:text-vellum-100 hover:border-obsidian-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'pantry' && (
          <PantryModule
            items={pantryItems}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onNavigateToMarket={handleNavigateToMarket}
          />
        )}

        {activeTab === 'archive' && (
          <ArchiveModule
            recipes={recipes}
            pantryItems={pantryItems}
            onExecuteRecipe={handleExecuteRecipe}
            onNavigateToMarket={handleNavigateToMarket}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceModule
            pantryItems={pantryItems}
            onRestockPantry={handleRestockPantry}
            initialQuery={marketSearchQuery}
          />
        )}

        {activeTab === 'chronicle' && (
          <ChronicleModule
            entries={journalEntries}
            recipes={recipes}
            pantryItems={pantryItems}
            onAddEntry={handleAddJournalEntry}
            onNavigateToPantryItem={(_id) => setActiveTab('pantry')}
          />
        )}

        {activeTab === 'coven' && (
          <CovenModule
            profile={profile}
            barterListings={barterListings}
            onAddBarter={handleAddBarter}
            onVerifyWithToken={handleVerifyWithToken}
          />
        )}

        {activeTab === 'sanctum' && (
          <SanctumModule
            profile={profile}
            onUpdateProfile={setProfile}
            onTriggerPanic={() => setIsPanicActive(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-obsidian-800/80 py-4 px-4 text-center text-xs text-vellum-200/40">
        Arcana Ecosystem • Obsidian-Vellum Design Token Architecture • Zero-Telemetry Offline Mode
      </footer>
    </div>
  );
};
export default App;
