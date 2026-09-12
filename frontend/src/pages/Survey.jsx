import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSurveyStore } from '../stores/surveyStore';
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
  RotateCcw,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
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

  // Smooth Card Moving Animation State
  const [cardAnimClass, setCardAnimClass] = useState('translate-x-0 opacity-100 scale-100');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLogoutSession = () => {
    if (logoutParticipant) logoutParticipant();
    else if (resetSession) resetSession();
    setNameInput('');
    setEmailInput('');
    setOnboardingStep(2.5);
  };

  const hasRegistered = Boolean(participantName && participantEmail);
  const hasSavedState = Boolean(hasRegistered && Object.keys(answersById).length > 0);

  // Onboarding Step State (0 = Welcome Screen, 1 = 4-Chapter Roadmap, 2 = Privacy Guarantee, 2.5 = Name Entry, 3 = Active 75-Q Survey)
  const [onboardingStep, setOnboardingStep] = useState(hasRegistered ? 3 : 0);

  const [nameInput, setNameInput] = useState(participantName || '');
  const [emailInput, setEmailInput] = useState(participantEmail || '');
  const [emailError, setEmailError] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [expandedSectionId, setExpandedSectionId] = useState(null);
  const [isMobileSectionsOpen, setIsMobileSectionsOpen] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const currentSection = sections[currentSectionIndex] || sections[0];
  const progressPercentage = getProgressPercentage();
  const selectedAnswer = answersById[currentQuestion?.id];

  const unansweredCount = questions.filter(q => !answersById[q.id] || answersById[q.id] === 'skipped').length;
  const isAllAnswered = unansweredCount === 0;

  const [maxVisitedIndex, setMaxVisitedIndex] = useState(currentQuestionIndex);

  useEffect(() => {
    if (currentQuestionIndex > maxVisitedIndex) {
      setMaxVisitedIndex(currentQuestionIndex);
    }
  }, [currentQuestionIndex, maxVisitedIndex]);

  // Answered Count: Any question with a recorded answer
  const answeredCount = questions.filter(q => Boolean(answersById[q.id] && answersById[q.id] !== 'skipped')).length;

  // 1. RESUME CHECKPOINT: First unanswered question in overall survey order (where participant stopped responding)
  const firstUnansweredIndex = questions.findIndex(
    q => !answersById[q.id] || answersById[q.id] === 'skipped'
  );
  const resumeQuestionIndex = firstUnansweredIndex !== -1 ? firstUnansweredIndex : questions.length - 1;
  const isReviewingEarlierQuestion = currentQuestionIndex !== resumeQuestionIndex;

  const jumpToResumeQuestion = () => {
    if (jumpToQuestion) {
      jumpToQuestion(resumeQuestionIndex);
    }
  };

  // 2. SKIPPED QUESTIONS: Questions visited so far (up to highest reached index) that were left unanswered
  const maxReached = Math.max(currentQuestionIndex, maxVisitedIndex);
  const skippedIndices = [];
  for (let i = 0; i < maxReached; i++) {
    if (!answersById[questions[i]?.id] || answersById[questions[i]?.id] === 'skipped') {
      skippedIndices.push(i);
    }
  }
  const skippedCount = skippedIndices.length;
  const nextSkippedIndex = skippedIndices.find(idx => idx > currentQuestionIndex) ?? skippedIndices[0];
  const nextSkippedNumber = nextSkippedIndex !== undefined ? nextSkippedIndex + 1 : null;

  // Redirect / Jump to Next Skipped Question Handler
  const jumpToNextSkippedQuestion = () => {
    if (skippedIndices.length === 0) return;
    if (nextSkippedIndex !== undefined && jumpToQuestion) {
      jumpToQuestion(nextSkippedIndex);
    }
  };

  // Smooth Fast Card Moving Transition Handler (Next Question)
  const handleNextQuestionWithAnim = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // 1. Fast card exit animation (100ms)
    setCardAnimClass('-translate-x-10 opacity-0 scale-95 transition-all duration-100 ease-in');

    setTimeout(() => {
      // 2. Reset position to right (offscreen) and call store nextQuestion action
      setCardAnimClass('translate-x-10 opacity-0 scale-95 duration-0');
      nextQuestion();

      // 3. Fast spring slide-in to center (120ms)
      setTimeout(() => {
        setCardAnimClass('translate-x-0 opacity-100 scale-100 transition-all duration-120 ease-out');
        setIsTransitioning(false);
      }, 20);
    }, 100);
  };

  // Smooth Fast Card Moving Transition Handler (Previous Question)
  const handlePrevQuestionWithAnim = () => {
    if (isTransitioning || currentQuestionIndex === 0) return;
    setIsTransitioning(true);

    setCardAnimClass('translate-x-10 opacity-0 scale-95 transition-all duration-100 ease-in');

    setTimeout(() => {
      setCardAnimClass('-translate-x-10 opacity-0 scale-95 duration-0');
      prevQuestion();

      setTimeout(() => {
        setCardAnimClass('translate-x-0 opacity-100 scale-100 transition-all duration-120 ease-out');
        setIsTransitioning(false);
      }, 20);
    }, 100);
  };

  // Auto-switch to active survey experience ONLY if participant has completed registration (name & email)
  useEffect(() => {
    if (hasRegistered && onboardingStep < 3) {
      setOnboardingStep(3);
    } else if (!hasRegistered && onboardingStep === 3) {
      setOnboardingStep(2.5);
    }
  }, [hasRegistered, onboardingStep]);

  // Sync Name/Email Input if store updates
  useEffect(() => {
    if (participantName && !nameInput) {
      setNameInput(participantName);
    }
    if (participantEmail && !emailInput) {
      setEmailInput(participantEmail);
    }
  }, [participantName, participantEmail]);

  // Lock html and body scrolling completely on desktop screens
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.body.style.overscrollBehavior = 'none';

    const preventOuterScroll = (e) => {
      if (e.target.closest('.overflow-y-auto')) return;
      if (['Space', 'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown'].includes(e.code) || e.type === 'touchmove' || e.type === 'wheel') {
        e.preventDefault();
      }
    };

    window.addEventListener('touchmove', preventOuterScroll, { passive: false });
    window.addEventListener('wheel', preventOuterScroll, { passive: false });
    window.addEventListener('keydown', preventOuterScroll, { passive: false });

    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.overscrollBehavior = '';

      window.removeEventListener('touchmove', preventOuterScroll);
      window.removeEventListener('wheel', preventOuterScroll);
      window.removeEventListener('keydown', preventOuterScroll);
    };
  }, []);

  // Auto-scroll smooth to top whenever question or step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex, onboardingStep]);

  const handleSaveNameAndStart = async (e) => {
    if (e) e.preventDefault();
    if (!nameInput.trim()) {
      setEmailError('Please enter your full name!');
      return;
    }
    if (!emailInput.trim()) {
      setEmailError('Please enter a valid email address!');
      return;
    }
    setEmailError('');
    setIsSavingName(true);
    const res = await setParticipantDetails(nameInput.trim(), emailInput.trim());
    setIsSavingName(false);

    if (res?.error) {
      setEmailError(res.error);
      return;
    }

    setOnboardingStep(3);
  };

  const handleOptionSelect = (val) => {
    if (!currentQuestion || isTransitioning) return;

    const isMulti = Boolean(currentQuestion?.isMultiSelect || currentQuestion?.selectionType === 'multiple');

    if (isMulti) {
      // Multi-Select Option Toggle
      let currentList = [];
      const rawAns = answersById[currentQuestion.id];
      if (Array.isArray(rawAns)) {
        currentList = [...rawAns];
      } else if (typeof rawAns === 'string' && rawAns.startsWith('[')) {
        try { currentList = JSON.parse(rawAns); } catch (e) { }
      } else if (typeof rawAns === 'string' && rawAns) {
        currentList = rawAns.split(',').map((s) => s.trim()).filter(Boolean);
      }

      if (currentList.includes(val)) {
        currentList = currentList.filter((item) => item !== val);
      } else {
        currentList.push(val);
      }

      setAnswer(currentQuestion.id, currentList).catch((err) => console.warn('Background answer sync error:', err));
      // Multi-select does NOT auto advance. User clicks "Next Question" button after selecting!
    } else {
      // Single Select: Save answer and immediately advance to next question
      setAnswer(currentQuestion.id, val).catch((err) => console.warn('Background answer sync error:', err));
      if (currentQuestionIndex < questions.length - 1) {
        handleNextQuestionWithAnim();
      }
    }
  };

  const handleFinishSurvey = () => {
    const unansweredIdx = questions.findIndex(q => !answersById[q.id] || answersById[q.id] === 'skipped');
    if (unansweredIdx !== -1) {
      jumpToQuestion(unansweredIdx);
      setShowIncompleteModal(true);
      return;
    }
    navigate('/survey-complete');
  };

  // Dynamic Sizing & Layout calculations for options grid based on option count
  const optionCount = currentQuestion?.options?.length || 0;
  const isMultiColumn = optionCount >= 4;
  const isManyOptions = optionCount >= 6;

  let optionsContainerClass = "font-inter mb-1.5 overflow-y-auto pr-1 flex-1 min-h-0 transition-all duration-200 custom-scrollbar ";
  if (isManyOptions) {
    optionsContainerClass += "grid grid-cols-2 gap-1.5 sm:gap-2 auto-rows-max";
  } else if (isMultiColumn) {
    optionsContainerClass += "grid grid-cols-2 gap-1.5 sm:gap-2.5 auto-rows-max";
  } else if (optionCount === 3) {
    optionsContainerClass += "grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2.5 auto-rows-max";
  } else {
    optionsContainerClass += "space-y-2.5";
  }

  let optionBtnPadding = "py-2.5 sm:py-3 px-3.5 sm:px-4.5";
  let optionTextSize = "text-xs sm:text-sm font-semibold";
  let optionMinHeight = "min-h-[44px] sm:min-h-[50px]";
  let optionIconSize = "w-5 h-5 sm:w-5.5 sm:h-5.5";
  let optionCheckIconSize = "w-3 h-3 sm:w-3.5 sm:h-3.5";

  if (isManyOptions) {
    optionBtnPadding = "py-1.5 sm:py-2 px-2 sm:px-3.5";
    optionTextSize = "text-[10px] sm:text-xs font-semibold";
    optionMinHeight = "min-h-[34px] sm:min-h-[38px]";
    optionIconSize = "w-4 h-4 sm:w-4.5 sm:h-4.5";
    optionCheckIconSize = "w-2.5 h-2.5 sm:w-3 sm:h-3";
  } else if (isMultiColumn) {
    optionBtnPadding = "py-1.5 sm:py-2.5 px-2.5 sm:px-4";
    optionTextSize = "text-[11px] sm:text-xs font-semibold";
    optionMinHeight = "min-h-[38px] sm:min-h-[44px]";
    optionIconSize = "w-4.5 h-4.5 sm:w-5 sm:h-5";
    optionCheckIconSize = "w-2.5 h-2.5 sm:w-3 sm:h-3";
  }

  // ONBOARDING STEP 0: MASTER PROMPT WELCOME EXPERIENCE
  if (onboardingStep === 0) {
    return (
      <div className="relative min-h-screen sm:fixed sm:inset-0 sm:h-screen sm:h-[100dvh] w-screen overflow-y-auto sm:overflow-hidden bg-[#FAF7F0] flex flex-col justify-center sm:justify-end pt-[72px] sm:pt-[96px] pb-4 sm:pb-6 touch-auto sm:touch-none overscroll-none select-none">

        {/* TOP TEAL 50% / BOTTOM CREAM 50% DUAL COLOR SPLIT BACKGROUND */}
        <div className="absolute top-0 left-0 right-0 h-[50vh] min-h-[300px] bg-gradient-to-b from-[#109A9B] to-[#075D63] z-0 overflow-hidden" />

        {/* PERFECT STRAIGHT HORIZONTAL SPLIT DIVIDER AT EXACT 50% HEIGHT */}
        <div className="absolute top-[50vh] left-0 right-0 h-[2px] bg-[#FAF7F0]/40 z-0 pointer-events-none" />

        {/* ORGANIC BACKGROUND SHAPES */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#109A9B]/20 blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[#075D63]/15 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.65),transparent_55%)] pointer-events-none z-0" />

        {/* DECORATIVE BACKGROUND ELEMENTS - POSITIONS IN TOP TEAL HALF */}
        <div className="absolute top-28 sm:top-32 left-[4%] lg:left-[8%] xl:left-[12%] text-white/90 z-10 pointer-events-none hidden sm:block">
          <div className="font-handwritten text-xl lg:text-2xl font-extrabold rotate-[-8deg] leading-tight text-[#FFF8E8] drop-shadow-xs">
            Your <br /> Voice <br /> Matters
          </div>
        </div>

        <div className="absolute top-28 sm:top-32 right-[4%] lg:right-[8%] xl:right-[12%] text-white/90 z-10 pointer-events-none hidden sm:block text-right">
          <div className="font-handwritten text-xl lg:text-2xl font-extrabold rotate-[8deg] leading-tight text-[#FFF8E8] drop-shadow-xs">
            Ideas Today <br /> Better Tomorrow
          </div>
        </div>

        {/* MAIN CONTAINER CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-10 pb-4 sm:pb-6 w-full flex-1 flex flex-col justify-center sm:justify-end">

          <div className="my-auto sm:mt-auto flex flex-col items-center">
            {/* CENTRAL WELCOME CARD */}
            <div className="max-w-[580px] lg:max-w-[620px] w-full mx-auto bg-[#FFFDF9] rounded-[20px] sm:rounded-[28px] p-4 sm:p-8 md:p-9 border border-white/80 shadow-[0px_20px_50px_rgba(6,62,70,0.15)] text-center relative z-20 transition-all duration-300">

              {/* Supported by NRI Institute Banner Pill */}
              <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#109A9B]/25 shadow-2xs hover:border-[#109A9B]/40 transition-all duration-300 mb-3 group cursor-default">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#109A9B] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#075D63]" />
                </span>

                <span className="font-sora font-extrabold text-[11px] sm:text-xs text-[#063E46] tracking-tight uppercase whitespace-nowrap">
                  GenZ Voices <span className="text-[#109A9B] font-bold capitalize">supported by</span>
                </span>

                <span className="h-3.5 sm:h-4 w-[1px] bg-[#063E46]/20 shrink-0" />

                <img
                  src="/nrilogo.png"
                  alt="NRI Institute Logo"
                  className="h-5 sm:h-6 w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Header Sparkles Icon Box */}
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#075D63] to-[#109A9B] text-[#FFF8E8] flex items-center justify-center mx-auto mb-2.5 sm:mb-4 shadow-md shadow-teal-900/15">
                <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 fill-[#FFF8E8]" />
              </div>

              {/* Main Heading */}
              <h1 className="font-heading font-extrabold text-xl sm:text-3xl md:text-[44px] leading-tight text-[#10242C] mb-1.5 sm:mb-3 tracking-tight">
                Hey, <span className="bg-gradient-to-r from-[#109A9B] to-[#075D63] bg-clip-text text-transparent">Gen Z</span>
              </h1>

              {/* Description */}
              <p className="text-[#53656A] text-xs sm:text-base leading-relaxed max-w-[480px] mx-auto mb-4 sm:mb-6 font-medium">
                Welcome to India's premier youth perspective research study. We have organized the <strong className="text-[#063E46] font-bold">75 questions</strong> into <strong className="text-[#063E46] font-bold">4 simple chapters</strong> so your journey feels fast, smooth, and engaging.
              </p>

              {/* Primary CTA Button */}
              <button
                onClick={() => setOnboardingStep(1)}
                className="w-full h-[44px] sm:h-[54px] bg-[#063E46] hover:bg-gradient-to-r hover:from-[#075D63] hover:to-[#109A9B] text-[#FFF8E8] font-heading font-bold text-xs sm:text-base rounded-xl sm:rounded-2xl shadow-lg shadow-teal-950/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-2.5 transform hover:-translate-y-[2px] active:translate-y-0 group cursor-pointer"
              >
                <span>Let's Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>

              {/* Security Guarantee Message */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5 sm:mt-3.5 text-[10px] sm:text-xs font-semibold text-[#063E46]">
                <Lock className="w-3.5 h-3.5 text-[#109A9B]" />
                <span>Your responses are 100% anonymous and secure</span>
              </div>

            </div>

            {/* SURVEY INFORMATION ROW - Symmetrical Width Alignment with Central Card */}
            <div className="mt-2.5 sm:mt-5 max-w-[580px] lg:max-w-[620px] w-full mx-auto bg-[#FFFDF9]/95 backdrop-blur-md rounded-[18px] sm:rounded-[22px] p-2.5 sm:p-4 border border-[#109A9B]/20 shadow-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-3 divide-y-0 sm:divide-y-0 md:divide-x divide-[#063E46]/15">

                <div className="flex items-center gap-1.5 sm:gap-2.5 p-1 justify-start sm:justify-center">
                  <div className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px] rounded-lg sm:rounded-xl bg-[#109A9B]/12 text-[#063E46] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#109A9B]" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-heading font-extrabold text-[#10242C] text-[11px] sm:text-sm leading-tight">10–12 Mins</span>
                    <span className="block text-[9px] sm:text-[11px] text-[#53656A] font-medium leading-tight truncate">Quick & engaging</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2.5 p-1 justify-start sm:justify-center">
                  <div className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px] rounded-lg sm:rounded-xl bg-[#109A9B]/12 text-[#063E46] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#109A9B]" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-heading font-extrabold text-[#10242C] text-[11px] sm:text-sm leading-tight">75 Questions</span>
                    <span className="block text-[9px] sm:text-[11px] text-[#53656A] font-medium leading-tight truncate">Across 4 chapters</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2.5 p-1 justify-start sm:justify-center">
                  <div className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px] rounded-lg sm:rounded-xl bg-[#109A9B]/12 text-[#063E46] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#109A9B]" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-heading font-extrabold text-[#10242C] text-[11px] sm:text-sm leading-tight">Your Privacy</span>
                    <span className="block text-[9px] sm:text-[11px] text-[#53656A] font-medium leading-tight truncate">100% Anonymous</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2.5 p-1 justify-start sm:justify-center">
                  <div className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px] rounded-lg sm:rounded-xl bg-[#109A9B]/12 text-[#063E46] flex items-center justify-center flex-shrink-0">
                    <Gift className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#109A9B]" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-heading font-extrabold text-[#10242C] text-[11px] sm:text-sm leading-tight">Rewards</span>
                    <span className="block text-[9px] sm:text-[11px] text-[#53656A] font-medium leading-tight truncate">Certificate & Draw</span>
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
      <div className="relative min-h-screen sm:fixed sm:inset-0 sm:h-screen sm:h-[100dvh] w-screen overflow-y-auto sm:overflow-hidden bg-[#FAF7F0] flex flex-col justify-center items-center pt-[72px] sm:pt-[90px] pb-6 px-3.5 sm:px-4 touch-auto sm:touch-none overscroll-none select-none">

        {/* TOP TEAL 50% / BOTTOM CREAM 50% DUAL COLOR SPLIT BACKGROUND */}
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#109A9B] to-[#075D63] z-0 overflow-hidden" />

        {/* PERFECT STRAIGHT HORIZONTAL SPLIT DIVIDER AT EXACT 50% HEIGHT */}
        <div className="absolute top-[50vh] left-0 right-0 h-[2px] bg-[#FAF7F0]/40 z-0 pointer-events-none" />

        {/* MAIN COMPOSITION CONTAINER */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center items-center">

          {/* CENTERED ROADMAP CARD CONTAINER */}
          <div className="flex justify-center items-center w-full my-auto">

            {/* CENTRAL ROADMAP CARD */}
            <div className="max-w-[500px] sm:max-w-[520px] w-full mx-auto font-jakarta">
              <div className="bg-[#FFFDF9] rounded-[22px] sm:rounded-[26px] p-4 sm:p-5 border border-white/80 shadow-[0px_20px_50px_rgba(6,62,70,0.14)] relative z-20">

                {/* Header Label & Title */}
                <div className="text-center sm:text-left mb-2.5 sm:mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#109A9B]/10 border border-[#109A9B]/20 text-[#075D63] font-inter font-bold text-[10px] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 text-[#109A9B] shrink-0" />
                    <span>4 Chapter Journey</span>
                  </span>
                  <h2 className="font-sora font-extrabold text-xl sm:text-2xl text-[#10242C] leading-tight tracking-tight">
                    Your 4-Section <span className="text-[#109A9B]">Roadmap</span>
                  </h2>
                  <p className="text-[#53656A] font-inter text-xs leading-normal mt-0.5 font-normal">
                    A guided journey to understand your world, your thoughts, and your vision for a brighter tomorrow.
                  </p>
                </div>

                {/* INTEGRATED KEY STATS BAR */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mb-2.5 py-1.5 px-2 rounded-xl bg-[#EAF6F6]/90 border border-[#109A9B]/20 font-inter">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#075D63] p-0.5">
                    <BarChart2 className="w-3.5 h-3.5 text-[#109A9B] flex-shrink-0" />
                    <span>75 Questions</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#075D63] p-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#109A9B] flex-shrink-0" />
                    <span>10–12 Mins</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#075D63] p-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#109A9B] flex-shrink-0" />
                    <span>100% Anonymous</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#075D63] p-0.5">
                    <Gift className="w-3.5 h-3.5 text-[#109A9B] flex-shrink-0" />
                    <span>Rewards</span>
                  </div>
                </div>

                {/* 4 STACKED INTERACTIVE SECTION CARDS */}
                <div className="space-y-1.5 sm:space-y-2 mb-3.5 font-inter">

                  {/* SECTION 01 */}
                  <div
                    onClick={() => setOnboardingStep(2)}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#F4FAF8] hover:bg-white border border-[#109A9B]/20 hover:border-[#109A9B] transition-all duration-200 shadow-2xs flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#109A9B] to-[#075D63] text-white font-sora font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                        01
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-sora font-extrabold text-[#10242C] text-[11px] sm:text-xs tracking-wide">
                          Personal & Well-being
                        </h4>
                        <p className="text-[10px] text-[#53656A] font-inter font-medium truncate">
                          Health • Routines • Entertainment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-1.5">
                      <span className="text-[10px] font-inter font-semibold text-[#075D63] bg-white px-2 py-0.5 rounded-full border border-[#109A9B]/20">Q1–30</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#10242C]" />
                    </div>
                  </div>

                  {/* SECTION 02 */}
                  <div
                    onClick={() => setOnboardingStep(2)}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#FFF8F0] hover:bg-white border border-amber-200/80 hover:border-amber-400 transition-all duration-200 shadow-2xs flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white font-sora font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                        02
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-sora font-extrabold text-[#10242C] text-[11px] sm:text-xs tracking-wide">
                          Relationships & Career
                        </h4>
                        <p className="text-[10px] text-[#53656A] font-inter font-medium truncate">
                          Family • Career • Future Aspirations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-1.5">
                      <span className="text-[10px] font-inter font-semibold text-amber-900 bg-white px-2 py-0.5 rounded-full border border-amber-200">Q31–49</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#10242C]" />
                    </div>
                  </div>

                  {/* SECTION 03 */}
                  <div
                    onClick={() => setOnboardingStep(2)}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#F6F4FA] hover:bg-white border border-purple-200/80 hover:border-purple-400 transition-all duration-200 shadow-2xs flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 text-white font-sora font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                        03
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-sora font-extrabold text-[#10242C] text-[11px] sm:text-xs tracking-wide">
                          Technology & Culture
                        </h4>
                        <p className="text-[10px] text-[#53656A] font-inter font-medium truncate">
                          AI • Civic Awareness • Beliefs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-1.5">
                      <span className="text-[10px] font-inter font-semibold text-purple-900 bg-white px-2 py-0.5 rounded-full border border-purple-200">Q50–66</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#10242C]" />
                    </div>
                  </div>

                  {/* SECTION 04 */}
                  <div
                    onClick={() => setOnboardingStep(2)}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#FAF4F5] hover:bg-white border border-rose-200/80 hover:border-rose-400 transition-all duration-200 shadow-2xs flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 text-white font-sora font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                        04
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-sora font-extrabold text-[#10242C] text-[11px] sm:text-xs tracking-wide">
                          College Experience
                        </h4>
                        <p className="text-[10px] text-[#53656A] font-inter font-medium truncate">
                          Campus • Facilities • Teacher Relations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-1.5">
                      <span className="text-[10px] font-inter font-semibold text-rose-900 bg-white px-2 py-0.5 rounded-full border border-rose-200">Q67–75</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#10242C]" />
                    </div>
                  </div>

                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="flex flex-row items-center gap-2 sm:gap-3 font-inter">
                  <button
                    onClick={() => setOnboardingStep(0)}
                    className="px-3.5 sm:px-4 min-h-[38px] sm:min-h-[42px] bg-white border border-[#063E46]/30 hover:bg-[#F4FAF8] text-[#063E46] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setOnboardingStep(2)}
                    className="flex-1 min-h-[38px] sm:min-h-[42px] px-3 sm:px-4 bg-gradient-to-r from-[#063E46] to-[#109A9B] hover:from-[#075D63] hover:to-[#0D8788] text-[#FFF8E8] font-sora font-bold text-xs sm:text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 group cursor-pointer"
                  >
                    <span className="truncate">Next: Privacy Protection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                </div>

                {/* SECURITY GUARANTEE */}
                <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] sm:text-[11px] font-medium text-[#063E46] font-inter">
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
      <div className="relative min-h-screen sm:fixed sm:inset-0 sm:h-screen sm:h-[100dvh] w-screen overflow-y-auto flex items-center justify-center pt-[72px] sm:pt-[90px] pb-6 px-3.5 sm:px-4 bg-[#FAF7F0] touch-auto sm:touch-none overscroll-none select-none">

        {/* TOP TEAL 50% / BOTTOM CREAM 50% DUAL COLOR SPLIT BACKGROUND */}
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#109A9B] to-[#075D63] z-0 overflow-hidden" />

        {/* PERFECT STRAIGHT HORIZONTAL SPLIT DIVIDER AT EXACT 50% HEIGHT */}
        <div className="absolute top-[50vh] left-0 right-0 h-[2px] bg-[#FAF7F0]/40 z-0 pointer-events-none" />

        <div className="max-w-xl w-full bg-white rounded-3xl p-5 sm:p-8 border border-[#109A9B]/20 shadow-2xl relative z-20 overflow-hidden my-auto">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#10242C]">
                Your Privacy Protection
              </h2>
            </div>

            <div className="bg-[#EAF6F6] p-4 sm:p-5 rounded-2xl border border-[#109A9B]/20 text-[#10242C] text-xs sm:text-sm leading-relaxed space-y-1.5 sm:space-y-2 font-medium">
              <p className="font-bold text-[#075D63] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#075D63] shrink-0" />
                <span>Research Anonymity Guarantee</span>
              </p>
              <p className="text-[#53656A]">
                Your responses are processed anonymously. Identity data is kept strictly decoupled from research datasets.
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 text-xs text-[#10242C]">
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

            <div className="pt-2 flex gap-2.5 sm:gap-3">
              <button
                onClick={() => setOnboardingStep(1)}
                className="px-4 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 text-[#10242C] font-bold text-xs sm:text-sm rounded-2xl transition-colors cursor-pointer shrink-0"
              >
                Back
              </button>
              <button
                onClick={() => setOnboardingStep(2.5)}
                className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-[#109A9B] hover:bg-[#0E8586] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-teal-900/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <span className="truncate">I Understand, Next: Enter Details</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
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
      <div className="relative min-h-screen sm:fixed sm:inset-0 sm:h-screen sm:h-[100dvh] w-screen overflow-y-auto flex items-center justify-center pt-[72px] sm:pt-[90px] pb-6 px-3.5 sm:px-4 bg-[#FAF7F0] touch-auto sm:touch-none overscroll-none select-none">

        {/* TOP TEAL 50% / BOTTOM CREAM 50% DUAL COLOR SPLIT BACKGROUND */}
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#109A9B] to-[#075D63] z-0 overflow-hidden" />

        {/* PERFECT STRAIGHT HORIZONTAL SPLIT DIVIDER AT EXACT 50% HEIGHT */}
        <div className="absolute top-[50vh] left-0 right-0 h-[2px] bg-[#FAF7F0]/40 z-0 pointer-events-none" />

        <div className="max-w-xl w-full bg-white rounded-3xl p-5 sm:p-8 border border-[#109A9B]/20 shadow-2xl relative z-20 overflow-hidden my-auto">

          <form onSubmit={handleSaveNameAndStart} className="space-y-3.5 sm:space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#109A9B]/15 text-[#109A9B] flex items-center justify-center mx-auto mb-2 sm:mb-3 border border-[#109A9B]/30">
                <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#075D63]" />
              </div>
              <h2 className="font-heading font-extrabold text-xl sm:text-3xl text-[#10242C]">
                Your Details
              </h2>
              <p className="text-[#53656A] text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium leading-normal">
                Enter your details to register and participate in the research study. Both Name and Email are required, and each email address must be unique.
              </p>
            </div>

            {/* FULL NAME INPUT */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#063E46]">
                Full Name or Preferred Name *
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl border-2 border-slate-200 focus:border-[#109A9B] focus:ring-4 focus:ring-[#109A9B]/15 outline-none font-bold text-sm sm:text-base text-[#10242C] transition-all"
                autoFocus
              />
            </div>

            {/* EMAIL INPUT (Directly under Name) */}
            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#063E46]">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setEmailError('');
                }}
                placeholder="e.g. alex@example.com"
                className={`w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl border-2 outline-none font-medium text-sm sm:text-base text-[#10242C] transition-all ${emailError
                  ? 'border-rose-500 bg-rose-50/40 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-[#109A9B] focus:ring-4 focus:ring-[#109A9B]/15'
                  }`}
              />
              {emailError ? (
                <p className="text-rose-600 font-sora font-extrabold text-xs sm:text-sm pl-1 flex items-center gap-1.5 mt-1 animate-bounce">
                  <span>⚠️ {emailError}</span>
                </p>
              ) : (
                <p className="text-[10px] sm:text-[11px] text-[#53656A] font-medium pl-1 leading-normal">
                  Each email can only create one user account.
                </p>
              )}
            </div>

            <div className="bg-[#EAF6F6] p-2.5 sm:p-3.5 rounded-2xl border border-[#109A9B]/20 text-[11px] sm:text-xs text-[#075D63] flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#109A9B] flex-shrink-0" />
              <span>Your details and answers are saved directly to the Supabase database.</span>
            </div>

            <div className="pt-1 sm:pt-2 flex gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setOnboardingStep(2)}
                className="w-1/3 py-2.5 sm:py-3.5 px-3 sm:px-4 bg-slate-100 hover:bg-slate-200 text-[#10242C] font-bold text-xs sm:text-sm rounded-2xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!nameInput.trim() || !emailInput.trim() || isSavingName}
                className="flex-1 py-2.5 sm:py-3.5 px-3 sm:px-4 bg-[#063E46] hover:bg-[#075D63] text-white font-bold text-xs sm:text-base rounded-2xl shadow-lg shadow-teal-900/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50"
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
    <div className="relative min-h-screen sm:fixed sm:inset-0 sm:h-screen sm:h-[100dvh] w-screen overflow-y-auto sm:overflow-hidden bg-[#FAF7F0] flex flex-col justify-center items-center pt-[64px] sm:pt-[96px] lg:pt-[110px] pb-4 sm:pb-8 touch-auto sm:touch-none overscroll-none select-none">

      {/* ==================================================== */}
      {/* OVERALL PAGE BACKGROUND — ORIGINAL TEAL ATMOSPHERIC GRADIENT */}
      {/* ==================================================== */}

      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-[#109A9B] to-[#075D63] z-0 overflow-hidden">
        {/* Radial Glow Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.18),transparent_65%)]" />
      </div>

      {/* 1. TOP LEFT OVERSIZED TEAL ORGANIC BLOB */}
      <div className="absolute -top-24 -left-28 w-[500px] h-[500px] bg-[#075D63]/40 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-[380px] h-[380px] bg-[#109A9B]/30 rounded-br-[220px] blur-2xl pointer-events-none z-0" />

      {/* 2. TOP RIGHT DEEP TEAL ORGANIC WAVE SECTION */}
      <div className="absolute top-0 right-0 w-[550px] h-[400px] bg-gradient-to-bl from-[#063E46]/50 via-[#075D63]/30 to-transparent rounded-bl-[260px] blur-xl pointer-events-none z-0" />

      {/* 3. PERFECT STRAIGHT HORIZONTAL SPLIT DIVIDER AT EXACT 50% HEIGHT */}
      <div className="absolute top-[50vh] left-0 right-0 h-[2px] bg-[#FAF7F0]/40 z-0 pointer-events-none" />

      {/* 4. BOTTOM LEFT ORGANIC SHAPE */}
      <div className="absolute bottom-0 -left-20 w-[520px] h-[520px] rounded-full bg-[#109A9B]/15 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[280px] left-8 w-[360px] h-[360px] rounded-full bg-[#FFF8E8]/60 blur-2xl pointer-events-none z-0" />

      {/* 5. BOTTOM RIGHT ORGANIC BLOB */}
      <div className="absolute -bottom-20 -right-20 w-[480px] h-[480px] bg-gradient-to-tl from-[#109A9B]/25 via-[#075D63]/15 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-12 right-0 w-[380px] h-[260px] bg-[#FDE7B5]/40 rounded-tl-[180px] blur-2xl pointer-events-none z-0" />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center my-auto py-2 sm:py-4">

        {/* 4-SECTION RECTANGULAR NAVIGATION BAR */}
        <div className="mb-3 sm:mb-5 w-full relative z-30 font-inter">
          {/* Backdrop overlay to close expanded dropdown when clicking outside */}
          {(expandedSectionId || isMobileSectionsOpen) && (
            <div
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-xs"
              onClick={() => {
                setExpandedSectionId(null);
                setIsMobileSectionsOpen(false);
              }}
            />
          )}

          {/* PAGE SECTION TITLES MAPPING */}
          {(() => {
            const PAGE_SECTION_TITLES = {
              1: 'Personal & Well-being',
              2: 'Relationships & Career',
              3: 'Technology & Culture',
              4: 'College Experience',
            };

            const activeSecObj = sections[currentSectionIndex] || sections[0];
            const activeSecQs = questions.slice(activeSecObj.startQuestionIndex, activeSecObj.endQuestionIndex + 1);
            const activeSecAnswered = activeSecQs.filter((q) => {
              const val = answersById[q.id];
              return val && val !== 'skipped' && (!Array.isArray(val) || val.length > 0);
            }).length;
            const activeSecPct = Math.round((activeSecAnswered / activeSecQs.length) * 100);
            const activeSecTitle = PAGE_SECTION_TITLES[activeSecObj.number] || activeSecObj.title?.replace(/^[^\w\s]+\s*/, '') || `Chapter ${activeSecObj.number}`;

            return (
              <>
                {/* 1. MOBILE & TABLET VIEW: COMPACT SECTION SELECTOR BUTTON (< lg) */}
                <div className="block lg:hidden w-full relative z-50 mb-1">
                  {/* Main Mobile Section Button */}
                  <div
                    onClick={() => setIsMobileSectionsOpen(!isMobileSectionsOpen)}
                    className="bg-[#FFFDF9] border-2 border-[#109A9B] rounded-2xl p-2.5 shadow-md flex items-center justify-between gap-2.5 cursor-pointer select-none relative z-50 transition-all duration-200 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Section Number Badge */}
                      <div className="w-7 h-7 rounded-xl font-heading font-extrabold text-xs bg-[#063E46] text-[#FFF8E8] flex items-center justify-center shrink-0 shadow-2xs">
                        {activeSecObj.number}
                      </div>

                      {/* Active Section Title & Stats */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-extrabold uppercase text-[#109A9B] tracking-wider font-sora">Section {activeSecObj.number} of 4</span>
                          <span className="w-1 h-1 rounded-full bg-[#109A9B]/40" />
                          <span className="text-[9.5px] font-bold text-[#53656A]">{activeSecObj.questionRange}</span>
                        </div>
                        <div className="font-heading font-extrabold text-xs text-[#10242C] truncate">
                          {activeSecTitle}
                        </div>
                      </div>
                    </div>

                    {/* Down Arrow Button */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 ${isMobileSectionsOpen ? 'bg-[#075D63] text-white shadow-xs rotate-180' : 'bg-[#EAF6F6] text-[#075D63] border border-[#109A9B]/20'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* EXPANDED DROPDOWN MENU WITH ALL 4 SECTIONS */}
                  {isMobileSectionsOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#EBF5F5] border border-[#109A9B]/30 rounded-2xl p-3 shadow-2xl z-50 space-y-2 animate-fade-in max-h-[75vh] overflow-y-auto">
                      <div className="flex items-center justify-between text-[10.5px] font-extrabold text-[#063E46] tracking-wider uppercase font-sora px-1 pb-1">
                        <span>ALL 4 SECTIONS:</span>
                        <span className="text-[#109A9B] capitalize font-bold">Tap section to switch</span>
                      </div>

                      <div className="space-y-2">
                        {sections.map((sec, secIdx) => {
                          const secQs = questions.slice(sec.startQuestionIndex, sec.endQuestionIndex + 1);
                          const isCurrentSec = currentSectionIndex === secIdx;
                          const isExpanded = expandedSectionId === sec.id;

                          const answeredInSec = secQs.filter((q) => {
                            const val = answersById[q.id];
                            if (!val || val === 'skipped') return false;
                            if (Array.isArray(val)) return val.length > 0;
                            return true;
                          }).length;

                          const secPct = Math.round((answeredInSec / secQs.length) * 100);
                          const cleanTitle = PAGE_SECTION_TITLES[sec.number] || sec.title?.replace(/^[^\w\s]+\s*/, '') || `Chapter ${sec.number}`;

                          return (
                            <div
                              key={sec.id}
                              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                                isCurrentSec
                                  ? 'bg-[#FFFDF9] border-[#109A9B] shadow-md ring-2 ring-[#109A9B]/30'
                                  : 'bg-[#FFFDF9]/90 border-[#109A9B]/20 hover:bg-[#FFFDF9]'
                              }`}
                            >
                              <div
                                onClick={() => {
                                  jumpToSection(secIdx);
                                  setIsMobileSectionsOpen(false);
                                }}
                                className="p-2.5 flex items-center justify-between gap-2 cursor-pointer select-none"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div
                                    className={`w-7 h-7 rounded-lg font-heading font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                                      isCurrentSec
                                        ? 'bg-[#063E46] text-[#FFF8E8]'
                                        : secPct === 100
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-[#EAF6F6] text-[#075D63] border border-[#109A9B]/20'
                                    }`}
                                  >
                                    {sec.number}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="block font-heading font-extrabold text-xs text-[#10242C] truncate">
                                      {cleanTitle}
                                    </span>
                                    <div className="flex items-center gap-1 mt-0.5 text-[9.5px] font-bold text-[#53656A]">
                                      <span>{sec.questionRange}</span>
                                      <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                      <span className={secPct === 100 ? 'text-emerald-700 font-extrabold' : 'text-[#075D63]'}>
                                        {answeredInSec}/{secQs.length} ({secPct}%)
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedSectionId(isExpanded ? null : sec.id);
                                  }}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                                    isExpanded
                                      ? 'bg-[#075D63] text-white shadow-xs rotate-180'
                                      : 'bg-slate-100/90 text-[#53656A] hover:bg-[#EAF6F6] hover:text-[#075D63]'
                                  }`}
                                  title={isExpanded ? "Collapse Questions" : "Expand Questions"}
                                >
                                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
                                </button>
                              </div>

                              {/* QUESTIONS POPUP GRID ON MOBILE */}
                              {isExpanded && (
                                <div className="p-3 bg-[#EBF5F5] border-t border-[#109A9B]/20 animate-fade-in space-y-2">
                                  <div className="flex items-center justify-between text-[10px] font-extrabold text-[#063E46] tracking-wider uppercase font-sora">
                                    <span>SELECT QUESTION:</span>
                                    <span>{sec.questionRange}</span>
                                  </div>
                                  <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                                    {secQs.map((q) => {
                                      const globalIdx = questions.findIndex((item) => item.id === q.id);
                                      const isCurrent = globalIdx === currentQuestionIndex;
                                      const rawAns = answersById[q.id];
                                      const isAnswered = Boolean(
                                        rawAns && rawAns !== 'skipped' && (!Array.isArray(rawAns) || rawAns.length > 0)
                                      );
                                      const qNum = globalIdx + 1;

                                      return (
                                        <button
                                          key={q.id}
                                          type="button"
                                          onClick={() => {
                                            jumpToQuestion(globalIdx);
                                            setExpandedSectionId(null);
                                            setIsMobileSectionsOpen(false);
                                          }}
                                          className={`w-7.5 h-7.5 rounded-full font-heading font-bold text-[10.5px] flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                                            isCurrent
                                              ? 'bg-[#1B4950] text-white ring-2 ring-[#1B4950]/30 shadow-md scale-105 z-10'
                                              : isAnswered
                                              ? 'bg-[#52B788] text-white font-extrabold shadow-2xs'
                                              : 'bg-white text-[#10242C] border border-[#CBD5E1] hover:border-[#109A9B] hover:bg-[#EAF6F6]'
                                          }`}
                                        >
                                          {qNum}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. DESKTOP VIEW: HORIZONTAL 4-CARD GRID (>= lg) */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-2.5 relative z-50">
                  {sections.map((sec, secIdx) => {
                    const secQs = questions.slice(sec.startQuestionIndex, sec.endQuestionIndex + 1);
                    const isCurrentSec = currentSectionIndex === secIdx;
                    const isExpanded = expandedSectionId === sec.id;

                    const answeredInSec = secQs.filter((q) => {
                      const val = answersById[q.id];
                      if (!val || val === 'skipped') return false;
                      if (Array.isArray(val)) return val.length > 0;
                      return true;
                    }).length;

                    const secPct = Math.round((answeredInSec / secQs.length) * 100);
                    const cleanTitle = PAGE_SECTION_TITLES[sec.number] || sec.title?.replace(/^[^\w\s]+\s*/, '') || `Chapter ${sec.number}`;

                    return (
                      <div
                        key={sec.id}
                        className={`rounded-2xl transition-all duration-300 border shadow-md relative ${isCurrentSec
                          ? 'bg-[#FFFDF9] border-[#109A9B] shadow-teal-900/10 ring-2 ring-[#109A9B]/30'
                          : 'bg-[#FFFDF9]/90 hover:bg-[#FFFDF9] border-[#109A9B]/20 hover:border-[#109A9B]/40'
                          }`}
                      >
                        {/* Section Rectangular Header Bar */}
                        <div
                          onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                          className="p-2.5 flex items-center justify-between gap-2 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {/* Section Number Badge */}
                            <div
                              className={`w-7 h-7 rounded-xl font-heading font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs ${isCurrentSec
                                ? 'bg-[#063E46] text-[#FFF8E8]'
                                : secPct === 100
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-[#EAF6F6] text-[#075D63] border border-[#109A9B]/20'
                                }`}
                            >
                              {sec.number}
                            </div>

                            {/* Title & Progress info */}
                            <div className="min-w-0 flex-1">
                              <span className="block font-heading font-extrabold text-xs text-[#10242C] whitespace-nowrap">
                                {cleanTitle}
                              </span>
                              <div className="flex items-center gap-1 mt-0.5 text-[10px] font-bold text-[#53656A] whitespace-nowrap">
                                <span>{sec.questionRange}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                <span className={secPct === 100 ? 'text-emerald-700 font-extrabold' : 'text-[#075D63]'}>
                                  {answeredInSec}/{secQs.length} ({secPct}%)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Side Down Arrow Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedSectionId(isExpanded ? null : sec.id);
                            }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${isExpanded
                              ? 'bg-[#075D63] text-white shadow-xs rotate-180'
                              : 'bg-slate-100/90 text-[#53656A] hover:bg-[#EAF6F6] hover:text-[#075D63]'
                              }`}
                            title={isExpanded ? "Collapse Section Questions" : "Expand Section Questions"}
                          >
                            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                          </button>
                        </div>

                        {/* ABSOLUTE OVERLAPPING FLOATING DROPDOWN CARD */}
                        {isExpanded && (
                          <div className={`absolute top-full mt-2 w-[340px] bg-[#EBF5F5] rounded-3xl p-5 border border-[#109A9B]/30 shadow-2xl z-50 animate-fade-in space-y-2.5 ${secIdx % 2 === 1 ? 'right-0' : 'left-0'}`}>
                            {/* Header: SELECT QUESTION: Q1 - Q30 */}
                            <div className="flex items-center justify-between text-[11px] font-extrabold text-[#063E46] tracking-wider uppercase font-sora">
                              <span>SELECT QUESTION:</span>
                              <span>{sec.questionRange}</span>
                            </div>

                            {/* 6-Column Number Circles Grid */}
                            <div className="grid grid-cols-6 gap-2 pt-1 max-h-60 overflow-y-auto pr-0.5">
                              {secQs.map((q) => {
                                const globalIdx = questions.findIndex((item) => item.id === q.id);
                                const isCurrent = globalIdx === currentQuestionIndex;
                                const rawAns = answersById[q.id];
                                const isAnswered = Boolean(
                                  rawAns &&
                                  rawAns !== 'skipped' &&
                                  (!Array.isArray(rawAns) || rawAns.length > 0)
                                );
                                const qNum = globalIdx + 1;

                                return (
                                  <button
                                    key={q.id}
                                    type="button"
                                    onClick={() => {
                                      jumpToQuestion(globalIdx);
                                      setExpandedSectionId(null);
                                    }}
                                    className={`w-9 h-9 rounded-full font-heading font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-90 ${isCurrent
                                      ? 'bg-[#1B4950] text-white ring-4 ring-[#1B4950]/30 shadow-md scale-105 z-10'
                                      : isAnswered
                                        ? 'bg-[#52B788] text-white font-extrabold shadow-2xs'
                                        : 'bg-white text-[#10242C] border border-[#CBD5E1] hover:border-[#109A9B] hover:bg-[#EAF6F6]'
                                      }`}
                                    title={`Jump to Q${qNum}: ${q.text?.substring(0, 40)}...`}
                                  >
                                    {qNum}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>

        {/* 3-COLUMN MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">

          {/* LEFT SIDE VISUAL AREA */}
          <div className="hidden lg:flex lg:col-span-4 flex-col items-center relative pr-4 lg:pr-8">
            <div className="absolute -top-14 -left-2 z-20 pointer-events-none">
              <div className="font-handwritten text-2xl sm:text-3xl font-extrabold text-white rotate-[-8deg] leading-tight drop-shadow-md">
                Small <br /> Answers <br /> Big Changes
              </div>
              <div className="space-y-0.5 mt-1">
                <svg className="w-14 h-3 text-white" viewBox="0 0 40 10" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M 3 5 Q 20 9 37 3" />
                </svg>
              </div>
            </div>

            <div className="relative z-10 pt-1">
              <img
                src="/GenZ-removebg-preview.png"
                onError={(e) => { e.currentTarget.src = "/GenZ.png"; }}
                alt="Gen Z Student Visual"
                className="w-full max-w-[460px] lg:max-w-[490px] max-h-[calc(100vh-220px)] object-contain filter drop-shadow-2xl transition-transform duration-300 origin-bottom"
              />
            </div>

            <div className="mt-4 bg-[#EAF6F6]/95 backdrop-blur-xs border border-[#109A9B]/30 rounded-2xl p-4 shadow-md max-w-[250px] text-left relative z-20 transform rotate-[-2deg]">
              <span className="text-3xl leading-none text-[#109A9B] font-serif font-bold block mb-1">“</span>
              <p className="text-xs font-semibold text-[#063E46] leading-snug">
                Your perspective today builds a brighter tomorrow.
              </p>
            </div>
          </div>

          {/* CENTER COLUMN: MAIN SURVEY QUESTIONNAIRE CARD WITH CARD ANIMATION */}
          <div className="col-span-1 lg:col-span-7 max-w-[580px] w-full mx-auto">
            <div className={`bg-[#FFF8E8] rounded-2xl sm:rounded-[28px] p-3.5 sm:p-6 md:p-7 border border-white/70 shadow-[0px_20px_50px_rgba(6,62,70,0.15)] relative z-20 transition-all duration-300 min-h-[440px] sm:h-[490px] lg:h-[510px] max-h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden ${cardAnimClass}`}>

              <div className="flex-1 flex flex-col justify-start min-h-0">
                {/* Header Participant & Response Progress Bar */}
                <div className="flex flex-col gap-1.5 mb-2 pb-2 border-b border-slate-200/80 font-inter flex-shrink-0">

                  {/* Top Row: Participant & Progress Indicator */}
                  <div className="flex items-center justify-between gap-1.5 text-xs font-semibold flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-1.5 min-w-0 max-w-[65%] sm:max-w-none">
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#075D63] bg-[#109A9B]/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-[#109A9B]/20 truncate inline-block whitespace-nowrap">
                        Participant: {participantName || 'Gen Z Study'}
                      </span>

                      {/* Resume Progress Action Button (only shown when reviewing earlier question) */}
                      {isReviewingEarlierQuestion && (
                        <button
                          type="button"
                          onClick={jumpToResumeQuestion}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-sora font-extrabold text-[10px] border border-[#063E46]/40 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap"
                          title={`Resume progress at Q${resumeQuestionIndex + 1}`}
                        >
                          <RotateCcw className="w-3 h-3 text-[#109A9B]" />
                          <span>Resume Q{resumeQuestionIndex + 1} ➔</span>
                        </button>
                      )}
                    </div>

                    {/* Question Progress Counter Pill */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                      <span className="bg-[#FFF8E8] text-[#10242C] px-2 sm:px-2.5 py-0.5 rounded-full font-mono text-[11px] sm:text-xs border border-[#075D63]/20 font-bold shadow-2xs whitespace-nowrap">
                        Q{currentQuestionIndex + 1} / {questions.length}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Answered & Skipped Counters */}
                  <div className="flex items-center justify-between sm:justify-start gap-1.5 pt-0.5 flex-wrap sm:flex-nowrap">
                    <div className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 text-[10px] sm:text-xs font-sora font-extrabold shadow-2xs whitespace-nowrap shrink-0">
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                      <span>{answeredCount} Answered</span>
                    </div>

                    <button
                      type="button"
                      onClick={jumpToNextSkippedQuestion}
                      disabled={skippedCount === 0}
                      className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-sora font-extrabold shadow-2xs transition-all whitespace-nowrap shrink-0 ${skippedCount > 0
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 cursor-pointer hover:scale-105 active:scale-95'
                        : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                        }`}
                      title={skippedCount > 0 ? `Jump to skipped question Q${nextSkippedNumber}` : "No skipped questions"}
                    >
                      <SkipForward className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${skippedCount > 0 ? 'text-amber-600' : 'text-slate-400'} shrink-0`} />
                      <span>{skippedCount} Skipped</span>
                      {skippedCount > 0 && nextSkippedNumber && (
                        <span className="text-[9px] sm:text-[10px] font-bold bg-amber-200/80 text-amber-950 px-1 py-0.2 rounded-md ml-0.5">
                          Review Q{nextSkippedNumber} ⏭
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h2 className="font-sora font-extrabold text-lg sm:text-xl text-[#10242C] mb-1 leading-snug tracking-tight flex-shrink-0">
                  Q{currentQuestionIndex + 1}. {currentQuestion?.text?.replace(/^(Q\d+|\d+)\.\s*/i, '')}
                </h2>

                {/* Guidance Subtitle & Multi-Select Notice */}
                {Boolean(currentQuestion?.isMultiSelect || currentQuestion?.selectionType === 'multiple') ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold mb-2 shadow-2xs flex-shrink-0 animate-fade-in">
                    <CheckSquare className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>Multiple Choice: Select one or more options, then click <strong>"Next Question ➔"</strong>.</span>
                  </div>
                ) : (
                  <p className={`text-[#53656A] font-inter text-[11px] sm:text-xs font-medium ${isManyOptions ? 'mb-1.5' : 'mb-3'} leading-relaxed flex-shrink-0`}>
                    Help us understand your perspective so we can better represent Gen Z perspectives.
                  </p>
                )}

                {/* Interactive Answer Options Stack */}
                <div className={optionsContainerClass}>
                  {currentQuestion?.options?.map((opt, idx) => {
                    const isMulti = Boolean(currentQuestion?.isMultiSelect || currentQuestion?.selectionType === 'multiple');
                    const rawAns = answersById[currentQuestion?.id];
                    let isSelected = false;

                    if (isMulti) {
                      if (Array.isArray(rawAns)) {
                        isSelected = rawAns.includes(opt.value);
                      } else if (typeof rawAns === 'string' && rawAns.startsWith('[')) {
                        try { isSelected = JSON.parse(rawAns).includes(opt.value); } catch (e) { }
                      } else if (typeof rawAns === 'string') {
                        isSelected = rawAns.split(',').map((s) => s.trim()).includes(opt.value);
                      }
                    } else {
                      isSelected = selectedAnswer === opt.value;
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(opt.value)}
                        className={`w-full text-left ${optionBtnPadding} ${optionMinHeight} rounded-xl sm:rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group cursor-pointer active:scale-[0.99] ${isSelected
                          ? isMulti
                            ? 'border-purple-600 bg-purple-50/90 shadow-2xs font-bold'
                            : 'border-[#0F3D39] bg-[#EAF6F6] shadow-2xs font-bold'
                          : 'border-slate-200 hover:border-[#109A9B]/60 bg-white hover:bg-slate-50/80 font-medium'
                          }`}
                      >
                        <span className={`${optionTextSize} leading-tight ${isSelected ? (isMulti ? 'text-purple-950 font-extrabold' : 'text-[#0F3D39] font-extrabold') : 'text-[#10242C]'}`}>
                          {opt.label}
                        </span>

                        {isSelected ? (
                          isMulti ? (
                            <div className={`${optionIconSize} rounded-full bg-purple-700 text-white flex items-center justify-center flex-shrink-0 ml-1 shadow-2xs`}>
                              <svg className={`${optionCheckIconSize} text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.2" opacity="0.6" fill="none" />
                                <polyline points="16 9 10.5 14.5 8 12"></polyline>
                              </svg>
                            </div>
                          ) : (
                            <div className={`${optionIconSize} rounded-full bg-[#0F3D39] text-white flex items-center justify-center flex-shrink-0 ml-1 shadow-2xs`}>
                              <svg className={`${optionCheckIconSize} text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.2" opacity="0.6" fill="none" />
                                <polyline points="16 9 10.5 14.5 8 12"></polyline>
                              </svg>
                            </div>
                          )
                        ) : (
                          <div className={`${optionIconSize} rounded-full border-2 border-slate-300/90 flex-shrink-0 ml-1 group-hover:border-slate-400 transition-colors`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions Container */}
              <div className="w-full flex items-center justify-between gap-2.5 pt-3 border-t border-slate-200/80 mt-2 font-inter flex-shrink-0">
                <button
                  onClick={handlePrevQuestionWithAnim}
                  disabled={currentQuestionIndex === 0 || isTransitioning}
                  className="bg-white border border-[#063E46]/40 text-[#063E46] hover:bg-[#FFF8E8] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all disabled:opacity-30 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestionWithAnim}
                    disabled={isTransitioning}
                    className="flex-1 bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-sora font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 transition-all group cursor-pointer disabled:opacity-50"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishSurvey}
                    className={`flex-1 font-sora font-bold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      isAllAnswered
                        ? 'bg-[#109A9B] hover:bg-[#075D63] text-white shadow-teal-900/20'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-900/10'
                    }`}
                  >
                    {isAllAnswered ? (
                      <span>Complete Survey 🏆</span>
                    ) : (
                      <span>Submit Survey ({unansweredCount} Remaining)</span>
                    )}
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* INCOMPLETE SURVEY WARNING MODAL */}
      {showIncompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-2 border-amber-500 rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl text-center space-y-4 animate-fade-in font-inter">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-sora font-extrabold text-xl text-[#10242C]">
                Survey Incomplete
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#53656A] mt-1.5 leading-relaxed">
                You must respond to all <strong className="text-[#063E46]">75 questions</strong> before submitting. You currently have <strong className="text-amber-700 font-bold">{unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}</strong> remaining.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowIncompleteModal(false)}
                className="w-full py-3 bg-[#063E46] hover:bg-[#075D63] text-[#FFF8E8] font-sora font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Answer Remaining Questions ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
