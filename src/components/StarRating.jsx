// components/StarRating.jsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  rating = 0,
  onRatingChange,
  size = 'md',
  editable = false,
  showLabel = false,
  maxStars = 5,
  readOnly = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const handleClick = (value) => {
    if (editable && onRatingChange && !readOnly) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (editable && !readOnly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (editable && !readOnly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const filled = starValue <= displayRating;
          
          return (
            <button
              key={index}
              type="button"
              className={`${sizeClasses[size]} transition-all duration-150 ${
                editable && !readOnly ? 'cursor-pointer hover:scale-110' : 'cursor-default'
              }`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readOnly || !editable}
              aria-label={`Rate ${starValue} out of ${maxStars} stars`}
            >
              <Star
                className={`${
                  filled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
                }`}
                size="100%"
              />
            </button>
          );
        })}
        
        {showLabel && (
          <span className="ml-2 text-lg font-semibold">
            {rating.toFixed(1)}/5
          </span>
        )}
      </div>
      
      {editable && !readOnly && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {displayRating > 0 ? `Selected: ${displayRating} star${displayRating !== 1 ? 's' : ''}` : 'Click to rate'}
        </div>
      )}
    </div>
  );
};


export const DisplayStarRating = ({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= Math.round(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : star <= rating
              ? 'fill-yellow-300 text-yellow-300'
              : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;