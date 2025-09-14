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
  rank: number;
}

// Store ELO ratings in localStorage for persistence
export const getStoredRatings = (): Record<number, number> => {
  const stored = localStorage.getItem('company-elos');
  return stored ? JSON.parse(stored) : {};
};

export const updateStoredRating = (companyId: number, newRating: number, allCompanies?: any[]): void => {
  const stored = getStoredRatings();
  const oldRating = stored[companyId] || 1600;
  
  stored[companyId] = newRating;
  localStorage.setItem('company-elos', JSON.stringify(stored));
  
  // Only update history if there's a significant change (5+ points) to reduce storage
  const change = Math.abs(newRating - oldRating);
  if (change >= 5) {
    updateEloHistory(companyId, newRating, allCompanies);
  }
};

export const getEloHistory = (companyId: number): EloHistoryEntry[] => {
  const stored = localStorage.getItem(`company-elo-history-${companyId}`);
  return stored ? JSON.parse(stored) : [];
};

export const updateEloHistory = (companyId: number, elo: number, allCompanies?: any[]): void => {
  const history = getEloHistory(companyId);
  
  // Calculate rank if allCompanies is provided
  let rank = 1;
  if (allCompanies) {
    // Create a temporary array with the updated ELO for this company
    const updatedCompanies = allCompanies.map(company => 
      company.id === companyId ? { ...company, elo } : company
    );
    const sortedCompanies = updatedCompanies.sort((a, b) => b.elo - a.elo);
    rank = sortedCompanies.findIndex(c => c.id === companyId) + 1;
  }
  
  const newEntry: EloHistoryEntry = {
    timestamp: Date.now(),
    elo,
    rank
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

// Review management functions
export interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  date: string;
  program: string;
  year: string;
}

export const getStoredReviews = (): Record<number, Review[]> => {
  const stored = localStorage.getItem('company-reviews');
  return stored ? JSON.parse(stored) : {};
};

export const addReview = (companyId: number, review: Omit<Review, 'id' | 'date'>): void => {
  const stored = getStoredReviews();
  const companyReviews = stored[companyId] || [];
  
  const newReview: Review = {
    ...review,
    id: Date.now(), // Simple ID generation
    date: new Date().toLocaleDateString()
  };
  
  companyReviews.push(newReview);
  stored[companyId] = companyReviews;
  localStorage.setItem('company-reviews', JSON.stringify(stored));
};

export const getCompanyReviews = (companyId: number): Review[] => {
  const stored = getStoredReviews();
  return stored[companyId] || [];
};

export const calculateOverallRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal place
};

export const getPeakRank = (companyId: number): number => {
  const history = getEloHistory(companyId);
  if (history.length === 0) return 1;
  
  // Find the entry with the highest ELO rating
  const peakEntry = history.reduce((peak, entry) => 
    entry.elo > peak.elo ? entry : peak
  );
  
  return peakEntry.rank;
};