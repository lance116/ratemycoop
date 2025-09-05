import { useParams, Link } from "react-router-dom";
import { baseCompanies } from "@/data/companies";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CompanyDetailsDebug = () => {
  const { id } = useParams();
  
  console.log('DEBUG CompanyDetails - ID:', id);
  console.log('DEBUG CompanyDetails - Base companies:', baseCompanies.length);
  
  const company = baseCompanies.find(c => c.id === parseInt(id || ""));
  
  console.log('DEBUG CompanyDetails - Found company:', company?.name || 'Not found');

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Company not found (ID: {id})
          </h1>
          <p className="text-muted-foreground mb-4">
            Available company IDs: {baseCompanies.map(c => c.id).join(', ')}
          </p>
          <Link to="/leaderboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/leaderboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leaderboard
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={company.logo}
                alt={company.name}
                className="h-16 w-16 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
                <p className="text-muted-foreground">{company.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{company.elo}</div>
                <div className="text-sm text-muted-foreground">ELO Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{company.rating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{company.pay || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Pay Range</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {company.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-green-600 font-semibold">
                ✅ DEBUG: This page is working with basic company data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDetailsDebug;
