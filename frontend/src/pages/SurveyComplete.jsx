import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
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
  Copy,
  Check,
  BarChart3,
  Crown,
  Share2
} from 'lucide-react';
import { getStoredQuestions } from '../data/surveyQuestions';
import { useSurveyStore } from '../stores/surveyStore';
import { fetchParticipantStatus, generateDeterministicCertId, saveCertificateToSupabase } from '../services/supabaseClient';
import {
  generateCertificateDataUrl,
  downloadCertificatePdf,
  downloadCertificateImage,
} from '../services/certificateGenerator';
import { sendCertificateEmail } from '../services/emailService';
import GridModal from '../components/common/GridModal';

export default function SurveyComplete() {
  const { participantName, participantEmail, participantId, setParticipantDetails, completeSurvey, questions } = useSurveyStore();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const [copiedId, setCopiedId] = useState(false);

  // Certificate State (strictly prioritizes confirmed certificate name from modal)
  const [certName, setCertName] = useState(
    localStorage.getItem('genz_certificate_name') || participantName || localStorage.getItem('genz_participant_name') || 'Gen Z Participant'
  );
  const [certDate, setCertDate] = useState(
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  );
  const [certPreviewUrl, setCertPreviewUrl] = useState('');
  const [isGeneratingCert, setIsGeneratingCert] = useState(true);
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  const totalQs = (questions && questions.length > 0 ? questions : getStoredQuestions() || []).length || 75;

  // Trigger celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.35 },
        colors: ['#109A9B', '#FDE7B5', '#063E46', '#10B981', '#8B5CF6']
      });
    } catch (e) {
      console.log('Confetti effect loaded');
    }
  }, []);

  const loadStatus = async () => {
    setIsRefreshing(true);
    const confirmedCertName = localStorage.getItem('genz_certificate_name') || certName;
    if (completeSurvey) {
      await completeSurvey(confirmedCertName);
    }
    const savedId = participantId || localStorage.getItem('genz_participant_id');
    const savedEmail = participantEmail || localStorage.getItem('genz_participant_email');
    const target = savedId || savedEmail;

    if (target) {
      const data = await fetchParticipantStatus(target);
      if (data) {
        setParticipant(data);
        if (confirmedCertName) {
          setCertName(confirmedCertName);
        } else if (data.name && data.name !== certName) {
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

  const pName = localStorage.getItem('genz_certificate_name') || certName || participant?.name || localStorage.getItem('genz_participant_name') || 'Gen Z Participant';
  const pEmail = participant?.email || participantEmail || localStorage.getItem('genz_participant_email') || '';
  const certCode = useMemo(() => {
    if (participant?.certificate_id) return participant.certificate_id;
    const seed = participant?.id || participantId || localStorage.getItem('genz_participant_id') || pEmail || pName;
    return generateDeterministicCertId(seed);
  }, [participant?.certificate_id, participant?.id, participantId, pEmail, pName]);
  const luckyStatus = participant?.lucky_draw_status || 'pending';
  const luckyPrize = participant?.lucky_draw_prize;

  useEffect(() => {
    let isMounted = true;

    async function prepareCertificate() {
      const targetName = (localStorage.getItem('genz_certificate_name') || certName || pName || 'Gen Z Participant').trim();
      setIsGeneratingCert(true);
      try {
        const dataUrl = await generateCertificateDataUrl(targetName, certDate, certCode);
        if (isMounted) {
          setCertPreviewUrl(dataUrl);

          const targetId = participant?.id || participantId || localStorage.getItem('genz_participant_id');
          saveCertificateToSupabase({
            participantId: targetId,
            certCode,
            certName: targetName,
            certDate,
          });

          if (pEmail) {
            sendCertificateEmail(pEmail, targetName, certDate, certCode).catch(() => {});
          }
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
  }, [certName, certDate, certCode, pName, participant?.id, participantId]);

  const handleCopyId = () => {
    if (!certCode) return;
    navigator.clipboard.writeText(certCode);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] overflow-x-hidden font-inter pb-20">
      {/* TOP TEAL HEADER GRADIENT CANVAS WITH SMOOTH DEEP BLEND */}
      <div className="absolute top-0 left-0 right-0 h-[480px] bg-gradient-to-b from-[#063E46] via-[#075D63] to-[#109A9B] z-0 overflow-hidden" />

      {/* AMBIENT GLOW & CELEBRATION ACCENTS */}
      <div className="absolute top-12 left-[10%] w-[350px] h-[350px] rounded-full bg-[#FFF8E8]/15 blur-[90px] pointer-events-none z-0" />
      <div className="absolute top-24 right-[10%] w-[400px] h-[400px] rounded-full bg-[#109A9B]/30 blur-[100px] pointer-events-none z-0" />

      {/* MAIN CONTAINER WITH AMPLE TOP PADDING TO PREVENT OVERLAP WITH FLOATING NAVBAR HEADER */}
      <div className="relative z-10 pt-[125px] sm:pt-[140px] lg:pt-[150px] px-3.5 sm:px-6 max-w-5xl lg:max-w-6xl mx-auto text-center space-y-6 sm:space-y-7">

        {/* STATUS BADGE RIBBON */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 backdrop-blur-md border border-emerald-300/30 text-emerald-200 text-xs font-sora font-extrabold shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="uppercase tracking-wider">100% SURVEY COMPLETED</span>
        </div>

        {/* HERO TITLE & SUBTITLE */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="font-archivo font-extrabold text-2.5xl sm:text-4xl lg:text-5xl text-[#FFF8E8] tracking-tight leading-tight drop-shadow-sm">
            Responses Submitted Successfully!
          </h1>
          <p className="text-[#EAF6F6]/90 text-xs sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Thank you <strong className="text-white font-bold">{certName}</strong>! Your{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/15 text-[#FFF8E8] font-bold font-mono text-xs border border-white/20">
              {totalQs} responses
            </span>{' '}
            have been securely logged in our research database.
          </p>
        </div>

        {/* LIVE CERTIFICATE PREVIEW & ACTION CARD */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-8 border border-white/80 shadow-[0_20px_60px_-15px_rgba(6,62,70,0.18)] text-left w-full mx-auto relative z-20">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* LEFT COLUMN: DYNAMIC CERTIFICATE IMAGE PREVIEW */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#109A9B]" />
                  <span className="text-xs font-sora font-extrabold text-[#063E46] uppercase tracking-wider">
                    Official Certificate Preview
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullImageModal(true)}
                  className="text-xs font-sora font-bold text-[#109A9B] hover:text-[#063E46] flex items-center gap-1.5 cursor-pointer transition-colors px-3 py-1 rounded-xl bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200/50"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Fullscreen</span>
                </button>
              </div>

              {/* CERTIFICATE IMAGE CANVAS FRAME */}
              <div className="relative group rounded-2xl overflow-hidden border-2 border-[#109A9B]/25 shadow-xl bg-slate-900 aspect-[3/2] flex items-center justify-center">
                {isGeneratingCert ? (
                  <div className="flex flex-col items-center gap-2 text-white/80">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#109A9B]" />
                    <span className="text-xs font-sora font-semibold">Rendering Verified Certificate...</span>
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

                {/* OVERLAY BADGE */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#FDE7B5] border border-white/20 pointer-events-none flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Verified Digital Document</span>
                </div>
              </div>

              {/* QUICK DOWNLOAD ACTION BAR UNDER CERTIFICATE */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => downloadCertificatePdf(certName, certDate, certCode)}
                  className="bg-teal-50 hover:bg-teal-100/80 text-[#063E46] font-sora font-bold text-xs py-2.5 px-3 rounded-xl border border-teal-200/70 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#109A9B]" />
                  <span>PDF Format</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadCertificateImage(certName, certDate, certCode)}
                  className="bg-amber-50/80 hover:bg-amber-100/80 text-amber-900 font-sora font-bold text-xs py-2.5 px-3 rounded-xl border border-amber-200/70 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>Image Format</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: DETAILS, LUCKY DRAW STATUS & ACTION CONTROLS */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between h-full">

              {/* STATUS HEADER & COPYABLE CERTIFICATE CODE */}
              <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#53656A]">
                    SURVEY CERTIFICATE
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-sora font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Certificate Code</span>
                    <span className="font-mono font-extrabold text-xs sm:text-sm text-[#063E46]">{certCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-[#109A9B] transition-colors cursor-pointer"
                    title="Copy Certificate ID"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* RECIPIENT NAME DISPLAY CARD */}
              <div className="p-4 bg-gradient-to-r from-teal-50/60 to-emerald-50/60 rounded-2xl border border-teal-200/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#063E46] text-[#FFF8E8] font-sora font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
                  {certName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-[#53656A] tracking-wider block">
                    Certificate Recipient Name
                  </span>
                  <span className="font-sora font-extrabold text-sm sm:text-base text-[#063E46] truncate block">
                    {certName}
                  </span>
                </div>
              </div>

              {/* LUCKY DRAW ANNOUNCEMENT BANNER */}
              <div className="p-4 rounded-2xl border text-left space-y-2 bg-gradient-to-r from-[#FFF8E8] via-[#FFFDF5] to-[#FDF1C7] border-amber-300/80 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-sora font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-700 shrink-0" />
                    LUCKY DRAW ENTRY CONFIRMED
                  </span>
                  {luckyStatus === 'winner' && (
                    <span className="px-2.5 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-extrabold rounded-full flex items-center gap-1 shadow-xs">
                      <Award className="w-3 h-3 text-amber-950" />
                      <span>WINNER</span>
                    </span>
                  )}
                </div>

                {luckyStatus === 'winner' ? (
                  <div className="space-y-1 pt-1">
                    <h5 className="font-sora font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-700 shrink-0" />
                      Congratulations! You Won the Lucky Draw!
                    </h5>
                    <p className="text-xs text-amber-900 font-bold">
                      Prize Awarded: <span className="underline text-amber-800">{luckyPrize || 'Special Gen Z Swag & Voucher Kit'}</span>
                    </p>
                    <p className="text-[11px] text-amber-800 font-medium">
                      Our coordinator will reach out to <strong>{pEmail}</strong> regarding prize dispatch.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-amber-950 font-semibold">
                      Your entry has been registered in the active <strong>Lucky Draw pool (Prizes up to ₹1,500)</strong>.
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-sora font-bold text-amber-900">
                      <span className="px-2 py-0.5 rounded-md bg-white/80 border border-amber-200">1st: ₹1,500</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/80 border border-amber-200">2nd: ₹1,000</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/80 border border-amber-200">3rd: ₹500</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => downloadCertificatePdf(certName, certDate, certCode)}
                  className="w-full bg-gradient-to-r from-[#0D5960] to-[#063E46] hover:from-[#08484E] hover:to-[#042B31] text-[#FFF8E8] font-sora font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-98"
                >
                  <Download className="w-4 h-4 text-[#FDE7B5] shrink-0" />
                  <span>Download PDF Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadCertificateImage(certName, certDate, certCode)}
                  className="w-full bg-white hover:bg-slate-50 border-2 border-[#109A9B]/40 text-[#063E46] font-sora font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer transform hover:-translate-y-0.5 active:scale-98"
                >
                  <Download className="w-4 h-4 text-[#109A9B] shrink-0" />
                  <span>Download Image Certificate</span>
                </button>
              </div>

              {/* NAVIGATION LINKS */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs font-sora font-bold text-[#063E46]">
                <Link to="/analytics" className="hover:text-[#109A9B] inline-flex items-center gap-1.5 transition-colors">
                  <BarChart3 className="w-3.5 h-3.5 text-[#109A9B]" />
                  <span>Explore National Insights</span>
                </Link>

                <Link to="/" className="hover:text-[#109A9B] inline-flex items-center gap-1.5 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 text-[#109A9B]" />
                  <span>Return to Home</span>
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
