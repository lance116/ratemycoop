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

export interface EloHistoryEntry {
  timestamp: number;
  elo: number;
}

// Store ELO ratings in localStorage for persistence
export const getStoredRatings = (): Record<number, number> => {
  const stored = localStorage.getItem('company-elos');
  return stored ? JSON.parse(stored) : {};
};

export const updateStoredRating = (companyId: number, newRating: number): void => {
  const stored = getStoredRatings();
  const oldRating = stored[companyId] || 1600;
  
  stored[companyId] = newRating;
  localStorage.setItem('company-elos', JSON.stringify(stored));
  
  // Only update history if there's a significant change (5+ points) to reduce storage
  const change = Math.abs(newRating - oldRating);
  if (change >= 5) {
    updateEloHistory(companyId, newRating);
  }
};

export const getEloHistory = (companyId: number): EloHistoryEntry[] => {
  const stored = localStorage.getItem(`company-elo-history-${companyId}`);
  return stored ? JSON.parse(stored) : [];
};

export const updateEloHistory = (companyId: number, elo: number): void => {
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
  localStorage.removeItem('company-elos');
  // Clear all history
  for (let i = 1; i <= 113; i++) {
    localStorage.removeItem(`company-elo-history-${i}`);
  }
};