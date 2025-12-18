// components/ReviewsSection.jsx
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, ThumbsUp, Calendar, Edit, Trash2, 
  ChevronLeft, ChevronRight, Filter, Star, User 
} from 'lucide-react';
import StarRating from './StarRating';
import axiosPublic from '../api/axiosPublic';
import { useAuth } from '../hooks/useAuth';

const ReviewsSection = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    averageRating: 0,
    reviewCount: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 1
  });
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [bookId, pagination.page, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axiosPublic.get(
        `/reviews/book/${bookId}?page=${pagination.page}&limit=${pagination.limit}&sort=${sortBy}`
      );
      
      if (response.data.success) {
        setReviews(response.data.reviews);
        setStats({
          averageRating: response.data.averageRating,
          reviewCount: response.data.reviewCount,
          ratingDistribution: response.data.ratingDistribution
        });
        setPagination(response.data.pagination);
        setError('');
      } else {
        setError('Failed to load reviews');
      }
    } catch (error) {
      console.error('Fetch reviews error:', error);
      setError('Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'warning', 
          message: 'Please login to mark reviews as helpful' 
        }
      }));
      return;
    }

    // Optimistic update
    setReviews(prev => prev.map(review => 
      review._id === reviewId 
        ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
        : review
    ));

    // TODO: Implement API call to mark as helpful
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { 
        type: 'success', 
        message: 'Marked as helpful!' 
      }
    }));
  };

  const handleEdit = (review) => {
    
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
   
  };

  const calculatePercentage = (count) => {
    if (stats.reviewCount === 0) return 0;
    return Math.round((count / stats.reviewCount) * 100);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-muted">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-primary" size={24} />
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
        </div>
        <div className="badge badge-lg badge-primary">
          {stats.reviewCount} Review{stats.reviewCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats and Rating Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Average Rating Card */}
        <div className="card bg-base-200 p-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="mb-3">
              <StarRating 
                rating={stats.averageRating} 
                size="lg" 
                showLabel={false}
              />
            </div>
            <div className="text-sm text-muted">
              Average Rating ({stats.reviewCount} reviews)
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="card bg-base-200 p-6 lg:col-span-2">
          <h3 className="font-bold mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{star}</span>
                  <Star className="fill-yellow-400 text-yellow-400" size={16} />
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${calculatePercentage(stats.ratingDistribution[star])}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm w-12 text-right">
                  {stats.ratingDistribution[star]} ({calculatePercentage(stats.ratingDistribution[star])}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted" />
          <span className="text-sm font-medium">Sort by:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest' },
              { value: 'highest', label: 'Highest Rated' },
              { value: 'lowest', label: 'Lowest Rated' },
              { value: 'helpful', label: 'Most Helpful' }
            ].map((sortOption) => (
              <button
                key={sortOption.value}
                onClick={() => handleSortChange(sortOption.value)}
                className={`btn btn-xs ${
                  sortBy === sortOption.value ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {sortOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pagination Info */}
        <div className="text-sm text-muted">
          Showing {(pagination.page - 1) * pagination.limit + 1} -{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} reviews
        </div>
      </div>

      {/* Reviews List */}
      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-base-300 flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Reviews Yet</h3>
          <p className="text-muted max-w-md mx-auto">
            Be the first to share your thoughts about this book!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card bg-base-100 border">
                <div className="card-body p-6">
                  {/* Review Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
                          {review.userPhoto ? (
                            <img 
                              src={review.userPhoto} 
                              alt={review.userName}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <User size={20} className="text-gray-500" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{review.userName}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <Calendar size={12} />
                          <span>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          {review.isEdited && (
                            <span className="text-xs italic">(Edited)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* User Actions */}
                    {user?.email === review.userEmail && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(review)}
                          className="btn btn-ghost btn-xs"
                          title="Edit review"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="btn btn-ghost btn-xs text-error"
                          title="Delete review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mb-3">
                    <StarRating rating={review.rating} size="sm" />
                  </div>

                  {/* Comment */}
                  <p className="text-base-content mb-4 whitespace-pre-line">
                    {review.comment}
                  </p>

                  {/* Helpful Button */}
                  <div className="flex justify-between items-center pt-4 border-t border-base-300">
                    <button
                      onClick={() => handleHelpful(review._id)}
                      className="btn btn-ghost btn-sm gap-2"
                    >
                      <ThumbsUp size={16} />
                      Helpful ({review.helpfulCount || 0})
                    </button>
                    
                    <div className="text-xs text-muted">
                      Review ID: #{review._id?.slice(-6)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-outline btn-sm gap-2"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`btn btn-sm ${
                        pagination.page === pageNum ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="btn btn-outline btn-sm gap-2"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsSection;