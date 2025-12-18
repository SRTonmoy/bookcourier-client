// store/wishlistStore.js - UPDATED TO MATCH YOUR SERVER
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosSecure from '../api/axiosSecure';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      wishlistItems: [],
      isLoading: false,
      error: null,

   
      fetchWishlist: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosSecure.get('/wishlist/my'); // Changed from '/wishlist'
          
          
          if (response.data.success) {
            set({ 
              wishlistItems: response.data.wishlist || [], // Matches server response
              error: null 
            });
          } else {
            set({ wishlistItems: [] });
          }
          
        } catch (error) {
          console.error('Fetch wishlist error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch wishlist';
          set({ 
            error: errorMessage,
            wishlistItems: [] 
          });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Add book to wishlist - FIXED: Matches server data structure
      addToWishlist: async (bookData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosSecure.post('/wishlist', bookData);
          
          
          if (response.data.success) {
            // Fetch fresh data from server to ensure consistency
            await get().fetchWishlist();
            
            // Show success
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { 
                type: 'success', 
                message: 'Added to wishlist!' 
              }
            }));
            
            return { success: true, data: response.data };
          }
          
          throw new Error(response.data.message || 'Failed to add');
          
        } catch (error) {
          console.error('Add to wishlist error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to add to wishlist';
          set({ error: errorMessage });
          
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              type: 'error', 
              message: errorMessage 
            }
          }));
          
          return { success: false, message: errorMessage };
          
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Remove from wishlist - FIXED: Matches "/wishlist/:bookId"
      removeFromWishlist: async (bookId) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosSecure.delete(`/wishlist/${bookId}`);
          
          
          if (response.data.success) {
            // Remove from local state immediately
            set(state => ({
              wishlistItems: state.wishlistItems.filter(item => item.bookId !== bookId)
            }));
            
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { 
                type: 'success', 
                message: 'Removed from wishlist!' 
              }
            }));
            
            return { success: true };
          }
          
          throw new Error(response.data.message || 'Failed to remove');
          
        } catch (error) {
          console.error('Remove from wishlist error:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to remove';
          set({ error: errorMessage });
          
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              type: 'error', 
              message: errorMessage 
            }
          }));
          
          return { success: false, message: errorMessage };
          
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Check if book is in wishlist - FIXED: Matches "/wishlist/check/:bookId"
      checkInWishlist: async (bookId) => {
        try {
          if (!bookId || bookId === "undefined") return false;
          
          const response = await axiosSecure.get(`/wishlist/check/${bookId}`);
          
          if (response.data.success) {
            return response.data.inWishlist;
          }
          
          return false;
          
        } catch (error) {
          console.error('Check wishlist error:', error);
          return false;
        }
      },
      
      // Clear entire wishlist - FIXED: Matches "/wishlist/clear/all"
      clearWishlist: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosSecure.delete('/wishlist/clear/all');
          
          
          if (response.data.success) {
            set({ wishlistItems: [] });
            
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { 
                type: 'success', 
                message: `Cleared ${response.data.deletedCount} items from wishlist!` 
              }
            }));
            
            return { success: true };
          }
          
          throw new Error('Failed to clear wishlist');
          
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ error: errorMessage });
          
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              type: 'error', 
              message: errorMessage 
            }
          }));
          
          return { success: false, message: errorMessage };
          
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Helper methods
      getWishlistCount: () => {
        return get().wishlistItems.length;
      },
      
      isBookInWishlist: (bookId) => {
        if (!bookId) return false;
        return get().wishlistItems.some(item => item.bookId === bookId);
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'bookcourier-wishlist',
      partialize: (state) => ({ 
        wishlistItems: state.wishlistItems 
      }),
      onRehydrateStorage: () => {
        
        return (state) => {
          if (state) {
          }
        };
      }
    }
  )
);