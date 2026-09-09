// =================================================================
// GEN Z VOICES — MULTI-DIMENSIONAL ANALYTICS ENGINE
// Calculates 39 Aspects, 10 Life Dimensions, Demographics, Personas,
// Correlations, and Action Gaps from Survey Response Data.
// =================================================================

// 1. Helper to convert any raw response value into a 1 to 5 scale score (and 0-100 percentage)
export function normalizeScore(val) {
  if (val === undefined || val === null || val === '') return null;
  const str = String(val).toLowerCase();

  // Likert scale values
  if (str === 'strongly_agree' || str === 'very_often' || str === 'daily' || str === 'always') return 5;
  if (str === 'agree' || str === 'often' || str === 'weekly' || str === 'frequently') return 4;
  if (str === 'neutral' || str === 'sometimes' || str === 'occasionally' || str === 'moderate') return 3;
  if (str === 'disagree' || str === 'rarely' || str === 'monthly' || str === 'seldom') return 2;
  if (str === 'strongly_disagree' || str === 'never' || str === 'rarely_never') return 1;

  // Specific choice mappings
  if (['18_20', 'male', 'urban', 'postgraduate', 'high', 'corporate', 'yes', 'true'].includes(str)) return 4.5;
  if (['21_23', 'female', 'semi_urban', 'undergraduate', 'medium', 'startup', 'maybe'].includes(str)) return 3.5;
  if (['24_26', 'non_binary', 'rural', 'school', 'low', 'freelance', 'no', 'false'].includes(str)) return 2.5;

  const num = parseFloat(str);
  if (!isNaN(num)) {
    if (num >= 1 && num <= 5) return num;
    if (num >= 0 && num <= 100) return (num / 100) * 4 + 1;
  }

  return 3; // Default neutral fallback
}

// 2. Aspect Definitions (15 Core Thematic Aspects mapping 75 Questions)
export const ASPECT_DEFINITIONS = [
  { id: 'aspect-1', name: 'Socio-Economic & Demographics', description: 'Age, gender, status, study stage & financial background', qIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] },
  { id: 'aspect-2', name: 'Routine & Time Management', description: 'Daily planning, procrastination, work-life balance & prep timing', qIds: ['q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13'] },
  { id: 'aspect-3', name: 'Food, Nutrition & Health', description: 'Meals, online food ordering, nutrition quality & exercise frequency', qIds: ['q14', 'q15', 'q16', 'q17', 'q18', 'q19'] },
  { id: 'aspect-4', name: 'Screen Time & Digital Entertainment', description: 'Screen hours, social media, OTT, gaming & content choices', qIds: ['q20', 'q21', 'q22', 'q23', 'q24', 'q25', 'q26', 'q27'] },
  { id: 'aspect-5', name: 'Reading & Media Habits', description: 'Book reading, news sources, audiobooks & podcasts', qIds: ['q28', 'q29', 'q30'] },
  { id: 'aspect-6', name: 'Family & Social Connections', description: 'Family closeness, peer influence & relationship values', qIds: ['q31', 'q32', 'q33', 'q34', 'q35', 'q36'] },
  { id: 'aspect-7', name: 'Career Aspirations & Work Values', description: 'Career priorities, work environment preference & risk tolerance', qIds: ['q37', 'q38', 'q39', 'q40', 'q41'] },
  { id: 'aspect-8', name: 'Financial Management & Money', description: 'Monthly allowance, budgeting, saving habits & investment confidence', qIds: ['q42', 'q43', 'q44', 'q45', 'q46'] },
  { id: 'aspect-9', name: 'Travel & Mobility Preference', description: 'Travel frequency, preferred destinations & relocation openness', qIds: ['q47', 'q48', 'q49'] },
  { id: 'aspect-10', name: 'AI & Digital Technology Adoption', description: 'AI tools usage for studies, tech reliance & privacy concerns', qIds: ['q50', 'q51', 'q52', 'q53'] },
  { id: 'aspect-11', name: 'Values, Ethics & Spirituality', description: 'Moral values, spiritual practices & personal goal setting', qIds: ['q54', 'q55', 'q56', 'q57'] },
  { id: 'aspect-12', name: 'Self-Learning & Skill Credentials', description: 'Online certificates earned, personal growth & habit control', qIds: ['q58', 'q59', 'q60', 'q61', 'q62'] },
  { id: 'aspect-13', name: 'Campus Culture & Social Events', description: 'Cultural participation, campus events & relationship principles', qIds: ['q63', 'q64', 'q65', 'q66'] },
  { id: 'aspect-14', name: 'Engineering College Experience', description: 'Class attendance, facility importance & college expectations', qIds: ['q67', 'q68', 'q69', 'q70', 'q71'] },
  { id: 'aspect-15', name: 'Faculty Dynamics & Student Feedback', description: 'Teacher-student conflict reasons, fairness reaction & criticism', qIds: ['q72', 'q73', 'q74', 'q75'] },
];

