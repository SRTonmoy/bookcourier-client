import axiosSecure from "../api/axiosSecure";

export const wishlistService = {
  
  addToWishlist: async (bookData) => {
    const { data } = await axiosSecure.post("/wishlist", bookData);
    return data;
  },

 
  removeFromWishlist: async (bookId) => {
    const { data } = await axiosSecure.delete(`/wishlist/${bookId}`);
    return data;
  },

 
  getMyWishlist: async () => {
    const { data } = await axiosSecure.get("/wishlist/my");
    return data;
  },


  checkInWishlist: async (bookId) => {
    const { data } = await axiosSecure.get(`/wishlist/check/${bookId}`);
    return data;
  },

 
  getWishlistCount: async () => {
    const { data } = await axiosSecure.get("/wishlist/count");
    return data;
  },

 
  clearWishlist: async () => {
    const { data } = await axiosSecure.delete("/wishlist/clear/all");
    return data;
  },
};

export default wishlistService;