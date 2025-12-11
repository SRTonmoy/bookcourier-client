import React from 'react'

export default function Footer(){
  return (
    <footer className="footer p-10 bg-base-200 text-base-content">
      <div>
        <span className="footer-title">BookCourier</span>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Terms</a>
      </div>
      <div>
        <span className="footer-title">Social</span>
        <div className="grid grid-flow-col gap-4">
          <a aria-label="X (Twitter)" className="link link-hover">X</a>
          <a aria-label="LinkedIn" className="link link-hover">LinkedIn</a>
          <a aria-label="GitHub" className="link link-hover">GitHub</a>
        </div>
      </div>
      <div className="items-center">
        <p>© {new Date().getFullYear()} BookCourier. All rights reserved.</p>
      </div>
    </footer>
  )
}