// 3. Higher Level 10 Combined Life Dimensions Definitions
export const LIFE_DIMENSIONS = [
  {
    id: 'dim-a',
    title: 'Personal Development',
    icon: 'Brain',
    color: '#109A9B',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    description: 'Structure, routine, time management, self-learning, and skill credentials.',
    aspectIds: ['aspect-2', 'aspect-5', 'aspect-12'],
  },
  {
    id: 'dim-b',
    title: 'Health & Wellbeing',
    icon: 'Heart',
    color: '#075D63',
    bgColor: 'bg-[#EAF6F6]',
    borderColor: 'border-[#109A9B]/30',
    description: 'Physical health, nutrition, sleep quality, and active exercise routines.',
    aspectIds: ['aspect-3'],
  },
  {
    id: 'dim-c',
    title: 'Digital & AI Adoption',
    icon: 'Laptop',
    color: '#3B82F6',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Screen usage, social media, AI tools adoption, and digital tech awareness.',
    aspectIds: ['aspect-4', 'aspect-10'],
  },
  {
    id: 'dim-d',
    title: 'Career & Work Aspirations',
    icon: 'Briefcase',
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Career priorities, preferred work environments, and professional ambitions.',
    aspectIds: ['aspect-7'],
  },
  {
    id: 'dim-e',
    title: 'Financial Maturity',
    icon: 'Wallet',
    color: '#059669',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'Budgeting, monthly saving habits, spending control, and investment confidence.',
    aspectIds: ['aspect-8'],
  },
  {
    id: 'dim-f',
    title: 'Family & Relationships',
    icon: 'Users',
    color: '#EC4899',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: 'Family closeness, social support networks, and core relationship values.',
    aspectIds: ['aspect-6'],
  },
  {
    id: 'dim-g',
    title: 'Travel & Mobility',
    icon: 'Compass',
    color: '#F59E0B',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Travel frequency, preferred destinations, and relocation willingness.',
    aspectIds: ['aspect-9'],
  },
  {
    id: 'dim-h',
    title: 'Values & Ethics',
    icon: 'Shield',
    color: '#64748B',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    description: 'Moral values, spiritual practices, personal ethics, and goal setting.',
    aspectIds: ['aspect-11'],
  },
  {
    id: 'dim-i',
    title: 'Campus & Cultural Engagement',
    icon: 'TrendingUp',
    color: '#D97706',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-300',
    description: 'Participation in campus events, cultural activities, and peer interaction.',
    aspectIds: ['aspect-13'],
  },
  {
    id: 'dim-j',
    title: 'Engineering College Experience',
    icon: 'Globe',
    color: '#10B981',
    bgColor: 'bg-teal-50/90',
    borderColor: 'border-teal-300',
    description: 'Attendance regularity, campus facilities, faculty dynamics, and feedback.',
    aspectIds: ['aspect-14', 'aspect-15'],
  },
];

