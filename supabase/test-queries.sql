-- RateMyCoop Test Queries
-- Use these to test your database setup and functionality

-- Test 1: Basic table creation
SELECT 'Testing table creation...' as test;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Test 2: Company data
SELECT 'Testing company data...' as test;
SELECT COUNT(*) as total_companies FROM public.companies;
SELECT name, current_elo, vote_count FROM public.companies ORDER BY current_elo DESC LIMIT 5;

-- Test 3: ELO calculation function
SELECT 'Testing ELO calculation...' as test;
SELECT * FROM calculate_elo_change(1600.0, 1550.0, 32);

-- Test 4: Random company pair
SELECT 'Testing random company pair...' as test;
SELECT 
  c1.name as company1,
  c2.name as company2
FROM get_random_company_pair() rp
JOIN companies c1 ON rp.company1_id = c1.id
JOIN companies c2 ON rp.company2_id = c2.id;

-- Test 5: Leaderboard function
SELECT 'Testing leaderboard function...' as test;
SELECT rank, name, current_elo FROM get_company_leaderboard(10, 0);

-- Test 6: Leaderboard materialized view
SELECT 'Testing leaderboard materialized view...' as test;
SELECT rank, name, current_elo FROM public.company_leaderboard LIMIT 10;

-- Test 7: Process a vote (replace with actual company IDs)
SELECT 'Testing vote processing...' as test;
-- Uncomment to test (will actually process a vote):
-- SELECT process_vote(NULL, 1, 2, '127.0.0.1'::inet);

-- Test 8: Check triggers
SELECT 'Testing triggers...' as test;
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Test 9: Check RLS policies
SELECT 'Testing RLS policies...' as test;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Test 10: Check functions
SELECT 'Testing functions...' as test;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;

-- Performance test queries
SELECT 'Performance test queries...' as test;

-- Test index usage for leaderboard
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM companies ORDER BY current_elo DESC LIMIT 50;

-- Test index usage for company search
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM companies WHERE name ILIKE '%Google%';

-- Test tag search performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM companies WHERE tags && ARRAY['AI'];

-- Database statistics
SELECT 'Database statistics...' as test;
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_rows
FROM pg_stat_user_tables 
WHERE schemaname = 'public';

-- Index usage statistics
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE schemaname = 'public' 
ORDER BY idx_scan DESC;

SELECT 'All tests completed!' as result;
