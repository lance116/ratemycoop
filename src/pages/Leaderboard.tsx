import { getCompanies } from "@/data/companies";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Medal, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const companies = getCompanies();
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-gold" />;
      case 2:
        return <Medal className="h-6 w-6 text-silver" />;
      case 3:
        return <Award className="h-6 w-6 text-bronze" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-gold bg-gradient-to-r from-gold/10 to-gold/5 shadow-gold";
      case 2:
        return "border-silver bg-gradient-to-r from-silver/10 to-silver/5";
      case 3:
        return "border-bronze bg-gradient-to-r from-bronze/10 to-bronze/5";
      default:
        return "border-border hover:border-primary/20";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            SWE Internship Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Rankings based on student votes using chess ELO rating system
          </p>
        </div>

        <div className="space-y-4">
          {companies.map((company, index) => {
            const rank = index + 1;
            return (
              <Link key={company.id} to={`/company/${company.id}`}>
                <Card 
                  className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${getRankStyle(rank)}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 flex justify-center">
                        {getRankIcon(rank)}
                      </div>

                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-12 w-12 object-contain"
                        />
                      </div>

                      {/* Company Info */}
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-foreground">
                          {company.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          {company.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {company.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Trophy className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">
                            {company.elo}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          ELO Rating
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {company.reviews.length} reviews
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Rankings are updated in real-time based on student votes. Click on any company to see detailed reviews.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;