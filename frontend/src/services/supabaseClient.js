import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sgafienfsdktmlraegvn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnYWZpZW5mc2RrdG1scmFlZ3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1ODc4NDAsImV4cCI6MjEwNDE2Mzg0MH0.lgH4BbG_k5mV2HVAd4TaMqnXKlR1YqGb-ukN18Ta62E';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to convert question identifiers (e.g. 'q1') into valid PostgreSQL UUIDs
 */
export function toUuidQuestionId(questionId) {
  if (typeof questionId === 'string' && questionId.includes('-') && questionId.length === 36) {
    return questionId;
  }
  const numMatch = String(questionId).match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0], 10) : 1;
  const hexNum = num.toString(16).padStart(12, '0');
  return `d0000000-0000-0000-0000-${hexNum}`;
}

/**
 * Helper to generate valid v4 UUID strings for sessions
 */
export function generateValidUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const ts = Date.now().toString(16).padStart(12, '0');
  return `a1000000-0000-4000-8000-${ts}`;
}

/**
 * Helper to convert PostgreSQL UUID question IDs back into frontend question keys (e.g. 'd0...01' -> 'q1')
 */
export function fromUuidQuestionId(uuidStr) {
  if (typeof uuidStr === 'string' && uuidStr.includes('-')) {
    const parts = uuidStr.split('-');
    const hexNum = parts[parts.length - 1];
    const num = parseInt(hexNum, 16);
    if (!isNaN(num) && num >= 1 && num <= 300) {
      return `q${num}`;
    }
  }
  return uuidStr;
}

/**
 * Create a NEW Participant Entry in Supabase Database (Guarantees every user's name is saved as a new record)
 */
export async function createNewParticipant(participantName = '', email = '') {
  try {
    const nameStr = participantName ? participantName.trim() : 'Anonymous Gen Z Participant';
    const emailStr = email ? email.trim().toLowerCase() : '';
    const newToken = generateValidUUID();

    // Standard payload using JSONB demographic_metadata (compatible across all DB schemas)
    const payload = {
      anonymous_token: newToken,
      demographic_metadata: {
        name: nameStr,
        email: emailStr,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'browser',
        created_at: new Date().toISOString(),
      },
    };

    // Include top-level email if added to schema
    if (emailStr) {
      payload.email = emailStr;
    }

    // Insert a brand new row in anonymous_participants
    const { data: created, error: insertErr } = await supabase
      .from('anonymous_participants')
      .insert([payload])
      .select('id, anonymous_token, demographic_metadata')
      .maybeSingle();

    if (!insertErr && created) {
      return created;
    }

    // Fallback insert without top-level email if column doesn't exist yet
    delete payload.email;
    const { data: createdFallback, error: fallbackErr } = await supabase
      .from('anonymous_participants')
      .insert([payload])
      .select('id, anonymous_token, demographic_metadata')
      .maybeSingle();

    if (!fallbackErr && createdFallback) {
      return createdFallback;
    }

    return { id: newToken, anonymous_token: newToken, demographic_metadata: payload.demographic_metadata };
  } catch (err) {
    console.warn('Supabase create participant error:', err);
    return { id: generateValidUUID(), anonymous_token: generateValidUUID(), demographic_metadata: { name: participantName, email } };
  }
}

/**
 * Fetch all existing responses for a given sessionId from Supabase
 */
export async function fetchResponsesForSession(sessionId) {
  if (!sessionId) return {};
  try {
    const { data: responses, error } = await supabase
      .from('survey_responses')
      .select('question_id, response_value')
      .eq('session_id', sessionId);

    if (error || !responses) return {};

    const answersById = {};
    responses.forEach(r => {
      const rawId = r.response_value?.question_raw_id;
      const convertedKey = fromUuidQuestionId(r.question_id);
      const val = r.response_value?.value ?? r.response_value;

      if (rawId) answersById[rawId] = val;
      if (convertedKey) answersById[convertedKey] = val;
      answersById[r.question_id] = val;
    });

    return answersById;
  } catch (err) {
    console.warn('fetchResponsesForSession error:', err);
    return {};
  }
}

