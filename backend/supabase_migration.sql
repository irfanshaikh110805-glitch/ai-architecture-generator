-- Supabase Database Migration Script
-- This script creates all necessary tables for the AI Architecture Generator

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE (Extended from Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    username TEXT UNIQUE,
    
    -- Tier and limits
    tier TEXT DEFAULT 'free' NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
    daily_limit INTEGER DEFAULT 5 NOT NULL,
    monthly_limit INTEGER DEFAULT 100 NOT NULL,
    
    -- API Key for programmatic access
    api_key TEXT UNIQUE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    
    -- Indexes
    CONSTRAINT user_profiles_email_key UNIQUE (email)
);

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_api_key ON public.user_profiles(api_key);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tier ON public.user_profiles(tier);

-- ============================================================================
-- ARCHITECTURES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.architectures (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Input
    idea TEXT NOT NULL,
    idea_hash TEXT NOT NULL,
    
    -- Architecture details
    architecture_type TEXT,
    tech_stack_frontend TEXT,
    tech_stack_backend TEXT,
    tech_stack_database TEXT,
    
    -- Diagrams (stored as text/mermaid)
    er_diagram TEXT,
    architecture_diagram TEXT,
    
    -- Estimation
    estimation_hours TEXT,
    estimation_team_size TEXT,
    estimation_cost TEXT,
    
    -- Metadata
    is_fallback BOOLEAN DEFAULT FALSE,
    fallback_message TEXT,
    generation_time DOUBLE PRECISION,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for architectures
CREATE INDEX IF NOT EXISTS idx_architectures_user_id ON public.architectures(user_id);
CREATE INDEX IF NOT EXISTS idx_architectures_user_created ON public.architectures(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_architectures_idea_hash ON public.architectures(idea_hash);

-- ============================================================================
-- FEATURES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.features (
    id BIGSERIAL PRIMARY KEY,
    architecture_id BIGINT NOT NULL REFERENCES public.architectures(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Must', 'Should', 'Could', 'Won''t')),
    description TEXT,
    "order" INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for features
CREATE INDEX IF NOT EXISTS idx_features_architecture_id ON public.features(architecture_id);

-- ============================================================================
-- DATABASE TABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.database_tables (
    id BIGSERIAL PRIMARY KEY,
    architecture_id BIGINT NOT NULL REFERENCES public.architectures(id) ON DELETE CASCADE,
    
    table_name TEXT NOT NULL,
    fields JSONB NOT NULL,
    relationships JSONB,
    "order" INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for database_tables
CREATE INDEX IF NOT EXISTS idx_database_tables_architecture_id ON public.database_tables(architecture_id);

-- ============================================================================
-- APIS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.apis (
    id BIGSERIAL PRIMARY KEY,
    architecture_id BIGINT NOT NULL REFERENCES public.architectures(id) ON DELETE CASCADE,
    
    method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
    endpoint TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for apis
CREATE INDEX IF NOT EXISTS idx_apis_architecture_id ON public.apis(architecture_id);

-- ============================================================================
-- COMPONENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.components (
    id BIGSERIAL PRIMARY KEY,
    architecture_id BIGINT NOT NULL REFERENCES public.architectures(id) ON DELETE CASCADE,
    
    component_name TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for components
CREATE INDEX IF NOT EXISTS idx_components_architecture_id ON public.components(architecture_id);

-- ============================================================================
-- ROADMAP PHASES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.roadmap_phases (
    id BIGSERIAL PRIMARY KEY,
    architecture_id BIGINT NOT NULL REFERENCES public.architectures(id) ON DELETE CASCADE,
    
    phase_name TEXT NOT NULL,
    tasks JSONB NOT NULL,
    "order" INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for roadmap_phases
CREATE INDEX IF NOT EXISTS idx_roadmap_phases_architecture_id ON public.roadmap_phases(architecture_id);

-- ============================================================================
-- USAGE RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.usage_records (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    endpoint TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    cost DOUBLE PRECISION DEFAULT 0.0,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for usage_records
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON public.usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_date ON public.usage_records(user_id, created_at DESC);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    read BOOLEAN DEFAULT FALSE NOT NULL,
    read_at TIMESTAMPTZ,
    
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.architectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.database_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Architectures Policies
CREATE POLICY "Users can view own architectures" ON public.architectures
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own architectures" ON public.architectures
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own architectures" ON public.architectures
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own architectures" ON public.architectures
    FOR DELETE USING (auth.uid() = user_id);

-- Features Policies
CREATE POLICY "Users can view features of own architectures" ON public.features
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.architectures
            WHERE architectures.id = features.architecture_id
            AND architectures.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create features for own architectures" ON public.features
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.architectures
            WHERE architectures.id = features.architecture_id
            AND architectures.user_id = auth.uid()
        )
    );

-- Database Tables Policies
CREATE POLICY "Users can view database_tables of own architectures" ON public.database_tables
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.architectures
            WHERE architectures.id = database_tables.architecture_id
            AND architectures.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create database_tables for own architectures" ON public.database_tables
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.architectures
            WHERE architectures.id = database_tables.architecture_id
            AND architectures.user_id = auth.uid()
        )
    );

-- APIs Policies
CREATE POLICY "Users can view apis of own architectures" ON public.apis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.architectures
            WHERE architectures.id = apis.architecture_id
            AND architectures.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create apis for own architectures" ON public.apis
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.architectures
            WHERE architectures.id = apis.architecture_id
            AND architectures.user_id = auth.uid()
        )
    );

-- Components Policies
CREATE POLICY "Users can view components of own architectures" ON public.components
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.architectures
            WHERE architectures.id = components.architecture_id
            AND architectures.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create components for own architectures" ON public.components
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.architectures
            WHERE architectures.id = components.architecture_id
            AND architectures.user_id = auth.uid()
        )
    );

-- Roadmap Phases Policies
CREATE POLICY "Users can view roadmap_phases of own architectures" ON public.roadmap_phases
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.architectures
            WHERE architectures.id = roadmap_phases.architecture_id
            AND architectures.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create roadmap_phases for own architectures" ON public.roadmap_phases
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.architectures
            WHERE architectures.id = roadmap_phases.architecture_id
            AND architectures.user_id = auth.uid()
        )
    );

-- Usage Records Policies
CREATE POLICY "Users can view own usage records" ON public.usage_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can create usage records" ON public.usage_records
    FOR INSERT WITH CHECK (true);

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for architectures
CREATE TRIGGER update_architectures_updated_at
    BEFORE UPDATE ON public.architectures
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, username)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'username'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STORAGE BUCKETS (for file uploads)
-- ============================================================================

-- Create storage bucket for architecture diagrams
INSERT INTO storage.buckets (id, name, public)
VALUES ('architecture-diagrams', 'architecture-diagrams', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for architecture-diagrams bucket
CREATE POLICY "Users can upload own diagrams"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'architecture-diagrams' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own diagrams"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'architecture-diagrams' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own diagrams"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'architecture-diagrams' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- REALTIME PUBLICATION
-- ============================================================================

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.architectures;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- You can add any initial data here if needed

COMMENT ON TABLE public.user_profiles IS 'Extended user profiles linked to Supabase Auth';
COMMENT ON TABLE public.architectures IS 'Generated software architectures';
COMMENT ON TABLE public.features IS 'Features with MoSCoW prioritization';
COMMENT ON TABLE public.notifications IS 'User notifications with real-time support';
