import React, { useEffect, useState } from 'react'
import MainLayout from '../../layout/MainLayout'
import BookCard from '../../components/BookCard'
import axiosPublic from '../../api/axiosPublic'

export default function AllBooks(){
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('asc')

  useEffect(() => {
    const fetch = async () => {
      const res = await axiosPublic.get(`/books?search=${search}&sort=${sort}`)
      setBooks(res.data || [])
    }
    fetch()
  }, [search, sort])

  return (
    
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">All Books</h2>
          <div className="flex gap-2">
            <input placeholder="Search" className="input input-bordered" value={search} onChange={e=>setSearch(e.target.value)} />
            <select className="select select-bordered" value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map(b=> <BookCard key={b._id} book={b} />)}
        </div>
      </div>
    
  )
}