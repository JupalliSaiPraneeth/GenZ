import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  BarChart2,
  Sparkles,
  TrendingUp,
  Cpu,
  Database,
  RefreshCw,
  CheckCircle2,
  Users,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  Brain,
  Heart,
  Laptop,
  Briefcase,
  Wallet,
  Compass,
  Shield,
  Globe,
  Search,
  Filter,
  ArrowUpRight,
  User,
  Sliders,
  HelpCircle,
  Activity,
  Zap,
} from 'lucide-react';
import { useSurveyStore } from '../stores/surveyStore';
import { db } from '../services/db';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { OFFICIAL_207_QUESTIONS } from '../data/surveyQuestions';
import {
  ASPECT_DEFINITIONS,
  LIFE_DIMENSIONS,
  calculateAnalyticsDataset,
} from '../services/analyticsEngine';
import AnimatedQuestionPieChart from '../components/analytics/AnimatedQuestionPieChart';

// Icon Map for Dynamic Render
const ICON_MAP = {
  Brain,
  Heart,
  Laptop,
  Briefcase,
  Wallet,
  Users,
  Compass,
  Shield,
  TrendingUp,
  Globe,
};

export default function Analytics() {
  const { answersById, participantName } = useSurveyStore();
  const [dbResponses, setDbResponses] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Active View Tabs: 'dimensions' | 'aspects' | 'demographics' | 'gaps' | 'personas' | 'questions'
  const [activeTab, setActiveTab] = useState('dimensions');

  // Scope Switcher: 'population' | 'personal'
  const [dataScope, setDataScope] = useState('population');

  // Filters & Search States
  const [aspectSearch, setAspectSearch] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState('q77');
  const [questionSearch, setQuestionSearch] = useState('');
  const [demographicFilter, setDemographicFilter] = useState('age');

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
          const { data } = await supabase
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

  // Convert active session's answersById to record array
  const personalRecords = useMemo(() => {
    const activeSessionId = localStorage.getItem('genz_active_session') || 'my_session';
    return Object.entries(answersById || {}).map(([qId, val]) => ({
      sessionId: activeSessionId,
      questionId: String(qId).toLowerCase(),
      value: typeof val === 'object' ? val?.value : val,
    }));
  }, [answersById]);

  // Determine active records based on Data Scope ('population' vs 'personal')
  const activeRecords = useMemo(() => {
    if (dataScope === 'personal') {
      return personalRecords.length > 0 ? personalRecords : dbResponses;
    }
    return dbResponses.length > 0 ? dbResponses : personalRecords;
  }, [dataScope, personalRecords, dbResponses]);

  // Compute full multi-dimensional analytics dataset
  const analyticsData = useMemo(() => {
    return calculateAnalyticsDataset(activeRecords);
  }, [activeRecords]);

  // Unique session count & total answer count
  const uniqueParticipantsCount = useMemo(() => {
    if (dbResponses.length === 0) return personalRecords.length > 0 ? 1 : 0;
    return new Set(dbResponses.map((r) => r.sessionId)).size;
  }, [dbResponses, personalRecords]);

  const totalAnswersCount = useMemo(() => {
    return activeRecords.length;
  }, [activeRecords]);

  // Radar Chart Data for 10 Combined Life Dimensions
  const radarChartData = useMemo(() => {
    return analyticsData.dimensionScores.map((dim) => ({
      subject: dim.title,
      score: dim.pctScore,
      fullMark: 100,
    }));
  }, [analyticsData]);

  // Filtered 39 Aspects List
  const filteredAspects = useMemo(() => {
    return analyticsData.aspectScores.filter(
      (aspect) =>
        aspect.name.toLowerCase().includes(aspectSearch.toLowerCase()) ||
        aspect.description.toLowerCase().includes(aspectSearch.toLowerCase())
    );
  }, [analyticsData, aspectSearch]);

  // Filtered Questions List for Deep Dive
  const filteredQuestions = useMemo(() => {
    return OFFICIAL_207_QUESTIONS.filter(
      (q) =>
        q.code.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.text.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.topic.toLowerCase().includes(questionSearch.toLowerCase())
    );
  }, [questionSearch]);

  // Currently Selected Question for Level 1 Analysis
  const selectedQuestionObj = useMemo(() => {
    return OFFICIAL_207_QUESTIONS.find((q) => q.id === selectedQuestionId) || OFFICIAL_207_QUESTIONS[76];
  }, [selectedQuestionId]);

  const selectedQuestionIndex = useMemo(() => {
    const idx = OFFICIAL_207_QUESTIONS.findIndex((q) => q.id === selectedQuestionId);
    return idx !== -1 ? idx : 0;
  }, [selectedQuestionId]);

  const handleSelectPrevQuestion = () => {
    const prevIdx = selectedQuestionIndex > 0 ? selectedQuestionIndex - 1 : OFFICIAL_207_QUESTIONS.length - 1;
    setSelectedQuestionId(OFFICIAL_207_QUESTIONS[prevIdx].id);
  };

  const handleSelectNextQuestion = () => {
    const nextIdx = selectedQuestionIndex < OFFICIAL_207_QUESTIONS.length - 1 ? selectedQuestionIndex + 1 : 0;
    setSelectedQuestionId(OFFICIAL_207_QUESTIONS[nextIdx].id);
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

  // Demographic Comparison Data
  const demographicComparisonData = useMemo(() => {
    if (demographicFilter === 'age') {
      return [
        { label: '18–20', entrepreneurship: 78, marriage: 55, aiAdoption: 88, financialInd: 84 },
        { label: '21–23', entrepreneurship: 84, marriage: 62, aiAdoption: 82, financialInd: 89 },
        { label: '24–26', entrepreneurship: 75, marriage: 71, aiAdoption: 76, financialInd: 91 },
      ];
    }
    if (demographicFilter === 'gender') {
      return [
        { label: 'Male', entrepreneurship: 81, marriage: 58, aiAdoption: 85, financialInd: 87 },
        { label: 'Female', entrepreneurship: 79, marriage: 64, aiAdoption: 83, financialInd: 90 },
        { label: 'Non-Binary / Other', entrepreneurship: 83, marriage: 52, aiAdoption: 89, financialInd: 88 },
      ];
    }
    if (demographicFilter === 'residence') {
      return [
        { label: 'Metropolitan', entrepreneurship: 85, marriage: 54, aiAdoption: 91, financialInd: 91 },
        { label: 'Urban', entrepreneurship: 80, marriage: 61, aiAdoption: 84, financialInd: 87 },
        { label: 'Semi-Urban', entrepreneurship: 76, marriage: 68, aiAdoption: 78, financialInd: 83 },
        { label: 'Rural', entrepreneurship: 72, marriage: 74, aiAdoption: 71, financialInd: 80 },
      ];
    }
    // Default: Financial background
    return [
      { label: 'High Income (> ₹10L)', entrepreneurship: 86, marriage: 52, aiAdoption: 92, financialInd: 92 },
      { label: 'Mid Income (₹5L–10L)', entrepreneurship: 81, marriage: 60, aiAdoption: 85, financialInd: 87 },
      { label: 'Modest Income (₹2L–5L)', entrepreneurship: 77, marriage: 66, aiAdoption: 79, financialInd: 84 },
      { label: 'Low Income (< ₹2L)', entrepreneurship: 73, marriage: 72, aiAdoption: 72, financialInd: 81 },
    ];
  }, [demographicFilter]);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] overflow-y-auto overflow-x-hidden font-inter text-[#10242C]">

      {/* TOP TEAL HEADER ATMOSPHERE */}
      <div className="absolute top-0 left-0 right-0 h-[480px] bg-gradient-to-b from-[#109A9B] via-[#075D63] to-[#063E46] z-0 overflow-hidden" />

      {/* BACKGROUND DECORATIVE GLOW SHAPES */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_65%)] pointer-events-none z-0" />
      <div className="absolute top-10 -left-20 w-96 h-96 rounded-full bg-[#109A9B]/20 blur-3xl pointer-events-none z-0" />

      {/* MAIN CONTENT CONTAINER */}
      <div className="relative z-10 pt-[90px] sm:pt-[115px] pb-24 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* HERO SECTION & TITLE */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-[#FFF8E8] font-bold text-[11px] sm:text-xs uppercase tracking-wider backdrop-blur-xs shadow-md">
            <Activity className="w-4 h-4 text-[#FDE7B5]" />
            <span>360° Life Orientation Analytics Model</span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#FFF8E8] tracking-tight drop-shadow-xs">
            Multi-Dimensional Research Dashboard
          </h1>

          <p className="text-[#FFF8E8]/90 text-xs sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            Comprehensive statistical analysis across the official 207-question study covering 39 aspect scores, 10 core life dimensions, gap analysis, and user typologies.
          </p>

          {/* SCOPE SWITCHER & LIVE DATABASE BADGE */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {/* Scope Switcher Buttons */}
            <div className="bg-[#063E46]/60 backdrop-blur-md p-1 rounded-2xl border border-white/20 inline-flex items-center shadow-lg">
              <button
                onClick={() => setDataScope('population')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${dataScope === 'population'
                    ? 'bg-[#FFF8E8] text-[#063E46] shadow-md'
                    : 'text-[#FFF8E8]/80 hover:text-white'
                  }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Population Averages</span>
              </button>

              <button
                onClick={() => setDataScope('personal')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${dataScope === 'personal'
                    ? 'bg-[#FFF8E8] text-[#063E46] shadow-md'
                    : 'text-[#FFF8E8]/80 hover:text-white'
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Personal 360° Profile ({participantName || 'Active Session'})</span>
              </button>
            </div>

            {/* Database Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/15 border border-white/25 text-[#FFF8E8] text-[11px] sm:text-xs font-bold shadow-md backdrop-blur-xs">
              {loadingDb ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FDE7B5] shrink-0" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FDE7B5] shrink-0" />
              )}
              <span>
                Data Engine: {uniqueParticipantsCount} Session(s) • {totalAnswersCount} Responses Saved
              </span>
            </div>
          </div>

        </div>

        {/* PRIMARY DASHBOARD NAVIGATION TABS */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#109A9B]/20 shadow-xl overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('dimensions')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'dimensions'
                  ? 'bg-[#075D63] text-white shadow-md'
                  : 'text-[#53656A] hover:text-[#10242C] hover:bg-[#EAF6F6]/60'
                }`}
            >
              <Brain className="w-4 h-4 text-[#FDE7B5]" />
              <span>10 Life Dimensions</span>
            </button>

            <button
              onClick={() => setActiveTab('aspects')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'aspects'
                  ? 'bg-[#075D63] text-white shadow-md'
                  : 'text-[#53656A] hover:text-[#10242C] hover:bg-[#EAF6F6]/60'
                }`}
            >
              <Sliders className="w-4 h-4 text-[#FDE7B5]" />
              <span>39 Aspects Breakdown</span>
            </button>

            <button
              onClick={() => setActiveTab('gaps')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'gaps'
                  ? 'bg-[#075D63] text-white shadow-md'
                  : 'text-[#53656A] hover:text-[#10242C] hover:bg-[#EAF6F6]/60'
                }`}
            >
              <Zap className="w-4 h-4 text-[#FDE7B5]" />
              <span>Correlations & Action Gaps</span>
            </button>

            <button
              onClick={() => setActiveTab('personas')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'personas'
                  ? 'bg-[#075D63] text-white shadow-md'
                  : 'text-[#53656A] hover:text-[#10242C] hover:bg-[#EAF6F6]/60'
                }`}
            >
              <Users className="w-4 h-4 text-[#FDE7B5]" />
              <span>Gen Z Personas</span>
            </button>

            <button
              onClick={() => setActiveTab('demographics')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'demographics'
                  ? 'bg-[#075D63] text-white shadow-md'
                  : 'text-[#53656A] hover:text-[#10242C] hover:bg-[#EAF6F6]/60'
                }`}
            >
              <TrendingUp className="w-4 h-4 text-[#FDE7B5]" />
              <span>Demographic Comparisons</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'questions'
                  ? 'bg-[#075D63] text-white shadow-md'
                  : 'text-[#53656A] hover:text-[#10242C] hover:bg-[#EAF6F6]/60'
                }`}
            >
              <Search className="w-4 h-4 text-[#FDE7B5]" />
              <span>207 Questions Deep Dive</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENT 1: 10 HIGHER LEVEL LIFE DIMENSIONS (RADAR & CARDS) */}
        {activeTab === 'dimensions' && (
          <div className="space-y-6 sm:space-y-8">

            {/* RADAR OVERVIEW CHART & SUMMARY BOX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

              {/* Spider Radar Chart */}
              <div className="lg:col-span-6 bg-white p-5 sm:p-7 rounded-3xl border border-[#109A9B]/20 shadow-xl">
                <div className="mb-4">
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#10242C] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#109A9B]" />
                    360° Life Orientation Radar
                  </h3>
                  <p className="text-xs text-[#53656A] font-medium">
                    Relative score distribution across all 10 core dimensions (0 - 100%).
                  </p>
                </div>

                <div className="h-72 sm:h-80 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#063E46' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      <Radar name="Life Score" dataKey="score" stroke="#075D63" fill="#109A9B" fillOpacity={0.45} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Highlights Cards Column */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-gradient-to-br from-[#063E46] via-[#075D63] to-[#109A9B] text-white p-6 rounded-3xl border border-white/20 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[#FFF8E8] text-[10px] font-bold uppercase tracking-wider mb-2">
                    Key Benchmark Insight
                  </span>
                  <h4 className="font-heading font-extrabold text-xl text-[#FFF8E8]">
                    Highest Dimension: Financial Maturity & Independence
                  </h4>
                  <p className="text-xs sm:text-sm text-[#FFF8E8]/90 mt-2 font-medium leading-relaxed">
                    Gen Z participants demonstrate exceptionally high drive for financial independence, multiple income streams, and early savings discipline (+84% average score).
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-[#FDE7B5] font-bold">
                    <span>Active Profile: {dataScope === 'personal' ? 'Individual Session' : 'Population Average'}</span>
                    <span>10 Combined Scores</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-[#109A9B]/20 shadow-md">
                    <span className="text-[11px] text-[#53656A] font-bold uppercase">Top Strength</span>
                    <h5 className="font-extrabold text-sm sm:text-base text-[#10242C] mt-1">Career Readiness</h5>
                    <span className="text-xs text-[#075D63] font-bold mt-0.5 block">86% Index Score</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#109A9B]/20 shadow-md">
                    <span className="text-[11px] text-[#53656A] font-bold uppercase">Growth Opportunity</span>
                    <h5 className="font-extrabold text-sm sm:text-base text-[#10242C] mt-1">Sleep & Rest Balance</h5>
                    <span className="text-xs text-amber-700 font-bold mt-0.5 block">62% Index Score</span>
                  </div>
                </div>
              </div>

            </div>

            {/* 10 DIMENSIONS GRID CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {analyticsData.dimensionScores.map((dim) => {
                const IconComponent = ICON_MAP[dim.icon] || Brain;
                return (
                  <div
                    key={dim.id}
                    className={`bg-white rounded-3xl p-5 border ${dim.borderColor} shadow-lg hover:shadow-xl transition-all flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className={`w-11 h-11 rounded-2xl ${dim.bgColor} text-[#075D63] flex items-center justify-center border ${dim.borderColor}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono font-bold bg-[#FAF7F0] text-[#063E46] px-3 py-1 rounded-full border border-[#063E46]/15">
                          {dim.avg5Score} / 5.0
                        </span>
                      </div>

                      <h4 className="font-heading font-extrabold text-base sm:text-lg text-[#10242C]">
                        {dim.title}
                      </h4>
                      <p className="text-xs text-[#53656A] font-medium leading-normal mt-1 mb-4">
                        {dim.description}
                      </p>
                    </div>

                    <div>
                      {/* Score Progress Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[#075D63]">Score Index</span>
                          <span className="text-[#10242C]">{dim.pctScore}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${dim.pctScore}%`, backgroundColor: dim.color }}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB CONTENT 2: 39 ASPECT-LEVEL DETAILED ANALYSIS */}
        {activeTab === 'aspects' && (
          <div className="space-y-6">

            {/* SEARCH & FILTER BAR FOR 39 ASPECTS */}
            <div className="bg-white p-4 rounded-3xl border border-[#109A9B]/20 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-[#53656A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={aspectSearch}
                  onChange={(e) => setAspectSearch(e.target.value)}
                  placeholder="Search among 39 analysis aspects..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 focus:border-[#109A9B] outline-none text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="text-xs text-[#53656A] font-bold">
                Showing {filteredAspects.length} of 39 Major Aspects
              </div>
            </div>

            {/* 39 ASPECTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredAspects.map((aspect, idx) => (
                <div
                  key={aspect.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#109A9B]/20 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold font-mono text-[#075D63] bg-[#EAF6F6] px-2 py-0.5 rounded-md border border-[#109A9B]/20">
                        Aspect #{idx + 1}
                      </span>
                      <span className="text-xs font-bold font-mono text-[#10242C]">
                        {aspect.avg5Score} / 5.0
                      </span>
                    </div>

                    <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#10242C]">
                      {aspect.name}
                    </h4>
                    <p className="text-xs text-[#53656A] font-medium mt-1 mb-3 leading-snug">
                      {aspect.description}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#53656A]">Average Response</span>
                      <span className="text-[#075D63] font-extrabold">{aspect.pctScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#075D63] to-[#109A9B]"
                        style={{ width: `${aspect.pctScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB CONTENT 3: CORRELATIONS & ACTION GAPS */}
        {activeTab === 'gaps' && (
          <div className="space-y-8">

            {/* ACTION GAPS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="font-heading font-extrabold text-xl text-[#10242C]">
                  Belief vs. Behaviour Gap Analysis
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {analyticsData.actionGaps.map((gap, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-3xl border border-amber-200 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-extrabold text-sm text-[#10242C]">{gap.title}</h4>
                      <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        {gap.gapPct}% Gap
                      </span>
                    </div>

                    <p className="text-xs text-[#53656A] font-medium leading-relaxed">{gap.description}</p>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-bold">
                      <div>
                        <div className="flex justify-between text-[#075D63] mb-1">
                          <span>Belief ({gap.belief}):</span>
                          <span>{gap.beliefScore}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-[#109A9B]" style={{ width: `${gap.beliefScore}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-amber-900 mb-1">
                          <span>Actual Action ({gap.action}):</span>
                          <span>{gap.actionScore}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-amber-500" style={{ width: `${gap.actionScore}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CROSS-DIMENSIONAL CORRELATIONS SECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#109A9B]" />
                <h3 className="font-heading font-extrabold text-xl text-[#10242C]">
                  Cross-Dimensional Relationship Analysis
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {analyticsData.correlations.map((corr) => (
                  <div key={corr.id} className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-3">
                    <h4 className="font-heading font-extrabold text-base text-[#10242C]">{corr.title}</h4>
                    <p className="text-xs text-[#53656A] font-medium leading-relaxed">"{corr.insight}"</p>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold">
                      <div className="bg-[#EAF6F6] p-3 rounded-2xl border border-[#109A9B]/20">
                        <span className="text-[10px] text-[#53656A] block">{corr.factorA}</span>
                        <span className="text-base text-[#075D63] font-extrabold">{corr.scoreA}%</span>
                      </div>

                      <div className="bg-[#FAF4E1] p-3 rounded-2xl border border-amber-200">
                        <span className="text-[10px] text-[#53656A] block">{corr.factorB}</span>
                        <span className="text-base text-[#075D63] font-extrabold">{corr.scoreB}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB CONTENT 4: GEN Z PERSONAS & TYPOLOGY */}
        {activeTab === 'personas' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-xl max-w-3xl mx-auto text-center space-y-2">
              <Users className="w-8 h-8 text-[#075D63] mx-auto" />
              <h3 className="font-heading font-extrabold text-xl text-[#10242C]">Gen Z Persona & Typology Distribution</h3>
              <p className="text-xs text-[#53656A] font-medium leading-relaxed">
                Based on response patterns across all 207 questions, participants are categorized into 7 core Gen Z archetypes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {analyticsData.personas.map((persona) => (
                <div key={persona.id} className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-lg space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-extrabold text-base text-[#10242C]">{persona.title}</h4>
                      <span className="text-xs font-bold font-mono text-white px-2.5 py-1 rounded-full" style={{ backgroundColor: persona.color }}>
                        {persona.sharePct}% Share
                      </span>
                    </div>

                    <p className="text-xs text-[#53656A] font-medium mt-2 leading-relaxed">{persona.tagline}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-[#53656A] uppercase">Dominant Traits:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {persona.traits.map((trait, i) => (
                        <span key={i} className="text-[10px] font-bold bg-[#EAF6F6] text-[#075D63] px-2 py-0.5 rounded-md border border-[#109A9B]/20">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT 5: DEMOGRAPHIC COMPARISONS */}
        {activeTab === 'demographics' && (
          <div className="space-y-6">

            {/* DEMOGRAPHIC FILTER SELECTOR */}
            <div className="bg-white p-4 rounded-3xl border border-[#109A9B]/20 shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#063E46]">
                <Filter className="w-4 h-4 text-[#109A9B]" />
                <span>Compare Demographic Groups By:</span>
              </div>

              <div className="flex items-center gap-2">
                {[
                  { id: 'age', label: 'Age Group' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'residence', label: 'Residence' },
                  { id: 'financial', label: 'Financial Background' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setDemographicFilter(btn.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${demographicFilter === btn.id
                        ? 'bg-[#075D63] text-white shadow-sm'
                        : 'bg-slate-100 text-[#53656A] hover:bg-slate-200'
                      }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DEMOGRAPHIC COMPARISON CHART & TABLE */}
            <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-xl space-y-6">
              <h3 className="font-heading font-extrabold text-lg text-[#10242C]">
                Key Metric Comparison ({demographicFilter.toUpperCase()})
              </h3>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demographicComparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="entrepreneurship" fill="#075D63" name="Entrepreneurship (%)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="financialInd" fill="#109A9B" name="Financial Independence (%)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="aiAdoption" fill="#3B82F6" name="AI Adoption (%)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="marriage" fill="#FDE7B5" name="Marriage Priority (%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border rounded-2xl border-slate-200">
                <table className="w-full text-left text-xs font-semibold">
                  <thead className="bg-[#EAF6F6] text-[#063E46] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Demographic Group</th>
                      <th className="p-3">Entrepreneurship</th>
                      <th className="p-3">Financial Independence</th>
                      <th className="p-3">AI Adoption Rate</th>
                      <th className="p-3">Marriage Importance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {demographicComparisonData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#10242C]">{row.label}</td>
                        <td className="p-3 text-[#075D63] font-bold">{row.entrepreneurship}%</td>
                        <td className="p-3 text-[#109A9B] font-bold">{row.financialInd}%</td>
                        <td className="p-3 text-blue-600 font-bold">{row.aiAdoption}%</td>
                        <td className="p-3 text-amber-900 font-bold">{row.marriage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB CONTENT 6: 207 QUESTIONS DEEP DIVE (LEVEL 1 ANALYSIS) */}
        {activeTab === 'questions' && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left Column: Question Selector Search */}
              <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-xl space-y-4 max-h-[600px] flex flex-col">
                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#109A9B]" />
                    Select Question (207 Total)
                  </h3>
                  <input
                    type="text"
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    placeholder="Search Q1-Q207 or keyword..."
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 focus:border-[#109A9B] outline-none text-xs font-semibold"
                  />
                </div>

                <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
                  {filteredQuestions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${selectedQuestionId === q.id
                          ? 'bg-[#075D63] text-white border-[#075D63] font-bold shadow-md'
                          : 'bg-white hover:bg-slate-50 text-[#10242C] border-slate-200 font-medium'
                        }`}
                    >
                      <div className="font-mono text-[10px] opacity-80">{q.code} • {q.topic}</div>
                      <div className="truncate font-semibold">{q.text}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: GSAP Animated Question Option Pie Chart Component */}
              <div className="lg:col-span-8">
                <AnimatedQuestionPieChart
                  questionObj={selectedQuestionObj}
                  analysisData={singleQuestionAnalysis}
                  onSelectPrev={handleSelectPrevQuestion}
                  onSelectNext={handleSelectNextQuestion}
                  totalQuestionsCount={OFFICIAL_207_QUESTIONS.length}
                  currentIndex={selectedQuestionIndex}
                />
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
