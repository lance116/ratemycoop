-- RateMyCoop Row Level Security Policies
-- Migration: 004_rls_policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elo_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view profiles" ON public.users 
  FOR SELECT USING (
    id = auth.uid() OR 
    (display_name IS NOT NULL AND is_verified = TRUE)
  );

CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.users 
  FOR INSERT WITH CHECK (id = auth.uid());

-- Companies table policies
CREATE POLICY "Anyone can view companies" ON public.companies 
  FOR SELECT USING (TRUE);

CREATE POLICY "Only authenticated users can update companies" ON public.companies 
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert companies" ON public.companies 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Reviews table policies
CREATE POLICY "Anyone can view reviews" ON public.reviews 
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own reviews" ON public.reviews 
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews" ON public.reviews 
  FOR DELETE USING (user_id = auth.uid());

-- Votes table policies
CREATE POLICY "Anyone can view votes" ON public.votes 
  FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can create votes" ON public.votes 
  FOR INSERT WITH CHECK (TRUE);

-- Restrict updates and deletes on votes (immutable after creation)
CREATE POLICY "No vote updates" ON public.votes 
  FOR UPDATE USING (FALSE);

CREATE POLICY "No vote deletes" ON public.votes 
  FOR DELETE USING (FALSE);

-- ELO history table policies
CREATE POLICY "Anyone can view elo history" ON public.elo_history 
  FOR SELECT USING (TRUE);

CREATE POLICY "Only system can modify elo history" ON public.elo_history 
  FOR INSERT WITH CHECK (FALSE); -- Only functions can insert

CREATE POLICY "No elo history updates" ON public.elo_history 
  FOR UPDATE USING (FALSE);

CREATE POLICY "No elo history deletes" ON public.elo_history 
  FOR DELETE USING (FALSE);

-- User sessions table policies
CREATE POLICY "Users can view own sessions" ON public.user_sessions 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own sessions" ON public.user_sessions 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions" ON public.user_sessions 
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions" ON public.user_sessions 
  FOR DELETE USING (user_id = auth.uid());

-- Review votes table policies
CREATE POLICY "Anyone can view review votes" ON public.review_votes 
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can vote on reviews" ON public.review_votes 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own review votes" ON public.review_votes 
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own review votes" ON public.review_votes 
  FOR DELETE USING (user_id = auth.uid());

-- Grant appropriate permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.companies TO authenticated;
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.votes TO authenticated;
GRANT SELECT ON public.elo_history TO authenticated;
GRANT ALL ON public.user_sessions TO authenticated;
GRANT ALL ON public.review_votes TO authenticated;

-- Grant read access to anonymous users for public data
GRANT SELECT ON public.companies TO anon;
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT ON public.votes TO anon;
GRANT SELECT ON public.elo_history TO anon;
GRANT INSERT ON public.votes TO anon; -- Allow anonymous voting

-- Grant access to custom functions
GRANT EXECUTE ON FUNCTION calculate_elo_change TO authenticated, anon;
GRANT EXECUTE ON FUNCTION process_vote TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_random_company_pair TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_company_leaderboard TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_user_vote_history TO authenticated;
