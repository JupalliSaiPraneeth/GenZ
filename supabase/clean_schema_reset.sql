-- =================================================================
-- GEN Z VOICES — CLEAN DATABASE SCHEMA RESET
-- 4 Simple, Clear, Detailed Tables (No Confusing Legacy Schemas)
-- =================================================================

-- 1. DROP ALL OLD LEGACY TABLES & CONSTRAINTS (Clean Slate Reset)
DROP TABLE IF EXISTS public.survey_responses CASCADE;
DROP TABLE IF EXISTS public.survey_sessions CASCADE;
DROP TABLE IF EXISTS public.anonymous_participants CASCADE;
DROP TABLE IF EXISTS public.participants CASCADE;
DROP TABLE IF EXISTS public.data_logs CASCADE;
DROP TABLE IF EXISTS public.survey_questions CASCADE;
DROP TABLE IF EXISTS public.survey_categories CASCADE;

-- 2. CREATE MASTER QUESTION REFERENCE TABLE
CREATE TABLE public.survey_questions (
    id TEXT PRIMARY KEY,                       -- e.g. 'q1', 'q2', ..., 'q75'
    question_code TEXT NOT NULL,               -- e.g. 'Q1', 'Q2', ..., 'Q75'
    section_id TEXT NOT NULL,                  -- e.g. 'sec-1', 'sec-2', 'sec-3', 'sec-4'
    topic TEXT NOT NULL,
    question_text TEXT NOT NULL,
    display_order INTEGER NOT NULL UNIQUE
);

-- 3. CREATE PARTICIPANTS TABLE (Strict Email Uniqueness Enforced & Admin Evaluation)
CREATE TABLE public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,                -- ONE EMAIL = ONE USER ONLY
    status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress' | 'completed'
    total_answers_count INTEGER NOT NULL DEFAULT 0,
    device_timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    -- Admin Evaluation & Status Fields
    evaluation_status TEXT NOT NULL DEFAULT 'pending_evaluation', -- 'pending_evaluation', 'approved', 'rejected'
    evaluated_at TIMESTAMPTZ,
    evaluated_by TEXT DEFAULT 'Admin Research Team',
    admin_notes TEXT,
    -- Certificate of Appreciation Fields
    certificate_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'issued', 'revoked'
    certificate_id TEXT UNIQUE,                        -- e.g. 'CERT-GZ2026-89421'
    certificate_issued_at TIMESTAMPTZ,
    -- Lucky Draw Announcement Fields
    lucky_draw_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'eligible', 'winner', 'not_selected'
    lucky_draw_prize TEXT,                             -- e.g. 'Smart Watch', '$100 Amazon Gift Card'
    lucky_draw_announced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for instant email lookups
CREATE INDEX idx_participants_email ON public.participants (LOWER(email));

-- 4. CREATE SURVEY RESPONSES TABLE
CREATE TABLE public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    question_id TEXT NOT NULL REFERENCES public.survey_questions(id) ON DELETE CASCADE,
    question_code TEXT NOT NULL,
    response_value JSONB NOT NULL,
    device_timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(participant_id, question_id)        -- Upsert per participant & question
);

CREATE INDEX idx_responses_participant ON public.survey_responses (participant_id);
CREATE INDEX idx_responses_question ON public.survey_responses (question_id);

-- 5. CREATE DATA LOGS TABLE (Device-Time Logs)
CREATE TABLE public.data_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    action TEXT NOT NULL,                      -- e.g. 'REGISTER_USER', 'SUBMIT_ANSWER', 'COMPLETE_SURVEY'
    device_timestamp TIMESTAMPTZ DEFAULT NOW(),
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_logs_participant ON public.data_logs (participant_id);

-- 6. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ/WRITE POLICIES
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_logs ENABLE ROW LEVEL SECURITY;

-- Survey Questions: Public Read, Insert, Update, Delete
CREATE POLICY "Allow public select on survey_questions" ON public.survey_questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on survey_questions" ON public.survey_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on survey_questions" ON public.survey_questions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on survey_questions" ON public.survey_questions FOR DELETE USING (true);

-- Participants: Public Read, Insert, Update
CREATE POLICY "Allow public select on participants" ON public.participants FOR SELECT USING (true);
CREATE POLICY "Allow public insert on participants" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on participants" ON public.participants FOR UPDATE USING (true);

-- Survey Responses: Public Read, Insert, Update
CREATE POLICY "Allow public select on survey_responses" ON public.survey_responses FOR SELECT USING (true);
CREATE POLICY "Allow public insert on survey_responses" ON public.survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on survey_responses" ON public.survey_responses FOR UPDATE USING (true);

-- Data Logs: Public Read, Insert
CREATE POLICY "Allow public select on data_logs" ON public.data_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on data_logs" ON public.data_logs FOR INSERT WITH CHECK (true);

