// pages/Books/BookDetails.jsx - FIXED VERSION
import React, { useEffect, useState } from 'react';
import MainLayout from '../../layout/MainLayout';
import { useParams } from 'react-router-dom';
import axiosPublic from '../../api/axiosPublic';
import axiosSecure from '../../api/axiosSecure';
import { useAuth } from '../../hooks/useAuth';
import WishlistButton from '../../components/WishlistButton';
import OrderModal from '../../components/OrderModal';
import ReviewForm from '../../components/ReviewForm';
import ReviewsSection from '../../components/ReviewsSection';
import { 
  ShoppingCart, 
  Share2, 
  BookOpen, 
  Clock, 
  Truck,
  MessageSquare,
  Star
} from 'lucide-react';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userCanReview, setUserCanReview] = useState(false);
  const [checkingReviewEligibility, setCheckingReviewEligibility] = useState(false);
  const [bookStats, setBookStats] = useState({
    averageRating: 0,
    reviewCount: 0
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get(`/books/${id}`);
        setBook(res.data);
        
        // Extract review stats from book data
        if (res.data) {
          setBookStats({
            averageRating: res.data.avgRating || 0,
            reviewCount: res.data.reviewCount || 0
          });
        }
      } catch (err) {
        console.error("Failed to load book", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const checkReviewEligibility = async () => {
    if (!user || !book?._id) {
      setUserCanReview(false);
      return;
    }

    setCheckingReviewEligibility(true);
    try {
      const response = await axiosSecure.get(`/reviews/can-review/${book._id}`);
      setUserCanReview(response.data.canReview);
    } catch (error) {
      console.error('Check review eligibility error:', error);
      setUserCanReview(false);
    } finally {
      setCheckingReviewEligibility(false);
    }
  };

  // Call this when book loads
  useEffect(() => {
    if (book && user) {
      checkReviewEligibility();
    }
  }, [book, user]);

  const handleOrder = () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'warning', 
          message: 'Please login to place an order' 
        }
      }));
      return;
    }
    setShowOrderModal(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book?.bookName,
        text: `Check out "${book?.bookName}" on BookCourier`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'success', 
          message: 'Link copied to clipboard!' 
        }
      }));
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    // Refresh book data to get updated ratings
    if (id) {
      axiosPublic.get(`/books/${id}`).then(res => {
        setBook(res.data);
        setBookStats({
          averageRating: res.data.avgRating || 0,
          reviewCount: res.data.reviewCount || 0
        });
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!book) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-error">Book not found</h2>
          <p className="mt-2">The book you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/books">Books</a></li>
            <li className="font-semibold">{book.bookName}</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Book Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative">
                <img
                  src={book.image || '/assets/images/book-placeholder.png'}
                  alt={book.bookName}
                  className="w-full h-auto rounded-2xl shadow-2xl border-8 border-base-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/book-placeholder.png';
                  }}
                />
                
                {/* Wishlist Button Overlay */}
                <div className="absolute top-4 right-4">
                  <WishlistButton
                    bookId={book._id}
                    bookName={book.bookName}
                    bookImage={book.image}
                    bookPrice={book.price}
                    size="lg"
                  />
                </div>

                {/* Rating Badge */}
                {bookStats.averageRating > 0 && (
                  <div className="absolute bottom-4 left-4 bg-primary text-primary-content px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star size={16} className="fill-current" />
                    <span className="font-bold">{bookStats.averageRating.toFixed(1)}</span>
                    <span className="text-xs">({bookStats.reviewCount})</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={handleOrder}
                  className="btn btn-primary btn-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Order Now
                </button>
                
                <button
                  onClick={handleShare}
                  className="btn btn-outline btn-lg flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>

              {/* Write Review Button */}
              {userCanReview && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn btn-secondary btn-lg w-full mt-3 gap-2"
                >
                  <MessageSquare size={20} />
                  Write a Review
                </button>
              )}

              {/* Quick Info */}
              <div className="mt-6 card bg-base-200 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="text-primary" size={20} />
                    <div>
                      <p className="text-sm font-semibold">Delivery</p>
                      <p className="text-xs text-muted">2-3 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-primary" size={20} />
                    <div>
                      <p className="text-sm font-semibold">Return Policy</p>
                      <p className="text-xs text-muted">14 days returnable</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-primary" size={20} />
                    <div>
                      <p className="text-sm font-semibold">Condition</p>
                      <p className="text-xs text-muted">Like new, well-maintained</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Book Details */}
          <div className="lg:col-span-2">
            {/* Book Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {book.bookName}
                  </h1>
                  <p className="text-xl text-muted mb-4">
                    By <span className="font-semibold text-primary">{book.author}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ${book.price}
                  </div>
                  <div className="text-sm text-muted">Free delivery</div>
                </div>
              </div>

              {/* Rating Display */}
              {bookStats.averageRating > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={
                          star <= Math.round(bookStats.averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-300 text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg">
                    {bookStats.averageRating.toFixed(1)} out of 5
                  </span>
                  <span className="text-muted">
                    ({bookStats.reviewCount} review{bookStats.reviewCount !== 1 ? 's' : ''})
                  </span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {book.category && (
                  <span className="badge badge-primary badge-lg">
                    {book.category}
                  </span>
                )}
                {book.status === 'published' && (
                  <span className="badge badge-success badge-lg">
                    Available
                  </span>
                )}
                <span className="badge badge-outline badge-lg">
                  Hardcover
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card bg-base-200 p-4">
                <h3 className="font-bold mb-3">Book Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted">ISBN</span>
                    <span className="font-medium">978-{Date.now().toString().slice(-9)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Pages</span>
                    <span className="font-medium">320</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Language</span>
                    <span className="font-medium">English</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Publisher</span>
                    <span className="font-medium">BookCourier Press</span>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200 p-4">
                <h3 className="font-bold mb-3">Shipping Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted">Delivery</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Estimated</span>
                    <span className="font-medium">2-3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Return</span>
                    <span className="font-medium">14 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Availability</span>
                    <span className="badge badge-success">In Stock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && userCanReview && (
              <div className="mb-8">
                <ReviewForm
                  bookId={book._id}
                  bookName={book.bookName}
                  onReviewSubmitted={handleReviewSubmitted}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {/* Reviews Section */}
            <section className="mb-8">
              <ReviewsSection bookId={book._id} />
            </section>
          </div>
        </div>

        {/* Related Books Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* This would be populated with related books from API */}
            <div className="card bg-base-200 p-4 text-center">
              <p className="text-muted">More books coming soon...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        book={book}
        onOrderSuccess={(order) => {
          console.log('Order successful:', order);
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              type: 'success', 
              message: 'Order placed successfully! You can now review this book after delivery.' 
            }
          }));
          // Refresh review eligibility after ordering
          if (user) {
            checkReviewEligibility();
          }
        }}
      />
    </>
  );
}