import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

interface DiscretionCamouflageProps {
  onDismiss: () => void;
}

export const DiscretionCamouflage: React.FC<DiscretionCamouflageProps> = ({ onDismiss }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1337 or 0000
    if (pin === '1337' || pin === '0000') {
      setError(false);
      onDismiss();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#F9F9FB] text-[#1E293B] font-sans overflow-auto select-none p-4 md:p-8"
      onDoubleClick={() => setShowPinDialog(true)}
    >
      {/* Top Corporate Nav */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-800">NovaLogix Enterprise Suite</h1>
            <p className="text-xs text-slate-500">Regional Supply Chain Q4 Reconciliation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            <CheckCircle2 className="w-3 h-3" /> Sync Active
          </span>
          <button 
            onClick={() => setShowPinDialog(true)}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 border border-slate-200 rounded"
            title="Double-click canvas or click here to authenticate"
          >
            Terminal Security Lock
          </button>
        </div>
      </div>

      {/* Camouflage Spreadsheet / Logistics Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-semibold text-slate-600 flex justify-between">
          <span>INVENTORY LEDGER — WAREHOUSE SECTOR 04B</span>
          <span>LAST UPDATED: 14 MINS AGO</span>
        </div>
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-2">SKU #</th>
              <th className="px-4 py-2">Component Description</th>
              <th className="px-4 py-2">Batch Lot</th>
              <th className="px-4 py-2">On-Hand Qty</th>
              <th className="px-4 py-2">Reorder Threshold</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-2 font-mono">NLX-9941-A</td>
              <td className="px-4 py-2 font-medium text-slate-800">Cellulose Packing Binder v2</td>
              <td className="px-4 py-2">LOT-2026-X11</td>
              <td className="px-4 py-2">45.0 kg</td>
              <td className="px-4 py-2">15.0 kg</td>
              <td className="px-4 py-2 text-emerald-600 font-medium">Optimal</td>
            </tr>
            <tr className="bg-amber-50/40">
              <td className="px-4 py-2 font-mono">NLX-4420-C</td>
              <td className="px-4 py-2 font-medium text-slate-800">Organic Oleoresin Adhesive Compound</td>
              <td className="px-4 py-2">LOT-2026-R08</td>
              <td className="px-4 py-2">8.0 kg</td>
              <td className="px-4 py-2">10.0 kg</td>
              <td className="px-4 py-2 text-amber-600 font-medium">Reorder Warning</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">NLX-1029-M</td>
              <td className="px-4 py-2 font-medium text-slate-800">Silica Granulate Absorbent Units</td>
              <td className="px-4 py-2">LOT-2026-S05</td>
              <td className="px-4 py-2">4 units</td>
              <td className="px-4 py-2">2 units</td>
              <td className="px-4 py-2 text-emerald-600 font-medium">Optimal</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">NLX-8802-T</td>
              <td className="px-4 py-2 font-medium text-slate-800">Heavy Cast Ceramic Vessel Holder</td>
              <td className="px-4 py-2">LOT-2025-H01</td>
              <td className="px-4 py-2">1 unit</td>
              <td className="px-4 py-2">1 unit</td>
              <td className="px-4 py-2 text-slate-600">Stable</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-slate-400 text-center">
        Double-click anywhere to unlock workspace • Confidential Enterprise Record
      </div>

      {/* Unlock Dialog */}
      {showPinDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-xs w-full shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-800 mb-2">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-sm">Security Verification</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your access passkey to resume Arcana workspace session (Default: 1337).
            </p>
            <form onSubmit={handleUnlock}>
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Passkey"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-center tracking-widest font-mono mb-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {error && (
                <div className="text-[11px] text-rose-500 mb-2 text-center">
                  Invalid security passkey.
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinDialog(false)}
                  className="flex-1 py-1.5 text-xs text-slate-600 bg-slate-100 rounded hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 font-medium"
                >
                  Resume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
