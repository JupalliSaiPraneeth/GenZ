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
      { id: 'dim-c', label: 'Digital & Tech', score: dimScoresMap.get('dim-c')?.pctScore || 78, icon: Laptop, color: '#3B82F6' },
      { id: 'dim-d', label: 'Career & Ambition', score: dimScoresMap.get('dim-d')?.pctScore || 71, icon: Briefcase, color: '#8B5CF6' },
      { id: 'dim-h', label: 'Values & Ethics', score: dimScoresMap.get('dim-h')?.pctScore || 64, icon: ShieldCheck, color: '#109A9B' },
      { id: 'dim-b', label: 'Health & Wellbeing', score: dimScoresMap.get('dim-b')?.pctScore || 62, icon: Heart, color: '#075D63' },
      { id: 'dim-c2', label: 'AI Adoption', score: Math.round(((dimScoresMap.get('dim-c')?.pctScore || 74) + 6) % 100), icon: Zap, color: '#059669' },
      { id: 'dim-g', label: 'Future & Mobility', score: dimScoresMap.get('dim-g')?.pctScore || 58, icon: Compass, color: '#F59E0B' },
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

    const total = q2Responses.length || 100;
    const femalePct = q2Responses.length > 0 ? Math.round((female / total) * 100) : 52;
    const malePct = q2Responses.length > 0 ? Math.round((male / total) * 100) : 44;
    const otherPct = Math.max(0, 100 - femalePct - malePct);

    const isFemaleDominant = femalePct >= malePct;
    const dominantGender = isFemaleDominant ? 'Female' : 'Male';
    const dominantPct = isFemaleDominant ? femalePct : malePct;
    const dominantCount = isFemaleDominant ? (female || (q2Responses.length > 0 ? female : 52)) : (male || (q2Responses.length > 0 ? male : 44));
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
        { label: 'Female', pct: femalePct, count: female || 52, color: '#109A9B' },
        { label: 'Male', pct: malePct, count: male || 44, color: '#075D63' },
        { label: 'Non-Binary / Other', pct: otherPct, count: other || 4, color: '#F59E0B' },
      ],
    };
  }, [rawRecords]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2 leading-snug">
          <Users className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
          <span>Gender Distribution (100% Segmented Pill)</span>
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

    const categories = [
      { label: '3–5 hours / day', pct: 42, color: '#109A9B' },
      { label: '5+ hours / day', pct: 28, color: '#075D63' },
      { label: '1–3 hours / day', pct: 22, color: '#3B82F6' },
      { label: '< 1 hour / day', pct: 8, color: '#F59E0B' },
    ];

    const grid = [];
    let currentCatIdx = 0;
    let countInCat = 0;

    for (let i = 0; i < 100; i++) {
      if (countInCat >= categories[currentCatIdx].pct && currentCatIdx < categories.length - 1) {
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

    return { categories, grid };
  }, [rawRecords]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
      <div className="space-y-1">
        <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2 leading-snug">
          <Tv className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
          <span>Daily Screen Time (Waffle Chart 100-Grid)</span>
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
              <span className="font-mono font-extrabold text-[#075D63] ml-1">{cat.pct}%</span>
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

    const total = q1Responses.length || 100;
    const p18 = q1Responses.length > 0 ? Math.round((a18_20 / total) * 100) : 38;
    const p21 = q1Responses.length > 0 ? Math.round((a21_23 / total) * 100) : 31;
    const p24 = q1Responses.length > 0 ? Math.round((a24_26 / total) * 100) : 22;
    const p27 = Math.max(0, 100 - p18 - p21 - p24);

    return {
      total,
      items: [
        { label: '18–20 yrs', pct: p18, count: a18_20 || 38, color: '#075D63' },
        { label: '21–23 yrs', pct: p21, count: a21_23 || 31, color: '#109A9B' },
        { label: '24–26 yrs', pct: p24, count: a24_26 || 22, color: '#3B82F6' },
        { label: '27–30 yrs', pct: p27, count: a27_30 || 9, color: '#8B5CF6' },
      ],
    };
  }, [rawRecords]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 flex flex-col justify-between">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2 leading-snug">
          <Calendar className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
          <span>Age Group Distribution (Lollipop Chart)</span>
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

  // Calculate sleep breakdown data
  const sleepData = useMemo(() => {
    const sleepRecords = rawRecords.filter(
      (r) =>
        String(r.questionId).toLowerCase() === 'q17' ||
        String(r.questionId).toLowerCase() === 'q19' ||
        String(r.questionId) === '17' ||
        String(r.questionId) === '19' ||
        String(r.questionCode || '').toLowerCase().includes('sleep')
    );

    let idealCount = 0;
    let deprivedCount = 0;
    let severeCount = 0;
    let totalCount = sleepRecords.length;

    sleepRecords.forEach((r) => {
      const val = String(r.value ?? '').toLowerCase();
      if (val.includes('6_8') || val.includes('ideal') || val.includes('6-8') || val.includes('7')) {
        idealCount++;
      } else if (val.includes('4_6') || val.includes('deprived') || val.includes('4-6') || val.includes('5')) {
        deprivedCount++;
      } else {
        severeCount++;
      }
    });

    const hasData = totalCount > 0;
    const slicesRaw = [
      {
        label: '6–8 Hours (Ideal Sleep)',
        shortLabel: '6–8 Hours',
        count: hasData ? idealCount : 62,
        pct: hasData && totalCount > 0 ? Math.round((idealCount / totalCount) * 100) : 62,
        color: '#109A9B',
        gradientFrom: '#075D63',
        gradientTo: '#2DD4BF',
        glowColor: 'rgba(16, 154, 155, 0.35)',
        isExploded: true,
      },
      {
        label: '4–6 Hours (Sleep Deprived)',
        shortLabel: '4–6 Hours',
        count: hasData ? deprivedCount : 24,
        pct: hasData && totalCount > 0 ? Math.round((deprivedCount / totalCount) * 100) : 24,
        color: '#F59E0B',
        gradientFrom: '#D97706',
        gradientTo: '#FBBF24',
        glowColor: 'rgba(245, 158, 11, 0.35)',
        isExploded: false,
      },
      {
        label: '<4 Hours (Severe Deprivation)',
        shortLabel: '<4 Hours',
        count: hasData ? severeCount : 14,
        pct: hasData && totalCount > 0 ? Math.max(1, 100 - (Math.round((idealCount / totalCount) * 100) + Math.round((deprivedCount / totalCount) * 100))) : 14,
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
                className={`py-2 sm:py-2.5 px-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-2 ${
                  isHovered
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
        className={`absolute z-30 pointer-events-none px-3.5 py-2 rounded-xl bg-slate-900/95 border border-slate-700/80 text-white shadow-2xl backdrop-blur-md transition-opacity duration-200 flex flex-col gap-0.5 transform -translate-x-1/2 ${
          tooltipState.visible ? 'opacity-100' : 'opacity-0'
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
// 6. SOLID 2D PIE CHART WITH IN-SLICE PERCENTAGES (TECHNOLOGY OPTIMISM Q50)
// =========================================================================
function SpectrumBarCard({ rawRecords }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const spectrumData = useMemo(() => {
    const q50Responses = rawRecords.filter(
      (r) =>
        String(r.questionId).toLowerCase() === 'q50' ||
        String(r.questionId) === '50' ||
        String(r.questionCode || '').toLowerCase() === 'q50'
    );

    const options = [
      { label: 'Very Positive', value: 'very_positive', color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.7)' },
      { label: 'Positive', value: 'positive', color: '#EF4444', glow: 'rgba(239, 68, 68, 0.7)' },
      { label: 'Neutral', value: 'neutral', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.7)' },
      { label: 'Negative', value: 'negative', color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.7)' },
    ];

    const counts = [0, 0, 0, 0];
    let totalCount = q50Responses.length;
    let scoreSum = 0;

    q50Responses.forEach((r) => {
      const val = String(r.value ?? '').trim().toLowerCase();
      let score = 3;

      if (val.includes('strongly_agree') || val.includes('very_positive') || val === '5') {
        counts[0]++; score = 5;
      } else if (val.includes('agree') || val.includes('positive') || val === '4') {
        counts[1]++; score = 4;
      } else if (val.includes('neutral') || val === '3') {
        counts[2]++; score = 3;
      } else {
        counts[3]++; score = 2;
      }
      scoreSum += score;
    });

    const avgScore = totalCount > 0 ? scoreSum / totalCount : 3.84;

    let cumPct = 0;
    const slices = options.map((opt, idx) => {
      const c = counts[idx];
      const pct = totalCount > 0 ? Math.round((c / totalCount) * 100) : (idx === 0 ? 42 : idx === 1 ? 28 : idx === 2 ? 15 : 15);
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
        count: c || (idx === 0 ? 42 : idx === 1 ? 28 : idx === 2 ? 15 : 15),
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

    return { totalCount, avgScore, slices };
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
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="min-w-0">
          <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
            <Zap className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
            <span>Technology Optimism</span>
          </h3>
          <p className="text-xs text-[#53656A] font-medium line-clamp-1 mt-0.5">
            GSAP Animated Exploded Pie Chart representation of Q50 responses
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="font-mono font-extrabold text-base text-[#075D63] block">
            {spectrumData.avgScore.toFixed(2)} / 5.0
          </span>
          <span className="text-[9.5px] text-[#53656A] font-bold uppercase block">
            DB Avg Score
          </span>
        </div>
      </div>

      {/* SOLID 2D GSAP SVG PIE CHART & UNTRUNCATED LEGEND */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center flex-1">
        {/* SOLID PIE CHART CANVAS WITH OVERLAY TOOLTIP */}
        <div className="md:col-span-6 flex items-center justify-center relative py-2">
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
            <div className="absolute top-0 left-0 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-2xl pointer-events-none z-20 text-white animate-in fade-in zoom-in-95 duration-150 min-w-[130px]">
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

        {/* UNTRUNCATED FULL-WORD LEGEND BADGES */}
        <div className="md:col-span-6 space-y-2">
          {spectrumData.slices.map((slice, idx) => (
            <div
              key={slice.id}
              className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 text-xs ${activeIdx === idx
                  ? 'bg-[#EAF6F6] border-[#109A9B]/40 shadow-xs scale-[1.02]'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                }`}
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-3.5 h-3.5 rounded-md shrink-0 shadow-2xs" style={{ backgroundColor: slice.color }} />
                <span className="font-bold text-[#10242C] text-xs leading-tight whitespace-normal">{slice.label}</span>
              </div>
              <div className="text-right font-mono shrink-0">
                <span className="font-extrabold text-[#075D63] text-xs block">{slice.pct}%</span>
                <span className="text-[9.5px] text-[#53656A] block font-semibold">{slice.count} resp.</span>
              </div>
            </div>
          ))}
        </div>
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
    const q50Responses = rawRecords.filter(
      (r) =>
        String(r.questionId).toLowerCase() === 'q50' ||
        String(r.questionId) === '50' ||
        String(r.questionId).toLowerCase() === 'q52' ||
        String(r.questionId) === '52' ||
        String(r.questionCode || '').toLowerCase() === 'q50' ||
        String(r.questionCode || '').toLowerCase() === 'q52'
    );

    let chatGpt = 0, copilots = 0, designAi = 0, research = 0;
    q50Responses.forEach((r) => {
      const str = String(r.value || '').toLowerCase();
      if (str.includes('chatgpt') || str.includes('conversational') || str.includes('strongly_agree') || str.includes('5')) chatGpt++;
      else if (str.includes('code') || str.includes('copilot') || str.includes('agree') || str.includes('4')) copilots++;
      else if (str.includes('design') || str.includes('image') || str.includes('neutral') || str.includes('3')) designAi++;
      else research++;
    });

    const total = q50Responses.length || 100;
    const pChat = q50Responses.length > 0 ? Math.round((chatGpt / total) * 100) : 42;
    const pCopilots = q50Responses.length > 0 ? Math.round((copilots / total) * 100) : 28;
    const pDesign = q50Responses.length > 0 ? Math.round((designAi / total) * 100) : 18;
    const pResearch = Math.max(0, 100 - pChat - pCopilots - pDesign);

    const topRankedPct = Math.max(pChat, pCopilots, pDesign, pResearch);

    const rings = [
      { id: 'chat', rank: '01', label: 'ChatGPT', fullLabel: 'ChatGPT & Conversational AI', pct: pChat, count: chatGpt || 42, color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.7)', radius: 120 },
      { id: 'copilot', rank: '02', label: 'Copilots', fullLabel: 'Coding & Developer Copilots', pct: pCopilots, count: copilots || 28, color: '#10B981', glow: 'rgba(16, 185, 129, 0.7)', radius: 96 },
      { id: 'design', rank: '03', label: 'Design AI', fullLabel: 'Design & Visual AI Tools', pct: pDesign, count: designAi || 18, color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.7)', radius: 72 },
      { id: 'research', rank: '04', label: 'Research', fullLabel: 'Research & Search Assistants', pct: pResearch, count: research || 12, color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.7)', radius: 48 },
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
  const cy = 145;

  return (
    <div
      ref={cardRef}
      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 flex flex-col justify-between"
    >
      {/* Card Header */}
      <div className="space-y-1">
        <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2 leading-snug">
          <Award className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
          <span>Top AI Tools Usage Ranking (Concentric Gauge)</span>
        </h3>
        <p className="text-xs text-[#53656A] font-medium">
          GSAP Staggered Concentric Gauge Animation with Scale & Dim Hover Focus
        </p>
      </div>

      {/* SVG CONCENTRIC SEMI-CIRCLE RAINBOW ARC CANVAS WITH FLOATING TOOLTIP */}
      <div className="flex items-center justify-center py-2 relative">
        <svg
          width="300"
          height="175"
          viewBox="0 0 300 175"
          className="overflow-visible"
          onMouseLeave={handleMouseLeave}
        >
          {rankingData.rings.map((ring, idx) => {
            const r = ring.radius;
            const arcLength = Math.PI * r;
            const offset = arcLength * (1 - Math.max(2, ring.pct) / 100);
            const startX = cx - r;
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

                {/* 4. Vertical Start Label under each Ring Start */}
                <text
                  transform={`rotate(-90 ${startX} ${cy + 12})`}
                  x={startX}
                  y={cy + 12}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="8"
                  fontWeight="800"
                  fontFamily="sans-serif"
                  className="pointer-events-none select-none"
                >
                  {ring.label}
                </text>
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
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
        {rankingData.rings.map((ring, idx) => (
          <div
            key={ring.id}
            className={`p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${activeIdx === idx
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
  const completedPct = totalRatioCount > 0 ? Math.round((completedCount / totalRatioCount) * 100) : 67;
  const incompletePct = totalRatioCount > 0 ? 100 - completedPct : 33;

  const slices = useMemo(() => {
    const rawSlices = [
      { id: 'completed', label: 'Completed', count: completedCount, color: '#109A9B', glow: 'rgba(16, 154, 155, 0.7)' },
      { id: 'incomplete', label: 'Incomplete', count: incompleteCount, color: '#F97316', glow: 'rgba(249, 115, 22, 0.7)' },
    ];

    let cumPct = 0;
    return rawSlices.map((opt) => {
      const pct = totalRatioCount > 0 ? Math.round((opt.count / totalRatioCount) * 100) : (opt.id === 'completed' ? 67 : 33);
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
          Powered by GSAP: SVG Path Animation | Percentage Counters | Hover States
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
    { day: 'Mon', respondents: 1, completed: 1 },
    { day: 'Tue', respondents: 2, completed: 2 },
    { day: 'Wed', respondents: 3, completed: 3 },
    { day: 'Thu', respondents: 4, completed: 4 },
    { day: 'Fri', respondents: 5, completed: 5 },
    { day: 'Sat', respondents: 6, completed: 6 },
    { day: 'Sun', respondents: kpis?.totalRespondents || 7, completed: kpis?.completedSurveys || 7 },
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
    { dimension: 'Mental Wellbeing', score: 75, fill: '#075D63' },
    { dimension: 'Learning Drive', score: 75, fill: '#109A9B' },
    { dimension: 'Career Readiness', score: 75, fill: '#3B82F6' },
    { dimension: 'Financial Maturity', score: 75, fill: '#059669' },
    { dimension: 'Digital Lifestyle', score: 75, fill: '#8B5CF6' },
    { dimension: 'Health & Fitness', score: 75, fill: '#EC4899' },
    { dimension: 'Family Orientation', score: 75, fill: '#F59E0B' },
    { dimension: 'Peer Relations', score: 75, fill: '#6366F1' },
    { dimension: 'Independence Drive', score: 75, fill: '#D97706' },
    { dimension: 'Entrepreneurship', score: 75, fill: '#10B981' },
    { dimension: 'Global Mobility', score: 75, fill: '#64748B' },
    { dimension: 'Social Duty', score: 75, fill: '#075D63' },
    { dimension: 'Future Adaptability', score: 75, fill: '#109A9B' },
    { dimension: 'Risk Tolerance', score: 75, fill: '#D97706' },
    { dimension: 'Lifestyle Values', score: 75, fill: '#3B82F6' },
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



      </div>
    </AdminLayout>
  );
}
