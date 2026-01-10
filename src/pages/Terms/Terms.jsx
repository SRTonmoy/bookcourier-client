// src/pages/Terms/Terms.jsx
import React from "react";

export default function Terms() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">Terms & Conditions</h1>
      <p className="text-gray-600 mb-4 leading-relaxed">
        By using BookCourier, you agree to follow our rules and policies. We strive to provide accurate book information, 
        safe delivery, and fair transactions.
      </p>
      <p className="text-gray-600 mb-4 leading-relaxed">
        Users are responsible for providing accurate shipping and payment information. Any misuse of the platform 
        may result in suspension or termination of accounts.
      </p>
      <ul className="list-decimal list-inside text-gray-600 mt-4 space-y-2">
        <li>All book deliveries are subject to availability.</li>
        <li>Payments must be made through the provided secure channels.</li>
        <li>BookCourier is not liable for delays due to third-party shipping services.</li>
        <li>We reserve the right to update terms at any time, effective immediately.</li>
      </ul>
    </div>
  );
}
