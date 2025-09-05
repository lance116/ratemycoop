-- RateMyCoop Initial Database Schema
-- Migration: 001_initial_schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  program TEXT, -- e.g., "Software Engineering", "Computer Science"
  graduation_year TEXT, -- e.g., "2025", "2026"
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Companies table
CREATE TABLE public.companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  pay_range TEXT, -- e.g., "$50-70/hr", "Competitive"
  current_elo REAL DEFAULT 1600.0,
  vote_count INTEGER DEFAULT 0,
  average_rating REAL DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  company_id BIGINT REFERENCES public.companies(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  content TEXT NOT NULL,
  program TEXT, -- User's program during internship
  year TEXT, -- Year of internship
  position_title TEXT, -- e.g., "Software Developer Intern"
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE
);

-- Votes table
CREATE TABLE public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  winner_id BIGINT REFERENCES public.companies(id) ON DELETE CASCADE,
  loser_id BIGINT REFERENCES public.companies(id) ON DELETE CASCADE,
  winner_elo_before REAL NOT NULL,
  loser_elo_before REAL NOT NULL,
  winner_elo_after REAL NOT NULL,
  loser_elo_after REAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_ip INET -- For anonymous voting tracking
);

-- ELO History table
CREATE TABLE public.elo_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id BIGINT REFERENCES public.companies(id) ON DELETE CASCADE,
  elo_rating REAL NOT NULL,
  total_votes INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  change_reason TEXT -- e.g., "vote_result", "manual_adjustment"
);

-- User Sessions table
CREATE TABLE public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Review Votes table (for helpful/unhelpful votes on reviews)
CREATE TABLE public.review_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(review_id, user_id)
);

-- Add constraints
ALTER TABLE public.votes ADD CONSTRAINT votes_different_companies CHECK (winner_id != loser_id);
ALTER TABLE public.reviews ADD CONSTRAINT reviews_rating_range CHECK (rating >= 1 AND rating <= 5);

-- Create indexes for performance
CREATE INDEX idx_companies_elo_desc ON public.companies (current_elo DESC);
CREATE INDEX idx_companies_name ON public.companies (name);
CREATE INDEX idx_companies_tags ON public.companies USING GIN (tags);
CREATE INDEX idx_companies_updated_at ON public.companies (updated_at DESC);

CREATE INDEX idx_reviews_company_id ON public.reviews (company_id);
CREATE INDEX idx_reviews_user_id ON public.reviews (user_id);
CREATE INDEX idx_reviews_created_at_desc ON public.reviews (created_at DESC);
CREATE INDEX idx_reviews_rating ON public.reviews (rating);

CREATE INDEX idx_votes_created_at_desc ON public.votes (created_at DESC);
CREATE INDEX idx_votes_winner_id ON public.votes (winner_id);
CREATE INDEX idx_votes_loser_id ON public.votes (loser_id);
CREATE INDEX idx_votes_user_ip ON public.votes (user_ip);
CREATE INDEX idx_votes_user_id ON public.votes (user_id);

CREATE INDEX idx_elo_history_company_id ON public.elo_history (company_id);
CREATE INDEX idx_elo_history_recorded_at_desc ON public.elo_history (recorded_at DESC);

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions (user_id);
CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions (expires_at);

CREATE INDEX idx_review_votes_review_id ON public.review_votes (review_id);
CREATE INDEX idx_review_votes_user_id ON public.review_votes (user_id);
