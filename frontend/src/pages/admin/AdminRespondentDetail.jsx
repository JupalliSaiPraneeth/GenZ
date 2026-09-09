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

  // Evaluation & Award Control States
  const [evalStatus, setEvalStatus] = useState('pending_evaluation');
  const [certId, setCertId] = useState('');
  const [luckyStatus, setLuckyStatus] = useState('pending');
  const [luckyPrize, setLuckyPrize] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      const res = await adminDataService.getRespondentDetail(id || 'RESP-9001');
      setData(res);
      if (res?.respondent) {
        setEvalStatus(res.respondent.evaluationStatus || 'pending_evaluation');
        setCertId(res.respondent.certificateId || '');
        setLuckyStatus(res.respondent.luckyDrawStatus || 'pending');
        setLuckyPrize(res.respondent.luckyDrawPrize || '');
        setAdminNotes(res.respondent.adminNotes || '');
      }
      setLoading(false);
    }
    loadDetail();
  }, [id]);

  if (loading || !data) {
    return (
      <AdminLayout title="Respondent Profile">
        <div className="p-12 text-center font-bold text-[#063E46]">
          Loading full respondent 360° profile and Q1–Q75 database responses...
        </div>
      </AdminLayout>
    );
  }

  const { respondent, fullResponses, dimensionRadarScores, qualityMetrics } = data;

  const handleSaveEvaluation = async (targetEval, targetCert) => {
    setIsUpdating(true);
    setUpdateMsg('');

    const finalEval = targetEval || evalStatus;
    const finalCert = targetCert || (finalEval === 'approved' ? 'issued' : 'pending');

    const payload = {
      evaluation_status: finalEval,
      certificate_status: finalCert,
      lucky_draw_status: luckyStatus,
      lucky_draw_prize: luckyPrize,
      admin_notes: adminNotes,
    };

    const res = await adminDataService.updateRespondentEvaluation(respondent.id, payload);
    setIsUpdating(false);

    if (res?.error) {
      setUpdateMsg(`⚠️ Error updating: ${res.error}`);
    } else {
      setEvalStatus(finalEval);
      if (res.data?.certificate_id) {
        setCertId(res.data.certificate_id);
      }
      setUpdateMsg('✅ Response evaluation, Certificate & Lucky Draw status updated successfully!');
      setTimeout(() => setUpdateMsg(''), 4000);
    }
  };

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
    <AdminLayout title={`Profile: ${respondent.name} (${respondent.id})`}>
      {/* HEADER BAR WITH BACK BUTTON & PROFILE SUMMARY */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/respondents"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-[#EAF6F6] text-[#063E46] transition-colors cursor-pointer"
              title="Back to Respondents List"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#075D63] bg-[#EAF6F6] px-2.5 py-0.5 rounded-full border border-[#109A9B]/20">
                  {respondent.id}
                </span>
                {respondent.email && (
                  <span className="text-xs text-slate-500 font-semibold">
                    ({respondent.email})
                  </span>
                )}
                <span className="text-xs text-slate-400 font-bold">•</span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {qualityMetrics.qualityRating}
                </span>
              </div>
              <h2 className="font-heading font-extrabold text-xl text-[#10242C] mt-1">
                {respondent.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-[#53656A] font-semibold block">Completion Progress</span>
              <span className="font-extrabold text-sm text-[#075D63]">{respondent.completionPct}% Completed</span>
            </div>
          </div>
        </div>

        {/* ADMIN RESPONSE EVALUATION & AWARD PANEL */}
        <div className="bg-[#FAF7F0] p-4 sm:p-5 rounded-2xl border-2 border-[#109A9B]/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#075D63]" />
              <h3 className="font-heading font-extrabold text-base text-[#10242C]">
                Admin Evaluation & Award Control Panel
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {evalStatus === 'approved' && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Issued ({certId || 'CERT-GZ2026'})
                </span>
              )}
              {evalStatus === 'pending_evaluation' && (
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Admin Review
                </span>
              )}
              {evalStatus === 'rejected' && (
                <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full border border-rose-300 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Rejected
                </span>
              )}
            </div>
          </div>

          {updateMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900">
              {updateMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
            {/* 1. Evaluation & Certificate Action */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <label className="block font-bold text-[#063E46] uppercase tracking-wider text-[11px]">
                1. Response Evaluation & Certificate Issuance
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleSaveEvaluation('approved', 'issued')}
                  className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Issue Cert</span>
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleSaveEvaluation('rejected', 'revoked')}
                  className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>

            {/* 2. Lucky Draw Status & Prize */}
            <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200">
              <label className="block font-bold text-[#063E46] uppercase tracking-wider text-[11px]">
                2. Lucky Draw Status & Prize Award
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={luckyStatus}
                  onChange={(e) => setLuckyStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 font-semibold outline-none focus:border-[#109A9B]"
                >
                  <option value="pending">Pending</option>
                  <option value="eligible">Eligible</option>
                  <option value="winner">Winner 🏆</option>
                  <option value="not_selected">Not Selected</option>
                </select>
                <input
                  type="text"
                  value={luckyPrize}
                  onChange={(e) => setLuckyPrize(e.target.value)}
                  placeholder="Prize e.g. Smart Watch / $50 Gift Card"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 font-semibold outline-none focus:border-[#109A9B]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <input
              type="text"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Admin evaluation notes / feedback comments..."
              className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#109A9B]"
            />
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleSaveEvaluation()}
              className="px-4 py-2 bg-[#063E46] hover:bg-[#075D63] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-all shrink-0"
            >
              {isUpdating ? 'Saving...' : 'Save All Updates'}
            </button>
          </div>
        </div>

        {/* PROFILE TAB NAVIGATION BUTTONS */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          {[
            { id: 'profile', label: 'Demographics Profile', icon: User },
            { id: 'responses', label: 'All Responses (Q1–Q75)', icon: ListFilter },
            { id: 'analytics', label: '360° Radar Analytics', icon: Brain },
            { id: 'behaviour', label: 'Behaviour Profile', icon: Activity },
            { id: 'quality', label: 'Data Quality & Checks', icon: ShieldCheck },
            { id: 'activity', label: 'Activity Logs', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  isActive
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
                Official Q1–Q75 Research Responses ({fullResponses.length} Items)
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

      {/* TAB CONTENT 4: BEHAVIOUR PROFILE */}
      {activeTab === 'behaviour' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
          <h3 className="font-heading font-extrabold text-base text-[#10242C]">
            Attitudinal & Behavioral Archetype Summary
          </h3>
          <p className="text-xs text-[#53656A] font-medium leading-relaxed">
            Based on the participant's cross-section responses in Section 1 to Section 4, this participant demonstrates high engagement with self-driven learning and digital technology adoption.
          </p>
        </div>
      )}

      {/* TAB CONTENT 5: DATA QUALITY */}
      {activeTab === 'quality' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
          <h3 className="font-heading font-extrabold text-base text-[#10242C]">
            Automated Quality Checks & Validation Metrics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[#53656A] block">Quality Rating</span>
              <span className="font-extrabold text-lg text-emerald-800">{qualityMetrics.qualityRating}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[#53656A] block">Straight-Line Flag</span>
              <span className="font-bold text-slate-800">
                {qualityMetrics.straightLineDetected ? '⚠️ Detected' : '✅ Clear'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[#53656A] block">Completion Time Anomaly</span>
              <span className="font-bold text-slate-800">
                {qualityMetrics.speedAnomaly ? '⚠️ Rapid Speed' : '✅ Normal Pace'}
              </span>
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
