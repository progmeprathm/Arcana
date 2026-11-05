import React, { useState } from 'react';
import { ArcaneProfile, ElementalAffinity, FocusItem } from '../../types';
import { Shield, Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface SanctumModuleProps {
  profile: ArcaneProfile;
  onUpdateProfile: (updated: ArcaneProfile) => void;
  onTriggerPanic: () => void;
}

export const SanctumModule: React.FC<SanctumModuleProps> = ({
  profile,
  onUpdateProfile,
  onTriggerPanic
}) => {
  const [arcaneName, setArcaneName] = useState(profile.arcane_name);
  const [tradition, setTradition] = useState(profile.tradition);
  const [focusItem, setFocusItem] = useState<FocusItem>(profile.focus_item);
  const [affinities, setAffinities] = useState<ElementalAffinity[]>(profile.affinities);
  const [isPublic, setIsPublic] = useState(profile.is_profile_public);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const toggleAffinity = (aff: ElementalAffinity) => {
    setAffinities(prev =>
      prev.includes(aff) ? prev.filter(a => a !== aff) : [...prev, aff]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      arcane_name: arcaneName.trim(),
      tradition: tradition.trim(),
      focus_item: focusItem,
      affinities,
      is_profile_public: isPublic
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-gold-400">Sanctum & Arcane Identity</h2>
          <p className="text-xs text-vellum-200/70">
            Personal tradition, elemental alignment, focus tools, and discretion controls.
          </p>
        </div>

        <button
          onClick={onTriggerPanic}
          className="flex items-center gap-2 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded text-xs font-semibold transition"
          title="Instant camouflage hotkey: ESC or double-tap"
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Discretion Panic Lock
        </button>
      </div>

      {isSavedNotice && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded text-emerald-300 text-xs">
          Arcane profile identity updated successfully.
        </div>
      )}

      {/* Discretion Mode info box */}
      <div className="p-4 bg-obsidian-800/80 border border-gold-500/20 rounded-lg text-xs space-y-2">
        <div className="flex items-center gap-2 text-gold-300 font-semibold">
          <Shield className="w-4 h-4" /> Discretion (Panic) Protocol
        </div>
        <p className="text-vellum-200/70">
          Double-click any empty canvas, press the Emergency button in the header, or trigger a device shake to instantly replace the entire UI with a benign enterprise spreadsheet in &lt;100ms.
        </p>
      </div>

      {/* Identity Form */}
      <form onSubmit={handleSave} className="bg-obsidian-800/90 border border-obsidian-700/80 rounded-lg p-6 space-y-5 text-xs shadow-md">
        <div>
          <label className="block text-vellum-200/80 mb-1 font-semibold">Arcane Pseudonym / Craft Name</label>
          <input
            type="text"
            required
            value={arcaneName}
            onChange={(e) => setArcaneName(e.target.value)}
            className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-700 rounded text-vellum-100 font-serif text-sm focus:outline-hidden focus:border-gold-500"
          />
        </div>

        <div>
          <label className="block text-vellum-200/80 mb-1 font-semibold">Magical Tradition / Lineage</label>
          <input
            type="text"
            required
            value={tradition}
            onChange={(e) => setTradition(e.target.value)}
            className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-700 rounded text-vellum-100 focus:outline-hidden focus:border-gold-500"
          />
        </div>

        <div>
          <label className="block text-vellum-200/80 mb-1 font-semibold">Primary Focus Tool</label>
          <select
            value={focusItem}
            onChange={(e) => setFocusItem(e.target.value as FocusItem)}
            className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-700 rounded text-vellum-100 focus:outline-hidden"
          >
            <option value="Athame">Athame (Ritual Blade)</option>
            <option value="Wand">Wand (Wood / Crystal)</option>
            <option value="Ring">Ring (Talismanic Band)</option>
            <option value="Chalice">Chalice (Water Vessel)</option>
            <option value="Pentacle">Pentacle (Grounding Disk)</option>
            <option value="Other">Other Primary Vessel</option>
          </select>
        </div>

        <div>
          <label className="block text-vellum-200/80 mb-2 font-semibold">Elemental Affinities</label>
          <div className="flex flex-wrap gap-2">
            {(['Earth', 'Air', 'Fire', 'Water', 'Aether'] as ElementalAffinity[]).map(aff => {
              const active = affinities.includes(aff);
              return (
                <button
                  type="button"
                  key={aff}
                  onClick={() => toggleAffinity(aff)}
                  className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition ${
                    active
                      ? 'bg-gold-500 text-obsidian-950 font-bold shadow-xs'
                      : 'bg-obsidian-900 text-vellum-200/60 border border-obsidian-700 hover:bg-obsidian-700'
                  }`}
                >
                  {aff}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-obsidian-700/60 flex items-center justify-between">
          <div>
            <span className="font-semibold text-vellum-100 block">Directory Visibility</span>
            <span className="text-[11px] text-vellum-200/50">Allow other verified initiates to discover your arcane pseudonym</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`p-2 rounded border transition ${
              isPublic
                ? 'bg-sage-600 border-sage-500 text-vellum-100'
                : 'bg-obsidian-900 border-obsidian-700 text-vellum-200/40'
            }`}
          >
            {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="pt-4 border-t border-obsidian-700/60 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-gold-500 hover:bg-gold-600 text-obsidian-900 font-semibold rounded text-xs transition"
          >
            Save Sanctum Profile
          </button>
        </div>
      </form>
    </div>
  );
};
