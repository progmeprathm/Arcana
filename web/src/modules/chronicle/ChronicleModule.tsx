import React, { useState } from 'react';
import { JournalEntry, SpellRecipe, PantryItem } from '../../types';
import { calculateLunarPhase, getLunarPhaseGlyph } from '../../utils/lunar';
import { Camera, Sparkles, Star, Link2, Plus, Calendar, CloudSun } from 'lucide-react';

interface ChronicleModuleProps {
  entries: JournalEntry[];
  recipes: SpellRecipe[];
  pantryItems: PantryItem[];
  onAddEntry: (entry: JournalEntry) => void;
  onNavigateToPantryItem: (itemId: string) => void;
}

export const ChronicleModule: React.FC<ChronicleModuleProps> = ({
  entries,
  recipes,
  pantryItems,
  onAddEntry,
  onNavigateToPantryItem
}) => {
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [formattedBody, setFormattedBody] = useState('');
  const [rawOcrText, setRawOcrText] = useState('');
  const [linkedSpellId, setLinkedSpellId] = useState<string>('');
  const [linkedPantryIds, setLinkedPantryIds] = useState<string[]>([]);
  const [outcomeRating, setOutcomeRating] = useState<number>(5);
  const [weatherConditions, setWeatherConditions] = useState('Clear dusk, 14°C, calm air');

  const currentLunar = calculateLunarPhase();

  // OCR simulation for cursive / manuscript scan
  const handleSimulateOcr = () => {
    setIsOcrProcessing(true);
    setTimeout(() => {
      const simulatedRaw = "Mugwort infusion prepared at 21:00 under gibbous moon. Heated cast iron mortar gently. Smoke dense, clear astral focus achieved. No deviations observed.";
      setRawOcrText(simulatedRaw);
      setFormattedBody(`### Transcribed Manuscript Record\n\n${simulatedRaw}\n\n*Extracted via Arcana Neural Multimodal OCR (Confidence: 94.2%)*`);
      setTitle("Transcribed Grimoire Fragment #" + Math.floor(Math.random() * 900 + 100));
      setIsOcrProcessing(false);
    }, 1200);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !formattedBody.trim()) return;

    const newEntry: JournalEntry = {
      id: `jrn-${Date.now()}`,
      user_id: 'usr-rowan',
      title: title.trim(),
      raw_ocr_text: rawOcrText.trim() || undefined,
      formatted_body: formattedBody.trim(),
      linked_spell_id: linkedSpellId || undefined,
      linked_pantry_ids: linkedPantryIds,
      outcome_rating: outcomeRating,
      lunar_phase: currentLunar.phase,
      weather_conditions: weatherConditions.trim(),
      created_at: new Date().toISOString()
    };

    onAddEntry(newEntry);
    setTitle('');
    setFormattedBody('');
    setRawOcrText('');
    setLinkedSpellId('');
    setLinkedPantryIds([]);
    setIsNewEntryOpen(false);
  };

  const togglePantryLink = (id: string) => {
    setLinkedPantryIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-gold-400">Chronicle & Grimoire Transcriptions</h2>
          <p className="text-xs text-vellum-200/70">
            Multimodal OCR transcription of handwritten journals, relational reagent linking, and outcome efficacy.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsNewEntryOpen(true);
              handleSimulateOcr();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-obsidian-800 hover:bg-obsidian-700 border border-gold-500/30 text-gold-400 text-xs rounded-md font-medium transition"
          >
            <Camera className="w-3.5 h-3.5" /> Scan Parchment (OCR)
          </button>
          <button
            onClick={() => setIsNewEntryOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gold-500 hover:bg-gold-600 text-obsidian-900 font-semibold text-xs rounded-md shadow-xs transition"
          >
            <Plus className="w-4 h-4" /> New Entry
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {entries.map(entry => {
          const linkedSpell = recipes.find(r => r.id === entry.linked_spell_id);
          const linkedSupplies = pantryItems.filter(p => entry.linked_pantry_ids.includes(p.id));

          return (
            <div
              key={entry.id}
              className="bg-obsidian-800/90 border border-obsidian-700/80 rounded-lg p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-vellum-100">{entry.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-vellum-200/60 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold-400" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                    {entry.lunar_phase && (
                      <span>
                        {getLunarPhaseGlyph(entry.lunar_phase as any)} {entry.lunar_phase}
                      </span>
                    )}
                    {entry.weather_conditions && (
                      <span className="flex items-center gap-1">
                        <CloudSun className="w-3 h-3 text-sage-400" /> {entry.weather_conditions}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= entry.outcome_rating ? 'text-gold-400 fill-gold-400' : 'text-obsidian-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="text-xs text-vellum-200 whitespace-pre-line bg-obsidian-900/50 p-3 rounded border border-obsidian-800">
                {entry.formatted_body}
              </div>

              {entry.raw_ocr_text && (
                <div className="text-[11px] text-vellum-200/50 bg-obsidian-950 p-2 rounded border border-obsidian-800 font-mono">
                  <span className="text-gold-400/80 uppercase text-[9px] block mb-0.5 font-sans font-semibold">Raw OCR Transcript:</span>
                  {entry.raw_ocr_text}
                </div>
              )}

              {/* Relational Links */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-obsidian-700/40 text-xs">
                <span className="text-[10px] uppercase font-semibold text-vellum-200/40 flex items-center gap-1">
                  <Link2 className="w-3 h-3" /> Relational Links:
                </span>

                {linkedSpell && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sage-950/60 text-sage-300 border border-sage-800/40 text-[11px]">
                    <Sparkles className="w-3 h-3" /> Spell: {linkedSpell.name}
                  </span>
                )}

                {linkedSupplies.map(sup => (
                  <button
                    key={sup.id}
                    onClick={() => onNavigateToPantryItem(sup.id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-obsidian-700 hover:bg-gold-500/20 text-vellum-200 hover:text-gold-300 border border-obsidian-600/50 text-[11px] transition"
                  >
                    🌿 {sup.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Entry Modal */}
      {isNewEntryOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-gold-500/30 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-base font-serif font-bold text-gold-400 mb-4">Inscribe Chronicle Entry</h3>
            
            {isOcrProcessing && (
              <div className="mb-4 p-3 bg-gold-500/10 border border-gold-500/30 rounded text-gold-300 text-xs flex items-center gap-2 animate-pulse">
                <Camera className="w-4 h-4 animate-spin" /> Processing ink contrast, stroke curves, and cursive morphology...
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-vellum-200/80 mb-1">Entry Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Solstice Consecration"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100 focus:outline-hidden focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-vellum-200/80 mb-1">Ritual Body / Observations (Markdown supported)</label>
                <textarea
                  rows={4}
                  required
                  value={formattedBody}
                  onChange={(e) => setFormattedBody(e.target.value)}
                  placeholder="Record experimental outcomes, sensory impressions, timing..."
                  className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-vellum-200/80 mb-1">Linked Spell / Rite</label>
                  <select
                    value={linkedSpellId}
                    onChange={(e) => setLinkedSpellId(e.target.value)}
                    className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100 focus:outline-hidden"
                  >
                    <option value="">None (Independent Note)</option>
                    {recipes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-vellum-200/80 mb-1">Outcome Efficacy Rating</label>
                  <select
                    value={outcomeRating}
                    onChange={(e) => setOutcomeRating(parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100"
                  >
                    <option value="5">★★★★★ Exceptional (5/5)</option>
                    <option value="4">★★★★☆ Solid Success (4/5)</option>
                    <option value="3">★★★☆☆ Moderate / Subtle (3/5)</option>
                    <option value="2">★★☆☆☆ Weak Reaction (2/5)</option>
                    <option value="1">★☆☆☆☆ Ineffective / Misfire (1/5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-vellum-200/80 mb-1">Link Associated Reagents (from Pantry)</label>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-obsidian-800 rounded border border-obsidian-700">
                  {pantryItems.map(p => {
                    const isSelected = linkedPantryIds.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => togglePantryLink(p.id)}
                        className={`px-2 py-1 rounded text-[11px] transition ${
                          isSelected
                            ? 'bg-gold-500 text-obsidian-950 font-semibold'
                            : 'bg-obsidian-700 text-vellum-200/70 hover:bg-obsidian-600'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-vellum-200/80 mb-1">Environmental / Weather Notes</label>
                <input
                  type="text"
                  value={weatherConditions}
                  onChange={(e) => setWeatherConditions(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewEntryOpen(false)}
                  className="flex-1 py-2 rounded bg-obsidian-800 hover:bg-obsidian-700 text-vellum-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-gold-500 hover:bg-gold-600 text-obsidian-900 font-semibold"
                >
                  Inscribe Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
