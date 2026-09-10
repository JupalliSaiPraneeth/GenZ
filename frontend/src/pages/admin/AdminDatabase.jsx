import React, { useState, useEffect } from 'react';
import { Database, Activity, CheckCircle2, RefreshCw, Server, Shield, Layers } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';
import { isSupabaseConfigured } from '../../services/supabaseClient';

export default function AdminDatabase() {
  const [stats, setStats] = useState(null);
  const [tableMetrics, setTableMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [kpiRes, metricsRes] = await Promise.all([
        adminDataService.getDashboardKPIs(),
        adminDataService.getDatabaseTableMetrics(),
      ]);
      setStats(kpiRes);
      setTableMetrics(metricsRes);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <AdminLayout title="Database Infrastructure & Real-Time Storage Monitor">
      {/* DB STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#53656A] font-bold uppercase block">Dexie IndexedDB (Local)</span>
            <h3 className="font-heading font-extrabold text-2xl text-[#10242C] mt-1">Active</h3>
            <span className="text-xs text-emerald-600 font-bold mt-0.5 block">Client Storage Queue Engine</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#53656A] font-bold uppercase block">Supabase Remote DB</span>
            <h3 className="font-heading font-extrabold text-2xl text-[#10242C] mt-1">
              {isSupabaseConfigured ? 'Connected' : 'Configured / Standby'}
            </h3>
            <span className="text-xs text-[#075D63] font-bold mt-0.5 block">PostgreSQL Cloud DB</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#EAF6F6] text-[#075D63] flex items-center justify-center border border-[#109A9B]/20">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#53656A] font-bold uppercase block">Total Stored Answers</span>
            <h3 className="font-heading font-extrabold text-2xl text-[#10242C] mt-1">
              {loading ? '...' : stats?.totalResponses}
            </h3>
            <span className="text-xs text-[#53656A] font-bold mt-0.5 block">Across Q1–Q75</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#FAF7F0] text-[#109A9B] flex items-center justify-center border border-slate-200">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* INFRASTRUCTURE HEALTH & SYNC STATUS */}
      <div className="bg-white rounded-3xl border border-[#109A9B]/20 shadow-md p-6 space-y-4">
        <div>
          <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#075D63]" />
            Database Table Schemas & Sync Metrics
          </h3>
          <p className="text-xs text-[#53656A] font-medium">Real-time table synchronization status</p>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="p-4 text-xs text-[#53656A] font-medium animate-pulse">Loading live Supabase DB table metrics...</div>
          ) : (
            tableMetrics.map((t, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-[#FAF7F0] flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="font-mono font-bold text-sm text-[#075D63] block">{t.table}</span>
                  <span className="text-[#53656A] text-[11px]">Storage Layer: {t.engine}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-[#10242C] block">{t.records} Records</span>
                    <span className="text-[10px] text-slate-400 font-mono">Latency: {t.latency}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    {t.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
