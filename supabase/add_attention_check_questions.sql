-- =================================================================
-- GEN Z VOICES — ATTENTION CHECK QUESTIONS & TRACKING SCHEMA MIGRATION
-- Adds 3 Attention Check Questions after Q20, Q40, and Q64
-- Stores expected correct answers in DB and evaluates participant attention
-- =================================================================

BEGIN;

-- 1. Drop rigid unique constraint on display_order if it exists (prevents error 23505)
ALTER TABLE public.survey_questions DROP CONSTRAINT IF EXISTS survey_questions_display_order_key;

-- 2. Add correct_answer and is_attention_check columns to survey_questions if missing
ALTER TABLE public.survey_questions ADD COLUMN IF NOT EXISTS correct_answer TEXT;
ALTER TABLE public.survey_questions ADD COLUMN IF NOT EXISTS is_attention_check BOOLEAN DEFAULT false;

-- 3. Add attention_check_score and attention_check_passed columns to participants table if missing
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS attention_check_score INTEGER DEFAULT 0;
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS attention_check_passed BOOLEAN DEFAULT false;

-- 4. Upsert the 3 Attention-Check Questions into public.survey_questions table
-- Question 1: After Q20 (display_order = 201)
-- Question 2: After Q40 (display_order = 401)
-- Question 3: After Q64 (display_order = 999)
INSERT INTO public.survey_questions
    (id, question_code, section_id, topic, question_text, display_order, options, selection_type, is_multi_select, correct_answer, is_attention_check)
VALUES
('ac1', 'AC1', 'sec-1', 'Attention Check', 'To show that you are reading each question carefully, please select "Agree" for this question.', 201, '[{"label":"Strongly Disagree","value":"strongly_disagree"},{"label":"Disagree","value":"disagree"},{"label":"Neutral","value":"neutral"},{"label":"Agree","value":"agree"},{"label":"Strongly Agree","value":"strongly_agree"}]'::jsonb, 'single', FALSE, 'agree', TRUE),
('ac2', 'AC2', 'sec-2', 'Attention Check', 'This is an attention-check question. Please select "Sometimes".', 401, '[{"label":"Never","value":"never"},{"label":"Rarely","value":"rarely"},{"label":"Sometimes","value":"sometimes"},{"label":"Often","value":"often"},{"label":"Always","value":"always"}]'::jsonb, 'single', FALSE, 'sometimes', TRUE),
('ac3', 'AC3', 'sec-4', 'Attention Check', 'Please select "Agree" if you are answering the questions honestly and to the best of your knowledge.', 999, '[{"label":"Strongly Disagree","value":"strongly_disagree"},{"label":"Disagree","value":"disagree"},{"label":"Neutral","value":"neutral"},{"label":"Agree","value":"agree"},{"label":"Strongly Agree","value":"strongly_agree"}]'::jsonb, 'single', FALSE, 'agree', TRUE)
ON CONFLICT (id) DO UPDATE SET
    question_code = EXCLUDED.question_code,
    section_id = EXCLUDED.section_id,
    topic = EXCLUDED.topic,
    question_text = EXCLUDED.question_text,
    display_order = EXCLUDED.display_order,
    options = EXCLUDED.options,
    selection_type = EXCLUDED.selection_type,
    is_multi_select = EXCLUDED.is_multi_select,
    correct_answer = EXCLUDED.correct_answer,
    is_attention_check = EXCLUDED.is_attention_check;

COMMIT;
