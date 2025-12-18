
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuth } from '../hooks/useAuth';

const WishlistButton = ({ 
  bookId, 
  bookName, 
  bookImage, 
  bookPrice,
  size = 'md',
  showLabel = false 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { user } = useAuth();
  const { 
    addToWishlist, 
    removeFromWishlist, 
    isBookInWishlist,
    checkInWishlist,
    isLoading 
  } = useWishlistStore();

  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user && bookId) {
        setIsChecking(true);
        try {
          const isInWishlist = await checkInWishlist(bookId);
          setInWishlist(isInWishlist);
        } catch (error) {
          console.error('Error checking wishlist:', error);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };

    checkWishlistStatus();
  }, [user, bookId, checkInWishlist]);

 
  useEffect(() => {
    if (bookId) {
      setInWishlist(isBookInWishlist(bookId));
    }
  }, [bookId, isBookInWishlist]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'warning', 
          message: 'Please login to use wishlist' 
        }
      }));
      return;
    }

    if (!bookId) {
      console.error('Book ID is required for wishlist');
      return;
    }

    setIsAnimating(true);

    if (inWishlist) {
     
      await removeFromWishlist(bookId);
    } else {
  
      await addToWishlist({
        bookId,
        bookName,
        bookImage,
        bookPrice
      });
    }

 
    setTimeout(() => setIsAnimating(false), 600);
  };

 
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  if (!user) {
    return (
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              type: 'warning', 
              message: 'Login to save to wishlist' 
            }
          }));
        }}
        className={`btn btn-circle btn-ghost ${sizeClasses[size]} relative group`}
        title="Login to use wishlist"
        disabled={isLoading}
      >
        <Heart size={iconSizes[size]} className="text-gray-400" />
        {showLabel && (
          <span className="text-xs mt-1">Wishlist</span>
        )}
      </button>
    );
  }

  if (isChecking) {
    return (
      <button
        className={`btn btn-circle btn-ghost ${sizeClasses[size]} relative`}
        disabled
      >
        <span className="loading loading-spinner loading-xs"></span>
        {showLabel && (
          <span className="text-xs mt-1">Loading</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleWishlistToggle}
      className={`btn btn-circle btn-ghost ${sizeClasses[size]} relative group transition-all duration-300 ${
        inWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
      }`}
      disabled={isLoading || isAnimating}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
    
      <Heart
        size={iconSizes[size]}
        className={`transition-all duration-300 ${
          inWishlist ? 'fill-current' : 'fill-transparent'
        } ${
          isAnimating ? 'scale-125' : 'scale-100'
        }`}
      />
      
      {/* Animation ring */}
      {isAnimating && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 border-2 border-red-500 rounded-full animate-ping"></div>
        </div>
      )}
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-base-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      </div>
      
      {showLabel && (
        <span className="text-xs mt-1">
          {inWishlist ? 'Saved' : 'Wishlist'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;