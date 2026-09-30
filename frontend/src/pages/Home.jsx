import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowRight,
  Clock,
  Award,
  Gift,
  BarChart3,
  CheckCircle2,
  Sparkles,
  BookOpen,
  UserCheck,
  Target,
  Brain,
  Rocket,
  Globe,
  Heart,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Crown
} from 'lucide-react';
import { useSurveyStore } from '../stores/surveyStore';

export default function Home() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('aims');

  const participantName = useSurveyStore((state) => state.participantName);
  const participantEmail = useSurveyStore((state) => state.participantEmail);
  const getAnsweredCount = useSurveyStore((state) => state.getAnsweredCount);
  const isCompletedSession = useSurveyStore((state) => state.isCompletedSession);

  const isLoggedIn = Boolean(participantName && participantEmail);
  const answeredCount = getAnsweredCount ? getAnsweredCount() : 0;
  const isCompleted = isLoggedIn && (isCompletedSession || localStorage.getItem('genz_participant_completed') === 'true');
  const isStarted = isLoggedIn && answeredCount > 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.anim-hero-title', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });
      gsap.from('.anim-card-item', {
        y: 35,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="relative pt-[76px] sm:pt-[88px] pb-12 min-h-screen w-full overflow-x-hidden flex flex-col font-inter bg-[#FAF7F0] text-[#0B1F2A]"
      ref={containerRef}
    >

      {/* DYNAMIC BACKGROUND AMBIENT CANVAS */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#109A9B]/10 via-[#FAF7F0]/40 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[5%] left-[10%] w-[450px] h-[450px] bg-[#109A9B]/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[15%] right-[5%] w-[500px] h-[500px] bg-[#FDF1C7]/70 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-10">

        {/* ========================================================================= */}
        {/* 1. HERO SHOWCASE (PHOTO ON TOP FOR MOBILE, NO SCROLLBAR) */}
        {/* ========================================================================= */}
        <section className="relative py-3 sm:py-6 lg:py-8 text-[#0B1F2A]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center relative z-10">

            {/* RIGHT HERO GRAPHIC (ORDER-1 ON MOBILE = TOP, ORDER-2 ON DESKTOP = RIGHT) */}
            <div className="order-1 lg:order-2 lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[260px] xs:max-w-[300px] sm:max-w-[360px] aspect-square flex items-center justify-center">

                {/* PROMINENT DARK TEAL ACCENT CIRCLE */}
                <div className="absolute w-[92%] aspect-square rounded-full bg-gradient-to-br from-[#063E46] via-[#075D63] to-[#109A9B] shadow-2xl border-4 border-white pointer-events-none" />

                {/* Thin Ring Accents */}
                <div className="absolute w-[100%] aspect-square rounded-full border-2 border-[#109A9B]/40 pointer-events-none" />

                {/* Floating Stat Chip Top-Left */}
                <div className="absolute -top-2 -left-2 bg-white/95 backdrop-blur-md text-[#063E46] p-2 sm:p-2.5 px-3 sm:px-3.5 rounded-2xl shadow-xl border border-[#109A9B]/30 text-[11px] sm:text-xs font-sora font-extrabold flex items-center gap-1.5 sm:gap-2 z-30">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                  <span>100% Anonymous</span>
                </div>

                {/* Floating Sticky Note Bottom-Right with Crown SVG Icon */}
                <div className="absolute -bottom-2 -right-2 bg-[#FDE7B5] text-[#0B1F2A] p-2.5 sm:p-3 rounded-2xl shadow-xl border border-amber-300 max-w-[145px] sm:max-w-[165px] z-30 transform rotate-[4deg]">
                  <div className="flex items-center gap-1 mb-0.5 text-[#075D63]">
                    <Crown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="font-handwritten text-xs sm:text-sm font-black text-[#0B1F2A]">GEN Z VOICES</span>
                  </div>
                  <div className="font-handwritten text-[10px] sm:text-xs font-black leading-tight text-[#0B1F2A]">
                    YOUR PERSPECTIVE MATTERS
                  </div>
                </div>

                {/* Logged in Welcome Badge */}
                {isLoggedIn && (
                  <div className="absolute top-2 right-1 bg-white/95 backdrop-blur-md text-[#063E46] px-3 py-1 rounded-full shadow-lg border border-[#109A9B]/40 z-30 text-[11px] sm:text-xs font-sora font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#109A9B] shrink-0" />
                    <span>Welcome, <strong className="text-[#109A9B]">{participantName}</strong></span>
                  </div>
                )}

                {/* Student Photo Cutout inside the dark teal circle */}
                <div className="relative z-20">
                  <img
                    src="/GenZ-removebg-preview.png"
                    alt="Gen Z student"
                    className="w-auto h-[230px] xs:h-[270px] sm:h-[340px] max-h-[46svh] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
                  />
                </div>

              </div>
            </div>

            {/* LEFT HERO CONTENT (ORDER-2 ON MOBILE = BELOW PHOTO, ORDER-1 ON DESKTOP = LEFT) */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">

              {/* Institution Seal Badge */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#109A9B]/30 shadow-xs text-xs font-sora font-extrabold cursor-default">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#109A9B] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#075D63]" />
                </span>

                <span className="tracking-wider uppercase text-[#063E46]">
                  GEN Z VOICES <span className="text-[#109A9B] font-bold">| RAG Initiative</span>
                </span>

                <span className="h-4 w-[1px] bg-[#063E46]/20 shrink-0" />

                {/* NRI Logo Container */}
                <div className="flex items-center shrink-0">
                  <img
                    src="/nrilogo.png"
                    alt="NRI Institute Logo"
                    className="h-5 sm:h-6 w-auto object-contain max-h-[24px]"
                    style={{ height: '22px', width: 'auto' }}
                  />
                </div>
              </div>

              {/* Hero Title */}
              <h1 className="anim-hero-title font-archivo text-2.5xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.02] text-[#0B1F2A]">
                Give Voice to{' '}
                <span className="text-[#109A9B] uppercase font-black relative inline-block">
                  Gen Z
                  <svg className="absolute -bottom-1.5 left-0 w-full h-2.5 text-[#109A9B]" viewBox="0 0 200 20" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M 4 14 Q 100 20 196 6" />
                  </svg>
                </span>
              </h1>

              {/* Overview Text */}
              <p className="text-xs sm:text-base lg:text-lg text-[#0F353C] leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
                <strong>Gen Z Voices</strong> is an independent research initiative undertaken by the <strong>Research Analytical Group (RAG)</strong>, a group of researchers from <strong>Dr. RVR Institute of Technology (Deemed to be University)</strong>, Agiripalli, near Vijayawada, Andhra Pradesh.
              </p>

              {/* CLEAN RESPONSIVE WRAPPING RIBBON (NO SCROLLBAR) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 py-1 font-sora text-[11px] sm:text-xs font-bold text-[#063E46]">
                <span className="inline-block bg-white px-3 py-1.5 rounded-full border border-slate-200/90 shadow-2xs whitespace-nowrap">
                  15–20 Minutes
                </span>
                <span className="inline-block bg-[#FFF8E8] px-3 py-1.5 rounded-full border border-amber-200 text-amber-900 shadow-2xs whitespace-nowrap">
                  Thoughtful Responses
                </span>
                <span className="inline-block bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-800 shadow-2xs whitespace-nowrap">
                  Instant Certificate
                </span>
                <span className="inline-block bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200 text-purple-800 shadow-2xs whitespace-nowrap">
                  Lucky Draw
                </span>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-3.5 pt-2">
                {isCompleted ? (
                  <button
                    type="button"
                    disabled
                    className="w-full sm:w-auto bg-[#063E46] text-emerald-300 border border-emerald-400/40 font-sora font-extrabold text-sm sm:text-base h-[48px] sm:h-[50px] px-7 sm:px-8 rounded-2xl shadow-md flex items-center justify-center gap-2.5 cursor-not-allowed select-none"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Completed Survey!</span>
                  </button>
                ) : isStarted ? (
                  <Link
                    to="/survey"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#0D5960] to-[#063E46] hover:from-[#08484E] hover:to-[#042B31] text-[#FFF8E8] font-sora font-extrabold text-sm sm:text-base h-[48px] sm:h-[50px] px-7 sm:px-8 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 group cursor-pointer"
                  >
                    <span>Continue Survey</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    to="/survey"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#0D5960] to-[#063E46] hover:from-[#08484E] hover:to-[#042B31] text-[#FFF8E8] font-sora font-extrabold text-sm sm:text-base h-[48px] sm:h-[50px] px-7 sm:px-8 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 group cursor-pointer"
                  >
                    <span>Take the Survey</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                <Link
                  to="/about"
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#063E46] border border-[#109A9B]/35 font-sora font-bold text-sm sm:text-base h-[48px] sm:h-[50px] px-6 sm:px-7 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Learn About RAG</span>
                  <ChevronRight className="w-4 h-4 text-[#109A9B]" />
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. RESEARCH ARCHITECTURE (STUDY AIMS, PURPOSE & PARTICIPANT GUIDELINES) */}
        {/* ========================================================================= */}
        <section className="space-y-5">

          {/* Section Sub-header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
            <div>
              <span className="text-xs font-sora font-extrabold text-[#109A9B] uppercase tracking-wider block">RESEARCH ARCHITECTURE</span>
              <h2 className="font-sora font-extrabold text-2xl sm:text-3xl text-[#0B1F2A]">Scope, Purpose & Eligibility</h2>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setActiveTab('aims')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-sora font-extrabold transition-all ${activeTab === 'aims' ? 'bg-[#063E46] text-white shadow-2xs' : 'text-[#53656A] hover:text-[#0B1F2A]'}`}
              >
                Study Aims
              </button>
              <button
                onClick={() => setActiveTab('guidelines')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-sora font-extrabold transition-all ${activeTab === 'guidelines' ? 'bg-[#063E46] text-white shadow-2xs' : 'text-[#53656A] hover:text-[#0B1F2A]'}`}
              >
                Your Voice Matters
              </button>
            </div>
          </div>

          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* STUDY AIMS & SCOPE (7 Cols) */}
            <div className="anim-card-item lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#109A9B]/25 shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-[#EAF6F6] text-[#109A9B] border border-[#109A9B]/30 shadow-2xs">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#109A9B] uppercase tracking-wider block font-sora">RESEARCH OBJECTIVES</span>
                    <h3 className="font-sora font-extrabold text-xl text-[#0B1F2A]">Comprehensive Study Aims</h3>
                  </div>
                </div>

                <p className="text-sm text-[#53656A] font-medium leading-relaxed">
                  The study aims to understand the <strong>attitudes, behaviours, habits, aspirations, values, lifestyle choices, digital practices, career expectations and future perspectives</strong> of Generation Z youth in India.
                </p>

                <p className="text-sm text-[#53656A] font-medium leading-relaxed">
                  Our purpose is to <strong>listen to young people's voices</strong> and develop <strong>research-based insights</strong> into how Gen Z thinks, lives, learns, works, connects and plans for the future.
                </p>
              </div>

              {/* 6 Core Pillars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
                {[
                  { icon: Brain, label: 'Thinks', desc: 'Mindset & Values' },
                  { icon: Heart, label: 'Lives', desc: 'Lifestyle & Habits' },
                  { icon: BookOpen, label: 'Learns', desc: 'Education & Growth' },
                  { icon: Briefcase, label: 'Works', desc: 'Career Expectations' },
                  { icon: Globe, label: 'Connects', desc: 'Digital Practices' },
                  { icon: Rocket, label: 'Plans', desc: 'Future Aspirations' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#FAF7F0] p-2.5 rounded-2xl border border-[#109A9B]/15 hover:border-[#109A9B]/40 transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="w-4 h-4 text-[#109A9B] group-hover:scale-110 transition-transform" />
                      <span className="font-sora font-extrabold text-xs text-[#063E46]">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-medium text-[#53656A] block leading-tight">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* YOUR VOICE MATTERS & ELIGIBILITY (5 Cols) */}
            <div className="anim-card-item lg:col-span-5 bg-gradient-to-br from-[#FFF8E8] via-[#FFFDF8] to-[#FDE7B5]/40 rounded-3xl p-6 sm:p-7 border border-amber-200/90 shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-[#063E46] text-white shadow-md">
                    <UserCheck className="w-6 h-6 text-[#109A9B]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block font-sora">PARTICIPATION GUIDELINES</span>
                    <h3 className="font-sora font-extrabold text-xl text-[#0B1F2A]">Your Voice Matters</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                    <div className="flex items-center gap-2 text-emerald-700 font-sora font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>18+ Eligibility Criteria</span>
                    </div>
                    <p className="text-xs text-[#53656A] font-medium pl-6 leading-relaxed">
                      If you are <strong>18 years or above</strong>, you can participate.
                    </p>
                  </div>

                  <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                    <div className="flex items-center gap-2 text-emerald-700 font-sora font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Thoughtful & Honest Responses</span>
                    </div>
                    <p className="text-xs text-[#53656A] font-medium pl-6 leading-relaxed">
                      There are <strong>no right or wrong answers</strong>. We encourage you to answer thoughtfully and honestly, based on your actual experiences, behaviour and preferences.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/survey"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-sora font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
              >
                <span>Take the Survey Now</span>
                <ArrowRight className="w-4 h-4 text-[#109A9B] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. BENEFIT SHOWCASE: WHAT YOU RECEIVE (WITH LUCIDE SVG ICONS) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#109A9B]/20 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-sora font-extrabold text-amber-700 uppercase tracking-wider block">PARTICIPANT INCENTIVES</span>
              <h2 className="font-sora font-extrabold text-2xl sm:text-3xl text-[#0B1F2A]">What You Receive</h2>
            </div>
            <span className="text-xs font-sora font-extrabold text-[#063E46] bg-[#EAF6F6] px-4 py-1.5 rounded-full border border-[#109A9B]/30 shadow-2xs flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#109A9B] shrink-0" />
              <span>Verified Rewards & Research Access</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* CARD 1: CERTIFICATE */}
            <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-emerald-200/90 hover:border-emerald-400 transition-all shadow-2xs flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300 shadow-2xs group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6 text-emerald-700 shrink-0" />
                </div>
                <h3 className="font-sora font-extrabold text-base text-[#0B1F2A] group-hover:text-emerald-800 transition-colors">
                  Instant Participation Certificate
                </h3>
                <p className="text-xs text-[#53656A] font-medium leading-relaxed">
                  Receive a Participation Certificate with a unique Certificate Number after successful completion.
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-200/60 text-xs font-sora font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unique Certificate Number</span>
              </div>
            </div>

            {/* CARD 2: LUCKY DRAW */}
            <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-purple-200/90 hover:border-purple-400 transition-all shadow-2xs flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center border border-purple-300 shadow-2xs group-hover:scale-110 transition-transform">
                  <Gift className="w-6 h-6 text-purple-700 shrink-0" />
                </div>
                <h3 className="font-sora font-extrabold text-base text-[#0B1F2A] group-hover:text-purple-800 transition-colors">
                  Lucky Draw Opportunity
                </h3>
                <p className="text-xs text-[#53656A] font-medium leading-relaxed">
                  Eligible participants can participate in the Lucky Draw on <strong>14 November 2026</strong>, with cash awards for selected prize winners.
                </p>
              </div>

              <div className="pt-3 border-t border-purple-200/60 text-xs font-sora font-bold text-purple-800 flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Draw Date: 14 November 2026</span>
              </div>
            </div>

            {/* CARD 3: RESEARCH INSIGHTS */}
            <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-sky-200/90 hover:border-sky-400 transition-all shadow-2xs flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center border border-sky-300 shadow-2xs group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-sky-700 shrink-0" />
                </div>
                <h3 className="font-sora font-extrabold text-base text-[#0B1F2A] group-hover:text-sky-800 transition-colors">
                  Research Insights
                </h3>
                <p className="text-xs text-[#53656A] font-medium leading-relaxed">
                  Explore the common trends, patterns and variations emerging from the Gen Z responses once the research findings are published.
                </p>
              </div>

              <div className="pt-3 border-t border-sky-200/60 text-xs font-sora font-bold text-sky-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Published Research Findings</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. DYNAMIC PARTICIPATION FLOW BANNER */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#063E46] via-[#075D63] to-[#0D5960] text-white shadow-xl border border-[#109A9B]/30 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">

            <div className="space-y-2 text-center lg:text-left max-w-3xl">
              <span className="text-xs font-sora font-extrabold text-[#109A9B] uppercase tracking-wider block">3-STEP PARTICIPATION JOURNEY</span>
              <h2 className="font-sora font-extrabold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-snug">
                Take the Survey → Share Your Voice → Discover Gen Z Insights
              </h2>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 text-xs font-sora font-semibold text-teal-100">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                  <span className="font-sora font-extrabold text-white text-[12px]">1.</span>
                  <span>15–20 Mins Survey</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                  <span className="font-sora font-extrabold text-white text-[12px]">2.</span>
                  <span>Share Perspective</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                  <span className="font-sora font-extrabold text-white text-[12px]">3.</span>
                  <span>Discover National Insights</span>
                </span>
              </div>
            </div>

            <Link
              to="/survey"
              className="shrink-0 px-8 py-4 rounded-2xl bg-[#FFF8E8] hover:bg-[#FDE7B5] text-[#063E46] font-sora font-extrabold text-sm sm:text-base shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
            >
              <span>Take the Survey Now</span>
              <ArrowRight className="w-5 h-5 text-[#063E46]" />
            </Link>

          </div>
        </section>

      </div>

    </div>
  );
}
