import { supabaseApi } from '@/lib/supabase';

// Chess ELO rating system implementation (kept for reference, now handled by database)
export const calculateEloChange = (winnerRating: number, loserRating: number, kFactor: number = 32): { winnerNewRating: number; loserNewRating: number } => {
  // Expected score calculation
  const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedScoreLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));
  
  // New ratings calculation
  const winnerNewRating = Math.round(winnerRating + kFactor * (1 - expectedScoreWinner));
  const loserNewRating = Math.round(loserRating + kFactor * (0 - expectedScoreLoser));
  
  return {
    winnerNewRating,
    loserNewRating
  };
};

export interface EloHistoryEntry {
  timestamp: number;
  elo: number;
}

// DEPRECATED: These functions are kept for backward compatibility but now use Supabase
// New implementations use the database instead of localStorage

export const getStoredRatings = (): Record<number, number> => {
  console.warn('getStoredRatings is deprecated. Use Supabase database instead.');
  const stored = localStorage.getItem('company-elos');
  return stored ? JSON.parse(stored) : {};
};

export const updateStoredRating = async (companyId: number, newRating: number): Promise<void> => {
  console.warn('updateStoredRating is deprecated. Use supabaseApi.processVote instead.');
  // Keep localStorage as fallback for now
  const stored = getStoredRatings();
  stored[companyId] = newRating;
  localStorage.setItem('company-elos', JSON.stringify(stored));
};

export const getEloHistory = (companyId: number): EloHistoryEntry[] => {
  console.warn('getEloHistory is deprecated. Fetch from Supabase elo_history table instead.');
  const stored = localStorage.getItem(`company-elo-history-${companyId}`);
  return stored ? JSON.parse(stored) : [];
};

export const updateEloHistory = (companyId: number, elo: number): void => {
  console.warn('updateEloHistory is deprecated. Database triggers handle this automatically.');
  const history = getEloHistory(companyId);
  const newEntry: EloHistoryEntry = {
    timestamp: Date.now(),
    elo
  };
  
  history.push(newEntry);
  
  // Keep only last 50 entries to prevent excessive storage usage
  const trimmedHistory = history.slice(-50);
  localStorage.setItem(`company-elo-history-${companyId}`, JSON.stringify(trimmedHistory));
};

export const resetAllRatings = (): void => {
  console.warn('resetAllRatings is deprecated. Database handles ratings persistence.');
  localStorage.removeItem('company-elos');
  // Clear all history
  for (let i = 1; i <= 113; i++) {
    localStorage.removeItem(`company-elo-history-${i}`);
  }
};

// NEW SUPABASE-BASED FUNCTIONS

// Process a vote using Supabase
export const processVote = async (winnerId: number, loserId: number, userId?: string) => {
  return await supabaseApi.processVote(winnerId, loserId, userId);
};

// Get companies from database
export const getCompaniesFromDB = async () => {
  return await supabaseApi.getCompaniesLeaderboard();
};

// Get random company pair for voting
export const getRandomCompanyPair = async () => {
  return await supabaseApi.getRandomCompanyPair();
};