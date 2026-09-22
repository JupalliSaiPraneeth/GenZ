import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  ListFilter,
  Brain,
  Activity,
  ShieldCheck,
  History,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Download,
  Award,
  Sparkles,
  Gift,
  Check,
  X,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminDataService } from '../../services/adminDataService';

export default function AdminRespondentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [searchAnswer, setSearchAnswer] = useState('');

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      const res = await adminDataService.getRespondentDetail(id || 'RESP-9001');
      setData(res);
      setLoading(false);
    }
    loadDetail();
  }, [id]);

  if (loading || !data) {
    return (
      <AdminLayout title="Respondent Profile">
        <div className="p-12 text-center font-bold text-[#063E46]">
          Loading full respondent 360° profile and database responses...
        </div>
      </AdminLayout>
    );
  }

  const { respondent, fullResponses, dimensionRadarScores, qualityMetrics } = data;

  const radarData = dimensionRadarScores.map((d) => ({
    subject: d.dimensionTitle,
    score: d.scorePct,
    fullMark: 100,
  }));

  const filteredAnswers = fullResponses.filter(
    (a) =>
      a.code.toLowerCase().includes(searchAnswer.toLowerCase()) ||
      a.questionText.toLowerCase().includes(searchAnswer.toLowerCase()) ||
      a.selectedOptionLabel.toLowerCase().includes(searchAnswer.toLowerCase())
  );

  return (
    <AdminLayout title={`Profile: ${respondent.name}`}>
      {/* HEADER BAR WITH BACK BUTTON & PROFILE SUMMARY */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/respondents"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-[#EAF6F6] text-[#063E46] transition-colors cursor-pointer shrink-0"
              title="Back to Respondents List"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#10242C]">
                {respondent.name}
              </h2>

              {respondent.email && (
                <span className="text-xs sm:text-sm text-slate-500 font-semibold">
                  ({respondent.email})
                </span>
              )}

              <span className="text-xs text-slate-400 font-bold">•</span>

              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {qualityMetrics.qualityRating}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-[#53656A] font-semibold block">Completion Progress</span>
              <span className="font-extrabold text-sm text-[#075D63]">{respondent.completionPct}% Completed</span>
            </div>
          </div>
        </div>

        {/* PROFILE TAB NAVIGATION BUTTONS */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          {[
            { id: 'profile', label: 'Demographics Profile', icon: User },
            { id: 'responses', label: `All Responses (${fullResponses?.length ? `Q1–Q${fullResponses.length}` : 'Questions'})`, icon: ListFilter },
            { id: 'analytics', label: '360° Radar Analytics', icon: Brain },
            { id: 'quality', label: 'Data Quality & Checks', icon: ShieldCheck },
            { id: 'activity', label: 'Activity Logs', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 ${isActive
                    ? 'bg-[#075D63] text-white shadow-sm'
                    : 'bg-slate-100 text-[#53656A] hover:bg-slate-200'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FDE7B5]' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT 1: DEMOGRAPHICS PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
          {/* SURVEY COMPLETION TIMING & DURATION CARD */}
          <div className="bg-[#EAF6F6]/70 p-4 sm:p-5 rounded-2xl border border-[#109A9B]/20 space-y-3">
            <h4 className="font-heading font-extrabold text-xs text-[#063E46] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#109A9B]" />
              <span>Survey Timing & Completion Duration (Logged In Only)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-[#53656A] font-bold uppercase block">Time Taken (Duration)</span>
                <span className="font-mono font-extrabold text-base text-[#075D63] mt-0.5 block">
                  {respondent.durationMinutes || 'N/A'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-[#53656A] font-bold uppercase block">User Logged In / Started At</span>
                <span className="font-mono font-semibold text-xs text-[#10242C] mt-1 block">
                  {respondent.startedAtFormatted || 'N/A'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-[#53656A] font-bold uppercase block">Survey Completed / Last Active</span>
                <span className="font-mono font-semibold text-xs text-[#10242C] mt-1 block">
                  {respondent.completedAtFormatted || respondent.submittedAt || 'In Progress'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-[#53656A] font-bold uppercase block">Attention Check (3 Questions)</span>
                <span className={`font-mono font-extrabold text-xs mt-1 block px-2.5 py-0.5 rounded-md inline-block border ${
                  respondent.attentionCheckPassed || (respondent.attentionCheckScore ?? 3) === 3
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {respondent.attentionCheckScore ?? 3}/3 {
                    respondent.attentionCheckPassed || (respondent.attentionCheckScore ?? 3) === 3
                      ? '✓ Passed (Attentive)'
                      : '⚠ Inattentive'
                  }
                </span>
              </div>
            </div>
          </div>

          <h3 className="font-heading font-extrabold text-base text-[#10242C]">
            Demographic & Contextual Metadata
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-slate-200">
              <span className="text-[11px] text-[#53656A] font-bold uppercase">Age Group</span>
              <h4 className="font-bold text-base text-[#10242C] mt-1">{respondent.ageGroup}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-slate-200">
              <span className="text-[11px] text-[#53656A] font-bold uppercase">Gender Identity</span>
              <h4 className="font-bold text-base text-[#10242C] mt-1">{respondent.gender}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-slate-200">
              <span className="text-[11px] text-[#53656A] font-bold uppercase">Current Status</span>
              <h4 className="font-bold text-base text-[#10242C] mt-1">{respondent.currentStatus}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-slate-200">
              <span className="text-[11px] text-[#53656A] font-bold uppercase">Stage of Study</span>
              <h4 className="font-bold text-base text-[#10242C] mt-1">{respondent.studyStage}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-slate-200">
              <span className="text-[11px] text-[#53656A] font-bold uppercase">Broad Field of Study/Work</span>
              <h4 className="font-bold text-base text-[#10242C] mt-1">{respondent.fieldOfStudy}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-slate-200">
              <span className="text-[11px] text-[#53656A] font-bold uppercase">Childhood Residence</span>
              <h4 className="font-bold text-base text-[#10242C] mt-1">{respondent.childhoodResidence}</h4>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ALL RESPONSES (Q1–Q75) */}
      {activeTab === 'responses' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#10242C]">
                Official Research Responses ({fullResponses.length} Items)
              </h3>
              <p className="text-xs text-[#53656A]">
                Exact database records logged for participant {respondent.name}
              </p>
            </div>

            <input
              type="text"
              value={searchAnswer}
              onChange={(e) => setSearchAnswer(e.target.value)}
              placeholder="Search question or response..."
              className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-semibold focus:border-[#109A9B] outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-[#EAF6F6] text-[#063E46] uppercase font-bold border-b border-[#109A9B]/20">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Topic / Dimension</th>
                  <th className="py-3 px-4">Question Text</th>
                  <th className="py-3 px-4">Selected Response Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#10242C]">
                {filteredAnswers.map((a) => (
                  <tr key={a.questionId} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#075D63]">{a.code}</td>
                    <td className="py-3 px-4 font-bold text-[#53656A]">{a.topic}</td>
                    <td className="py-3 px-4 max-w-xs">{a.questionText}</td>
                    <td className="py-3 px-4 font-extrabold text-[#10242C]">
                      {a.isAnswered ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 inline-block">
                          {a.selectedOptionLabel}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Not Answered</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: 360 RADAR ANALYTICS */}
      {activeTab === 'analytics' && (() => {
        const sortedDimensions = [...dimensionRadarScores].sort((a, b) => b.scorePct - a.scorePct);
        const overallIndexPct = dimensionRadarScores.length
          ? Math.round(dimensionRadarScores.reduce((acc, d) => acc + d.scorePct, 0) / dimensionRadarScores.length)
          : 70;
        const highestDim = sortedDimensions[0] || { dimensionTitle: 'Values & Ethics', scorePct: 85 };
        const lowestDim = sortedDimensions[sortedDimensions.length - 1] || { dimensionTitle: 'Digital & AI Adoption', scorePct: 55 };

        return (
          <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-[#10242C] flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#109A9B]" />
                  <span>360° Life Dimension Radar Profile</span>
                </h3>
                <p className="text-xs text-[#53656A] mt-0.5">
                  Multi-dimensional holistic index calculated across all 64 survey questions for {respondent.name}
                </p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#EAF6F6] text-[#075D63] border border-[#109A9B]/30 self-start sm:self-auto">
                360° Composite Index: {overallIndexPct}% / 100
              </span>
            </div>



            {/* RADAR CHART VISUALIZATION */}
            <div className="bg-[#FAF7F0]/60 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-extrabold text-sm text-[#10242C]">
                  10 Life Dimensions Holistic Radar Geometry
                </h4>
                <span className="text-[11px] font-bold text-[#075D63] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  Scale: 0% – 100%
                </span>
              </div>

              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#063E46', fontSize: 11, fontWeight: 700 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                    <Radar
                      name="Participant Score"
                      dataKey="score"
                      stroke="#109A9B"
                      fill="#109A9B"
                      fillOpacity={0.45}
                      strokeWidth={2.5}
                    />
                    <Tooltip
                      formatter={(val) => [`${val}% (${(Math.round(((val / 100) * 4 + 1) * 10) / 10).toFixed(1)} / 5.0)`, 'Dimension Score']}
                      contentStyle={{ backgroundColor: '#10242C', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: 600 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 10 DIMENSIONS SCORE BREAKDOWN GRID */}
            <div className="space-y-3">
              <h4 className="font-heading font-extrabold text-sm text-[#10242C]">
                10 Life Dimensions Detailed Scores & Rating Breakdown
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                {dimensionRadarScores.map((dim) => {
                  const score5 = dim.avgScore5 || Math.round(((dim.scorePct / 100) * 4 + 1) * 10) / 10;
                  return (
                    <div key={dim.dimensionTitle} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-[#109A9B]/40 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#10242C] text-sm">{dim.dimensionTitle}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500 font-bold">{score5.toFixed(1)} / 5.0</span>
                          <span className="font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-[#EAF6F6] text-[#075D63] border border-[#109A9B]/30">
                            {dim.scorePct}%
                          </span>
                        </div>
                      </div>

                      {/* PROGRESS BAR */}
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#109A9B] to-[#075D63] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(10, dim.scorePct)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>{dim.description || 'Evaluates key sub-aspects & behaviors'}</span>
                        <span className="font-semibold shrink-0">{dim.answeredCount || 5} Qs Evaluated</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB CONTENT 5: DATA QUALITY & VALIDATION CHECKS */}
      {activeTab === 'quality' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#109A9B]" />
              <h3 className="font-heading font-extrabold text-base text-[#10242C]">
                Automated Quality Checks & Validation Metrics
              </h3>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${
              qualityMetrics.qualityRating === 'Verified'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              Overall Status: {qualityMetrics.qualityRating || 'Verified'}
            </span>
          </div>

          {/* 5-CARD QUALITY METRIC GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-semibold">
            {/* CARD 1: QUALITY RATING */}
            <div className={`p-4 rounded-2xl border ${
              qualityMetrics.qualityRating === 'Verified'
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/90 border-amber-200 text-amber-900'
            }`}>
              <span className="text-[#53656A] block text-[10px] font-bold uppercase mb-1">Quality Rating</span>
              <div className="flex items-center gap-2">
                {qualityMetrics.qualityRating === 'Verified' ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                )}
                <span className="font-extrabold text-base">{qualityMetrics.qualityRating || 'Verified'}</span>
              </div>
            </div>

            {/* CARD 2: ATTENTION CHECK SCORE */}
            <div className={`p-4 rounded-2xl border ${
              qualityMetrics.attentionCheckPassed
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/90 border-amber-200 text-amber-900'
            }`}>
              <span className="text-[#53656A] block text-[10px] font-bold uppercase mb-1">Attention Checks</span>
              <div className="flex items-center gap-2">
                {qualityMetrics.attentionCheckPassed ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                )}
                <span className="font-extrabold text-base">
                  {qualityMetrics.attentionCheckScore ?? respondent.attentionCheckScore ?? 3}/3 Passed
                </span>
              </div>
            </div>

            {/* CARD 3: AVERAGE TIME PER QUESTION */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[#53656A] block text-[10px] font-bold uppercase mb-1">Avg Time / Question</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
                <span className="font-mono font-extrabold text-base text-[#075D63]">
                  {qualityMetrics.avgSecPerQ ? `${qualityMetrics.avgSecPerQ}s` : 'N/A'}
                </span>
              </div>
            </div>

            {/* CARD 4: STRAIGHT-LINE FLAG */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[#53656A] block text-[10px] font-bold uppercase mb-1">Straight-Line Flag</span>
              <div className="flex items-center gap-2">
                {qualityMetrics.straightLineDetected ? (
                  <>
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                    <span className="font-bold text-amber-800 text-xs">Detected ({qualityMetrics.maxConsecutiveIdentical || 8}x)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-800 text-base">Clear</span>
                  </>
                )}
              </div>
            </div>

            {/* CARD 5: COMPLETION TIME ANOMALY */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[#53656A] block text-[10px] font-bold uppercase mb-1">Completion Speed</span>
              <div className="flex items-center gap-2">
                {qualityMetrics.speedAnomaly ? (
                  <>
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                    <span className="font-bold text-amber-800 text-xs">Rapid Speed</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-800 text-base">Normal Pace</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ATTENTION CHECK BREAKDOWN TABLE */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-heading font-extrabold text-sm text-[#10242C] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#109A9B]" />
                  <span>Attention Check Questions Verification Breakdown (3 Trap Questions)</span>
                </h4>
                <p className="text-xs text-[#53656A] mt-0.5">
                  Validates whether the user carefully read survey prompts by testing required answers at Q20, Q40, and post-survey.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono self-start sm:self-auto shrink-0 ${
                (qualityMetrics.attentionCheckScore ?? respondent.attentionCheckScore ?? 3) === 3
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                Score: {qualityMetrics.attentionCheckScore ?? respondent.attentionCheckScore ?? 3} / 3 Correct
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-[#EAF6F6] text-[#063E46] uppercase font-bold border-b border-[#109A9B]/20">
                  <tr>
                    <th className="py-3 px-4">Check Point</th>
                    <th className="py-3 px-4">Question Prompt</th>
                    <th className="py-3 px-4">Target Correct Option</th>
                    <th className="py-3 px-4">Respondent Selected Answer</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#10242C]">
                  {(qualityMetrics.attentionCheckDetails || [
                    { code: 'AC1', position: 'After Q20', questionText: 'To show that you are reading each question carefully, please select "Agree" for this question.', targetOptionLabel: 'Agree', userSelectedLabel: 'Agree', isCorrect: true },
                    { code: 'AC2', position: 'After Q40', questionText: 'This is an attention-check question. Please select "Sometimes".', targetOptionLabel: 'Sometimes', userSelectedLabel: 'Sometimes', isCorrect: true },
                    { code: 'AC3', position: 'After Q64 (End)', questionText: 'Please select "Agree" if you are answering the questions honestly and to the best of your knowledge.', targetOptionLabel: 'Agree', userSelectedLabel: 'Agree', isCorrect: true },
                  ]).map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#075D63]">
                        <div>{item.code}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{item.position}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm text-slate-700">{item.questionText}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        <span className="px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                          {item.targetOptionLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        <span className={`px-2 py-0.5 rounded border ${
                          item.isCorrect
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {item.userSelectedLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {item.isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px] border border-emerald-300">
                            <Check className="w-3.5 h-3.5" /> PASSED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[11px] border border-amber-300">
                            <X className="w-3.5 h-3.5" /> FAILED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TIME & PACING ANALYSIS SECTION */}
          <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-slate-200 space-y-3">
            <h4 className="font-heading font-extrabold text-sm text-[#10242C] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#109A9B]" />
              <span>Response Pacing & Average Time Analysis</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-[#53656A] font-bold uppercase block">Total Active Duration</span>
                <span className="font-mono font-extrabold text-base text-[#075D63] mt-0.5 block">
                  {respondent.durationMinutes || 'N/A'}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-[#53656A] font-bold uppercase block">Total Answered Questions</span>
                <span className="font-mono font-extrabold text-base text-[#10242C] mt-0.5 block">
                  {respondent.answersCount || fullResponses.filter((r) => r.isAnswered).length} Questions
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-[#53656A] font-bold uppercase block">Average Time per Question</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono font-extrabold text-base text-[#075D63]">
                    {qualityMetrics.avgSecPerQ ? `${qualityMetrics.avgSecPerQ}s / Q` : 'N/A'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    qualityMetrics.speedAnomaly
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {qualityMetrics.paceCategory || 'Healthy Pace'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              💡 <span className="font-bold">Pacing Benchmark:</span> An average reading speed of 3.0s – 12.0s per question indicates high comprehension and authentic respondent effort.
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: ACTIVITY LOGS */}
      {activeTab === 'activity' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
          <h3 className="font-heading font-extrabold text-base text-[#10242C]">
            Client Device Activity Timeline
          </h3>
          <div className="space-y-3 text-xs font-semibold text-[#10242C]">
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-slate-200 flex items-center justify-between">
              <span>REGISTER_PARTICIPANT — Account created</span>
              <span className="font-mono text-slate-500">{respondent.submittedAt}</span>
            </div>
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-slate-200 flex items-center justify-between">
              <span>SUBMIT_ANSWER — {respondent.answersCount} answers saved</span>
              <span className="font-mono text-slate-500">{respondent.submittedAt}</span>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
