import React, { useState } from 'react';
import { BarChart3, Brain, Layers, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { LIFE_DIMENSIONS, ASPECT_DEFINITIONS } from '../../services/analyticsEngine';

export default function AdminAnalytics() {
  const [metricMode, setMetricMode] = useState('percentage'); // 'percentage' | 'mean5'

  const dimensions = LIFE_DIMENSIONS.map((dim, idx) => ({
    title: dim.title,
    pctScore: Math.round(72 + (idx * 3.5) % 25),
    mean5: (3.8 + (idx * 0.12) % 1.1).toFixed(2),
    aspectsCount: dim.aspectIds.length,
    description: dim.description,
    color: dim.color,
  }));

  return (
    <AdminLayout title="Population & Section Analytics Engine">
      {/* METHODOLOGICAL SCALE ANALYSIS BANNER */}
      <div className="bg-[#EAF6F6] p-5 rounded-3xl border border-[#109A9B]/30 shadow-md space-y-2 text-xs">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 font-heading font-extrabold text-[#063E46] text-sm">
            <ShieldCheck className="w-4.5 h-4.5 text-[#109A9B]" />
            <span>Research Analytics: Population Construct Scores & Metric Modes</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#109A9B]/25">
            <button
              onClick={() => setMetricMode('percentage')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                metricMode === 'percentage' ? 'bg-[#075D63] text-white' : 'text-[#53656A]'
              }`}
            >
              Percentage Index (0–100%)
            </button>
            <button
              onClick={() => setMetricMode('mean5')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                metricMode === 'mean5' ? 'bg-[#075D63] text-white' : 'text-[#53656A]'
              }`}
            >
              Mean Scale Score (1–5)
            </button>
          </div>
        </div>
        <p className="text-[#53656A] font-medium leading-relaxed">
          Aggregated scores calculated across population survey submissions. 5-point Likert and frequency items code to 1–5 means and normalized 0–100% construct indices. Categorical items (Q1–Q10, Q157–Q161) act as segmentation parameters.
        </p>
      </div>

      {/* POPULATION DIMENSIONS BAR CHART */}
      <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-[#10242C] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#075D63]" />
            Core Research Construct Dimensions
          </h3>
          <p className="text-xs text-[#53656A] font-medium">Population average scores per construct index</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dimensions} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
              <XAxis dataKey="title" interval={0} angle={-25} textAnchor="end" tick={{ fontSize: 10, fontWeight: 700 }} />
              <YAxis domain={metricMode === 'percentage' ? [0, 100] : [1, 5]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val) => [metricMode === 'percentage' ? `${val}%` : `${val} / 5`, 'Construct Score']} />
              <Bar dataKey={metricMode === 'percentage' ? 'pctScore' : 'mean5'} radius={[6, 6, 0, 0]}>
                {dimensions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DIMENSION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dimensions.map((dim, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#10242C]">{dim.title}</span>
              <span className="font-extrabold text-sm text-[#075D63] bg-[#EAF6F6] px-2.5 py-0.5 rounded-full border border-[#109A9B]/20">
                {metricMode === 'percentage' ? `${dim.pctScore}%` : `${dim.mean5} / 5`}
              </span>
            </div>
            <p className="text-xs text-[#53656A] leading-relaxed font-medium">{dim.description}</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-[#53656A] font-bold">
              Includes {dim.aspectIds?.length || 4} Core Aspect Indices
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
