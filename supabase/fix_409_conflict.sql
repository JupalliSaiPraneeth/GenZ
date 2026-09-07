-- =================================================================
-- FIX ALL 409 CONFLICT & 401 UNAUTHORIZED ERRORS IN SUPABASE
-- File: supabase/fix_409_conflict.sql
-- Run this script inside Supabase Dashboard ➔ SQL Editor
-- =================================================================

-- 1. Remove Foreign Key constraint on survey_responses.question_id
-- (This permits answers to any question even if survey_questions table isn't populated)
ALTER TABLE public.survey_responses 
  DROP CONSTRAINT IF EXISTS survey_responses_question_id_fkey;

-- 2. Drop any old unique constraint and recreate clean UNIQUE (session_id, question_id)
ALTER TABLE public.survey_responses 
  DROP CONSTRAINT IF EXISTS survey_responses_session_id_question_id_key;

ALTER TABLE public.survey_responses 
  DROP CONSTRAINT IF EXISTS survey_responses_session_id_question_id_idx;

-- Add strict UNIQUE constraint matching PostgREST onConflict target
ALTER TABLE public.survey_responses 
  ADD CONSTRAINT survey_responses_session_id_question_id_key UNIQUE (session_id, question_id);

-- 3. Add email column to anonymous_participants & make anonymous_participant_id nullable on survey_sessions
ALTER TABLE public.anonymous_participants 
  ADD COLUMN IF NOT EXISTS email VARCHAR(255);

ALTER TABLE public.survey_sessions 
  ADD COLUMN IF NOT EXISTS answered_questions_count INT NOT NULL DEFAULT 0;

ALTER TABLE public.survey_sessions 
  ALTER COLUMN anonymous_participant_id DROP NOT NULL;

-- 4. Create trigger to automatically update answered_questions_count on session
CREATE OR REPLACE FUNCTION public.update_survey_session_question_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.survey_sessions
    SET 
        answered_questions_count = (
            SELECT COUNT(DISTINCT question_id) 
            FROM public.survey_responses 
            WHERE session_id = COALESCE(NEW.session_id, OLD.session_id)
        ),
        last_activity_at = NOW()
    WHERE id = COALESCE(NEW.session_id, OLD.session_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_survey_session_question_count ON public.survey_responses;

CREATE TRIGGER trg_update_survey_session_question_count
AFTER INSERT OR UPDATE OR DELETE ON public.survey_responses
FOR EACH ROW EXECUTE FUNCTION public.update_survey_session_question_count();

-- 5. Enable RLS & Grant full permissions for anonymous users (anon role)
ALTER TABLE public.anonymous_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;

-- Anonymous Participants RLS
DROP POLICY IF EXISTS "Public anonymous_participants all" ON public.anonymous_participants;
CREATE POLICY "Public anonymous_participants all" 
  ON public.anonymous_participants FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Survey Sessions RLS
DROP POLICY IF EXISTS "Public survey_sessions all" ON public.survey_sessions;
CREATE POLICY "Public survey_sessions all" 
  ON public.survey_sessions FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Survey Responses RLS
DROP POLICY IF EXISTS "Public survey_responses all" ON public.survey_responses;
CREATE POLICY "Public survey_responses all" 
  ON public.survey_responses FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Survey Questions RLS
DROP POLICY IF EXISTS "Public survey_questions read" ON public.survey_questions;
CREATE POLICY "Public survey_questions read" 
  ON public.survey_questions FOR SELECT 
  USING (true);

-- Verify policies and constraints
SELECT 
    conname AS constraint_name, 
    contype AS constraint_type 
FROM pg_constraint 
WHERE conrelid = 'public.survey_responses'::regclass;
