// services/invoiceService.js - UPDATED FOR YOUR DATA STRUCTURE
import axiosSecure from "../api/axiosSecure";

export const invoiceService = {
  // Get user's invoices from API
  getMyInvoices: async (refresh = false) => {
    try {
      const response = await axiosSecure.get(`/invoices/my${refresh ? '?refresh=true' : ''}`);
      return response.data.invoices || [];
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  },

  // Get single invoice
  getInvoiceById: async (invoiceId) => {
    try {
      const response = await axiosSecure.get(`/invoices/${invoiceId}`);
      return response.data.invoice;
    } catch (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }
  },

  // Download invoice PDF
  downloadInvoice: async (invoiceId) => {
    try {
      const response = await axiosSecure.get(`/invoices/${invoiceId}/download`);
      return response.data;
    } catch (error) {
      console.error("Error downloading invoice:", error);
      throw error;
    }
  },

  // Send invoice via email
  sendInvoiceEmail: async (invoiceId, email) => {
    try {
      const response = await axiosSecure.post(`/invoices/${invoiceId}/send`, { email });
      return response.data;
    } catch (error) {
      console.error("Error sending invoice email:", error);
      throw error;
    }
  },

  // Generate invoice data from your order structure
  formatInvoiceFromOrder: (order) => {
    // Calculate tax (10% of amount)
    const taxAmount = parseFloat((order.amount * 0.10).toFixed(2));
    
    // Create items array
    const items = [
      {
        name: order.bookName,
        quantity: 1,
        price: order.bookPrice,
        total: order.amount
      }
    ];
    
    // Add delivery fee if needed
    if (order.amount < 50) {
      items.push({
        name: 'Delivery Fee',
        quantity: 1,
        price: 5.00,
        total: 5.00
      });
    }
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + taxAmount;
    
    return {
      id: `INV-${order._id.toString().slice(-8).toUpperCase()}`,
      invoiceId: `INV-${order._id.toString().slice(-8).toUpperCase()}-${new Date(order.orderDate).getFullYear()}`,
      orderId: order._id,
      customer: order.userName,
      customerEmail: order.userEmail,
      customerPhone: order.phone,
      customerAddress: order.address,
      date: order.orderDate,
      dueDate: new Date(new Date(order.orderDate).getTime() + 7 * 24 * 60 * 60 * 1000),
      amount: parseFloat(order.amount.toFixed(2)),
      tax: taxAmount,
      total: parseFloat(total.toFixed(2)),
      status: order.paymentStatus === 'paid' ? 'paid' : 
              order.status === 'cancelled' ? 'cancelled' : 'pending',
      items: items,
      paymentMethod: order.paymentMethod,
      transactionId: null,
      notes: `Order #${order._id.toString().slice(-6)} - ${order.bookName}`,
      bookId: order.bookId,
      bookName: order.bookName,
      bookAuthor: order.bookAuthor,
      bookImage: order.bookImage,
      subtotal: parseFloat(subtotal.toFixed(2))
    };
  }
};