import React from 'react';
import BookCard from '../../components/BookCard';
import { getBooks } from '../../services/api';

export default function Books(){
  const [books, setBooks] = React.useState([]);
  React.useEffect(()=>{ getBooks({ limit: 48 }).then(r=> setBooks(r.data)).catch(console.error); },[]);
  return (
    <div className="p-8">
      <h2 className="text-3xl mb-6">All Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books?.map(b => <BookCard key={b._id} book={b} />)}
      </div>
    </div>
  );
}
