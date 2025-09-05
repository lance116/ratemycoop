-- RateMyCoop Supabase Setup Script
-- Run this script in your Supabase SQL editor to set up the complete database structure

-- This script combines all migrations for easy setup
-- For production, use the individual migration files in order

\i 001_initial_schema.sql
\i 002_functions.sql
\i 003_triggers.sql
\i 004_rls_policies.sql
\i 005_seed_companies.sql
\i 006_realtime.sql

-- Verify setup
SELECT 'Setup completed! Tables created:' as status;
SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

SELECT 'Functions created:' as status;
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';

SELECT 'Company count:' as status;
SELECT COUNT(*) as company_count FROM public.companies;
