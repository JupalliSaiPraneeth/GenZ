-- =================================================================
-- GEN Z VOICES — SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- File: supabase/rls_policies.sql
-- =================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_quality_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lucky_draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------
-- 1. PUBLIC READ ACCESS FOR SURVEY STRUCTURE (Categories, Questions, Options)
-- -----------------------------------------------------------------
CREATE POLICY "Public can view active survey categories"
    ON public.survey_categories FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view active survey questions"
    ON public.survey_questions FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public can view question options"
    ON public.question_options FOR SELECT
    USING (TRUE);

CREATE POLICY "Public can view published research insights"
    ON public.research_insights FOR SELECT
    USING (is_published = TRUE);

-- -----------------------------------------------------------------
-- 2. ANONYMOUS PARTICIPANT SURVEY RESPONSE WRITES & READS
-- -----------------------------------------------------------------
CREATE POLICY "Public can select anonymous participant session tokens"
    ON public.anonymous_participants FOR SELECT
    USING (TRUE);

CREATE POLICY "Public can create anonymous participant session tokens"
    ON public.anonymous_participants FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Public can update anonymous participant session tokens"
    ON public.anonymous_participants FOR UPDATE
    USING (TRUE);

CREATE POLICY "Public can select survey sessions"
    ON public.survey_sessions FOR SELECT
    USING (TRUE);

CREATE POLICY "Public can create survey sessions"
    ON public.survey_sessions FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Public can update own survey session"
    ON public.survey_sessions FOR UPDATE
    USING (TRUE);

CREATE POLICY "Public can select survey responses"
    ON public.survey_responses FOR SELECT
    USING (TRUE);

CREATE POLICY "Public can insert survey responses"
    ON public.survey_responses FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Public can update survey responses"
    ON public.survey_responses FOR UPDATE
    USING (TRUE);

CREATE POLICY "Public can insert or update progress"
    ON public.survey_progress FOR ALL
    USING (TRUE);

-- -----------------------------------------------------------------
-- 3. CERTIFICATE VERIFICATION (PUBLIC READ BY CODE)
-- -----------------------------------------------------------------
CREATE POLICY "Public can verify certificate by code"
    ON public.certificates FOR SELECT
    USING (TRUE);

-- -----------------------------------------------------------------
-- 4. ADMIN ELEVATED POLICIES (Requires Admin Profile Role)
-- -----------------------------------------------------------------
CREATE POLICY "Admins full access profiles"
    ON public.profiles FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin' OR id = auth.uid());

CREATE POLICY "Admins full access quality scores"
    ON public.data_quality_scores FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins full access fraud risk assessments"
    ON public.fraud_risk_assessments FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins full access lucky draw"
    ON public.lucky_draw_entries FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins full access audit logs"
    ON public.audit_logs FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');
