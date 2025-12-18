import axiosSecure from "../api/axiosSecure";

export const invoiceService = {
  // Get user's invoices
  getMyInvoices: async () => {
    const { data } = await axiosSecure.get("/invoices/my");
    return data;
  },

  // Get single invoice
  getInvoiceById: async (invoiceId) => {
    const { data } = await axiosSecure.get(`/invoices/${invoiceId}`);
    return data;
  },

  // Download invoice PDF
  downloadInvoice: async (invoiceId) => {
    const { data } = await axiosSecure.get(`/invoices/${invoiceId}/download`, {
      responseType: "blob",
    });
    return data;
  },

  // Send invoice via email
  sendInvoice: async (invoiceId, email) => {
    const { data } = await axiosSecure.post(`/invoices/${invoiceId}/send`, {
      email,
    });
    return data;
  },

  // Generate invoice from order
  generateInvoice: async (orderId) => {
    const { data } = await axiosSecure.post(`/invoices/generate/${orderId}`);
    return data;
  },
};

export default invoiceService;