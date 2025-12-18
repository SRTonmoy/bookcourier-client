import axiosSecure from "../api/axiosSecure";

export const paymentService = {
  
  processPayment: async (orderId, paymentMethod = "cash_on_delivery") => {
    const { data } = await axiosSecure.post("/payments/create", {
      orderId,
      paymentMethod,
    });
    return data;
  },


  getMyPayments: async () => {
    const { data } = await axiosSecure.get("/payments/my");
    return data;
  },


  getPaymentById: async (paymentId) => {
    const { data } = await axiosSecure.get(`/payments/${paymentId}`);
    return data;
  },
};

export default paymentService;