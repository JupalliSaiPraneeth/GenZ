import React, { useState, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { Search, HelpCircle, BarChart2, PieChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { getStoredQuestions } from '../../data/surveyQuestions';
import { adminDataService } from '../../services/adminDataService';

// =========================================================================
// GSAP ANIMATED 2D PIE CHART SUB-COMPONENT (ALL RESPONSES EXPLORER)
// =========================================================================
function Solid2DPieChart({ distribution, colors }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const slices = useMemo(() => {
    let cumPct = 0;
    return distribution.map((opt, idx) => {
      const pct = Number(opt.percentage) || 0;
      const startAngle = cumPct * 3.6;
      cumPct += pct;
      const endAngle = cumPct * 3.6;
      const midAngle = (startAngle + endAngle) / 2;
      const color = colors[idx % colors.length];

      const midRad = ((midAngle - 90) * Math.PI) / 180;
      const dx = Math.cos(midRad);
      const dy = Math.sin(midRad);

      return {
        id: idx,
        label: opt.label,
        count: opt.count,
        pct,
        startAngle,
        endAngle,
        midAngle,
        dx,
        dy,
        color,
        glow: color,
      };
    });
  }, [distribution, colors]);

  const sliceRefs = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    if (!sliceRefs.current.length) return;

    const ctx = gsap.context(() => {
      sliceRefs.current.forEach((el, idx) => {
        if (!el) return;
        const slice = slices[idx];
        if (!slice) return;

        const startX = slice.dx * 35;
        const startY = slice.dy * 35;

        gsap.fromTo(
          el,
          {
            x: startX,
            y: startY,
            scale: 0.75,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.1,
            delay: idx * 0.1,
            ease: 'back.out(1.5)',
          }
        );
      });

      textRefs.current.forEach((el, idx) => {
        if (!el) return;
        const targetPct = slices[idx]?.pct || 0;
        const obj = { val: 0 };

        gsap.to(obj, {
          val: targetPct,
          duration: 1.2,
          delay: 0.2 + idx * 0.1,
          ease: 'power2.out',
          onUpdate: () => {
            if (el) el.textContent = `${Math.round(obj.val)}%`;
          },
        });
      });
    });

    return () => ctx.revert();
  }, [slices]);

  const createArcPath = (cx, cy, r, startAngle, endAngle) => {
    const toRad = (deg) => ((deg - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const handleMouseEnter = (idx) => {
    setActiveIdx(idx);
    sliceRefs.current.forEach((el, i) => {
      if (!el) return;
      const slice = slices[i];
      if (i === idx) {
        const hoverX = slice.dx * 14;
        const hoverY = slice.dy * 14;
        gsap.to(el, {
          x: hoverX,
          y: hoverY,
          scale: 1.05,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 0.96,
          opacity: 0.45,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  };

  const handleMouseLeave = () => {
    setActiveIdx(null);
    sliceRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  };

  const cx = 135;
  const cy = 135;
  const radius = 105;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center flex-1">
      {/* SOLID GSAP PIE CHART CANVAS WITH FLOATING HOVER BADGE */}
      <div className="md:col-span-6 flex items-center justify-center relative py-2">
        <svg
          width="270"
          height="270"
          viewBox="0 0 270 270"
          className="overflow-visible"
          onMouseLeave={handleMouseLeave}
        >
          {/* PIE SLICES */}
          {slices.map((slice, idx) => {
            const isHovered = activeIdx === idx;
            const textRadius = radius * 0.62;
            const tx = cx + textRadius * slice.dx;
            const ty = cy + textRadius * slice.dy;
            const isFullCircle = slice.pct >= 99.9;

            return (
              <g key={slice.id}>
                {isFullCircle ? (
                  <circle
                    ref={(el) => (sliceRefs.current[idx] = el)}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={slice.color}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-200 shadow-md"
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 12px ${slice.glow})` : 'none',
                    }}
                    onMouseEnter={() => handleMouseEnter(idx)}
                  />
                ) : (
                  <path
                    ref={(el) => (sliceRefs.current[idx] = el)}
                    d={createArcPath(cx, cy, radius, slice.startAngle, slice.endAngle)}
                    fill={slice.color}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-200 shadow-md"
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 12px ${slice.glow})` : 'none',
                    }}
                    onMouseEnter={() => handleMouseEnter(idx)}
                  />
                )}

                {/* IN-SLICE PERCENTAGE TEXT */}
                {slice.pct >= 5 && (
                  <text
                    ref={(el) => (textRefs.current[idx] = el)}
                    x={tx}
                    y={ty}
                    fill="#FFFFFF"
                    fontSize="13"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none drop-shadow-md select-none font-sans"
                  >
                    {slice.pct}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* GSAP SLEEK GLASSMORPHISM HOVER TOOLTIP CARD */}
        {activeIdx !== null && (
          <div className="absolute top-0 left-0 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-2xl pointer-events-none z-20 text-white animate-in fade-in zoom-in-95 duration-150 min-w-[130px]">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slices[activeIdx].color }} />
              <span className="truncate">{slices[activeIdx].label}</span>
            </div>
            <div className="font-heading font-extrabold text-2xl text-teal-300 leading-tight">
              {slices[activeIdx].pct}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {slices[activeIdx].count} votes
            </div>
          </div>
        )}
      </div>

      {/* UNTRUNCATED FULL-WORD LEGEND BADGES */}
      <div className="md:col-span-6 space-y-2">
        {slices.map((slice, idx) => (
          <div
            key={slice.id}
            className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 text-xs ${activeIdx === idx
                ? 'bg-[#EAF6F6] border-[#109A9B]/40 shadow-xs scale-[1.02]'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
              }`}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-3.5 h-3.5 rounded-md shrink-0 shadow-2xs" style={{ backgroundColor: slice.color }} />
              <span className="font-bold text-[#10242C] text-xs leading-tight whitespace-normal">{slice.label}</span>
            </div>
            <div className="text-right font-mono shrink-0">
              <span className="font-extrabold text-[#075D63] text-xs block">{slice.pct}%</span>
              <span className="text-[9.5px] text-[#53656A] block font-semibold">{slice.count} votes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// MAIN PAGE COMPONENT: ADMIN RESPONSES EXPLORER
// =========================================================================
export default function AdminResponses() {
  const [selectedQId, setSelectedQId] = useState('q1');
  const [allQuestions, setAllQuestions] = useState([]);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartMode, setChartMode] = useState('pie'); // 'pie' | 'bar'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQs() {
      const qs = await adminDataService.getQuestionsList();
      if (qs && qs.length > 0) {
        setAllQuestions(qs);
        if (!qs.some((q) => q.id === selectedQId)) {
          setSelectedQId(qs[0].id);
        }
      }
    }
    loadQs();
  }, []);

  useEffect(() => {
    async function loadDist() {
      if (!selectedQId) return;
      setLoading(true);
      const res = await adminDataService.getQuestionDistribution(selectedQId);
      setData(res);
      setLoading(false);
    }
    loadDist();
  }, [selectedQId]);

  const filteredQs = allQuestions.filter(
    (q) =>
      (q.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.topic || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colors = ['#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#10B981', '#EC4899', '#14B8A6', '#6366F1'];

  return (
    <AdminLayout title={`All Responses Explorer (${allQuestions.length} Questions)`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: QUESTION SELECTOR */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-4 max-h-[660px] flex flex-col">
          <div className="space-y-2">
            <h3 className="font-heading font-extrabold text-base text-[#10242C] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#109A9B]" />
              Select Question ({allQuestions.length} Total)
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search Q1-Q${allQuestions.length} or keyword...`}
                className="w-full pl-9 pr-3 py-2 rounded-2xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#109A9B]"
              />
            </div>
          </div>

          <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 scrollbar-thin">
            {filteredQs.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedQId(q.id)}
                className={`w-full text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${selectedQId === q.id
                    ? 'bg-[#075D63] text-white border-[#075D63] font-bold shadow-md'
                    : 'bg-white hover:bg-slate-50 text-[#10242C] border-slate-200 font-medium'
                  }`}
              >
                <div className="font-mono text-[10px] opacity-80">{q.code} • {q.topic}</div>
                <div className="truncate font-semibold mt-0.5">{q.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED DISTRIBUTION ANALYTICS */}
        <div className="lg:col-span-8 space-y-6">
          {data && (
            <div className="bg-white p-6 rounded-3xl border border-[#109A9B]/20 shadow-md space-y-6">
              <div className="pb-4 border-b border-slate-100 space-y-1">
                <span className="font-mono text-xs font-bold text-[#075D63] bg-[#EAF6F6] px-3 py-0.5 rounded-full border border-[#109A9B]/20">
                  {data.question.code} • {data.question.topic}
                </span>
                <h2 className="font-heading font-extrabold text-xl text-[#10242C] pt-1 leading-snug">
                  {data.question.text}
                </h2>
              </div>

              {/* STATISTICAL METRICS ROW */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-slate-200">
                  <span className="text-[#53656A] uppercase text-[10px] block font-bold">Total Responses</span>
                  <span className="font-extrabold text-lg text-[#10242C]">{data.totalResponses}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-slate-200">
                  <span className="text-[#53656A] uppercase text-[10px] block font-bold">Mean Score</span>
                  <span className="font-extrabold text-lg text-[#075D63]">{data.mean}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-slate-200">
                  <span className="text-[#53656A] uppercase text-[10px] block font-bold">Median Choice</span>
                  <span className="font-extrabold text-base text-[#109A9B] truncate block">{data.median}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-slate-200">
                  <span className="text-[#53656A] uppercase text-[10px] block font-bold">Mode (Dominant)</span>
                  <span className="font-extrabold text-base text-emerald-700 truncate block">{data.mode}</span>
                </div>
              </div>

              {/* CHART REPRESENTATION SECTION (PIE & BAR CHART TOGGLE) */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                  <h3 className="font-heading font-bold text-sm text-[#10242C] uppercase tracking-wider">
                    Option Selection Percentage Distribution (%)
                  </h3>

                  {/* VISUALIZATION TOGGLE SWITCH */}
                  <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                    <button
                      onClick={() => setChartMode('pie')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${chartMode === 'pie'
                          ? 'bg-[#075D63] text-white shadow-xs'
                          : 'text-[#53656A] hover:bg-slate-200'
                        }`}
                    >
                      <PieChart className="w-3.5 h-3.5" />
                      <span>Pie Chart</span>
                    </button>
                    <button
                      onClick={() => setChartMode('bar')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${chartMode === 'bar'
                          ? 'bg-[#075D63] text-white shadow-xs'
                          : 'text-[#53656A] hover:bg-slate-200'
                        }`}
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Bar Chart</span>
                    </button>
                  </div>
                </div>

                {/* PIE CHART OR BAR CHART DISPLAY */}
                {chartMode === 'pie' ? (
                  <Solid2DPieChart distribution={data.distribution} colors={colors} />
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.distribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <XAxis dataKey="label" interval={0} tick={{ fontSize: 10, fontWeight: 700 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val, name, props) => [`${val}% (${props.payload.count} votes)`, 'Distribution']} />
                        <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                          {data.distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* DISTRIBUTION BREAKDOWN TABLE */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {data.distribution.map((opt, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#FAF7F0] border border-slate-200 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: colors[idx % colors.length] }} />
                      <span className="font-bold text-[#10242C]">{opt.label}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#53656A]">{opt.count} votes</span>
                      <span className="font-extrabold text-sm text-[#075D63] bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                        {opt.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
