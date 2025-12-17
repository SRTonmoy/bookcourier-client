// pages/Dashboard/librarian/AddBook.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import axiosSecure from '../../../api/axiosSecure';
import { useRole } from '../../../hooks/useRole';
import { useAuth } from '../../../hooks/useAuth';

export default function AddBook() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookName: '',
    author: '',
    price: '',
    category: '',
    description: '',
    image: '',
    status: 'published'
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const { role } = useRole();
  const { user } = useAuth();

  const categories = [
    'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Business',
    'Self-Help', 'Biography', 'History', 'Romance', 'Mystery',
    'Fantasy', 'Academic', 'Programming', 'Finance', 'Health'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // For now, we'll just use a placeholder URL
      // In production, upload to Firebase Storage or Cloudinary
      setFormData(prev => ({
        ...prev,
        image: `https://picsum.photos/400/300?random=${Date.now()}`
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookName || !formData.author || !formData.price) {
      alert('Please fill in required fields');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        createdAt: new Date(),
        updatedAt: new Date(),
        librarianId: user.uid,
        librarianEmail: user.email,
        views: 0
      };

      await axiosSecure.post('/books', bookData);
      
      alert('Book added successfully!');
      
      // Reset form
      setFormData({
        bookName: '',
        author: '',
        price: '',
        category: '',
        description: '',
        image: '',
        status: 'published'
      });
      setImageFile(null);
      setPreviewUrl('');
      
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('Failed to add book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'librarian') {
    return (
      <DashboardLayout>
        <div className="p-8 text-error text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p>Only librarians can add books.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Book Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Book Name *</span>
                </label>
                <input
                  type="text"
                  name="bookName"
                  value={formData.bookName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Enter book title"
                  required
                />
              </div>

              {/* Author */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Author *</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Enter author name"
                  required
                />
              </div>

              {/* Price */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Price ($) *</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Category */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="published">Published (Visible to users)</option>
                  <option value="unpublished">Unpublished (Hidden from users)</option>
                </select>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Book Cover Image</span>
                </label>
                
                {/* Image Preview */}
                <div className="mb-4">
                  {(previewUrl || formData.image) ? (
                    <div className="relative">
                      <img
                        src={previewUrl || formData.image}
                        alt="Book preview"
                        className="w-full h-64 object-cover rounded-lg border-2 border-dashed border-base-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl('');
                          setImageFile(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute top-2 right-2 btn btn-xs btn-circle btn-error"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-base-300 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📚</div>
                        <p className="text-sm text-muted">No image selected</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* File Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered w-full"
                    id="book-image"
                  />
                  <label htmlFor="book-image" className="btn btn-outline">
                    Browse
                  </label>
                </div>
                
                <div className="text-xs text-muted mt-2">
                  Upload book cover image (JPG, PNG, WebP). Max 5MB.
                </div>

                {/* Or URL Input */}
                <div className="divider text-sm">OR</div>
                
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                  placeholder="Or paste image URL"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered h-32"
              placeholder="Enter book description..."
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all fields?')) {
                  setFormData({
                    bookName: '',
                    author: '',
                    price: '',
                    category: '',
                    description: '',
                    image: '',
                    status: 'published'
                  });
                  setPreviewUrl('');
                }
              }}
              className="btn btn-outline"
              disabled={loading}
            >
              Clear
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Adding Book...
                </>
              ) : (
                'Add Book'
              )}
            </button>
          </div>
        </form>

        {/* Quick Tips */}
        <div className="mt-8 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold mb-2">📝 Quick Tips:</h3>
          <ul className="text-sm space-y-1">
            <li>• Published books will appear in the public catalog</li>
            <li>• Unpublished books are only visible to you and admins</li>
            <li>• You can edit books later from "My Books" page</li>
            <li>• Ensure book information is accurate before publishing</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}