-- 7. SEED ALL 75 RESEARCH QUESTIONS
INSERT INTO public.survey_questions (id, question_code, section_id, topic, question_text, display_order) VALUES
('q1', 'Q1', 'sec-1', 'Demographics & Age', 'What is your age?', 1),
('q2', 'Q2', 'sec-1', 'Gender Identity', 'What is your gender?', 2),
('q3', 'Q3', 'sec-1', 'Current Status', 'What is your current status?', 3),
('q4', 'Q4', 'sec-1', 'Year of Study', 'What year of study are you currently in?', 4),
('q5', 'Q5', 'sec-1', 'Family Financial Situation', 'How would you describe your family''s current financial situation?', 5),
('q6', 'Q6', 'sec-1', 'Parents'' Education', 'What is the highest level of education completed by your parent(s) or guardian(s)?', 6),
('q7', 'Q7', 'sec-1', 'Digital Device Ownership', 'Do you have your own personal digital device?', 7),
('q8', 'Q8', 'sec-1', 'Daily Planning', 'How planned is your usual day?', 8),
('q9', 'Q9', 'sec-1', 'Procrastination', 'How often do you postpone important tasks until the last minute?', 9),
('q10', 'Q10', 'sec-1', 'Work-Life Balance', 'How important is it for you to have a good balance between your studies/work and personal life?', 10),
('q11', 'Q11', 'sec-1', 'Extra Study / Work Hours', 'On a typical day, how much time do you spend studying or working outside your regular classes or work hours?', 11),
('q12', 'Q12', 'sec-1', 'Exam Preparation Timing', 'When do you normally begin serious examination preparation?', 12),
('q13', 'Q13', 'sec-1', 'Self-Learning Confidence', 'How confident are you about learning things on your own?', 13),
('q14', 'Q14', 'sec-1', 'Daily Meal Frequency', 'How many meals do you usually eat in a day?', 14),
('q15', 'Q15', 'sec-1', 'Online Food Ordering', 'How often do you order food online?', 15),
('q16', 'Q16', 'sec-1', 'Healthiness in Food Choices', 'What role does healthiness play when you choose what to eat?', 16),
('q17', 'Q17', 'sec-1', 'Nightly Sleep Duration', 'How many hours do you usually sleep each night?', 17),
('q18', 'Q18', 'sec-1', 'Physical Activity Frequency', 'How often do you do at least 30 minutes of physical activity, such as walking, running, gym, or sports?', 18),
('q19', 'Q19', 'sec-1', 'Overall Physical Health', 'How would you rate your overall physical health?', 19),
('q20', 'Q20', 'sec-1', 'Life Satisfaction', 'How satisfied are you with your life right now?', 20),
('q21', 'Q21', 'sec-1', 'Resilience After Failure', 'How well do you recover after failure or disappointment?', 21),
('q22', 'Q22', 'sec-1', 'Non-Study Screen Time', 'On a typical day, how much time do you spend on screens for non-study or non-work activities?', 22),
('q23', 'Q23', 'sec-1', 'Compulsive Phone Checking', 'How often do you check your phone without any specific reason?', 23),
('q24', 'Q24', 'sec-1', 'Social Media Influence', 'How much do social media content influence your preferences or decisions?', 24),
('q25', 'Q25', 'sec-1', 'Entertainment for Stress', 'When you have a stressful day, how much do you rely on entertainment to relax?', 25),
('q26', 'Q26', 'sec-1', 'Gaming Time', 'How much time do you usually spend playing video or digital games?', 26),
('q27', 'Q27', 'sec-1', 'Entertainment Management', 'How well do you manage your entertainment time without affecting your responsibilities?', 27),
('q28', 'Q28', 'sec-1', 'Favourite Entertainment Type', 'What type of entertainment do you enjoy the most?', 28),
('q29', 'Q29', 'sec-1', 'Favourite Content Genre', 'Which type of content do you enjoy watching the most?', 29),
('q30', 'Q30', 'sec-1', 'Problem Solving Strategy', 'What do you usually do when you don''t understand something?', 30),
('q31', 'Q31', 'sec-2', 'Family Career Discussions', 'Can you openly discuss important career decisions with your family?', 31),
('q32', 'Q32', 'sec-2', 'Family Decision Influence', 'Does your family strongly influence the important decisions you make in life?', 32),
('q33', 'Q33', 'sec-2', 'Importance of Close Friendships', 'Are close friendships important to you?', 33),
('q34', 'Q34', 'sec-2', 'Comfort Making New Friends', 'Do you feel comfortable making new friends?', 34),
('q35', 'Q35', 'sec-2', 'Inter-Gender Friendship Comfort', 'How comfortable are you making friends with someone of another gender?', 35),
('q36', 'Q36', 'sec-2', 'Number of Other-Gender Friends', 'How many close friends do you have who are of another gender?', 36),
('q37', 'Q37', 'sec-2', 'Preferred Marriage Age', 'At what age would you ideally prefer to get married?', 37),
('q38', 'Q38', 'sec-2', 'Pre-Marriage Financial Stability', 'How important is it for you to be financially stable before marriage?', 38),
('q39', 'Q39', 'sec-2', 'Importance of Children', 'How important is having children to living a fulfilling life?', 39),
('q40', 'Q40', 'sec-2', 'Preferred Career Path', 'Which career path appeals to you the most?', 40),
('q41', 'Q41', 'sec-2', 'Primary Career Driver', 'What would influence your career choice the most?', 41),
('q42', 'Q42', 'sec-2', 'Government Education Support', 'Have you ever received support from a government scholarship, fee reimbursement, or education scheme?', 42),
('q43', 'Q43', 'sec-2', 'Money Management Approach', 'Which approach best describes how you manage your money?', 43),
('q44', 'Q44', 'sec-2', 'Future Income Sources', 'Which income sources would you consider having in the future?', 44),
('q45', 'Q45', 'sec-2', 'Leisure Trip Frequency', 'How often do you go on trips or holidays for leisure?', 45),
('q46', 'Q46', 'sec-2', 'Preferred Travel Companions', 'Who do you prefer travelling with?', 46),
('q47', 'Q47', 'sec-2', 'Preferred Long-Term Residence', 'Where would you ideally prefer to live long-term?', 47),
('q48', 'Q48', 'sec-2', 'Settling Abroad Willingness', 'Would you like to settle abroad if you had good opportunities?', 48),
('q49', 'Q49', 'sec-2', 'Entrepreneurship Willingness', 'Would you consider starting your own business in the future?', 49),
('q50', 'Q50', 'sec-3', 'AI Tools Usage', 'How often do you use AI tools in your daily life?', 50),
('q51', 'Q51', 'sec-3', 'App Permissions Awareness', 'How often do you check app permissions before using a new app?', 51),
('q52', 'Q52', 'sec-3', 'Civic & Political Engagement', 'How actively do you follow politics and public issues?', 52),
('q53', 'Q53', 'sec-3', 'Questioning Govt Policies', 'How willing are you to question government policies when you believe they are wrong?', 53),
('q54', 'Q54', 'sec-3', 'Spirituality & Religion Importance', 'How important are spirituality, personal meaning, or religious beliefs in your life?', 54),
('q55', 'Q55', 'sec-3', 'Spiritual Practice Frequency', 'How regularly do you practice activities like prayer, worship, meditation, or other spiritual practices?', 55),
('q56', 'Q56', 'sec-3', 'Survey Attention Control (Validation)', 'Do you read each question carefully before choosing your answer?', 56),
('q57', 'Q57', 'sec-3', 'Survey Honesty Check (Validation)', 'Did you answer this survey as honestly as possible?', 57),
('q58', 'Q58', 'sec-3', 'Academic Goal Setting', 'Do you set clear goals for your studies?', 58),
('q59', 'Q59', 'sec-3', 'Caffeine Consumption', 'How often do you consume caffeinated drinks such as coffee, tea, or energy drinks?', 59),
('q60', 'Q60', 'sec-3', 'Attitude Toward Tobacco/Nicotine', 'What do you think about tobacco or nicotine products?', 60),
('q61', 'Q61', 'sec-3', 'Attitude Toward Alcohol', 'How do you personally feel about drinking alcohol?', 61),
('q62', 'Q62', 'sec-3', 'Online Credentials & Certificates', 'Have you independently earned any certificate or recognised online course credential?', 62),
('q63', 'Q63', 'sec-3', 'Cultural Event Participation', 'How often do you actively participate in cultural events at your college/university?', 63),
('q64', 'Q64', 'sec-3', 'Preferred Cultural Activities', 'What type of cultural activities are you most interested in?', 64),
('q65', 'Q65', 'sec-3', 'Obstacles to Cultural Participation', 'What usually stops you from participating in cultural events?', 65),
('q66', 'Q66', 'sec-3', 'Core Value in Relationships', 'What do you value most in a close relationship?', 66),
('q67', 'Q67', 'sec-4', 'Class Attendance Regularity', 'How regularly do you attend your classes?', 67),
('q68', 'Q68', 'sec-4', 'Engineering College Expectation', 'What is the most important thing you expect from an engineering college?', 68),
('q69', 'Q69', 'sec-4', 'College Responsiveness to Feedback', 'Do you think your college listens to student feedback and makes changes when needed?', 69),
('q70', 'Q70', 'sec-4', 'Importance of Campus Activities', 'How important are clubs, events, sports, and cultural activities in your engineering college experience?', 70),
('q71', 'Q71', 'sec-4', 'Most Important Campus Facility', 'What matters most to you when it comes to campus facilities?', 71),
('q72', 'Q72', 'sec-4', 'Student-Teacher Conflict Reasons', 'What is the most common reason for conflicts between students and teachers?', 72),
('q73', 'Q73', 'sec-4', 'Anger at Differential Treatment', 'Do you feel angry when you think a teacher is treating you differently from other students?', 73),
('q74', 'Q74', 'sec-4', 'Emotional Upset at Unfair Treatment', 'Do you feel emotionally upset when you think a teacher is treating you unfairly?', 74),
('q75', 'Q75', 'sec-4', 'Reaction to Teacher Criticism', 'How do you usually react when a teacher criticizes or scolds you?', 75)
ON CONFLICT (id) DO UPDATE SET
    question_code = EXCLUDED.question_code,
    section_id = EXCLUDED.section_id,
    topic = EXCLUDED.topic,
    question_text = EXCLUDED.question_text,
    display_order = EXCLUDED.display_order;
