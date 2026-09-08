import React, { useState, useEffect } from 'react';
import { Search, HelpCircle, BarChart2, CheckCircle2, PieChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { OFFICIAL_207_QUESTIONS } from '../../data/surveyQuestions';
import { adminDataService } from '../../services/adminDataService';

export default function AdminResponses() {
  const [selectedQId, setSelectedQId] = useState('q1');
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadDist() {
      const res = await adminDataService.getQuestionDistribution(selectedQId);
      setData(res);
    }
    loadDist();
  }, [selectedQId]);

  const filteredQs = OFFICIAL_207_QUESTIONS.filter(
    (q) =>
      q.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colors = ['#075D63', '#109A9B', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#10B981'];

  return (
    <AdminLayout title="All Responses Explorer (Q1 – Q207)">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: QUESTION SELECTOR */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4 max-h-[620px] flex flex-col">
          <div className="space-y-2">
            <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#109A9B]" />
              Select Question (207 Total)
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Q1-Q207 or keyword..."
                className="w-full pl-9 pr-3 py-2 rounded-2xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#109A9B]"
              />
            </div>
          </div>

          <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 scrollbar-thin">
            {filteredQs.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedQId(q.id)}
                className={`w-full text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                  selectedQId === q.id
                    ? 'bg-[#075D63] text-white border-[#075D63] font-bold shadow-md'
                    : 'bg-white hover:bg-slate-50 text-[#10242C] border-slate-200 font-medium'
                }`}
              >
                <div className="font-mono text-[10px] opacity-80">{q.code} • {q.topic}</div>
                <div className="truncate font-semibold mt-0.5">{q.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED DISTRIBUTION ANALYTICS */}
        <div className="lg:col-span-8 space-y-6">
          {data && (
            <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
              <div className="pb-4 border-b border-slate-100 space-y-1">
                <span className="font-mono text-xs font-bold text-[#075D63] bg-[#EAF6F6] px-3 py-0.5 rounded-full border border-[#109A9B]/20">
                  {data.question.code} • {data.question.topic}
                </span>
                <h2 className="font-heading font-extrabold text-xl text-[#10242C] pt-1 leading-snug">
                  {data.question.text}
                </h2>
              </div>

              {/* STATISTICAL METRICS ROW */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-slate-200">
                  <span className="text-[#53656A] uppercase text-[10px] block font-bold">Total Responses</span>
                  <span className="font-extrabold text-lg text-[#10242C]">{data.totalResponses}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-slate-200">
                  <span className="text-[#53656A] uppercase text-[10px] block font-bold">Mean Score</span>
                  <span className="font-extrabold text-lg text-[#075D63]">{data.mean}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-slate-200">
                  <span className="text-[#53656A] uppercase text-[10px] block font-bold">Median Choice</span>
                  <span className="font-extrabold text-base text-[#109A9B] truncate block">{data.median}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-slate-200">
                  <span className="text-[#53656A] uppercase text-[10px] block font-bold">Mode (Dominant)</span>
                  <span className="font-extrabold text-base text-emerald-700 truncate block">{data.mode}</span>
                </div>
              </div>

              {/* DISTRIBUTION BAR CHART */}
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#10242C] uppercase tracking-wider">
                  Option Selection Percentage Distribution (%)
                </h3>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.distribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <XAxis dataKey="label" interval={0} tick={{ fontSize: 10, fontWeight: 700 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val, name, props) => [`${val}% (${props.payload.count} votes)`, 'Distribution']} />
                      <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                        {data.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DISTRIBUTION BREAKDOWN TABLE */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {data.distribution.map((opt, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#FAF7F0] border border-slate-200 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: colors[idx % colors.length] }} />
                      <span className="font-bold text-[#10242C]">{opt.label}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#53656A]">{opt.count} votes</span>
                      <span className="font-extrabold text-sm text-[#075D63] bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                        {opt.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
