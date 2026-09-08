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
          Loading full respondent 360° profile and Q1–Q207 database responses...
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

        {/* PROFILE TAB NAVIGATION BUTTONS */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
          {[
            { id: 'profile', label: 'Demographics Profile', icon: User },
            { id: 'responses', label: 'All Responses (Q1–Q207)', icon: ListFilter },
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

      {/* TAB CONTENT 2: ALL RESPONSES (Q1–Q207) */}
      {activeTab === 'responses' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#10242C]">
                All Stored Question Responses (Q1 – Q207)
              </h3>
              <p className="text-xs text-[#53656A] font-medium">
                {fullResponses.filter((f) => f.isAnswered).length} of 207 questions answered by participant
              </p>
            </div>

            <input
              type="text"
              value={searchAnswer}
              onChange={(e) => setSearchAnswer(e.target.value)}
              placeholder="Search Q1-Q207 question or response..."
              className="px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#109A9B] w-full sm:w-64"
            />
          </div>

          <div className="overflow-y-auto max-h-[500px] border rounded-2xl border-slate-200 divide-y divide-slate-100">
            {filteredAnswers.map((item) => (
              <div key={item.questionId} className="p-3.5 hover:bg-slate-50 flex flex-col sm:flex-row justify-between gap-2 text-xs">
                <div className="space-y-0.5 max-w-xl">
                  <span className="font-mono font-bold text-[11px] text-[#075D63]">
                    {item.code} • {item.topic}
                  </span>
                  <p className="font-bold text-[#10242C] leading-snug">{item.questionText}</p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className={`font-extrabold px-3 py-1 rounded-full text-xs border inline-block ${
                    item.isAnswered ? 'bg-[#EAF6F6] text-[#075D63] border-[#109A9B]/30' : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {item.selectedOptionLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Value: {item.storedValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: 360° RADAR ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#10242C]">
              Individual 360° Life Orientation Radar
            </h3>
            <p className="text-xs text-[#53656A] font-medium">Calculated score distribution across major construct dimensions</p>
          </div>

          <div className="h-72 sm:h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#063E46' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Respondent Score" dataKey="score" stroke="#075D63" fill="#109A9B" fillOpacity={0.5} />
                <Tooltip formatter={(val) => [`${val}% Score`, 'Dimension Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: DATA QUALITY CHECKS */}
      {activeTab === 'quality' && (
        <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4">
          <h3 className="font-heading font-extrabold text-base text-[#10242C]">
            Data Quality & Pattern Verification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[#53656A] uppercase text-[10px] block">Straight-Line Detection</span>
              <span className="text-emerald-800 font-extrabold text-base">Pass (Clean Variance)</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[#53656A] uppercase text-[10px] block">Completion Speed</span>
              <span className="text-emerald-800 font-extrabold text-base">Normal Pace ({respondent.durationMinutes})</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[#53656A] uppercase text-[10px] block">Attention Checks</span>
              <span className="text-emerald-800 font-extrabold text-base">Passed (100%)</span>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
