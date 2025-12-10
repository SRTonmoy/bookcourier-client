import React from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg">
      <figure><img src={book.image || 'https://picsum.photos/400/300'} alt={book.title} className="card-img" /></figure>
      <div className="card-body">
        <h3 className="font-bold">{book.title}</h3>
        <p className="text-sm text-muted">by {book.author || 'Unknown'}</p>
        <div className="card-actions justify-between items-center">
          <span className="text-primary font-semibold">৳{book.price}</span>
          <Link to={`/books/${book._id}`} className="btn btn-sm">Details</Link>
        </div>
      </div>
    </div>
  );
}
