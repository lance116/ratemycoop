import { useState, useEffect } from "react";
import { getCompanies, Company } from "@/data/companies";
import { processVote } from "@/utils/elo";
import { supabaseApi } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PayStats } from "@/components/ui/pay-stats";
import { Star, Trophy } from "lucide-react";

const Vote = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPair, setCurrentPair] = useState<[Company, Company] | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [votes, setVotes] = useState(0);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const loadedCompanies = await getCompanies();
        setCompanies(loadedCompanies);
        const pair = getRandomPair(loadedCompanies);
        if (pair) {
          setCurrentPair(pair);
        }
      } catch (error) {
        console.error('Failed to load companies:', error);
      }
    };
    
    loadCompanies();
  }, []);

  useEffect(() => {
    // Set up real-time subscription for company updates
    const channel = supabaseApi.subscribeToCompanyUpdates((payload) => {
      // Refresh companies when ELO ratings change from other users' votes
      if (!isVoting) { // Don't refresh during our own vote process
        const loadCompanies = async () => {
          try {
            const loadedCompanies = await getCompanies();
            setCompanies(loadedCompanies);
          } catch (error) {
            console.error('Failed to refresh companies:', error);
          }
        };
        loadCompanies();
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [isVoting]);

  const getRandomPair = (companiesList: Company[]) => {
    if (companiesList.length < 2) {
      console.warn('Not enough companies for a pair');
      return null;
    }
    
    const shuffled = [...companiesList].sort(() => 0.5 - Math.random());
    // Ensure we get two different companies
    let company1 = shuffled[0];
    let company2 = shuffled[1];
    
    // If by chance they're the same, find a different one
    if (company1.id === company2.id && companiesList.length > 1) {
      company2 = shuffled.find(c => c.id !== company1.id) || shuffled[2] || shuffled[1];
    }
    
    return [company1, company2] as [Company, Company];
  };

  const handleVote = async (winner: Company) => {
    if (isVoting || !currentPair) return;
    
    console.log('Processing vote for:', winner.name);
    setIsVoting(true);
    setVotes(votes + 1);
    
    const [leftCompany, rightCompany] = currentPair;
    const loser = winner.id === leftCompany.id ? rightCompany : leftCompany;
    
    try {
      // Process vote using Supabase
      const { error } = await processVote(winner.id, loser.id);
      console.log('Vote processed, error:', error);
      
      if (error) {
        console.error('Failed to process vote:', error);
        // Still generate new pair even if vote fails
        const fallbackPair = getRandomPair(companies);
        if (fallbackPair) setCurrentPair(fallbackPair);
        return;
      }
      
      // Refresh companies from database to get updated ELO ratings
      const updatedCompanies = await getCompanies();
      setCompanies(updatedCompanies);
      
      // Get new pair from updated companies
      const newPair = getRandomPair(updatedCompanies);
      console.log('Generated new pair:', newPair ? `${newPair[0].name} vs ${newPair[1].name}` : 'null');
      if (newPair) {
        setCurrentPair(newPair);
      }
      
    } catch (error) {
      console.error('Error processing vote:', error);
      // Fallback: generate new pair from current companies
      const fallbackPair = getRandomPair(companies);
      if (fallbackPair) setCurrentPair(fallbackPair);
    } finally {
      setIsVoting(false);
    }
  };

  if (!currentPair) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const [leftCompany, rightCompany] = currentPair;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Which SWE internship would you prefer?
          </h1>
          <p className="text-muted-foreground mb-4">
            Help build the ultimate internship ranking using ELO rating system
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Trophy size={16} />
            <span>{votes} votes cast</span>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4 max-w-5xl mx-auto">
            {/* Left Company */}
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isVoting ? "pointer-events-none opacity-70" : ""
              }`}
              onClick={() => handleVote(leftCompany)}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <img
                    src={leftCompany.logo}
                    alt={leftCompany.name}
                    className="h-12 md:h-16 mx-auto object-contain"
                  />
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
                  {leftCompany.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {leftCompany.description}
                </p>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">
                    {leftCompany.elo}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    ELO
                  </span>
                </div>
                <div className="flex justify-center mb-3">
                  <PayStats pay={leftCompany.pay} />
                </div>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {leftCompany.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Choose {leftCompany.name}
                </Button>
              </CardContent>
            </Card>

            {/* Right Company */}
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                isVoting ? "pointer-events-none opacity-70" : ""
              }`}
              onClick={() => handleVote(rightCompany)}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <img
                    src={rightCompany.logo}
                    alt={rightCompany.name}
                    className="h-12 md:h-16 mx-auto object-contain"
                  />
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2">
                  {rightCompany.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {rightCompany.description}
                </p>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">
                    {rightCompany.elo}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    ELO
                  </span>
                </div>
                <div className="flex justify-center mb-3">
                  <PayStats pay={rightCompany.pay} />
                </div>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {rightCompany.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Choose {rightCompany.name}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* VS Divider - Centered between cards */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-sm md:text-lg shadow-lg border-4 border-background">
              VS
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Click on any company to vote • ELO ratings update in real-time based on chess rating system
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vote;