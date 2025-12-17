// components/OrderModal.jsx
import React, { useState, useEffect } from 'react';
import { X, MapPin, Phone, User, CreditCard, Truck } from 'lucide-react';
import axiosSecure from '../api/axiosSecure';
import { useAuth } from '../hooks/useAuth';

const OrderModal = ({ 
  isOpen, 
  onClose, 
  book,
  onOrderSuccess 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Details, 2: Confirm, 3: Success

  // Form state
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    phone: '',
    address: '',
    paymentMethod: 'cash_on_delivery',
    specialInstructions: ''
  });

  // Initialize form with user data
  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        userName: user.displayName || '',
        userEmail: user.email || ''
      }));
    }
  }, [user, isOpen]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrors({});
      setLoading(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmitOrder = async () => {
    if (!book?._id) {
      alert('Book information is missing');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        bookId: book._id,
        bookName: book.bookName,
        bookImage: book.image,
        bookPrice: book.price,
        ...formData
      };

      const response = await axiosSecure.post('/orders', orderData);
      
      if (response.data.success) {
        setStep(3);
        
        // Call success callback
        if (onOrderSuccess) {
          onOrderSuccess(response.data.order);
        }
        
        // Show success toast
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { 
            type: 'success', 
            message: 'Order placed successfully!' 
          }
        }));
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      
      const errorMessage = error.response?.data?.message || error.message;
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          type: 'error', 
          message: errorMessage || 'Failed to place order' 
        }
      }));
      
      // Go back to step 1 on error
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  if (!isOpen || !book) return null;

  // Calculate delivery date (2-3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-base-100 border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Order "{book.bookName}"</h2>
            <p className="text-sm text-muted mt-1">Complete your order details</p>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-circle"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNum 
                    ? 'bg-primary text-primary-content' 
                    : 'bg-base-300 text-base-content'
                }`}>
                  {stepNum}
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  step > stepNum ? 'bg-primary' : 'bg-base-300'
                }`} />
              </div>
            ))}
            <div className="text-xs text-center mt-2 flex justify-between w-full absolute left-6 right-6 top-16">
              <span className={step >= 1 ? 'text-primary font-medium' : 'text-muted'}>
                Details
              </span>
              <span className={step >= 2 ? 'text-primary font-medium' : 'text-muted'}>
                Confirm
              </span>
              <span className={step >= 3 ? 'text-primary font-medium' : 'text-muted'}>
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Step 1: Order Details */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Book Summary */}
              <div className="card bg-base-200 p-4">
                <div className="flex gap-4">
                  <img 
                    src={book.image || '/book-placeholder.png'} 
                    alt={book.bookName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{book.bookName}</h3>
                    <p className="text-muted">By {book.author}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-2xl font-bold text-primary">
                        ${book.price}
                      </span>
                      <span className="badge badge-success">In Stock</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Truck size={20} />
                  Delivery Information
                </h3>

                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <User size={16} />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Phone size={16} />
                      Phone Number *
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`input input-bordered ${errors.phone ? 'input-error' : ''}`}
                    placeholder="+880 1XXX-XXXXXX"
                    required
                  />
                  {errors.phone && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.phone}</span>
                    </label>
                  )}
                </div>

                {/* Address */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <MapPin size={16} />
                      Delivery Address *
                    </span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`textarea textarea-bordered h-32 ${errors.address ? 'textarea-error' : ''}`}
                    placeholder="Enter complete address including house number, street, city, and postal code"
                    required
                  />
                  {errors.address && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.address}</span>
                    </label>
                  )}
                </div>

                {/* Special Instructions */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Special Instructions (Optional)</span>
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-24"
                    placeholder="Any special delivery instructions, preferred delivery time, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold">Confirm Your Order</h3>
                <p className="text-muted">Please review your order details before confirming</p>
              </div>

              {/* Order Summary */}
              <div className="card bg-base-200 p-4">
                <h4 className="font-bold text-lg mb-3">Order Summary</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Book</span>
                    <span className="font-medium">{book.bookName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Author</span>
                    <span>{book.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Price</span>
                    <span>${book.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Delivery</span>
                    <span className="text-success">FREE</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${book.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info Summary */}
              <div className="card bg-base-200 p-4">
                <h4 className="font-bold text-lg mb-3">Delivery Information</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted">Name</span>
                    <span>{formData.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Phone</span>
                    <span>{formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Email</span>
                    <span>{formData.userEmail}</span>
                  </div>
                  <div>
                    <div className="text-muted mb-1">Address</div>
                    <div className="bg-base-100 p-3 rounded text-sm">
                      {formData.address}
                    </div>
                  </div>
                  {formData.specialInstructions && (
                    <div>
                      <div className="text-muted mb-1">Special Instructions</div>
                      <div className="bg-base-100 p-3 rounded text-sm">
                        {formData.specialInstructions}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Payment Method</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-base-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleInputChange}
                      className="radio radio-primary"
                    />
                    <div>
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-muted">Pay when you receive the book</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-base-200 opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online_payment"
                      disabled
                      className="radio"
                    />
                    <div>
                      <span className="font-medium">Online Payment</span>
                      <p className="text-sm text-muted">Credit/Debit Card, bKash, Nagad (Coming Soon)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="alert alert-info">
                <div>
                  <Truck size={20} />
                  <div>
                    <span className="font-medium">Estimated Delivery</span>
                    <div className="text-sm">
                      {deliveryDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl">✅</div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">Order Confirmed!</h3>
              <p className="text-muted mb-6">
                Thank you for your order. We'll process it soon and keep you updated.
              </p>
              
              <div className="bg-base-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-muted mb-2">Order Summary</div>
                <div className="font-bold text-lg">{book.bookName}</div>
                <div className="text-primary text-xl font-bold mt-2">${book.price}</div>
                <div className="text-sm mt-2">
                  Delivery to: {formData.address.split(',')[0]}
                </div>
              </div>
              
              <div className="alert alert-success">
                <div>
                  <span className="font-medium">What's Next?</span>
                  <div className="text-sm mt-1">
                    1. We'll contact you within 24 hours<br />
                    2. Track your order in Dashboard<br />
                    3. Expected delivery: {deliveryDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-base-100 border-t p-6">
          <div className="flex justify-between">
            {step === 1 ? (
              <>
                <button
                  onClick={handleClose}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleNextStep}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  Continue to Confirmation
                </button>
              </>
            ) : step === 2 ? (
              <>
                <button
                  onClick={() => setStep(1)}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmitOrder}
                  className="btn btn-primary gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleClose}
                className="btn btn-primary w-full"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;