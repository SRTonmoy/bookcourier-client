import React, { useEffect, useState } from 'react'
import MainLayout from '../../layout/MainLayout'
import { useParams } from 'react-router-dom'
import axiosPublic from '../../api/axiosPublic'
import { useAuth } from '../../hooks/useAuth'

export default function BookDetails(){
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetch = async () => {
      const res = await axiosPublic.get(`/books/${id}`)
      setBook(res.data)
    }
    fetch()
  }, [id])

  const handleOrder = async () => {
    if (!user) return alert('Please login first')
    const payload = { bookId: id, email: user.email, name: user.displayName, phone: '', address: '' }
    await axiosPublic.post('/orders', payload)
    alert('Order placed')
  }

  if (!book) return <div className="p-8">Loading...</div>

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <img src={book.image || '/assets/images/book-placeholder.png'} alt={book.bookName} className="w-full h-96 object-cover rounded" />
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold">{book.bookName}</h2>
            <p className="text-muted">By {book.author}</p>
            <p className="mt-4">{book.description || 'No description available'}</p>
            <div className="mt-6 flex gap-4">
              <button className="btn btn-primary" onClick={handleOrder}>Order Now</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}