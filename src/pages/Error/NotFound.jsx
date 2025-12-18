import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md text-center"
      >
        {/* 404 Text */}
        <h1 className="text-8xl font-extrabold text-primary mb-4">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">
          Page not found
        </h2>

        {/* Description */}
        <p className="text-base-content/70 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Action */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-content font-medium hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
