import React, { useState } from "react";
import { X, MapPin, Phone, User, Mail } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { createOrder } from "../../services/orderService";

const OrderModal = ({ book, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.length < 10) {
      newErrors.address = "Address is too short";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        bookId: book._id,
        phone: formData.phone,
        address: formData.address,
      };

      const result = await createOrder(orderData);

      if (result.success) {
        // Show success message
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: {
              type: "success",
              message: "Order placed successfully!",
              duration: 5000,
            },
          })
        );
        
        if (onSuccess) {
          onSuccess(result.orderId);
        }
        
        // Close modal after a delay
        setTimeout(() => {
          onClose();
          // Reset form
          setFormData({ phone: "", address: "" });
        }, 1500);
      }
    } catch (error) {
      console.error("Order error:", error);
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            type: "error",
            message: error.response?.data?.message || "Failed to place order. Please try again.",
          },
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-content p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Order Now</h3>
              <p className="text-sm opacity-90">Complete your book purchase</p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white hover:bg-opacity-20"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-6 border-b">
          <div className="flex gap-4">
            <img
              src={book.image || "/assets/images/book-placeholder.png"}
              alt={book.bookName}
              className="w-20 h-28 object-cover rounded-lg shadow"
            />
            <div className="flex-1">
              <h4 className="font-bold text-lg line-clamp-2">{book.bookName}</h4>
              <p className="text-sm text-muted">By {book.author}</p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    ${book.price?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <span className={`badge ${book.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                  {book.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User Info (Readonly) */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <User size={18} className="text-muted" />
              <div className="flex-1">
                <p className="text-sm text-muted">Name</p>
                <p className="font-medium">{user?.displayName || "User"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <Mail size={18} className="text-muted" />
              <div className="flex-1">
                <p className="text-sm text-muted">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Phone Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Phone size={16} />
                Phone Number
              </span>
            </label>
            <input
              type="tel"
              name="phone"
              className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.phone && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.phone}</span>
              </label>
            )}
          </div>

          {/* Address Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <MapPin size={16} />
                Delivery Address
              </span>
            </label>
            <textarea
              name="address"
              className={`textarea textarea-bordered h-32 ${errors.address ? 'textarea-error' : ''}`}
              placeholder="Enter your complete delivery address (House #, Street, City, Postal Code)"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.address && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.address}</span>
              </label>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-base-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Book Price</span>
              <span>${book.price?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>$5.00</span>
            </div>
            <div className="divider my-0"></div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">
                ${((book.price || 0) + 5).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className="text-xs text-muted text-center">
            <p>
              By placing this order, you agree to our terms of service and delivery policy.
              Payment is cash on delivery.
            </p>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;