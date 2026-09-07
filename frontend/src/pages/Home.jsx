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
      className="relative pt-[76px] sm:pt-[94px] min-h-screen lg:h-screen w-full overflow-y-auto lg:overflow-hidden flex flex-col justify-center pb-8 lg:pb-0"
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
      <section className="relative py-4 lg:py-2 overflow-hidden min-h-full flex flex-col justify-center">

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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center min-h-[500px] sm:min-h-[600px]">

            {/* LEFT HERO CONTENT (~45% Desktop width) */}
            <div className="lg:col-span-6 xl:col-span-6 pt-2 sm:pt-4 lg:pt-0 text-center lg:text-left">

              {/* Massive Main Headline */}
              <h1 className="hero-fade font-archivo text-3xl sm:text-5xl lg:text-6xl xl:text-[76px] text-[#0B1F2A] tracking-[-1px] sm:tracking-[-2px] leading-[1.02] sm:leading-[0.94] mb-4 sm:mb-6 drop-shadow-xs">
                <span className="inline-block sm:whitespace-nowrap">GIVE A VOICE TO</span> <br className="hidden sm:inline" />
                <span className="text-[#109A9B] uppercase font-black relative inline-block ml-2 sm:ml-0">
                  GEN Z
                  {/* Hand-drawn underline SVG swoosh */}
                  <svg
                    className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-5 text-[#109A9B]"
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
              <p className="hero-fade text-lg sm:text-2xl md:text-[26px] font-extrabold text-[#0B1F2A] mb-3 sm:mb-4 font-sora leading-snug">
                “Your Perspective. A Brighter Tomorrow.”
              </p>

              {/* Description Paragraph */}
              <p className="hero-fade text-[#0F353C] text-sm sm:text-lg md:text-[19px] max-w-[540px] mx-auto lg:mx-0 mb-6 sm:mb-8 leading-[1.6] sm:leading-[1.68] font-inter font-medium tracking-tight">
                Join thousands of young minds across India shaping the future. Share your honest perspective on career, technology, values, lifestyle, and aspirations in an engaging digital experience.
              </p>

              {/* Primary CTA Button */}
              <div className="hero-fade flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4 font-inter">
                <Link
                  to="/survey"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#0D5960] to-[#063E46] hover:from-[#08484E] hover:to-[#042B31] text-[#FFF8E8] font-sora font-extrabold text-base h-[54px] sm:h-[60px] px-8 sm:px-9 rounded-[18px] shadow-lg shadow-teal-950/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 group"
                >
                  <span>Take the Survey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

            {/* RIGHT HERO VISUAL (~55% Desktop width) */}
            <div className="lg:col-span-6 xl:col-span-6 relative mt-4 lg:mt-0 flex items-center justify-center">

              <div className="relative w-full max-w-[320px] sm:max-w-[520px] lg:max-w-[620px] flex items-center justify-center">
                
                {/* 1. SOFT ELEGANT SUNBURST CREAM GLOW */}
                <div
                  className="absolute pointer-events-none -z-10 rounded-full w-[340px] sm:w-[600px] lg:w-[720px] h-[340px] sm:h-[600px] lg:h-[720px]"
                  style={{
                    background: 'radial-gradient(circle, #FFFDF0 0%, #FDF1C7 35%, rgba(253,241,199,0.55) 55%, transparent 75%)',
                    filter: 'blur(6px)'
                  }}
                />

                {/* 2. PROMINENT #109A9B TEAL CIRCULAR SHAPE */}
                <div className="absolute w-[300px] sm:w-[500px] lg:w-[620px] h-[300px] sm:h-[500px] lg:h-[620px] rounded-full bg-[#109A9B]/35 border-2 border-[#109A9B]/60 shadow-lg pointer-events-none -z-10" />

                {/* 3. THIN TEAL OUTLINE ARC RING */}
                <div className="absolute w-[320px] sm:w-[540px] lg:w-[660px] h-[320px] sm:h-[540px] lg:h-[660px] rounded-full border-2 border-[#109A9B]/40 pointer-events-none -z-10 shadow-xs" />

                {/* 4. DECORATIVE DOT MATRIX GRID */}
                <div className="absolute top-[14%] right-[14%] pointer-events-none -z-10 hidden sm:grid grid-cols-6 gap-3.5 opacity-35">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-[#109A9B]" />
                  ))}
                </div>

                {/* Left Handwritten Editorial Doodle */}
                <div className="absolute top-12 -left-2 sm:-left-12 pointer-events-none hidden sm:block z-30">
                  <div className="font-handwritten text-[#0B1F2A] font-black text-xl sm:text-3xl rotate-[-8deg] leading-none text-center max-w-[130px] sm:max-w-[150px] drop-shadow-xs">
                    Ideas Today <br />
                    <span className="text-[#109A9B]">Impact Tomorrow</span>
                  </div>
                </div>

                {/* Top Right Handwritten Editorial Doodle */}
                <div className="absolute -top-2 right-2 sm:right-6 pointer-events-none z-30 hidden xs:block">
                  <div className="font-handwritten text-[#075D63] font-black text-lg sm:text-3xl tracking-wide rotate-[9deg] drop-shadow-xs text-right leading-none">
                    YOUNG MINDS <br />
                    <span className="text-[#0B1F2A]">REAL CHANGE</span>
                  </div>
                </div>

                {/* HERO PERSON CUTOUT PORTRAIT */}
                <div className="relative z-20 pt-2 flex justify-center">
                  <img
                    src="/GenZ-removebg-preview.png"
                    alt="Gen Z student portrait holding tablet"
                    className="w-auto h-[320px] sm:h-[460px] lg:h-[540px] xl:h-[600px] max-h-[65vh] object-contain drop-shadow-[0_20px_30px_rgba(11,31,42,0.2)] transition-transform duration-500 hover:scale-[1.01]"
                  />
                </div>

                {/* FLOATING STICKY NOTE */}
                <div className="absolute bottom-2 sm:bottom-6 -right-2 sm:-right-8 bg-[#FDE7B5] text-[#0B1F2A] p-3 sm:p-5 rounded-2xl shadow-xl transform rotate-[6deg] border border-[#075D63]/30 max-w-[160px] sm:max-w-[220px] z-40">
                  <div className="flex items-center gap-1 mb-0.5 sm:mb-1 text-[#075D63]">
                    <span className="text-sm sm:text-lg">👑</span>
                    <span className="font-handwritten text-lg sm:text-2xl font-black text-[#0B1F2A]">GEN Z</span>
                  </div>
                  <div className="font-handwritten text-xs sm:text-xl font-extrabold leading-tight text-[#0B1F2A]">
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
