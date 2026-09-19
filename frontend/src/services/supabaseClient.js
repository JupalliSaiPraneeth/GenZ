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
export async function registerParticipant(participantName = '', email = '', deviceTimestamp = new Date().toISOString(), sessionId = null) {
  try {
    const nameStr = participantName ? participantName.trim() : '';
    const emailStr = email ? email.trim().toLowerCase() : '';

    if (!nameStr) {
      return { error: 'Full name is required to register!' };
    }

    if (!emailStr) {
      return { error: 'A valid email address is required to register!' };
    }

    const validSessionId = sessionId ? ensureValidUUID(sessionId) : null;

    // 1. Check if email already exists in `participants` table
    const { data: existing } = await supabase
      .from('participants')
      .select('id, name, email, status, total_answers_count, device_timestamp, created_at, updated_at')
      .eq('email', emailStr)
      .maybeSingle();

    if (existing) {
      const loginTime = new Date().toISOString();
      const startedAt = existing.device_timestamp || existing.created_at || loginTime;

      // Update name and updated_at for existing participant
      const { data: updatedP } = await supabase
        .from('participants')
        .update({
          name: nameStr.trim(),
          updated_at: loginTime,
        })
        .eq('id', existing.id)
        .select('*')
        .maybeSingle();

      const updatedRecord = updatedP || { ...existing, name: nameStr.trim() };

      // If responses were recorded under a temporary session ID before user logged in with existing email:
      if (validSessionId && validSessionId !== existing.id) {
        // Re-link responses to the registered user's ID
        await supabase
          .from('survey_responses')
          .update({ participant_id: existing.id })
          .or(`participant_id.eq.${validSessionId},session_id.eq.${validSessionId}`);
      }

      return {
        participant: { ...updatedRecord, started_at: startedAt },
        isResumed: true,
        error: null,
      };
    }

    // 2. Email is not in database yet.
    // Check if a temporary session participant row exists for this sessionId
    let existingSessionP = null;
    if (validSessionId) {
      const { data: tempP } = await supabase
        .from('participants')
        .select('id, name, email, created_at')
        .eq('id', validSessionId)
        .maybeSingle();
      existingSessionP = tempP;
    }

    const nowIso = new Date().toISOString();

    if (existingSessionP) {
      // UPDATE the temporary session participant row in-place with user's real name & email
      const { data: updated, error: updateErr } = await supabase
        .from('participants')
        .update({
          name: nameStr,
          email: emailStr,
          device_timestamp: deviceTimestamp,
          updated_at: nowIso,
        })
        .eq('id', validSessionId)
        .select('id, name, email, status, total_answers_count, created_at')
        .single();

      if (!updateErr && updated) {
        await logUserAction(updated.id, 'REGISTER_PARTICIPANT', deviceTimestamp, { name: nameStr, email: emailStr, started_at: updated.created_at || nowIso });
        return { participant: { ...updated, started_at: updated.created_at || nowIso }, isResumed: false, error: null };
      }
    }

    // 3. If no temporary session row exists, insert new participant with validSessionId or new UUID
    const targetId = validSessionId || generateValidUUID();
    const payload = {
      id: targetId,
      name: nameStr,
      email: emailStr,
      status: 'in_progress',
      total_answers_count: 0,
      device_timestamp: deviceTimestamp,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'browser',
      created_at: nowIso,
      updated_at: nowIso,
    };

    const { data: created, error: insertErr } = await supabase
      .from('participants')
      .insert([payload])
      .select('id, name, email, status, total_answers_count, created_at')
      .single();

    if (insertErr) {
      if (insertErr.code === '23505' || insertErr.message?.includes('unique constraint') || insertErr.message?.includes('email')) {
        const { data: retryExisting } = await supabase
          .from('participants')
          .select('id, name, email, status, total_answers_count')
          .eq('email', emailStr)
          .maybeSingle();

        if (retryExisting) {
          const retryNameNormalized = (retryExisting.name || '').trim().toLowerCase();
          if (retryNameNormalized === nameStr.trim().toLowerCase()) {
            return { participant: retryExisting, isResumed: true, error: null };
          }
        }

        return {
          participant: null,
          isResumed: false,
          error: `This email address (${emailStr}) is already registered under a different name in our database. Please enter the correct matching name to log in, or use a different email address.`,
        };
      }
      console.warn('Supabase insert participant notice:', insertErr);
      return { participant: payload, isResumed: false, error: null };
    }

    // Re-link any responses answered under validSessionId to targetId
    if (validSessionId && validSessionId !== created.id) {
      await supabase
        .from('survey_responses')
        .update({ participant_id: created.id })
        .or(`participant_id.eq.${validSessionId},session_id.eq.${validSessionId}`);
    }

    // Log user creation in `data_logs`
    await logUserAction(created.id, 'REGISTER_PARTICIPANT', deviceTimestamp, { name: nameStr, email: emailStr });

    return { participant: created, isResumed: false, error: null };
  } catch (err) {
    console.warn('registerParticipant exception:', err);
    return { error: 'An error occurred during registration. Please try again.', participant: null, isResumed: false };
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
      const qKey = String(r.question_id || '').toLowerCase();
      const qCodeKey = String(r.question_code || '').toLowerCase();
      const val = typeof r.response_value === 'object' ? r.response_value?.value : r.response_value;
      if (qKey) answersById[qKey] = val;
      if (qCodeKey) answersById[qCodeKey] = val;
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
    try {
      await supabase.from('participants').upsert(
        [
          {
            id: validParticipantId,
            name: 'Gen Z Participant',
            email: `user_${validParticipantId.slice(0, 8)}@genzvoices.org`,
            status: 'in_progress',
            total_answers_count: 0,
            device_timestamp: deviceTimestamp,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: 'id', ignoreDuplicates: true }
      );
    } catch (pErr) {
      // Ignore background participant init notices
    }

    const payload = {
      participant_id: validParticipantId,
      session_id: validSessionId,
      question_id: qIdKey,
      question_code: qCodeKey,
      response_value: typeof responseValue === 'object' ? responseValue : { value: responseValue },
      device_timestamp: deviceTimestamp,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 2. Native Upsert in `survey_responses` to eliminate 409 Conflict
    const { error: upsertErr } = await supabase
      .from('survey_responses')
      .upsert(payload, { onConflict: 'participant_id,question_id' });

    if (upsertErr) {
      // Fallback 1: Try onConflict on session_id,question_id
      const { error: sessionUpsertErr } = await supabase
        .from('survey_responses')
        .upsert(payload, { onConflict: 'session_id,question_id' });

      if (sessionUpsertErr) {
        // Fallback 2: Manual update
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
    const { count: totalQuestionsCount } = await supabase
      .from('survey_questions')
      .select('id', { count: 'exact', head: true });

    const requiredCount = totalQuestionsCount || 75;
    const isCompleted = answeredCount >= requiredCount;

    const localActiveSec = Number(localStorage.getItem(`genz_active_seconds_${validParticipantId}`) || localStorage.getItem('genz_active_seconds')) || null;

    const updatePayload = {
      total_answers_count: answeredCount,
      status: isCompleted ? 'completed' : 'in_progress',
      updated_at: new Date().toISOString(),
      device_timestamp: deviceTimestamp,
    };
    if (localActiveSec && localActiveSec > 0) {
      updatePayload.active_seconds = localActiveSec;
    }

    await supabase
      .from('participants')
      .update(updatePayload)
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
  if (!participantId || !isValidUUID(participantId)) return;
  try {
    const completedAt = new Date().toISOString();

    await logUserAction(participantId, 'COMPLETE_SURVEY', deviceTimestamp, {
      status: 'completed',
      completed_at: completedAt,
    });

    await supabase
      .from('participants')
      .update({
        status: 'completed',
        updated_at: completedAt,
        device_timestamp: deviceTimestamp,
      })
      .eq('id', participantId);
  } catch (e) {
    console.warn('completeParticipantSurvey notice:', e);
  }
}

/**
 * Fetch participant details and status (evaluation, certificate, lucky draw)
 */
export async function fetchParticipantStatus(participantIdOrEmail) {
  if (!participantIdOrEmail) return null;
  try {
    const isEmail = String(participantIdOrEmail).includes('@');
    const isUuid = isValidUUID(participantIdOrEmail);

    const query = supabase.from('participants').select('*');
    let res = null;

    if (isEmail) {
      res = await query.eq('email', String(participantIdOrEmail).trim().toLowerCase()).maybeSingle();
    } else if (isUuid) {
      res = await query.eq('id', participantIdOrEmail).maybeSingle();
    } else {
      res = await query.eq('certificate_id', String(participantIdOrEmail).trim()).maybeSingle();
    }

    if (res?.error || !res?.data) return null;
    return res.data;
  } catch (err) {
    console.warn('fetchParticipantStatus notice:', err);
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
  if (!questionObj || !isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured.' };
  }
  try {
    const qId = String(questionObj.id).toLowerCase();
    const qCode = String(questionObj.code || questionObj.question_code || '').toUpperCase();
    const numOrder = typeof questionObj.display_order === 'number'
      ? questionObj.display_order
      : (parseInt(qCode.replace(/\D/g, ''), 10) || 1);

    const formattedOptions = Array.isArray(questionObj.options)
      ? questionObj.options
      : (typeof questionObj.options === 'string' ? JSON.parse(questionObj.options) : null);

    const fullPayload = {
      id: qId,
      question_code: qCode,
      section_id: questionObj.sectionId || questionObj.section_id || 'sec-1',
      topic: questionObj.topic || 'General',
      question_text: questionObj.text || questionObj.question_text || '',
      display_order: numOrder,
      options: formattedOptions,
      selection_type: questionObj.selectionType || (questionObj.isMultiSelect ? 'multiple' : 'single'),
      is_multi_select: Boolean(questionObj.isMultiSelect || questionObj.selectionType === 'multiple'),
    };

    // 1. Try explicit UPDATE first for existing questions to directly persist options & schema fields
    const updatePayload = {
      question_code: qCode,
      section_id: fullPayload.section_id,
      topic: fullPayload.topic,
      question_text: fullPayload.question_text,
      display_order: fullPayload.display_order,
      options: formattedOptions,
      selection_type: fullPayload.selection_type,
      is_multi_select: fullPayload.is_multi_select,
    };

    const { error: updateErr, data: updatedData } = await supabase
      .from('survey_questions')
      .update(updatePayload)
      .eq('id', qId)
      .select();

    if (!updateErr && updatedData && updatedData.length > 0) {
      return { success: true };
    }

    // 2. Try full payload upsert
    const { error: fullErr } = await supabase
      .from('survey_questions')
      .upsert([fullPayload], { onConflict: 'id' });

    if (!fullErr) return { success: true };

    console.warn(`Supabase full upsert notice for ${qId}:`, fullErr?.message);

    // If display_order unique constraint clash occurs (23505), fetch current MAX display_order and retry with next unique order
    if (fullErr?.code === '23505' || fullErr?.message?.includes('display_order')) {
      try {
        const { data: maxRow } = await supabase
          .from('survey_questions')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1)
          .maybeSingle();

        const safeOrder = (maxRow?.display_order || 0) + 1;
        fullPayload.display_order = safeOrder;

        const { error: retryErr } = await supabase
          .from('survey_questions')
          .upsert([fullPayload], { onConflict: 'id' });

        if (!retryErr) return { success: true };
      } catch (retryE) {
        console.warn('display_order retry exception:', retryE);
      }
    }

    // Fallback payload: Keep options, selection_type & is_multi_select, omit topic column in case topic column is missing
    const payloadNoTopic = { ...fullPayload };
    delete payloadNoTopic.topic;

    const { error: noTopicErr } = await supabase
      .from('survey_questions')
      .upsert([payloadNoTopic], { onConflict: 'id' });

    if (!noTopicErr) return { success: true };

    console.error(`Supabase upsert error for ${qId}:`, noTopicErr.message || fullErr?.message);
    return { success: false, error: noTopicErr.message || fullErr?.message };
  } catch (e) {
    console.error('upsertToSurveyQuestions exception:', e);
    return { success: false, error: e.message || 'Unexpected exception' };
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
  } catch (e) { }
}

/**
 * Sync Question metadata & definition to Supabase DB (survey_questions & data_logs)
 */
export async function syncQuestionToSupabase(questionObj, action = 'UPSERT') {
  if (!questionObj || !isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured.' };
  }
  try {
    const res = await upsertToSurveyQuestions(questionObj);
    logAdminAuditAction(`ADMIN_${action}_QUESTION`, { questionId: questionObj.id, code: questionObj.code }).catch(() => { });
    return res;
  } catch (err) {
    return { success: false, error: err.message };
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
        options: Array.isArray(item.options)
          ? item.options
          : (typeof item.options === 'string' ? JSON.parse(item.options) : null),
        selectionType: item.selection_type || (item.is_multi_select ? 'multiple' : 'single'),
        isMultiSelect: Boolean(item.is_multi_select || item.selection_type === 'multiple'),
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
    // 1. Fetch participants map from Supabase DB to resolve participant_id -> participant name
    const { data: pData } = await supabase
      .from('participants')
      .select('id, name, email');

    const pMap = new Map();
    if (pData && pData.length > 0) {
      pData.forEach((p) => {
        const displayName = (p.name && p.name !== 'Gen Z Participant' && p.name !== 'ADMIN_BLUEPRINT_CONFIG')
          ? p.name
          : (p.email ? p.email.split('@')[0] : 'Gen Z Participant');
        if (p.id) pMap.set(p.id, displayName);
      });
    }

    // 2. Fetch logs from data_logs table
    const { data, error } = await supabase
      .from('data_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (!error && data && data.length > 0) {
      return data.map((item) => {
        let actorName = 'admin';
        if (item.action.startsWith('ADMIN_') || item.action === 'LOGIN' || item.action === 'LOGOUT') {
          actorName = 'admin';
        } else if (item.participant_id && pMap.has(item.participant_id)) {
          actorName = pMap.get(item.participant_id);
        } else if (item.details?.participantName) {
          actorName = item.details.participantName;
        } else if (item.details?.name) {
          actorName = item.details.name;
        } else if (item.details?.email) {
          actorName = item.details.email.split('@')[0];
        } else if (item.participant_id) {
          actorName = `Participant ${item.participant_id.slice(0, 8)}`;
        } else {
          actorName = 'system';
        }

        return {
          id: item.id,
          timestamp: item.device_timestamp || item.created_at,
          action: item.action,
          target: item.details?.questionId || item.details?.target || item.details?.email || 'System Record',
          status: 'SUCCESS',
          details: typeof item.details === 'object' ? JSON.stringify(item.details) : String(item.details || 'System Action'),
          actor: actorName,
          actorName: actorName,
          participantId: item.participant_id
        };
      });
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

/**
 * Initiates Google OAuth authentication via Supabase Auth
 */
export async function signInWithGoogle(redirectToUrl) {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase is not configured' };
  }
  try {
    const origin = (typeof window !== 'undefined' && window.location.origin)
      ? window.location.origin
      : (import.meta.env.VITE_SITE_URL || '');
    const redirect = redirectToUrl || `${origin}/survey`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirect,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error signing in with Google:', err);
    return { data: null, error: err.message || 'Google Sign-In failed' };
  }
}

/**
 * Gets active Supabase Auth user session if logged in via OAuth
 */
export async function getGoogleAuthSession() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) return null;
    return session.user;
  } catch (e) {
    console.warn('Error fetching auth session:', e);
    return null;
  }
}

