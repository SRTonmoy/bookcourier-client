import React from 'react';
import BookCard from '../../components/BookCard';
import axiosPublic from '../../api/axiosPublic';
import { Link } from 'react-router-dom';

export default function Home(){
  const [books, setBooks] = React.useState([]);

  React.useEffect(() => {
  getBooks()
    .then(data => {
      console.log("BOOKS FROM API:", data);
      setBooks(data.slice(0, 6));
    })
    .catch(console.error);
}, []);

  return (
    <div>
      <section className="hero min-h-[60vh]" style={{ backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://picsum.photos/1200/400?grayscale)' }}>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-2xl">
            <h1 className="mb-5 text-5xl font-bold">Books delivered to your door</h1>
            <p className="mb-5">Borrow from local libraries without leaving home — schedule pickups and deliveries with ease.</p>
            <Link to="/books" className="btn btn-primary">Browse All Books</Link>
          </div>
        </div>
      </section>

      <section className="p-8">
        <h2 className="text-2xl font-bold mb-4">Latest Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books?.map(b => <BookCard key={b._id} book={b} />)}
        </div>
      </section>

      <section className="p-8 bg-base-100">
        <h2 className="text-2xl font-bold mb-4">Why Choose BookCourier</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 shadow">Fast Delivery — quick fulfillment from local libraries.</div>
          <div className="card p-6 shadow">Wide Network — multiple libraries available.</div>
          <div className="card p-6 shadow">Easy Returns — schedule return pickups.</div>
        </div>
      </section>
    </div>
  );
}
