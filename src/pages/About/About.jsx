// src/pages/About/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="container mx-auto px-6 py-16 flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">About BookCourier</h1>
      <p className="text-gray-600 max-w-3xl mb-8 leading-relaxed">
        At BookCourier, our mission is simple: deliver books safely and quickly to your doorstep. 
        We connect readers, sellers, and libraries through a trusted platform designed for convenience and reliability.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="p-6 bg-base-200 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-xl mb-2">Fast Delivery</h3>
          <p className="text-gray-500">Get your books delivered to your doorstep in record time, every time.</p>
        </div>
        <div className="p-6 bg-base-200 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-xl mb-2">Trusted Sellers</h3>
          <p className="text-gray-500">We partner with verified sellers to ensure authenticity and quality.</p>
        </div>
        <div className="p-6 bg-base-200 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold text-xl mb-2">Secure Payment</h3>
          <p className="text-gray-500">Safe and flexible payment methods including cash on delivery and online payments.</p>
        </div>
      </div>
    </div>
  );
}
