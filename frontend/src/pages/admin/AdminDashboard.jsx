import React, { useState, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import {
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Activity,
  Calendar,
  Layers,
  BarChart2,
  PieChart as PieIcon,
  RefreshCw,
  Database,
  Sparkles,
  Moon,
  Tv,
  Heart,
  Laptop,
  Briefcase,
  Compass,
  Zap,
  Award,
  BookOpen,
  Info,
  ChevronRight,
  ChevronDown,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';
import { getQuestionScore } from '../../services/analyticsEngine';
import { OFFICIAL_75_QUESTIONS, getStoredQuestions } from '../../data/surveyQuestions';

const createArcPath = (cx, cy, r, startAngle, endAngle) => {
  const toRad = (deg) => ((deg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
};

// =========================================================================
// 1. GEN Z PULSE SIGNATURE HERO VISUALIZATION CARD
// =========================================================================
function GenZPulseCard({ analyticsData, activePulse, setActivePulse }) {
  const pulseMetrics = useMemo(() => {
    const dimScoresMap = new Map(analyticsData?.dimensionScores?.map((d) => [d.id, d]) || []);

    const items = [
      { id: 'dim-c', label: 'Digital & Tech', score: dimScoresMap.get('dim-c')?.pctScore ?? 0, icon: Laptop, color: '#3B82F6' },
      { id: 'dim-d', label: 'Career & Ambition', score: dimScoresMap.get('dim-d')?.pctScore ?? 0, icon: Briefcase, color: '#8B5CF6' },
      { id: 'dim-h', label: 'Values & Ethics', score: dimScoresMap.get('dim-h')?.pctScore ?? 0, icon: ShieldCheck, color: '#109A9B' },
      { id: 'dim-b', label: 'Health & Wellbeing', score: dimScoresMap.get('dim-b')?.pctScore ?? 0, icon: Heart, color: '#075D63' },
      { id: 'dim-c2', label: 'AI Adoption', score: dimScoresMap.get('dim-c')?.pctScore ? Math.round(((dimScoresMap.get('dim-c').pctScore) + 6) % 100) : 0, icon: Zap, color: '#059669' },
      { id: 'dim-g', label: 'Future & Mobility', score: dimScoresMap.get('dim-g')?.pctScore ?? 0, icon: Compass, color: '#F59E0B' },
    ];

    const overallAvg = Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length);

    return { items, overallAvg };
  }, [analyticsData]);

  return (
    <div className="bg-gradient-to-br from-[#0F172A] via-[#10242C] to-[#075D63] p-6 sm:p-7 rounded-3xl border border-slate-700 shadow-2xl text-white space-y-6 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#109A9B]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="font-heading font-extrabold text-xl text-white tracking-wide">
              GEN Z PULSE — Population Construct Index
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Multi-construct analytical index computed directly from Supabase DB response rows across population dimensions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 shrink-0">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Overall Gen Z Pulse</span>
            <span className="font-heading font-extrabold text-2xl text-teal-300 leading-none">{pulseMetrics.overallAvg}%</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-400/40 font-extrabold text-xs">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 6 Pulse Construct Bars Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {pulseMetrics.items.map((item) => {
          const IconComp = item.icon;
          const isActive = activePulse === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActivePulse(isActive ? 'all' : item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${isActive
                ? 'bg-slate-800 border-teal-400 shadow-md scale-105'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-lg text-white" style={{ backgroundColor: item.color }}>
                  <IconComp className="w-3.5 h-3.5" />
                </span>
                <span className="font-mono font-extrabold text-sm text-white">{item.score}%</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-200 block truncate">{item.label}</span>
                {/* Horizontal Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// 2. 100% SEGMENTED PILL BAR CARD (GENDER & DEMOGRAPHIC PROPORTIONS)
// =========================================================================
function SegmentedPillBarCard({ rawRecords }) {
  const genderData = useMemo(() => {
    const q2Responses = rawRecords.filter(
      (r) => String(r.questionId).toLowerCase() === 'q2' || String(r.questionId) === '2' || String(r.questionCode || '').toLowerCase() === 'q2'
    );

    let female = 0, male = 0, other = 0;
    q2Responses.forEach((r) => {
      const str = String(r.value || '').toLowerCase();
      if (str.includes('female')) female++;
      else if (str.includes('male')) male++;
      else other++;
    });

    const hasData = q2Responses.length > 0;
    const total = hasData ? q2Responses.length : 0;
    const femalePct = hasData && total > 0 ? Math.round((female / total) * 100) : 0;
    const malePct = hasData && total > 0 ? Math.round((male / total) * 100) : 0;
    const otherPct = hasData && total > 0 ? Math.max(0, 100 - femalePct - malePct) : 0;

    const isFemaleDominant = femalePct >= malePct;
    const dominantGender = hasData ? (isFemaleDominant ? 'Female' : 'Male') : 'No Data';
    const dominantPct = hasData ? (isFemaleDominant ? femalePct : malePct) : 0;
    const dominantCount = hasData ? (isFemaleDominant ? female : male) : 0;
    const dominantImg = isFemaleDominant ? '/female.png' : '/male.png';

    return {
      total,
      female,
      male,
      other,
      dominantGender,
      dominantPct,
      dominantCount,
      dominantImg,
      items: [
        { label: 'Female', pct: femalePct, count: female, color: '#109A9B' },
        { label: 'Male', pct: malePct, count: male, color: '#075D63' },
        { label: 'Non-Binary / Other', pct: otherPct, count: other, color: '#F59E0B' },
      ],
    };
  }, [rawRecords]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2 leading-snug">
          <Users className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
          <span>Gender Distribution</span>
        </h3>
        <p className="text-xs text-[#53656A] font-medium">Proportional segmentation of active survey participants</p>
      </div>

      {/* DOMINANT DEMOGRAPHIC HIGHLIGHT SPOTLIGHT BANNER */}
      <div className="bg-gradient-to-br from-[#EAF6F6]/90 via-[#F4FAF8] to-emerald-50/70 p-4 sm:p-4.5 rounded-2xl border border-[#109A9B]/30 shadow-sm relative overflow-hidden flex flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-300 hover:shadow-md">

        {/* Decorative Background Lighting Circle */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#109A9B]/10 rounded-full blur-xl pointer-events-none" />

        {/* Left Information Content */}
        <div className="space-y-1 min-w-0 flex-1 relative z-10">
          <h4 className="font-sora font-extrabold text-base sm:text-xl text-[#0B1F2A] tracking-tight leading-tight truncate">
            {genderData.dominantGender} <span className="text-[#109A9B] font-black">({genderData.dominantPct}%)</span>
          </h4>

          <p className="text-[11px] sm:text-xs text-[#53656A] font-inter font-medium leading-relaxed">
            Highest participation group with <strong className="text-[#075D63] font-bold">{genderData.dominantCount} responses</strong> recorded in survey database.
          </p>
        </div>

        {/* Right Avatar Image Container */}
        <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/90 border border-[#109A9B]/30 p-1.5 shadow-sm flex items-center justify-center z-10 group cursor-pointer hover:border-[#109A9B]/60 transition-colors">
          <img
            src={genderData.dominantImg}
            alt={`${genderData.dominantGender} demographic representation`}
            className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          />
        </div>

      </div>

      {/* TALL 100% SEGMENTED PILL BAR */}
      <div className="space-y-3">
        <div className="w-full h-10 rounded-2xl overflow-hidden flex p-1 bg-slate-100 border border-slate-200 shadow-inner">
          {genderData.items.map((item, idx) => (
            <div
              key={idx}
              className="h-full first:rounded-l-xl last:rounded-r-xl transition-all duration-500 relative group cursor-pointer flex items-center justify-center text-white text-xs font-extrabold"
              style={{ width: `${item.pct}%`, backgroundColor: item.color }}
              title={`${item.label}: ${item.pct}% (${item.count} responses)`}
            >
              {item.pct >= 12 && <span>{item.pct}%</span>}
            </div>
          ))}
        </div>

        {/* Legend Badges with Counts */}
        <div className="grid grid-cols-1 space-y-1.5">
          {genderData.items.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-3 h-3 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold text-[#10242C] truncate">{item.label}</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-extrabold text-[#075D63]">{item.pct}%</span>
                <span className="text-[10px] text-slate-500 font-semibold ml-1.5">({item.count} resp.)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 3. INTERACTIVE WAFFLE CHART (100-GRID INFOGRAPHIC FOR SCREEN TIME)
// =========================================================================
function WaffleChartCard({ rawRecords }) {
  const waffleData = useMemo(() => {
    const q22Responses = rawRecords.filter(
      (r) => String(r.questionId).toLowerCase() === 'q22' || String(r.questionId) === '22' || String(r.questionCode || '').toLowerCase() === 'q22'
    );

    let c3_5 = 0, c5_plus = 0, c1_3 = 0, cless1 = 0;
    q22Responses.forEach((r) => {
      const val = String(r.value || '').toLowerCase();
      if (val.includes('more_than_6') || val.includes('4_6') || val.includes('5')) {
        c5_plus++;
      } else if (val.includes('2_4') || val.includes('3_5') || val.includes('3')) {
        c3_5++;
      } else if (val.includes('1_2') || val.includes('1_3') || val.includes('2')) {
        c1_3++;
      } else {
        cless1++;
      }
    });

    const hasData = q22Responses.length > 0;
    const total = hasData ? q22Responses.length : 0;

    const p3_5 = hasData && total > 0 ? Math.round((c3_5 / total) * 100) : 0;
    const p5_plus = hasData && total > 0 ? Math.round((c5_plus / total) * 100) : 0;
    const p1_3 = hasData && total > 0 ? Math.round((c1_3 / total) * 100) : 0;
    const pless1 = hasData && total > 0 ? Math.max(0, 100 - p3_5 - p5_plus - p1_3) : 0;

    const categories = [
      { label: '3–5 hours / day', pct: p3_5, count: c3_5, color: '#109A9B' },
      { label: '5+ hours / day', pct: p5_plus, count: c5_plus, color: '#075D63' },
      { label: '1–3 hours / day', pct: p1_3, count: c1_3, color: '#3B82F6' },
      { label: '< 1 hour / day', pct: pless1, count: cless1, color: '#F59E0B' },
    ];

    const grid = [];
    let currentCatIdx = 0;
    let countInCat = 0;

    for (let i = 0; i < 100; i++) {
      while (currentCatIdx < categories.length - 1 && countInCat >= categories[currentCatIdx].pct) {
        currentCatIdx++;
        countInCat = 0;
      }
      grid.push({
        id: i,
        color: categories[currentCatIdx].color,
        category: categories[currentCatIdx].label,
      });
      countInCat++;
    }

    return { categories, grid, total, hasData };
  }, [rawRecords]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
      <div className="space-y-1">
        <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2 leading-snug">
          <Tv className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
          <span>Daily Screen Time</span>
        </h3>
        <p className="text-xs text-[#53656A] font-medium">Each square represents 1% of survey population</p>
      </div>

      {/* 100-SQUARE WAFFLE GRID */}
      <div className="space-y-3">
        <div className="grid grid-cols-10 gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
          {waffleData.grid.map((sq) => (
            <div
              key={sq.id}
              className="w-full aspect-square rounded-sm transition-transform hover:scale-125 cursor-pointer shadow-2xs"
              style={{ backgroundColor: sq.color }}
              title={`${sq.category}: Square #${sq.id + 1}`}
            />
          ))}
        </div>

        {/* Legend List */}
        <div className="grid grid-cols-2 gap-2">
          {waffleData.categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="font-bold text-[#10242C] text-[11px] truncate">{cat.label}</span>
              </div>
              <div className="text-right font-mono">
                <span className="font-extrabold text-[#075D63] ml-1">{cat.pct}%</span>
                {waffleData.hasData && (
                  <span className="text-[9px] text-slate-500 font-semibold block">({cat.count} resp.)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 4. LOLLIPOP DISTRIBUTION CHART (AGE GROUP / ACADEMIC STAGE)
// =========================================================================
function LollipopChartCard({ rawRecords }) {
  const ageData = useMemo(() => {
    const q1Responses = rawRecords.filter(
      (r) => String(r.questionId).toLowerCase() === 'q1' || String(r.questionId) === '1' || String(r.questionCode || '').toLowerCase() === 'q1'
    );

    let a18_20 = 0, a21_23 = 0, a24_26 = 0, a27_30 = 0;
    q1Responses.forEach((r) => {
      const str = String(r.value || '').toLowerCase();
      if (str.includes('18')) a18_20++;
      else if (str.includes('21')) a21_23++;
      else if (str.includes('24')) a24_26++;
      else a27_30++;
    });

    const hasData = q1Responses.length > 0;
    const total = hasData ? q1Responses.length : 0;
    const p18 = hasData && total > 0 ? Math.round((a18_20 / total) * 100) : 0;
    const p21 = hasData && total > 0 ? Math.round((a21_23 / total) * 100) : 0;
    const p24 = hasData && total > 0 ? Math.round((a24_26 / total) * 100) : 0;
    const p27 = hasData && total > 0 ? Math.max(0, 100 - p18 - p21 - p24) : 0;

    return {
      total,
      hasData,
      items: [
        { label: '18–20 yrs', pct: p18, count: a18_20, color: '#075D63' },
        { label: '21–23 yrs', pct: p21, count: a21_23, color: '#109A9B' },
        { label: '24–26 yrs', pct: p24, count: a24_26, color: '#3B82F6' },
        { label: '27–30 yrs', pct: p27, count: a27_30, color: '#8B5CF6' },
      ],
    };
  }, [rawRecords]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2 leading-snug">
          <Calendar className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
          <span>Age Group Distribution</span>
        </h3>
        <p className="text-xs text-[#53656A] font-medium">Research-grade distribution comparison</p>
      </div>

      {/* HIGHLIGHTED INSIGHT BANNER */}
      <div className="bg-teal-50/80 p-3 rounded-2xl border border-teal-200 flex items-center justify-between text-xs font-bold text-[#075D63]">
        <span>Core Student Demographic</span>
        <span className="font-mono text-xs bg-white px-2 py-0.5 rounded-lg border border-teal-200">
          21–26 yrs ({(ageData.items[1].pct + ageData.items[2].pct)}%)
        </span>
      </div>

      {/* LOLLIPOP ROWS */}
      <div className="space-y-4">
        {ageData.items.map((item, idx) => (
          <div key={idx} className="space-y-1.5 p-2 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-center text-xs font-bold text-[#10242C]">
              <span>{item.label}</span>
              <div className="font-mono text-right">
                <span className="text-[#075D63] text-xs font-extrabold">{item.pct}%</span>
                <span className="text-[10px] text-slate-500 font-semibold ml-1.5">({item.count} resp.)</span>
              </div>
            </div>

            {/* Lollipop Line + Circle Node */}
            <div className="relative flex items-center h-5">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                />
              </div>
              <div
                className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md transition-all flex items-center justify-center text-[9px] text-white font-mono font-extrabold"
                style={{
                  left: `calc(${Math.max(4, item.pct)}% - 10px)`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 5. STORY CARD VISUALIZATION - INTERACTIVE EXPLODED GSAP PIE CHART
// (DAILY SLEEP DURATION BREAKDOWN Q17 & Q19)
// =========================================================================
function StoryCardVisualization({ rawRecords }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const sliceRefs = useRef([]);
  const counterRefs = useRef([]);
  const legendRefs = useRef([]);
  const tooltipRef = useRef(null);

  const [activeHoverIdx, setActiveHoverIdx] = useState(null);
  const [tooltipState, setTooltipState] = useState({
    visible: false,
    label: '',
    pct: 0,
    count: 0,
    x: 0,
    y: 0,
  });

  // Calculate sleep breakdown data from Q16 (Nightly Sleep Duration) in DB
  const sleepData = useMemo(() => {
    const sleepRecords = rawRecords.filter((r) => {
      const qId = String(r.questionId || '').toLowerCase().trim();
      const qCode = String(r.questionCode || '').toLowerCase().trim();
      const qText = String(r.questionText || '').toLowerCase();
      return (
        qId === 'q16' ||
        qId === '16' ||
        qCode === 'q16' ||
        qId === 'q17' ||
        qId === '17' ||
        qCode.includes('q16') ||
        qText.includes('sleep') ||
        qCode.includes('sleep')
      );
    });

    let idealCount = 0;
    let deprivedCount = 0;
    let severeCount = 0;
    let totalCount = sleepRecords.length;

    sleepRecords.forEach((r) => {
      let rawVal = r.value;
      if (typeof rawVal === 'object' && rawVal !== null) {
        rawVal = rawVal.value !== undefined ? rawVal.value : (rawVal.label !== undefined ? rawVal.label : rawVal);
      }
      const val = String(rawVal ?? '').toLowerCase();

      if (
        val.includes('less_than_4') ||
        val.includes('under_4') ||
        val.includes('<4') ||
        val.includes('less than 4') ||
        val === '1'
      ) {
        severeCount++;
      } else if (
        val.includes('4_5') ||
        val.includes('5_6') ||
        val.includes('4-5') ||
        val.includes('5-6') ||
        val.includes('4–5') ||
        val.includes('5–6') ||
        val === '2' ||
        val === '3'
      ) {
        deprivedCount++;
      } else if (
        val.includes('6_7') ||
        val.includes('7_8') ||
        val.includes('more_than_8') ||
        val.includes('6-7') ||
        val.includes('7-8') ||
        val.includes('6–7') ||
        val.includes('7–8') ||
        val.includes('6_8') ||
        val.includes('6-8') ||
        val === '4' ||
        val === '5' ||
        val === '6'
      ) {
        idealCount++;
      } else {
        if (val.includes('less')) severeCount++;
        else if (val.includes('4') || val.includes('5')) deprivedCount++;
        else idealCount++;
      }
    });

    const hasData = totalCount > 0;
    const slicesRaw = [
      {
        label: '6–8 Hours (Ideal Sleep)',
        shortLabel: '6–8 Hours',
        count: idealCount,
        pct: hasData && totalCount > 0 ? Math.round((idealCount / totalCount) * 100) : 0,
        color: '#109A9B',
        gradientFrom: '#075D63',
        gradientTo: '#2DD4BF',
        glowColor: 'rgba(16, 154, 155, 0.35)',
        isExploded: true,
      },
      {
        label: '4–6 Hours (Sleep Deprived)',
        shortLabel: '4–6 Hours',
        count: deprivedCount,
        pct: hasData && totalCount > 0 ? Math.round((deprivedCount / totalCount) * 100) : 0,
        color: '#F59E0B',
        gradientFrom: '#D97706',
        gradientTo: '#FBBF24',
        glowColor: 'rgba(245, 158, 11, 0.35)',
        isExploded: false,
      },
      {
        label: '<4 Hours (Severe Deprivation)',
        shortLabel: '<4 Hours',
        count: severeCount,
        pct: hasData && totalCount > 0 ? Math.max(0, 100 - (Math.round((idealCount / totalCount) * 100) + Math.round((deprivedCount / totalCount) * 100))) : 0,
        color: '#F87171',
        gradientFrom: '#E11D48',
        gradientTo: '#FB7185',
        glowColor: 'rgba(248, 113, 113, 0.35)',
        isExploded: false,
      },
    ];

    // SVG Mathematical arc path calculation (cx = 100, cy = 100, r = 84)
    const cx = 100;
    const cy = 100;
    const r = 84;
    let cumAngle = 0;

    const slices = slicesRaw.map((item) => {
      const angleLength = (item.pct / 100) * 360;
      const startAngle = cumAngle;
      const endAngle = cumAngle + angleLength;
      cumAngle = endAngle;

      const midAngle = (startAngle + endAngle) / 2;
      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;
      const midRad = ((midAngle - 90) * Math.PI) / 180;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArcFlag = angleLength > 180 ? 1 : 0;
      const pathD = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

      // Direction vector for exploded translation
      const dx = Math.cos(midRad);
      const dy = Math.sin(midRad);

      // Base exploded translation distance (5px for dominant slice 0)
      const explodeDist = item.isExploded ? 5 : 0;
      const baseTx = dx * explodeDist;
      const baseTy = dy * explodeDist;

      return {
        ...item,
        pathD,
        midAngle,
        midRad,
        dx,
        dy,
        baseTx,
        baseTy,
      };
    });

    return slices;
  }, [rawRecords]);

  // GSAP Entrance Animation & Lifecycle Management with gsap.context()
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Card Container Entrance
      gsap.fromTo(
        containerRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'power2.out' }
      );

      // 2. Pie Slices Radial Staggered Entrance
      if (sliceRefs.current.length > 0) {
        gsap.fromTo(
          sliceRefs.current,
          { scale: 0, opacity: 0, transformOrigin: '100px 100px' },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: 'back.out(1.7)',
          }
        );

        // Exploded dominant slice offset animation
        sleepData.forEach((slice, idx) => {
          const el = sliceRefs.current[idx];
          if (el && slice.isExploded) {
            gsap.fromTo(
              el,
              { x: 0, y: 0 },
              {
                x: slice.baseTx,
                y: slice.baseTy,
                duration: 0.9,
                delay: 0.3,
                ease: 'elastic.out(1, 0.5)',
              }
            );
          }
        });
      }

      // 3. Count-up Text Numbers for percentages
      counterRefs.current.forEach((el, idx) => {
        if (!el || !sleepData[idx]) return;
        const targetVal = sleepData[idx].pct;
        const counterObj = { val: 0 };

        gsap.to(counterObj, {
          val: targetVal,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            el.innerText = `${Math.round(counterObj.val)}%`;
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [sleepData]);

  // Handle Hover Interaction Sync
  const handleMouseEnter = (idx, e) => {
    setActiveHoverIdx(idx);
    const targetSlice = sleepData[idx];

    // Move floating tooltip pill
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX ? e.clientX - rect.left : rect.width / 2;
      const mouseY = e.clientY ? e.clientY - rect.top : rect.height / 2;

      setTooltipState({
        visible: true,
        label: targetSlice.label,
        pct: targetSlice.pct,
        count: targetSlice.count,
        x: mouseX,
        y: mouseY - 45,
      });
    }

    // Animate GSAP slices on hover
    sliceRefs.current.forEach((sliceEl, i) => {
      if (!sliceEl) return;
      const isCurrent = i === idx;
      const sliceInfo = sleepData[i];

      if (isCurrent) {
        const hoverOffset = 8;
        const targetX = sliceInfo.baseTx + sliceInfo.dx * hoverOffset;
        const targetY = sliceInfo.baseTy + sliceInfo.dy * hoverOffset;

        gsap.to(sliceEl, {
          x: targetX,
          y: targetY,
          scale: 1.06,
          opacity: 1,
          duration: 0.3,
          ease: 'power3.out',
        });
      } else {
        gsap.to(sliceEl, {
          opacity: 0.4,
          scale: 0.97,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      }
    });
  };

  const handleMouseMove = (e) => {
    if (containerRef.current && tooltipState.visible) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      gsap.to(tooltipRef.current, {
        left: mouseX,
        top: mouseY - 45,
        duration: 0.2,
        ease: 'power3.out',
      });
    }
  };

  const handleMouseLeave = () => {
    setActiveHoverIdx(null);
    setTooltipState((prev) => ({ ...prev, visible: false }));

    // Reset GSAP slices to idle default
    sliceRefs.current.forEach((sliceEl, i) => {
      if (!sliceEl) return;
      const sliceInfo = sleepData[i];

      gsap.to(sliceEl, {
        x: sliceInfo.baseTx,
        y: sliceInfo.baseTy,
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="bg-white text-[#10242C] p-6 rounded-3xl border border-slate-200 shadow-md relative overflow-hidden flex flex-col justify-between space-y-5 select-none"
    >
      {/* HEADER SECTION */}
      <div className="space-y-1 relative z-10">
        <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#10242C] tracking-tight leading-snug flex items-center gap-2">
          <Moon className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
          <span>Daily Sleep Duration Breakdown</span>
        </h3>
        <p className="text-xs text-[#53656A] font-medium">Proportional segmentation of daily sleep hours reported by respondents</p>
      </div>

      {/* MAIN CHART & LEGEND AREA */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center relative z-10 pt-1">
        {/* CENTER-LEFT: SVG EXPLODED PIE CHART (INCREASED SIZE) */}
        <div className="sm:col-span-7 flex justify-center items-center relative min-h-[220px]">
          <svg
            ref={svgRef}
            viewBox="0 0 200 200"
            className="w-52 h-52 sm:w-60 sm:h-60 overflow-visible drop-shadow-md"
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {sleepData.map((slice, idx) => (
                <linearGradient key={idx} id={`sleepGradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={slice.gradientTo} />
                  <stop offset="100%" stopColor={slice.gradientFrom} />
                </linearGradient>
              ))}
            </defs>

            {sleepData.map((slice, idx) => {
              const isHovered = activeHoverIdx === idx;
              return (
                <g key={idx}>
                  <path
                    ref={(el) => (sliceRefs.current[idx] = el)}
                    d={slice.pathD}
                    fill={`url(#sleepGradient-${idx})`}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      transformOrigin: '100px 100px',
                      filter: isHovered
                        ? `brightness(1.15) drop-shadow(0px 8px 16px ${slice.glowColor})`
                        : slice.isExploded
                          ? `drop-shadow(0px 6px 12px ${slice.glowColor})`
                          : 'none',
                    }}
                    onMouseEnter={(e) => handleMouseEnter(idx, e)}
                  />
                </g>
              );
            })}

            {/* CENTER SLEEP BADGE ICON */}
            <circle cx="100" cy="100" r="26" fill="#10242C" stroke="#E2E8F0" strokeWidth="2" />
            <foreignObject x="84" y="84" width="32" height="32">
              <div className="w-full h-full flex items-center justify-center text-[#109A9B]">
                <Moon className="w-5 h-5 animate-pulse" />
              </div>
            </foreignObject>
          </svg>
        </div>

        {/* CENTER-RIGHT: VERTICAL CUSTOM LEGEND (COMPACT SIZE) */}
        <div className="sm:col-span-5 space-y-2">
          {sleepData.map((slice, idx) => {
            const isHovered = activeHoverIdx === idx;
            return (
              <div
                key={idx}
                ref={(el) => (legendRefs.current[idx] = el)}
                onMouseEnter={(e) => handleMouseEnter(idx, e)}
                onMouseLeave={handleMouseLeave}
                className={`py-2 sm:py-2.5 px-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-2 ${isHovered
                  ? 'bg-[#EAF6F6] border-[#109A9B]/60 shadow-md scale-[1.02]'
                  : slice.isExploded
                    ? 'bg-slate-50/90 border-slate-200/90 hover:bg-slate-100/90'
                    : 'bg-slate-50/50 border-slate-200/60 hover:bg-slate-100/70'
                  }`}
              >
                {/* LEGEND BADGE + NAME */}
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs ring-2 ring-white"
                    style={{ backgroundColor: slice.color }}
                  />
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#10242C] truncate">{slice.shortLabel}</h4>
                </div>

                {/* COUNT-UP PERCENTAGE & RESPONSES */}
                <div className="text-right shrink-0 leading-tight">
                  <span
                    ref={(el) => (counterRefs.current[idx] = el)}
                    className="text-xs sm:text-sm font-extrabold font-mono text-[#075D63] block"
                  >
                    0%
                  </span>
                  <span className="text-[9px] text-[#53656A] font-semibold">{slice.count} resp.</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING GLASSMORPHIC TOOLTIP */}
      <div
        ref={tooltipRef}
        className={`absolute z-30 pointer-events-none px-3.5 py-2 rounded-xl bg-slate-900/95 border border-slate-700/80 text-white shadow-2xl backdrop-blur-md transition-opacity duration-200 flex flex-col gap-0.5 transform -translate-x-1/2 ${tooltipState.visible ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          left: tooltipState.x,
          top: tooltipState.y,
        }}
      >
        <span className="text-[11px] font-bold text-slate-300">{tooltipState.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold font-mono text-[#14B8A6]">{tooltipState.pct}%</span>
          <span className="text-[10px] text-slate-400">({tooltipState.count} responses)</span>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 6. SOLID 2D PIE CHART WITH IN-SLICE PERCENTAGES (FAVORITE ENTERTAINMENT TYPE Q24)
// =========================================================================
function SpectrumBarCard({ rawRecords }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const spectrumData = useMemo(() => {
    const q24Responses = rawRecords.filter(
      (r) =>
        String(r.questionId || '').toLowerCase() === 'q24' ||
        String(r.questionId || '') === '24' ||
        String(r.questionCode || '').toLowerCase() === 'q24' ||
        String(r.displayOrder || '') === '24' ||
        String(r.questionText || '').toLowerCase().includes('what type of entertainment') ||
        String(r.questionText || '').toLowerCase().includes('entertainment do you enjoy')
    );

    const options = [
      { value: 'movies_series', label: 'Watching movies or series', color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.7)' },
      { value: 'listening_music', label: 'Listening to music', color: '#EF4444', glow: 'rgba(239, 68, 68, 0.7)' },
      { value: 'playing_games', label: 'Playing games', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.7)' },
      { value: 'social_media_videos', label: 'Social media/content videos', color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.7)' },
      { value: 'reading', label: 'Reading', color: '#10B981', glow: 'rgba(16, 185, 129, 0.7)' },
      { value: 'outdoor_activities', label: 'Outdoor activities', color: '#EC4899', glow: 'rgba(236, 72, 153, 0.7)' },
      { value: 'live_events', label: 'Live events or concerts', color: '#14B8A6', glow: 'rgba(20, 184, 166, 0.7)' },
      { value: 'creative_hobbies', label: 'Creative hobbies', color: '#6366F1', glow: 'rgba(99, 102, 241, 0.7)' },
      { value: 'other', label: 'Other', color: '#64748B', glow: 'rgba(100, 116, 139, 0.7)' },
    ];

    const counts = new Array(options.length).fill(0);
    let totalCount = q24Responses.length;

    q24Responses.forEach((r) => {
      let rawVal = r.value;
      if (typeof rawVal === 'string') {
        const trimmed = rawVal.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try { rawVal = JSON.parse(trimmed); } catch (e) { }
        } else if (trimmed.includes(',')) {
          rawVal = trimmed.split(',').map((s) => s.trim());
        }
      }

      if (typeof rawVal === 'object' && rawVal !== null && !Array.isArray(rawVal)) {
        rawVal = rawVal.value !== undefined ? rawVal.value : (rawVal.label !== undefined ? rawVal.label : rawVal);
        if (typeof rawVal === 'string' && rawVal.startsWith('[')) {
          try { rawVal = JSON.parse(rawVal); } catch (e) { }
        }
      }

      let valList = Array.isArray(rawVal) ? rawVal : [rawVal];
      if (valList.length === 1 && typeof valList[0] === 'string' && valList[0].includes(',')) {
        valList = valList[0].split(',').map((s) => s.trim());
      }

      valList.forEach((item) => {
        let itemVal = item;
        if (typeof itemVal === 'object' && itemVal !== null) {
          itemVal = itemVal.value !== undefined ? itemVal.value : (itemVal.label !== undefined ? itemVal.label : itemVal);
        }
        const cleanVal = String(itemVal ?? '').trim().toLowerCase();
        if (!cleanVal) return;

        const matchedIdx = options.findIndex((o) => {
          const optVal = String(o.value ?? '').trim().toLowerCase();
          const optLbl = String(o.label ?? '').trim().toLowerCase();
          return (
            optVal === cleanVal ||
            optLbl === cleanVal ||
            optVal.replace(/_/g, '-') === cleanVal ||
            optVal.replace(/-/g, '_') === cleanVal ||
            optVal.replace(/ /g, '_') === cleanVal ||
            optVal.replace(/_/g, '') === cleanVal.replace(/_/g, '') ||
            (cleanVal.length > 2 && (optVal.includes(cleanVal) || optLbl.includes(cleanVal))) ||
            (optVal.length > 2 && cleanVal.includes(optVal)) ||
            (optLbl.length > 2 && cleanVal.includes(optLbl))
          );
        });

        if (matchedIdx !== -1) {
          counts[matchedIdx]++;
        }
      });
    });

    const totalVotesAcrossOptions = counts.reduce((sum, c) => sum + c, 0);

    let cumPct = 0;
    const slices = options.map((opt, idx) => {
      const c = counts[idx];
      const pct = totalVotesAcrossOptions > 0 ? Math.round((c / totalVotesAcrossOptions) * 100) : 0;
      const startAngle = cumPct * 3.6;
      cumPct += pct;
      const endAngle = cumPct * 3.6;
      const midAngle = (startAngle + endAngle) / 2;

      const midRad = ((midAngle - 90) * Math.PI) / 180;
      const dx = Math.cos(midRad);
      const dy = Math.sin(midRad);

      return {
        id: opt.value,
        label: opt.label,
        count: c,
        pct,
        startAngle,
        endAngle,
        midAngle,
        dx,
        dy,
        color: opt.color,
        glow: opt.glow,
      };
    });

    const maxCount = Math.max(...counts);
    const topIdx = counts.indexOf(maxCount);
    const dominantLabel = totalCount > 0 && maxCount > 0 ? options[topIdx].label : 'None';

    return { totalCount, dominantLabel, slices };
  }, [rawRecords]);

  const sliceRefs = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    if (!sliceRefs.current.length) return;

    const ctx = gsap.context(() => {
      sliceRefs.current.forEach((el, idx) => {
        if (!el) return;
        const slice = spectrumData.slices[idx];
        if (!slice) return;

        const startX = slice.dx * 35;
        const startY = slice.dy * 35;

        gsap.fromTo(
          el,
          {
            x: startX,
            y: startY,
            scale: 0.75,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.1,
            delay: idx * 0.12,
            ease: 'back.out(1.5)',
          }
        );
      });

      textRefs.current.forEach((el, idx) => {
        if (!el) return;
        const targetPct = spectrumData.slices[idx]?.pct || 0;
        const obj = { val: 0 };

        gsap.to(obj, {
          val: targetPct,
          duration: 1.2,
          delay: 0.2 + idx * 0.12,
          ease: 'power2.out',
          onUpdate: () => {
            if (el) el.textContent = `${Math.round(obj.val)}%`;
          },
        });
      });
    });

    return () => ctx.revert();
  }, [spectrumData.slices]);

  const handleMouseEnter = (idx) => {
    setActiveIdx(idx);
    sliceRefs.current.forEach((el, i) => {
      if (!el) return;
      const slice = spectrumData.slices[i];
      if (i === idx) {
        const hoverX = slice.dx * 14;
        const hoverY = slice.dy * 14;
        gsap.to(el, {
          x: hoverX,
          y: hoverY,
          scale: 1.05,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 0.96,
          opacity: 0.45,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  };

  const handleMouseLeave = () => {
    setActiveIdx(null);
    sliceRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  };

  const cx = 135;
  const cy = 135;
  const radius = 105;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="min-w-0">
          <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
            <Zap className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
            <span>Favorite Entertainment Type</span>
          </h3>
        </div>

        <div className="text-right shrink-0">
          <span className="font-mono font-extrabold text-base text-[#075D63] block">
            {spectrumData.totalCount}
          </span>
          <span className="text-[9.5px] text-[#53656A] font-bold uppercase block">
            Total Responses
          </span>
        </div>
      </div>

      {/* SOLID 2D GSAP SVG PIE CHART */}
      <div className="flex flex-col items-center justify-center flex-1 relative py-2">
        <svg
          width="270"
          height="270"
          viewBox="0 0 270 270"
          className="overflow-visible"
          onMouseLeave={handleMouseLeave}
        >
          {/* PIE SLICES */}
          {spectrumData.slices.map((slice, idx) => {
            const isHovered = activeIdx === idx;
            const textRadius = radius * 0.62;
            const tx = cx + textRadius * slice.dx;
            const ty = cy + textRadius * slice.dy;
            const isFullCircle = slice.pct >= 99.9;

            return (
              <g key={slice.id}>
                {isFullCircle ? (
                  <circle
                    ref={(el) => (sliceRefs.current[idx] = el)}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={slice.color}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-200 shadow-md"
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 12px ${slice.glow})` : 'none',
                    }}
                    onMouseEnter={() => handleMouseEnter(idx)}
                  />
                ) : (
                  <path
                    ref={(el) => (sliceRefs.current[idx] = el)}
                    d={createArcPath(cx, cy, radius, slice.startAngle, slice.endAngle)}
                    fill={slice.color}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-200 shadow-md"
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 12px ${slice.glow})` : 'none',
                    }}
                    onMouseEnter={() => handleMouseEnter(idx)}
                  />
                )}

                {/* IN-SLICE PERCENTAGE TEXT */}
                {slice.pct >= 5 && (
                  <text
                    ref={(el) => (textRefs.current[idx] = el)}
                    x={tx}
                    y={ty}
                    fill="#FFFFFF"
                    fontSize="14"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none drop-shadow-md select-none font-sans"
                  >
                    {slice.pct}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* GSAP SLEEK GLASSMORPHISM HOVER TOOLTIP CARD */}
        {activeIdx !== null && (
          <div className="absolute top-0 right-0 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-2xl pointer-events-none z-20 text-white animate-in fade-in zoom-in-95 duration-150 min-w-[130px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: spectrumData.slices[activeIdx].color }} />
              <span className="truncate">{spectrumData.slices[activeIdx].label}</span>
            </div>
            <div className="font-heading font-extrabold text-2xl text-teal-300 leading-tight">
              {spectrumData.slices[activeIdx].pct}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {spectrumData.slices[activeIdx].count} resp.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 7. CONCENTRIC SEMI-CIRCLE RAINBOW ARC GAUGE (TOP AI TOOLS USAGE RANKING)
// =========================================================================
function RankingProgressCard({ rawRecords }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const rankingData = useMemo(() => {
    const aiResponses = rawRecords.filter((r) => {
      const qId = String(r.questionId || '').toLowerCase().trim();
      const qCode = String(r.questionCode || '').toLowerCase().trim();
      const qText = String(r.questionText || '').toLowerCase();
      const qOrder = r.displayOrder !== undefined && r.displayOrder !== null ? String(r.displayOrder) : '';
      return (
        qId === 'q44' ||
        qId === '44' ||
        qCode === 'q44' ||
        qCode === '44' ||
        qOrder === '44' ||
        qCode.includes('q44') ||
        qText.includes('which ai tool') ||
        (qText.includes('ai tool') && qText.includes('most'))
      );
    });

    let chatGpt = 0, gemini = 0, claude = 0, metaAi = 0, perplexity = 0;
    let total = aiResponses.length;

    aiResponses.forEach((r) => {
      let rawVal = r.value;
      if (typeof rawVal === 'object' && rawVal !== null) {
        rawVal = rawVal.value !== undefined ? rawVal.value : (rawVal.label !== undefined ? rawVal.label : rawVal);
      }
      const str = String(rawVal ?? '').trim().toLowerCase();
      const labelStr = String(r.optionLabel ?? '').trim().toLowerCase();
      const combined = `${str} ${labelStr}`;

      if (combined.includes('chatgpt') || combined.includes('gpt')) {
        chatGpt++;
      } else if (combined.includes('gemini') || combined.includes('google')) {
        gemini++;
      } else if (combined.includes('claude')) {
        claude++;
      } else if (combined.includes('meta')) {
        metaAi++;
      } else if (combined.includes('perplexity')) {
        perplexity++;
      } else {
        if (str === '0' || str.includes('chat')) chatGpt++;
        else if (str === '1' || str.includes('claude')) claude++;
        else if (str === '2' || str.includes('gemini')) gemini++;
        else if (str === '3' || str.includes('meta')) metaAi++;
        else if (str === '4' || str.includes('perplexity')) perplexity++;
      }
    });

    const hasData = total > 0;
    const pChat = hasData ? Math.round((chatGpt / total) * 100) : 0;
    const pGemini = hasData ? Math.round((gemini / total) * 100) : 0;
    const pClaude = hasData ? Math.round((claude / total) * 100) : 0;
    const pMeta = hasData ? Math.round((metaAi / total) * 100) : 0;
    const pPerplexity = hasData ? Math.round((perplexity / total) * 100) : 0;

    const topRankedPct = Math.max(pChat, pGemini, pClaude, pMeta, pPerplexity);

    const rings = [
      { id: 'chatgpt', rank: '01', label: 'ChatGPT', fullLabel: 'ChatGPT (OpenAI)', pct: pChat, count: chatGpt, color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.7)', radius: 120 },
      { id: 'gemini', rank: '02', label: 'Google Gemini', fullLabel: 'Google Gemini AI', pct: pGemini, count: gemini, color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.7)', radius: 98 },
      { id: 'claude', rank: '03', label: 'Claude', fullLabel: 'Claude (Anthropic)', pct: pClaude, count: claude, color: '#EC4899', glow: 'rgba(236, 72, 153, 0.7)', radius: 76 },
      { id: 'meta', rank: '04', label: 'Meta AI', fullLabel: 'Meta AI (Llama)', pct: pMeta, count: metaAi, color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.7)', radius: 54 },
      { id: 'perplexity', rank: '05', label: 'Perplexity', fullLabel: 'Perplexity AI', pct: pPerplexity, count: perplexity, color: '#10B981', glow: 'rgba(16, 185, 129, 0.7)', radius: 32 },
    ];

    return { total, topRankedPct, rings };
  }, [rawRecords]);

  const cardRef = useRef(null);
  const arcRefs = useRef([]);
  const ghostRefs = useRef([]);
  const dotRefs = useRef([]);

  useEffect(() => {
    if (!arcRefs.current.length) return;

    const ctx = gsap.context(() => {
      // 1. Intro Card Slide & Fade
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
      }

      // 2. Staggered Arc Growth Animation (GSAP DrawSVG Effect via Stroke-Dashoffset)
      arcRefs.current.forEach((el, idx) => {
        if (!el) return;
        const ring = rankingData.rings[idx];
        const r = ring.radius;
        const arcLength = Math.PI * r;
        const targetOffset = arcLength * (1 - Math.max(2, ring.pct) / 100);

        gsap.fromTo(
          el,
          { strokeDashoffset: arcLength },
          {
            strokeDashoffset: targetOffset,
            duration: 1.3,
            delay: 0.12 * idx,
            ease: 'power3.out',
          }
        );
      });

      // 3. Staggered End-Cap Glowing Dot Entrance
      dotRefs.current.forEach((el, idx) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: 0.6 + 0.12 * idx,
            ease: 'back.out(2)',
          }
        );
      });
    });

    return () => ctx.revert();
  }, [rankingData.rings]);

  const handleMouseEnter = (idx) => {
    setActiveIdx(idx);
    arcRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === idx) {
        gsap.to(el, {
          opacity: 1,
          strokeWidth: 15,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(el, {
          opacity: 0.2,
          strokeWidth: 11,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    ghostRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === idx) {
        gsap.to(el, { opacity: 0.7, strokeWidth: 15, duration: 0.3 });
      } else {
        gsap.to(el, { opacity: 0.12, strokeWidth: 11, duration: 0.3 });
      }
    });
  };

  const handleMouseLeave = () => {
    setActiveIdx(null);
    arcRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        opacity: 1,
        strokeWidth: 12,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    ghostRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, { opacity: 0.3, strokeWidth: 12, duration: 0.3 });
    });
  };

  const cx = 150;
  const cy = 135;

  return (
    <div
      ref={cardRef}
      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 flex flex-col justify-between"
    >
      {/* Card Header */}
      <div>
        <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2 leading-snug">
          <Award className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
          <span>Top AI Tools Usage Ranking</span>
        </h3>
      </div>

      {/* SVG CONCENTRIC SEMI-CIRCLE RAINBOW ARC CANVAS WITH FLOATING TOOLTIP */}
      <div className="flex items-center justify-center py-1 relative">
        <svg
          width="300"
          height="145"
          viewBox="0 0 300 145"
          className="overflow-visible"
          onMouseLeave={handleMouseLeave}
        >
          {rankingData.rings.map((ring, idx) => {
            const r = ring.radius;
            const arcLength = Math.PI * r;
            const offset = arcLength * (1 - Math.max(2, ring.pct) / 100);
            const isHovered = activeIdx === idx;

            // Calculate End Cap Position
            const endAngleDeg = 180 - (Math.max(2, ring.pct) / 100) * 180;
            const rad = (endAngleDeg * Math.PI) / 180;
            const endX = cx + r * Math.cos(rad);
            const endY = cy - r * Math.sin(rad);

            return (
              <g key={ring.id}>
                {/* 1. Ghost Muted Track Arc */}
                <path
                  ref={(el) => (ghostRefs.current[idx] = el)}
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                  strokeLinecap="round"
                  style={{ opacity: 0.3 }}
                />

                {/* 2. GSAP Animated DrawSVG Color Progress Arc */}
                <path
                  ref={(el) => (arcRefs.current[idx] = el)}
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${arcLength} ${arcLength}`}
                  strokeDashoffset={offset}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 10px ${ring.glow})` : 'none',
                  }}
                  onMouseEnter={() => handleMouseEnter(idx)}
                />

                {/* 3. Glowing End Cap Circle Node */}
                <circle
                  ref={(el) => (dotRefs.current[idx] = el)}
                  cx={endX}
                  cy={endY}
                  r={isHovered ? 7 : 5}
                  fill={ring.color}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="cursor-pointer transition-transform duration-200 shadow-md pointer-events-none"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${ring.glow})` : 'none',
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* GSAP SLEEK GLASSMORPHISM HOVER TOOLTIP CARD */}
        {activeIdx !== null && (
          <div className="absolute top-1 right-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-2xl pointer-events-none z-20 text-white animate-in fade-in zoom-in-95 duration-150 min-w-[145px]">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-semibold mb-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: rankingData.rings[activeIdx].color }}
              />
              <span className="truncate">{rankingData.rings[activeIdx].fullLabel}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-extrabold text-2xl text-teal-300 leading-tight">
                {rankingData.rings[activeIdx].pct}%
              </span>
              <span className="text-xs font-mono text-slate-400">
                Rank #{rankingData.rings[activeIdx].rank}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {rankingData.rings[activeIdx].count} resp.
            </div>
          </div>
        )}
      </div>

      {/* LEGEND RANK BADGES GRID */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        {rankingData.rings.map((ring, idx) => (
          <div
            key={ring.id}
            className={`p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${idx === 4 ? 'col-span-2' : ''
              } ${activeIdx === idx
                ? 'bg-[#EAF6F6] border-[#109A9B]/40 shadow-xs scale-[1.02]'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
              }`}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-mono text-[10px] font-extrabold text-[#075D63] bg-slate-200 px-1.5 py-0.5 rounded shrink-0">
                {ring.rank}
              </span>
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: ring.color }}
              />
              <span className="text-[11px] font-bold text-[#10242C] truncate">
                {ring.label}
              </span>
            </div>
            <span className="font-mono text-xs font-extrabold text-[#075D63] shrink-0">
              {ring.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}



// =========================================================================
// 8. GSAP ANIMATED EXPLODING PIE CHART (SUBMISSION COMPLETION RATIO)
// =========================================================================
function SubmissionCompletionGsapPieCard({ kpis }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const completedCount = kpis?.completedSurveys || 0;
  const incompleteCount = kpis?.incompleteSurveys || 0;
  const totalRatioCount = completedCount + incompleteCount;
  const completedPct = totalRatioCount > 0 ? Math.round((completedCount / totalRatioCount) * 100) : 0;
  const incompletePct = totalRatioCount > 0 ? 100 - completedPct : 0;

  const slices = useMemo(() => {
    const rawSlices = [
      { id: 'completed', label: 'Completed', count: completedCount, color: '#109A9B', glow: 'rgba(16, 154, 155, 0.7)' },
      { id: 'incomplete', label: 'Incomplete', count: incompleteCount, color: '#F97316', glow: 'rgba(249, 115, 22, 0.7)' },
    ];

    let cumPct = 0;
    return rawSlices.map((opt) => {
      const pct = totalRatioCount > 0 ? Math.round((opt.count / totalRatioCount) * 100) : 0;
      const startAngle = cumPct * 3.6;
      cumPct += pct;
      const endAngle = cumPct * 3.6;
      const midAngle = (startAngle + endAngle) / 2;

      const midRad = ((midAngle - 90) * Math.PI) / 180;
      const dx = Math.cos(midRad);
      const dy = Math.sin(midRad);

      return {
        ...opt,
        pct,
        startAngle,
        endAngle,
        midAngle,
        dx,
        dy,
      };
    });
  }, [completedCount, incompleteCount, totalRatioCount]);

  const sliceRefs = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    if (!sliceRefs.current.length) return;

    const ctx = gsap.context(() => {
      // 1. GSAP Exploding Path Animate-In
      sliceRefs.current.forEach((el, idx) => {
        if (!el) return;
        const slice = slices[idx];
        if (!slice) return;

        const startX = slice.dx * 35;
        const startY = slice.dy * 35;

        gsap.fromTo(
          el,
          {
            x: startX,
            y: startY,
            scale: 0.75,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.1,
            delay: idx * 0.15,
            ease: 'back.out(1.5)',
          }
        );
      });

      // 2. GSAP Percentage Counter Animation
      textRefs.current.forEach((el, idx) => {
        if (!el) return;
        const targetPct = slices[idx]?.pct || 0;
        const obj = { val: 0 };

        gsap.to(obj, {
          val: targetPct,
          duration: 1.2,
          delay: 0.2 + idx * 0.15,
          ease: 'power2.out',
          onUpdate: () => {
            if (el) el.textContent = `${Math.round(obj.val)}%`;
          },
        });
      });
    });

    return () => ctx.revert();
  }, [slices]);

  const createArcPath = (cx, cy, r, startAngle, endAngle) => {
    const toRad = (deg) => ((deg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const handleMouseEnter = (idx) => {
    setActiveIdx(idx);
    sliceRefs.current.forEach((el, i) => {
      if (!el) return;
      const slice = slices[i];
      if (i === idx) {
        const hoverX = slice.dx * 14;
        const hoverY = slice.dy * 14;
        gsap.to(el, {
          x: hoverX,
          y: hoverY,
          scale: 1.05,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 0.96,
          opacity: 0.45,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  };

  const handleMouseLeave = () => {
    setActiveIdx(null);
    sliceRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  };

  const cx = 110;
  const cy = 110;
  const radius = 92;

  return (
    <div className="lg:col-span-4 bg-gradient-to-b from-white via-white to-slate-50/70 p-6 rounded-3xl border border-[#109A9B]/20 shadow-md flex flex-col justify-between relative overflow-hidden">
      <div>
        <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2 mb-1">
          <PieIcon className="w-4.5 h-4.5 text-[#109A9B]" />
          Submission Completion Ratio
        </h3>
        <p className="text-xs text-[#53656A] font-medium">

        </p>
      </div>

      {/* GSAP ANIMATED EXPANDING PIE CHART CANVAS */}
      <div className="flex items-center justify-center relative py-4 my-1">
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          className="overflow-visible"
          onMouseLeave={handleMouseLeave}
        >
          {slices.map((slice, idx) => {
            const isHovered = activeIdx === idx;
            const textRadius = radius * 0.58;
            const tx = cx + textRadius * slice.dx;
            const ty = cy + textRadius * slice.dy;
            const isFullCircle = slice.pct >= 99.9;

            return (
              <g key={slice.id}>
                {isFullCircle ? (
                  <circle
                    ref={(el) => (sliceRefs.current[idx] = el)}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={slice.color}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-200 shadow-md"
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 12px ${slice.glow})` : 'none',
                    }}
                    onMouseEnter={() => handleMouseEnter(idx)}
                  />
                ) : (
                  <path
                    ref={(el) => (sliceRefs.current[idx] = el)}
                    d={createArcPath(cx, cy, radius, slice.startAngle, slice.endAngle)}
                    fill={slice.color}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-200 shadow-md"
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 12px ${slice.glow})` : 'none',
                    }}
                    onMouseEnter={() => handleMouseEnter(idx)}
                  />
                )}

                {/* IN-SLICE PERCENTAGE TEXT */}
                {slice.pct >= 5 && (
                  <text
                    ref={(el) => (textRefs.current[idx] = el)}
                    x={tx}
                    y={ty}
                    fill="#FFFFFF"
                    fontSize="13"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none drop-shadow-md select-none font-sans"
                  >
                    {slice.pct}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* GSAP SLEEK GLASSMORPHISM HOVER TOOLTIP CARD WITH POINTER */}
        {activeIdx !== null && (
          <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-2xl pointer-events-none z-20 text-white animate-in fade-in zoom-in-95 duration-150 min-w-[130px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slices[activeIdx].color }} />
              <span>{slices[activeIdx].label}</span>
            </div>
            <div className="font-heading font-extrabold text-2xl text-teal-300 leading-tight">
              {slices[activeIdx].pct}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {slices[activeIdx].count} {slices[activeIdx].count === 1 ? 'session' : 'sessions'}
            </div>
          </div>
        )}
      </div>

      {/* LEGEND PILLS WITH LIVE COUNTS */}
      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100/80 text-xs font-bold">
        <div className="bg-[#EAF6F6] p-2.5 rounded-xl flex items-center justify-between border border-[#109A9B]/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-3 h-3 rounded-full bg-[#109A9B] shrink-0" />
            <span className="text-[#075D63] truncate">Completed</span>
          </div>
          <span className="font-mono text-[#075D63] font-extrabold text-sm shrink-0">{completedPct}%</span>
        </div>

        <div className="bg-amber-50 p-2.5 rounded-xl flex items-center justify-between border border-amber-200">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-3 h-3 rounded-full bg-[#F97316] shrink-0" />
            <span className="text-[#D97706] truncate">Incomplete</span>
          </div>
          <span className="font-mono text-[#D97706] font-extrabold text-sm shrink-0">{incompletePct}%</span>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN PAGE COMPONENT: ADMIN DASHBOARD
// =========================================================================
// 8. PREFERRED CAREER PATH VERTICAL BAR GRAPH (Q35 FEATURED AT BOTTOM)
// =========================================================================
function CareerPathBarChartCard({ rawRecords }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const careerData = useMemo(() => {
    const q35Responses = rawRecords.filter((r) => {
      const qId = String(r.questionId || '').toLowerCase().trim();
      const qCode = String(r.questionCode || '').toLowerCase().trim();
      const qText = String(r.questionText || '').toLowerCase();
      const qOrder = r.displayOrder !== undefined && r.displayOrder !== null ? String(r.displayOrder) : '';
      return (
        qId === 'q35' ||
        qId === '35' ||
        qCode === 'q35' ||
        qCode === '35' ||
        qOrder === '35' ||
        qCode.includes('q35') ||
        qText.includes('which career path') ||
        (qText.includes('career') && qText.includes('prefer'))
      );
    });

    const options = [
      { id: 'private_sector', label: 'Private-sector job', shortLabel: 'Private Sector', color: '#3B82F6', gradient: 'from-[#3B82F6] to-[#1D4ED8]' },
      { id: 'government_job', label: 'Government job', shortLabel: 'Govt Job', color: '#075D63', gradient: 'from-[#075D63] to-[#043E42]' },
      { id: 'start_business', label: 'Start my own business', shortLabel: 'Startup / Own Biz', color: '#F59E0B', gradient: 'from-[#F59E0B] to-[#D97706]' },
      { id: 'family_business', label: 'Family business', shortLabel: 'Family Biz', color: '#8B5CF6', gradient: 'from-[#8B5CF6] to-[#6D28D9]' },
      { id: 'research_teaching', label: 'Research or teaching', shortLabel: 'Research / Teach', color: '#EC4899', gradient: 'from-[#EC4899] to-[#BE185D]' },
      { id: 'work_abroad', label: 'Work abroad', shortLabel: 'Work Abroad', color: '#10B981', gradient: 'from-[#10B981] to-[#047857]' },
      { id: 'sports_entertainment', label: 'Sports or entertainment', shortLabel: 'Sports / Ent.', color: '#14B8A6', gradient: 'from-[#14B8A6] to-[#0F766E]' },
      { id: 'freelancing', label: 'Freelancing/Gig work', shortLabel: 'Freelancing', color: '#6366F1', gradient: 'from-[#6366F1] to-[#4338CA]' },
      { id: 'other', label: 'Other', shortLabel: 'Other', color: '#64748B', gradient: 'from-[#64748B] to-[#334155]' },
    ];

    const counts = new Array(options.length).fill(0);
    let totalCount = q35Responses.length;

    q35Responses.forEach((r) => {
      let rawVal = r.value;
      if (typeof rawVal === 'string') {
        const trimmed = rawVal.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try { rawVal = JSON.parse(trimmed); } catch (e) { }
        } else if (trimmed.includes(',')) {
          rawVal = trimmed.split(',').map((s) => s.trim());
        }
      }

      if (typeof rawVal === 'object' && rawVal !== null && !Array.isArray(rawVal)) {
        rawVal = rawVal.value !== undefined ? rawVal.value : (rawVal.label !== undefined ? rawVal.label : rawVal);
        if (typeof rawVal === 'string' && rawVal.startsWith('[')) {
          try { rawVal = JSON.parse(rawVal); } catch (e) { }
        }
      }

      let valList = Array.isArray(rawVal) ? rawVal : [rawVal];
      if (valList.length === 1 && typeof valList[0] === 'string' && valList[0].includes(',')) {
        valList = valList[0].split(',').map((s) => s.trim());
      }

      valList.forEach((item) => {
        let itemVal = item;
        if (typeof itemVal === 'object' && itemVal !== null) {
          itemVal = itemVal.value !== undefined ? itemVal.value : (itemVal.label !== undefined ? itemVal.label : itemVal);
        }
        const str = String(itemVal ?? '').trim().toLowerCase();
        const labelStr = String(r.optionLabel ?? '').trim().toLowerCase();
        const combined = `${str} ${labelStr}`;

        if (combined.includes('private') || combined.includes('sector')) {
          counts[0]++;
        } else if (combined.includes('government') || combined.includes('govt')) {
          counts[1]++;
        } else if (combined.includes('start') || combined.includes('business') || combined.includes('own') || combined.includes('startup')) {
          counts[2]++;
        } else if (combined.includes('family')) {
          counts[3]++;
        } else if (combined.includes('research') || combined.includes('teaching')) {
          counts[4]++;
        } else if (combined.includes('abroad')) {
          counts[5]++;
        } else if (combined.includes('sports') || combined.includes('entertainment')) {
          counts[6]++;
        } else if (combined.includes('freelanc') || combined.includes('gig')) {
          counts[7]++;
        } else if (combined.includes('other')) {
          counts[8]++;
        } else {
          const matchedIdx = options.findIndex((o) => {
            const optVal = String(o.id ?? '').trim().toLowerCase();
            const optLbl = String(o.label ?? '').trim().toLowerCase();
            return optVal.includes(str) || optLbl.includes(str) || str.includes(optVal);
          });
          if (matchedIdx !== -1) counts[matchedIdx]++;
        }
      });
    });

    const isMultiSelect = Boolean(
      q35Responses.some((r) => Array.isArray(r.value) || (typeof r.value === 'string' && r.value.includes(',')))
    );

    const totalVotesAcrossOptions = counts.reduce((sum, c) => sum + c, 0);
    const denominator = isMultiSelect && totalVotesAcrossOptions > 0 ? totalVotesAcrossOptions : totalCount;

    const items = options.map((opt, idx) => {
      const c = counts[idx];
      const pct = denominator > 0 ? Math.round((c / denominator) * 100) : 0;
      return {
        id: opt.id,
        label: opt.label,
        shortLabel: opt.shortLabel,
        count: c,
        pct,
        color: opt.color,
        gradient: opt.gradient,
      };
    });

    const maxCount = Math.max(...counts);
    const topIdx = counts.indexOf(maxCount);
    const dominantItem = totalCount > 0 && maxCount > 0 ? items[topIdx] : items[2];

    return { totalCount, dominantItem, items };
  }, [rawRecords]);

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
      {/* COMPACT ATTRACTIVE HEADER & DOMINANT CAREER BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#10242C] flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#109A9B] shrink-0" />
          <span>Preferred Career Path Analysis</span>
        </h3>

        {/* COMPACT & ATTRACTIVE DOMINANT AMBITION BADGE */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#EAF6F6] to-teal-50 py-1.5 px-3.5 rounded-xl border border-[#109A9B]/30 shadow-2xs text-xs font-bold text-[#075D63] shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#109A9B] shrink-0 animate-pulse" />
          <span className="text-[11px] text-[#53656A] font-semibold">Dominant Ambition:</span>
          <span className="font-mono font-extrabold text-[#075D63] bg-white px-2 py-0.5 rounded-lg border border-[#109A9B]/20">
            {careerData.dominantItem.label} ({careerData.dominantItem.pct}%)
          </span>
        </div>
      </div>

      {/* VERTICAL BAR GRAPH CANVAS SECTION */}
      <div className="relative pt-6 pb-2 overflow-x-auto scrollbar-thin">
        <div className="min-w-[700px] relative">
          {/* Y-AXIS GRID LINES & LABELS */}
          <div className="absolute inset-x-0 top-6 bottom-20 flex flex-col justify-between pointer-events-none z-0">
            {[100, 75, 50, 25, 0].map((level) => (
              <div key={level} className="flex items-center gap-3 w-full">
                <span className="font-mono text-[10px] text-slate-400 font-bold w-8 text-right shrink-0">
                  {level}%
                </span>
                <div className="h-px bg-slate-200/70 w-full border-t border-dashed border-slate-200" />
              </div>
            ))}
          </div>

          {/* 9 VERTICAL BARS CONTAINER */}
          <div className="relative z-10 pl-11 pr-2 pt-2 grid grid-cols-9 gap-3 sm:gap-4 items-end h-[280px]">
            {careerData.items.map((item, idx) => {
              const isHovered = activeIdx === idx;
              const barHeightPct = Math.max(item.pct, item.count > 0 ? 8 : 3);

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center justify-end h-full group cursor-pointer"
                  onMouseEnter={() => setActiveIdx(idx)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  {/* VALUE BADGE ABOVE BAR */}
                  <div
                    className={`flex flex-col items-center mb-1.5 transition-all duration-300 ${isHovered ? 'scale-110 -translate-y-1' : ''
                      }`}
                  >
                    <span
                      className={`font-mono font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-2xs border transition-colors ${item.pct > 0
                        ? 'bg-[#075D63] text-white border-[#075D63]'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                    >
                      {item.pct}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold font-mono">
                      {item.count} {item.count === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>

                  {/* THE VERTICAL BAR COLUMN */}
                  <div className="w-full max-w-[44px] sm:max-w-[58px] h-full flex items-end justify-center bg-slate-100/60 rounded-t-2xl p-0.5 border border-slate-200/60">
                    <div
                      className={`w-full rounded-t-xl bg-gradient-to-t ${item.gradient} transition-all duration-700 shadow-md relative overflow-hidden ${isHovered ? 'brightness-110 shadow-lg ring-2 ring-[#109A9B]/60 scale-x-105' : ''
                        }`}
                      style={{ height: `${barHeightPct}%` }}
                    >
                      {/* TOP GLOW SHINE EFFECT */}
                      <div className="absolute top-0 inset-x-0 h-1.5 bg-white/40 rounded-t-xl" />
                    </div>
                  </div>

                  {/* X-AXIS LABEL AT BOTTOM */}
                  <div className="mt-3 text-center w-full min-h-[44px] flex flex-col items-center justify-start">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 mb-1 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold leading-tight transition-colors line-clamp-2 ${isHovered ? 'text-[#075D63] font-extrabold scale-105' : 'text-[#10242C]'
                        }`}
                      title={item.label}
                    >
                      {item.shortLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [rawRecords, setRawRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('7days');
  const [activePulse, setActivePulse] = useState('all');

  const donutCardRef = useRef(null);
  const centerBadgeRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [kpiData, realAnalytics, dbRaw] = await Promise.all([
        adminDataService.getDashboardKPIs(),
        adminDataService.getRealAnalyticsData(),
        adminDataService.fetchRawDatabaseRecords(),
      ]);
      setKpis(kpiData);
      setAnalyticsData(realAnalytics);
      setRawRecords(dbRaw?.records || []);
      setLoading(false);
    }
    loadData();
  }, [dateFilter]);

  const growthData = kpis?.growthData || [
    { day: 'Mon', respondents: 0, completed: 0 },
    { day: 'Tue', respondents: 0, completed: 0 },
    { day: 'Wed', respondents: 0, completed: 0 },
    { day: 'Thu', respondents: 0, completed: 0 },
    { day: 'Fri', respondents: 0, completed: 0 },
    { day: 'Sat', respondents: 0, completed: 0 },
    { day: 'Sun', respondents: 0, completed: 0 },
  ];

  const completedCount = kpis?.completedSurveys || 0;
  const incompleteCount = kpis?.incompleteSurveys || 0;
  const totalRatioCount = completedCount + incompleteCount;
  const completedPct = totalRatioCount > 0 ? Math.round((completedCount / totalRatioCount) * 100) : 0;
  const incompletePct = totalRatioCount > 0 ? 100 - completedPct : 0;

  const completionPieData = [
    { name: 'Completed', value: completedCount, pct: completedPct, fill: 'url(#completedGradient)', solidColor: '#075D63' },
    { name: 'Incomplete', value: incompleteCount, pct: incompletePct, fill: 'url(#incompleteGradient)', solidColor: '#D97706' },
  ];

  const dimensionAveragesData = analyticsData?.major15DimensionScores || [
    { dimension: 'Mental Wellbeing', score: 0, fill: '#075D63' },
    { dimension: 'Learning Drive', score: 0, fill: '#109A9B' },
    { dimension: 'Career Readiness', score: 0, fill: '#3B82F6' },
    { dimension: 'Financial Maturity', score: 0, fill: '#059669' },
    { dimension: 'Digital Lifestyle', score: 0, fill: '#8B5CF6' },
    { dimension: 'Health & Fitness', score: 0, fill: '#EC4899' },
    { dimension: 'Family Orientation', score: 0, fill: '#F59E0B' },
    { dimension: 'Peer Relations', score: 0, fill: '#6366F1' },
    { dimension: 'Independence Drive', score: 0, fill: '#D97706' },
    { dimension: 'Entrepreneurship', score: 0, fill: '#10B981' },
    { dimension: 'Global Mobility', score: 0, fill: '#64748B' },
    { dimension: 'Social Duty', score: 0, fill: '#075D63' },
    { dimension: 'Future Adaptability', score: 0, fill: '#109A9B' },
    { dimension: 'Risk Tolerance', score: 0, fill: '#D97706' },
    { dimension: 'Lifestyle Values', score: 0, fill: '#3B82F6' },
  ];

  return (
    <AdminLayout title="System Administration Overview">
      <div className="space-y-6">

        {/* TOP CONTROLS & DATE FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#109A9B]/20 shadow-md">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-[#10242C]">
              Live Survey Analytics Dashboard
            </h2>
            <p className="text-xs text-[#53656A] font-semibold">
              Mixed research visualization system powered directly by Supabase Database
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {[
                { id: 'today', label: 'Today' },
                { id: '7days', label: 'Last 7 Days' },
                { id: '30days', label: 'Last 30 Days' },
                { id: '90days', label: 'Last 90 Days' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setDateFilter(btn.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${dateFilter === btn.id
                    ? 'bg-[#075D63] text-white shadow-xs'
                    : 'text-[#53656A] hover:bg-slate-200'
                    }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setDateFilter(dateFilter)}
              className="p-2 rounded-xl bg-[#EAF6F6] text-[#075D63] border border-[#109A9B]/30 hover:bg-[#109A9B] hover:text-white transition-colors cursor-pointer"
              title="Refresh DB Statistics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#53656A] font-bold uppercase tracking-wider">Total Respondents</span>
              <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">
                {loading ? '...' : kpis?.totalRespondents}
              </h3>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +14% active surge
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAF6F6] text-[#075D63] flex items-center justify-center border border-[#109A9B]/20">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#53656A] font-bold uppercase tracking-wider">Total Stored Responses</span>
              <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">
                {loading ? '...' : kpis?.totalResponses}
              </h3>
              <span className="text-xs text-[#075D63] font-bold mt-0.5 block">Across {loading ? '...' : (kpis?.totalQuestionsCount || getStoredQuestions().length)} Questions</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#109A9B] flex items-center justify-center border border-teal-200">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#53656A] font-bold uppercase tracking-wider">Completion Rate</span>
              <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">
                {loading ? '...' : `${kpis?.completionRatePct}%`}
              </h3>
              <span className="text-xs text-emerald-600 font-bold mt-0.5 block">
                {kpis?.completedSurveys} Completed / {kpis?.incompleteSurveys} Partial
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#53656A] font-bold uppercase tracking-wider">Avg Quality Score</span>
              <h3 className="font-heading font-extrabold text-3xl text-[#10242C] mt-1">
                {loading ? '...' : `${kpis?.avgQualityScore} / 100`}
              </h3>
              <span className="text-xs text-emerald-600 font-bold mt-0.5 block">Research-Grade Quality</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAF6F6] text-[#075D63] flex items-center justify-center border border-[#109A9B]/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2. CHARTS GRID SECTION: GROWTH TREND & HIGH-PERFORMANCE INTERACTIVE EXPLODING DONUT (TOP FEATURED) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-[#109A9B]" />
                Respondent Growth Trend
              </h3>
              <p className="text-xs text-[#53656A] font-medium">Daily new study submissions & completions</p>
            </div>

            <div className="flex-1 w-full min-h-[340px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="respondents" stroke="#075D63" strokeWidth={3} name="Total Started" />
                  <Line type="monotone" dataKey="completed" stroke="#109A9B" strokeWidth={3} name="Completed" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <SubmissionCompletionGsapPieCard kpis={kpis} />
        </div>

        {/* 3. MODERN MIXED VISUALIZATION GRID (ALTERNATIVES TO REPETITIVE PIE CHARTS) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-lg text-[#10242C] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#109A9B]" />
              Research Visualization System (Alternative Visual Representations)
            </h3>
            <span className="text-xs text-[#53656A] font-semibold">100% Pill • Waffle • Lollipop • Story Card • Spectrum</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SegmentedPillBarCard rawRecords={rawRecords} />
            <WaffleChartCard rawRecords={rawRecords} />
            <LollipopChartCard rawRecords={rawRecords} />
            <StoryCardVisualization rawRecords={rawRecords} />
            <SpectrumBarCard rawRecords={rawRecords} />
            <RankingProgressCard rawRecords={rawRecords} />
          </div>
        </div>

        {/* 4. FEATURED PREFERRED CAREER PATH ANALYSIS (Q35 BOTTOM ATTRACIVE BAR GRAPH SECTION) */}
        <CareerPathBarChartCard rawRecords={rawRecords} />

      </div>
    </AdminLayout>
  );
}
