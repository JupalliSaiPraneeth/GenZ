import React from 'react';
import {
  Users,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Gift,
  Activity,
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-8 bg-[#FFF8E8]">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#109A9B]/15 pb-6">
        <div>
          {/* COMBO 04 Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#063E46] text-white font-mono text-xs font-bold shadow-md">
            <span className="text-[#FDE7B5]">COMBO 04</span>
            <span className="text-white/40">•</span>
            <span className="text-[#109A9B]">Hex → #109A9B & #FDE7B5</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-[#10242C] mt-2">
            Research Intelligence Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live System Active
          </span>
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#53656A] font-bold uppercase">Total Participants</span>
            <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">12,480</h3>
            <span className="text-xs text-emerald-600 font-bold">+18% this week</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EAF6F6] text-[#075D63] flex items-center justify-center border border-[#109A9B]/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#53656A] font-bold uppercase">Completed Surveys</span>
            <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">10,920</h3>
            <span className="text-xs text-[#53656A] font-bold">87.5% completion rate</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#53656A] font-bold uppercase">Avg Quality Score</span>
            <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">94 / 100</h3>
            <span className="text-xs text-emerald-600 font-bold">Research-Grade</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EAF6F6] text-[#109A9B] flex items-center justify-center border border-[#109A9B]/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#53656A] font-bold uppercase">Flagged Risk Score</span>
            <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">1.2%</h3>
            <span className="text-xs text-[#53656A] font-bold">134 total flagged</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF4E1] text-amber-700 flex items-center justify-center border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* DASHBOARD SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Quality Engine Monitoring */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-lg text-[#10242C] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#075D63]" />
              Recent Data Quality Checks
            </h3>
            <span className="text-xs text-[#53656A] font-mono">Auto-scoring active</span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'S-9021', duration: '18m 12s', quality: '96 / 100', status: 'Excellent', risk: 'Low' },
              { id: 'S-9022', duration: '16m 45s', quality: '92 / 100', status: 'Good', risk: 'Low' },
              { id: 'S-9023', duration: '3m 10s', quality: '42 / 100', status: 'Review Required', risk: 'High' },
              { id: 'S-9024', duration: '21m 05s', quality: '98 / 100', status: 'Excellent', risk: 'Low' },
            ].map((row, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-[#FFF8E8]/50 flex items-center justify-between text-sm">
                <div>
                  <span className="font-mono font-bold text-[#10242C]">{row.id}</span>
                  <span className="text-xs text-[#53656A] block">Duration: {row.duration}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#10242C] block">{row.quality}</span>
                  <span className={`text-xs font-semibold ${row.risk === 'High' ? 'text-red-500' : 'text-emerald-600'}`}>
                    {row.status} ({row.risk} Risk)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-[#075D63] text-[#FFF8E8] p-6 rounded-3xl border border-[#063E46] space-y-6">
          <h3 className="font-heading font-bold text-lg text-[#FDE7B5] flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Lucky Draw Management
          </h3>
          <p className="text-[#FFF8E8]/80 text-xs leading-relaxed font-medium">
            Run cryptographically verifiable winner selections from validated responses.
          </p>

          <button
            onClick={() => alert('Executing cryptographically verifiable lucky draw batch... Winner ID: S-9024 selected!')}
            className="bg-[#FDE7B5] hover:bg-white text-[#075D63] font-bold text-sm w-full py-3.5 rounded-2xl shadow-md transition-all"
          >
            <span>Execute Lucky Draw Batch</span>
          </button>

          <div className="pt-4 border-t border-white/10 text-xs text-[#FFF8E8]/70 space-y-2 font-medium">
            <div className="flex justify-between">
              <span>Eligible Entries:</span>
              <strong className="text-white font-mono">10,786</strong>
            </div>
            <div className="flex justify-between">
              <span>Draw Batch:</span>
              <strong className="text-white font-mono">SEPT_2026_BATCH_01</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
