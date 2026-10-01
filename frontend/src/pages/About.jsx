import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Code2,
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
  Mail,
  Sparkles,
  ShieldCheck,
  Clock,
  Gift,
  Award,
  FileText,
  UserCheck
} from 'lucide-react';

export default function About() {
  const MAJOR_AREAS = [
    {
      id: '01',
      title: 'Profile & Background',
      desc: 'Age, educational background, academic/professional profile and access to digital devices.',
      icon: UserCheck,
      badgeColor: 'bg-[#109A9B]/10 text-[#075D63] border-[#109A9B]/30',
      iconBg: 'bg-[#109A9B]/15 text-[#075D63]',
    },
    {
      id: '02',
      title: 'Daily Life, Habits & Health',
      desc: 'Daily routines, food, sleep, physical activity, wellbeing, leisure and lifestyle.',
      icon: Heart,
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-700',
    },
    {
      id: '03',
      title: 'Digital Life, Learning & Work',
      desc: 'Technology, social media, Artificial Intelligence, learning practices, skill development, career and financial behaviour.',
      icon: Laptop,
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      iconBg: 'bg-sky-100 text-sky-700',
    },
    {
      id: '04',
      title: 'Values, Relationships & Future',
      desc: 'Family and relationships, entrepreneurship, financial independence, values, decision-making, social participation and future aspirations.',
      icon: Compass,
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-800',
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F0] text-[#10242C] font-inter overflow-x-hidden pt-[80px] sm:pt-[100px] lg:pt-[110px] pb-12 sm:pb-16">

      {/* TOP DARK TEAL HERO BACKGROUND SECTION */}
      <div className="absolute top-0 left-0 right-0 h-[320px] sm:h-[380px] lg:h-[410px] bg-[#075D63] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(111,245,232,0.20),transparent_24%),radial-gradient(circle_at_92%_18%,rgba(35,210,203,0.13),transparent_24%),linear-gradient(135deg,#075D63_0%,#07535B_48%,#063E46_100%)]" />
        <div className="absolute -top-8 -left-8 sm:left-4 lg:left-8 w-[250px] sm:w-[330px] lg:w-[390px] h-[180px] sm:h-[230px] lg:h-[260px] rounded-full bg-[#8FF7EE]/20 blur-[55px]" />
        <div
          className="absolute top-[62px] left-[-45px] sm:left-[-25px] lg:left-[15px] w-[340px] sm:w-[430px] lg:w-[500px] h-[120px] sm:h-[150px] rotate-[-8deg] bg-gradient-to-r from-[#7FF8EF]/0 via-[#7FF8EF]/25 to-[#7FF8EF]/0 blur-[2px] opacity-80"
          style={{ clipPath: 'polygon(3% 42%, 12% 25%, 27% 34%, 41% 15%, 58% 31%, 76% 12%, 97% 38%, 90% 66%, 73% 55%, 58% 77%, 42% 59%, 25% 82%, 8% 65%)' }}
        />
        <div
          className="absolute top-[88px] left-[-25px] sm:left-[5px] lg:left-[35px] w-[360px] sm:w-[460px] lg:w-[520px] h-[105px] rotate-[-7deg] border-y border-[#9CFFF6]/20 opacity-70"
          style={{ clipPath: 'polygon(0 35%, 15% 18%, 31% 30%, 48% 10%, 65% 27%, 82% 8%, 100% 30%, 92% 68%, 75% 52%, 57% 72%, 40% 55%, 21% 78%, 5% 60%)' }}
        />
        <div
          className="absolute top-[92px] left-[28px] sm:left-[55px] lg:left-[78px] w-16 h-16 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(133,250,242,0.75) 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div className="absolute -top-[150px] -right-[95px] sm:-top-[170px] sm:-right-[75px] w-[330px] h-[330px] rounded-full border border-[#67EEE5]/30" />
        <div className="absolute -top-[125px] -right-[70px] sm:-top-[145px] sm:-right-[50px] w-[280px] h-[280px] rounded-full border border-[#67EEE5]/15" />
        <div className="absolute top-[48px] right-[55px] w-2.5 h-2.5 rounded-full bg-[#67EEE5] shadow-[0_0_18px_rgba(103,238,229,0.9)]" />
        <div className="absolute -bottom-[185px] -left-[145px] w-[360px] h-[360px] rounded-full border border-[#67EEE5]/25" />
        <div className="absolute -bottom-[155px] -left-[115px] w-[300px] h-[300px] rounded-full border border-[#67EEE5]/10" />
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, transparent 0, transparent 38px, rgba(255,255,255,0.8) 39px, transparent 40px)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,154,155,0.18),transparent_70%)]" />
      </div>

      {/* UNIFIED CREAM BACKGROUND FOR LOWER PAGE */}
      <div className="absolute inset-0 top-[320px] sm:top-[380px] lg:top-[410px] bg-[#FAF7F0] z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(7,93,99,0.05),transparent_65%)]" />
        <div className="absolute bottom-10 left-5 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-[#109A9B]/10 blur-3xl pointer-events-none" />
      </div>

      {/* MAIN ALIGNED CONTAINER WITH COMPACT SPACING */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-3.5 sm:px-6 lg:px-8 w-full space-y-5 sm:space-y-7 lg:space-y-8">

        {/* 1. HERO SECTION */}
        <div className="text-center space-y-2.5 sm:space-y-3 max-w-4xl mx-auto pt-1 sm:pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 border border-white/20 text-[11px] sm:text-xs font-sora font-extrabold shadow-sm backdrop-blur-md">
            <span>GEN Z VOICES • SURVEY INSTRUMENT</span>
          </div>
          <h1 className="font-sora font-extrabold text-2.5xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight drop-shadow-md">
            Gen Z Voices – Survey Instrument
          </h1>
          <p className="text-xs sm:text-base lg:text-lg font-sora font-semibold text-white/95 leading-relaxed max-w-2xl mx-auto px-2">
            Understanding Gen Z. Capturing Perspectives. Shaping Tomorrow.
          </p>
        </div>

        {/* 2. OVERVIEW & METHODOLOGY CARD */}
        <div className="bg-[#FFFDF9] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-white/80 shadow-[0px_15px_40px_rgba(6,62,70,0.10)] space-y-4 sm:space-y-5 relative z-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-slate-100 pb-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#063E46] text-[#FFF8E8] flex items-center justify-center shadow-md shrink-0">
              <FileText className="w-5 h-5 text-[#109A9B]" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-sora font-extrabold text-[#109A9B] uppercase tracking-wider block">RESEARCH METHODOLOGY</span>
              <h2 className="font-sora font-extrabold text-lg sm:text-xl lg:text-2xl text-[#10242C]">
                Structured & Systematic Research
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[#53656A] text-xs sm:text-sm font-medium leading-relaxed">
            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#109A9B]/15 space-y-1.5">
              <h3 className="font-sora font-extrabold text-xs sm:text-sm text-[#10242C] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#109A9B] shrink-0" />
                <span>67-Question Research Questionnaire</span>
              </h3>
              <p>
                The <strong>Gen Z Voices Survey Instrument</strong> is a structured, anonymous <strong>67-question research questionnaire</strong> developed to understand the behaviour, attitudes, habits, preferences, aspirations, values and future perspectives of Generation Z youth in India.
              </p>
            </div>

            <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#109A9B]/15 space-y-1.5">
              <h3 className="font-sora font-extrabold text-xs sm:text-sm text-[#10242C] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#109A9B] shrink-0" />
                <span>Measurable Data & Academic Analysis</span>
              </h3>
              <p>
                The questions are designed to capture <strong>measurable responses</strong> relating to frequency, time, quantity, choices, preferences, behavioural patterns and decision-making, supporting systematic academic analysis.
              </p>
            </div>
          </div>

          {/* Inspirational Quote Banner */}
          <div className="bg-[#063E46] text-[#FFF8E8] rounded-xl p-3.5 sm:p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#109A9B]/40 text-center sm:text-left">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#109A9B] uppercase tracking-wider block font-sora">Guiding Philosophy</span>
              <p className="font-sora font-extrabold text-sm sm:text-lg text-white">
                “Your Perspective. A Brighter Tomorrow.”
              </p>
            </div>
            <Link
              to="/survey"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-lg bg-[#109A9B] hover:bg-[#075D63] text-white font-sora font-bold text-xs shadow-sm transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Take Survey Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3. FOUR MAJOR AREAS COVERED GRID */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[10px] sm:text-xs font-sora font-extrabold text-[#109A9B] uppercase tracking-wider block">SURVEY ARCHITECTURE</span>
            <h2 className="font-sora font-extrabold text-xl sm:text-2xl lg:text-3xl text-[#10242C] tracking-tight">
              Four Major Areas Covered
            </h2>
            <p className="text-xs text-[#53656A] font-medium max-w-xl mx-auto">
              Comprehensive coverage across key aspects of Gen Z life, learning, choices, and aspirations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {MAJOR_AREAS.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.id}
                  className="bg-white rounded-xl p-4 border border-slate-200/90 hover:border-[#109A9B]/50 transition-all shadow-2xs hover:shadow-xs flex items-start gap-3.5 group"
                >
                  <div className={`w-10 h-10 rounded-lg ${area.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-sora font-extrabold px-2 py-0.5 rounded-full border ${area.badgeColor}`}>
                        {area.id}
                      </span>
                      <h3 className="font-sora font-extrabold text-sm sm:text-base text-[#10242C] group-hover:text-[#063E46] transition-colors truncate">
                        {area.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#53656A] font-medium leading-relaxed">
                      {area.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. PRIVACY & CONFIDENTIALITY SECTION */}
        <div className="bg-[#EAF6F6] rounded-2xl p-4 sm:p-6 border-2 border-[#109A9B]/30 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#109A9B] flex items-center justify-center border border-[#109A9B]/20 shadow-2xs shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-sora font-extrabold text-lg sm:text-xl text-[#063E46]">
                  Privacy & Confidentiality
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-sora font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Strictly Confidential
                </span>
              </div>
              <p className="text-xs font-bold text-[#075D63] mt-0.5">
                Your data is protected and analyzed solely in aggregate form.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#075D63] font-medium leading-relaxed pt-1">
            <div className="bg-white/80 p-3.5 rounded-xl border border-[#109A9B]/20 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#063E46]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Direct Identifiers Collected</span>
              </div>
              <p>
                Your responses are treated as confidential and will not be revealed, disclosed or published in a manner that identifies an individual participant. The survey does not collect directly identifying information such as your name, phone number or exact residential address.
              </p>
            </div>

            <div className="bg-white/80 p-3.5 rounded-xl border border-[#109A9B]/20 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#063E46]">
                <BarChart3 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Academic & Aggregate Analysis Only</span>
              </div>
              <p>
                The information collected through the questionnaire is intended solely for academic and research purposes and will be analysed primarily in aggregate to understand broader Gen Z patterns and insights.
              </p>
            </div>
          </div>
        </div>

        {/* 5. PARTICIPATION GUIDELINES & MINDFUL RESPONSES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: How to Participate */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-sora font-extrabold text-amber-800 uppercase tracking-wider block">PARTICIPATION GUIDE</span>
                  <h3 className="font-sora font-extrabold text-base text-[#10242C]">
                    How to Participate
                  </h3>
                </div>
              </div>
              <p className="text-xs text-[#53656A] font-medium leading-relaxed">
                The survey takes approximately <strong>15–20 minutes</strong>. Please answer each question based on your <strong>actual recent experiences, behaviour and preferences</strong>, rather than what you think would be the ideal answer.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#063E46]">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Takes 15–20 minutes • Genuine responses</span>
            </div>
          </div>

          {/* Card B: Mindful Responses Matter */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <Brain className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-sora font-extrabold text-purple-800 uppercase tracking-wider block">QUALITY RESEARCH</span>
                  <h3 className="font-sora font-extrabold text-base text-[#10242C]">
                    Mindful Responses Matter
                  </h3>
                </div>
              </div>
              <p className="text-xs text-[#53656A] font-medium leading-relaxed">
                Please take a few uninterrupted minutes to complete the survey with <strong>attention, concentration and honest reflection</strong>. The quality of the research depends on the authenticity of the responses.
              </p>
            </div>
            <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#063E46]">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Honest reflection • Authentic findings</span>
            </div>
          </div>
        </div>

        {/* 6. AFTER COMPLETING THE SURVEY (3 REWARD CARDS) */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[10px] sm:text-xs font-sora font-extrabold text-[#109A9B] uppercase tracking-wider block">PARTICIPANT INCENTIVES</span>
            <h2 className="font-sora font-extrabold text-xl sm:text-2xl lg:text-3xl text-[#10242C] tracking-tight">
              After Completing the Survey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Card 1: Certificate */}
            <div className="bg-white rounded-xl p-4 border border-emerald-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300 shadow-2xs group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5 text-emerald-700 shrink-0" />
                </div>
                <h3 className="font-sora font-extrabold text-sm sm:text-base text-[#10242C] group-hover:text-emerald-800 transition-colors">
                  Certificate
                </h3>
                <p className="text-xs text-[#53656A] font-medium leading-relaxed">
                  Receive your instant <strong>Participation Certificate</strong> with a unique Certificate Number.
                </p>
              </div>
              <div className="pt-2.5 border-t border-slate-100 text-[11px] sm:text-xs font-sora font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant Certificate Generation</span>
              </div>
            </div>

            {/* Card 2: Lucky Draw */}
            <div className="bg-white rounded-xl p-4 border border-purple-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center border border-purple-300 shadow-2xs group-hover:scale-105 transition-transform">
                  <Gift className="w-5 h-5 text-purple-700 shrink-0" />
                </div>
                <h3 className="font-sora font-extrabold text-sm sm:text-base text-[#10242C] group-hover:text-purple-800 transition-colors">
                  Lucky Draw
                </h3>
                <p className="text-xs text-[#53656A] font-medium leading-relaxed">
                  Become eligible for the Lucky Draw on <strong>14 November 2026</strong>, with cash awards for selected prize winners.
                </p>
              </div>
              <div className="pt-2.5 border-t border-slate-100 text-[11px] sm:text-xs font-sora font-bold text-purple-800 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Draw Date: 14 Nov 2026</span>
              </div>
            </div>

            {/* Card 3: Insights */}
            <div className="bg-white rounded-xl p-4 border border-sky-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center border border-sky-300 shadow-2xs group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5 text-sky-700 shrink-0" />
                </div>
                <h3 className="font-sora font-extrabold text-sm sm:text-base text-[#10242C] group-hover:text-sky-800 transition-colors">
                  Insights
                </h3>
                <p className="text-xs text-[#53656A] font-medium leading-relaxed">
                  Explore the research findings and discover how your responses relate to broader Gen Z trends and patterns.
                </p>
              </div>
              <div className="pt-2.5 border-t border-slate-100 text-[11px] sm:text-xs font-sora font-bold text-sky-800 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Published Research Trends</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7. ACADEMIC LEADERSHIP & PLATFORM DEVELOPMENT SECTION */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-[#109A9B]/20 shadow-sm space-y-6 relative z-20">
          <div className="text-center space-y-1.5 max-w-3xl mx-auto">
            <span className="text-[10px] sm:text-xs font-sora font-extrabold text-[#109A9B] uppercase tracking-wider block">ACADEMIC TEAM</span>
            <h2 className="font-sora font-extrabold text-xl sm:text-2xl lg:text-3xl text-[#10242C] tracking-tight">
              From Concept to a Platform
            </h2>
            <p className="text-xs sm:text-sm font-sora font-semibold text-[#53656A]">
              Guidance and development working together to bring Gen Z Voices to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto w-full items-stretch">
            {/* Dr. K. V. Sambasivarao */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-[#109A9B]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
              <div className="flex justify-center md:justify-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6F6] text-[#075D63] border border-[#109A9B]/30 text-[11px] font-sora font-extrabold shadow-2xs">
                  <Bookmark className="w-3.5 h-3.5 text-[#109A9B]" />
                  <span>Research Concept & Guidance</span>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-2.5">
                <div className="relative group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/1980sDeansir.png"
                    alt="Dr. K. V. Sambasivarao"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#109A9B]/40 shadow-md"
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-sora font-extrabold text-lg sm:text-xl text-[#10242C] tracking-tight group-hover:text-[#109A9B] transition-colors">
                    Dr. K. V. Sambasivarao
                  </h3>
                  <p className="text-xs font-sora font-extrabold text-[#075D63]">Director R&D</p>
                  <p className="text-xs font-bold text-[#53656A] flex items-center justify-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#075D63] shrink-0" />
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

              <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 text-xs font-semibold text-[#53656A] leading-relaxed text-center">
                Formulated research objectives, domain dimensions & academic methodology.
              </div>
            </div>

            {/* J. Sai Praneeth */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-[#063E46]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
              <div className="flex justify-center md:justify-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#063E46] text-[#FFF8E8] border border-[#063E46]/40 text-[11px] font-sora font-extrabold shadow-2xs">
                  <Code2 className="w-3.5 h-3.5 text-[#109A9B]" />
                  <span>Survey Platform & Development</span>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-2.5">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#063E46]/40 shadow-md relative group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/saipraneethnew.png"
                    alt="J. Sai Praneeth"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-sora font-extrabold text-lg sm:text-xl text-[#10242C] tracking-tight group-hover:text-[#063E46] transition-colors">
                    J. Sai Praneeth
                  </h3>
                  <p className="text-xs font-bold text-[#53656A] flex items-center justify-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#075D63] shrink-0" />
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

              <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 text-xs font-semibold text-[#53656A] leading-relaxed text-center">
                Architected & developed the digital survey instrument, database engine & analytics.
              </div>
            </div>
          </div>
        </div>

        {/* 8. CLOSING HERO CALL TO ACTION BANNER WITH HIGHLIGHTED BADGE & SINGLE LINE TEXT */}
        <div className="bg-gradient-to-r from-[#063E46] via-[#075D63] to-[#0D5960] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-9 border border-[#109A9B]/30 shadow-xl text-center space-y-4">
          <div className="space-y-3 max-w-4xl mx-auto">
            {/* Highlighted Badge */}
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 font-sora font-extrabold text-xs tracking-widest uppercase shadow-sm backdrop-blur-md">
              JOIN THE RESEARCH STUDY
            </div>

            {/* Single Line Text */}
            <h2 className="font-sora font-black text-xs sm:text-lg md:text-2xl lg:text-3xl text-white tracking-tight leading-tight">
              Your Voice. Your Perspective. Your Generation.
            </h2>

            <p className="text-xs sm:text-sm font-sora font-semibold text-teal-100/90 tracking-wide">
              Participate • Reflect • Contribute • Discover
            </p>
          </div>

          <div>
            <Link
              to="/survey"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl sm:rounded-2xl bg-[#FFF8E8] hover:bg-[#FDE7B5] text-[#063E46] font-sora font-extrabold text-xs sm:text-base shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Take the Survey Now</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#063E46]" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
