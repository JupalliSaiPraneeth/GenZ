import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSurveyStore } from '../stores/surveyStore';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Lock,
  Clock,
  FileText,
  ShieldCheck,
  Gift,
  UserCheck,
  ChevronRight,
  Users,
  BarChart2,
  LogOut,
  SkipForward,
} from 'lucide-react';

export default function Survey() {
  const navigate = useNavigate();

  const {
    questions,
    sections,
    currentQuestionIndex,
    currentSectionIndex,
    answersById,
    setAnswer,
    nextQuestion,
    prevQuestion,
    jumpToSection,
    jumpToQuestion,
    getProgressPercentage,
    participantName,
    participantEmail,
    setParticipantName,
    setParticipantDetails,
    resetSession,
    logoutParticipant,
    isResumedSession,
    syncStatus,
    lastSyncedAt,
  } = useSurveyStore();

  const handleLogoutSession = () => {
    if (logoutParticipant) logoutParticipant();
    else if (resetSession) resetSession();
    setNameInput('');
    setEmailInput('');
    setOnboardingStep(2.5);
  };

  const hasSavedState = Boolean(participantName || Object.keys(answersById).length > 0);
  
  // Onboarding Step State (0 = Welcome Screen, 1 = 4-Chapter Roadmap, 2 = Privacy Guarantee, 2.5 = Name Entry, 3 = Active 207-Q Survey)
  const [onboardingStep, setOnboardingStep] = useState(hasSavedState ? 3 : 0);

  const [nameInput, setNameInput] = useState(participantName || '');
  const [emailInput, setEmailInput] = useState(participantEmail || '');
  const [isSavingName, setIsSavingName] = useState(false);

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const currentSection = sections[currentSectionIndex] || sections[0];
  const progressPercentage = getProgressPercentage();
  const selectedAnswer = answersById[currentQuestion?.id];

  const [maxVisitedIndex, setMaxVisitedIndex] = useState(currentQuestionIndex);

  useEffect(() => {
    if (currentQuestionIndex > maxVisitedIndex) {
      setMaxVisitedIndex(currentQuestionIndex);
    }
  }, [currentQuestionIndex, maxVisitedIndex]);

  // Answered Count: Any question with a recorded answer
  const answeredCount = questions.filter(q => Boolean(answersById[q.id] && answersById[q.id] !== 'skipped')).length;

  // Skipped Count: Questions visited so far (up to highest reached question index) that were left unanswered
  const maxReached = Math.max(currentQuestionIndex, maxVisitedIndex);
  const visitedQuestions = questions.slice(0, maxReached);
  const skippedCount = visitedQuestions.filter(q => !answersById[q.id] || answersById[q.id] === 'skipped').length;

  // Redirect / Jump to Next Skipped Question Handler
  const jumpToNextSkippedQuestion = () => {
    const skippedIndices = [];
    for (let i = 0; i < maxReached; i++) {
      if (!answersById[questions[i]?.id] || answersById[questions[i]?.id] === 'skipped') {
        skippedIndices.push(i);
      }
    }

    if (skippedIndices.length === 0) return;

    // Find the next skipped question AFTER currentQuestionIndex, or wrap around to the first skipped question
    const nextSkipped = skippedIndices.find(idx => idx > currentQuestionIndex) ?? skippedIndices[0];

    if (nextSkipped !== undefined && jumpToQuestion) {
      jumpToQuestion(nextSkipped);
    }
  };

  // Auto-switch to active survey experience if session state is restored asynchronously
  useEffect(() => {
    if (hasSavedState && onboardingStep < 3) {
      setOnboardingStep(3);
    }
  }, [hasSavedState]);

  // Sync Name/Email Input if store updates
  useEffect(() => {
    if (participantName && !nameInput) {
      setNameInput(participantName);
    }
    if (participantEmail && !emailInput) {
      setEmailInput(participantEmail);
    }
  }, [participantName, participantEmail]);

  // Milestone Celebration Trigger
  useEffect(() => {
    if (progressPercentage === 25 || progressPercentage === 50 || progressPercentage === 75 || progressPercentage === 100) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.75 },
      });
    }
  }, [progressPercentage]);

  // Auto-scroll smooth to top whenever question or step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex, onboardingStep]);

  const handleSaveNameAndStart = async (e) => {
    if (e) e.preventDefault();
    if (!nameInput.trim()) return;
    setIsSavingName(true);
    await setParticipantDetails(nameInput.trim(), emailInput.trim());
    setIsSavingName(false);
    setOnboardingStep(3);
  };

  const handleOptionSelect = async (val) => {
    if (!currentQuestion) return;
    await setAnswer(currentQuestion.id, val);
  };

  const handleFinishSurvey = () => {
    confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 } });
    navigate('/survey-complete');
  };

  // ONBOARDING STEP 0: MASTER PROMPT WELCOME EXPERIENCE
  if (onboardingStep === 0) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-[#FAF7F0] flex flex-col justify-between pt-[100px] sm:pt-[140px] md:pt-[165px]">

        {/* TOP TEAL / BOTTOM BEIGE ARTISTIC SPLIT BACKGROUND WITH ORGANIC SVG DIVIDER */}
        <div className="absolute top-0 left-0 right-0 h-[480px] sm:h-[530px] bg-gradient-to-b from-[#109A9B] to-[#075D63] z-0 overflow-hidden">
          {/* Radial Glow Lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        {/* Organic Curved SVG Boundary Divider */}
        <div className="absolute top-[430px] sm:top-[475px] left-0 right-0 z-0 pointer-events-none">
          <svg className="w-full h-20 sm:h-32 text-[#FAF7F0] fill-current preserve-3d" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,32L80,42.7C160,53,320,75,480,80C640,85,800,75,960,58.7C1120,43,1280,21,1360,10.7L1440,0L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>

        {/* ORGANIC BACKGROUND SHAPES */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#109A9B]/20 blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#075D63]/15 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[55%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.65),transparent_55%)] pointer-events-none z-0" />

        {/* DECORATIVE BACKGROUND ELEMENTS */}
        <div className="absolute top-40 left-6 sm:left-14 text-white/90 z-10 pointer-events-none hidden sm:block">
          <div className="font-handwritten text-2xl font-extrabold rotate-[-8deg] leading-tight text-[#FFF8E8]">
            Your <br /> Voice <br /> Matters
          </div>
        </div>

        <div className="absolute top-40 right-6 sm:right-14 text-white/90 z-10 pointer-events-none hidden sm:block text-right">
          <div className="font-handwritten text-2xl font-extrabold rotate-[8deg] leading-tight text-[#FFF8E8]">
            Ideas Today <br /> Better Tomorrow
          </div>
        </div>

        {/* MAIN CONTAINER CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-10 pb-12 sm:pb-16 w-full flex-1 flex flex-col justify-between">

          <div>
            {/* CENTRAL WELCOME CARD */}
            <div className="max-w-[580px] mx-auto bg-[#FFFDF9] rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 md:p-9 border border-white/80 shadow-[0px_20px_50px_rgba(6,62,70,0.15)] text-center relative z-20 transition-all duration-300">

              {/* Header Sparkles Icon Box */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#075D63] to-[#109A9B] text-[#FFF8E8] flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md shadow-teal-900/15">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 fill-[#FFF8E8]" />
              </div>

              {/* Main Heading */}
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-[44px] leading-tight text-[#10242C] mb-2 sm:mb-3 tracking-tight">
                Hey, <span className="bg-gradient-to-r from-[#109A9B] to-[#075D63] bg-clip-text text-transparent">Gen Z 👋</span>
              </h1>

              {/* Description */}
              <p className="text-[#53656A] text-xs sm:text-base leading-relaxed max-w-[480px] mx-auto mb-5 sm:mb-6 font-medium">
                Welcome to India's premier youth perspective research study. We have organized the <strong className="text-[#063E46] font-bold">207 questions</strong> into <strong className="text-[#063E46] font-bold">4 simple chapters</strong> so your journey feels fast, smooth, and engaging.
              </p>

              {/* Primary CTA Button */}
              <button
                onClick={() => setOnboardingStep(1)}
                className="w-full h-[48px] sm:h-[54px] bg-[#063E46] hover:bg-gradient-to-r hover:from-[#075D63] hover:to-[#109A9B] text-[#FFF8E8] font-heading font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-950/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 transform hover:-translate-y-[2px] active:translate-y-0 group cursor-pointer"
              >
                <span>Let's Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>

              {/* Security Guarantee Message */}
              <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-3.5 text-[11px] sm:text-xs font-semibold text-[#063E46]">
                <Lock className="w-3.5 h-3.5 text-[#109A9B]" />
                <span>Your responses are 100% anonymous and secure</span>
              </div>

            </div>

            {/* SURVEY INFORMATION ROW */}
            <div className="mt-6 sm:mt-10 max-w-5xl mx-auto bg-[#FFFDF9]/95 backdrop-blur-md rounded-[22px] p-3 sm:p-5 border border-[#109A9B]/20 shadow-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y-0 sm:divide-y-0 md:divide-x divide-[#063E46]/15">

                <div className="flex items-center gap-2.5 sm:gap-3.5 p-1 justify-start sm:justify-center">
                  <div className="w-[42px] h-[42px] sm:w-[52px] sm:h-[52px] rounded-2xl bg-[#109A9B]/12 text-[#063E46] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#109A9B]" />
                  </div>
                  <div>
                    <span className="block font-heading font-extrabold text-[#10242C] text-xs sm:text-base leading-snug">15–20 Mins</span>
                    <span className="text-[10px] sm:text-xs text-[#53656A] font-medium">Quick & engaging</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3.5 p-1 justify-start sm:justify-center">
                  <div className="w-[42px] h-[42px] sm:w-[52px] sm:h-[52px] rounded-2xl bg-[#109A9B]/12 text-[#063E46] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#109A9B]" />
                  </div>
                  <div>
                    <span className="block font-heading font-extrabold text-[#10242C] text-xs sm:text-base leading-snug">207 Questions</span>
                    <span className="text-[10px] sm:text-xs text-[#53656A] font-medium">Across 4 chapters</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3.5 p-1 justify-start sm:justify-center">
                  <div className="w-[42px] h-[42px] sm:w-[52px] sm:h-[52px] rounded-2xl bg-[#109A9B]/12 text-[#063E46] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#109A9B]" />
                  </div>
                  <div>
                    <span className="block font-heading font-extrabold text-[#10242C] text-xs sm:text-base leading-snug">Your Privacy</span>
                    <span className="text-[10px] sm:text-xs text-[#53656A] font-medium">100% Anonymous</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3.5 p-1 justify-start sm:justify-center">
                  <div className="w-[42px] h-[42px] sm:w-[52px] sm:h-[52px] rounded-2xl bg-[#109A9B]/12 text-[#063E46] flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-[#109A9B]" />
                  </div>
                  <div>
                    <span className="block font-heading font-extrabold text-[#10242C] text-xs sm:text-base leading-snug">Rewards</span>
                    <span className="text-[10px] sm:text-xs text-[#53656A] font-medium">Certificate & Draw</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // ONBOARDING STEP 1: ATTRACTIVE, PROFESSIONAL EDITORIAL 4-SECTION ROADMAP
  if (onboardingStep === 1) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-[#FAF7F0] flex flex-col justify-between pt-[95px] sm:pt-[120px] pb-6">

        {/* ELEGANT ATMOSPHERIC DEEP TEAL HEADER */}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#093238] via-[#0E5158] to-[#109A9B] z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.3),transparent_70%)]" />
        </div>

        {/* ORGANIC SVG WAVE BOUNDARY */}
        <div className="absolute top-[330px] left-0 right-0 z-0 pointer-events-none">
          <svg className="w-full h-28 text-[#FAF7F0] fill-current preserve-3d" viewBox="0 0 1440 160" preserveAspectRatio="none">
            <path d="M0,64L120,74.7C240,85,480,107,720,101.3C960,96,1200,64,1320,48L1440,32L1440,160L1320,160C1200,160,960,160,720,160C480,160,240,160,120,160L0,160Z" />
          </svg>
        </div>

        {/* MAIN COMPOSITION CONTAINER */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">

          {/* CENTERED ROADMAP CARD CONTAINER */}
          <div className="flex justify-center items-center pt-2">

            {/* CENTRAL ROADMAP CARD */}
            <div className="max-w-[580px] w-full mx-auto font-jakarta">
              <div className="bg-[#FFFDF9] rounded-[24px] sm:rounded-[28px] p-4 sm:p-7 border border-white/80 shadow-[0px_20px_50px_rgba(6,62,70,0.12)] relative z-20">

                {/* Header Label & Title */}
                <div className="text-center sm:text-left mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#109A9B]/10 border border-[#109A9B]/20 text-[#075D63] font-inter font-bold text-[10px] sm:text-[11px] uppercase tracking-wider mb-1">
                    ✨ 4 Chapter Journey
                  </span>
                  <h2 className="font-sora font-extrabold text-xl sm:text-[32px] text-[#10242C] leading-tight tracking-tight">
                    Your 4-Section <span className="text-[#109A9B]">Roadmap</span>
                  </h2>
                  <p className="text-[#53656A] font-inter text-xs sm:text-[13px] leading-relaxed mt-1 font-normal">
                    A guided journey to understand your world, your thoughts, and your vision for a brighter tomorrow.
                  </p>
                </div>

                {/* INTEGRATED KEY STATS BAR */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mb-3 sm:mb-4 py-1.5 px-2.5 rounded-xl bg-[#EAF6F6]/80 border border-[#109A9B]/20 font-inter">
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[#075D63] p-0.5">
                    <BarChart2 className="w-3.5 h-3.5 text-[#109A9B] flex-shrink-0" />
                    <span>207 Questions</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[#075D63] p-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#109A9B] flex-shrink-0" />
                    <span>15–20 Mins</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[#075D63] p-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#109A9B] flex-shrink-0" />
                    <span>100% Anonymous</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-[#075D63] p-0.5">
                    <Gift className="w-3.5 h-3.5 text-[#109A9B] flex-shrink-0" />
                    <span>Rewards</span>
                  </div>
                </div>

                {/* 4 STACKED INTERACTIVE SECTION CARDS */}
                <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5 font-inter">

                  {/* SECTION 01 */}
                  <div
                    onClick={() => setOnboardingStep(2)}
                    className="p-2.5 sm:p-3.5 rounded-[16px] bg-[#F4FAF8] hover:bg-white border border-[#109A9B]/20 hover:border-[#109A9B] transition-all duration-200 shadow-2xs flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#109A9B] to-[#075D63] text-white font-sora font-extrabold text-xs sm:text-base flex items-center justify-center flex-shrink-0 shadow-sm">
                        01
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-sora font-extrabold text-[#10242C] text-[11px] sm:text-[13px] tracking-wide uppercase truncate">
                          KNOW YOUR EVERYDAY YOU
                        </h4>
                        <p className="text-[10px] sm:text-xs text-[#53656A] font-inter font-medium truncate">
                          Education • Health • Lifestyle
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
                      <span className="text-[10px] sm:text-xs font-inter font-semibold text-[#075D63] bg-white px-2 py-0.5 rounded-full border border-[#109A9B]/20">Q1–35</span>
                      <ChevronRight className="w-4 h-4 text-[#10242C]" />
                    </div>
                  </div>

                  {/* SECTION 02 */}
                  <div
                    onClick={() => setOnboardingStep(2)}
                    className="p-2.5 sm:p-3.5 rounded-[16px] bg-[#FFF8F0] hover:bg-white border border-amber-200/80 hover:border-amber-400 transition-all duration-200 shadow-2xs flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-sora font-extrabold text-xs sm:text-base flex items-center justify-center flex-shrink-0 shadow-sm">
                        02
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-sora font-extrabold text-[#10242C] text-[11px] sm:text-[13px] tracking-wide uppercase truncate">
                          YOUR WORLD & CONNECTIONS
                        </h4>
                        <p className="text-[10px] sm:text-xs text-[#53656A] font-inter font-medium truncate">
                          Entertainment • Career
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
                      <span className="text-[10px] sm:text-xs font-inter font-semibold text-amber-900 bg-white px-2 py-0.5 rounded-full border border-amber-200">Q36–90</span>
                      <ChevronRight className="w-4 h-4 text-[#10242C]" />
                    </div>
                  </div>

                  {/* SECTION 03 */}
                  <div
                    onClick={() => setOnboardingStep(2)}
                    className="p-2.5 sm:p-3.5 rounded-[16px] bg-[#F6F4FA] hover:bg-white border border-purple-200/80 hover:border-purple-400 transition-all duration-200 shadow-2xs flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 text-white font-sora font-extrabold text-xs sm:text-base flex items-center justify-center flex-shrink-0 shadow-sm">
                        03
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-sora font-extrabold text-[#10242C] text-[11px] sm:text-[13px] tracking-wide uppercase truncate">
                          BUILD YOUR FUTURE
                        </h4>
                        <p className="text-[10px] sm:text-xs text-[#53656A] font-inter font-medium truncate">
                          Finance • Skills • AI
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
                      <span className="text-[10px] sm:text-xs font-inter font-semibold text-purple-900 bg-white px-2 py-0.5 rounded-full border border-purple-200">Q91–130</span>
                      <ChevronRight className="w-4 h-4 text-[#10242C]" />
                    </div>
                  </div>

                  {/* SECTION 04 */}
                  <div
                    onClick={() => setOnboardingStep(2)}
                    className="p-2.5 sm:p-3.5 rounded-[16px] bg-[#FAF4F5] hover:bg-white border border-rose-200/80 hover:border-rose-400 transition-all duration-200 shadow-2xs flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white font-sora font-extrabold text-xs sm:text-base flex items-center justify-center flex-shrink-0 shadow-sm">
                        04
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-sora font-extrabold text-[#10242C] text-[11px] sm:text-[13px] tracking-wide uppercase truncate">
                          YOUR VOICE, YOUR FUTURE
                        </h4>
                        <p className="text-[10px] sm:text-xs text-[#53656A] font-inter font-medium truncate">
                          Society • Aspirations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
                      <span className="text-[10px] sm:text-xs font-inter font-semibold text-rose-900 bg-white px-2 py-0.5 rounded-full border border-rose-200">Q131–207</span>
                      <ChevronRight className="w-4 h-4 text-[#10242C]" />
                    </div>
                  </div>

                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-2 font-inter">
                  <button
                    onClick={() => setOnboardingStep(0)}
                    className="w-full sm:w-[110px] h-[44px] bg-white border border-[#063E46]/30 hover:bg-[#F4FAF8] text-[#063E46] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setOnboardingStep(2)}
                    className="flex-1 h-[44px] bg-gradient-to-r from-[#063E46] to-[#109A9B] hover:from-[#075D63] hover:to-[#0D8788] text-[#FFF8E8] font-sora font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Next: Privacy Protection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* SECURITY GUARANTEE */}
                <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] font-medium text-[#063E46] font-inter">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#109A9B]" />
                  <span>Your progress is saved automatically</span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // ONBOARDING STEP 2: PRIVACY GUARANTEE
  if (onboardingStep === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[105px] sm:pt-[150px] pb-12 px-3 sm:px-4 bg-[#FAF7F0]">
        <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#109A9B]/20 shadow-2xl relative overflow-hidden">
          <div className="space-y-5 sm:space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-[#10242C]">
                Your Privacy Protection
              </h2>
            </div>

            <div className="bg-[#EAF6F6] p-5 rounded-2xl border border-[#109A9B]/20 text-[#10242C] text-xs sm:text-sm leading-relaxed space-y-2 font-medium">
              <p className="font-bold text-[#075D63]">🔒 Research Anonymity Guarantee</p>
              <p className="text-[#53656A]">
                Your responses are processed anonymously. Identity data is kept strictly decoupled from research datasets.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-[#10242C]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Responses are aggregated into statistical index metrics.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>No personal contact details are published or sold to third parties.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Unique certificate cryptographic hash proves authentic submission without revealing name.</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => setOnboardingStep(1)}
                className="w-1/3 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-[#10242C] font-bold text-sm rounded-2xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setOnboardingStep(2.5)}
                className="flex-1 py-3 px-4 bg-[#109A9B] hover:bg-[#0E8586] text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>I Understand, Next: Enter Name</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ONBOARDING STEP 2.5: PARTICIPANT NAME & EMAIL ENTRY (Persists immediately to Supabase DB)
  if (onboardingStep === 2.5 || (onboardingStep === 3 && !participantName)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[150px] sm:pt-[160px] pb-12 px-4 bg-[#FAF7F0]">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#109A9B]/20 shadow-2xl relative overflow-hidden">
          
          <form onSubmit={handleSaveNameAndStart} className="space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#109A9B]/15 text-[#109A9B] flex items-center justify-center mx-auto mb-3 border border-[#109A9B]/30">
                <UserCheck className="w-7 h-7 text-[#075D63]" />
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#10242C]">
                Your Details
              </h2>
              <p className="text-[#53656A] text-xs sm:text-sm mt-1 font-medium">
                Enter your details to personalize your research record. Entering a previously used email will automatically restore your saved answers so you can continue.
              </p>
            </div>

            {/* FULL NAME INPUT */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E46]">
                Full Name or Preferred Name *
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-[#109A9B] focus:ring-4 focus:ring-[#109A9B]/15 outline-none font-bold text-base text-[#10242C] transition-all"
                autoFocus
              />
            </div>

            {/* EMAIL INPUT (Directly under Name) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E46]">
                Email Address (Optional - To Save & Continue Progress)
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. alex@example.com"
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-[#109A9B] focus:ring-4 focus:ring-[#109A9B]/15 outline-none font-medium text-base text-[#10242C] transition-all"
              />
              <p className="text-[11px] text-[#53656A] font-medium pl-1">
                If your email is already registered, we'll restore your previous answers so you can continue where you left off.
              </p>
            </div>

            <div className="bg-[#EAF6F6] p-3.5 rounded-2xl border border-[#109A9B]/20 text-xs text-[#075D63] flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4.5 h-4.5 text-[#109A9B] flex-shrink-0" />
              <span>Your details and answers are saved directly to the Supabase database.</span>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setOnboardingStep(2)}
                className="w-1/3 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#10242C] font-bold text-sm rounded-2xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!nameInput.trim() || isSavingName}
                className="flex-1 py-3.5 px-4 bg-[#063E46] hover:bg-[#075D63] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSavingName ? (
                  <span>Checking & Loading...</span>
                ) : (
                  <>
                    <span>Continue to Survey</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // ACTIVE 207-QUESTION SURVEY EXPERIENCE (Step 3: Master Prompt Implementation)
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAF7F0] flex flex-col justify-between pt-[100px] sm:pt-[135px] md:pt-[155px] pb-12">

      {/* ==================================================== */}
      {/* OVERALL PAGE BACKGROUND — MASTER PROMPT DECORATIONS */}
      {/* ==================================================== */}

      {/* UPPER ATMOSPHERIC TEAL SECTION WITH GRADIENT TRANSITIONS */}
      <div className="absolute top-0 left-0 right-0 h-[520px] bg-gradient-to-b from-[#109A9B] via-[#0D8788] to-[#075D63] z-0 overflow-hidden">
        {/* Radial Glow Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.18),transparent_65%)]" />
      </div>

      {/* 1. TOP LEFT OVERSIZED TEAL ORGANIC BLOB */}
      <div className="absolute -top-24 -left-28 w-[500px] h-[500px] bg-[#075D63]/40 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-[380px] h-[380px] bg-[#109A9B]/30 rounded-br-[220px] blur-2xl pointer-events-none z-0" />

      {/* 2. TOP RIGHT DEEP TEAL ORGANIC WAVE SECTION */}
      <div className="absolute top-0 right-0 w-[550px] h-[400px] bg-gradient-to-bl from-[#063E46]/50 via-[#075D63]/30 to-transparent rounded-bl-[260px] blur-xl pointer-events-none z-0" />

      {/* 3. CENTER DIAGONAL ORGANIC SVG WAVE BOUNDARY (Separating upper teal from lower pale cream) */}
      <div className="absolute top-[440px] left-0 right-0 z-0 pointer-events-none">
        <svg className="w-full h-36 text-[#FAF7F0] fill-current preserve-3d" viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path d="M0,64L120,74.7C240,85,480,107,720,101.3C960,96,1200,64,1320,48L1440,32L1440,180L1320,180C1200,180,960,180,720,180C480,180,240,180,120,180L0,180Z" />
        </svg>
      </div>

      {/* 4. BOTTOM LEFT OVERSIZED ORGANIC CIRCULAR TEAL SHAPE (Behind Student Portrait) */}
      <div className="absolute bottom-0 -left-20 w-[520px] h-[520px] rounded-full bg-[#109A9B]/15 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[280px] left-8 w-[360px] h-[360px] rounded-full bg-[#FFF8E8]/60 blur-2xl pointer-events-none z-0" />

      {/* 5. BOTTOM RIGHT LARGE TEAL ORGANIC BLOB & CREAM WAVE */}
      <div className="absolute -bottom-20 -right-20 w-[480px] h-[480px] bg-gradient-to-tl from-[#109A9B]/25 via-[#075D63]/15 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-12 right-0 w-[380px] h-[260px] bg-[#FDE7B5]/40 rounded-tl-[180px] blur-2xl pointer-events-none z-0" />

      {/* 6. SUBTLE DECORATIVE ABSTRACT ELEMENTS (Dotted grids, stars & sparkles) */}
      {/* Top Left 4x4 Dotted Matrix Grid */}
      <svg className="absolute top-20 left-8 w-24 h-24 text-white/30 z-10 hidden lg:block pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="20" cy="20" r="3" /><circle cx="50" cy="20" r="3" /><circle cx="80" cy="20" r="3" />
        <circle cx="20" cy="50" r="3" /><circle cx="50" cy="50" r="3" /><circle cx="80" cy="50" r="3" />
        <circle cx="20" cy="80" r="3" /><circle cx="50" cy="80" r="3" /><circle cx="80" cy="80" r="3" />
      </svg>

      {/* Top Right 4x4 Dotted Matrix Grid */}
      <svg className="absolute top-24 right-10 w-24 h-24 text-white/30 z-10 hidden xl:block pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="20" cy="20" r="3" /><circle cx="50" cy="20" r="3" /><circle cx="80" cy="20" r="3" />
        <circle cx="20" cy="50" r="3" /><circle cx="50" cy="50" r="3" /><circle cx="80" cy="50" r="3" />
        <circle cx="20" cy="80" r="3" /><circle cx="50" cy="80" r="3" /><circle cx="80" cy="80" r="3" />
      </svg>

      {/* Bottom Right Dotted Grid */}
      <svg className="absolute bottom-24 right-12 w-20 h-20 text-[#063E46]/20 z-10 hidden xl:block pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="20" cy="20" r="2.5" /><circle cx="50" cy="20" r="2.5" /><circle cx="80" cy="20" r="2.5" />
        <circle cx="20" cy="50" r="2.5" /><circle cx="50" cy="50" r="2.5" /><circle cx="80" cy="50" r="2.5" />
        <circle cx="20" cy="80" r="2.5" /><circle cx="50" cy="80" r="2.5" /><circle cx="80" cy="80" r="2.5" />
      </svg>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">



        {/* ==================================================== */}
        {/* 3-COLUMN MAIN CONTENT GRID (LEFT / CENTER / RIGHT) */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">

          {/* ==================================================== */}
          {/* LEFT SIDE VISUAL AREA (Doodle + Student + Quote Card) */}
          {/* ==================================================== */}
          <div className="hidden lg:flex lg:col-span-4 flex-col items-center relative pr-4 lg:pr-8">

            {/* Handwritten Doodle: "Small Answers Big Changes" */}
            <div className="absolute -top-14 -left-2 z-20 pointer-events-none">
              <div className="font-handwritten text-2xl sm:text-3xl font-extrabold text-[#063E46] rotate-[-8deg] leading-tight drop-shadow-xs">
                Small <br /> Answers <br /> Big Changes
              </div>
              <div className="space-y-0.5 mt-1">
                <svg className="w-14 h-3 text-[#063E46]" viewBox="0 0 40 10" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M 3 5 Q 20 9 37 3" />
                </svg>
              </div>
            </div>

            {/* Gen-Z Student Portrait Cutout */}
            <div className="relative z-10 pt-1">
              <img
                src="/GenZ-removebg-preview.png"
                onError={(e) => { e.currentTarget.src = "/GenZ.png"; }}
                alt="Gen Z Student Visual"
                className="w-full max-w-[530px] h-auto object-cover filter drop-shadow-2xl transform scale-[1.22] hover:scale-[1.26] transition-transform duration-300 origin-bottom"
              />
            </div>

            {/* Floating Quote Card at Bottom Left */}
            <div className="mt-4 bg-[#EAF6F6]/95 backdrop-blur-xs border border-[#109A9B]/30 rounded-2xl p-4 shadow-md max-w-[250px] text-left relative z-20 transform rotate-[-2deg]">
              <span className="text-3xl leading-none text-[#109A9B] font-serif font-bold block mb-1">“</span>
              <p className="text-xs font-semibold text-[#063E46] leading-snug">
                Your perspective today builds a brighter tomorrow.
              </p>
            </div>

          </div>

          {/* ==================================================== */}
          {/* CENTER COLUMN: MAIN SURVEY QUESTIONNAIRE CARD */}
          {/* ==================================================== */}
          <div className="col-span-1 lg:col-span-7 max-w-[580px] w-full mx-auto">
            <div className="bg-[#FFF8E8] rounded-[28px] p-6 sm:p-7 border border-white/70 shadow-[0px_20px_50px_rgba(6,62,70,0.15)] relative z-20 transition-all min-h-[520px] flex flex-col justify-between">

              <div>
                {/* Header Topic Badge, Participant & Response Counts */}
                <div className="flex flex-col gap-2.5 mb-4 pb-3.5 border-b border-slate-200/80 font-inter">

                  {/* Top Row: Topic Badge & Participant Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#53656A]">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6F6] text-[#075D63] font-bold text-xs border border-[#109A9B]/30">
                        <UserCheck className="w-3.5 h-3.5 text-[#109A9B]" />
                        <span>{currentQuestion?.topic || 'Respondent & Educational Profile'}</span>
                      </div>
                      {participantName && (
                        <span className="text-[11px] font-bold text-[#075D63] bg-[#109A9B]/10 px-2.5 py-0.5 rounded-full border border-[#109A9B]/20">
                          Participant: {participantName}
                        </span>
                      )}
                    </div>

                    {/* Question Progress Pill */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#53656A] font-medium text-xs">Question {currentQuestionIndex + 1} of {questions.length}</span>
                      <span className="bg-[#FFF8E8] text-[#10242C] px-2.5 py-0.5 rounded-full font-mono text-xs border border-[#075D63]/20 font-bold shadow-2xs">
                        Q{currentQuestionIndex + 1}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Answered & Skipped Counters with Interactive Skipped Redirect Button */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 text-xs font-sora font-extrabold shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{answeredCount} Answered</span>
                    </div>

                    <button
                      type="button"
                      onClick={jumpToNextSkippedQuestion}
                      disabled={skippedCount === 0}
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-xs font-sora font-extrabold shadow-2xs transition-all ${
                        skippedCount > 0
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 cursor-pointer hover:scale-105 active:scale-95'
                          : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                      }`}
                      title={skippedCount > 0 ? "Click to jump to your next skipped question!" : "No skipped questions"}
                    >
                      <SkipForward className={`w-3.5 h-3.5 ${skippedCount > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span>{skippedCount} Skipped</span>
                      {skippedCount > 0 && (
                        <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-1.5 py-0.2 rounded-md ml-0.5">
                          Jump ↵
                        </span>
                      )}
                    </button>
                  </div>

                </div>

                {/* Question Text */}
                <h2 className="font-sora font-extrabold text-xl sm:text-2xl text-[#10242C] mb-1.5 leading-snug tracking-tight">
                  Q{currentQuestionIndex + 1}. {currentQuestion?.text?.replace(/^Q\d+\.\s*/, '')}
                </h2>

                {/* Guidance Subtitle */}
                <p className="text-[#53656A] font-inter text-xs font-medium mb-4 leading-relaxed">
                  Help us understand your perspective so we can better represent Gen Z perspectives.
                </p>

                {/* Interactive Answer Options Stack */}
                <div className="space-y-2.5 mb-5 font-inter">
                  {currentQuestion?.options?.map((opt, idx) => {
                    const isSelected = selectedAnswer === opt.value;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(opt.value)}
                        className={`w-full text-left py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer ${isSelected
                            ? 'border-[#075D63] bg-[#EAF6F6] shadow-2xs font-bold'
                            : 'border-slate-200 hover:border-[#109A9B]/60 bg-white hover:bg-[#EAF6F6]/40 font-medium'
                          }`}
                      >
                        <span className={`text-sm sm:text-base ${isSelected ? 'text-[#075D63] font-extrabold' : 'text-[#10242C]'}`}>
                          {opt.label}
                        </span>

                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-3 ${isSelected ? 'border-[#075D63] bg-[#075D63] text-[#FFF8E8]' : 'border-slate-300'
                          }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions Container (Properly Enclosed inside Card Grid) */}
              <div className="w-full flex items-center justify-between gap-2.5 pt-4 border-t border-slate-200/80 mt-2 font-inter">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="bg-white border border-[#063E46]/40 text-[#063E46] hover:bg-[#FFF8E8] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all disabled:opacity-30 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="flex-1 bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-sora font-bold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all group cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishSurvey}
                    className="flex-1 bg-[#109A9B] hover:bg-[#075D63] text-white font-sora font-bold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Complete Survey 🏆</span>
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

