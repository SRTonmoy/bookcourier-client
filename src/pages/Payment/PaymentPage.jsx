import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Check, Shield, CreditCard, Wallet, Truck, AlertCircle, Receipt } from "lucide-react";
import axiosSecure from '../../api/axiosSecure';

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
      
        const endpoint = `/orders/${orderId}`;
        const { data } = await axiosSecure.get(endpoint);
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    if (!order) return;
    
    setProcessing(true);
    setError("");
    
    try {
      
      // Call your payment API
      const { data } = await axiosSecure.post('/payments/create', {
        orderId: order._id,
        paymentMethod
      });
      
      
      
      if (data.success) {
        // Show success message
        window.dispatchEvent(new CustomEvent("show-toast", {
          detail: {
            type: "success",
            message: `Payment successful! Invoice #${data.invoiceId} generated.`,
          },
        }));
        
    
        setOrder(prev => ({
          ...prev,
          paymentStatus: "paid"
        }));
        
      
        setTimeout(() => {
       
       
          window.dispatchEvent(new CustomEvent("show-invoice-modal", {
            detail: {
              invoiceId: data.invoiceId,
              amount: data.amount,
              transactionId: data.transactionId
            }
          }));
          
          // Option 3: Navigate back to orders
          navigate("/dashboard/my-orders");
        }, 2000);
        
      } else {
        setError(data.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      console.error("Error response:", err.response?.data);
      
      setError(err.response?.data?.message || "Payment failed. Please try again.");
      
      window.dispatchEvent(new CustomEvent("show-toast", {
        detail: {
          type: "error",
          message: "Payment failed. Please try again.",
        },
      }));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-muted">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Order Not Found</h2>
          <p className="mt-2 text-muted">The order you're trying to pay for doesn't exist.</p>
          <button
            onClick={() => navigate("/dashboard/my-orders")}
            className="btn btn-primary mt-4"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: "cash_on_delivery",
      name: "Cash on Delivery",
      icon: <Truck size={24} />,
      description: "Pay when you receive the book",
      fee: 0,
    },
    {
      id: "mobile_banking",
      name: "Mobile Banking",
      icon: <CreditCard size={24} />,
      description: "bKash / Nagad / Rocket",
      fee: 1.5,
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <Wallet size={24} />,
      description: "Visa, MasterCard, Amex",
      fee: 2.0,
    },
  ];

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
  const totalFee = selectedMethod ? selectedMethod.fee : 0;
  const deliveryFee = order.deliveryFee || 5.00;
  const finalAmount = order.amount + totalFee + deliveryFee;

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
          <p className="text-muted">Order ID: {order._id?.toString().slice(-8) || orderId}</p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title mb-6">Order Summary</h2>

                {/* Book Info */}
                <div className="flex gap-4 p-4 bg-base-200 rounded-lg mb-6">
                  <img
                    src={order.bookImage || '/book-placeholder.png'}
                    alt={order.bookName}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{order.bookName}</h3>
                    <p className="text-muted">By {order.bookAuthor}</p>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-primary">
                        ${order.bookPrice?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mb-6">
                  <h3 className="font-bold mb-3">Delivery Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-base-200 rounded-lg">
                      <p className="text-sm text-muted">Delivery To</p>
                      <p className="font-medium">{order.userName}</p>
                      <p className="text-sm">{order.address}</p>
                      <p className="text-sm">{order.phone}</p>
                    </div>
                    <div className="p-4 bg-base-200 rounded-lg">
                      <p className="text-sm text-muted">Order Status</p>
                      <p className="font-medium capitalize">{order.status}</p>
                      <p className="text-sm text-muted">Payment Status</p>
                      <p className={`font-medium ${order.paymentStatus === "paid" ? "text-success" : "text-warning"}`}>
                        {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="font-bold mb-4">Select Payment Method</h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary bg-opacity-10"
                            : "border-base-300 hover:border-primary"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="radio radio-primary"
                          />
                          <div className="flex items-center gap-3">
                            <span className="text-primary">{method.icon}</span>
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted">{method.description}</p>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm">
                          {method.fee === 0 ? "No Fee" : `Fee: $${method.fee}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Summary */}
          <div>
            <div className="card bg-base-100 shadow-lg sticky top-8">
              <div className="card-body">
                <h2 className="card-title mb-6">Payment Summary</h2>

                {/* Amount Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Book Price</span>
                    <span>${order.bookPrice?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  {totalFee > 0 && (
                    <div className="flex justify-between">
                      <span>Payment Processing Fee</span>
                      <span>${totalFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="divider my-2"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">${finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Features */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={20} className="text-success" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <ul className="text-sm text-muted space-y-1">
                    <li>• Encrypted transaction</li>
                    <li>• No card details stored</li>
                    <li>• 24/7 fraud monitoring</li>
                  </ul>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing || order.paymentStatus === "paid"}
                  className="btn btn-primary btn-lg w-full gap-2"
                >
                  {processing ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Processing...
                    </>
                  ) : order.paymentStatus === "paid" ? (
                    <>
                      <Check size={20} />
                      Already Paid
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Confirm Payment
                    </>
                  )}
                </button>

                {/* Invoice Info */}
                {order.paymentStatus === "paid" && (
                  <div className="mt-4 p-3 bg-success bg-opacity-10 rounded-lg">
                    <div className="flex items-center gap-2 text-success">
                      <Receipt size={18} />
                      <span className="font-medium">Invoice Generated</span>
                    </div>
                    <p className="text-sm mt-1">
                      Payment completed. Check your invoices for details.
                    </p>
                  </div>
                )}

                {/* Terms */}
                <div className="mt-6 text-xs text-center text-muted">
                  <p>
                    By clicking "Confirm Payment", you agree to our Terms of Service
                    and Privacy Policy.
                  </p>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => navigate("/dashboard/my-orders")}
                  className="btn btn-ghost btn-sm w-full mt-4"
                  disabled={processing}
                >
                  Cancel and Return to Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}