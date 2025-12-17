// pages/Home/Home.jsx - FIXED VERSION
import React from 'react';
import BookCard from '../../components/BookCard';
import { Link } from 'react-router-dom';
import { getBooks } from "../../services/bookService";
import CoverageMap from "../../components/CoverageMap";

// Import animated components
import AnimatedSection, { 
  AnimatedHeading, 
  AnimatedCard 
} from '../../components/AnimatedSection';

// Import icons from lucide-react
import { Truck, BookOpen, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
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
      {/* Hero Section */}
      <section className="hero min-h-[60vh]" style={{ 
        backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://picsum.photos/1200/400?grayscale)' 
      }}>
        <div className="hero-content text-center text-neutral-content">
          <AnimatedSection animation="slideUp">
            <div className="max-w-2xl">
              <h1 className="mb-5 text-5xl font-bold">Books delivered to your door</h1>
              <p className="mb-5">
                Borrow from local libraries without leaving home — schedule pickups and deliveries with ease.
              </p>
              <Link to="/books" className="btn btn-primary">
                Browse All Books
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Latest Books Section */}
      <section className="p-8">
        <AnimatedHeading 
          title="Latest Books"
          subtitle="Discover our newest arrivals"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books?.map((book, index) => (
            <AnimatedSection key={book._id} animation="fadeIn" delay={index * 0.1}>
              <BookCard book={book} />
            </AnimatedSection>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/books" className="btn btn-outline gap-2">
            View All Books
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="p-8 bg-base-100">
        <AnimatedHeading 
          title="Why Choose BookCourier"
          subtitle="Experience the future of library access"
        />
        
        <div className="grid md:grid-cols-3 gap-6">
          <AnimatedCard 
            icon={<Truck size={24} />}
            title="Fast Delivery"
            description="Quick fulfillment from local libraries within 24 hours"
            delay={0.1}
          />
          <AnimatedCard 
            icon={<BookOpen size={24} />}
            title="Wide Selection"
            description="Access to thousands of books from multiple libraries"
            delay={0.2}
          />
          <AnimatedCard 
            icon={<Shield size={24} />}
            title="Secure & Easy Returns"
            description="Schedule return pickups at your convenience"
            delay={0.3}
          />
        </div>
      </section>
      
      {/* Coverage Map Section */}
      <section className="p-8 bg-base-100">
        <AnimatedHeading 
          title="Our Coverage Area"
          subtitle="We deliver across multiple cities and regions"
        />
        <AnimatedSection animation="scaleUp" delay={0.2}>
          <CoverageMap />
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="p-8 bg-primary text-primary-content">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedHeading 
            title="Ready to Start Reading?"
            subtitle="Join thousands of happy readers today"
          />
          <div className="space-x-4 mt-6">
            <Link to="/register" className="btn btn-accent">
              Get Started Free
            </Link>
            <Link to="/books" className="btn btn-outline btn-accent">
              Browse Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}