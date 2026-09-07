import { getUnsyncedAnswers, markAnswerSynced } from './db';
import { syncResponseToSupabase, isSupabaseConfigured } from './supabaseClient';

class SyncService {
  constructor() {
    this.isSyncing = false;
  }

  startAutoSync(intervalMs = 10000) {
    if (typeof window === 'undefined') return;

    // Trigger sync on online event
    window.addEventListener('online', () => this.syncPendingAnswers());

    // Periodic sync timer
    setInterval(() => {
      if (navigator.onLine) {
        this.syncPendingAnswers();
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
