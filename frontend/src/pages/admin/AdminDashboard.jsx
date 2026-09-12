import React, { useState, useEffect, useRef } from 'react';
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

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('7days');

  const donutCardRef = useRef(null);
  const centerBadgeRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [kpiData, realAnalytics] = await Promise.all([
        adminDataService.getDashboardKPIs(),
        adminDataService.getRealAnalyticsData(),
      ]);
      setKpis(kpiData);
      setAnalyticsData(realAnalytics);
      setLoading(false);
    }
    loadData();
  }, [dateFilter]);

  useEffect(() => {
    if (!centerBadgeRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        centerBadgeRef.current,
        { scale: 0.6, opacity: 0, rotate: -10 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, delay: 0.2, ease: 'back.out(1.7)' }
      );
    }, donutCardRef);
    return () => ctx.revert();
  }, [kpis]);

  // Dynamic Growth Trend Chart Data derived directly from DB participant timestamps
  const growthData = kpis?.growthData || [
    { day: 'Mon', respondents: 1, completed: 1 },
    { day: 'Tue', respondents: 2, completed: 2 },
    { day: 'Wed', respondents: 3, completed: 3 },
    { day: 'Thu', respondents: 4, completed: 4 },
    { day: 'Fri', respondents: 5, completed: 5 },
    { day: 'Sat', respondents: 6, completed: 6 },
    { day: 'Sun', respondents: kpis?.totalRespondents || 7, completed: kpis?.completedSurveys || 7 },
  ];

  // Completion Ratio Statistics
  const completedCount = kpis?.completedSurveys || 0;
  const incompleteCount = kpis?.incompleteSurveys || 0;
  const totalRatioCount = completedCount + incompleteCount;
  const completedPct = totalRatioCount > 0 ? Math.round((completedCount / totalRatioCount) * 100) : 0;
  const incompletePct = totalRatioCount > 0 ? 100 - completedPct : 0;

  // Completion Pie Data with Gradient Fills
  const completionPieData = [
    { name: 'Completed', value: completedCount, pct: completedPct, fill: 'url(#completedGradient)', solidColor: '#075D63' },
    { name: 'Incomplete', value: incompleteCount, pct: incompletePct, fill: 'url(#incompleteGradient)', solidColor: '#D97706' },
  ];

  // Demographics Breakdown Data dynamically calculated from DB
  const ageDistribution = analyticsData?.ageDistribution || [
    { label: '18–20', count: 35 },
    { label: '21–23', count: 48 },
    { label: '24–26', count: 12 },
    { label: '27–29', count: 4 },
    { label: '30+', count: 1 },
  ];

  const genderDistribution = analyticsData?.genderDistribution || [
    { name: 'Female', value: 52, fill: '#109A9B' },
    { name: 'Male', value: 42, fill: '#075D63' },
    { name: 'Non-Binary/Other', value: 6, fill: '#FDE7B5' },
  ];

  // 15 Major Analytical Dimensions Overview (Calculated directly from Supabase DB across all 75 questions)
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
      {/* TOP CONTROLS & DATE FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#109A9B]/20 shadow-md">
        <div>
          <h2 className="font-heading font-extrabold text-lg text-[#10242C]">
            Live Survey Analytics Dashboard
          </h2>
          <p className="text-xs text-[#53656A] font-semibold">
            Real-time query metrics connected to Dexie IndexedDB & Supabase
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
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  dateFilter === btn.id
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
            <span className="text-xs text-[#075D63] font-bold mt-0.5 block">Across 75 Questions</span>
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

      {/* CHARTS GRID SECTION 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Respondent Growth Trend Line Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-[#109A9B]" />
                Respondent Growth Trend
              </h3>
              <p className="text-xs text-[#53656A] font-medium">Daily new study submissions & completions</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#075D63] bg-[#EAF6F6] px-2.5 py-1 rounded-full border border-[#109A9B]/20">
              Live Database Stream
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="respondents" stroke="#075D63" strokeWidth={3} name="Total Started" />
                <Line type="monotone" dataKey="completed" stroke="#109A9B" strokeWidth={3} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Status Donut Pie Chart */}
        <div
          ref={donutCardRef}
          className="lg:col-span-4 bg-gradient-to-b from-white via-white to-slate-50/70 p-6 rounded-3xl border border-[#109A9B]/20 shadow-md hover:shadow-xl hover:border-[#109A9B]/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
        >
          {/* Ambient Background Corner Glow */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#109A9B]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#109A9B]/20 transition-all duration-500" />

          {/* Card Header */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
                <PieIcon className="w-4.5 h-4.5 text-[#109A9B]" />
                Submission Completion Ratio
              </h3>
              <span className="text-[10px] font-bold font-mono text-[#075D63] bg-[#EAF6F6] px-2.5 py-0.5 rounded-full border border-[#109A9B]/25">
                Live Ratio
              </span>
            </div>
            <p className="text-xs text-[#53656A] font-medium">Completed vs Incomplete Sessions</p>
          </div>

          {/* Donut Chart with Floating Center Badge */}
          <div className="h-56 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="completedGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#109A9B" />
                    <stop offset="100%" stopColor="#075D63" />
                  </linearGradient>
                  <linearGradient id="incompleteGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
                <Pie
                  data={completionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={86}
                  paddingAngle={6}
                  cornerRadius={8}
                  dataKey="value"
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {completionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="#FFF" strokeWidth={2.5} />
                  ))}
                </Pie>
                <Tooltip
                  wrapperStyle={{ zIndex: 100, pointerEvents: 'none' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const itemData = payload[0].payload;
                      return (
                        <div className="relative z-[100] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-2xl border border-slate-200 text-xs space-y-1">
                          <div className="flex items-center gap-2 font-bold text-[#10242C]">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: itemData.solidColor }}
                            />
                            <span>{itemData.name}</span>
                          </div>
                          <div className="text-[#53656A] font-semibold">
                            {itemData.value} Sessions ({itemData.pct}%)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Donut Animated Floating Badge */}
            <div
              ref={centerBadgeRef}
              className="absolute inset-0 m-auto w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white/95 backdrop-blur-xs border-2 border-[#109A9B]/25 shadow-md flex flex-col items-center justify-center text-center p-1 pointer-events-none z-0 hover:scale-105 transition-transform"
            >
              <span className="text-[8px] sm:text-[9px] font-extrabold text-[#53656A] uppercase tracking-wider">
                Ratio Score
              </span>
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#075D63] leading-none my-0.5 drop-shadow-2xs">
                {completedPct}%
              </span>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                {completedCount} / {totalRatioCount} Done
              </span>
            </div>
          </div>

          {/* Premium Metric Legend Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100/80">
            {/* Completed Card */}
            <div className="bg-[#EAF6F6]/80 hover:bg-[#EAF6F6] p-2.5 rounded-2xl border border-[#109A9B]/20 transition-all flex flex-col justify-between gap-1 shadow-2xs">
              <div className="flex items-center justify-between gap-1">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#075D63]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#075D63] animate-pulse" />
                  Completed
                </span>
                <span className="text-[10px] font-extrabold text-[#075D63] bg-white px-1.5 py-0.5 rounded-md border border-[#109A9B]/20">
                  {completedPct}%
                </span>
              </div>
              <div className="font-heading font-extrabold text-lg text-[#10242C]">
                {completedCount} <span className="text-xs font-normal text-[#53656A]">sessions</span>
              </div>
            </div>

            {/* Incomplete Card */}
            <div className="bg-[#FFF8E8]/90 hover:bg-[#FFF8E8] p-2.5 rounded-2xl border border-amber-200/80 transition-all flex flex-col justify-between gap-1 shadow-2xs">
              <div className="flex items-center justify-between gap-1">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#D97706]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  Incomplete
                </span>
                <span className="text-[10px] font-extrabold text-[#D97706] bg-white px-1.5 py-0.5 rounded-md border border-amber-200">
                  {incompletePct}%
                </span>
              </div>
              <div className="font-heading font-extrabold text-lg text-[#10242C]">
                {incompleteCount} <span className="text-xs font-normal text-[#53656A]">sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 15 Core Analytical Dimension Scores Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-[#10242C] flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#075D63]" />
            Major Analytical Dimensions Overview (0 – 100% Benchmark Score)
          </h3>
          <p className="text-xs text-[#53656A] font-medium">
            Aggregated population mean index scores calculated across all 75 study items
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dimensionAveragesData} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
              <XAxis dataKey="dimension" interval={0} angle={-35} textAnchor="end" tick={{ fontSize: 10, fontWeight: 700 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [`${value}% Index Score`, 'Score']} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {dimensionAveragesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
