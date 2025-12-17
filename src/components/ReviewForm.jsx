// components/ReviewForm.jsx
import React, { useState, useEffect } from 'react';
import { Send, X, Edit, AlertCircle } from 'lucide-react';
import StarRating from './StarRating';
import axiosSecure from '../api/axiosSecure';
import { useAuth } from '../hooks/useAuth';

const ReviewForm = ({ 
  bookId, 
  bookName,
  onReviewSubmitted,
  onCancel,
  existingReview = null,
  mode = 'create' // 'create' or 'edit'
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  
  // Check review eligibility
  const [canReview, setCanReview] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!user || !bookId || mode === 'edit') {
        setCheckingEligibility(false);
        return;
      }

      try {
        const response = await axiosSecure.get(`/reviews/can-review/${bookId}`);
        setCanReview(response.data.canReview);
      } catch (error) {
        console.error('Check eligibility error:', error);
        setCanReview(false);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkEligibility();
  }, [user, bookId, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Review comment must be at least 10 characters');
      return;
    }

    if (comment.trim().length > 500) {
      setError('Review comment cannot exceed 500 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      
      if (mode === 'edit' && existingReview) {
        // Update existing review
        response = await axiosSecure.put(`/reviews/${existingReview._id}`, {
          rating,
          comment
        });
      } else {
        // Create new review
        response = await axiosSecure.post('/reviews', {
          bookId,
          rating,
          comment
        });
      }

      if (response.data.success) {
        setSuccess(response.data.message);
        
        // Clear form for new reviews
        if (mode === 'create') {
          setRating(0);
          setComment('');
        }
        
        // Callback to parent
        if (onReviewSubmitted) {
          onReviewSubmitted(response.data.review);
        }
        
        // Auto-hide success message
        setTimeout(() => {
          setSuccess('');
          if (mode === 'create' && onCancel) {
            onCancel();
          }
        }, 3000);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage || 'Failed to submit review');
      console.error('Review submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (checkingEligibility && mode === 'create') {
    return (
      <div className="text-center py-4">
        <span className="loading loading-spinner loading-sm"></span>
        <p className="text-sm text-muted mt-2">Checking review eligibility...</p>
      </div>
    );
  }

  if (mode === 'create' && !canReview && !checkingEligibility) {
    return (
      <div className="alert alert-warning">
        <AlertCircle size={20} />
        <div>
          <h3 className="font-bold">Review Not Available</h3>
          <div className="text-sm">
            You can only review books you have ordered and received.
            {!user && ' Please login first.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg border">
      <div className="card-body p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="card-title">
              {mode === 'edit' ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            {bookName && (
              <p className="text-sm text-muted mt-1">
                For: <span className="font-medium">{bookName}</span>
              </p>
            )}
          </div>
          
          {onCancel && (
            <button
              onClick={handleCancel}
              className="btn btn-ghost btn-circle btn-sm"
              disabled={loading}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Your Rating *
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            editable={true}
            size="lg"
            showLabel={true}
          />
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="textarea textarea-bordered w-full h-32"
            placeholder="Share your thoughts about this book... (Min. 10 characters)"
            disabled={loading}
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted">
              {comment.length}/500 characters
            </span>
            <span className="text-xs text-muted">
              * Required
            </span>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="alert alert-error mb-4">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4">
            <span className="text-lg">✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              onClick={handleCancel}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          
          <button
            onClick={handleSubmit}
            className="btn btn-primary gap-2"
            disabled={loading || rating === 0}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {mode === 'edit' ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              <>
                {mode === 'edit' ? <Edit size={18} /> : <Send size={18} />}
                {mode === 'edit' ? 'Update Review' : 'Submit Review'}
              </>
            )}
          </button>
        </div>

        {/* Review Guidelines */}
        <div className="mt-6 pt-4 border-t border-base-300">
          <h4 className="text-sm font-semibold mb-2">Review Guidelines:</h4>
          <ul className="text-xs text-muted space-y-1">
            <li>• Be respectful and constructive</li>
            <li>• Share your genuine experience with the book</li>
            <li>• Avoid spoilers or sensitive content</li>
            <li>• Reviews are public and cannot be deleted by administrators</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;