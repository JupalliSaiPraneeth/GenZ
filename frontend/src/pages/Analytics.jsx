import React, { useState, useEffect, useMemo } from 'react';
import { Search, Activity, ArrowLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { useSurveyStore } from '../stores/surveyStore';
import { db } from '../services/db';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { OFFICIAL_75_QUESTIONS } from '../data/surveyQuestions';
import AnimatedQuestionPieChart from '../components/analytics/AnimatedQuestionPieChart';

export default function Analytics() {
  const { answersById } = useSurveyStore();
  const [dbResponses, setDbResponses] = useState([]);

  // Question Deep Dive Filters & Search States
  const [selectedQuestionId, setSelectedQuestionId] = useState('q1');
  const [questionSearch, setQuestionSearch] = useState('');

  // Mobile View Mode State: false = Question List View, true = Analytics Chart View
  const [isMobileAnalyticsOpen, setIsMobileAnalyticsOpen] = useState(false);

  // Explicitly enable vertical scrolling for the Insights page only
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    html.style.setProperty('overflow-y', 'auto', 'important');
    html.style.setProperty('height', 'auto', 'important');
    html.style.setProperty('max-height', 'none', 'important');
    html.style.setProperty('overscroll-behavior', 'auto', 'important');

    body.style.setProperty('overflow-y', 'auto', 'important');
    body.style.setProperty('height', 'auto', 'important');
    body.style.setProperty('max-height', 'none', 'important');
    body.style.setProperty('overscroll-behavior', 'auto', 'important');

    if (root) {
      root.style.setProperty('overflow-y', 'visible', 'important');
      root.style.setProperty('height', 'auto', 'important');
      root.style.setProperty('max-height', 'none', 'important');
    }

    window.scrollTo(0, 0);

    return () => {
      html.style.removeProperty('overflow-y');
      html.style.removeProperty('height');
      html.style.removeProperty('max-height');
      html.style.removeProperty('overscroll-behavior');

      body.style.removeProperty('overflow-y');
      body.style.removeProperty('height');
      body.style.removeProperty('max-height');
      body.style.removeProperty('overscroll-behavior');

      if (root) {
        root.style.removeProperty('overflow-y');
        root.style.removeProperty('height');
        root.style.removeProperty('max-height');
      }
    };
  }, []);

  // Fetch real database records from Supabase DB (primary) and Dexie IndexedDB (fallback)
  useEffect(() => {
    async function fetchRealDatabaseAnswers() {
      const combinedRecords = [];

      // 1. Fetch from Supabase database if configured (Authoritative source)
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from('survey_responses')
            .select('session_id, participant_id, question_id, response_value');

          if (data && data.length > 0) {
            data.forEach((item) => {
              const val = typeof item.response_value === 'object' ? item.response_value?.value : item.response_value;
              const sId = item.participant_id || item.session_id;
              combinedRecords.push({
                sessionId: String(sId),
                questionId: String(item.question_id).toLowerCase(),
                value: val,
              });
            });
          }
        } catch (err) {
          console.warn('Supabase DB query notice:', err);
        }
      }

      // 2. Fallback to Dexie IndexedDB local database if Supabase records are empty
      if (combinedRecords.length === 0) {
        try {
          const localDbAnswers = await db.answersQueue.toArray();
          if (localDbAnswers && localDbAnswers.length > 0) {
            localDbAnswers.forEach((item) => {
              const val = typeof item.responseValue === 'object' ? item.responseValue?.value : item.responseValue;
              combinedRecords.push({
                sessionId: String(item.sessionId),
                questionId: String(item.questionId).toLowerCase(),
                value: val,
              });
            });
          }
        } catch (err) {
          console.warn('Dexie DB query notice:', err);
        }
      }

      // Deduplicate by sessionId + questionId
      const uniqueMap = new Map();
      combinedRecords.forEach((rec) => {
        uniqueMap.set(`${rec.sessionId}_${rec.questionId}`, rec);
      });

      setDbResponses(Array.from(uniqueMap.values()));
    }

    fetchRealDatabaseAnswers();
  }, [answersById]);

  // Convert active session's answersById to record array
  const personalRecords = useMemo(() => {
    const activeSessionId = localStorage.getItem('genz_active_session') || 'my_session';
    return Object.entries(answersById || {}).map(([qId, val]) => ({
      sessionId: activeSessionId,
      questionId: String(qId).toLowerCase(),
      value: typeof val === 'object' ? val?.value : val,
    }));
  }, [answersById]);

  // Active records prioritizing Supabase DB responses over local personal session records
  const activeRecords = useMemo(() => {
    return dbResponses.length > 0 ? dbResponses : personalRecords;
  }, [dbResponses, personalRecords]);

  // Filtered Questions List for Deep Dive
  const filteredQuestions = useMemo(() => {
    return OFFICIAL_75_QUESTIONS.filter(
      (q) =>
        q.code.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.text.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.topic.toLowerCase().includes(questionSearch.toLowerCase())
    );
  }, [questionSearch]);

  // Currently Selected Question for Level 1 Analysis
  const selectedQuestionObj = useMemo(() => {
    return OFFICIAL_75_QUESTIONS.find((q) => q.id === selectedQuestionId) || OFFICIAL_75_QUESTIONS[0];
  }, [selectedQuestionId]);

  const selectedQuestionIndex = useMemo(() => {
    const idx = OFFICIAL_75_QUESTIONS.findIndex((q) => q.id === selectedQuestionId);
    return idx !== -1 ? idx : 0;
  }, [selectedQuestionId]);

  const handleSelectPrevQuestion = () => {
    const prevIdx = selectedQuestionIndex > 0 ? selectedQuestionIndex - 1 : OFFICIAL_75_QUESTIONS.length - 1;
    setSelectedQuestionId(OFFICIAL_75_QUESTIONS[prevIdx].id);
  };

  const handleSelectNextQuestion = () => {
    const nextIdx = selectedQuestionIndex < OFFICIAL_75_QUESTIONS.length - 1 ? selectedQuestionIndex + 1 : 0;
    setSelectedQuestionId(OFFICIAL_75_QUESTIONS[nextIdx].id);
  };

  // Mobile Question Click Handler: selects question AND opens analytics sheet
  const handleSelectQuestionMobile = (qId) => {
    setSelectedQuestionId(qId);
    setIsMobileAnalyticsOpen(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Mobile Back Button Handler: returns to question list
  const handleBackToQuestionList = () => {
    setIsMobileAnalyticsOpen(false);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Single Question Level 1 Analysis Data Calculation (Dynamic per Question Options & Responses)
  const singleQuestionAnalysis = useMemo(() => {
    if (!selectedQuestionObj) return null;

    const qIdKey = String(selectedQuestionObj.id).toLowerCase();
    const qCodeKey = String(selectedQuestionObj.code || '').toLowerCase();

    // 1. Extract recorded answers matching this question ID or code
    const responsesForQ = activeRecords.filter((r) => {
      const rq = String(r.questionId).toLowerCase();
      return rq === qIdKey || (qCodeKey && rq === qCodeKey);
    });

    const totalCount = responsesForQ.length;

    // 2. Fetch the question's specific defined option choices (fallback to 5-Likert if omitted)
    const questionOptions =
      selectedQuestionObj.options && selectedQuestionObj.options.length > 0
        ? selectedQuestionObj.options
        : [
          { label: 'Strongly Agree', value: 'strongly_agree' },
          { label: 'Agree', value: 'agree' },
          { label: 'Neutral', value: 'neutral' },
          { label: 'Disagree', value: 'disagree' },
          { label: 'Strongly Disagree', value: 'strongly_disagree' },
        ];

    // Rich color palette for distinct option presentation
    const COLOR_PALETTE = [
      '#075D63', // Deep Teal
      '#109A9B', // Bright Teal
      '#3B82F6', // Blue
      '#8B5CF6', // Purple
      '#F59E0B', // Amber
      '#EC4899', // Pink
      '#10B981', // Emerald
      '#6366F1', // Indigo
      '#D97706', // Dark Amber
      '#53656A', // Cool Slate
    ];

    // Check if options are Likert or frequency based
    const isLikert = questionOptions.some((opt) => {
      const val = String(opt.value || '').toLowerCase();
      const lbl = String(opt.label || '').toLowerCase();
      return val.includes('agree') || val.includes('often') || lbl.includes('agree') || lbl.includes('disagree');
    });

    const optionCounts = new Array(questionOptions.length).fill(0);
    let totalLikertScoreSum = 0;

    if (totalCount > 0) {
      responsesForQ.forEach((r) => {
        const rawVal = String(r.value ?? '').trim().toLowerCase();
        const rawValClean = rawVal.replace(/[^a-z0-9]/g, '');

        let matchedIdx = questionOptions.findIndex((opt) => {
          const optVal = String(opt.value ?? '').trim().toLowerCase();
          const optValClean = optVal.replace(/[^a-z0-9]/g, '');
          const optLabel = String(opt.label ?? '').trim().toLowerCase();
          const optLabelClean = optLabel.replace(/[^a-z0-9]/g, '');

          return (
            rawVal === optVal ||
            rawVal === optLabel ||
            (rawValClean.length > 0 && (rawValClean === optValClean || rawValClean === optLabelClean))
          );
        });

        // Numeric index fallback if answer value was stored as index string
        if (matchedIdx === -1) {
          const num = parseInt(rawVal, 10);
          if (!isNaN(num) && num >= 0 && num < questionOptions.length) {
            matchedIdx = num;
          }
        }

        if (matchedIdx !== -1) {
          optionCounts[matchedIdx]++;
        } else {
          // If unmatched, assign to first option to avoid losing vote in total
          optionCounts[0]++;
        }

        // Calculate Likert score
        if (isLikert) {
          if (rawVal.includes('strongly_agree') || rawVal.includes('very_often')) totalLikertScoreSum += 5;
          else if (rawVal.includes('agree') || rawVal.includes('often')) totalLikertScoreSum += 4;
          else if (rawVal.includes('neutral') || rawVal.includes('sometimes')) totalLikertScoreSum += 3;
          else if (rawVal.includes('disagree') || rawVal.includes('rarely')) totalLikertScoreSum += 2;
          else totalLikertScoreSum += 1;
        }
      });

      const distributionData = questionOptions.map((opt, idx) => {
        const count = optionCounts[idx];
        const pct = Math.round((count / totalCount) * 100);
        return {
          name: opt.label,
          valueKey: opt.value,
          count,
          pct,
          fill: COLOR_PALETTE[idx % COLOR_PALETTE.length],
        };
      });

      const sortedDist = [...distributionData].sort((a, b) => b.pct - a.pct);
      const avg5 = isLikert ? Math.round((totalLikertScoreSum / totalCount) * 100) / 100 : null;

      return {
        totalResponses: totalCount,
        isLikert,
        avgScore5: avg5 || '4.00',
        dominantOption: sortedDist[0]?.name || questionOptions[0]?.label,
        dominantPct: sortedDist[0]?.pct || 0,
        distributionData,
      };
    } else {
      // 0 recorded answers for this question: return 0 counts with question's ACTUAL options
      const distributionData = questionOptions.map((opt, idx) => ({
        name: opt.label,
        valueKey: opt.value,
        count: 0,
        pct: 0,
        fill: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      }));

      return {
        totalResponses: 0,
        isLikert,
        avgScore5: isLikert ? '0.00' : '0%',
        dominantOption: questionOptions[0]?.label || 'None',
        dominantPct: 0,
        distributionData,
      };
    }
  }, [selectedQuestionObj, activeRecords]);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] overflow-y-auto overflow-x-hidden font-inter text-[#10242C]">

      {/* TOP TEAL HEADER ATMOSPHERE */}
      <div className="absolute top-0 left-0 right-0 h-[520px] sm:h-[480px] bg-gradient-to-b from-[#109A9B] via-[#075D63] to-[#063E46] z-0 overflow-hidden" />

      {/* BACKGROUND DECORATIVE GLOW SHAPES */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_65%)] pointer-events-none z-0" />
      <div className="absolute top-10 -left-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#109A9B]/20 blur-3xl pointer-events-none z-0" />

      {/* MAIN CONTENT CONTAINER */}
      <div className="relative z-10 pt-[85px] sm:pt-[110px] pb-16 sm:pb-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-5 sm:space-y-8">

        {/* HERO SECTION & TITLE */}
        <div className="text-center max-w-4xl mx-auto space-y-2.5 sm:space-y-3 px-2">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/15 border border-white/25 text-[#FFF8E8] font-bold text-[10px] sm:text-xs uppercase tracking-wider backdrop-blur-xs shadow-md">
            <Activity className="w-3.5 h-3.5 text-[#FDE7B5]" />
            <span>360° Life Orientation Analytics Model</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#FFF8E8] tracking-tight drop-shadow-xs">
            Multi-Dimensional Research Dashboard
          </h1>

          <p className="text-[#FFF8E8]/90 text-xs sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            Comprehensive statistical analysis across the official 75-question study covering core life orientation themes and response distributions.
          </p>
        </div>

        {/* 75 QUESTIONS DEEP DIVE SECTION */}
        <div className="space-y-6">

          {/* ========================================================= */}
          {/* MOBILE VIEW MODE (< lg): Select Question -> Open Analytics */}
          {/* ========================================================= */}
          <div className="block lg:hidden">
            {!isMobileAnalyticsOpen ? (
              /* MOBILE QUESTION DIRECTORY LIST */
              <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#109A9B]/20 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#109A9B]" />
                    <span>Select Question (75 Total)</span>
                  </h3>
                  <span className="text-xs font-extrabold text-[#075D63] bg-[#EAF6F6] px-3 py-1 rounded-full border border-[#109A9B]/20">
                    {filteredQuestions.length} Questions
                  </span>
                </div>

                {/* Mobile Search Bar Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    placeholder="Search Q1-Q75 or keyword..."
                    className="w-full px-4 py-2.5 pl-10 rounded-2xl border border-slate-200 focus:border-[#109A9B] focus:ring-2 focus:ring-[#109A9B]/20 outline-none text-xs font-semibold bg-slate-50/50 shadow-xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Mobile Question Cards Stack */}
                <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1 touch-pan-y">
                  {filteredQuestions.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => handleSelectQuestionMobile(q.id)}
                      className="group bg-[#FAF7F0] hover:bg-[#EAF6F6] p-3.5 rounded-2xl border border-slate-200/80 hover:border-[#109A9B]/40 shadow-xs transition-all cursor-pointer flex flex-col gap-1.5 active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-extrabold text-[#075D63] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {q.code} • {q.topic}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#109A9B] group-hover:translate-x-0.5 transition-transform">
                          Analytics <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      <div className="font-semibold text-xs sm:text-sm text-[#10242C] leading-snug">
                        {q.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* MOBILE ANALYTICS DETAIL VIEW */
              <div className="space-y-4">
                {/* Mobile Back Button Header Bar */}
                <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#109A9B]/20 shadow-md flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleBackToQuestionList}
                    className="px-3.5 py-1.5 rounded-xl bg-[#063E46] text-[#FFF8E8] font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Questions</span>
                  </button>

                  <span className="text-xs font-extrabold text-[#075D63] bg-[#EAF6F6] px-3 py-1 rounded-full border border-[#109A9B]/20 font-mono">
                    Question {selectedQuestionIndex + 1} of 75
                  </span>
                </div>

                {/* Animated Pie Chart Visual Component */}
                <AnimatedQuestionPieChart
                  questionObj={selectedQuestionObj}
                  analysisData={singleQuestionAnalysis}
                  onSelectPrev={handleSelectPrevQuestion}
                  onSelectNext={handleSelectNextQuestion}
                  totalQuestionsCount={OFFICIAL_75_QUESTIONS.length}
                  currentIndex={selectedQuestionIndex}
                />
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* DESKTOP VIEW MODE (lg: grid-cols-12): Side-by-Side 2 Columns */}
          {/* ========================================================= */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6">

            {/* Left Column: Question Selector Search */}
            <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-xl space-y-4 max-h-[620px] flex flex-col">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#109A9B]" />
                    <span>Select Question (75 Total)</span>
                  </h3>
                  <span className="text-[11px] font-extrabold text-[#075D63] bg-[#EAF6F6] px-2.5 py-0.5 rounded-full border border-[#109A9B]/20">
                    Q{selectedQuestionIndex + 1}/75
                  </span>
                </div>

                {/* Search Bar Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    placeholder="Search Q1-Q75 or keyword..."
                    className="w-full px-3.5 py-2 pl-9 rounded-2xl border border-slate-200 focus:border-[#109A9B] focus:ring-2 focus:ring-[#109A9B]/20 outline-none text-xs font-semibold bg-slate-50/50 transition-all"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Scrollable Questions List */}
              <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 scrollbar-thin">
                {filteredQuestions.map((q) => {
                  const isSelected = selectedQuestionId === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-0.5 ${
                        isSelected
                          ? 'bg-[#075D63] text-white border-[#075D63] font-bold shadow-md ring-1 ring-[#109A9B]/40'
                          : 'bg-white hover:bg-slate-50 text-[#10242C] border-slate-200/80 font-medium hover:border-[#109A9B]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-mono text-[10px] ${isSelected ? 'text-[#FDE7B5]' : 'text-[#075D63]'}`}>
                          {q.code} • {q.topic}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FDE7B5] animate-pulse" />
                        )}
                      </div>
                      <div className="truncate font-semibold text-xs leading-snug">{q.text}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: GSAP Animated Question Option Pie Chart Component */}
            <div className="lg:col-span-8">
              <AnimatedQuestionPieChart
                questionObj={selectedQuestionObj}
                analysisData={singleQuestionAnalysis}
                onSelectPrev={handleSelectPrevQuestion}
                onSelectNext={handleSelectNextQuestion}
                totalQuestionsCount={OFFICIAL_75_QUESTIONS.length}
                currentIndex={selectedQuestionIndex}
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
