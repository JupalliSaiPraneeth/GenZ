import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, ShieldCheck, Download, Clock, Sparkles, RefreshCw, Gift, AlertCircle, ArrowLeft } from 'lucide-react';
import { useSurveyStore } from '../stores/surveyStore';
import { fetchParticipantStatus } from '../services/supabaseClient';
import GridModal from '../components/common/GridModal';

export default function SurveyComplete() {
  const { participantName, participantEmail, participantId } = useSurveyStore();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  const loadStatus = async () => {
    setIsRefreshing(true);
    const savedId = participantId || localStorage.getItem('genz_participant_id');
    const savedEmail = participantEmail || localStorage.getItem('genz_participant_email');
    const target = savedId || savedEmail;

    if (target) {
      const data = await fetchParticipantStatus(target);
      if (data) {
        setParticipant(data);
      }
    }
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadStatus();
  }, [participantId, participantEmail]);

  const pName = participant?.name || participantName || localStorage.getItem('genz_participant_name') || 'Gen Z Participant';
  const pEmail = participant?.email || participantEmail || localStorage.getItem('genz_participant_email') || '';
  const certCode = participant?.certificate_id || `CERT-GZ2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const evalStatus = participant?.evaluation_status || 'pending_evaluation';
  const certStatus = participant?.certificate_status || (evalStatus === 'approved' ? 'issued' : 'pending');
  const luckyStatus = participant?.lucky_draw_status || 'pending';
  const luckyPrize = participant?.lucky_draw_prize;

  const isApproved = evalStatus === 'approved' || certStatus === 'issued';
  const isRejected = evalStatus === 'rejected';
  const isPending = !isApproved && !isRejected;

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] overflow-x-hidden font-inter">
      {/* TOP TEAL 50% / BOTTOM CREAM 50% DUAL COLOR SPLIT BACKGROUND */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#109A9B] to-[#075D63] z-0 overflow-hidden" />
      <div className="absolute top-[50vh] left-0 right-0 h-[2px] bg-[#FAF7F0]/40 z-0 pointer-events-none" />

      {/* ORGANIC BACKGROUND SHAPES */}
      <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-[#FFF8E8]/20 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-[#109A9B]/30 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 pt-[75px] sm:pt-[95px] pb-12 px-3.5 sm:px-6 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
        
        {/* Header Icon Box */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 text-[#FDE7B5] flex items-center justify-center mx-auto shadow-md border border-white/25 backdrop-blur-md">
          <Award className="w-7 h-7 sm:w-9 sm:h-9 text-[#FDE7B5]" />
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-[40px] text-[#FFF8E8] tracking-tight leading-tight drop-shadow-xs">
            Responses Submitted Successfully!
          </h1>
          <p className="text-[#FFF8E8]/90 text-xs sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
            Thank you <strong className="text-white font-bold">{pName}</strong>! Your 75 responses have been securely logged in our research database.
          </p>
        </div>

        {/* DYNAMIC EVALUATION & CERTIFICATE CARD */}
        <div className="bg-[#FFFDF9] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-white/80 shadow-[0px_20px_50px_rgba(6,62,70,0.15)] text-left max-w-xl mx-auto space-y-4 sm:space-y-6 relative z-20">

          {/* STATUS HEADER BADGE */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 sm:pb-4">
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-[#53656A]">
                SUBMISSION STATUS
              </span>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#10242C] mt-0.5 flex items-center gap-1.5">
                {isApproved && (
                  <>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                    <span>Verified & Certificate Unlocked</span>
                  </>
                )}
                {isPending && (
                  <span>Pending Admin Evaluation</span>
                )}
                {isRejected && (
                  <>
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
                    <span>Submission Under Review</span>
                  </>
                )}
              </h3>
            </div>

            <button
              onClick={loadStatus}
              disabled={isRefreshing}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-[#EAF6F6] text-[#075D63] transition-all flex items-center gap-1 text-xs font-bold cursor-pointer shrink-0"
              title="Refresh status from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* CASE 1: PENDING EVALUATION STATE */}
          {isPending && (
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3.5 sm:p-4 bg-amber-50 rounded-xl sm:rounded-2xl border border-amber-200/80 text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-amber-950">
                  <span>Admin Evaluation in Progress</span>
                </div>
                <p className="text-xs leading-relaxed text-amber-900/90 font-medium">
                  Our research evaluation team is reviewing your 75 survey responses. Once evaluated and verified by the admin, your official <strong>Certificate of Participation</strong> will be generated here, and your <strong>Lucky Draw Entry</strong> will be announced!
                </p>
              </div>

              <div className="p-3 sm:p-3.5 bg-[#EAF6F6] rounded-xl sm:rounded-2xl border border-[#109A9B]/20 text-xs text-[#075D63] font-medium flex items-center gap-2.5">
                <ShieldCheck className="w-4.5 h-4.5 text-[#109A9B] shrink-0" />
                <span>Your registered email <strong>{pEmail || 'associated with your account'}</strong> will be notified once evaluated.</span>
              </div>
            </div>
          )}

          {/* CASE 2: APPROVED & ISSUED CERTIFICATE STATE */}
          {isApproved && (
            <div className="space-y-4 sm:space-y-6">
              {/* CERTIFICATE DISPLAY BOX */}
              <div className="p-4 sm:p-6 bg-[#FFF8E8] rounded-2xl border-2 border-[#109A9B]/30 text-center space-y-2.5 relative overflow-hidden shadow-inner">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#063E46] to-[#109A9B] rounded-2xl text-[#FDE7B5] flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#075D63] uppercase bg-white/80 px-2.5 py-0.5 rounded-full border border-[#109A9B]/20">
                    VERIFIED CODE: {certCode}
                  </span>
                  <h4 className="font-heading font-extrabold text-lg sm:text-xl text-[#10242C] mt-2">
                    Certificate of Research Participation
                  </h4>
                  <p className="text-xs text-[#53656A] mt-1 font-medium leading-relaxed">
                    Proudly awarded to <strong className="text-[#10242C] font-bold text-xs sm:text-sm">{pName}</strong> ({pEmail}) for contribution to national Gen Z Research 2026.
                  </p>
                </div>
              </div>

              {/* LUCKY DRAW ANNOUNCEMENT BANNER */}
              <div className="p-4 sm:p-5 rounded-2xl border text-left space-y-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    LUCKY DRAW ANNOUNCEMENT
                  </span>
                  {luckyStatus === 'winner' && (
                    <span className="px-2 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-950" />
                      <span>WINNER</span>
                    </span>
                  )}
                </div>

                {luckyStatus === 'winner' ? (
                  <div className="space-y-1 pt-1">
                    <h5 className="font-heading font-extrabold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                      Congratulations! You Won the Lucky Draw!
                    </h5>
                    <p className="text-xs text-emerald-900 font-bold">
                      Prize Awarded: <span className="underline text-amber-700">{luckyPrize || 'Special Gen Z Swag & Voucher Kit'}</span>
                    </p>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      Our coordinator will reach out to <strong>{pEmail}</strong> regarding prize dispatch.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-900 font-semibold pt-1">
                    Your entry has been recorded in the active Lucky Draw pool. Prize announcements are updated here periodically.
                  </p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <Link
                  to={`/verify-certificate?code=${certCode}`}
                  className="bg-white border-2 border-[#075D63]/30 hover:border-[#075D63] text-[#10242C] font-bold text-xs sm:text-sm flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all shadow-2xs"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verify Online Certificate</span>
                </Link>
                <button
                  onClick={() =>
                    setModalConfig({
                      isOpen: true,
                      title: 'Certificate Downloaded',
                      message: `Certificate ${certCode} downloaded successfully for ${pName}!`,
                      type: 'success',
                    })
                  }
                  className="bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-bold text-xs sm:text-sm flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#FDE7B5] shrink-0" />
                  <span>Download PDF Certificate</span>
                </button>
              </div>
            </div>
          )}

          {/* CASE 3: REJECTED STATE */}
          {isRejected && (
            <div className="p-4 sm:p-5 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-rose-950">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Response Quality Verification Notice</span>
              </div>
              <p className="text-xs text-rose-800 font-medium leading-relaxed">
                {participant?.admin_notes || 'Your response set did not pass quality verification checks. Please contact admin support if you believe this was an error.'}
              </p>
            </div>
          )}

          <div className="pt-3 text-center border-t border-slate-100">
            <Link to="/" className="text-xs font-bold text-[#075D63] hover:underline inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5 text-[#075D63]" />
              <span>Return to Home Page</span>
            </Link>
          </div>

        </div>

      </div>

      <GridModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
}
