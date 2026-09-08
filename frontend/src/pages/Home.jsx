import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowRight,
  Clock,
  FileText,
  ShieldCheck,
  Gift,
  Play,
  Briefcase,
  Laptop,
  Heart,
  Users,
  Target,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useSurveyStore } from '../stores/surveyStore';

const EXPLORE_CATEGORIES = [
  {
    icon: Briefcase,
    title: 'Career',
    subtitle: 'Jobs, skills, future',
    bgColor: 'bg-[#EAF6F6]',
    iconColor: 'text-[#109A9B]',
    path: '/survey?cat=career',
  },
  {
    icon: Laptop,
    title: 'Technology',
    subtitle: 'AI, gadgets, innovation',
    bgColor: 'bg-[#FAF4E1]',
    iconColor: 'text-[#075D63]',
    path: '/survey?cat=tech',
  },
  {
    icon: Heart,
    title: 'Lifestyle',
    subtitle: 'Health, hobbies, trends',
    bgColor: 'bg-[#EAF6F6]',
    iconColor: 'text-[#109A9B]',
    path: '/survey?cat=lifestyle',
  },
  {
    icon: Users,
    title: 'Values',
    subtitle: 'Beliefs, society, culture',
    bgColor: 'bg-[#FAF4E1]',
    iconColor: 'text-[#075D63]',
    path: '/survey?cat=values',
  },
  {
    icon: Target,
    title: 'Aspirations',
    subtitle: 'Dreams, goals, impact',
    bgColor: 'bg-[#EAF6F6]',
    iconColor: 'text-[#109A9B]',
    path: '/survey?cat=aspirations',
  },
];

const VERTICAL_SIDEBAR_ITEMS = [
  { icon: Briefcase, label: 'CAREER' },
  { icon: Laptop, label: 'TECHNOLOGY' },
  { icon: Heart, label: 'LIFESTYLE' },
  { icon: Users, label: 'VALUES' },
  { icon: Target, label: 'ASPIRATIONS' },
];

