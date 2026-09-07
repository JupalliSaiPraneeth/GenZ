-- =================================================================
-- GEN Z VOICES — SUPABASE POSTGRESQL DATABASE SCHEMA
-- Migration: 20260905000000_initial_schema.sql
-- =================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (Tied to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(50) NOT NULL DEFAULT 'participant', -- 'participant', 'admin', 'researcher'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PARTICIPANT IDENTITIES (Strict PDI Isolation)
CREATE TABLE IF NOT EXISTS public.participant_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    verification_status VARCHAR(50) DEFAULT 'unverified',
    certificate_eligible BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ANONYMOUS PARTICIPANTS (Research Isolation Layer)
CREATE TABLE IF NOT EXISTS public.anonymous_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anonymous_token VARCHAR(255) NOT NULL UNIQUE,
    demographic_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SURVEY CATEGORIES (13 Research Dimensions)
CREATE TABLE IF NOT EXISTS public.survey_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    display_order INT NOT NULL DEFAULT 0,
    estimated_minutes INT DEFAULT 2,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SURVEY QUESTIONS (~207 Research Questions)
CREATE TABLE IF NOT EXISTS public.survey_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.survey_categories(id) ON DELETE CASCADE,
    question_code VARCHAR(100) NOT NULL UNIQUE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- 'single_choice', 'multiple_choice', 'likert', 'rating', 'text', 'numeric', 'slider'
    is_required BOOLEAN DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    help_text TEXT,
    conditional_logic JSONB DEFAULT '{}'::jsonb,
    validation_rules JSONB DEFAULT '{}'::jsonb,
    is_sensitive BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. QUESTION OPTIONS
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES public.survey_questions(id) ON DELETE CASCADE,
    option_label VARCHAR(255) NOT NULL,
    option_value VARCHAR(255) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 7. SURVEY SESSIONS
CREATE TABLE IF NOT EXISTS public.survey_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anonymous_participant_id UUID NOT NULL REFERENCES public.anonymous_participants(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
    answered_questions_count INT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    completion_duration INT, -- seconds
    device_metadata JSONB DEFAULT '{}'::jsonb
);

-- 8. SURVEY RESPONSES
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.survey_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL,
    response_value JSONB NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(session_id, question_id)
);

-- 9. SURVEY PROGRESS
CREATE TABLE IF NOT EXISTS public.survey_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL UNIQUE REFERENCES public.survey_sessions(id) ON DELETE CASCADE,
    current_category UUID REFERENCES public.survey_categories(id),
    current_question UUID REFERENCES public.survey_questions(id),
    completion_percentage NUMERIC(5,2) DEFAULT 0.00,
    estimated_remaining_seconds INT DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DATA QUALITY SCORES
CREATE TABLE IF NOT EXISTS public.data_quality_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL UNIQUE REFERENCES public.survey_sessions(id) ON DELETE CASCADE,
    overall_score INT NOT NULL DEFAULT 100,
    completion_time_score INT DEFAULT 100,
    consistency_score INT DEFAULT 100,
    attention_score INT DEFAULT 100,
    pattern_score INT DEFAULT 100,
    missing_data_score INT DEFAULT 100,
    status VARCHAR(50) DEFAULT 'excellent', -- 'excellent', 'good', 'acceptable', 'review_required'
    analysis_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. FRAUD RISK ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.fraud_risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL UNIQUE REFERENCES public.survey_sessions(id) ON DELETE CASCADE,
    risk_score INT NOT NULL DEFAULT 0, -- 0-100
    risk_level VARCHAR(50) DEFAULT 'low', -- 'low', 'medium', 'high'
    signals JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'passed', -- 'passed', 'flagged', 'rejected'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_identity_id UUID REFERENCES public.participant_identities(id) ON DELETE CASCADE,
    session_id UUID NOT NULL UNIQUE REFERENCES public.survey_sessions(id) ON DELETE CASCADE,
    certificate_number VARCHAR(100) NOT NULL UNIQUE,
    verification_code VARCHAR(100) NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    certificate_url TEXT
);

-- 13. LUCKY DRAW ENTRIES
CREATE TABLE IF NOT EXISTS public.lucky_draw_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL UNIQUE REFERENCES public.survey_sessions(id) ON DELETE CASCADE,
    eligibility_status VARCHAR(50) DEFAULT 'eligible',
    entry_status VARCHAR(50) DEFAULT 'entered', -- 'entered', 'won', 'expired'
    draw_batch VARCHAR(100) DEFAULT 'default_batch',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. RESEARCH INSIGHTS
CREATE TABLE IF NOT EXISTS public.research_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category_slug VARCHAR(100),
    insight_type VARCHAR(50) DEFAULT 'trend', -- 'trend', 'correlation', 'cluster'
    insight_data JSONB DEFAULT '{}'::jsonb,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_published BOOLEAN DEFAULT FALSE
);

-- 15. ADMIN USERS
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    permission_level VARCHAR(50) DEFAULT 'analyst', -- 'superadmin', 'researcher', 'analyst'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =================================================================
CREATE INDEX IF NOT EXISTS idx_survey_questions_category ON public.survey_questions(category_id, display_order);
CREATE INDEX IF NOT EXISTS idx_question_options_question ON public.question_options(question_id, display_order);
CREATE INDEX IF NOT EXISTS idx_survey_sessions_anonymous ON public.survey_sessions(anonymous_participant_id, status);
CREATE INDEX IF NOT EXISTS idx_survey_responses_session_question ON public.survey_responses(session_id, question_id);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON public.certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_lucky_draw_status ON public.lucky_draw_entries(eligibility_status, entry_status);
CREATE INDEX IF NOT EXISTS idx_data_quality_session ON public.data_quality_scores(session_id, overall_score);
