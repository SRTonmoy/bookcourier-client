
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import axiosSecure from '../../../api/axiosSecure';
import { useRole } from '../../../hooks/useRole';
import { Link } from 'react-router-dom';

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useRole();
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    unpublished: 0
  });

  useEffect(() => {
    if (role === 'librarian') {
      fetchBooks();
    }
  }, [role]);

  const fetchBooks = async () => {
    try {
      const { data } = await axiosSecure.get('/books/librarian/my');
      setBooks(data);
      
  
      const published = data.filter(b => b.status === 'published').length;
      const unpublished = data.filter(b => b.status === 'unpublished').length;
      
      setStats({
        total: data.length,
        published,
        unpublished
      });
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (bookId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'unpublished' : 'published';
    const action = newStatus === 'published' ? 'Publish' : 'Unpublish';
    
    if (!window.confirm(`${action} this book?`)) return;
    
    try {
      // For librarian, we need to update via PUT
      await axiosSecure.put(`/books/${bookId}`, { status: newStatus });
      alert(`Book ${newStatus === 'published' ? 'published' : 'unpublished'}`);
      fetchBooks(); // Refresh list
    } catch (error) {
      console.error('Failed to update book:', error);
      alert('Failed to update book');
    }
  };

  if (loading) return <div className="p-8">Loading your books...</div>;
  if (role !== 'librarian') return <div className="p-8 text-error">Access denied. Librarian only.</div>;

  return (
    
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <span className="text-3xl">📚</span>
              </div>
              <div className="stat-title">Total Books</div>
              <div className="stat-value">{stats.total}</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <span className="text-3xl">✅</span>
              </div>
              <div className="stat-title">Published</div>
              <div className="stat-value">{stats.published}</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <span className="text-3xl">📝</span>
              </div>
              <div className="stat-title">Unpublished</div>
              <div className="stat-value">{stats.unpublished}</div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Books</h2>
          <div className="flex gap-3">
            <button onClick={fetchBooks} className="btn btn-sm btn-outline">
              Refresh
            </button>
            <Link to="/dashboard/add-book" className="btn btn-sm btn-primary">
              + Add New Book
            </Link>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="alert alert-info">
            <span>You haven't added any books yet.</span>
            <Link to="/dashboard/add-book" className="ml-2 link link-primary">
              Add your first book
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th>Cover</th>
                  <th>Book Details</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-base-300">
                    <td>
                      <div className="avatar">
                        <div className="w-16 h-16 rounded">
                          <img 
                            src={book.image || '/book-placeholder.png'} 
                            alt={book.bookName}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <h3 className="font-bold">{book.bookName}</h3>
                        <p className="text-sm text-muted">By {book.author}</p>
                        {book.category && (
                          <span className="badge badge-outline badge-sm mt-1">
                            {book.category}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="font-bold">${book.price}</td>
                    <td>
                      <span className={`badge ${book.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">👁️</span>
                        <span>{book.views || 0}</span>
                      </div>
                    </td>
                    <td>
                      {new Date(book.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => togglePublish(book._id, book.status)}
                          className={`btn btn-xs ${book.status === 'published' ? 'btn-warning' : 'btn-success'}`}
                        >
                          {book.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <Link
                          to={`/dashboard/edit-book/${book._id}`}
                          className="btn btn-xs btn-outline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
 
  );
}