/**
 * Find existing participant by email or create a new participant row.
 * If email exists, returns existing participant + previous session responses to resume survey.
 */
export async function findOrCreateParticipantByEmail(participantName = '', email = '') {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanName = participantName ? participantName.trim() : 'Anonymous Gen Z Participant';

  try {
    if (cleanEmail) {
      // 1. Query anonymous_participants to see if this email exists
      const { data: participants } = await supabase
        .from('anonymous_participants')
        .select('id, anonymous_token, demographic_metadata');

      let existingParticipant = null;
      if (participants && participants.length > 0) {
        existingParticipant = participants.find(p => 
          p.demographic_metadata && 
          p.demographic_metadata.email && 
          p.demographic_metadata.email.toLowerCase() === cleanEmail
        );
      }

      if (existingParticipant) {
        // Participant with this email ALREADY exists! Update name if changed
        if (cleanName && existingParticipant.demographic_metadata?.name !== cleanName) {
          existingParticipant.demographic_metadata.name = cleanName;
          await supabase
            .from('anonymous_participants')
            .update({ demographic_metadata: existingParticipant.demographic_metadata })
            .eq('id', existingParticipant.id);
        }

        // Fetch all survey_sessions for this participant
        const { data: sessions } = await supabase
          .from('survey_sessions')
          .select('id')
          .eq('anonymous_participant_id', existingParticipant.id)
          .order('started_at', { ascending: false });

        let sessionId = sessions && sessions.length > 0 ? sessions[0].id : null;
        if (!sessionId) {
          sessionId = generateValidUUID();
          await ensureSurveySessionInSupabase(sessionId, existingParticipant.id);
        }

        const sessionIds = (sessions || []).map(s => s.id);
        if (sessionId && !sessionIds.includes(sessionId)) {
          sessionIds.push(sessionId);
        }

        // Fetch all existing survey_responses for all sessions of this participant
        const { data: responses } = await supabase
          .from('survey_responses')
          .select('question_id, response_value')
          .in('session_id', sessionIds);

        const answersById = {};
        if (responses && responses.length > 0) {
          responses.forEach(r => {
            const rawId = r.response_value?.question_raw_id;
            const convertedKey = fromUuidQuestionId(r.question_id);
            const val = r.response_value?.value ?? r.response_value;

            if (rawId) answersById[rawId] = val;
            if (convertedKey) answersById[convertedKey] = val;
            answersById[r.question_id] = val;
          });
        }

        return {
          isExisting: true,
          participant: existingParticipant,
          sessionId,
          answersById,
        };
      }
    }

    // 2. Email not found or not provided: Create a NEW participant record
    const newParticipant = await createNewParticipant(cleanName, cleanEmail);
    const newSessionId = generateValidUUID();
    await ensureSurveySessionInSupabase(newSessionId, newParticipant.id);

    return {
      isExisting: false,
      participant: newParticipant,
      sessionId: newSessionId,
      answersById: {},
    };
  } catch (err) {
    console.warn('findOrCreateParticipantByEmail exception:', err);
    const fallbackSession = generateValidUUID();
    return {
      isExisting: false,
      participant: { id: fallbackSession, demographic_metadata: { name: cleanName, email: cleanEmail } },
      sessionId: fallbackSession,
      answersById: {},
    };
  }
}

/**
 * Initialize or Fetch Anonymous Survey Session on Supabase with Participant Name
 */
