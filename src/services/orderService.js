import api from "./api";

export const createOrder = (order) =>
  api.post("/api/orders", order);

export const getMyOrders = () =>
  api.get("/api/orders/my");
