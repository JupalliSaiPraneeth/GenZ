import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Code2,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Compass,
  Heart,
  Briefcase,
  Laptop,
  Users,
  Target,
  DollarSign,
  Rocket,
  Brain,
  Lock,
  Lightbulb,
  BarChart3,
  Bookmark,
  Mail
} from 'lucide-react';

/* ========================================================= */
/* VECTOR SVG AVATARS (Clean, Modern, Academic & Developer) */
/* ========================================================= */

function AcademicAvatar({ className = "w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40" }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Halo */}
      <circle cx="100" cy="100" r="92" fill="url(#academic_bg_grad)" stroke="#109A9B" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.6" />
      <circle cx="100" cy="100" r="82" fill="#F0FDFA" />

      {/* Base Shadow */}
      <ellipse cx="100" cy="175" rx="55" ry="12" fill="#0D9488" opacity="0.12" />

      {/* Academic Formal Attire */}
      <path d="M40 180 C40 140, 65 128, 100 128 C135 128, 160 140, 160 180 Z" fill="#0F172A" />
      <path d="M78 128 L100 166 L122 128 Z" fill="#F8FAFC" />
      <path d="M93 142 L100 176 L107 142 Z" fill="#0284C7" />

      {/* Suit Lapels */}
      <path d="M48 175 L78 128 L94 156 Z" fill="#1E293B" />
      <path d="M152 175 L122 128 L106 156 Z" fill="#1E293B" />

      {/* Neck */}
      <rect x="88" y="110" width="24" height="22" rx="4" fill="#FDBA74" />
      <path d="M88 120 C95 125, 105 125, 112 120 Z" fill="#EA580C" opacity="0.18" />

      {/* Head / Face */}
      <path d="M70 76 C70 52, 82 44, 100 44 C118 44, 130 52, 130 76 C130 100, 118 114, 100 114 C82 114, 70 100, 70 76 Z" fill="#FFEDD5" />

      {/* Ears */}
      <circle cx="68" cy="78" r="7" fill="#FDBA74" />
      <circle cx="132" cy="78" r="7" fill="#FDBA74" />

      {/* Hair (Senior Academic Distinguished Haircut) */}
      <path d="M68 68 C68 44, 80 36, 100 36 C120 36, 132 44, 132 68 C132 60, 126 46, 100 46 C74 46, 68 60, 68 68 Z" fill="#334155" />
      <path d="M70 54 C75 40, 90 38, 100 38 C115 38, 128 42, 130 54 C122 45, 110 42, 100 42 C88 42, 76 46, 70 54 Z" fill="#475569" />

      {/* Glasses */}
      <rect x="75" y="68" width="21" height="15" rx="3" fill="#0F172A" opacity="0.08" stroke="#0F172A" strokeWidth="2.8" />
      <rect x="104" y="68" width="21" height="15" rx="3" fill="#0F172A" opacity="0.08" stroke="#0F172A" strokeWidth="2.8" />
      <line x1="96" y1="74" x2="104" y2="74" stroke="#0F172A" strokeWidth="2.8" />
      <line x1="68" y1="73" x2="75" y2="73" stroke="#0F172A" strokeWidth="2.2" />
      <line x1="125" y1="73" x2="132" y2="73" stroke="#0F172A" strokeWidth="2.2" />

      {/* Eyes */}
      <circle cx="85.5" cy="75.5" r="2.5" fill="#1E293B" />
      <circle cx="114.5" cy="75.5" r="2.5" fill="#1E293B" />

      {/* Eyebrows */}
      <path d="M76 64 Q85 61 93 64" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M107 64 Q115 61 124 64" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M100 76 L98 85 L103 85" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />

      {/* Smile */}
      <path d="M90 95 Q100 102 110 95" stroke="#7C2D12" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      <defs>
        <linearGradient id="academic_bg_grad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D9488" stopOpacity="0.2" />
          <stop offset="1" stopColor="#0284C7" stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DeveloperAvatar({ className = "w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40" }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Halo */}
      <circle cx="100" cy="100" r="92" fill="url(#dev_bg_grad)" stroke="#063E46" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.6" />
      <circle cx="100" cy="100" r="82" fill="#ECFDF5" />

      {/* Base Shadow */}
      <ellipse cx="100" cy="175" rx="55" ry="12" fill="#059669" opacity="0.12" />

      {/* Modern Developer Attire */}
      <path d="M40 180 C40 136, 65 124, 100 124 C135 124, 160 136, 160 180 Z" fill="#063E46" />
      <path d="M78 124 L100 154 L122 124 Z" fill="#0D9488" />
      <path d="M86 124 L100 144 L114 124 Z" fill="#14B8A6" />
      <path d="M92 124 L100 136 L108 124 Z" fill="#F8FAFC" />

      {/* Neck */}
      <rect x="88" y="106" width="24" height="22" rx="4" fill="#FDBA74" />
      <path d="M88 116 C95 121, 105 121, 112 116 Z" fill="#EA580C" opacity="0.18" />

      {/* Head / Face */}
      <path d="M72 72 C72 48, 83 40, 100 40 C117 40, 128 48, 128 72 C128 96, 117 110, 100 110 C83 110, 72 96, 72 72 Z" fill="#FFEDD5" />

      {/* Ears */}
      <circle cx="70" cy="74" r="7" fill="#FDBA74" />
      <circle cx="130" cy="74" r="7" fill="#FDBA74" />

      {/* Hair (Young Modern Developer Hairstyle) */}
      <path d="M68 62 C68 38, 80 30, 100 30 C120 30, 132 38, 132 62 C132 53, 126 34, 100 34 C74 34, 68 53, 68 62 Z" fill="#0F172A" />
      <path d="M68 56 Q82 32 104 34 Q126 36 134 52 C126 42, 112 38, 98 40 C84 42, 74 48, 68 56 Z" fill="#1E293B" />
      <path d="M80 42 C88 36, 100 36, 110 38 C102 42, 92 43, 80 42 Z" fill="#334155" />

      {/* Eyes */}
      <circle cx="86" cy="71" r="3" fill="#0F172A" />
      <circle cx="114" cy="71" r="3" fill="#0F172A" />
      <circle cx="87.5" cy="69.5" r="1" fill="#FFFFFF" />
      <circle cx="115.5" cy="69.5" r="1" fill="#FFFFFF" />

      {/* Eyebrows */}
      <path d="M78 62 Q86 59 93 62" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M107 62 Q114 59 122 62" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M100 72 L98 81 L103 81" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />

      {/* Smile */}
      <path d="M89 91 Q100 100 111 91" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Subtle Developer Headphones Band Accent */}
      <path d="M64 68 C64 48, 136 48, 136 68" stroke="#0D9488" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.45" />
      <rect x="61" y="64" width="6" height="15" rx="3" fill="#0D9488" opacity="0.8" />
      <rect x="133" y="64" width="6" height="15" rx="3" fill="#0D9488" opacity="0.8" />

      <defs>
        <linearGradient id="dev_bg_grad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#063E46" stopOpacity="0.2" />
          <stop offset="1" stopColor="#109A9B" stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function About() {
  const RESEARCH_DIMENSIONS = [
    { name: 'Education', icon: GraduationCap, bg: 'bg-teal-50 text-teal-800 border-teal-200' },
    { name: 'Career', icon: Briefcase, bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { name: 'Technology', icon: Laptop, bg: 'bg-sky-50 text-sky-800 border-sky-200' },
    { name: 'Lifestyle', icon: Heart, bg: 'bg-rose-50 text-rose-800 border-rose-200' },
    { name: 'Health & Well-being', icon: Brain, bg: 'bg-purple-50 text-purple-800 border-purple-200' },
    { name: 'Finance', icon: DollarSign, bg: 'bg-amber-50 text-amber-900 border-amber-200' },
    { name: 'Relationships', icon: Users, bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { name: 'Entrepreneurship', icon: Rocket, bg: 'bg-orange-50 text-orange-800 border-orange-200' },
    { name: 'Values', icon: Compass, bg: 'bg-teal-50 text-teal-900 border-teal-200' },
    { name: 'Future Aspirations', icon: Target, bg: 'bg-cyan-50 text-cyan-900 border-cyan-200' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] text-[#10242C] font-inter overflow-x-hidden pt-[85px] sm:pt-[110px] lg:pt-[125px] pb-16 sm:pb-24">

      {/* ==================================================== */}
      {/* BACKGROUND ATMOSPHERIC GRADIENTS & GLOW BLOBS */}
      {/* ==================================================== */}
      <div className="absolute top-0 left-0 right-0 h-[48vh] bg-gradient-to-b from-[#109A9B] to-[#075D63] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.18),transparent_65%)]" />
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute -top-24 -left-28 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#075D63]/40 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[350px] sm:w-[550px] h-[300px] sm:h-[400px] bg-gradient-to-bl from-[#063E46]/50 via-[#075D63]/30 to-transparent rounded-bl-[260px] blur-xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-5 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-[#109A9B]/10 blur-3xl pointer-events-none z-0" />

      {/* MAIN ALIGNED CONTAINER */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-3.5 sm:px-6 lg:px-8 w-full space-y-8 sm:space-y-12 lg:space-y-14">

        {/* 1. HERO SECTION */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-4xl mx-auto pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-[11px] sm:text-xs lg:text-sm font-sora font-extrabold shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFF8E8]" />
            <span>Gen Z Voices Research Initiative</span>
          </div>

          <h1 className="font-sora font-extrabold text-2.5xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight drop-shadow-sm">
            About Gen Z Voices
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl font-sora font-semibold text-[#FFF8E8] leading-relaxed max-w-2xl mx-auto px-2">
            Understanding Gen Z. Capturing Perspectives. Shaping Tomorrow.
          </p>
        </div>

        {/* 2. OVERVIEW & RESEARCH DIMENSIONS GRID */}
        <div className="bg-[#FFF8E8] rounded-3xl p-5 sm:p-8 lg:p-10 border border-white/80 shadow-[0px_20px_50px_rgba(6,62,70,0.12)] space-y-6 sm:space-y-8 relative z-20">

          <div className="max-w-3xl space-y-3 sm:space-y-4 text-left">
            <h2 className="font-sora font-extrabold text-xl sm:text-2xl lg:text-3xl text-[#10242C]">
              Comprehensive Research Focus
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-[#53656A] font-medium leading-relaxed">
              <strong className="text-[#063E46]">Gen Z Voices</strong> is a research initiative focused on understanding the <strong className="text-[#075D63]">behaviour, lifestyle, values, aspirations, and future perspectives of Generation Z in India</strong>.
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-[#53656A] font-medium leading-relaxed">
              The responses collected through this platform contribute to a structured research dataset that can help generate meaningful insights into the choices and expectations of today's young generation.
            </p>
          </div>


          {/* Inspirational Quote Banner */}
          <div className="bg-[#063E46] text-[#FFF8E8] rounded-2xl p-4 sm:p-6 lg:p-7 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#109A9B]/40 text-center sm:text-left">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-bold text-[#109A9B] uppercase tracking-wider block font-sora">Guiding Philosophy</span>
              <p className="font-sora font-extrabold text-lg sm:text-xl lg:text-2xl text-white">
                “Your Perspective. A Brighter Tomorrow.”
              </p>
            </div>
            <Link
              to="/survey"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#109A9B] hover:bg-[#075D63] text-white font-sora font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 hover:scale-105 active:scale-95"
            >
              <span>Take Survey Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* 3. OUR RESEARCH PURPOSE CARD */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#109A9B]/20 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#EAF6F6] text-[#109A9B] flex items-center justify-center border border-[#109A9B]/30 shadow-2xs shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-sora font-extrabold text-xl sm:text-2xl text-[#10242C]">
                Our Research Purpose
              </h3>
              <p className="text-xs font-bold text-[#075D63]">
                Empowering academic & policy research across India
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm lg:text-base text-[#53656A] font-medium leading-relaxed">
            The study aims to understand how Gen Z thinks, lives, chooses, and plans for the future. By bringing together diverse perspectives from young people across India, the research seeks to support <strong className="text-[#063E46]">academic understanding, evidence-based discussions, policies, and initiatives for a better future</strong>.
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#075D63]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Open for Students & Young Professionals across India</span>
          </div>
        </div>

        {/* 4. FROM CONCEPT TO A PLATFORM - ACADEMIC INFOGRAPHIC SECTION */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#109A9B]/20 shadow-[0px_20px_50px_rgba(6,62,70,0.08)] space-y-8 sm:space-y-10 relative z-20">

          {/* Section Header */}
          <div className="text-center space-y-2 sm:space-y-3 max-w-3xl mx-auto">
            <h2 className="font-sora font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#10242C] tracking-tight">
              From Concept to a Platform
            </h2>
            <p className="text-sm sm:text-base lg:text-lg font-sora font-semibold text-[#53656A]">
              Guidance and development working together to bring Gen Z Voices to life.
            </p>
          </div>

          {/* Top Process Flow: 3 Horizontal/Vertical Circular Icon Nodes Connected with Arrows */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-10 py-5 px-4 sm:px-6 bg-gradient-to-r from-[#EAF6F6]/60 via-sky-50/50 to-[#EAF6F6]/60 rounded-2xl border border-[#109A9B]/20 max-w-4xl mx-auto shadow-inner w-full">

            {/* Left Node: Research Concept */}
            <div className="flex items-center gap-3 bg-white px-3.5 sm:px-4 py-2.5 rounded-2xl border border-amber-200/80 shadow-sm w-full sm:w-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)] shrink-0">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-100 text-amber-950" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">Research Concept</span>
                <span className="text-xs sm:text-sm font-sora font-extrabold text-[#10242C]">Idea & Methodology</span>
              </div>
            </div>

            {/* Mobile Vertical Arrow 1 */}
            <div className="flex sm:hidden items-center justify-center text-[#109A9B] rotate-90 my-0.5">
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>

            {/* Tablet/Desktop Arrow 1 */}
            <div className="hidden sm:flex items-center text-[#109A9B]">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>

            {/* Center Node: Coding & Development */}
            <div className="flex items-center gap-3 bg-white px-3.5 sm:px-4 py-2.5 rounded-2xl border border-[#063E46]/30 shadow-sm w-full sm:w-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#063E46] text-emerald-400 flex items-center justify-center shadow-md shrink-0 border border-[#109A9B]/40">
                <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#075D63] block">Development</span>
                <span className="text-xs sm:text-sm font-sora font-extrabold text-[#10242C]">Survey Platform</span>
              </div>
            </div>

            {/* Mobile Vertical Arrow 2 */}
            <div className="flex sm:hidden items-center justify-center text-[#109A9B] rotate-90 my-0.5">
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>

            {/* Tablet/Desktop Arrow 2 */}
            <div className="hidden sm:flex items-center text-[#109A9B]">
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </div>

            {/* Right Node: Analytics */}
            <div className="flex items-center gap-3 bg-white px-3.5 sm:px-4 py-2.5 rounded-2xl border border-sky-200/80 shadow-sm w-full sm:w-auto">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.35)] shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 block">Analytics</span>
                <span className="text-xs sm:text-sm font-sora font-extrabold text-[#10242C]">Insights & Data</span>
              </div>
            </div>

          </div>

          {/* Symmetrical Two-Column Profile Composition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-5xl mx-auto w-full items-stretch">

            {/* LEFT PROFILE CARD: Dr. K. V. Sambasivarao */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-8 border-2 border-[#109A9B]/30 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-5 sm:space-y-6 relative overflow-hidden group">

              {/* Header Pill Label */}
              <div className="flex justify-center md:justify-start">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF6F6] text-[#075D63] border border-[#109A9B]/30 text-xs font-sora font-extrabold shadow-2xs">
                  <Bookmark className="w-3.5 h-3.5 text-[#109A9B]" />
                  <span>Research Concept & Guidance</span>
                </div>
              </div>

              {/* Avatar & Profile Details */}
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="relative group-hover:scale-105 transition-transform duration-300">
                  <AcademicAvatar className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-sora font-extrabold text-xl sm:text-2xl text-[#10242C] tracking-tight group-hover:text-[#109A9B] transition-colors">
                    Dr. K. V. Sambasivarao
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#53656A] flex items-center justify-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#075D63] shrink-0" />
                    <span>Computer Science Department</span>
                  </p>
                  <a
                    href="mailto:kvsrao@nriit.edu.in"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#109A9B] hover:text-[#075D63] hover:underline transition-colors pt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>kvsrao@nriit.edu.in</span>
                  </a>
                </div>
              </div>

              {/* Description Box */}
              <div className="bg-slate-50/90 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 text-xs sm:text-sm font-semibold text-[#53656A] leading-relaxed text-center">
                Formulated research objectives, domain dimensions & academic methodology.
              </div>

            </div>

            {/* RIGHT PROFILE CARD: J. Sai Praneeth */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-8 border-2 border-[#063E46]/30 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-5 sm:space-y-6 relative overflow-hidden group">

              {/* Header Pill Label (Dark Teal Pill) */}
              <div className="flex justify-center md:justify-start">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#063E46] text-[#FFF8E8] border border-[#063E46]/40 text-xs font-sora font-extrabold shadow-2xs">
                  <Code2 className="w-3.5 h-3.5 text-[#109A9B]" />
                  <span>Survey Platform & Development</span>
                </div>
              </div>

              {/* Avatar & Profile Details */}
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="relative group-hover:scale-105 transition-transform duration-300">
                  <DeveloperAvatar className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-sora font-extrabold text-xl sm:text-2xl text-[#10242C] tracking-tight group-hover:text-[#063E46] transition-colors">
                    J. Sai Praneeth
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#53656A] flex items-center justify-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#075D63] shrink-0" />
                    <span>Computer Science Department</span>
                  </p>
                  <a
                    href="mailto:jupallisaipraneeth540@gmail.com"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#109A9B] hover:text-[#063E46] hover:underline transition-colors pt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>jupallisaipraneeth540@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Description Box */}
              <div className="bg-slate-50/90 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 text-xs sm:text-sm font-semibold text-[#53656A] leading-relaxed text-center">
                Architected & developed the digital survey instrument, database engine & analytics.
              </div>

            </div>

          </div>

        </div>

        {/* 5. PRIVACY & VOLUNTARY PARTICIPATION CARD */}
        <div className="bg-[#EAF6F6] rounded-3xl p-5 sm:p-8 border-2 border-[#109A9B]/30 shadow-md relative z-20 flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white text-[#109A9B] flex items-center justify-center border border-[#109A9B]/20 shadow-2xs shrink-0">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="space-y-1.5 sm:space-y-2 text-left flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-sora font-extrabold text-base sm:text-lg lg:text-xl text-[#063E46]">
                Your Privacy Matters
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                Voluntary Participation
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#075D63] font-medium leading-relaxed">
              Participation in this research is <strong>strictly voluntary</strong>. Responses are intended for research purposes and should not require direct personal identifiers such as names or phone numbers unless specifically approved as part of the research procedure.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