export async function getOrCreateAnonymousParticipant(token, participantName = '') {
  try {
    const nameStr = participantName ? participantName.trim() : 'Anonymous Gen Z Participant';
    const payload = {
      anonymous_token: token,
      demographic_metadata: {
        name: nameStr,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'browser',
        created_at: new Date().toISOString(),
      },
    };

    // Try upsert with select to return the actual database primary key 'id'
    const { data: created, error: upsertErr } = await supabase
      .from('anonymous_participants')
      .upsert([payload], { onConflict: 'anonymous_token' })
      .select('id, anonymous_token, demographic_metadata')
      .maybeSingle();

    if (!upsertErr && created) {
      return created;
    }

    // Fallback upsert without select if RLS SELECT is restricted
    await supabase.from('anonymous_participants').upsert([payload], { onConflict: 'anonymous_token' });
    
    // Try fetching by token
    const { data: fetched } = await supabase
      .from('anonymous_participants')
      .select('id, anonymous_token, demographic_metadata')
      .eq('anonymous_token', token)
      .maybeSingle();

    if (fetched) return fetched;

    return { id: token, anonymous_token: token, demographic_metadata: payload.demographic_metadata };
  } catch (err) {
    console.warn('Supabase participant save exception:', err);
    return { id: token, anonymous_token: token, demographic_metadata: { name: participantName } };
  }
}

/**
 * Ensure Survey Session Record exists in Supabase
 */
export async function ensureSurveySessionInSupabase(sessionId, participantId = null) {
  try {
    // 1. Check if session already exists in database
    const { data: existingSession } = await supabase
      .from('survey_sessions')
      .select('id, anonymous_participant_id')
      .eq('id', sessionId)
      .maybeSingle();

    if (existingSession && existingSession.anonymous_participant_id && !participantId) {
      // Session ALREADY exists and is linked to a real participant -> Return without overwriting!
      return existingSession;
    }

    let activeParticipantId = participantId || existingSession?.anonymous_participant_id;

    // 2. Only if no session exists AND no participantId supplied, create default participant
    if (!activeParticipantId && !existingSession) {
      const defaultParticipant = await createNewParticipant('Anonymous Participant');
      activeParticipantId = defaultParticipant?.id;
    }

    const payload = {
      id: sessionId,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    };

    if (activeParticipantId) {
      payload.anonymous_participant_id = activeParticipantId;
    }

    const { error } = await supabase
      .from('survey_sessions')
      .upsert([payload], { onConflict: 'id' });

    if (error) {
      console.warn('Supabase session notice:', error.message);
    }
    return payload;
  } catch (err) {
    console.warn('Supabase session exception:', err);
    return null;
  }
}

/**
 * Sync Survey Response Entry to Supabase immediately (all 207 questions)
 */
export async function syncResponseToSupabase(sessionId, questionCodeOrId, responseValue) {
  try {
    // 1. Ensure survey session exists in Supabase first
    await ensureSurveySessionInSupabase(sessionId);

    const uuidQuestionId = toUuidQuestionId(questionCodeOrId);
    const payload = {
      session_id: sessionId,
      question_id: uuidQuestionId,
      response_value: { value: responseValue, question_raw_id: questionCodeOrId },
      updated_at: new Date().toISOString(),
    };

    // 2. Always attempt PATCH (UPDATE) first to modify existing response without triggering 409 Conflict
    const { data: updated, error: updateErr } = await supabase
      .from('survey_responses')
      .update({
        response_value: payload.response_value,
        updated_at: payload.updated_at,
      })
      .eq('session_id', sessionId)
      .eq('question_id', uuidQuestionId)
      .select('id');

    if (!updateErr && updated && updated.length > 0) {
      return true; // Successfully updated existing response!
    }

    // 3. If 0 rows were updated, this is a brand new question answer -> perform INSERT (POST)
    const { error: insertErr } = await supabase
      .from('survey_responses')
      .insert([payload]);

    if (!insertErr) {
      return true;
    }

    // 4. Fallback update in case of millisecond race conditions
    const { error: fallbackUpdateErr } = await supabase
      .from('survey_responses')
      .update({
        response_value: payload.response_value,
        updated_at: payload.updated_at,
      })
      .eq('session_id', sessionId)
      .eq('question_id', uuidQuestionId);

    return !fallbackUpdateErr;
  } catch (err) {
    return false;
  }
}

