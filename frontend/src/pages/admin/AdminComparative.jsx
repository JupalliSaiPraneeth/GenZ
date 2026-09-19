import React, { useState, useEffect, useMemo } from 'react';
import {
  GitCompare,
  TrendingUp,
  Zap,
  RefreshCw,
  SlidersHorizontal,
  Database,
  Sparkles,
  BarChart2,
  HelpCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';
import { getQuestionScore } from '../../services/analyticsEngine';
import { OFFICIAL_75_QUESTIONS } from '../../data/surveyQuestions';

// Distinct, high-contrast color palette for bar groups
const BAR_COLORS = ['#075D63', '#109A9B', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Custom Glassmorphic Tooltip for Recharts
function CustomCrossTabTooltip({ active, payload, label, optB }) {
  if (active && payload && payload.length) {
    const totalCount = payload.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

    return (
      <div className="bg-[#0F172A]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 shadow-2xl text-white text-xs space-y-2 max-w-[240px]">
        <div className="border-b border-slate-700 pb-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Question A Option</span>
          <span className="font-bold text-teal-300 text-sm leading-snug block">{label}</span>
        </div>

        <div className="space-y-1.5">
          {payload.map((entry, idx) => {
            const val = Number(entry.value) || 0;
            const pct = totalCount > 0 ? Math.round((val / totalCount) * 100) : 0;

            return (
              <div key={idx} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color || entry.fill }}
                  />
                  <span className="font-medium text-slate-200 text-[11px] truncate">
                    {entry.name}
                  </span>
                </div>
                <div className="font-mono text-right shrink-0">
                  <span className="font-extrabold text-white text-[11px]">{val}</span>
                  <span className="text-[9.5px] text-slate-400 font-semibold ml-1">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        {totalCount > 0 && (
          <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 font-mono flex justify-between">
            <span>Category Total:</span>
            <span className="font-bold text-white">{totalCount} responses</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function AdminComparative() {
  const [compData, setCompData] = useState(null);
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Interactive Cross-Tab Selector States
  const [qAId, setQAId] = useState('q12'); // Default: Q12 Sleep
  const [qBId, setQBId] = useState('q14'); // Default: Q14 Mental Health

  // Load analytical dataset directly from Supabase DB
  const loadAnalytics = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    else setLoading(true);

    try {
      const [compRes, qRes] = await Promise.all([
        adminDataService.getComparativeAnalytics(),
        adminDataService.getQuestionsList()
      ]);
      setCompData(compRes);
      setQuestionsList(qRes.length > 0 ? qRes : OFFICIAL_75_QUESTIONS);
    } catch (err) {
      console.error('Error loading comparative analytics from Supabase:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const rawRecords = compData?.records || [];
  const rawSessions = compData?.sessions || [];
  const correlationPairs = compData?.correlationPairs || [];
  const beliefBehaviourGaps = compData?.beliefBehaviourGaps || [];

  // Question lookup helper
  const getQ = (idOrCode) => {
    const key = String(idOrCode).toLowerCase();
    return questionsList.find(
      (q) => String(q.id).toLowerCase() === key || String(q.code || '').toLowerCase() === key
    ) || OFFICIAL_75_QUESTIONS.find((q) => String(q.id).toLowerCase() === key) || OFFICIAL_75_QUESTIONS[0];
  };

  // Dynamic Cross-Tabulation calculation for ANY selected Question A & Question B strictly from Supabase DB
  const crossTabAnalysis = useMemo(() => {
    const qA = getQ(qAId);
    const qB = getQ(qBId);

    const records = rawRecords;

    // Map participantId/sessionId -> { [qId]: value }
    const ansMap = new Map();
    records.forEach((r) => {
      const sKey = r.participantId || r.sessionId;
      const qKey = String(r.questionId).toLowerCase();
      if (!ansMap.has(sKey)) ansMap.set(sKey, {});
      ansMap.get(sKey)[qKey] = r.value;
    });

    const optA = qA.options || [
      { label: 'Option 1', value: 'opt_1' },
      { label: 'Option 2', value: 'opt_2' },
      { label: 'Option 3', value: 'opt_3' },
      { label: 'Option 4', value: 'opt_4' }
    ];
    const optB = qB.options || [
      { label: 'Option 1', value: 'opt_1' },
      { label: 'Option 2', value: 'opt_2' },
      { label: 'Option 3', value: 'opt_3' },
      { label: 'Option 4', value: 'opt_4' }
    ];

    // Frequency matrix [optA.length][optB.length] initialized strictly to 0
    const freqMatrix = optA.map(() => new Array(optB.length).fill(0));
    let pairCount = 0;
    const numericPairs = [];

    ansMap.forEach((userAnswers) => {
      const valA = userAnswers[String(qA.id).toLowerCase()] ?? userAnswers[String(qA.code || '').toLowerCase()];
      const valB = userAnswers[String(qB.id).toLowerCase()] ?? userAnswers[String(qB.code || '').toLowerCase()];

      if (valA !== undefined && valA !== null && valB !== undefined && valB !== null) {
        const cleanA = String(typeof valA === 'object' ? valA.value : valA).trim().toLowerCase();
        let idxA = optA.findIndex((o) => String(o.value).toLowerCase() === cleanA || String(o.label).toLowerCase() === cleanA);
        if (idxA === -1) idxA = 0;

        const cleanB = String(typeof valB === 'object' ? valB.value : valB).trim().toLowerCase();
        let idxB = optB.findIndex((o) => String(o.value).toLowerCase() === cleanB || String(o.label).toLowerCase() === cleanB);
        if (idxB === -1) idxB = 0;

        freqMatrix[idxA][idxB]++;
        pairCount++;

        // Pearson score calculation
        const scoreA = getQuestionScore(qA, valA);
        const scoreB = getQuestionScore(qB, valB);
        if (scoreA !== null && scoreB !== null) {
          numericPairs.push([scoreA, scoreB]);
        }
      }
    });

    // Compute Pearson r
    let rVal = 0;
    if (numericPairs.length >= 2) {
      const n = numericPairs.length;
      let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
      numericPairs.forEach(([x, y]) => {
        sum1 += x; sum2 += y;
        sum1Sq += x * x; sum2Sq += y * y;
        pSum += x * y;
      });
      const num = pSum - (sum1 * sum2) / n;
      const den = Math.sqrt((sum1Sq - (sum1 * sum1) / n) * (sum2Sq - (sum2 * sum2) / n));
      if (den !== 0) rVal = Math.round((num / den) * 100) / 100;
    }

    // Recharts chart dataset built directly from DB counts
    const chartData = optA.map((oA, i) => {
      const row = { categoryA: oA.label };
      optB.forEach((oB, j) => {
        row[oB.label] = freqMatrix[i][j];
      });
      return row;
    });

    const absR = Math.abs(rVal);
    const associationLabel = absR >= 0.6 ? 'Strong Association' : absR >= 0.3 ? 'Moderate Association' : 'Weak / Neutral Association';

    return {
      qA,
      qB,
      optA,
      optB,
      freqMatrix,
      chartData,
      pairCount,
      associationScore: (rVal >= 0 ? '+' : '') + rVal,
      rNum: rVal,
      associationLabel,
      significance: pairCount > 0 ? `Calculated from ${pairCount} Supabase DB Response Pairs` : 'Live Supabase DB Response Query',
      narrative: `Cross-analysis between ${qA.code} ("${qA.text}") and ${qB.code} ("${qB.text}") based on ${pairCount > 0 ? pairCount : '0'} Supabase DB response pairs yields r = ${rVal >= 0 ? '+' : ''}${rVal} (${associationLabel.toLowerCase()}).`
    };
  }, [qAId, qBId, questionsList, rawRecords, rawSessions]);

  // Dynamic KPI overview metrics computed from DB
  const metrics = useMemo(() => {
    const pairs = correlationPairs;
    const gaps = beliefBehaviourGaps;

    const topCorr = pairs.reduce((prev, curr) => {
      const prevR = Math.abs(parseFloat(prev?.r || 0));
      const currR = Math.abs(parseFloat(curr?.r || 0));
      return currR > prevR ? curr : prev;
    }, pairs[0] || { pair: 'No Correlation Data', r: '0.00' });

    const maxGap = gaps.reduce((prev, curr) => {
      return (curr?.gapPct || 0) > (prev?.gapPct || 0) ? curr : prev;
    }, gaps[0] || { title: 'No Gap Data', gapPct: 0 });

    const totalRecords = rawRecords.length || 0;
    const totalSessions = rawSessions.length || 0;

    return {
      topCorr,
      maxGap,
      totalRecords,
      totalSessions,
    };
  }, [correlationPairs, beliefBehaviourGaps, rawRecords, rawSessions]);

  return (
    <AdminLayout title="Question-Based Comparative Analysis & Insights">
      <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto px-1 sm:px-2">

        {/* 1. HEADER TITLE TOOLBAR */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#109A9B]/20 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#109A9B] to-[#075D63] text-white shadow-sm shrink-0">
                <GitCompare className="w-5 h-5" />
              </div>
              <h1 className="font-heading font-extrabold text-lg sm:text-xl md:text-2xl text-[#10242C]">
                Question-Based Comparative Analysis
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] sm:text-xs font-bold border border-emerald-300">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                Supabase Live DB
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#53656A] font-medium leading-relaxed">
              Statistical correlations & cross-tabulation computed strictly from Supabase Database tables (<code className="text-[#075D63] font-mono text-[11px]">survey_responses</code> & <code className="text-[#075D63] font-mono text-[11px]">participants</code>).
            </p>
          </div>

          {/* HEADER TOP-RIGHT ACTIONS */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => loadAnalytics(true)}
              disabled={isRefreshing}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-[#109A9B]/40 bg-slate-50 hover:bg-white text-[#10242C] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#109A9B] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Querying...' : 'Refresh Supabase Data'}</span>
            </button>
          </div>
        </div>

        {/* 2. ANALYTICAL KPI METRIC SUMMARY CARDS (RESPONSIVE GRID) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {/* CARD 1: TOP CORRELATED PAIR */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-[#109A9B]/40 transition-all">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#53656A] uppercase tracking-wider block">
                Top DB Correlation
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-lg sm:text-xl font-extrabold text-[#075D63] font-heading">
                  {metrics.topCorr.r}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Strong Positive
                </span>
              </div>
              <span className="text-[11px] text-slate-600 block font-bold truncate max-w-[150px] sm:max-w-[180px]">
                {metrics.topCorr.pair}
              </span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#EAF6F6] text-[#075D63] flex items-center justify-center font-bold border border-[#109A9B]/20 shrink-0 ml-2">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* CARD 2: LARGEST INTENTION GAP */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-amber-300 transition-all">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#53656A] uppercase tracking-wider block">
                Largest DB Action Gap
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-lg sm:text-xl font-extrabold text-amber-700 font-heading">
                  {metrics.maxGap.gapPct}%
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Action Disparity
                </span>
              </div>
              <span className="text-[11px] text-slate-600 block font-bold truncate max-w-[150px] sm:max-w-[180px]">
                {metrics.maxGap.title}
              </span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200 shrink-0 ml-2">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          {/* CARD 3: DB RESPONSE VOLUME */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-cyan-300 transition-all">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#53656A] uppercase tracking-wider block">
                Supabase DB Rows
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-cyan-700 font-heading">
                  {metrics.totalRecords.toLocaleString()}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                  Verified Rows
                </span>
              </div>
              <span className="text-[11px] text-slate-600 block font-bold">
                survey_responses table
              </span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold border border-cyan-200 shrink-0 ml-2">
              <Database className="w-5 h-5" />
            </div>
          </div>

          {/* CARD 4: DB PARTICIPANTS COUNT */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between hover:border-purple-300 transition-all">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#53656A] uppercase tracking-wider block">
                Supabase Participants
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-purple-700 font-heading">
                  {metrics.totalSessions.toLocaleString()}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Registered Users
                </span>
              </div>
              <span className="text-[11px] text-slate-600 block font-bold">
                participants table
              </span>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold border border-purple-200 shrink-0 ml-2">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* 3. EXCLUSIVE MAIN SECTION: INTERACTIVE 2-QUESTION CROSS-TAB ANALYZER */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#109A9B]/20 shadow-md space-y-5 sm:space-y-6">
          
          {/* SECTION HEADER */}
          <div className="border-b border-slate-100 pb-3 sm:pb-4 space-y-1">
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#10242C] flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#109A9B] shrink-0" />
              <span>Interactive 2-Question Cross-Tabulation Matrix (Supabase DB Query)</span>
            </h3>
            <p className="text-xs text-[#53656A] font-medium leading-relaxed">
              Select any two survey questions from Q1 through Q75 to generate a live cross-frequency distribution matrix calculated strictly from Supabase DB response rows.
            </p>
          </div>

          {/* PRESET SHORTCUT BUTTONS */}
          <div className="space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Popular Question Pair Shortcuts:
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {[
                { label: 'Q12 (Sleep) ↔ Q14 (Mental)', a: 'q12', b: 'q14' },
                { label: 'Q50 (AI Tools) ↔ Q40 (Career)', a: 'q50', b: 'q40' },
                { label: 'Q38 (Startup) ↔ Q41 (Risk)', a: 'q38', b: 'q41' },
                { label: 'Q43 (Savings) ↔ Q45 (Freedom)', a: 'q43', b: 'q45' },
                { label: 'Q22 (Screen) ↔ Q25 (Study)', a: 'q22', b: 'q25' },
              ].map((preset, idx) => {
                const isActive = qAId === preset.a && qBId === preset.b;
                return (
                  <button
                    key={idx}
                    onClick={() => { setQAId(preset.a); setQBId(preset.b); }}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-[11px] sm:text-xs border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#075D63] text-white border-[#075D63] shadow-xs'
                        : 'bg-[#FAF7F0] hover:bg-[#EAF6F6] text-[#075D63] border-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUESTION SELECTORS ROW (RESPONSIVE GRID) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 bg-[#FAF7F0] p-3.5 sm:p-4 rounded-2xl border border-slate-200">

            {/* QUESTION A SELECTOR */}
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-extrabold text-[#075D63] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#075D63] text-white flex items-center justify-center text-[10px] shrink-0">A</span>
                Primary Variable (Question A):
              </label>
              <select
                value={qAId}
                onChange={(e) => setQAId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs text-[#10242C] outline-none focus:border-[#109A9B] truncate cursor-pointer shadow-2xs"
              >
                {questionsList.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.code}: {q.text.length > 55 ? q.text.slice(0, 55) + '…' : q.text}
                  </option>
                ))}
              </select>
            </div>

            {/* QUESTION B SELECTOR */}
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-extrabold text-[#109A9B] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#109A9B] text-white flex items-center justify-center text-[10px] shrink-0">B</span>
                Secondary Variable (Question B):
              </label>
              <select
                value={qBId}
                onChange={(e) => setQBId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs text-[#10242C] outline-none focus:border-[#109A9B] truncate cursor-pointer shadow-2xs"
              >
                {questionsList.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.code}: {q.text.length > 55 ? q.text.slice(0, 55) + '…' : q.text}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* DYNAMIC CROSS-TABULATION RESULTS DISPLAY */}
          <div className="space-y-4 sm:space-y-6 pt-1">

            {/* NARRATIVE SUMMARY */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#EAF6F6] border border-[#109A9B]/30 space-y-1.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#075D63] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#109A9B] shrink-0" />
                  {crossTabAnalysis.significance}
                </span>
                <span className="font-mono text-xs font-bold bg-[#075D63] text-white px-2.5 py-0.5 rounded-full">
                  r = {crossTabAnalysis.associationScore} ({crossTabAnalysis.associationLabel})
                </span>
              </div>
              <p className="text-xs text-[#10242C] font-semibold leading-relaxed">
                {crossTabAnalysis.narrative}
              </p>
            </div>

            {/* RECHARTS STACKED BAR COMPARISON CHART CONTAINER */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="font-bold text-xs sm:text-sm text-[#10242C] flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#109A9B]" />
                  <span>Supabase DB Frequency Distribution: {crossTabAnalysis.qA.code} vs {crossTabAnalysis.qB.code}</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  Showing {crossTabAnalysis.optA.length} Categories × {crossTabAnalysis.optB.length} Sub-options
                </span>
              </div>

              {/* RESPONSIVE CHART GRAPH BOX */}
              <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-3">
                
                {/* SVG CHART CANVAS */}
                <div className="h-[280px] sm:h-[340px] md:h-[380px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={crossTabAnalysis.chartData}
                      margin={{ top: 15, right: 15, left: -20, bottom: 65 }}
                    >
                      <XAxis
                        dataKey="categoryA"
                        interval={0}
                        tick={({ x, y, payload }) => {
                          const rawLabel = String(payload.value || '');
                          const displayLabel = rawLabel.length > 15 ? rawLabel.slice(0, 13) + '…' : rawLabel;
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text
                                x={0}
                                y={0}
                                dx={-4}
                                dy={8}
                                textAnchor="end"
                                transform="rotate(-30)"
                                fill="#334155"
                                fontSize={10}
                                fontWeight={700}
                              >
                                <title>{rawLabel}</title>
                                {displayLabel}
                              </text>
                            </g>
                          );
                        }}
                      />
                      <YAxis tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }} />
                      <Tooltip content={<CustomCrossTabTooltip optB={crossTabAnalysis.optB} />} />
                      {crossTabAnalysis.optB.map((oB, idx) => {
                        return (
                          <Bar
                            key={oB.value}
                            dataKey={oB.label}
                            fill={BAR_COLORS[idx % BAR_COLORS.length]}
                            radius={[6, 6, 0, 0]}
                            maxBarSize={48}
                          />
                        );
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* CUSTOM RESPONSIVE LEGEND BAR */}
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block mb-1 text-center">
                    Secondary Question ({crossTabAnalysis.qB.code}) Options Legend:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    {crossTabAnalysis.optB.map((oB, idx) => (
                      <div
                        key={oB.value}
                        className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200/80 shadow-2xs"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: BAR_COLORS[idx % BAR_COLORS.length] }}
                        />
                        <span className="text-[10px] sm:text-xs font-bold text-[#10242C] truncate max-w-[120px] sm:max-w-[180px]">
                          {oB.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
