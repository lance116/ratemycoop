-- RateMyCoop Realtime Configuration
-- Migration: 006_realtime

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.elo_history;

-- Create materialized view for leaderboard performance
CREATE MATERIALIZED VIEW public.company_leaderboard AS
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
  c.updated_at,
  ROW_NUMBER() OVER (ORDER BY c.current_elo DESC) as rank
FROM public.companies c
ORDER BY c.current_elo DESC;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX ON public.company_leaderboard (id);

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_company_leaderboard()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.company_leaderboard;
END;
$$ LANGUAGE plpgsql;

-- Grant access to the materialized view
GRANT SELECT ON public.company_leaderboard TO authenticated, anon;
GRANT EXECUTE ON FUNCTION refresh_company_leaderboard TO authenticated;
