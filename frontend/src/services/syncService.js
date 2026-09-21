import { getUnsyncedAnswers, markAnswerSynced } from './db';
import { syncResponseToSupabase, isSupabaseConfigured, subscribeToQuestionsRealtime } from './supabaseClient';
import { useSurveyStore } from '../stores/surveyStore';

class SyncService {
  constructor() {
    this.isSyncing = false;
    this.realtimeChannel = null;
  }

  startAutoSync(intervalMs = 10000) {
    if (typeof window === 'undefined') return;

    // Trigger sync on online event
    window.addEventListener('online', () => {
      this.syncPendingAnswers();
      useSurveyStore.getState().loadQuestionsFromSupabase();
    });

    // 1. Subscribe to Live Realtime changes on `survey_questions` table across all clients
    if (isSupabaseConfigured && !this.realtimeChannel) {
      this.realtimeChannel = subscribeToQuestionsRealtime(() => {
        useSurveyStore.getState().loadQuestionsFromSupabase();
      });
    }

    // 2. Periodic sync timer for pending responses & questions blueprint refresh
    setInterval(() => {
      if (navigator.onLine) {
        this.syncPendingAnswers();
        useSurveyStore.getState().loadQuestionsFromSupabase();
      }
    }, intervalMs);
  }

  async syncPendingAnswers() {
    if (this.isSyncing || !isSupabaseConfigured) return;
    this.isSyncing = true;

    try {
      const pendingQueue = await getUnsyncedAnswers();
      if (!pendingQueue || pendingQueue.length === 0) {
        this.isSyncing = false;
        return;
      }

      for (const item of pendingQueue) {
        // Prevent endless retries if item failed more than 3 times
        if (item.retryCount && item.retryCount >= 3) {
          continue;
        }

        const success = await syncResponseToSupabase(
          item.sessionId,
          item.questionId,
          item.responseValue
        );

        if (success) {
          await markAnswerSynced(item.id);
        } else {
          item.retryCount = (item.retryCount || 0) + 1;
        }
      }
    } catch (err) {
      console.warn('Sync queue process notice:', err);
    } finally {
      this.isSyncing = false;
    }
  }
}

export const syncService = new SyncService();
