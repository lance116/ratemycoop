-- RateMyCoop Database Functions
-- Migration: 002_functions

-- ELO Calculation Function
CREATE OR REPLACE FUNCTION calculate_elo_change(
  winner_rating REAL,
  loser_rating REAL,
  k_factor INTEGER DEFAULT 32
) RETURNS TABLE(winner_new_rating REAL, loser_new_rating REAL) AS $$
BEGIN
  RETURN QUERY SELECT
    ROUND((winner_rating + k_factor * (1 - (1 / (1 + POWER(10, (loser_rating - winner_rating) / 400.0)))))::numeric, 0)::REAL,
    ROUND((loser_rating + k_factor * (0 - (1 / (1 + POWER(10, (winner_rating - loser_rating) / 400.0)))))::numeric, 0)::REAL;
END;
$$ LANGUAGE plpgsql;

-- Vote Processing Function
CREATE OR REPLACE FUNCTION process_vote(
  p_user_id UUID,
  p_winner_id BIGINT,
  p_loser_id BIGINT,
  p_user_ip INET DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  winner_current_elo REAL;
  loser_current_elo REAL;
  new_ratings RECORD;
BEGIN
  -- Validate input
  IF p_winner_id = p_loser_id THEN
    RAISE EXCEPTION 'Winner and loser cannot be the same company';
  END IF;
  
  -- Get current ELO ratings
  SELECT current_elo INTO winner_current_elo FROM public.companies WHERE id = p_winner_id;
  SELECT current_elo INTO loser_current_elo FROM public.companies WHERE id = p_loser_id;
  
  IF winner_current_elo IS NULL OR loser_current_elo IS NULL THEN
    RAISE EXCEPTION 'One or both companies not found';
  END IF;
  
  -- Calculate new ratings
  SELECT * INTO new_ratings FROM calculate_elo_change(winner_current_elo, loser_current_elo);
  
  -- Insert vote record
  INSERT INTO public.votes (user_id, winner_id, loser_id, winner_elo_before, loser_elo_before, winner_elo_after, loser_elo_after, user_ip)
  VALUES (p_user_id, p_winner_id, p_loser_id, winner_current_elo, loser_current_elo, new_ratings.winner_new_rating, new_ratings.loser_new_rating, p_user_ip);
  
  -- Update company ELO ratings and vote counts
  UPDATE public.companies SET 
    current_elo = new_ratings.winner_new_rating,
    vote_count = vote_count + 1,
    updated_at = NOW()
  WHERE id = p_winner_id;
  
  UPDATE public.companies SET 
    current_elo = new_ratings.loser_new_rating,
    vote_count = vote_count + 1,
    updated_at = NOW()
  WHERE id = p_loser_id;
  
  -- Record ELO history
  INSERT INTO public.elo_history (company_id, elo_rating, total_votes, change_reason)
  VALUES 
    (p_winner_id, new_ratings.winner_new_rating, (SELECT vote_count FROM public.companies WHERE id = p_winner_id), 'vote_result'),
    (p_loser_id, new_ratings.loser_new_rating, (SELECT vote_count FROM public.companies WHERE id = p_loser_id), 'vote_result');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to update company average rating when reviews are added/updated
CREATE OR REPLACE FUNCTION update_company_rating() RETURNS TRIGGER AS $$
BEGIN
  -- Update average rating and review count for the company
  UPDATE public.companies 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating)::REAL, 0.0) 
      FROM public.reviews 
      WHERE company_id = COALESCE(NEW.company_id, OLD.company_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE company_id = COALESCE(NEW.company_id, OLD.company_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.company_id, OLD.company_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to get random company pair for voting
CREATE OR REPLACE FUNCTION get_random_company_pair()
RETURNS TABLE(company1_id BIGINT, company2_id BIGINT) AS $$
BEGIN
  RETURN QUERY
  WITH random_companies AS (
    SELECT id FROM public.companies 
    ORDER BY RANDOM() 
    LIMIT 2
  )
  SELECT 
    (SELECT id FROM random_companies LIMIT 1 OFFSET 0) as company1_id,
    (SELECT id FROM random_companies LIMIT 1 OFFSET 1) as company2_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get company leaderboard
CREATE OR REPLACE FUNCTION get_company_leaderboard(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id BIGINT,
  name TEXT,
  logo_url TEXT,
  description TEXT,
  tags TEXT[],
  pay_range TEXT,
  current_elo REAL,
  vote_count INTEGER,
  average_rating REAL,
  review_count INTEGER,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.logo_url,
    c.description,
    c.tags,
    c.pay_range,
    c.current_elo,
    c.vote_count,
    c.average_rating,
    c.review_count,
    ROW_NUMBER() OVER (ORDER BY c.current_elo DESC) as rank
  FROM public.companies c
  ORDER BY c.current_elo DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function to get user vote history
CREATE OR REPLACE FUNCTION get_user_vote_history(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE(
  vote_id UUID,
  winner_name TEXT,
  loser_name TEXT,
  winner_elo_change REAL,
  loser_elo_change REAL,
  voted_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id as vote_id,
    w.name as winner_name,
    l.name as loser_name,
    (v.winner_elo_after - v.winner_elo_before) as winner_elo_change,
    (v.loser_elo_after - v.loser_elo_before) as loser_elo_change,
    v.created_at as voted_at
  FROM public.votes v
  JOIN public.companies w ON v.winner_id = w.id
  JOIN public.companies l ON v.loser_id = l.id
  WHERE v.user_id = p_user_id
  ORDER BY v.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
