import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart2, Sparkles, TrendingUp, Cpu, Database, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useSurveyStore } from '../stores/surveyStore';
import { db } from '../services/db';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export default function Analytics() {
  const { answersById } = useSurveyStore();
  const [dbResponses, setDbResponses] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Fetch real database records from Dexie IndexedDB and Supabase DB
  useEffect(() => {
    async function fetchRealDatabaseAnswers() {
      setLoadingDb(true);
      const combinedRecords = [];

      // 1. Fetch from Dexie IndexedDB local database
      try {
        const localDbAnswers = await db.answersQueue.toArray();
        if (localDbAnswers && localDbAnswers.length > 0) {
          localDbAnswers.forEach((item) => {
            const val = typeof item.responseValue === 'object' ? item.responseValue?.value : item.responseValue;
            combinedRecords.push({
              sessionId: item.sessionId,
              questionId: String(item.questionId).toLowerCase(),
              value: val,
            });
          });
        }
      } catch (err) {
        console.warn('Dexie DB query notice:', err);
      }

      // 2. Fetch from Supabase database if configured
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('survey_responses')
            .select('session_id, question_id, response_value');

          if (data && data.length > 0) {
            data.forEach((item) => {
              const val = typeof item.response_value === 'object' ? item.response_value?.value : item.response_value;
              combinedRecords.push({
                sessionId: item.session_id,
                questionId: String(item.question_id).toLowerCase(),
                value: val,
              });
            });
          }
        } catch (err) {
          console.warn('Supabase DB query notice:', err);
        }
      }

      // 3. Include active in-memory session answers
      const activeSessionId = localStorage.getItem('genz_active_session') || 'active_session';
      Object.entries(answersById).forEach(([qId, val]) => {
        combinedRecords.push({
          sessionId: activeSessionId,
          questionId: String(qId).toLowerCase(),
          value: typeof val === 'object' ? val?.value : val,
        });
      });

      // Deduplicate by sessionId + questionId
      const uniqueMap = new Map();
      combinedRecords.forEach((rec) => {
        uniqueMap.set(`${rec.sessionId}_${rec.questionId}`, rec);
      });

      setDbResponses(Array.from(uniqueMap.values()));
      setLoadingDb(false);
    }

    fetchRealDatabaseAnswers();
  }, [answersById]);

  // Compute analytics strictly based on database responses
  const {
    uniqueParticipantsCount,
    totalResponseEntriesCount,
    workPreferenceData,
    aiAdoptionData,
    aiInsightText,
    hasRealData,
  } = useMemo(() => {
    if (!dbResponses || dbResponses.length === 0) {
      return {
        uniqueParticipantsCount: 0,
        totalResponseEntriesCount: 0,
        workPreferenceData: [
          { name: 'Work-Life Balance', value: 0 },
          { name: 'Compensation', value: 0 },
          { name: 'Fast Career Growth', value: 0 },
          { name: 'Purpose & Impact', value: 0 },
        ],
        aiAdoptionData: [
          { name: 'Daily', value: 0, color: '#109A9B' },
          { name: 'Weekly', value: 0, color: '#075D63' },
          { name: 'Occasionally', value: 0, color: '#FDE7B5' },
          { name: 'Never', value: 0, color: '#53656A' },
        ],
        aiInsightText: 'No database responses recorded yet. Take the 207-question survey to store participant responses into the database and generate live insights.',
        hasRealData: false,
      };
    }

    const uniqueSessions = new Set(dbResponses.map((r) => r.sessionId)).size;
    const totalEntries = dbResponses.length;

    // Helper to calculate % of positive responses (agree / strongly_agree) for a specific question
    const calcPercentageForQuestion = (qId) => {
      const answersForQ = dbResponses.filter((r) => r.questionId === qId.toLowerCase());
      if (answersForQ.length === 0) return 0;
      const positiveCount = answersForQ.filter((r) =>
        ['strongly_agree', 'agree', 'very_often', 'often', 'corporate', 'startup', 'growth'].includes(r.value)
      ).length;
      return Math.round((positiveCount / answersForQ.length) * 100);
    };

    // Calculate Work Factors directly from Q78 (Work-Life), Q77 (Compensation), Q80 (Growth), Q125 (Purpose)
    const workLifePct = calcPercentageForQuestion('q78');
    const compPct = calcPercentageForQuestion('q77');
    const growthPct = calcPercentageForQuestion('q80');
    const purposePct = calcPercentageForQuestion('q125');

    // Calculate AI Usage directly from Q121
    const q121Answers = dbResponses.filter((r) => r.questionId === 'q121');
    let aiDailyPct = 0, aiWeeklyPct = 0, aiOccasionPct = 0, aiNeverPct = 0;

    if (q121Answers.length > 0) {
      const dailyCount = q121Answers.filter((r) => ['very_often', 'often'].includes(r.value)).length;
      const weeklyCount = q121Answers.filter((r) => r.value === 'sometimes').length;
      const occasionCount = q121Answers.filter((r) => r.value === 'rarely').length;
      const neverCount = q121Answers.filter((r) => r.value === 'never').length;

      aiDailyPct = Math.round((dailyCount / q121Answers.length) * 100);
      aiWeeklyPct = Math.round((weeklyCount / q121Answers.length) * 100);
      aiOccasionPct = Math.round((occasionCount / q121Answers.length) * 100);
      aiNeverPct = Math.round((neverCount / q121Answers.length) * 100);
    }

    const workData = [
      { name: 'Work-Life Balance', value: workLifePct },
      { name: 'Compensation', value: compPct },
      { name: 'Fast Career Growth', value: growthPct },
      { name: 'Purpose & Impact', value: purposePct },
    ];

    const aiData = [
      { name: 'Daily', value: aiDailyPct, color: '#109A9B' },
      { name: 'Weekly', value: aiWeeklyPct, color: '#075D63' },
      { name: 'Occasionally', value: aiOccasionPct, color: '#FDE7B5' },
      { name: 'Never', value: aiNeverPct, color: '#53656A' },
    ];

    const topFactor = [...workData].sort((a, b) => b.value - a.value)[0];
    const insightStr = `Statistical analysis of database records across ${uniqueSessions} participant session(s) indicates that ${topFactor.name} (${topFactor.value}%) is the primary career priority. Daily Generative AI adoption stands at ${aiDailyPct}% based on responses to Q121 in the database.`;

    return {
      uniqueParticipantsCount: uniqueSessions,
      totalResponseEntriesCount: totalEntries,
      workPreferenceData: workData,
      aiAdoptionData: aiData,
      aiInsightText: insightStr,
      hasRealData: true,
    };
  }, [dbResponses]);

  return (
    <div className="pt-[105px] sm:pt-[130px] md:pt-[160px] pb-16 sm:pb-24 px-3 sm:px-6 max-w-7xl mx-auto space-y-6 sm:space-y-10 bg-[#FAF7F0] min-h-screen w-full overflow-y-auto">

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto px-2">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white border border-[#109A9B]/40 text-[#075D63] font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4 shadow-xs">
          <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#109A9B]" />
          <span>Real Database Response Engine</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#10242C] tracking-tight mb-3">
          Gen Z Research Intelligence
        </h1>
        <p className="text-[#53656A] text-sm sm:text-base font-medium leading-relaxed">
          Analytics calculated strictly from response records stored in the database (IndexedDB local database & Supabase).
        </p>

        {/* Database Live Counter Status */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-[#EAF6F6] border border-[#109A9B]/30 text-[#075D63] text-[11px] sm:text-xs font-bold shadow-2xs max-w-full text-left sm:text-center">
          {loadingDb ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#109A9B] shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#109A9B] shrink-0" />
          )}
          <span>
            Database Records: {uniqueParticipantsCount} Session(s) • {totalResponseEntriesCount} Answers Saved
          </span>
        </div>
      </div>

      {/* AI RESEARCH INSIGHT CARD */}
      <div className="bg-[#075D63] text-white p-5 sm:p-8 rounded-3xl border border-[#063E46] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#109A9B]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-[#FDE7B5] font-bold text-[11px] sm:text-xs uppercase tracking-widest">
            <Cpu className="w-4 h-4" />
            <span>Database Intelligence Generator</span>
          </div>

          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#FFF8E8]">
            Key Trend: Real Database Analysis
          </h3>

          <p className="text-[#FFF8E8]/90 text-xs sm:text-base leading-relaxed max-w-4xl font-medium">
            "{aiInsightText}"
          </p>

          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#FDE7B5] font-semibold">
            <span>Data Source: Database (IndexedDB & Supabase)</span>
            <span>Sample Size: {uniqueParticipantsCount} Unique Session(s)</span>
          </div>
        </div>
      </div>

      {/* Empty Database State Notice if 0 responses */}
      {!hasRealData && !loadingDb && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6 text-center max-w-2xl mx-auto shadow-xs">
          <Database className="w-7 h-7 text-amber-600 mx-auto mb-2" />
          <h4 className="font-bold text-[#10242C] text-base mb-1">No Database Responses Found Yet</h4>
          <p className="text-xs text-[#53656A] font-medium leading-relaxed mb-4">
            The database currently has 0 participant submissions recorded. Take the 207-question survey to store your answers into the database and generate live real-time analytics!
          </p>
          <a
            href="/survey"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#063E46] hover:bg-[#075D63] text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Take Survey Now
          </a>
        </div>
      )}

      {/* VISUAL CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

        {/* Chart 1: Employer Selection Priority */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#109A9B]/20 shadow-sm">
          <h3 className="font-heading font-bold text-base sm:text-lg text-[#10242C] mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#075D63]" />
            Top Factors in Employer Selection (%)
          </h3>
          <p className="text-xs text-[#53656A] mb-4 sm:mb-6 font-medium">
            Calculated from database records for Q77, Q78, Q80, Q125.
          </p>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workPreferenceData} layout="vertical" margin={{ left: 0, right: 15 }}>
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={95} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Database Preference']} />
                <Bar dataKey="value" fill="#075D63" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: AI Tool Daily Adoption */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#109A9B]/20 shadow-sm">
          <h3 className="font-heading font-bold text-base sm:text-lg text-[#10242C] mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#109A9B]" />
            Generative AI Usage Distribution
          </h3>
          <p className="text-xs text-[#53656A] mb-4 sm:mb-6 font-medium">
            Calculated from database records for Q121 (Daily/Weekly/Occasionally/Never).
          </p>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aiAdoptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {aiAdoptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Database Adoption Rate']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs font-semibold text-[#53656A] mt-2 sm:mt-4">
            {aiAdoptionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
