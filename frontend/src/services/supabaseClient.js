import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sgafienfsdktmlraegvn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnYWZpZW5mc2RrdG1scmFlZ3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1ODc4NDAsImV4cCI6MjEwNDE2Mzg0MH0.lgH4BbG_k5mV2HVAd4TaMqnXKlR1YqGb-ukN18Ta62E';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to generate valid v4 UUID strings
 */
export function generateValidUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const ts = Date.now().toString(16).padStart(12, '0');
  return `a1000000-0000-4000-8000-${ts}`;
}

/**
 * Helper to check and ensure valid v4 UUID strings for Supabase UUID columns
 */
export function isValidUUID(uuidStr) {
  if (!uuidStr || typeof uuidStr !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuidStr);
}

export function ensureValidUUID(idStr) {
  if (isValidUUID(idStr)) return idStr;
  return generateValidUUID();
}

/**
 * Helper to convert question code/id into canonical key format (e.g. 'q1')
 */
export function toUuidQuestionId(questionId) {
  if (!questionId) return 'd0000000-0000-4000-8000-000000000001';
  const str = String(questionId).toLowerCase().trim();
  if (isValidUUID(str)) return str;
  const hex = Array.from(str).map((c) => c.charCodeAt(0).toString(16)).join('').padEnd(12, '0').slice(0, 12);
  return `d0000000-0000-4000-8000-${hex}`;
}

export function fromUuidQuestionId(uuidStr) {
  return String(uuidStr).toLowerCase();
}

/**
 * Register or Resume Participant in Supabase Database.
 * If email exists, returns existing participant to allow resuming session.
 */
