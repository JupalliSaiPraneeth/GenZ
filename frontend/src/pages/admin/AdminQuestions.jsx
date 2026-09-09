import React, { useState } from 'react';
import { Search, HelpCircle, Layers, ChevronRight, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { OFFICIAL_75_QUESTIONS, SURVEY_SECTIONS } from '../../data/surveyQuestions';

export default function AdminQuestions() {
  const [selectedSection, setSelectedSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQs = OFFICIAL_75_QUESTIONS.filter((q) => {
    const matchesSec = selectedSection === 'all' || q.sectionId === selectedSection;
    const matchesQuery =
      q.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSec && matchesQuery;
  });

  return (
    <AdminLayout title="Questionnaire Structure & Question Explorer (75 Questions)">
      {/* SECTION TABS & SEARCH TOOLBAR */}
      <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-[#10242C] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#109A9B]" />
              Official 75-Question Study Blueprint
            </h2>
            <p className="text-xs text-[#53656A] font-medium">
              Filter questions by questionnaire section, scale type, and construct topic
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Q1-Q75 or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#109A9B]"
            />
          </div>
        </div>

        {/* CHAPTER SECTION BUTTONS */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          <button
            onClick={() => setSelectedSection('all')}
            className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
              selectedSection === 'all' ? 'bg-[#075D63] text-white shadow-sm' : 'bg-slate-100 text-[#53656A] hover:bg-slate-200'
            }`}
          >
            All Sections (75 Qs)
          </button>

          {SURVEY_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer shrink-0 ${
                selectedSection === sec.id ? 'bg-[#075D63] text-white shadow-sm' : 'bg-slate-100 text-[#53656A] hover:bg-slate-200'
              }`}
            >
              Sec {sec.number}: {sec.questionRange}
            </button>
          ))}
        </div>
      </div>

      {/* QUESTIONS GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQs.map((q) => {
          const isCategorical = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q8'].includes(q.id.toLowerCase());
          return (
            <div
              key={q.id}
              className="bg-white p-5 rounded-3xl border border-slate-200/90 hover:border-[#109A9B]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-extrabold text-[#075D63] bg-[#EAF6F6] px-2.5 py-0.5 rounded-full border border-[#109A9B]/20">
                    {q.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isCategorical
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isCategorical ? 'Categorical' : '5-Point Scale'}
                  </span>
                </div>

                <span className="text-[11px] font-bold text-[#53656A] block">{q.topic}</span>
                <h4 className="font-bold text-sm text-[#10242C] leading-snug">{q.text}</h4>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#53656A] font-semibold">
                <span>{q.options?.length || 5} Options Defined</span>
                <span className="text-[#075D63] font-bold flex items-center gap-0.5">
                  Inspect ➔
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
