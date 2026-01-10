// src/pages/Contact/Contact.jsx
import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa6";

export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-primary text-center mb-6">Contact Us</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        We’d love to hear from you! Reach out with questions, feedback, or partnership inquiries.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-base-200 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4">Email</h3>
          <p className="flex items-center gap-2 text-gray-600">
            <FaEnvelope /> support@bookcourier.com
          </p>
        </div>
        <div className="p-8 bg-base-200 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-4">Phone</h3>
          <p className="flex items-center gap-2 text-gray-600">
            <FaPhone /> +880 1752649293
          </p>
        </div>
      </div>
    </div>
  );
}
