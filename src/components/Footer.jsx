import React from 'react';
import { FaXTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer(){
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-8">
      <div>
        <h3 className="font-bold text-lg">BookCourier</h3>
        <p>Delivering library books to your door.</p>
        <p className="text-sm mt-2">© {new Date().getFullYear()} BookCourier</p>
      </div>
      <div>
        <span className="footer-title">Contact</span>
        <a className="link link-hover flex items-center gap-2"><FaEnvelope/> contact@bookcourier.com</a>
        <a className="link link-hover flex items-center gap-2"><FaPhone/> +8801XXXXXXXXX</a>
      </div>
      <div>
        <span className="footer-title">Social</span>
        <div className="flex gap-2">
          <a className="btn btn-ghost btn-sm"><FaXTwitter/></a>
        </div>
      </div>
    </footer>
  );
}
