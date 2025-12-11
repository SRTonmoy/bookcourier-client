import React from 'react'
import MainLayout from '../../layout/MainLayout'

export default function NotFound(){
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4">Page not found</p>
      </div>
    </MainLayout>
  )
}