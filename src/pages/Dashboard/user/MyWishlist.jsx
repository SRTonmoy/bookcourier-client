// pages/Dashboard/user/MyWishlist.jsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import { useWishlistStore } from '../../../store/wishlistStore';
import { Link } from 'react-router-dom';
import { 
  Heart, ShoppingCart, Trash2, BookOpen, 
  DollarSign, Calendar, AlertCircle 
} from 'lucide-react';

export default function MyWishlist() {
  const { 
    wishlistItems, 
    isLoading, 
    fetchWishlist, 
    removeFromWishlist, 
    clearWishlist,
    getWishlistCount 
  } = useWishlistStore();

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isClearing, setIsClearing] = useState(false);
  // Add right after your existing useState hooks in MyWishlist.jsx
useEffect(() => {
  console.log('Wishlist State Debug:', {
    items: wishlistItems,
    itemsLength: wishlistItems?.length,
    isLoading,
    firstItem: wishlistItems[0]
  });
}, [wishlistItems, isLoading]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (bookId) => {
    if (window.confirm('Remove from wishlist?')) {
      await removeFromWishlist(bookId);
    }
  };

  const handleClearAll = async () => {
    if (wishlistItems.length === 0) return;
    
    if (window.confirm(`Clear all ${wishlistItems.length} items from wishlist?`)) {
      setIsClearing(true);
      await clearWishlist();
      setIsClearing(false);
      setSelectedItems(new Set());
    }
  };

  const toggleSelectItem = (bookId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedItems(newSelected);
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) return;
    
    if (window.confirm(`Remove ${selectedItems.size} selected items?`)) {
      const promises = Array.from(selectedItems).map(bookId => 
        removeFromWishlist(bookId)
      );
      await Promise.all(promises);
      setSelectedItems(new Set());
    }
  };

  const handleMoveToCart = (bookId) => {
    // This would integrate with cart system
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { 
        type: 'info', 
        message: 'Cart integration coming soon!' 
      }
    }));
  };

 if (isLoading) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-muted">Loading your wishlist...</p>
      </div>
    </div>
  );
}

  return (
 
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Heart className="text-red-500" size={28} />
              My Wishlist
            </h2>
            <p className="text-muted mt-1">
              {getWishlistCount()} {getWishlistCount() === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {selectedItems.size > 0 && (
                <button
                  onClick={handleRemoveSelected}
                  className="btn btn-error btn-sm gap-2"
                  disabled={isClearing}
                >
                  <Trash2 size={16} />
                  Remove Selected ({selectedItems.size})
                </button>
              )}
              
              <button
                onClick={handleClearAll}
                className="btn btn-outline btn-error btn-sm gap-2"
                disabled={isClearing}
              >
                {isClearing ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Clear All
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body items-center text-center py-12">
              <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center mb-6">
                <Heart size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
              <p className="text-muted mb-6 max-w-md">
                Save books you're interested in by clicking the heart icon on any book page.
              </p>
              <div className="flex gap-4">
                <Link to="/books" className="btn btn-primary gap-2">
                  <BookOpen size={18} />
                  Browse Books
                </Link>
                <Link to="/dashboard/my-orders" className="btn btn-outline gap-2">
                  <ShoppingCart size={18} />
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <Heart size={24} />
                  </div>
                  <div className="stat-title">Total Items</div>
                  <div className="stat-value">{getWishlistCount()}</div>
                  <div className="stat-desc">Saved books</div>
                </div>
              </div>
              
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <DollarSign size={24} />
                  </div>
                  <div className="stat-title">Total Value</div>
                  <div className="stat-value">
                    ${wishlistItems.reduce((sum, item) => sum + (item.bookPrice || 0), 0).toFixed(2)}
                  </div>
                  <div className="stat-desc">If purchased</div>
                </div>
              </div>
              
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-figure text-accent">
                    <Calendar size={24} />
                  </div>
                  <div className="stat-title">Recently Added</div>
                  <div className="stat-value">
                    {new Date(Math.max(...wishlistItems.map(item => new Date(item.addedAt)))) 
                      .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="stat-desc">Last update</div>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div 
                  key={item._id || item.bookId} 
                  className={`card bg-base-100 shadow-lg hover:shadow-xl transition-shadow border-2 ${
                    selectedItems.has(item.bookId) ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <div className="card-body p-5">
                    {/* Selection Checkbox */}
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-3 p-0">
                        <input 
                          type="checkbox" 
                          className="checkbox checkbox-primary"
                          checked={selectedItems.has(item.bookId)}
                          onChange={() => toggleSelectItem(item.bookId)}
                        />
                        <span className="label-text font-medium">Select</span>
                      </label>
                    </div>

                    {/* Book Info */}
                    <div className="flex gap-4 mt-2">
                      {/* Book Image */}
                      <div className="flex-shrink-0">
                        <Link to={`/books/${item.bookId}`}>
                          <img
                            src={item.bookImage || '/assets/images/book-placeholder.png'}
                            alt={item.bookName}
                            className="w-24 h-32 object-cover rounded-lg shadow"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/images/book-placeholder.png';
                            }}
                          />
                        </Link>
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/books/${item.bookId}`} className="hover:no-underline">
                          <h3 className="font-bold text-lg line-clamp-2 hover:text-primary transition-colors">
                            {item.bookName}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted mt-1">
                          By {item.bookAuthor || 'Unknown Author'}
                        </p>
                        
                        <div className="mt-3">
                          <div className="text-xl font-bold text-primary">
                            ${item.bookPrice?.toFixed(2) || '0.00'}
                          </div>
                          <div className="text-xs text-muted mt-1">
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="card-actions justify-between mt-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMoveToCart(item.bookId)}
                          className="btn btn-primary btn-sm gap-2"
                          title="Add to cart"
                        >
                          <ShoppingCart size={16} />
                          Order
                        </button>
                        
                        <Link
                          to={`/books/${item.bookId}`}
                          className="btn btn-outline btn-sm gap-2"
                        >
                          <BookOpen size={16} />
                          Details
                        </Link>
                      </div>
                      
                      <button
                        onClick={() => handleRemove(item.bookId)}
                        className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Status */}
                    <div className="mt-4 pt-4 border-t border-base-300">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Status</span>
                        <span className="badge badge-success badge-sm">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bulk Actions Footer */}
            {selectedItems.size > 0 && (
              <div className="sticky bottom-4 mt-8 p-4 bg-base-100 border border-base-300 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={20} className="text-info" />
                    <span className="font-medium">
                      {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleRemoveSelected}
                      className="btn btn-error btn-sm gap-2"
                    >
                      <Trash2 size={16} />
                      Remove Selected
                    </button>
                    <button
                      onClick={() => {
                        const selectedArray = Array.from(selectedItems);
                        selectedArray.forEach(bookId => handleMoveToCart(bookId));
                      }}
                      className="btn btn-primary btn-sm gap-2"
                    >
                      <ShoppingCart size={16} />
                      Order Selected
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mt-8 alert alert-info">
              <div>
                <AlertCircle size={24} />
                <div>
                  <h4 className="font-bold">Wishlist Tips</h4>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Select multiple items for bulk actions</li>
                    <li>• Click "Order" to move items to your cart</li>
                    <li>• Books remain in wishlist until purchased or removed</li>
                    <li>• Get notified when wishlisted books go on sale</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    
  );
}