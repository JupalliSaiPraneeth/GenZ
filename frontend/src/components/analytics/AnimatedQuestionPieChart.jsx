import React, { useEffect, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  PieChart as PieIcon,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import gsap from 'gsap';

export default function AnimatedQuestionPieChart({
  questionObj,
  analysisData,
  onSelectPrev,
  onSelectNext,
  totalQuestionsCount = 75,
  currentIndex = 0,
}) {
  const containerRef = useRef(null);
  const pieCardRef = useRef(null);
  const centerBadgeRef = useRef(null);
  const legendRef = useRef(null);

  // Trigger GSAP entrance animation whenever questionObj changes
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Entrance animation for main card
      gsap.fromTo(
        pieCardRef.current,
        { scale: 0.92, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }
      );

      // 2. Bounce animation for center donut badge
      gsap.fromTo(
        centerBadgeRef.current,
        { scale: 0.6, opacity: 0, rotate: -15 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, delay: 0.15, ease: 'elastic.out(1, 0.5)' }
      );

      // 3. Staggered slide-up for option pills
      const optionItems = legendRef.current?.querySelectorAll('.option-pill-item');
      if (optionItems && optionItems.length > 0) {
        gsap.fromTo(
          optionItems,
          { y: 20, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            duration: 0.4,
            delay: 0.2,
            ease: 'power3.out',
          }
        );
      }

      // 4. Progress bar fill animation
      const progressBars = legendRef.current?.querySelectorAll('.option-progress-bar');
      if (progressBars && progressBars.length > 0) {
        progressBars.forEach((bar) => {
          const targetWidth = bar.getAttribute('data-target-width') || '0%';
          gsap.fromTo(
            bar,
            { width: '0%' },
            { width: targetWidth, duration: 0.8, delay: 0.3, ease: 'power2.out' }
          );
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [questionObj?.id, analysisData]);

  if (!questionObj || !analysisData) return null;

  const { avgScore5, dominantOption, totalResponses, distributionData } = analysisData;

  return (
    <div ref={containerRef} className="w-full space-y-4 font-inter">

      {/* MAIN PIE CHART CARD CONTAINER */}
      <div
        ref={pieCardRef}
        className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-[#109A9B]/25 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
      >
        {/* BACKGROUND GLOW ACCENT */}
        <div className="absolute -top-16 -right-16 w-48 sm:w-64 h-48 sm:h-64 bg-[#109A9B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* TOP QUESTION HEADER & NAVIGATION BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-extrabold font-mono text-[#075D63] bg-[#EAF6F6] px-2.5 sm:px-3 py-0.5 rounded-full border border-[#109A9B]/25">
                {questionObj.code || 'Q'} • {questionObj.topic || 'Gen Z Survey'}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#53656A] bg-slate-100 px-2.5 py-0.5 rounded-full">
                Question {currentIndex + 1} of {totalQuestionsCount}
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-base sm:text-xl text-[#10242C] leading-snug pt-0.5">
              {questionObj.text}
            </h3>
          </div>

          {/* Quick Touch Prev / Next Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-center justify-between sm:justify-start pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <button
              type="button"
              onClick={onSelectPrev}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-100 hover:bg-[#EAF6F6] active:bg-[#D3ECEC] text-[#063E46] font-bold text-xs border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 shadow-2xs"
              title="Previous Question"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <button
              type="button"
              onClick={onSelectNext}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#063E46] hover:bg-[#075D63] active:bg-[#042A30] text-[#FFF8E8] font-bold text-xs border border-[#063E46] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
              title="Next Question"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PIE CHART & BREAKDOWN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-4 sm:pt-5">

          {/* LEFT: DONUT PIE CHART VISUAL WITH CENTER BADGE */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6F6] text-[#075D63] text-[10px] sm:text-[11px] font-bold border border-[#109A9B]/20 mb-1 sm:mb-2">
              <PieIcon className="w-3.5 h-3.5 text-[#109A9B]" />
              <span>Option Selection Distribution</span>
            </div>

            {/* Interactive Recharts Donut Pie Chart Container */}
            <div className="h-56 sm:h-64 lg:h-72 w-full max-w-[250px] sm:max-w-[280px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData.map(d => ({ ...d, chartVal: totalResponses > 0 ? d.pct : 1 }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={4}
                    dataKey="chartVal"
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="#FFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name, props) => {
                      const item = props?.payload;
                      const count = item?.count !== undefined ? item.count : 0;
                      const pct = item?.pct !== undefined ? item.pct : 0;
                      return [`${pct}% (${count} votes)`, item?.name || name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* CENTER DONUT ANIMATED BADGE */}
              <div
                ref={centerBadgeRef}
                className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border-2 border-[#109A9B]/30 shadow-md flex flex-col items-center justify-center text-center p-1 pointer-events-none z-10"
              >
                <span className="text-[9px] sm:text-[10px] font-bold text-[#53656A] uppercase tracking-tighter">
                  {analysisData.isLikert ? 'Avg Likert' : 'Top Choice %'}
                </span>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#075D63] leading-none my-0.5">
                  {analysisData.isLikert ? avgScore5 : `${analysisData.dominantPct || 0}%`}
                </span>
                <span
                  className="text-[9px] sm:text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 truncate max-w-[80px] sm:max-w-[90px]"
                  title={dominantOption}
                >
                  {dominantOption}
                </span>
              </div>
            </div>

            <span className="text-[10px] sm:text-[11px] text-[#53656A] font-semibold mt-0.5 sm:mt-1">
              Total Sample: {totalResponses} Recorded Answer(s)
            </span>
          </div>

          {/* RIGHT: GSAP ANIMATED STAGGERED OPTION BREAKDOWN CARDS */}
          <div ref={legendRef} className="lg:col-span-7 space-y-2.5">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#063E46] flex items-center justify-between mb-1">
              <span>Option Selection Distribution (%)</span>
              <span className="text-[10px] sm:text-[11px] text-[#53656A] font-normal">Ranked by Preference</span>
            </h4>

            {distributionData.map((opt, idx) => (
              <div
                key={idx}
                className="option-pill-item bg-[#FAF7F0] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#109A9B]/40 transition-all flex flex-col justify-between"
              >
                {/* Option Header Row */}
                <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: opt.fill }}
                    />
                    <span className="font-bold text-[#10242C] truncate text-xs sm:text-sm">{opt.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="text-[10px] sm:text-[11px] text-[#53656A] font-medium">{opt.count} votes</span>
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-[#075D63] bg-white px-2 sm:px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                      {opt.pct}%
                    </span>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 sm:h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className="option-progress-bar h-full rounded-full transition-all duration-300"
                    style={{ backgroundColor: opt.fill }}
                    data-target-width={`${opt.pct}%`}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
