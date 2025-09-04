import { updateCompanyElo, recordVote } from '@/lib/database';

// Chess ELO rating system implementation
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

// Process a vote and update ELO ratings in the database
export const processVote = async (winnerId: number, loserId: number, winnerRating: number, loserRating: number): Promise<boolean> => {
  try {
    // Calculate new ELO ratings
    const { winnerNewRating, loserNewRating } = calculateEloChange(winnerRating, loserRating);
    
    // Update both companies' ELO ratings in the database
    const winnerUpdate = await updateCompanyElo(winnerId, winnerNewRating);
    const loserUpdate = await updateCompanyElo(loserId, loserNewRating);
    
    // Record the vote
    const voteRecorded = await recordVote(winnerId, loserId);
    
    return winnerUpdate && loserUpdate && voteRecorded;
  } catch (error) {
    console.error('Error processing vote:', error);
    return false;
  }
};

// Legacy functions for backward compatibility (now using database)
export const getStoredRatings = (): Record<number, number> => {
  // This function is now deprecated as we use the database
  console.warn('getStoredRatings is deprecated. Use getCompanies() from database instead.');
  return {};
};

export const updateStoredRating = (companyId: number, newRating: number): void => {
  // This function is now deprecated as we use the database
  console.warn('updateStoredRating is deprecated. Use updateCompanyElo() from database instead.');
  updateCompanyElo(companyId, newRating);
};

export const resetAllRatings = (): void => {
  // This function is now deprecated as we use the database
  console.warn('resetAllRatings is deprecated. Reset ratings directly in the database instead.');
};