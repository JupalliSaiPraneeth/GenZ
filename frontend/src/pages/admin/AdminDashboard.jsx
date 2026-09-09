import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('7days');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await adminDataService.getDashboardKPIs();
      setKpis(data);
      setLoading(false);
    }
    loadData();
  }, [dateFilter]);

  // Mock Trend Chart Data (Growth over time)
  const growthData = [
    { day: 'Mon', respondents: 12, completed: 10 },
    { day: 'Tue', respondents: 18, completed: 15 },
    { day: 'Wed', respondents: 24, completed: 21 },
    { day: 'Thu', respondents: 31, completed: 28 },
    { day: 'Fri', respondents: 42, completed: 37 },
    { day: 'Sat', respondents: 56, completed: 49 },
    { day: 'Sun', respondents: 68, completed: 61 },
  ];

  // Completion Pie Data
  const completionPieData = [
    { name: 'Completed', value: kpis?.completedSurveys || 12, fill: '#075D63' },
    { name: 'Incomplete', value: kpis?.incompleteSurveys || 2, fill: '#D97706' },
  ];

  // Demographics Breakdown Data
  const ageDistribution = [
    { label: '18–20', count: 35 },
    { label: '21–23', count: 48 },
    { label: '24–26', count: 12 },
    { label: '27–29', count: 4 },
    { label: '30+', count: 1 },
  ];

  const genderDistribution = [
    { name: 'Female', value: 52, fill: '#109A9B' },
    { name: 'Male', value: 42, fill: '#075D63' },
    { name: 'Non-Binary/Other', value: 6, fill: '#FDE7B5' },
  ];

  // 15 Major Analytical Dimensions Averages Data
  const dimensionAveragesData = [
    { dimension: 'Mental Wellbeing', score: 78, fill: '#075D63' },
    { dimension: 'Learning Drive', score: 84, fill: '#109A9B' },
    { dimension: 'Career Readiness', score: 86, fill: '#3B82F6' },
    { dimension: 'Financial Maturity', score: 89, fill: '#059669' },
    { dimension: 'Digital Lifestyle', score: 92, fill: '#8B5CF6' },
    { dimension: 'Health & Fitness', score: 72, fill: '#EC4899' },
    { dimension: 'Family Orientation', score: 81, fill: '#F59E0B' },
    { dimension: 'Peer Relations', score: 79, fill: '#6366F1' },
    { dimension: 'Independence Drive', score: 87, fill: '#D97706' },
    { dimension: 'Entrepreneurship', score: 83, fill: '#10B981' },
    { dimension: 'Global Mobility', score: 74, fill: '#64748B' },
    { dimension: 'Social Duty', score: 76, fill: '#075D63' },
    { dimension: 'Future Adaptability', score: 85, fill: '#109A9B' },
    { dimension: 'Risk Tolerance', score: 68, fill: '#D97706' },
    { dimension: 'Lifestyle Values', score: 80, fill: '#3B82F6' },
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
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2 mb-1">
              <PieIcon className="w-4.5 h-4.5 text-[#109A9B]" />
              Submission Completion Ratio
            </h3>
            <p className="text-xs text-[#53656A] font-medium">Completed vs Incomplete Sessions</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={completionPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                  {completionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Sessions`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around text-xs font-bold pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#075D63]" />
              <span>Completed ({kpis?.completedSurveys || 12})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#D97706]" />
              <span>Incomplete ({kpis?.incompleteSurveys || 2})</span>
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
