-- =================================================================
-- GEN Z VOICES — SEED DATA (13 RESEARCH CATEGORIES & QUESTIONS)
-- File: supabase/seed.sql
-- =================================================================

-- Insert 13 Research Categories
INSERT INTO public.survey_categories (id, slug, title, description, icon, display_order, estimated_minutes) VALUES
('c0000000-0000-0000-0000-000000000001', 'education-learning', 'Education & Learning', 'Explores academic choices, digital learning habits, and skill priorities.', 'GraduationCap', 1, 2),
('c0000000-0000-0000-0000-000000000002', 'health-wellbeing', 'Health & Wellbeing', 'Measures physical fitness, mental health awareness, and sleep habits.', 'HeartPulse', 2, 2),
('c0000000-0000-0000-0000-000000000003', 'food-lifestyle', 'Food & Lifestyle', 'Dietary preferences, dining out vs cooking, and conscious consumption.', 'Utensils', 3, 1),
('c0000000-0000-0000-0000-000000000004', 'entertainment-leisure', 'Entertainment & Leisure', 'Streaming, gaming, creator economy engagement, and recreation.', 'Gamepad2', 4, 2),
('c0000000-0000-0000-0000-000000000005', 'reading-curiosity', 'Reading & Curiosity', 'Book reading, audiobooks, podcasts, news sources, and self-education.', 'BookOpen', 5, 1),
('c0000000-0000-0000-0000-000000000006', 'family-relationships', 'Family & Relationships', 'Interpersonal dynamics, dating, marriage perspectives, and social circles.', 'Users', 6, 2),
('c0000000-0000-0000-0000-000000000007', 'career-employment', 'Career & Employment', 'Workplace culture preferences, remote vs hybrid, corporate vs startup.', 'Briefcase', 7, 2),
('c0000000-0000-0000-0000-000000000008', 'finance-earning', 'Finance & Earning', 'Money management, savings, investments, crypto, and financial independence.', 'Wallet', 8, 2),
('c0000000-0000-0000-0000-000000000009', 'entrepreneurship-skills', 'Entrepreneurship & Skills', 'Side hustles, building startups, AI tool mastery, and freelancing.', 'Rocket', 9, 2),
('c0000000-0000-0000-0000-000000000010', 'digital-life-tech', 'Digital Life & Technology', 'Screen time, social media platforms, AI adoption, and privacy views.', 'Smartphone', 10, 2),
('c0000000-0000-0000-0000-000000000011', 'travel-settlement', 'Travel & Settlement', 'Domestic vs foreign travel, urban vs rural living, global relocation.', 'Compass', 11, 1),
('c0000000-0000-0000-0000-000000000012', 'government-society-values', 'Government, Society & Values', 'Civic awareness, sustainability, social justice, and ethics.', 'Landmark', 12, 2),
('c0000000-0000-0000-0000-000000000013', 'future-aspirations', 'Future Aspirations', 'Long-term life goals, definition of success, and legacy ambitions.', 'Target', 13, 2)
ON CONFLICT (id) DO NOTHING;

-- Sample Seed Questions (Representing categories)
INSERT INTO public.survey_questions (id, category_id, question_code, question_text, question_type, display_order) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'EDU_01', 'What is your primary current educational pursuit?', 'single_choice', 1),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000010', 'TECH_01', 'How frequently do you leverage Generative AI tools (ChatGPT, Claude, Midjourney) in daily tasks?', 'single_choice', 1),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000007', 'CAREER_01', 'When choosing a future employer, what is your single highest priority factor?', 'single_choice', 1),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000008', 'FIN_01', 'How would you describe your financial savings and investment habit?', 'single_choice', 1)
ON CONFLICT (id) DO NOTHING;

-- Options for TECH_01
INSERT INTO public.question_options (question_id, option_label, option_value, display_order) VALUES
('d0000000-0000-0000-0000-000000000002', '🤖 Every single day', 'daily', 1),
('d0000000-0000-0000-0000-000000000002', '💻 A few times a week', 'weekly', 2),
('d0000000-0000-0000-0000-000000000002', '📅 Occasionally when needed', 'occasionally', 3),
('d0000000-0000-0000-0000-000000000002', '🚫 Rarely or never', 'never', 4)
ON CONFLICT DO NOTHING;

-- Options for CAREER_01
INSERT INTO public.question_options (question_id, option_label, option_value, display_order) VALUES
('d0000000-0000-0000-0000-000000000003', '⚖️ Work-Life Balance & Flexibility', 'flexibility', 1),
('d0000000-0000-0000-0000-000000000003', '💰 Competitive Compensation & Bonuses', 'compensation', 2),
('d0000000-0000-0000-0000-000000000003', '📈 Fast Career Growth & Mentorship', 'growth', 3),
('d0000000-0000-0000-0000-000000000003', '🌱 Company Purpose & Social Impact', 'impact', 4)
ON CONFLICT DO NOTHING;

