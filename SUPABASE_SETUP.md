# Supabase Setup Instructions

This project is now connected to a Supabase backend. Follow these steps to set up your database:

## 1. Database Schema Setup

Run the SQL commands in `supabase-schema.sql` in your Supabase SQL editor to create the required tables:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL to create the tables and policies

## 2. Environment Variables

The Supabase configuration is currently hardcoded in `src/lib/supabase.ts`. For production, you should:

1. Create a `.env.local` file in your project root
2. Add the following variables:
   ```
   VITE_SUPABASE_URL=https://fvnnddvqkqjkwfzpxlw.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. Update `src/lib/supabase.ts` to use environment variables:
   ```typescript
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
   ```

## 3. Database Features

The application now includes:

- **Companies Table**: Stores company information, logos, descriptions, and ELO ratings
- **Reviews Table**: Stores student reviews with ratings, content, and metadata
- **Votes Table**: Tracks voting history for ELO calculations
- **Company Tags Table**: Stores tags associated with each company
- **Real-time Updates**: All data is now stored in and retrieved from Supabase
- **Row Level Security**: Public read access, public insert for reviews and votes

## 4. API Keys

- **Anon Key**: Used for client-side operations (voting, reading data)
- **Service Role Key**: For server-side operations (not used in this client-only setup)

## 5. Database Initialization

The app automatically initializes the database with sample data when it starts. This includes:
- 10 sample companies with logos and descriptions
- Associated tags for each company
- All companies start with an ELO rating of 1600

## 6. Features Now Available

- ✅ Real-time ELO rating updates when users vote
- ✅ Persistent storage of all votes and reviews
- ✅ Company leaderboard with live rankings
- ✅ Student review system with ratings
- ✅ Search and filtering capabilities
- ✅ Responsive design with loading states

## 7. Next Steps

To further enhance the application, consider:
- Adding user authentication for personalized experiences
- Implementing real-time updates using Supabase subscriptions
- Adding more sophisticated analytics and reporting
- Implementing admin features for content moderation
- Adding more detailed company information and metrics
