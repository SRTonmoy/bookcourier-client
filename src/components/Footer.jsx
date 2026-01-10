import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content">
      {/* Top Section */}
      <div className="footer p-10 max-w-7xl mx-auto grid gap-8 md:grid-cols-4">

        {/* Brand */}
        <aside>
          <h2 className="text-2xl font-bold text-primary">📚 BookCourier</h2>
          <p className="mt-3 text-sm opacity-80">
            Delivering books safely and quickly to your doorstep.
            A trusted platform for readers, sellers, and libraries.
          </p>
        </aside>

        {/* Services */}
        <nav>
          <h6 className="footer-title">Services</h6>
          <span className="link link-hover">Book Delivery</span>
          <span className="link link-hover">Cash on Delivery</span>
          <span className="link link-hover">Bulk Orders</span>
          <span className="link link-hover">Order Tracking</span>
        </nav>

        {/* Company (ROUTES ADDED) */}
        <nav>
          <h6 className="footer-title">Company</h6>

          <Link to="/about" className="link link-hover">
            About Us
          </Link>

          <Link to="/contact" className="link link-hover">
            Contact
          </Link>

          <Link to="/privacy" className="link link-hover">
            Privacy Policy
          </Link>

          <Link to="/terms" className="link link-hover">
            Terms & Conditions
          </Link>
        </nav>

        {/* Contact */}
        <nav>
          <h6 className="footer-title">Contact</h6>

          <p className="flex items-center gap-2 text-sm">
            <FaEnvelope /> support@bookcourier.com
          </p>

          <p className="flex items-center gap-2 text-sm">
            <FaPhone /> +880 1752649293
          </p>

          {/* Social Icons */}
          <div className="mt-4 flex gap-4 text-xl">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="hover:text-primary transition"
            >
              <FaXTwitter />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-primary transition"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-primary transition"
            >
              <FaGithub />
            </a>
          </div>
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">BookCourier</span>. All rights reserved.
          </p>
          <p className="opacity-70">
            Built with ❤️ using React, Tailwind & daisyUI
          </p>
        </div>
      </div>
    </footer>
  );
}
