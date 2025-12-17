// pages/Dashboard/admin/ManageBooks.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import axiosPublic from '../../../api/axiosPublic';
import axiosSecure from '../../../api/axiosSecure';
import { useRole } from '../../../hooks/useRole';

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useRole();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await axiosPublic.get('/books');
      setBooks(data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (bookId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'unpublished' : 'published';
    
    try {
      await axiosSecure.patch(`/books/${bookId}/status`, { status: newStatus });
      alert(`Book ${newStatus === 'published' ? 'published' : 'unpublished'}`);
      fetchBooks();
    } catch (error) {
      console.error('Failed to update book:', error);
      alert('Failed to update book');
    }
  };

  const deleteBook = async (bookId) => {
    if (!window.confirm('Are you sure? This will also delete all orders for this book.')) return;

    try {
      await axiosSecure.delete(`/books/${bookId}`);
      alert('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      console.error('Failed to delete book:', error);
      alert('Failed to delete book');
    }
  };

  if (loading) return <div className="p-8">Loading books...</div>;
  if (role !== 'admin') return <div className="p-8 text-error">Access denied. Admin only.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Books ({books.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book._id} className="card bg-base-100 shadow-lg">
            <figure>
              <img 
                src={book.image || '/book-placeholder.png'} 
                alt={book.bookName}
                className="h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">{book.bookName}</h3>
              <p className="text-sm text-muted">By {book.author}</p>
              <p className="text-lg font-bold">${book.price}</p>
              
              <div className="flex items-center justify-between mt-4">
                <span className={`badge ${book.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                  {book.status}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => togglePublish(book._id, book.status)}
                    className="btn btn-sm btn-outline"
                  >
                    {book.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button 
                    onClick={() => deleteBook(book._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}