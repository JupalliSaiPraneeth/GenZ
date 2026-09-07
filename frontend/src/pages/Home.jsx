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
      className="relative pt-[94px] h-screen w-full overflow-hidden flex flex-col justify-center"
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
      <section className="relative py-2 lg:py-4 overflow-hidden h-full flex flex-col justify-center">

        {/* 1. TOP-LEFT BACKGROUND CORNER: SOFT LIGHT TEAL BLOB */}
        <div className="absolute -top-28 -left-28 w-[680px] h-[620px] bg-[#109A9B]/40 rounded-[45%_55%_60%_40%/50%_60%_40%_50%] blur-2xl pointer-events-none -z-20" />

        {/* 2. CENTER-LEFT SOFT CREAM SHAPE FOR HEADLINE CONTRAST */}
        <div className="absolute top-[16%] -left-16 w-[560px] h-[540px] bg-[#FDF1C7]/80 rounded-[50%_50%_40%_60%/60%_40%_60%_40%] blur-xl pointer-events-none -z-20" />

        {/* 3. BOTTOM-LEFT CURVED AREA: SOFT PALE TEAL SHAPE */}
        <div className="absolute -bottom-44 -left-32 w-[750px] h-[650px] bg-gradient-to-tr from-[#109A9B]/35 via-[#109A9B]/20 to-[#EAF6F6]/50 rounded-[40%_60%_70%_30%/50%_60%_40%_50%] blur-2xl pointer-events-none -z-20" />

        {/* 4. FAR RIGHT BACKGROUND AREA: LIGHT PALE TEAL ENVIRONMENT */}
        <div
          className="absolute top-[-80px] right-[-100px] w-[950px] h-[950px] pointer-events-none -z-20 blur-2xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(16,154,155,0.35) 0%, rgba(234,246,246,0.60) 45%, transparent 75%)'
          }}
        />

        {/* 5. BOTTOM-RIGHT EDGE ACCENT BLOB */}
        <div className="absolute -bottom-40 -right-28 w-[680px] h-[600px] bg-[#109A9B]/35 rounded-full blur-2xl pointer-events-none -z-20" />

        {/* HERO CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[600px]">

            {/* LEFT HERO CONTENT (~45% Desktop width) */}
            <div className="lg:col-span-6 xl:col-span-6 pt-4 lg:pt-0">

              {/* Massive Main Headline - Exactly 2 Lines (Archivo Black Hero Font) */}
              <h1 className="hero-fade font-archivo text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] text-[#0B1F2A] tracking-[-2px] leading-[0.92] mb-6 drop-shadow-xs">
                <span className="whitespace-nowrap">GIVE A VOICE TO</span> <br />
                <span className="text-[#109A9B] uppercase font-black relative inline-block">
                  GEN Z
                  {/* Hand-drawn underline SVG swoosh */}
                  <svg
                    className="absolute -bottom-3 left-0 w-full h-5 text-[#109A9B]"
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
              <p className="hero-fade text-2xl sm:text-[26px] font-extrabold text-[#0B1F2A] mb-4 font-sora leading-snug">
                “Your Perspective. A Brighter Tomorrow.”
              </p>

              {/* Description Paragraph (Inter Crisp Body Typography) */}
              <p className="hero-fade text-[#0F353C] text-lg sm:text-[19px] max-w-[540px] mb-8 leading-[1.68] font-inter font-medium tracking-tight">
                Join thousands of young minds across India shaping the future. Share your honest perspective on career, technology, values, lifestyle, and aspirations in an engaging digital experience.
              </p>

              {/* Primary CTA Button */}
              <div className="hero-fade flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4 font-inter">
                <Link
                  to="/survey"
                  className="bg-gradient-to-r from-[#0D5960] to-[#063E46] hover:from-[#08484E] hover:to-[#042B31] text-[#FFF8E8] font-sora font-extrabold text-base h-[60px] px-9 rounded-[18px] shadow-lg shadow-teal-950/20 hover:shadow-xl hover:shadow-teal-950/30 transition-all duration-200 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 group"
                >
                  <span>Take the Survey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

            {/* RIGHT HERO VISUAL (~55% Desktop width) — RICH #109A9B TEAL & CREAM COMPOSITION */}
            <div className="lg:col-span-6 xl:col-span-6 relative mt-8 lg:mt-0 flex items-center justify-center">

              <div className="relative w-full max-w-[620px] flex items-center justify-center">
                
                {/* 1. SOFT ELEGANT SUNBURST CREAM GLOW */}
                <div
                  className="absolute pointer-events-none -z-10 rounded-full"
                  style={{
                    width: '720px',
                    height: '720px',
                    background: 'radial-gradient(circle, #FFFDF0 0%, #FDF1C7 35%, rgba(253,241,199,0.55) 55%, transparent 75%)',
                    filter: 'blur(6px)'
                  }}
                />

                {/* 2. PROMINENT #109A9B TEAL CIRCULAR SHAPE */}
                <div className="absolute w-[620px] h-[620px] rounded-full bg-[#109A9B]/40 border-2 border-[#109A9B]/60 shadow-lg pointer-events-none -z-10" />

                {/* 3. THIN TEAL OUTLINE ARC RING */}
                <div className="absolute w-[660px] h-[660px] rounded-full border-2 border-[#109A9B]/50 pointer-events-none -z-10 shadow-xs" />

                {/* 4. TRANSPARENT TEAL INNER CIRCLE */}
                <div className="absolute w-[540px] h-[540px] rounded-full border border-[#109A9B]/30 bg-[#109A9B]/25 pointer-events-none -z-10" />

                {/* 5. DECORATIVE #109A9B DOT MATRIX GRID (6x6) */}
                <div className="absolute top-[14%] right-[14%] pointer-events-none -z-10 hidden sm:grid grid-cols-6 gap-3.5 opacity-35">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-[#109A9B]" />
                  ))}
                </div>

                {/* Left Handwritten Editorial Doodle: "Ideas Today Impact Tomorrow" */}
                <div className="absolute top-16 -left-4 sm:-left-12 pointer-events-none hidden sm:block z-30">
                  <div className="font-handwritten text-[#0B1F2A] font-black text-2xl sm:text-3xl rotate-[-8deg] leading-none text-center max-w-[150px] drop-shadow-xs">
                    Ideas Today <br />
                    <span className="text-[#109A9B]">Impact Tomorrow</span>
                  </div>
                  <svg className="w-16 h-12 text-[#075D63] ml-8 mt-1" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M 8 28 Q 38 34 48 8" />
                    <path d="M 42 16 L 48 8 L 54 15" />
                  </svg>
                </div>

                {/* Top Right Handwritten Editorial Doodle: "YOUNG MINDS REAL CHANGE" */}
                <div className="absolute -top-4 right-2 sm:right-6 pointer-events-none z-30">
                  <div className="font-handwritten text-[#075D63] font-black text-2xl sm:text-3xl tracking-wide rotate-[9deg] drop-shadow-xs text-right leading-none">
                    YOUNG MINDS <br />
                    <span className="text-[#0B1F2A]">REAL CHANGE</span>
                  </div>
                  <svg className="w-12 h-9 text-[#109A9B] ml-auto mt-0.5" viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="5" y1="20" x2="16" y2="10" />
                    <line x1="20" y1="24" x2="27" y2="10" />
                    <line x1="32" y1="22" x2="38" y2="12" />
                  </svg>
                </div>

                {/* HERO PERSON CUTOUT PORTRAIT */}
                <div className="relative z-20 pt-2 flex justify-center">
                  <img
                    src="/GenZ-removebg-preview.png"
                    alt="Gen Z student portrait holding tablet"
                    className="w-auto h-[480px] sm:h-[540px] lg:h-[580px] xl:h-[620px] max-h-[75vh] object-contain drop-shadow-[0_30px_40px_rgba(11,31,42,0.25)] transition-transform duration-500 hover:scale-[1.01]"
                  />
                </div>

                {/* FLOATING STICKY NOTE (BOTTOM RIGHT AREA) */}
                <div className="absolute bottom-6 -right-2 sm:-right-8 bg-[#FDE7B5] text-[#0B1F2A] p-4 sm:p-5 rounded-2xl shadow-2xl transform rotate-[6deg] border border-[#075D63]/30 max-w-[220px] z-40">
                  <div className="flex items-center gap-1.5 mb-1 text-[#075D63]">
                    <span className="text-lg">👑</span>
                    <span className="font-handwritten text-2xl font-black text-[#0B1F2A]">GEN Z</span>
                  </div>
                  <div className="font-handwritten text-xl font-extrabold leading-tight text-[#0B1F2A]">
                    BOLDER IDEAS <br />
                    BRIGHTER FUTURE
                  </div>
                  <svg className="w-7 h-7 text-[#075D63] absolute -top-3 -left-3 transform -rotate-45" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M 5 25 Q 15 5 25 5" />
                    <path d="M 18 5 L 25 5 L 25 12" />
                  </svg>
                </div>

              </div>

            </div>

          </div>
        </div>

      </section>

    </div>
  );
}
