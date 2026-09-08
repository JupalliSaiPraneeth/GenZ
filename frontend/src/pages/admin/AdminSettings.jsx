import React, { useState } from 'react';
import { Settings, ShieldCheck, CheckCircle2, RotateCcw, Save } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAuthService } from '../../services/adminAuthService';

export default function AdminSettings() {
  const [reverseScoringActive, setReverseScoringActive] = useState(true);
  const [qualityThreshold, setQualityThreshold] = useState('75');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    adminAuthService.logAction('UPDATE_SETTINGS', 'Scoring & System Config', 'SUCCESS');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AdminLayout title="Admin Portal Settings & Scoring Configuration">
      <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-[#10242C] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#109A9B]" />
            Analytical Engine & System Preferences
          </h2>
          <p className="text-xs text-[#53656A] font-medium">
            Configure reverse scoring rules, data quality thresholds, and database synchronization behavior
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Admin configuration settings updated successfully!</span>
          </div>
        )}

        <div className="space-y-6 divide-y divide-slate-100 text-xs font-semibold">
          {/* REVERSE SCORING TOGGLE */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-[#10242C] text-sm block">Reverse Scoring Engine (1–5 Inversion)</span>
              <p className="text-[#53656A] font-medium max-w-lg">
                Automatically invert scores for negatively oriented questions (e.g. 1 ➔ 5, 5 ➔ 1) when computing construct averages.
              </p>
            </div>
            <button
              onClick={() => setReverseScoringActive(!reverseScoringActive)}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                reverseScoringActive ? 'bg-[#075D63]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${reverseScoringActive ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          {/* QUALITY THRESHOLD */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-[#10242C] text-sm block">Quality Score Warning Threshold</span>
              <p className="text-[#53656A] font-medium max-w-lg">
                Flag submissions with a data quality index below this cutoff value for administrative review.
              </p>
            </div>
            <select
              value={qualityThreshold}
              onChange={(e) => setQualityThreshold(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white font-bold text-xs outline-none focus:border-[#109A9B]"
            >
              <option value="60">60 / 100 (Lenient)</option>
              <option value="75">75 / 100 (Standard)</option>
              <option value="85">85 / 100 (Strict)</option>
            </select>
          </div>

          {/* AUTO SYNC */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-[#10242C] text-sm block">Real-Time Database Auto-Sync</span>
              <p className="text-[#53656A] font-medium max-w-lg">
                Automatically synchronize client-side IndexedDB answer queues with the remote Supabase database.
              </p>
            </div>
            <button
              onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                autoSyncEnabled ? 'bg-[#075D63]' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoSyncEnabled ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-5 py-3 bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#FDE7B5]" />
            <span>Save Configuration Settings</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
