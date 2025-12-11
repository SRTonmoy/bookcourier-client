import React from 'react'
import { Link } from 'react-router-dom'

export default function BookCard({ book }){
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg">
      <figure>
        <img src={book.image || '/assets/images/book-placeholder.png'} alt={book.bookName} className="h-48 w-full object-cover" />
      </figure>
      <div className="card-body p-4">
        <h3 className="font-semibold text-lg">{book.bookName}</h3>
        <p className="text-sm text-muted">{book.author}</p>
        <div className="card-actions justify-between items-center mt-2">
          <span className="font-bold">${book.price}</span>
          <Link to={`/books/${book._id}`} className="btn btn-sm btn-outline">Details</Link>
        </div>
      </div>
    </div>
  )
}