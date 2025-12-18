import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Truck, BookOpen, Shield, ArrowRight } from "lucide-react";

import BookCard from "../../components/BookCard";
import CoverageMap from "../../components/CoverageMap";
import { getBooks } from "../../services/bookService";

import AnimatedSection, {
  AnimatedHeading,
  AnimatedCard,
} from "../../components/AnimatedSection";

/* ================= HERO SLIDER DATA ================= */
const heroSlides = [
  {
    title: "Books Delivered to Your Door",
    subtitle:
      "Borrow from nearby libraries without stepping outside your home.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  },
  {
    title: "Your Local Library, Online",
    subtitle:
      "Thousands of books from multiple libraries — one platform.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    title: "Fast • Secure • Reliable",
    subtitle:
      "Order today, receive within 24 hours. Returns made easy.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
  },
];

export default function Home() {
  const [books, setBooks] = React.useState([]);
  const [current, setCurrent] = React.useState(0);

  /* ================= FETCH BOOKS ================= */
  React.useEffect(() => {
    getBooks()
      .then((data) => setBooks(data.slice(0, 6)))
      .catch(console.error);
  }, []);

  /* ================= AUTO PLAY SLIDER ================= */
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundImage: "url('/background-dashbaord.jpg')" }}>
      {/* ================= HERO SLIDER ================= */}
      <section className="relative overflow-hidden">
        <div className="relative h-[65vh] sm:h-[70vh] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              style={{
                backgroundImage: `
                  linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
                  url(${heroSlides[current].image})
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex items-center justify-center h-full px-4">
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-white max-w-2xl"
                >
                  <h1 className="text-3xl sm:text-5xl font-bold mb-4">
                    {heroSlides[current].title}
                  </h1>
                  <p className="text-sm sm:text-lg mb-6">
                    {heroSlides[current].subtitle}
                  </p>
                  <Link to="/books" className="btn btn-primary">
                    Browse All Books
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            onClick={() =>
              setCurrent((current - 1 + heroSlides.length) % heroSlides.length)
            }
            className="btn btn-circle absolute left-4 top-1/2 -translate-y-1/2"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() =>
              setCurrent((current + 1) % heroSlides.length)
            }
            className="btn btn-circle absolute right-4 top-1/2 -translate-y-1/2"
          >
            <ChevronRight />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition ${
                  current === index
                    ? "bg-primary"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= LATEST BOOKS ================= */}
      <section className="p-8">
        <AnimatedHeading
          title="Latest Books"
          subtitle="Discover our newest arrivals"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((book, index) => (
            <AnimatedSection
              key={book._id}
              animation="fadeIn"
              delay={index * 0.1}
            >
              <BookCard book={book} />
            </AnimatedSection>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/books" className="btn btn-outline gap-2">
            View All Books <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
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

      {/* ================= COVERAGE MAP ================= */}
      <section className="p-8 bg-base-100">
        <AnimatedHeading
          title="Our Coverage Area"
          subtitle="We deliver across multiple cities and regions"
        />
        <AnimatedSection animation="scaleUp" delay={0.2}>
          <CoverageMap />
        </AnimatedSection>
      </section>

      {/* ================= CTA ================= */}
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
