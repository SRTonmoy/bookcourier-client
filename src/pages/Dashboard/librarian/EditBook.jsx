// pages/Dashboard/librarian/EditBook.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layout/DashboardLayout';
import axiosPublic from '../../../api/axiosPublic';
import axiosSecure from '../../../api/axiosSecure';
import { useRole } from '../../../hooks/useRole';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [book, setBook] = useState(null);
  const [formData, setFormData] = useState({
    bookName: '',
    author: '',
    price: '',
    category: '',
    description: '',
    image: '',
    status: 'published'
  });
  const { role } = useRole();

  useEffect(() => {
    if (id && role === 'librarian') {
      fetchBook();
    }
  }, [id, role]);

  const fetchBook = async () => {
    try {
      const { data } = await axiosPublic.get(`/books/${id}`);
      setBook(data);
      setFormData({
        bookName: data.bookName || '',
        author: data.author || '',
        price: data.price || '',
        category: data.category || '',
        description: data.description || '',
        image: data.image || '',
        status: data.status || 'published'
      });
    } catch (error) {
      console.error('Failed to fetch book:', error);
      alert('Book not found or access denied');
      navigate('/dashboard/my-books');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    setUpdating(true);
    try {
      const updates = {
        ...formData,
        price: parseFloat(formData.price),
        updatedAt: new Date()
      };

      await axiosSecure.put(`/books/${id}`, updates);
      
      alert('Book updated successfully!');
      navigate('/dashboard/my-books');
      
    } catch (error) {
      console.error('Failed to update book:', error);
      alert('Failed to update book. You may not have permission to edit this book.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8">Loading book details...</div>;
  if (role !== 'librarian') {
    return (
      <DashboardLayout>
        <div className="p-8 text-error text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p>Only librarians can edit books.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!book) return <div className="p-8">Book not found</div>;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Edit Book</h2>
          <button 
            onClick={() => navigate('/dashboard/my-books')}
            className="btn btn-outline btn-sm"
          >
            ← Back to My Books
          </button>
        </div>

        {/* Book Info Header */}
        <div className="card bg-base-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={book.image || '/book-placeholder.png'} 
              alt={book.bookName}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="text-xl font-bold">{book.bookName}</h3>
              <p className="text-muted">By {book.author}</p>
              <div className="flex gap-2 mt-2">
                <span className="badge">{book.category || 'Uncategorized'}</span>
                <span className={`badge ${book.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                  {book.status}
                </span>
                <span className="badge badge-outline">${book.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="e.g., Fiction, Programming, Science"
              />
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

            {/* Image URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Image URL</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="https://example.com/book-cover.jpg"
              />
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
              rows="4"
            />
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Image Preview</span>
              </label>
              <div className="border rounded-lg p-4 bg-base-200">
                <img 
                  src={formData.image} 
                  alt="Book preview" 
                  className="max-w-xs mx-auto rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/book-placeholder.png';
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard/my-books')}
              className="btn btn-outline"
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updating}
            >
              {updating ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Updating...
                </>
              ) : (
                'Update Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}