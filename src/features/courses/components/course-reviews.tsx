// ABOUTME: Course reviews and rating system with submission form
// ABOUTME: Displays user reviews and allows enrolled students to submit ratings

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, MessageSquare, ThumbsUp, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface CourseReviewsProps {
  courseId: string;
  courseTitle: string;
  reviews: Array<{
    id: string;
    rating: number;
    title: string;
    content: string;
    author: {
      name: string;
      avatar?: string;
    };
    createdAt: Date;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    hasUserMarkedHelpful?: boolean;
  }>;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  canSubmitReview: boolean;
  userReview?: {
    id: string;
    rating: number;
    content: string;
  };
}

export function CourseReviews({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
  canSubmitReview,
  userReview
}: CourseReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(userReview?.rating || 0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState(userReview?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleSubmitReview = async () => {
    if (!selectedRating || !reviewContent.trim()) return;

    setIsSubmitting(true);
    try {
      // Submit review logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setShowReviewForm(false);
      setReviewTitle('');
      setReviewContent('');
      // Refresh reviews would go here
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingPercentage = (stars: number) => {
    return totalReviews > 0 ? (ratingDistribution[stars as keyof typeof ratingDistribution] / totalReviews) * 100 : 0;
  };

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-6 w-6",
                    i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <p className="text-gray-600">
              Based on {totalReviews.toLocaleString()} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 min-w-12">
                  <span className="text-sm text-gray-600">{stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress 
                  value={getRatingPercentage(stars)} 
                  className="flex-1 h-2"
                />
                <span className="text-sm text-gray-600 min-w-10">
                  {ratingDistribution[stars as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {canSubmitReview && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {userReview ? 'Update Your Review' : 'Write a Review'}
            </h3>
            {!showReviewForm && (
              <Button onClick={() => setShowReviewForm(true)}>
                {userReview ? 'Edit Review' : 'Write Review'}
              </Button>
            )}
          </div>

          {showReviewForm && (
            <div className="space-y-4">
              {/* Rating Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          rating <= selectedRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title (Optional)
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your experience..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={100}
                />
              </div>

              {/* Review Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <Textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Share your thoughts about this course. What did you learn? What could be improved?"
                  rows={4}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {reviewContent.length}/1000 characters
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSubmitReview}
                  disabled={!selectedRating || !reviewContent.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setSelectedRating(userReview?.rating || 0);
                    setReviewContent(userReview?.content || '');
                    setReviewTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Student Reviews ({totalReviews})
          </h3>
          
          {/* Sort/Filter options could go here */}
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">
              Be the first to share your experience with this course!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    {review.author.avatar ? (
                      <div className="relative w-10 h-10">
                        <Image
                          src={review.author.avatar}
                          alt={review.author.name}
                          className="rounded-full object-cover"
                          fill
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-gray-900">{review.author.name}</span>
                      {review.isVerifiedPurchase && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>

                    {review.title && (
                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                    )}

                    <p className="text-gray-700 leading-relaxed mb-3">{review.content}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                      
                      <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                        <ThumbsUp className={cn(
                          "h-3 w-3",
                          review.hasUserMarkedHelpful && "fill-blue-500 text-blue-500"
                        )} />
                        <span>Helpful ({review.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}