import axiosSecure from "../api/axiosSecure";

export const createPayment = async (orderId) => {
  const { data } = await axiosSecure.post("/payments/create", { orderId });
  return data;
};
