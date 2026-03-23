import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Badge } from "@/react-app/components/ui/badge";
import { Star, ArrowLeft, Trash2, Search } from "lucide-react";
import apiClient from "@/react-app/services/api";

interface Review {
  id: string;
  userName: string;
  userEmail: string;
  templateName: string;
  templateId: string;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

export default function ReviewsManagement() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const result = await apiClient.reviews.getAllReviews();
      
      console.log('API Response:', result); // Debug log
      
      if (result.success && result.data) {
        console.log('Raw API Data:', result.data); // Debug log
        
        // Ensure the data has the correct structure
        const processedReviews = (result.data as unknown[]).map((review: unknown) => {
          const reviewObj = review as Record<string, unknown>;
          console.log('Processing review:', reviewObj); // Debug log
          
          return {
            id: (reviewObj.id as string) || (reviewObj.reviewId as string) || '',
            userName: (reviewObj.userName as string) || (reviewObj.name as string) || ((reviewObj.user as Record<string, unknown>)?.name as string) || ((reviewObj.User as Record<string, unknown>)?.Name as string) || 'Unknown User',
            userEmail: (reviewObj.userEmail as string) || (reviewObj.email as string) || ((reviewObj.user as Record<string, unknown>)?.email as string) || ((reviewObj.User as Record<string, unknown>)?.Email as string) || 'unknown@example.com',
            templateName: (reviewObj.templateName as string) || ((reviewObj.template as Record<string, unknown>)?.name as string) || ((reviewObj.Template as Record<string, unknown>)?.Name as string) || 'Unknown Template',
            templateId: (reviewObj.templateId as string) || ((reviewObj.template as Record<string, unknown>)?.id as string) || ((reviewObj.Template as Record<string, unknown>)?.Id as string) || '',
            rating: (reviewObj.rating as number) || (reviewObj.Rating as number) || 0,
            comment: (reviewObj.comment as string) || (reviewObj.Comment as string) || (reviewObj.content as string) || (reviewObj.Content as string) || '',
            createdAt: (reviewObj.createdAt as string) || (reviewObj.CreatedAt as string) || (reviewObj.createdDate as string) || new Date().toISOString(),
            isApproved: (reviewObj.isApproved as boolean) ?? (reviewObj.IsApproved as boolean) ?? false
          };
        });
        
        console.log('Processed Reviews:', processedReviews); // Debug log
        setReviews(processedReviews);
      } else {
        console.error('Failed to fetch reviews:', result.message);
        // Fallback to mock data if API fails
        const mockReviews: Review[] = [
          {
            id: "1",
            userName: "John Doe",
            userEmail: "john.doe@example.com",
            templateName: "Professional Blue",
            templateId: "1",
            rating: 5,
            comment: "Excellent template! Very professional and easy to customize. The design is clean and modern, perfect for my business needs.",
            createdAt: "2024-02-15",
            isApproved: true
          }
        ];
        setReviews(mockReviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      // Fallback to mock data on error
      const mockReviews: Review[] = [
        {
          id: "1",
          userName: "John Doe",
          userEmail: "john.doe@example.com",
          templateName: "Professional Blue",
          templateId: "1",
          rating: 5,
          comment: "Excellent template! Very professional and easy to customize.",
          createdAt: "2024-02-15",
          isApproved: true
        }
      ];
      setReviews(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const result = await apiClient.reviews.deleteReview(reviewId);
        
        if (result.success) {
          setReviews(reviews.filter(review => review.id !== reviewId));
        } else {
          console.error('Failed to delete review:', result.message);
          alert('Failed to delete review. Please try again.');
        }
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  const toggleApproval = async (reviewId: string) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;
      
      const result = review.isApproved 
        ? await apiClient.reviews.unapproveReview(reviewId)
        : await apiClient.reviews.approveReview(reviewId);
      
      if (result.success) {
        setReviews(reviews.map(reviewItem =>
          reviewItem.id === reviewId
            ? { ...reviewItem, isApproved: !reviewItem.isApproved }
            : reviewItem
        ));
      } else {
        console.error('Failed to update review status:', result.message);
        alert('Failed to update review status. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update review status:', error);
      alert('Failed to update review status. Please try again.');
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (!review) return false; // Skip null/undefined reviews
    
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (review.userName && review.userName.toLowerCase().includes(searchTermLower)) ||
      (review.templateName && review.templateName.toLowerCase().includes(searchTermLower)) ||
      (review.comment && review.comment.toLowerCase().includes(searchTermLower)) ||
      (review.userEmail && review.userEmail.toLowerCase().includes(searchTermLower));
    
    const matchesRating = filterRating === null || review.rating === filterRating;
    
    return matchesSearch && matchesRating;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reviews Management</h1>
              <p className="text-muted-foreground mt-1">Manage customer reviews and feedback</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search reviews by user, template, or comment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterRating === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRating(null)}
                >
                  All Ratings
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filterRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRating(rating)}
                    className="flex items-center gap-1"
                  >
                    {rating}
                    <Star className="w-3 h-3" />
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => {
            if (!review) return null; // Skip null/undefined reviews
            
            return (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating || 0)}
                      </div>
                      <Badge variant={review.isApproved ? "default" : "secondary"}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApproval(review.id)}
                        className={review.isApproved ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                      >
                        {review.isApproved ? "Unapprove" : "Approve"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{review.userName || 'Unknown User'}</span>
                      <span>{review.userEmail || 'unknown@example.com'}</span>
                      <span>•</span>
                      <span>Template: {review.templateName || 'Unknown Template'}</span>
                      <span>•</span>
                      <span>{review.createdAt || 'Unknown Date'}</span>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">{review.comment || 'No comment provided'}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <h3 className="text-lg font-medium mb-2">
                  {searchTerm || filterRating !== null ? 'No reviews found' : 'No reviews yet'}
                </h3>
                <p>
                  {searchTerm || filterRating !== null 
                    ? 'Try adjusting your search or filters.'
                    : 'Customers will be able to leave reviews once they start using the templates.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Review Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{reviews.length}</div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reviews.filter(r => r.isApproved).length}
                </div>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {reviews.filter(r => !r.isApproved).length}
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
