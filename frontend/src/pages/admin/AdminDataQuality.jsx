import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Activity, FileCheck } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';

export default function AdminDataQuality() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await adminDataService.getDataQualityMetrics();
      setMetrics(res);
      setLoading(false);
    }
    loadData();
  }, []);

  const qualityLogs = metrics?.qualityLogs || [];

  return (
    <AdminLayout title="Data Quality & Integrity Engine">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md">
          <span className="text-[11px] text-[#53656A] font-bold uppercase block">Total Verified Records</span>
          <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">
            {loading ? '...' : metrics?.totalVerifiedRecords}
          </h3>
          <span className="text-xs text-emerald-600 font-bold mt-0.5 block">
            {loading ? '...' : metrics?.validDataPct}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md">
          <span className="text-[11px] text-[#53656A] font-bold uppercase block">Records Requiring Review</span>
          <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">
            {loading ? '...' : metrics?.reviewRequiredCount}
          </h3>
          <span className="text-xs text-amber-700 font-bold mt-0.5 block">
            {loading ? '...' : metrics?.riskFlaggedPct}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md">
          <span className="text-[11px] text-[#53656A] font-bold uppercase block">Avg Completion Speed</span>
          <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">
            {loading ? '...' : metrics?.avgCompletionSpeed}
          </h3>
          <span className="text-xs text-emerald-600 font-bold mt-0.5 block">Optimal Attention Span</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md">
          <span className="text-[11px] text-[#53656A] font-bold uppercase block">Straight-Line Rate</span>
          <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">
            {loading ? '...' : metrics?.straightLineRate}
          </h3>
          <span className="text-xs text-emerald-600 font-bold mt-0.5 block">Low Variance Anomaly</span>
        </div>
      </div>

      {/* RECENT QUALITY CHECKS TABLE */}
      <div className="bg-white rounded-3xl border border-[#109A9B]/20 shadow-md p-6 space-y-4">
        <div>
          <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#109A9B]" />
            Real-Time Data Quality Log Stream
          </h3>
          <p className="text-xs text-[#53656A] font-medium">Automatic pattern verification and anomaly flagging</p>
        </div>

        <div className="space-y-3">
          {qualityLogs.map((row, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-[#FAF7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
              <div className="space-y-1">
                <span className="font-mono font-extrabold text-sm text-[#075D63]">{row.id}</span>
                <span className="text-[#53656A] block">Duration: {row.duration} • Speed: {row.speedFlag}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block font-bold text-[#10242C]">Straight-Line: {row.straightLine}</span>
                  <span className="text-[11px] text-slate-500 block">Attention: {row.attentionCheck}</span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    row.riskLevel === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {row.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
