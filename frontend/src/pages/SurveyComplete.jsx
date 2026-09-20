import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Gift,
  Sparkles,
  Download,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { getStoredQuestions } from '../data/surveyQuestions';
import { useSurveyStore } from '../stores/surveyStore';
import { fetchParticipantStatus, generateDeterministicCertId } from '../services/supabaseClient';
import {
  generateCertificateDataUrl,
  downloadCertificatePdf,
  downloadCertificateImage,
} from '../services/certificateGenerator';
import GridModal from '../components/common/GridModal';

export default function SurveyComplete() {
  const { participantName, participantEmail, participantId, setParticipantDetails, completeSurvey } = useSurveyStore();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  // Certificate State
  const [certName, setCertName] = useState(
    participantName || localStorage.getItem('genz_participant_name') || 'Gen Z Participant'
  );
  const [certDate, setCertDate] = useState(
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  );
  const [certPreviewUrl, setCertPreviewUrl] = useState('');
  const [isGeneratingCert, setIsGeneratingCert] = useState(true);
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  const totalQs = (getStoredQuestions() || []).length || 75;

  const loadStatus = async () => {
    setIsRefreshing(true);
    if (completeSurvey) {
      await completeSurvey();
    }
    const savedId = participantId || localStorage.getItem('genz_participant_id');
    const savedEmail = participantEmail || localStorage.getItem('genz_participant_email');
    const target = savedId || savedEmail;

    if (target) {
      const data = await fetchParticipantStatus(target);
      if (data) {
        setParticipant(data);
        if (data.name && data.name !== certName) {
          setCertName(data.name);
        }
      }
    }
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadStatus();
  }, [participantId, participantEmail]);

  const pName = participant?.name || certName || localStorage.getItem('genz_participant_name') || 'Gen Z Participant';
  const pEmail = participant?.email || participantEmail || localStorage.getItem('genz_participant_email') || '';
  const certCode = useMemo(() => {
    if (participant?.certificate_id) return participant.certificate_id;
    const seed = participant?.id || participantId || localStorage.getItem('genz_participant_id') || pEmail || pName;
    return generateDeterministicCertId(seed);
  }, [participant?.certificate_id, participant?.id, participantId, pEmail, pName]);
  const evalStatus = participant?.evaluation_status || 'approved';
  const certStatus = participant?.certificate_status || 'issued';
  const luckyStatus = participant?.lucky_draw_status || 'pending';
  const luckyPrize = participant?.lucky_draw_prize;

  useEffect(() => {
    let isMounted = true;

    async function prepareCertificate() {
      const targetName = (certName || pName || 'Gen Z Participant').trim();
      setIsGeneratingCert(true);
      try {
        const dataUrl = await generateCertificateDataUrl(targetName, certDate, certCode);
        if (isMounted) {
          setCertPreviewUrl(dataUrl);
        }
      } catch (err) {
        console.warn('Certificate generation notice:', err);
      } finally {
        if (isMounted) setIsGeneratingCert(false);
      }
    }

    prepareCertificate();

    return () => {
      isMounted = false;
    };
  }, [certName, certDate, certCode, pName]);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] overflow-x-hidden font-inter">
      {/* TOP TEAL 50% / BOTTOM CREAM 50% DUAL COLOR SPLIT BACKGROUND */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#109A9B] to-[#075D63] z-0 overflow-hidden" />
      <div className="absolute top-[50vh] left-0 right-0 h-[2px] bg-[#FAF7F0]/40 z-0 pointer-events-none" />

      {/* ORGANIC BACKGROUND SHAPES */}
      <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-[#FFF8E8]/20 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-[#109A9B]/30 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 pt-[75px] sm:pt-[95px] pb-16 px-3.5 sm:px-6 max-w-5xl lg:max-w-6xl mx-auto text-center space-y-5 sm:space-y-6">

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
            Thank you <strong className="text-white font-bold">{certName}</strong>! Your {totalQs} responses have been securely logged in our research database.
          </p>
        </div>

        {/* LIVE CERTIFICATE PREVIEW & DISPLAY CARD (HORIZONTAL GRID) */}
        <div className="bg-[#FFFDF9] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-white/80 shadow-[0px_20px_50px_rgba(6,62,70,0.15)] text-left w-full mx-auto relative z-20">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* LEFT COLUMN: DYNAMIC HIGH-RESOLUTION CERTIFICATE IMAGE PREVIEW */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#063E46] uppercase tracking-wider font-mono">
                  Official Certificate Preview
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullImageModal(true)}
                  className="text-[11px] font-bold text-[#109A9B] hover:text-[#075D63] flex items-center gap-1.5 cursor-pointer transition-colors px-2.5 py-1 rounded-lg hover:bg-teal-50"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Fullscreen</span>
                </button>
              </div>

              <div className="relative group rounded-2xl overflow-hidden border-2 border-[#109A9B]/30 shadow-xl bg-slate-900 aspect-[3/2] flex items-center justify-center">
                {isGeneratingCert ? (
                  <div className="flex flex-col items-center gap-2 text-white/80">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#109A9B]" />
                    <span className="text-xs font-semibold">Rendering Certificate Preview...</span>
                  </div>
                ) : certPreviewUrl ? (
                  <img
                    src={certPreviewUrl}
                    alt={`Gen Z Certificate for ${certName}`}
                    onClick={() => setShowFullImageModal(true)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01] cursor-pointer"
                  />
                ) : (
                  <div className="text-xs text-slate-400">Failed to render certificate preview</div>
                )}

                {/* OVERLAY CORNER BADGE */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#FDE7B5] border border-white/20 pointer-events-none">
                  Interactive Preview
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DETAILS, LUCKY DRAW STATUS & ACTION CONTROLS */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between h-full">

              {/* STATUS HEADER BADGE */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#53656A]">
                    SURVEY CERTIFICATE
                  </span>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#10242C] mt-0.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span>Verified Certificate Generated</span>
                  </h3>
                </div>

                <span className="text-[10px] sm:text-[11px] font-mono font-extrabold text-[#075D63] bg-[#EAF6F6] px-3 py-1 rounded-full border border-[#109A9B]/20 shrink-0">
                  {certCode}
                </span>
              </div>

              {/* RECIPIENT NAME DISPLAY ROW */}
              <div className="p-3.5 bg-[#FAF7F0] rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-mono font-extrabold uppercase text-[#53656A] tracking-wider block">
                  Certificate Recipient Name
                </span>
                <span className="font-heading font-extrabold text-sm sm:text-base text-[#075D63] mt-0.5 block">
                  {certName}
                </span>
              </div>

              {/* LUCKY DRAW ANNOUNCEMENT BANNER */}
              <div className="p-4 rounded-2xl border text-left space-y-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    LUCKY DRAW ENTRY CONFIRMED
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
                    <h5 className="font-heading font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
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
                    Your entry has been registered in the active Lucky Draw pool. Winner announcements are updated periodically.
                  </p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => downloadCertificatePdf(certName, certDate, certCode)}
                  className="w-full bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4 text-[#FDE7B5] shrink-0" />
                  <span>Download PDF Certificate</span>
                </button>

                <button
                  onClick={() => downloadCertificateImage(certName, certDate, certCode)}
                  className="w-full bg-white hover:bg-[#EAF6F6] border-2 border-[#109A9B]/40 text-[#075D63] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4 text-[#109A9B] shrink-0" />
                  <span>Download Image Certificate</span>
                </button>
              </div>

              <div className="pt-2 text-center border-t border-slate-100">
                <Link to="/" className="text-xs font-bold text-[#075D63] hover:underline inline-flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5 text-[#075D63]" />
                  <span>Return to Home Page</span>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* FULLSCREEN CERTIFICATE IMAGE PREVIEW MODAL */}
      {showFullImageModal && certPreviewUrl && (
        <div
          onClick={() => setShowFullImageModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={certPreviewUrl}
              alt="Gen Z Official Certificate"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border-2 border-white/20"
            />
            <span className="text-white/80 text-xs font-mono mt-3">Click anywhere to close</span>
          </div>
        </div>
      )}

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
