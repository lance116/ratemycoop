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

// Store ELO ratings in localStorage for persistence
export const getStoredRatings = (): Record<number, number> => {
  const stored = localStorage.getItem('company-elos');
  return stored ? JSON.parse(stored) : {};
};

export const updateStoredRating = (companyId: number, newRating: number): void => {
  const stored = getStoredRatings();
  stored[companyId] = newRating;
  localStorage.setItem('company-elos', JSON.stringify(stored));
};

export const resetAllRatings = (): void => {
  localStorage.removeItem('company-elos');
};