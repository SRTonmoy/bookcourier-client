import axiosSecure from "../api/axiosSecure";

export const createOrder = (order) => {
  return axiosSecure.post("/orders", order);
};

export const myOrders = () => {
  return axiosSecure.get("/orders/my");
};

export const getAllOrders = () => {
  return axiosSecure.get("/orders");
};

export const confirmPayment = (id) => {
  return axiosSecure.patch(`/orders/pay/${id}`);
};
