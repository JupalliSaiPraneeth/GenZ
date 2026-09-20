import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Sparkles,
  Clock,
  Calendar,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  BadgeCheck,
} from 'lucide-react';
import { useSurveyStore } from '../stores/surveyStore';

export default function LuckyDraw() {
  const participantName = useSurveyStore((state) => state.participantName);
  const participantEmail = useSurveyStore((state) => state.participantEmail);
  const participantId = useSurveyStore((state) => state.participantId);
  const isCompletedSession = useSurveyStore((state) => state.isCompletedSession);
  const getProgressPercentage = useSurveyStore((state) => state.getProgressPercentage);
  const initSession = useSurveyStore((state) => state.initSession);

  useEffect(() => {
    if (initSession) {
      initSession();
    }
  }, [initSession]);

  const completionPercent = getProgressPercentage ? getProgressPercentage() : 0;
  const isCompleted = isCompletedSession || completionPercent >= 90;
  const isRegistered = Boolean(participantName || participantEmail || participantId);

  // Target Draw Date: November 14, 2026 00:00:00 IST
  const targetDate = useMemo(() => new Date('2026-11-14T00:00:00+05:30').getTime(), []);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function updateCountdown() {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="pt-[88px] sm:pt-[108px] lg:pt-[118px] pb-20 min-h-screen bg-[#FAF9F5] text-[#0F1E24] antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* 1. HERO BANNER */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#063238] via-[#074b52] to-[#0d7375] text-white p-7 sm:p-12 shadow-2xl overflow-hidden border border-[#14b8a6]/25">
          {/* Radial Ambient Highlights */}
          <div className="absolute -top-28 -right-28 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 text-amber-200 border border-amber-300/30 text-xs font-bold tracking-wide backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>OFFICIAL RESEARCH REWARDS EVENT</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
                Grand Lucky Draw <span className="text-amber-300 drop-shadow-sm">2026</span>
              </h1>
              <p className="text-sm sm:text-base text-teal-100/90 font-normal leading-relaxed max-w-2xl mx-auto">
                Participate in our youth research survey for automatic entry into the guaranteed cash prize draw. Winners are selected via an automated, verifiable audit process.
              </p>
            </div>

            {/* Announcement Banner */}
            <div className="inline-flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-amber-200 text-xs sm:text-sm shadow-inner">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Draw Event: <strong className="text-white font-bold tracking-wide">November 14, 2026</strong></span>
            </div>
          </div>

          {/* COUNTDOWN TIMER */}
          <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
            <div className="text-center space-y-3">
              <span className="text-[11px] font-mono font-semibold tracking-widest text-teal-200/80 uppercase flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                Time Remaining Until Announcement
              </span>

              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-lg mx-auto">
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINUTES', val: timeLeft.minutes },
                  { label: 'SECONDS', val: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#031d20]/80 backdrop-blur-md border border-teal-500/20 rounded-2xl py-3 px-2 sm:py-4 sm:px-3 text-center shadow-lg transition-transform hover:-translate-y-0.5"
                  >
                    <span className="font-mono font-extrabold text-2xl sm:text-4xl text-amber-300 block tracking-tight leading-none">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-teal-200/70 tracking-wider block mt-1.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. PRIZE POOL SHOWCASE */}
        <section className="space-y-10 relative">
          {/* Section Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-gradient-to-r from-teal-200/20 via-amber-200/30 to-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Guaranteed Rewards</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#0B1F2A] tracking-tight flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-amber-500 drop-shadow-sm" />
              Prize Pool & Honors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
              Automated, audited distribution of cash rewards directly to verified winner accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-4">

            {/* 2nd PRIZE (SILVER / RUNNER UP) */}
            <div className="order-2 md:order-1 relative rounded-3xl bg-gradient-to-b from-slate-50/90 via-white to-slate-100/60 backdrop-blur-xl border border-slate-200/90 hover:border-slate-400/80 shadow-xl hover:shadow-2xl hover:shadow-slate-300/30 transition-all duration-500 ease-out hover:-translate-y-2 group p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              {/* Subtle Corner Accent Glow */}
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-slate-200/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="space-y-6 text-center relative z-10">
                <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-300/30 to-teal-200/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                  <img
                    src="/2ndprize.png"
                    alt="2nd Prize"
                    className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 object-contain filter drop-shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block">
                    RUNNER UP
                  </span>
                  <div className="font-heading font-black text-3xl sm:text-4xl text-[#0B1F2A] tracking-tight">
                    ₹1,500
                  </div>
                  <div className="pt-2">
                    <span className="inline-block px-3.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200/90 text-xs font-bold text-slate-600 shadow-sm">
                      Cash Prize
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1st PRIZE (GOLD FEATURED - GRAND PRIZE) */}
            <div className="order-1 md:order-2 relative rounded-3xl bg-gradient-to-b from-amber-100/90 via-amber-50/80 to-white backdrop-blur-xl border-2 border-amber-400/90 shadow-[0_20px_50px_rgba(245,158,11,0.22)] hover:shadow-[0_25px_60px_rgba(245,158,11,0.35)] transition-all duration-500 ease-out md:-translate-y-6 hover:-translate-y-8 group p-7 sm:p-9 flex flex-col justify-between overflow-hidden z-10">
              {/* Glowing Background Light Aura */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-400/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="space-y-6 text-center relative z-10">
                <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/40 via-yellow-300/30 to-amber-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />
                  <img
                    src="/1stprize.png"
                    alt="1st Prize"
                    className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 object-contain filter drop-shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-black text-amber-800 uppercase tracking-widest block">
                    GRAND PRIZE
                  </span>
                  <div className="font-heading font-black text-4xl sm:text-5xl text-[#063E46] tracking-tight">
                    ₹2,500
                  </div>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-1.5 rounded-xl bg-amber-400/25 border border-amber-400/40 text-xs font-black text-amber-900 shadow-sm backdrop-blur-md">
                      Cash Prize
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd PRIZE (BRONZE) */}
            <div className="order-3 relative rounded-3xl bg-gradient-to-b from-amber-50/50 via-white to-amber-100/40 backdrop-blur-xl border border-amber-800/20 hover:border-amber-700/40 shadow-xl hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500 ease-out hover:-translate-y-2 group p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              {/* Subtle Corner Accent Glow */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-700/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="space-y-6 text-center relative z-10">
                <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/20 to-amber-300/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                  <img
                    src="/3rdprize.png"
                    alt="3rd Prize"
                    className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 object-contain filter drop-shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-extrabold text-amber-800 uppercase tracking-widest block">
                    3RD PRIZE WINNER
                  </span>
                  <div className="font-heading font-black text-3xl sm:text-4xl text-[#0B1F2A] tracking-tight">
                    ₹1,000
                  </div>
                  <div className="pt-2">
                    <span className="inline-block px-3.5 py-1 rounded-xl bg-amber-100/80 border border-amber-200/80 text-xs font-bold text-amber-900 shadow-sm">
                      Cash Prize
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. USER ENTRY STATUS */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[#0B1F2A] flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-[#109A9B]" />
                Your Entry Status
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Entry tickets are automatically generated once your survey progress is verified.
              </p>
            </div>

            {isCompleted ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold tracking-wide">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                ENTRY CONFIRMED & ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold tracking-wide">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                SURVEY INCOMPLETE
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Survey Completion</span>
                  <span>{completionPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {isRegistered ? (
                  <>
                    Logged in as <strong className="text-[#063E46] font-bold">{participantName || participantEmail || 'Registered Participant'}</strong>.{' '}
                    {isCompleted
                      ? 'Your response is stored and will automatically be included in the draw.'
                      : 'Please complete the rest of the survey questions to qualify your entry for the cash rewards.'}
                  </>
                ) : (
                  'Complete the research survey to confirm your participation in the ₹5,000 total prize pool.'
                )}
              </p>
            </div>

            <div className="flex justify-start lg:justify-end">
              <Link
                to="/survey"
                className="w-full sm:w-auto px-6 py-3 bg-[#063E46] hover:bg-[#075D63] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{isCompleted ? 'Review Answers' : 'Continue Survey'}</span>
                <ArrowRight className="w-4 h-4 text-teal-300" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}