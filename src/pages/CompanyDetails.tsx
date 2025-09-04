import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCompany, createReview, Company } from "@/data/companies";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star, ArrowLeft, MessageSquare, Trophy, TrendingUp } from "lucide-react";

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    content: "",
    author: "",
    program: "",
    year: ""
  });

  useEffect(() => {
    const loadCompany = async () => {
      if (!id) return;
      
      try {
        const companyData = await getCompany(parseInt(id));
        setCompany(companyData);
      } catch (error) {
        console.error('Error loading company:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Company not found</h1>
          <Link to="/leaderboard">
            <Button variant="outline">Back to Leaderboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || submittingReview) return;
    
    setSubmittingReview(true);
    
    try {
      const success = await createReview({
        company_id: company.id,
        author: newReview.author || "Anonymous",
        rating: newReview.rating,
        content: newReview.content,
        program: newReview.program,
        year: newReview.year
      });
      
      if (success) {
        // Reload company data to get updated reviews
        const updatedCompany = await getCompany(company.id);
        if (updatedCompany) {
          setCompany(updatedCompany);
        }
        
        setShowReviewForm(false);
        setNewReview({
          rating: 5,
          content: "",
          author: "",
          program: "",
          year: ""
        });
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            } ${interactive ? "cursor-pointer hover:text-primary" : ""}`}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  // For now, we'll show a placeholder rank since we don't have all companies loaded
  const rank = 1; // This would need to be calculated based on ELO ranking

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/leaderboard" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Leaderboard</span>
        </Link>

        {/* Company Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <img
                src={company.logo}
                alt={company.name}
                className="h-20 w-20 object-contain flex-shrink-0"
              />
              <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {company.name}
                  </h1>
                  <Badge variant="outline" className="text-primary border-primary">
                    #{rank}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  {company.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {company.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center space-x-1">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-foreground">
                        {company.elo}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">ELO Rating</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-center space-x-1">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-foreground">
                        {company.reviews.length}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Student Reviews</h2>
            <Button onClick={() => setShowReviewForm(!showReviewForm)}>
              Write a Review
            </Button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <div className="mt-1">
                      {renderStars(newReview.rating, true, (rating) =>
                        setNewReview({ ...newReview, rating })
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="author">Name (Optional)</Label>
                      <Input
                        id="author"
                        placeholder="Your name"
                        value={newReview.author}
                        onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="program">Program</Label>
                      <Input
                        id="program"
                        placeholder="e.g., Computer Science"
                        value={newReview.program}
                        onChange={(e) => setNewReview({ ...newReview, program: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        placeholder="e.g., 3A"
                        value={newReview.year}
                        onChange={(e) => setNewReview({ ...newReview, year: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Review</Label>
                    <Textarea
                      id="content"
                      placeholder="Share your co-op experience..."
                      value={newReview.content}
                      onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button type="submit" disabled={submittingReview}>
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReviewForm(false)}
                      disabled={submittingReview}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {company.reviews.length > 0 ? (
              company.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground">
                            by {review.author || "Anonymous"}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.program} • {review.year} • {review.date}
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground">{review.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your experience with {company.name}!
                  </p>
                  <Button onClick={() => setShowReviewForm(true)}>
                    Write the First Review
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;