export async function registerParticipant(participantName = '', email = '', deviceTimestamp = new Date().toISOString()) {
  try {
    const nameStr = participantName ? participantName.trim() : 'Anonymous Gen Z Participant';
    const emailStr = email ? email.trim().toLowerCase() : '';

    if (!emailStr) {
      return { error: 'Please enter a valid email address!' };
    }

    // 1. Check if email already exists in `participants` table
    const { data: existing } = await supabase
      .from('participants')
      .select('id, name, email, status, total_answers_count')
      .eq('email', emailStr)
      .maybeSingle();

    if (existing) {
      // Update participant name if provided and changed
      if (nameStr && nameStr !== existing.name) {
        try {
          await supabase
            .from('participants')
            .update({ name: nameStr, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
          existing.name = nameStr;
        } catch (e) {
          console.warn('Update participant name notice:', e);
        }
      }

      await logUserAction(existing.id, 'RESUME_PARTICIPANT', deviceTimestamp, { name: nameStr, email: emailStr });

      return {
        participant: existing,
        isResumed: true,
        error: null,
      };
    }

    // 2. Insert new participant row if email is not found
    const newId = generateValidUUID();
    const payload = {
      id: newId,
      name: nameStr,
      email: emailStr,
      status: 'in_progress',
      total_answers_count: 0,
      device_timestamp: deviceTimestamp,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'browser',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: created, error: insertErr } = await supabase
      .from('participants')
      .insert([payload])
      .select('id, name, email, status, total_answers_count')
      .single();

    if (insertErr) {
      // Unique constraint fallback: fetch existing participant by email
      if (insertErr.code === '23505' || insertErr.message?.includes('unique constraint') || insertErr.message?.includes('email')) {
        const { data: retryFetch } = await supabase
          .from('participants')
          .select('id, name, email, status, total_answers_count')
          .eq('email', emailStr)
          .maybeSingle();

        if (retryFetch) {
          return { participant: retryFetch, isResumed: true, error: null };
        }
      }
      console.warn('Supabase insert participant notice:', insertErr);
      return { participant: payload, isResumed: false, error: null };
    }

    // 3. Log user creation in `data_logs`
    await logUserAction(created.id, 'REGISTER_PARTICIPANT', deviceTimestamp, { name: nameStr, email: emailStr });

    return { participant: created, isResumed: false, error: null };
  } catch (err) {
    console.warn('registerParticipant exception:', err);
    return { error: null, participant: { id: generateValidUUID(), name: participantName, email }, isResumed: false };
  }
}

/**
 * Log Device Time Action in `data_logs`
 */
export async function logUserAction(participantId, action, deviceTimestamp = new Date().toISOString(), details = {}) {
  if (!participantId || !isSupabaseConfigured) return;
  try {
    const validId = isValidUUID(participantId) ? participantId : null;
    await supabase.from('data_logs').insert([
      {
        participant_id: validId,
        action,
        device_timestamp: deviceTimestamp,
        details,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch (e) {
    console.warn('logUserAction notice:', e);
  }
}

/**
 * Fetch all existing responses for a given participant from Supabase
 */
export async function fetchResponsesForParticipant(participantId) {
  if (!participantId) return {};
  try {
    const query = isValidUUID(participantId)
      ? supabase.from('survey_responses').select('question_id, question_code, response_value').or(`participant_id.eq.${participantId},session_id.eq.${participantId}`)
      : supabase.from('survey_responses').select('question_id, question_code, response_value').eq('session_id', participantId);

    const { data: responses, error } = await query;
    if (error || !responses) return {};

    const answersById = {};
    responses.forEach((r) => {
      const qKey = r.question_id || r.question_code?.toLowerCase();
      const val = typeof r.response_value === 'object' ? r.response_value?.value : r.response_value;
      if (qKey) answersById[qKey] = val;
    });

    return answersById;
  } catch (err) {
    console.warn('fetchResponsesForParticipant error:', err);
    return {};
  }
}

/**
 * Sync Survey Response Entry to Supabase immediately
 */
export async function syncResponseToSupabase(participantId, sessionId, questionCodeOrId, responseValue, deviceTimestamp = new Date().toISOString()) {
  try {
    const validParticipantId = ensureValidUUID(participantId);
    const validSessionId = sessionId ? String(sessionId) : validParticipantId;
    const qIdKey = String(questionCodeOrId).toLowerCase();
    const qCodeKey = String(questionCodeOrId).toUpperCase();

    // 1. Ensure participant row exists in `participants` table to avoid foreign key violation (23503)
    const { data: existingP } = await supabase
      .from('participants')
      .select('id')
      .eq('id', validParticipantId)
      .maybeSingle();

    if (!existingP) {
      await supabase.from('participants').insert([{
        id: validParticipantId,
        name: 'Gen Z Participant',
        email: `user_${validParticipantId.slice(0, 8)}@genzvoices.org`,
        status: 'in_progress',
        total_answers_count: 0,
        device_timestamp: deviceTimestamp,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);
    }

    // 2. Check if response row already exists in `survey_responses` to avoid 409 Conflict
    const { data: existingResp } = await supabase
      .from('survey_responses')
      .select('id')
      .eq('participant_id', validParticipantId)
      .eq('question_id', qIdKey)
      .maybeSingle();

    if (existingResp?.id) {
      const { error: updateErr } = await supabase
        .from('survey_responses')
        .update({
          session_id: validSessionId,
          question_code: qCodeKey,
          response_value: typeof responseValue === 'object' ? responseValue : { value: responseValue },
          device_timestamp: deviceTimestamp,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingResp.id);

      if (updateErr) {
        console.warn('Supabase update response notice:', updateErr.message);
      }
    } else {
      const { error: insertErr } = await supabase
        .from('survey_responses')
        .insert([payload]);

      if (insertErr) {
        // Fallback update if insert hits duplicate or race condition
        await supabase
          .from('survey_responses')
          .update({
            session_id: validSessionId,
            question_code: qCodeKey,
            response_value: typeof responseValue === 'object' ? responseValue : { value: responseValue },
            device_timestamp: deviceTimestamp,
            updated_at: new Date().toISOString(),
          })
          .eq('participant_id', validParticipantId)
          .eq('question_id', qIdKey);
      }
    }

    // 3. Count total answers and update `participants` table
    const { count } = await supabase
      .from('survey_responses')
      .select('id', { count: 'exact', head: true })
      .eq('participant_id', validParticipantId);

    const answeredCount = count || 1;
    const isCompleted = answeredCount >= 75;

    await supabase
      .from('participants')
      .update({
        total_answers_count: answeredCount,
        status: isCompleted ? 'completed' : 'in_progress',
        updated_at: new Date().toISOString(),
        device_timestamp: deviceTimestamp,
      })
      .eq('id', validParticipantId);

    // 4. Log action in `data_logs`
    await logUserAction(validParticipantId, 'SUBMIT_ANSWER', deviceTimestamp, { questionId: qIdKey, value: responseValue });

    return true;
  } catch (err) {
    console.warn('syncResponseToSupabase exception:', err);
    return false;
  }
}

/**
 * Mark Survey Status as Completed
 */
export async function completeParticipantSurvey(participantId, deviceTimestamp = new Date().toISOString()) {
  if (!participantId) return;
  try {
    await supabase
      .from('participants')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
        device_timestamp: deviceTimestamp,
      })
      .eq('id', participantId);

    await logUserAction(participantId, 'COMPLETE_SURVEY', deviceTimestamp, { status: 'completed' });
  } catch (e) {
    console.warn('completeParticipantSurvey exception:', e);
  }
}

/**
 * Fetch participant details and status (evaluation, certificate, lucky draw)
 */
export async function fetchParticipantStatus(participantIdOrEmail) {
  if (!participantIdOrEmail) return null;
  try {
    const isEmail = String(participantIdOrEmail).includes('@');
    const query = supabase.from('participants').select('*');
    const { data, error } = isEmail
      ? await query.eq('email', String(participantIdOrEmail).trim().toLowerCase()).maybeSingle()
      : await query.eq('id', participantIdOrEmail).maybeSingle();

    if (error || !data) return null;
    return data;
  } catch (err) {
    console.warn('fetchParticipantStatus error:', err);
    return null;
  }
}

/**
 * Admin Evaluation API: Evaluate responses, issue certificate code, announce lucky draw
 */
export async function evaluateParticipant(participantId, evaluationData = {}) {
  if (!participantId) return { error: 'Missing participant ID' };
  try {
    const {
      evaluation_status = 'approved',
      admin_notes = '',
      evaluated_by = 'Admin Research Team',
      certificate_status = 'issued',
      lucky_draw_status = 'eligible',
      lucky_draw_prize = '',
    } = evaluationData;

    const deviceTimestamp = new Date().toISOString();
    const updatePayload = {
      evaluation_status,
      evaluated_at: deviceTimestamp,
      evaluated_by,
      admin_notes,
      certificate_status,
      lucky_draw_status,
      lucky_draw_prize: lucky_draw_prize || null,
      lucky_draw_announced_at: deviceTimestamp,
      updated_at: deviceTimestamp,
    };

    if (certificate_status === 'issued') {
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      updatePayload.certificate_id = `CERT-GZ2026-${randomCode}`;
      updatePayload.certificate_issued_at = deviceTimestamp;
    }

    const { data, error } = await supabase
      .from('participants')
      .update(updatePayload)
      .eq('id', participantId)
      .select('*')
      .single();

    if (error) return { error: error.message };

    await logUserAction(participantId, 'ADMIN_EVALUATE', deviceTimestamp, {
      evaluation_status,
      certificate_id: updatePayload.certificate_id,
      lucky_draw_status,
      lucky_draw_prize,
    });

    return { data, error: null };
  } catch (err) {
    console.warn('evaluateParticipant error:', err);
    return { error: err.message || 'Failed to update evaluation' };
  }
}

let cachedAdminSystemParticipantId = null;

export async function getOrCreateAdminSystemParticipant() {
  if (cachedAdminSystemParticipantId) return cachedAdminSystemParticipantId;
  if (!isSupabaseConfigured) return null;

  try {
    const SYSTEM_ADMIN_EMAIL = 'admin_blueprint@genzvoices.org';
    const { data: existing } = await supabase
      .from('participants')
      .select('id')
      .eq('email', SYSTEM_ADMIN_EMAIL)
      .maybeSingle();

    if (existing?.id) {
      cachedAdminSystemParticipantId = existing.id;
      return existing.id;
    }

    const newId = generateValidUUID();
    const payload = {
      id: newId,
      name: 'ADMIN_BLUEPRINT_CONFIG',
      email: SYSTEM_ADMIN_EMAIL,
      status: 'completed',
      total_answers_count: 0,
      device_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: created, error } = await supabase
      .from('participants')
      .insert([payload])
      .select('id')
      .maybeSingle();

    if (created?.id) {
      cachedAdminSystemParticipantId = created.id;
      return created.id;
    }

    const { data: retryFetch } = await supabase
      .from('participants')
      .select('id')
      .eq('email', SYSTEM_ADMIN_EMAIL)
      .maybeSingle();

    if (retryFetch?.id) {
      cachedAdminSystemParticipantId = retryFetch.id;
      return retryFetch.id;
    }
  } catch (err) {
    console.warn('getOrCreateAdminSystemParticipant error:', err);
  }
  return null;
}

/**
 * Upsert question into Supabase `survey_questions` table
 */
async function upsertToSurveyQuestions(questionObj) {
  if (!questionObj || !isSupabaseConfigured) return false;
  try {
    const qId = String(questionObj.id).toLowerCase();
    const qCode = String(questionObj.code || questionObj.question_code || '').toUpperCase();
    const numOrder = typeof questionObj.display_order === 'number'
      ? questionObj.display_order
      : (parseInt(qCode.replace(/\D/g, ''), 10) || 1);

    const sqPayload = {
      id: qId,
      question_code: qCode,
      section_id: questionObj.sectionId || questionObj.section_id || 'sec-1',
      topic: questionObj.topic || 'General',
      question_text: questionObj.text || questionObj.question_text || '',
      display_order: numOrder,
    };

    const { error } = await supabase
      .from('survey_questions')
      .upsert([sqPayload], { onConflict: 'id' });

    if (!error) return true;

    // Handle 401 Unauthorized or 42501 RLS policy gracefully
    if (error.status === 401 || error.code === '42501') {
      console.info('Supabase survey_questions RLS notice: To enable direct DB writes for admin questions, run the RLS policies in Supabase SQL editor.');
      return false;
    }

    const { data: existing } = await supabase
      .from('survey_questions')
      .select('id')
      .eq('id', qId)
      .maybeSingle();

    if (existing?.id) {
      await supabase
        .from('survey_questions')
        .update(sqPayload)
        .eq('id', qId);
    } else {
      await supabase
        .from('survey_questions')
        .insert([sqPayload]);
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Log to `data_logs` table in Supabase
 */
async function logAdminAuditAction(action, details = {}) {
  if (!isSupabaseConfigured) return;
  try {
    const systemAdminId = await getOrCreateAdminSystemParticipant();
    await supabase.from('data_logs').insert([{
      participant_id: systemAdminId || null,
      action,
      device_timestamp: new Date().toISOString(),
      details,
      created_at: new Date().toISOString(),
    }]);
  } catch (e) {}
}

/**
 * Sync Question metadata & definition to Supabase DB (survey_questions & data_logs)
 */
export async function syncQuestionToSupabase(questionObj, action = 'UPSERT') {
  if (!questionObj || !isSupabaseConfigured) return false;
  try {
    const ok = await upsertToSurveyQuestions(questionObj);
    await logAdminAuditAction(`ADMIN_${action}_QUESTION`, { questionId: questionObj.id, code: questionObj.code });
    return ok;
  } catch (err) {
    return false;
  }
}

/**
 * Sync entire questions blueprint list to Supabase DB
 */
export async function syncAllQuestionsToSupabase(questionsList) {
  if (!Array.isArray(questionsList) || !isSupabaseConfigured) return;
  try {
    for (const q of questionsList) {
      await upsertToSurveyQuestions(q);
    }
    await logAdminAuditAction('SYNC_QUESTION_BLUEPRINT', { totalQuestions: questionsList.length });
  } catch (e) {
    console.warn('syncAllQuestionsToSupabase notice:', e);
  }
}

/**
 * Delete Question from Supabase DB
 */
export async function deleteQuestionFromSupabase(questionId) {
  if (!questionId || !isSupabaseConfigured) return false;
  try {
    const qIdKey = String(questionId).toLowerCase();
    const { error } = await supabase.from('survey_questions').delete().eq('id', qIdKey);
    if (!error) {
      await logAdminAuditAction('ADMIN_DELETE_QUESTION', { questionId: qIdKey });
      return true;
    }
    if (error.status === 401 || error.code === '42501') {
      console.info('Supabase survey_questions delete notice: RLS policy grant required in SQL editor.');
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Fetch stored questions blueprint from Supabase DB
 */
export async function fetchQuestionsFromSupabase() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data: qData, error } = await supabase
      .from('survey_questions')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && qData && qData.length > 0) {
      return qData.map((item) => ({
        id: String(item.id).toLowerCase(),
        code: String(item.question_code || '').toUpperCase(),
        sectionId: item.section_id || 'sec-1',
        topic: item.topic || 'General',
        text: item.question_text || '',
        display_order: item.display_order,
      }));
    }
  } catch (err) {
    console.warn('fetchQuestionsFromSupabase notice:', err);
  }
  return null;
}

/**
 * Fetch stored audit logs from Supabase DB `data_logs` table
 */
export async function fetchAuditLogsFromSupabase() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('data_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        id: item.id,
        timestamp: item.device_timestamp || item.created_at,
        action: item.action,
        target: item.details?.target || item.details?.questionId || item.details?.email || 'System Record',
        status: 'SUCCESS',
        details: typeof item.details === 'object' ? JSON.stringify(item.details) : String(item.details || 'System Action'),
        actor: 'admin',
      }));
    }
  } catch (e) {
    console.warn('fetchAuditLogsFromSupabase notice:', e);
  }
  return [];
}

// Backward compatibility exports
export const createNewParticipant = registerParticipant;
export const findOrCreateParticipantByEmail = registerParticipant;
export const getOrCreateAnonymousParticipant = registerParticipant;
export const ensureSurveySessionInSupabase = async () => true;
export const fetchResponsesForSession = fetchResponsesForParticipant;
