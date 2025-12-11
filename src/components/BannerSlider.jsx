import React from 'react'

const slides = [
  { id: 1, title: 'Read Anywhere', desc: 'Get books delivered to your home', img: '/assets/images/slider1.jpg' },
  { id: 2, title: 'Academic Resources', desc: 'Libraries near you', img: '/assets/images/slider2.jpg' },
  { id: 3, title: 'Fast Delivery', desc: 'Quick pickup & doorstep delivery', img: '/assets/images/slider3.jpg' }
]

export default function BannerSlider(){
  return (
    <div className="carousel w-full hero-banner">
      {slides.map(s => (
        <div key={s.id} id={`slide-${s.id}`} className="carousel-item relative w-full">
          <div className="hero h-96" style={{backgroundImage:`url(${s.img})`, backgroundSize:'cover'}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
              <div className="max-w-md">
                <h1 className="mb-5 text-4xl font-bold">{s.title}</h1>
                <p className="mb-5">{s.desc}</p>
                <a href="/books" className="btn btn-primary">Browse Books</a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
