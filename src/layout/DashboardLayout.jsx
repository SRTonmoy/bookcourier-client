import React from 'react'
import MainLayout from '../layout/MainLayout'
import BannerSlider from '../components/BannerSlider'
import LatestBooks from '../components/LatestBooks'

export default function Home(){
  const dummyBooks = [
    { _id: '1', bookName: 'Intro to Algorithms', author: 'CLRS', price: 19.99, image: '/assets/images/book1.jpg' },
    { _id: '2', bookName: 'Clean Code', author: 'Robert C. Martin', price: 14.99, image: '/assets/images/book2.jpg' },
    { _id: '3', bookName: 'You Don\'t Know JS', author: 'Kyle Simpson', price: 12.99, image: '/assets/images/book3.jpg' },
    { _id: '4', bookName: 'Design Patterns', author: 'GoF', price: 21.00, image: '/assets/images/book4.jpg' }
  ]

  return (
    <MainLayout>
      <BannerSlider />
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to BookCourier</h2>
        <p className="mb-6">Borrow books from nearby libraries and get them delivered to your doorstep.</p>
        <LatestBooks books={dummyBooks} />
      </section>

      <section className="bg-base-100 py-10">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-semibold mb-4">Coverage</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">Map placeholder</div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h3 className="text-2xl font-semibold mb-4">Why Choose BookCourier</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h4 className="font-semibold">Convenience</h4>
            <p>Order from nearest libraries without leaving home.</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold">Affordability</h4>
            <p>Low delivery and membership fees.</p>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold">Curated</h4>
            <p>Collections for students and researchers.</p>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}