export default function Home() {
  const heroRef = useRef(null);

  const participantName = useSurveyStore((state) => state.participantName);
  const participantEmail = useSurveyStore((state) => state.participantEmail);
  const getAnsweredCount = useSurveyStore((state) => state.getAnsweredCount);
  const isSurveyCompleted = useSurveyStore((state) => state.isSurveyCompleted);

  const isLoggedIn = Boolean(participantName || participantEmail);
  const answeredCount = getAnsweredCount ? getAnsweredCount() : 0;
  const isCompleted = isSurveyCompleted ? isSurveyCompleted() : false;
  const isStarted = answeredCount > 0 || isLoggedIn;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-fade', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="relative pt-[70px] sm:pt-[94px] min-h-screen lg:h-screen w-full overflow-y-auto lg:overflow-hidden flex flex-col justify-center pb-6 lg:pb-0"
      ref={heroRef}
      style={{
        background: `
          radial-gradient(circle at 75% 30%, rgba(16,154,155,0.30) 0%, transparent 55%),
          radial-gradient(circle at 15% 80%, rgba(253,241,199,0.60) 0%, transparent 45%),
          radial-gradient(circle at 50% 15%, rgba(255,253,248,0.90) 0%, transparent 60%),
          linear-gradient(135deg, #FAF7F0 0%, #FFFDF8 42%, #EAF6F6 100%)
        `
      }}
    >

      {/* HERO SECTION WITH SOFT LIGHT ELEGANT CREAM & MINT-TEAL EDITORIAL BACKGROUND */}
      <section className="relative py-2 lg:py-2 overflow-hidden min-h-full flex flex-col justify-center">

        {/* 1. TOP-LEFT BACKGROUND CORNER: SOFT LIGHT TEAL BLOB */}
        <div className="absolute -top-28 -left-28 w-[320px] sm:w-[680px] h-[320px] sm:h-[620px] bg-[#109A9B]/30 sm:bg-[#109A9B]/40 rounded-full blur-2xl pointer-events-none -z-20" />

        {/* 2. CENTER-LEFT SOFT CREAM SHAPE FOR HEADLINE CONTRAST */}
        <div className="absolute top-[16%] -left-16 w-[300px] sm:w-[560px] h-[300px] sm:h-[540px] bg-[#FDF1C7]/80 rounded-full blur-xl pointer-events-none -z-20" />

        {/* 3. BOTTOM-LEFT CURVED AREA: SOFT PALE TEAL SHAPE */}
        <div className="absolute -bottom-44 -left-32 w-[350px] sm:w-[750px] h-[350px] sm:h-[650px] bg-gradient-to-tr from-[#109A9B]/35 via-[#109A9B]/20 to-[#EAF6F6]/50 rounded-full blur-2xl pointer-events-none -z-20" />

        {/* 4. FAR RIGHT BACKGROUND AREA: LIGHT PALE TEAL ENVIRONMENT */}
        <div
          className="absolute top-[-80px] right-[-100px] w-[400px] sm:w-[950px] h-[400px] sm:h-[950px] pointer-events-none -z-20 blur-2xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(16,154,155,0.35) 0%, rgba(234,246,246,0.60) 45%, transparent 75%)'
          }}
        />

        {/* 5. BOTTOM-RIGHT EDGE ACCENT BLOB */}
        <div className="absolute -bottom-40 -right-28 w-[320px] sm:w-[680px] h-[300px] sm:h-[600px] bg-[#109A9B]/35 rounded-full blur-2xl pointer-events-none -z-20" />

        {/* HERO CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center min-h-[440px] sm:min-h-[560px]">

            {/* LEFT HERO CONTENT (~50% Desktop width) */}
            <div className="lg:col-span-6 xl:col-span-6 pt-1 sm:pt-4 lg:pt-0 text-center lg:text-left z-20">

              {/* Massive Main Headline */}
              <h1 className="hero-fade font-archivo text-2xl xs:text-3xl sm:text-5xl lg:text-6xl xl:text-[72px] text-[#0B1F2A] tracking-tight sm:tracking-[-2px] leading-[1.1] sm:leading-[0.96] mb-3 sm:mb-6 drop-shadow-xs">
                <span className="inline-block sm:whitespace-nowrap">GIVE A VOICE TO</span> <br className="hidden sm:inline" />
                <span className="text-[#109A9B] uppercase font-black relative inline-block ml-1.5 sm:ml-0">
                  GEN Z
                  {/* Hand-drawn underline SVG swoosh */}
                  <svg
                    className="absolute -bottom-1.5 sm:-bottom-3 left-0 w-full h-2.5 sm:h-5 text-[#109A9B]"
                    viewBox="0 0 200 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  >
                    <path d="M 4 14 Q 100 20 196 6" />
                  </svg>
                </span>
              </h1>

              {/* Editorial Tagline */}
              <p className="hero-fade text-base sm:text-2xl md:text-[25px] font-extrabold text-[#0B1F2A] mb-2 sm:mb-4 font-sora leading-snug">
                “Your Perspective. A Brighter Tomorrow.”
              </p>

              {/* Description Paragraph */}
              <p className="hero-fade text-[#0F353C] text-xs xs:text-sm sm:text-lg md:text-[18px] max-w-[520px] mx-auto lg:mx-0 mb-4 sm:mb-8 leading-[1.55] sm:leading-[1.65] font-inter font-medium tracking-tight">
                Join thousands of young minds across India shaping the future. Share your honest perspective on career, technology, values, lifestyle, and aspirations in an engaging digital experience.
              </p>

              {/* Dynamic Primary CTA Button */}
              <div className="hero-fade flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-3 sm:mb-4 font-inter">
                {isCompleted ? (
                  <Link
                    to="/survey-complete"
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-[#FFF8E8] font-sora font-extrabold text-sm sm:text-base h-[48px] sm:h-[60px] px-6 sm:px-9 rounded-[14px] sm:rounded-[18px] shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 sm:gap-3 transform hover:-translate-y-0.5 group cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                    <span>Survey Submitted</span>
                  </Link>
                ) : isStarted ? (
                  <Link
                    to="/survey"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#0D5960] to-[#063E46] hover:from-[#08484E] hover:to-[#042B31] text-[#FFF8E8] font-sora font-extrabold text-sm sm:text-base h-[48px] sm:h-[60px] px-6 sm:px-9 rounded-[14px] sm:rounded-[18px] shadow-lg shadow-teal-950/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 sm:gap-3 transform hover:-translate-y-0.5 group cursor-pointer"
                  >
                    <span>Continue Survey</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    to="/survey"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#0D5960] to-[#063E46] hover:from-[#08484E] hover:to-[#042B31] text-[#FFF8E8] font-sora font-extrabold text-sm sm:text-base h-[48px] sm:h-[60px] px-6 sm:px-9 rounded-[14px] sm:rounded-[18px] shadow-lg shadow-teal-950/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 sm:gap-3 transform hover:-translate-y-0.5 group cursor-pointer"
                  >
                    <span>Take the Survey</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

            </div>

            {/* RIGHT HERO VISUAL (~50% Desktop width) */}
            <div className="lg:col-span-6 xl:col-span-6 relative mt-2 lg:mt-0 flex items-center justify-center">

              <div className="relative w-full max-w-[280px] xs:max-w-[340px] sm:max-w-[480px] lg:max-w-[580px] flex items-center justify-center">
                
                {/* 1. SOFT ELEGANT SUNBURST CREAM GLOW */}
                <div
                  className="absolute pointer-events-none -z-10 rounded-full w-[260px] xs:w-[320px] sm:w-[540px] lg:w-[660px] h-[260px] xs:h-[320px] sm:h-[540px] lg:h-[660px]"
                  style={{
                    background: 'radial-gradient(circle, #FFFDF0 0%, #FDF1C7 35%, rgba(253,241,199,0.55) 55%, transparent 75%)',
                    filter: 'blur(6px)'
                  }}
                />

                {/* 2. PROMINENT #109A9B TEAL CIRCULAR SHAPE */}
                <div className="absolute w-[230px] xs:w-[280px] sm:w-[460px] lg:w-[560px] h-[230px] xs:h-[280px] sm:h-[460px] lg:h-[560px] rounded-full bg-[#109A9B]/35 border-2 border-[#109A9B]/60 shadow-lg pointer-events-none -z-10" />

                {/* 3. THIN TEAL OUTLINE ARC RING */}
                <div className="absolute w-[245px] xs:w-[300px] sm:w-[500px] lg:w-[600px] h-[245px] xs:h-[300px] sm:h-[500px] lg:h-[600px] rounded-full border-2 border-[#109A9B]/40 pointer-events-none -z-10 shadow-xs" />

                {/* 4. DECORATIVE DOT MATRIX GRID */}
                <div className="absolute top-[14%] right-[14%] pointer-events-none -z-10 hidden sm:grid grid-cols-6 gap-3.5 opacity-35">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-[#109A9B]" />
                  ))}
                </div>

                {/* Left Handwritten Editorial Doodle - Positioned safely inside the right graphic bounds */}
                <div className="absolute top-8 sm:top-12 left-0 sm:left-2 pointer-events-none hidden xl:block z-30">
                  <div className="font-handwritten text-[#0B1F2A] font-black text-lg lg:text-2xl rotate-[-6deg] leading-none text-center max-w-[130px] drop-shadow-xs">
                    Ideas Today <br />
                    <span className="text-[#109A9B]">Impact Tomorrow</span>
                  </div>
                </div>

                {/* Top Right Handwritten Editorial Doodle */}
                <div className="absolute top-4 sm:top-8 right-2 sm:right-6 pointer-events-none z-30 hidden sm:block">
                  <div className="font-handwritten text-[#075D63] font-black text-base sm:text-xl lg:text-2xl tracking-wide rotate-[8deg] drop-shadow-xs text-right leading-none">
                    YOUNG MINDS <br />
                    <span className="text-[#0B1F2A]">REAL CHANGE</span>
                  </div>
                </div>

                {/* HERO PERSON CUTOUT PORTRAIT */}
                <div className="relative z-20 pt-2 flex justify-center">
                  <img
                    src="/GenZ-removebg-preview.png"
                    alt="Gen Z student portrait holding tablet"
                    className="w-auto h-[250px] xs:h-[290px] sm:h-[420px] lg:h-[480px] xl:h-[530px] max-h-[55vh] object-contain drop-shadow-[0_20px_30px_rgba(11,31,42,0.2)] transition-transform duration-500 hover:scale-[1.01]"
                  />
                </div>

                {/* FLOATING STICKY NOTE */}
                <div className="absolute bottom-0 sm:bottom-6 right-0 sm:-right-6 bg-[#FDE7B5] text-[#0B1F2A] p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl transform rotate-[6deg] border border-[#075D63]/30 max-w-[130px] xs:max-w-[150px] sm:max-w-[200px] z-40">
                  <div className="flex items-center gap-1 mb-0.5 text-[#075D63]">
                    <span className="text-xs sm:text-base">👑</span>
                    <span className="font-handwritten text-sm sm:text-xl font-black text-[#0B1F2A]">GEN Z</span>
                  </div>
                  <div className="font-handwritten text-[10px] xs:text-xs sm:text-lg font-extrabold leading-tight text-[#0B1F2A]">
                    BOLDER IDEAS <br />
                    BRIGHTER FUTURE
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </section>

    </div>
  );
}
