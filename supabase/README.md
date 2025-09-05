# RateMyCoop Supabase Database Setup

This directory contains the complete Supabase database schema and setup for the RateMyCoop application.

## Quick Setup

### Option 1: All-in-One Setup

1. Copy the contents of `setup.sql`
2. Paste and run in your Supabase SQL Editor
3. Done! ✅

### Option 2: Migration-by-Migration Setup

Run the migration files in order:

1. `001_initial_schema.sql` - Core tables and indexes
2. `002_functions.sql` - Database functions for ELO calculations
3. `003_triggers.sql` - Triggers for data consistency
4. `004_rls_policies.sql` - Row Level Security policies
5. `005_seed_companies.sql` - Initial company data
6. `006_realtime.sql` - Realtime configuration

## Database Schema Overview

### Core Tables

- **users** - User profiles (extends Supabase auth.users)
- **companies** - Company information with ELO ratings
- **reviews** - User reviews and ratings for companies
- **votes** - Head-to-head voting records
- **elo_history** - Historical ELO rating changes

### Supporting Tables

- **user_sessions** - User session tracking
- **review_votes** - Helpful/unhelpful votes on reviews

## Key Features

### ELO Rating System

- Chess-style ELO algorithm for company rankings
- Real-time rating updates after each vote
- Historical tracking of rating changes

### Anonymous Voting

- Users can vote without authentication
- IP tracking for basic duplicate prevention
- Seamless transition to authenticated voting

### Real-time Updates

- Live leaderboard updates
- Instant ELO changes
- Materialized view for performance

### Security

- Row Level Security (RLS) on all tables
- Proper user isolation
- Anonymous read access for public data

## Usage Examples

### Process a Vote

```sql
SELECT process_vote(
  user_id := auth.uid(),
  winner_id := 1,  -- Google
  loser_id := 2,   -- Microsoft
  user_ip := inet_client_addr()
);
```

### Get Leaderboard

```sql
SELECT * FROM get_company_leaderboard(50, 0);
-- Or use the materialized view for better performance:
SELECT * FROM company_leaderboard LIMIT 50;
```

### Get Random Company Pair

```sql
SELECT * FROM get_random_company_pair();
```

### Calculate ELO Changes

```sql
SELECT * FROM calculate_elo_change(1600.0, 1550.0, 32);
```

## Environment Variables

Make sure your `.env` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## API Integration

The database is designed to work seamlessly with your existing TypeScript interfaces:

```typescript
// Your existing Company interface works directly with the companies table
interface Company {
  id: number;
  name: string;
  logo: string; // maps to logo_url
  rating: number; // maps to average_rating
  elo: number; // maps to current_elo
  reviews: Review[];
  tags: string[];
  description: string;
  pay?: string; // maps to pay_range
}
```

## Performance Optimizations

- **Indexes** on frequently queried columns
- **Materialized view** for leaderboard queries
- **Batch operations** for ELO updates
- **Efficient RLS policies** for security without performance loss

## Realtime Subscriptions

Subscribe to live updates in your React components:

```typescript
// Subscribe to company ELO changes
const { data: companies } = useQuery({
  queryKey: ["companies"],
  queryFn: () =>
    supabase
      .from("companies")
      .select("*")
      .order("current_elo", { ascending: false }),
});

// Subscribe to real-time updates
useEffect(() => {
  const channel = supabase
    .channel("companies")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "companies" },
      (payload) => {
        // Handle real-time ELO updates
        queryClient.invalidateQueries(["companies"]);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

## Migration Strategy

If you need to modify the schema later:

1. Create new migration files with incrementing numbers
2. Always use `IF NOT EXISTS` for new objects
3. Use `ALTER TABLE` statements for modifications
4. Test migrations on a copy of production data

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Make sure user is authenticated or table allows anonymous access
2. **Function Permission Errors**: Check GRANT statements in migration 004
3. **Realtime Not Working**: Verify tables are added to `supabase_realtime` publication

### Useful Queries

```sql
-- Check ELO distribution
SELECT
  FLOOR(current_elo/100)*100 as elo_range,
  COUNT(*)
FROM companies
GROUP BY FLOOR(current_elo/100)
ORDER BY elo_range;

-- Top movers in last 24 hours
SELECT
  c.name,
  h1.elo_rating as current_elo,
  h2.elo_rating as yesterday_elo,
  h1.elo_rating - h2.elo_rating as change
FROM companies c
JOIN elo_history h1 ON c.id = h1.company_id
JOIN elo_history h2 ON c.id = h2.company_id
WHERE h1.recorded_at > NOW() - INTERVAL '1 day'
  AND h2.recorded_at < NOW() - INTERVAL '1 day'
ORDER BY ABS(h1.elo_rating - h2.elo_rating) DESC;
```

## Support

If you encounter issues:

1. Check the Supabase dashboard for error logs
2. Verify RLS policies allow your operation
3. Check function permissions and syntax
4. Review the migration order

Happy coding! 🚀
