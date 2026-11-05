import React, { useState } from 'react';
import { BarterListing, ArcaneProfile } from '../../types';
import { validateInviteToken } from '../../utils/crypto';
import { KeyRound, ShieldCheck, MessageSquare, Plus, Lock, Globe } from 'lucide-react';

interface CovenModuleProps {
  profile: ArcaneProfile;
  barterListings: BarterListing[];
  onAddBarter: (listing: BarterListing) => void;
  onVerifyWithToken: (tokenId: string) => void;
}

export const CovenModule: React.FC<CovenModuleProps> = ({
  profile,
  barterListings,
  onAddBarter,
  onVerifyWithToken
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenSuccess, setTokenSuccess] = useState<string | null>(null);

  // New barter modal
  const [isAddBarterOpen, setIsAddBarterOpen] = useState(false);
  const [offeringItem, setOfferingItem] = useState('');
  const [offeringQty, setOfferingQty] = useState('');
  const [requestingItem, setRequestingItem] = useState('');
  const [circleVisibility, setCircleVisibility] = useState<'Public' | 'ApplicationOnly' | 'Hidden'>('Public');
  const [barterNotes, setBarterNotes] = useState('');

  // Active channel
  const [selectedCircle, setSelectedCircle] = useState<string>('All Circles');

  const isVerified = profile.verification_status !== 'Guest';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError(null);
    setTokenSuccess(null);

    // Mock redeem set
    const redeemedSet = new Set(['ARCANA-EXPIRED-NONCE-000']);
    const validation = validateInviteToken(tokenInput, redeemedSet);

    if (!validation.valid) {
      setTokenError(validation.reason || 'Verification failed.');
      return;
    }

    onVerifyWithToken(validation.token?.token_id || tokenInput);
    setTokenSuccess('Cryptographic Ed25519 token validated. Initiate clearance granted.');
    setTokenInput('');
  };

  const handleCreateBarter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeringItem.trim() || !requestingItem.trim()) return;

    const newListing: BarterListing = {
      id: `bar-${Date.now()}`,
      author_id: profile.id,
      author_arcane_name: profile.arcane_name,
      offering_item: offeringItem.trim(),
      offering_quantity: offeringQty.trim() || '1 standard lot',
      requesting_item: requestingItem.trim(),
      circle_visibility: circleVisibility,
      notes: barterNotes.trim() || undefined,
      created_at: new Date().toISOString()
    };

    onAddBarter(newListing);
    setOfferingItem('');
    setOfferingQty('');
    setRequestingItem('');
    setBarterNotes('');
    setIsAddBarterOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-gold-400">Coven Portal & Barter Conclave</h2>
          <p className="text-xs text-vellum-200/70">
            Encrypted community exchange, single-use Ed25519 onboarding, and non-monetary supply barters.
          </p>
        </div>

        {isVerified && (
          <button
            onClick={() => setIsAddBarterOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gold-500 hover:bg-gold-600 text-obsidian-900 font-semibold text-xs rounded-md shadow-xs transition"
          >
            <Plus className="w-4 h-4" /> Post Barter Offer
          </button>
        )}
      </div>

      {/* Verification Gate if Guest */}
      {!isVerified ? (
        <div className="p-6 bg-obsidian-800/90 border border-gold-500/30 rounded-xl max-w-lg mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-vellum-100">Invite-Only Access Gate</h3>
            <p className="text-xs text-vellum-200/70 mt-1">
              Arcana coven exchanges require an Ed25519 single-use cryptographic token issued by an active Circle Adept or Admin.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste Ed25519 invite token..."
              className="w-full px-3 py-2 text-xs bg-obsidian-900 border border-obsidian-700 rounded text-vellum-100 font-mono text-center focus:outline-hidden focus:border-gold-500"
            />
            {tokenError && <div className="text-xs text-rose-400">{tokenError}</div>}
            {tokenSuccess && <div className="text-xs text-emerald-400">{tokenSuccess}</div>}

            <button
              type="submit"
              className="w-full py-2 bg-gold-500 hover:bg-gold-600 text-obsidian-950 font-semibold text-xs rounded transition"
            >
              Verify Cryptographic Token
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Circle Channels & Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex gap-2">
              {['All Circles', 'Herbcraft & Alchemy', 'Astromancy', 'Threshold Protection'].map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCircle(c)}
                  className={`px-3 py-1.5 rounded transition ${
                    selectedCircle === c
                      ? 'bg-sage-600 text-vellum-100 font-medium'
                      : 'bg-obsidian-800 text-vellum-200/70 hover:bg-obsidian-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Clearance: {profile.verification_status}</span>
            </div>
          </div>

          {/* Barter Board Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {barterListings.map(item => (
              <div
                key={item.id}
                className="bg-obsidian-800/90 border border-obsidian-700/80 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-vellum-200/50 mb-2">
                    <span className="font-serif font-bold text-vellum-200">
                      {item.author_arcane_name}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {item.circle_visibility === 'Public' ? (
                        <Globe className="w-3 h-3 text-sage-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-amber-400" />
                      )}
                      {item.circle_visibility}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-obsidian-900/60 rounded border border-obsidian-700/50 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-gold-400/80 block">
                        Offering:
                      </span>
                      <p className="font-semibold text-vellum-100 mt-0.5">{item.offering_item}</p>
                      <span className="text-[10px] text-vellum-200/60 font-mono">Qty: {item.offering_quantity}</span>
                    </div>

                    <div className="border-l border-obsidian-700/60 pl-3">
                      <span className="text-[10px] uppercase font-semibold text-sage-400/80 block">
                        Seeking in Return:
                      </span>
                      <p className="font-semibold text-vellum-100 mt-0.5">{item.requesting_item}</p>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-vellum-200/70 mt-3 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-obsidian-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-vellum-200/40">
                    Listed {new Date(item.created_at).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => alert(`Initiating encrypted E2EE barter message channel with ${item.author_arcane_name}.`)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-obsidian-700 hover:bg-gold-500/20 text-vellum-100 hover:text-gold-300 border border-obsidian-600 rounded transition font-medium"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Barter Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Post Barter Modal */}
      {isAddBarterOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-gold-500/30 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-serif font-bold text-gold-400 mb-4">Post Reagent Barter Offer</h3>
            <form onSubmit={handleCreateBarter} className="space-y-4 text-xs">
              <div>
                <label className="block text-vellum-200/80 mb-1">What are you offering?</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50g Dried Mugwort, Star Anise"
                  value={offeringItem}
                  onChange={(e) => setOfferingItem(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100"
                />
              </div>

              <div>
                <label className="block text-vellum-200/80 mb-1">Offering Quantity / Lot Size</label>
                <input
                  type="text"
                  placeholder="e.g. 50g, 2 pieces, 100ml"
                  value={offeringQty}
                  onChange={(e) => setOfferingQty(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-vellum-200/80 mb-1">What are you seeking in return?</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raw Frankincense tears, Raven molts"
                  value={requestingItem}
                  onChange={(e) => setRequestingItem(e.target.value)}
                  className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100"
                />
              </div>

              <div>
                <label className="block text-vellum-200/80 mb-1">Circle Visibility</label>
                <select
                  value={circleVisibility}
                  onChange={(e) => setCircleVisibility(e.target.value as any)}
                  className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100"
                >
                  <option value="Public">Public (All verified initiates)</option>
                  <option value="ApplicationOnly">Application-Only</option>
                  <option value="Hidden">Hidden (Direct invitation only)</option>
                </select>
              </div>

              <div>
                <label className="block text-vellum-200/80 mb-1">Exchange Terms / Shipping Notes</label>
                <textarea
                  rows={2}
                  value={barterNotes}
                  onChange={(e) => setBarterNotes(e.target.value)}
                  placeholder="Postal exchange, dead-drop, regional delivery..."
                  className="w-full px-3 py-2 bg-obsidian-800 border border-obsidian-700 rounded text-vellum-100"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddBarterOpen(false)}
                  className="flex-1 py-2 rounded bg-obsidian-800 hover:bg-obsidian-700 text-vellum-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-gold-500 hover:bg-gold-600 text-obsidian-900 font-semibold"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
