export interface Company {
  id: number;
  name: string;
  logo: string;
  rating: number;
  elo: number;
  reviews: Review[];
  tags: string[];
  description: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  date: string;
  program: string;
  year: string;
}

// Re-export database functions for backward compatibility
export { 
  getCompanies, 
  getCompany, 
  updateCompanyElo, 
  getReviews, 
  createReview, 
  recordVote,
  initializeDatabase 
} from '@/lib/database';