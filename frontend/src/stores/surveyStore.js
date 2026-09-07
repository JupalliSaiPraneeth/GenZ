import { create } from 'zustand';
import { saveAnswerLocally, markAnswerSynced } from '../services/db';
import { SURVEY_SECTIONS, OFFICIAL_207_QUESTIONS } from '../data/surveyQuestions';
import { 
  getOrCreateAnonymousParticipant, 
  createNewParticipant,
  findOrCreateParticipantByEmail,
  fetchResponsesForSession,
  ensureSurveySessionInSupabase, 
  syncResponseToSupabase,
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
  questions: OFFICIAL_207_QUESTIONS,
  
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  answersById: {},

  syncStatus: 'synced', // 'saving_local' | 'saving_db' | 'synced'
  lastSyncedAt: null,

  initSession: async () => {
    let existingSession = localStorage.getItem('genz_active_session');
    
    // Check if existingSession is a valid UUID, otherwise regenerate
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

      if (savedEmail) {
        const res = await findOrCreateParticipantByEmail(savedName, savedEmail);
        if (res && res.participant?.id) {
          localStorage.setItem('genz_participant_id', res.participant.id);
        }
        if (res && res.isExisting && res.answersById) {
          fetchedAnswers = res.answersById;
          existingSession = res.sessionId;
        }
      }

      // Also try direct fetch by sessionId if answers are not loaded yet
      if (Object.keys(fetchedAnswers).length === 0 && existingSession) {
        fetchedAnswers = await fetchResponsesForSession(existingSession);
      }

      const { questions, sections } = get();
      let firstUnansweredIdx = 0;

      if (fetchedAnswers && Object.keys(fetchedAnswers).length > 0) {
        const idx = questions.findIndex(q => {
          const uuidKey = toUuidQuestionId(q.id);
          const hasAns = fetchedAnswers[q.id] !== undefined || 
                         (q.code && fetchedAnswers[q.code] !== undefined) || 
                         fetchedAnswers[uuidKey] !== undefined;
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

    localStorage.setItem('genz_participant_name', trimmedName);
    localStorage.setItem('genz_participant_email', trimmedEmail);

    const res = await findOrCreateParticipantByEmail(trimmedName, trimmedEmail);

    const pId = res.participant?.id || null;
    if (pId) {
      localStorage.setItem('genz_participant_id', pId);
    }
    localStorage.setItem('genz_active_session', res.sessionId);

    // Link session to participant explicitly in Supabase
    await ensureSurveySessionInSupabase(res.sessionId, pId);

    const { questions, sections } = get();
    let firstUnansweredIdx = 0;

    if (res.isExisting && res.answersById && Object.keys(res.answersById).length > 0) {
      const idx = questions.findIndex(q => {
        const uuidKey = toUuidQuestionId(q.id);
        const hasAns = res.answersById[q.id] !== undefined || 
                       (q.code && res.answersById[q.code] !== undefined) || 
                       res.answersById[uuidKey] !== undefined;
        return !hasAns;
      });

      if (idx !== -1) {
        firstUnansweredIdx = idx;
      } else {
        firstUnansweredIdx = Math.min(Object.keys(res.answersById).length, questions.length - 1);
      }
    }

    const targetQuestion = questions[firstUnansweredIdx] || questions[0];
    const sectionIdx = targetQuestion ? sections.findIndex(s => s.id === targetQuestion.sectionId) : 0;

    set({
      participantName: trimmedName,
      participantEmail: trimmedEmail,
      participantId: pId,
      sessionId: res.sessionId,
      answersById: res.answersById || {},
      currentQuestionIndex: Math.max(0, firstUnansweredIdx),
      currentSectionIndex: Math.max(0, sectionIdx),
      isResumedSession: res.isExisting
    });

    return res;
  },

  setParticipantName: async (name) => {
    return get().setParticipantDetails(name, get().participantEmail);
  },

  setAnswer: async (questionId, value) => {
    const { sessionId, participantId, answersById } = get();
    const updatedAnswers = { ...answersById, [questionId]: value };
    
    set({
      answersById: updatedAnswers,
      syncStatus: 'saving_db',
    });

    try {
      // 1. Immediate local backup save
      await saveAnswerLocally(sessionId, questionId, value);

      // 2. IMMEDIATE Supabase Database direct sync with participantId linked
      const success = await syncResponseToSupabase(sessionId, questionId, value, participantId);
      
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
    const targetQ = questions[questionIndex];
    if (!targetQ) return;
    const secIdx = sections.findIndex(s => s.id === targetQ.sectionId);
    set({
      currentQuestionIndex: Math.max(0, Math.min(questionIndex, questions.length - 1)),
      currentSectionIndex: secIdx !== -1 ? secIdx : get().currentSectionIndex,
    });
  },

  getProgressPercentage: () => {
    const { answersById, questions } = get();
    const answeredCount = Object.keys(answersById).length;
    if (questions.length === 0) return 0;
    return Math.round((answeredCount / questions.length) * 100);
  },
}));

