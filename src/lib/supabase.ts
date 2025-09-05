import { createClient } from '@supabase/supabase-js'

// Support both Vite and Next.js environment variable formats
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fvnnddvvqkqjkwfzpxlw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bm5kZHZ2cWtxamt3ZnpweGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NDg2NDYsImV4cCI6MjA3MjUyNDY0Nn0.EvMaX27k6PE6fIzCXTBMLiviEbS5OqjYkR1a9dL_CsY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Log the configuration for debugging
console.log('Supabase initialized with URL:', supabaseUrl ? 'Set' : 'Missing')

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          program: string | null
          graduation_year: string | null
          created_at: string
          updated_at: string
          is_verified: boolean
          metadata: Record<string, any>
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          program?: string | null
          graduation_year?: string | null
          created_at?: string
          updated_at?: string
          is_verified?: boolean
          metadata?: Record<string, any>
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          program?: string | null
          graduation_year?: string | null
          created_at?: string
          updated_at?: string
          is_verified?: boolean
          metadata?: Record<string, any>
        }
      }
      companies: {
        Row: {
          id: number
          name: string
          logo_url: string | null
          description: string | null
          tags: string[]
          pay_range: string | null
          current_elo: number
          vote_count: number
          average_rating: number
          review_count: number
          created_at: string
          updated_at: string
          metadata: Record<string, any>
        }
        Insert: {
          id?: number
          name: string
          logo_url?: string | null
          description?: string | null
          tags?: string[]
          pay_range?: string | null
          current_elo?: number
          vote_count?: number
          average_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
          metadata?: Record<string, any>
        }
        Update: {
          id?: number
          name?: string
          logo_url?: string | null
          description?: string | null
          tags?: string[]
          pay_range?: string | null
          current_elo?: number
          vote_count?: number
          average_rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
          metadata?: Record<string, any>
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string | null
          company_id: number
          rating: number
          content: string
          program: string | null
          year: string | null
          position_title: string | null
          is_anonymous: boolean
          created_at: string
          updated_at: string
          is_verified: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_id: number
          rating: number
          content: string
          program?: string | null
          year?: string | null
          position_title?: string | null
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
          is_verified?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          company_id?: number
          rating?: number
          content?: string
          program?: string | null
          year?: string | null
          position_title?: string | null
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
          is_verified?: boolean
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string | null
          winner_id: number
          loser_id: number
          winner_elo_before: number
          loser_elo_before: number
          winner_elo_after: number
          loser_elo_after: number
          created_at: string
          user_ip: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          winner_id: number
          loser_id: number
          winner_elo_before: number
          loser_elo_before: number
          winner_elo_after: number
          loser_elo_after: number
          created_at?: string
          user_ip?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          winner_id?: number
          loser_id?: number
          winner_elo_before?: number
          loser_elo_before?: number
          winner_elo_after?: number
          loser_elo_after?: number
          created_at?: string
          user_ip?: string | null
        }
      }
      elo_history: {
        Row: {
          id: string
          company_id: number
          elo_rating: number
          total_votes: number
          recorded_at: string
          change_reason: string | null
        }
        Insert: {
          id?: string
          company_id: number
          elo_rating: number
          total_votes: number
          recorded_at?: string
          change_reason?: string | null
        }
        Update: {
          id?: string
          company_id?: number
          elo_rating?: number
          total_votes?: number
          recorded_at?: string
          change_reason?: string | null
        }
      }
    }
    Views: {
      company_leaderboard: {
        Row: {
          id: number
          name: string
          logo_url: string | null
          description: string | null
          tags: string[]
          pay_range: string | null
          current_elo: number
          vote_count: number
          average_rating: number
          review_count: number
          updated_at: string
          rank: number
        }
      }
    }
    Functions: {
      calculate_elo_change: {
        Args: {
          winner_rating: number
          loser_rating: number
          k_factor?: number
        }
        Returns: {
          winner_new_rating: number
          loser_new_rating: number
        }[]
      }
      process_vote: {
        Args: {
          p_user_id: string | null
          p_winner_id: number
          p_loser_id: number
          p_user_ip?: string | null
        }
        Returns: boolean
      }
      get_random_company_pair: {
        Args: Record<PropertyKey, never>
        Returns: {
          company1_id: number
          company2_id: number
        }[]
      }
      get_company_leaderboard: {
        Args: {
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: number
          name: string
          logo_url: string | null
          description: string | null
          tags: string[]
          pay_range: string | null
          current_elo: number
          vote_count: number
          average_rating: number
          review_count: number
          rank: number
        }[]
      }
      get_user_vote_history: {
        Args: {
          p_user_id: string
          p_limit?: number
        }
        Returns: {
          vote_id: string
          winner_name: string
          loser_name: string
          winner_elo_change: number
          loser_elo_change: number
          voted_at: string
        }[]
      }
    }
  }
}

// Helper functions for common operations
export const supabaseApi = {
  // Get companies with leaderboard ranking
  async getCompaniesLeaderboard(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase.rpc('get_company_leaderboard', {
        p_limit: limit,
        p_offset: offset
      })
      if (error) {
        console.error('Supabase RPC error:', error)
        return { data: null, error }
      }
      return { data, error }
    } catch (err) {
      console.error('Supabase connection error:', err)
      return { data: null, error: err }
    }
  },

  // Get a random pair of companies for voting
  async getRandomCompanyPair() {
    const { data, error } = await supabase.rpc('get_random_company_pair')
    return { data, error }
  },

  // Process a vote
  async processVote(winnerId: number, loserId: number, userId?: string) {
    const { data, error } = await supabase.rpc('process_vote', {
      p_user_id: userId || null,
      p_winner_id: winnerId,
      p_loser_id: loserId,
      p_user_ip: null // You can implement IP detection if needed
    })
    return { data, error }
  },

  // Get user's vote history
  async getUserVoteHistory(userId: string, limit = 20) {
    const { data, error } = await supabase.rpc('get_user_vote_history', {
      p_user_id: userId,
      p_limit: limit
    })
    return { data, error }
  },

  // Get company details with reviews
  async getCompanyDetails(companyId: number) {
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single()

    if (companyError) return { data: null, error: companyError }

    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        *,
        users:user_id (display_name)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    return { 
      data: { ...company, reviews: reviews || [] }, 
      error: reviewsError 
    }
  },

  // Create a review
  async createReview(review: {
    company_id: number
    rating: number
    content: string
    program?: string
    year?: string
    position_title?: string
    is_anonymous?: boolean
  }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single()
    
    return { data, error }
  },

  // Subscribe to real-time company updates
  subscribeToCompanyUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('companies')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'companies' },
        callback
      )
      .subscribe()
  }
}