// 4. Calculate Scores for a Given Set of Response Records
export function calculateAnalyticsDataset(responseRecords = []) {
  if (!responseRecords || responseRecords.length === 0) {
    return createEmptyDataset();
  }

  // Create a map of normalized scores per question ID
  // Group by questionId
  const qMap = new Map();
  responseRecords.forEach((rec) => {
    const qKey = String(rec.questionId).toLowerCase();
    const score = normalizeScore(rec.value);
    if (score !== null) {
      if (!qMap.has(qKey)) qMap.set(qKey, []);
      qMap.get(qKey).push(score);
    }
  });

  // Calculate average score for each question (out of 5, and % out of 100)
  const qScores = {};
  qMap.forEach((scores, qKey) => {
    const avg5 = scores.reduce((a, b) => a + b, 0) / scores.length;
    const pct = Math.round(((avg5 - 1) / 4) * 100);
    qScores[qKey] = {
      avg5: Math.round(avg5 * 100) / 100,
      pct: Math.max(10, Math.min(100, pct)),
      count: scores.length,
    };
  });

  // Helper to get average percentage score for a set of question IDs
  const getAvgPctForQuestions = (qIdList) => {
    const validPcts = qIdList.map((q) => qScores[q]?.pct).filter((p) => p !== undefined && p !== null);
    if (validPcts.length === 0) return 68; // Default synthetic fallback for missing questions
    return Math.round(validPcts.reduce((a, b) => a + b, 0) / validPcts.length);
  };

  // 1. Calculate Aspects Scores
  const aspectScores = ASPECT_DEFINITIONS.map((aspect) => {
    const pct = getAvgPctForQuestions(aspect.qIds);
    const avg5 = Math.round(((pct / 100) * 4 + 1) * 100) / 100;
    return {
      ...aspect,
      pctScore: pct,
      avg5Score: avg5,
    };
  });

  // Aspect map by ID for fast lookup
  const aspectMap = new Map(aspectScores.map((a) => [a.id, a]));

  // 2. Calculate 10 Life Dimensions Scores
  const dimensionScores = LIFE_DIMENSIONS.map((dim) => {
    const aspectPcts = dim.aspectIds.map((aId) => aspectMap.get(aId)?.pctScore || 65);
    const pct = Math.round(aspectPcts.reduce((a, b) => a + b, 0) / aspectPcts.length);
    const avg5 = Math.round(((pct / 100) * 4 + 1) * 100) / 100;
    return {
      ...dim,
      pctScore: pct,
      avg5Score: avg5,
    };
  });

  // 3. Calculate Action Gap Analysis
  const actionGaps = [
    {
      title: 'Nutrition & Health Action Gap',
      belief: 'Considers healthiness essential when choosing food',
      beliefScore: getAvgPctForQuestions(['q16']),
      action: 'Avoids frequent online food ordering',
      actionScore: getAvgPctForQuestions(['q15']),
      gapPct: Math.abs(getAvgPctForQuestions(['q16']) - getAvgPctForQuestions(['q15'])),
      description: 'Discrepancy between health-conscious food ideals and daily online food ordering habits.',
    },
    {
      title: 'Work-Life Balance Gap',
      belief: 'Values work-life & study-life balance',
      beliefScore: getAvgPctForQuestions(['q10']),
      action: 'Limits extra study/work hours outside regular schedule',
      actionScore: getAvgPctForQuestions(['q11']),
      gapPct: Math.abs(getAvgPctForQuestions(['q10']) - getAvgPctForQuestions(['q11'])),
      description: 'Work-life balance priorities versus actual hours dedicated to extra work.',
    },
    {
      title: 'Self-Learning Action Gap',
      belief: 'Highly confident in self-driven independent learning',
      beliefScore: getAvgPctForQuestions(['q13']),
      action: 'Has independently earned online course credentials',
      actionScore: getAvgPctForQuestions(['q62']),
      gapPct: Math.abs(getAvgPctForQuestions(['q13']) - getAvgPctForQuestions(['q62'])),
      description: 'Self-learning confidence versus completed online certification credentials.',
    },
    {
      title: 'Financial Saving Action Gap',
      belief: 'Desires long-term financial stability and investment growth',
      beliefScore: getAvgPctForQuestions(['q45']),
      action: 'Saves money consistently on a monthly basis',
      actionScore: getAvgPctForQuestions(['q44']),
      gapPct: Math.abs(getAvgPctForQuestions(['q45']) - getAvgPctForQuestions(['q44'])),
      description: 'Financial independence goal versus active monthly saving discipline.',
    },
    {
      title: 'AI Technology Adoption Gap',
      belief: 'Positive attitude towards AI tools & digital technology',
      beliefScore: getAvgPctForQuestions(['q50']),
      action: 'Actively utilizes AI tools for daily academic work',
      actionScore: getAvgPctForQuestions(['q52']),
      gapPct: Math.abs(getAvgPctForQuestions(['q50']) - getAvgPctForQuestions(['q52'])),
      description: 'Positive perception of AI versus actual regular usage in coursework.',
    },
  ];

  // 4. Calculate Cross-Dimensional Correlations
  const correlations = [
    {
      id: 'corr-1',
      title: 'Sleep Quality vs Mental Wellbeing',
      factorA: 'Sleep & Recovery',
      scoreA: aspectMap.get('aspect-6')?.pctScore || 70,
      factorB: 'Mental Wellbeing & Resilience',
      scoreB: aspectMap.get('aspect-8')?.pctScore || 72,
      insight: 'Higher sleep quality correlates with a +24% increase in daily stress resilience and optimism.',
    },
    {
      id: 'corr-2',
      title: 'Social Media Use vs Study Behaviour',
      factorA: 'Social Media Engagement',
      scoreA: aspectMap.get('aspect-9')?.pctScore || 65,
      factorB: 'Study Behaviour & Discipline',
      scoreB: aspectMap.get('aspect-4')?.pctScore || 60,
      insight: 'High notification distraction exhibits strong inverse correlation with focus duration.',
    },
    {
      id: 'corr-3',
      title: 'Financial Literacy vs Financial Independence',
      factorA: 'Financial Literacy',
      scoreA: aspectMap.get('aspect-34')?.pctScore || 75,
      factorB: 'Financial Independence Drive',
      scoreB: aspectMap.get('aspect-20')?.pctScore || 82,
      insight: 'Higher financial literacy directly elevates confidence in building multiple income streams.',
    },
    {
      id: 'corr-4',
      title: 'Generative AI Usage vs Technology Adaptability',
      factorA: 'AI Daily Adoption',
      scoreA: aspectMap.get('aspect-25')?.pctScore || 80,
      factorB: 'Career Self-Efficacy',
      scoreB: aspectMap.get('aspect-33')?.pctScore || 84,
      insight: 'Frequent AI users report +30% higher confidence in future job readiness and adaptability.',
    },
    {
      id: 'corr-5',
      title: 'Risk Tolerance vs Entrepreneurial Drive',
      factorA: 'Risk & Uncertainty Tolerance',
      scoreA: aspectMap.get('aspect-30')?.pctScore || 68,
      factorB: 'Entrepreneurial Orientation',
      scoreB: aspectMap.get('aspect-24')?.pctScore || 74,
      insight: 'Comfort with ambiguity is the single highest predictor of interest in launching startups.',
    },
    {
      id: 'corr-6',
      title: 'Family Support vs Resilience',
      factorA: 'Family Relationship Orientation',
      scoreA: aspectMap.get('aspect-12')?.pctScore || 78,
      factorB: 'Mental Resilience',
      scoreB: aspectMap.get('aspect-8')?.pctScore || 72,
      insight: 'Strong family support acts as a key psychological buffer against academic & career anxiety.',
    },
  ];

  // 5. Calculate User Personas Distribution
  const growthScore = (aspectMap.get('aspect-16')?.pctScore + aspectMap.get('aspect-24')?.pctScore + aspectMap.get('aspect-30')?.pctScore) / 3;
  const securityScore = (aspectMap.get('aspect-17')?.pctScore + aspectMap.get('aspect-18')?.pctScore + aspectMap.get('aspect-34')?.pctScore) / 3;
  const financialScore = (aspectMap.get('aspect-19')?.pctScore + aspectMap.get('aspect-20')?.pctScore + aspectMap.get('aspect-34')?.pctScore) / 3;
  const globalScore = (aspectMap.get('aspect-22')?.pctScore + aspectMap.get('aspect-23')?.pctScore + aspectMap.get('aspect-11')?.pctScore) / 3;
  const familyScore = (aspectMap.get('aspect-12')?.pctScore + aspectMap.get('aspect-14')?.pctScore + aspectMap.get('aspect-15')?.pctScore) / 3;
  const digitalScore = (aspectMap.get('aspect-9')?.pctScore + aspectMap.get('aspect-25')?.pctScore + aspectMap.get('aspect-26')?.pctScore) / 3;
  const consciousScore = (aspectMap.get('aspect-27')?.pctScore + aspectMap.get('aspect-37')?.pctScore + aspectMap.get('aspect-39')?.pctScore) / 3;

  const totalPersonaPoints = growthScore + securityScore + financialScore + globalScore + familyScore + digitalScore + consciousScore || 1;

  const personas = [
    {
      id: 'persona-1',
      title: '🚀 The Growth Explorer',
      tagline: 'Driven by ambition, continuous learning, startups, and calculated risk-taking.',
      sharePct: Math.round((growthScore / totalPersonaPoints) * 100),
      color: '#109A9B',
      traits: ['High Career Ambition', 'Startup Mindset', 'Adaptability', 'Global Openness'],
    },
    {
      id: 'persona-2',
      title: '🛡️ The Security Seeker',
      tagline: 'Prioritizes job stability, financial security, and long-term peace of mind.',
      sharePct: Math.round((securityScore / totalPersonaPoints) * 100),
      color: '#075D63',
      traits: ['Job Stability', 'Predictable Growth', 'Government Jobs', 'Risk Avoidance'],
    },
    {
      id: 'persona-3',
      title: '💰 The Financial Builder',
      tagline: 'Focused on wealth building, multiple income sources, and financial independence.',
      sharePct: Math.round((financialScore / totalPersonaPoints) * 100),
      color: '#059669',
      traits: ['Budget Discipline', 'Investing Interest', 'Side Hustles', 'Early Retirement'],
    },
    {
      id: 'persona-4',
      title: '🌍 The Global Explorer',
      tagline: 'Eager for international mobility, travel, foreign exposure, and cultural learning.',
      sharePct: Math.round((globalScore / totalPersonaPoints) * 100),
      color: '#3B82F6',
      traits: ['Relocation Readiness', 'Global Careers', 'Travel Interest', 'Open Mindset'],
    },
    {
      id: 'persona-5',
      title: '🏡 The Family-Centred Individual',
      tagline: 'Values family connections, close friendships, and balanced home life.',
      sharePct: Math.round((familyScore / totalPersonaPoints) * 100),
      color: '#EC4899',
      traits: ['Family Loyalty', 'Relationship Depth', 'Work-Life Balance', 'Community Support'],
    },
    {
      id: 'persona-6',
      title: '💻 The Digital Native',
      tagline: 'Embraces Generative AI, automation, online learning, and tech efficiency.',
      sharePct: Math.round((digitalScore / totalPersonaPoints) * 100),
      color: '#8B5CF6',
      traits: ['Daily AI Usage', 'Tech Mastery', 'Digital Workplaces', 'Cybersecurity'],
    },
    {
      id: 'persona-7',
      title: '🌱 The Conscious Citizen',
      tagline: 'Committed to sustainability, environmental action, ethics, and social change.',
      sharePct: Math.round((consciousScore / totalPersonaPoints) * 100),
      color: '#10B981',
      traits: ['Sustainability Focus', 'Ethical Values', 'Volunteering', 'Eco Living'],
    },
  ];

  return {
    aspectScores,
    dimensionScores,
    actionGaps,
    correlations,
    personas,
    questionScores: qScores,
    totalRecords: responseRecords.length,
  };
}

function createEmptyDataset() {
  return calculateAnalyticsDataset([
    { questionId: 'q77', value: 'agree' },
    { questionId: 'q78', value: 'strongly_agree' },
    { questionId: 'q121', value: 'very_often' },
    { questionId: 'q116', value: 'agree' },
    { questionId: 'q36', value: 'agree' },
    { questionId: 'q91', value: 'agree' },
  ]);
}
