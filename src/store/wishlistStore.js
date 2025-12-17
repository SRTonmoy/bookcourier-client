// store/wishlistStore.js
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
      
      // Actions
      addToWishlist: async (bookData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosSecure.post('/wishlist', bookData);
          
          if (response.data.success) {
            // Fetch updated wishlist
            await get().fetchWishlist();
            
            // Show success message
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { 
                  type: 'success', 
                  message: 'Added to wishlist!' 
                }
              }));
            }
            
            return { success: true, message: response.data.message };
          }
          
          throw new Error(response.data.message || 'Failed to add to wishlist');
          
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ error: errorMessage });
          
          // Show error message
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { 
                type: 'error', 
                message: errorMessage 
              }
            }));
          }
          
          return { success: false, message: errorMessage };
          
        } finally {
          set({ isLoading: false });
        }
      },
      
      removeFromWishlist: async (bookId) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosSecure.delete(`/wishlist/${bookId}`);
          
          if (response.data.success) {
            // Update local state immediately
            set(state => ({
              wishlistItems: state.wishlistItems.filter(item => item.bookId !== bookId)
            }));
            
            // Show success message
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { 
                  type: 'success', 
                  message: 'Removed from wishlist!' 
                }
              }));
            }
            
            return { success: true, message: response.data.message };
          }
          
          throw new Error(response.data.message || 'Failed to remove from wishlist');
          
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ error: errorMessage });
          
          // Show error message
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { 
                type: 'error', 
                message: errorMessage 
              }
            }));
          }
          
          return { success: false, message: errorMessage };
          
        } finally {
          set({ isLoading: false });
        }
      },
      
      fetchWishlist: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosSecure.get('/wishlist/my');
          
          if (response.data.success) {
            set({ 
              wishlistItems: response.data.wishlist || [],
              error: null 
            });
          } else {
            throw new Error('Failed to fetch wishlist');
          }
          
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ 
            error: errorMessage,
            wishlistItems: [] 
          });
          console.error('Fetch wishlist error:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      checkInWishlist: async (bookId) => {
        try {
          if (!bookId) return false;
          
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
      
      getWishlistCount: () => {
        return get().wishlistItems.length;
      },
      
      isBookInWishlist: (bookId) => {
        if (!bookId) return false;
        return get().wishlistItems.some(item => item.bookId === bookId);
      },
      
      clearWishlist: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axiosSecure.delete('/wishlist/clear/all');
          
          if (response.data.success) {
            set({ wishlistItems: [] });
            
            // Show success message
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { 
                  type: 'success', 
                  message: 'Wishlist cleared!' 
                }
              }));
            }
            
            return { success: true, message: response.data.message };
          }
          
          throw new Error('Failed to clear wishlist');
          
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          set({ error: errorMessage });
          
          // Show error message
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: { 
                type: 'error', 
                message: errorMessage 
              }
            }));
          }
          
          return { success: false, message: errorMessage };
          
        } finally {
          set({ isLoading: false });
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'bookcourier-wishlist',
      partialize: (state) => ({ 
        wishlistItems: state.wishlistItems 
      })
    }
  )
);