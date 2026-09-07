import Dexie from 'dexie';

// Initialize Gen Z Voices IndexedDB Database
export const db = new Dexie('GenZVoicesLocalDB');

db.version(1).stores({
  surveyDrafts: 'sessionId, currentCategory, currentQuestion, percentage, updatedAt',
  answersQueue: 'id, sessionId, questionId, responseValue, synced, timestamp',
  sessionState: 'key, value',
});

// Offline Save Helper
export async function saveAnswerLocally(sessionId, questionId, responseValue) {
  const timestamp = new Date().toISOString();
  await db.answersQueue.put({
    id: `${sessionId}_${questionId}`,
    sessionId,
    questionId,
    responseValue,
    synced: 0, // 0 = unsynced, 1 = synced (IndexedDB supports numbers, not booleans as keys)
    timestamp,
  });
}

// Fetch Unsynced Queue safely
export async function getUnsyncedAnswers() {
  try {
    return await db.answersQueue.where('synced').equals(0).toArray();
  } catch (err) {
    const all = await db.answersQueue.toArray();
    return all.filter((item) => !item.synced || item.synced === 0);
  }
}

// Mark Answer Synced
export async function markAnswerSynced(id) {
  try {
    await db.answersQueue.update(id, { synced: 1 });
  } catch (err) {
    // Ignore if row doesn't exist
  }
}

