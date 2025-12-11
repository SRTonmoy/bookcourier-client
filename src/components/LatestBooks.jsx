import React from 'react'
import BookCard from './BookCard'

export default function LatestBooks({ books = [] }){
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Latest Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {books.length ? books.map(b => <BookCard key={b._id} book={b} />) : (
            <p>No books found</p>
          )}
        </div>
      </div>
    </section>
  )
}
