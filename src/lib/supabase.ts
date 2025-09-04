import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fvnnddvqkqjkwfzpxlw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bm5kZHZ2cWtxamt3ZnpweGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NDg2NDYsImV4cCI6MjA3MjUyNDY0Nn0.EvMaX27k6PE6fIzCXTBMLiviEbS5OqjYkR1a9dL_CsY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: number
          name: string
          logo: string
          description: string
          elo: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          logo: string
          description: string
          elo?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          logo?: string
          description?: string
          elo?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: number
          company_id: number
          author: string
          rating: number
          content: string
          program: string
          year: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          company_id: number
          author: string
          rating: number
          content: string
          program: string
          year: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          company_id?: number
          author?: string
          rating?: number
          content?: string
          program?: string
          year?: string
          created_at?: string
          updated_at?: string
        }
      }
      company_tags: {
        Row: {
          id: number
          company_id: number
          tag: string
          created_at: string
        }
        Insert: {
          id?: number
          company_id: number
          tag: string
          created_at?: string
        }
        Update: {
          id?: number
          company_id?: number
          tag?: string
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: number
          winner_id: number
          loser_id: number
          created_at: string
        }
        Insert: {
          id?: number
          winner_id: number
          loser_id: number
          created_at?: string
        }
        Update: {
          id?: number
          winner_id?: number
          loser_id?: number
          created_at?: string
        }
      }
    }
  }
}
