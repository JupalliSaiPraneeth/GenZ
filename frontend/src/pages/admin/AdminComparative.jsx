import React, { useState } from 'react';
import { GitCompare, TrendingUp, Zap, ShieldCheck, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminComparative() {
  const [activeSubTab, setActiveSubTab] = useState('demographics'); // 'demographics' | 'correlations' | 'gaps'

  // Demographic comparison data
  const demographicMatrix = [
    { group: '18–20 Yrs', entrepreneurship: 78, financialInd: 84, aiAdoption: 88, marriagePriority: 55 },
    { group: '21–23 Yrs', entrepreneurship: 84, financialInd: 89, aiAdoption: 82, marriagePriority: 62 },
    { group: '24–26 Yrs', entrepreneurship: 75, financialInd: 91, aiAdoption: 76, marriagePriority: 71 },
    { group: 'Metropolitan', entrepreneurship: 85, financialInd: 91, aiAdoption: 91, marriagePriority: 54 },
    { group: 'Rural Area', entrepreneurship: 72, financialInd: 80, aiAdoption: 71, marriagePriority: 74 },
  ];

  // Correlation analysis pairs
  const correlationPairs = [
    { pair: 'Sleep Quality vs Mental Wellbeing', r: '+0.68', direction: 'Strong Positive Association', note: 'Higher sleep recovery correlates with higher stress coping.' },
    { pair: 'Social Media Use vs Study Consistency', r: '-0.52', direction: 'Moderate Negative Association', note: 'High screen time relates to lower exam prep discipline.' },
    { pair: 'AI Adoption Rate vs Career Self-Efficacy', r: '+0.64', direction: 'Strong Positive Association', note: 'Active AI usage correlates with high career marketability confidence.' },
    { pair: 'Financial Literacy vs Financial Independence', r: '+0.71', direction: 'Strong Positive Association', note: 'Early budgeting & saving knowledge aligns with income diversification drive.' },
    { pair: 'Risk Tolerance vs Entrepreneurial Drive', r: '+0.65', direction: 'Strong Positive Association', note: 'Comfort under uncertainty correlates strongly with venture interest.' },
  ];

  // Belief vs Behaviour Gaps
  const beliefBehaviourGaps = [
    { title: 'Physical Fitness Gap', belief: 'Believes fitness is vital for success (88%)', action: 'Maintains active weekly exercise routine (42%)', gapPct: 46 },
    { title: 'Food & Nutrition Gap', belief: 'Aware of healthy eating importance (84%)', action: 'Eats balanced nutritious meals daily (48%)', gapPct: 36 },
    { title: 'Digital Privacy Gap', belief: 'Concerned about data privacy & surveillance (91%)', action: 'Verifies privacy settings & 2FA regularly (52%)', gapPct: 39 },
    { title: 'Financial Independence Gap', belief: 'Aspirations for early financial freedom (94%)', action: 'Consistent monthly saving & investing (58%)', gapPct: 36 },
    { title: 'Skill Upskilling Gap', belief: 'Values continuous independent learning (89%)', action: 'Completes online certification courses (51%)', gapPct: 38 },
  ];

  return (
    <AdminLayout title="Comparative Analysis, Correlations & Action Gaps">
      {/* NAVIGATION SUB-TABS */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#109A9B]/20 shadow-md flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-[#10242C]">
            Cross-Segment Comparative Analytics
          </h2>
          <p className="text-xs text-[#53656A] font-semibold">
            Evaluate demographic segmentation, statistical associations, and intention-action gaps
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {[
            { id: 'demographics', label: 'Demographic Comparisons' },
            { id: 'correlations', label: 'Correlation Analysis' },
            { id: 'gaps', label: 'Belief vs. Behaviour Gaps' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-[#075D63] text-white shadow-xs'
                  : 'text-[#53656A] hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: DEMOGRAPHIC COMPARISONS */}
      {activeSubTab === 'demographics' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
          <h3 className="font-heading font-extrabold text-base text-[#10242C]">
            Cross-Demographic Benchmark Matrix
          </h3>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographicMatrix} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <XAxis dataKey="group" tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="entrepreneurship" fill="#075D63" name="Entrepreneurship (%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="financialInd" fill="#109A9B" name="Financial Independence (%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="aiAdoption" fill="#3B82F6" name="AI Adoption (%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="marriagePriority" fill="#FDE7B5" name="Marriage Priority (%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CORRELATION ANALYSIS */}
      {activeSubTab === 'correlations' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
          <div className="bg-[#EAF6F6] p-4 rounded-2xl border border-[#109A9B]/25 text-xs text-[#075D63] font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
            <span>Statistical Note: Correlations reflect statistical associations and do not imply direct causation.</span>
          </div>

          <div className="space-y-3">
            {correlationPairs.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-[#FAF7F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-[#10242C] block">{item.pair}</span>
                  <p className="text-[#53656A] font-medium">{item.note}</p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="font-mono font-extrabold text-base text-[#075D63] block">{item.r}</span>
                  <span className="font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {item.direction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BELIEF VS BEHAVIOUR GAPS */}
      {activeSubTab === 'gaps' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-5">
          <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D97706]" />
            Intention vs. Action Gap Analysis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beliefBehaviourGaps.map((gap, idx) => (
              <div key={idx} className="p-5 rounded-3xl border border-slate-200 bg-[#FFF8E8]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#10242C]">{gap.title}</h4>
                  <span className="font-mono font-extrabold text-xs text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {gap.gapPct}% Action Gap
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-semibold">
                  <div className="flex justify-between text-[#075D63]">
                    <span>Belief / Mindset:</span>
                    <span>{gap.belief}</span>
                  </div>
                  <div className="flex justify-between text-[#53656A]">
                    <span>Actual Action:</span>
                    <span>{gap.action}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
