import { create } from 'zustand';
import { saveAnswerLocally, markAnswerSynced } from '../services/db';
import { SURVEY_SECTIONS, OFFICIAL_75_QUESTIONS } from '../data/surveyQuestions';
import { 
  registerParticipant,
  fetchResponsesForParticipant,
  syncResponseToSupabase,
  completeParticipantSurvey,
  toUuidQuestionId,
  generateValidUUID
} from '../services/supabaseClient';

export const useSurveyStore = create((set, get) => ({
  sessionId: generateValidUUID(),
  participantName: localStorage.getItem('genz_participant_name') || '',
  participantEmail: localStorage.getItem('genz_participant_email') || '',
  participantId: localStorage.getItem('genz_participant_id') || null,
  isResumedSession: false,
  sections: SURVEY_SECTIONS,
  questions: OFFICIAL_75_QUESTIONS,
  
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  answersById: {},

  syncStatus: 'synced', // 'saving_local' | 'saving_db' | 'synced'
  lastSyncedAt: null,

  initSession: async () => {
    let existingSession = localStorage.getItem('genz_active_session');
    
    if (!existingSession || !existingSession.includes('-') || existingSession.length !== 36) {
      existingSession = generateValidUUID();
      localStorage.setItem('genz_active_session', existingSession);
    }
    
    const savedName = localStorage.getItem('genz_participant_name') || '';
    const savedEmail = localStorage.getItem('genz_participant_email') || '';
    const savedParticipantId = localStorage.getItem('genz_participant_id') || null;

    set({ sessionId: existingSession, participantName: savedName, participantEmail: savedEmail, participantId: savedParticipantId });

    try {
      let fetchedAnswers = {};

      if (savedParticipantId) {
        fetchedAnswers = await fetchResponsesForParticipant(savedParticipantId);
      }

      const { questions, sections } = get();
      let firstUnansweredIdx = 0;

      if (fetchedAnswers && Object.keys(fetchedAnswers).length > 0) {
        const idx = questions.findIndex(q => {
          const hasAns = fetchedAnswers[q.id] !== undefined || (q.code && fetchedAnswers[q.code] !== undefined);
          return !hasAns;
        });

        if (idx !== -1) {
          firstUnansweredIdx = idx;
        } else {
          firstUnansweredIdx = Math.min(Object.keys(fetchedAnswers).length, questions.length - 1);
        }

        const targetQ = questions[firstUnansweredIdx] || questions[0];
        const secIdx = targetQ ? sections.findIndex(s => s.id === targetQ.sectionId) : 0;

        set({
          sessionId: existingSession,
          participantId: savedParticipantId,
          answersById: fetchedAnswers,
          currentQuestionIndex: Math.max(0, firstUnansweredIdx),
          currentSectionIndex: Math.max(0, secIdx),
          isResumedSession: true
        });
      }
    } catch (err) {
      console.warn('Session init warning:', err);
    }
  },

  logoutParticipant: () => {
    localStorage.removeItem('genz_active_session');
    localStorage.removeItem('genz_participant_name');
    localStorage.removeItem('genz_participant_email');
    localStorage.removeItem('genz_participant_id');
    
    const newSession = generateValidUUID();
    localStorage.setItem('genz_active_session', newSession);

    set({
      sessionId: newSession,
      participantName: '',
      participantEmail: '',
      participantId: null,
      answersById: {},
      currentQuestionIndex: 0,
      currentSectionIndex: 0,
      isResumedSession: false,
      syncStatus: 'synced'
    });
  },

  resetSession: () => {
    get().logoutParticipant();
  },

  setParticipantDetails: async (name, email) => {
    const trimmedName = name.trim();
    const trimmedEmail = email ? email.trim().toLowerCase() : '';
    const deviceTimestamp = new Date().toISOString();

    const res = await registerParticipant(trimmedName, trimmedEmail, deviceTimestamp);

    if (res?.error) {
      return res;
    }

    const pId = res.participant?.id || null;
    if (pId) {
      localStorage.setItem('genz_participant_id', pId);
    }
    localStorage.setItem('genz_participant_name', trimmedName);
    localStorage.setItem('genz_participant_email', trimmedEmail);

    // Fetch existing responses for this participant from Supabase DB
    let fetchedAnswers = {};
    if (pId) {
      fetchedAnswers = await fetchResponsesForParticipant(pId);
    }

    const { questions, sections, answersById, sessionId } = get();

    // Merge DB answers with current local answersById
    const mergedAnswers = { ...(fetchedAnswers || {}), ...(answersById || {}) };

    // Sync any unpersisted local answers to Supabase under the participant ID
    if (pId && answersById && Object.keys(answersById).length > 0) {
      Object.entries(answersById).forEach(([qId, val]) => {
        syncResponseToSupabase(pId, sessionId, qId, val, deviceTimestamp);
      });
    }

    // Determine first unanswered question index (where user left off)
    let firstUnansweredIdx = 0;
    const unansweredIdx = questions.findIndex(q => {
      const hasAns = mergedAnswers[q.id] !== undefined || (q.code && mergedAnswers[q.code] !== undefined);
      return !hasAns;
    });

    if (unansweredIdx !== -1) {
      firstUnansweredIdx = unansweredIdx;
    } else if (Object.keys(mergedAnswers).length > 0) {
      firstUnansweredIdx = Math.min(Object.keys(mergedAnswers).length, questions.length - 1);
    }

    const targetQuestion = questions[firstUnansweredIdx] || questions[0];
    const sectionIdx = targetQuestion ? sections.findIndex(s => s.id === targetQuestion.sectionId) : 0;

    const isResumed = Boolean(res?.isResumed || Object.keys(fetchedAnswers).length > 0);

    set({
      participantName: trimmedName,
      participantEmail: trimmedEmail,
      participantId: pId,
      answersById: mergedAnswers,
      currentQuestionIndex: Math.max(0, firstUnansweredIdx),
      currentSectionIndex: Math.max(0, sectionIdx),
      isResumedSession: isResumed
    });

    return { success: true, participant: res.participant, isResumed };
  },

  setParticipantName: async (name) => {
    return get().setParticipantDetails(name, get().participantEmail);
  },

  setAnswer: async (questionId, value) => {
    const { sessionId, participantId, answersById } = get();
    const updatedAnswers = { ...answersById, [questionId]: value };
    const deviceTimestamp = new Date().toISOString();
    
    set({
      answersById: updatedAnswers,
      syncStatus: 'saving_db',
    });

    try {
      // 1. Local Dexie save
      await saveAnswerLocally(sessionId, questionId, value);

      // 2. Direct Supabase Database sync with device_timestamp & participant_id
      const effectiveParticipantId = participantId || sessionId;
      const qCode = get().questions.find(q => q.id === questionId)?.code || questionId;
      const success = await syncResponseToSupabase(effectiveParticipantId, sessionId, questionId, value, deviceTimestamp);
      if (success) {
        await markAnswerSynced(`${sessionId}_${questionId}`);
      }

      set({ 
        syncStatus: 'synced',
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    } catch (err) {
      console.warn('Answer save error:', err);
      set({ syncStatus: 'synced' });
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions, sections } = get();
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[nextIndex];
      const sectionIdx = sections.findIndex(s => s.id === nextQuestion.sectionId);
      
      set({
        currentQuestionIndex: nextIndex,
        currentSectionIndex: sectionIdx !== -1 ? sectionIdx : get().currentSectionIndex,
      });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex, questions, sections } = get();
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const prevQuestion = questions[prevIndex];
      const sectionIdx = sections.findIndex(s => s.id === prevQuestion.sectionId);

      set({
        currentQuestionIndex: prevIndex,
        currentSectionIndex: sectionIdx !== -1 ? sectionIdx : get().currentSectionIndex,
      });
    }
  },

  jumpToSection: (sectionIndex) => {
    const { questions, sections } = get();
    const targetSection = sections[sectionIndex];
    if (!targetSection) return;
    
    set({
      currentSectionIndex: sectionIndex,
      currentQuestionIndex: targetSection.startQuestionIndex,
    });
  },

  jumpToQuestion: (questionIndex) => {
    const { questions, sections } = get();
    const targetQuestion = questions[questionIndex];
    if (!targetQuestion) return;

    const sectionIdx = sections.findIndex(s => s.id === targetQuestion.sectionId);

    set({
      currentQuestionIndex: questionIndex,
      currentSectionIndex: sectionIdx !== -1 ? sectionIdx : get().currentSectionIndex,
    });
  },

  getProgressPercentage: () => {
    const { answersById, questions } = get();
    const answeredCount = questions.filter(q => Boolean(answersById[q.id] && answersById[q.id] !== 'skipped')).length;
    return Math.round((answeredCount / questions.length) * 100);
  },
}));
