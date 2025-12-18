import axiosSecure from "../api/axiosSecure";

export const wishlistService = {
  // Add to wishlist
  addToWishlist: async (bookData) => {
    const { data } = await axiosSecure.post("/wishlist", bookData);
    return data;
  },

  // Remove from wishlist
  removeFromWishlist: async (bookId) => {
    const { data } = await axiosSecure.delete(`/wishlist/${bookId}`);
    return data;
  },

  // Get user's wishlist
  getMyWishlist: async () => {
    const { data } = await axiosSecure.get("/wishlist/my");
    return data;
  },

  // Check if book is in wishlist
  checkInWishlist: async (bookId) => {
    const { data } = await axiosSecure.get(`/wishlist/check/${bookId}`);
    return data;
  },

  // Get wishlist count
  getWishlistCount: async () => {
    const { data } = await axiosSecure.get("/wishlist/count");
    return data;
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    const { data } = await axiosSecure.delete("/wishlist/clear/all");
    return data;
  },
};

export default wishlistService;