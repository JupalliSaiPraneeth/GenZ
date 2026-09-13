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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
          <h3 className="font-heading font-extrabold text-base text-[#10242C]">
            360° Life Dimension Radar Profile
          </h3>

          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#063E46', fontSize: 12, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Participant Score" dataKey="score" stroke="#109A9B" fill="#109A9B" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: DATA QUALITY */}
      {activeTab === 'quality' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#109A9B]" />
            <h3 className="font-heading font-extrabold text-base text-[#10242C]">
              Automated Quality Checks & Validation Metrics
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div className={`p-4 rounded-2xl border ${
              qualityMetrics.qualityRating === 'Verified' 
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50/90 border-amber-200 text-amber-900'
            }`}>
              <span className="text-[#53656A] block text-[11px] font-bold uppercase mb-1">Quality Rating</span>
              <div className="flex items-center gap-2">
                {qualityMetrics.qualityRating === 'Verified' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <span className="font-extrabold text-lg">{qualityMetrics.qualityRating || 'Verified'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[#53656A] block text-[11px] font-bold uppercase mb-1">Straight-Line Flag</span>
              <div className="flex items-center gap-2 mt-1">
                {qualityMetrics.straightLineDetected ? (
                  <>
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                    <span className="font-bold text-amber-800">Detected ({qualityMetrics.maxConsecutiveIdentical || 8} consecutive)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-800">Clear</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[#53656A] block text-[11px] font-bold uppercase mb-1">Completion Time Anomaly</span>
              <div className="flex items-center gap-2 mt-1">
                {qualityMetrics.speedAnomaly ? (
                  <>
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                    <span className="font-bold text-amber-800">Rapid Speed</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-800">Normal Pace</span>
                  </>
                )}
              </div>
            </div>
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
