import React from 'react'
import MainLayout from '../../layout/MainLayout'

export default function PaymentPage(){
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold">Payment</h2>
        <p>Payment flow placeholder (integrate Stripe/PayPal)</p>
      </div>
    </MainLayout>
  )
}
