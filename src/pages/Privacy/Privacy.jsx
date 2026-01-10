// src/pages/Privacy/Privacy.jsx
import React from "react";

export default function Privacy() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">Privacy Policy</h1>
      <p className="text-gray-600 mb-4 leading-relaxed">
        Your privacy is important to us. BookCourier collects only the information necessary to provide our services, 
        such as account details and shipping information. We never sell your personal data to third parties.
      </p>
      <p className="text-gray-600 mb-4 leading-relaxed">
        We use industry-standard security measures to protect your information. 
        By using BookCourier, you consent to our privacy practices described here.
      </p>
      <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
        <li>We respect your personal data and privacy.</li>
        <li>Your information is only used to process orders and improve services.</li>
        <li>We may send occasional emails about updates or promotions.</li>
        <li>You can request deletion of your data anytime by contacting support.</li>
      </ul>
    </div>
  );
}
