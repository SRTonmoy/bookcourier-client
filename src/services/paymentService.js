import api from "./api";

export const createPaymentIntent = (price) =>
  api.post("/api/payments/create-intent", { price });
