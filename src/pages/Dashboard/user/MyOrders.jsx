import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../../layout/DashboardLayout'
import axiosSecure from '../../../api/axiosSecure'
import { useAuth } from '../../../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function MyOrders(){
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const res = await axiosSecure.get(`/orders/my`)
      setOrders(res.data || [])
    }
    fetch()
  }, [user])

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">My Orders</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Book</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td>{o.bookName || o.bookId}</td>
                  <td>{new Date(o.orderDate).toLocaleString()}</td>
                  <td>{o.status}</td>
                  <td>
                    {o.status === 'pending' && <button className="btn btn-sm btn-error" onClick={async()=>{await axiosSecure.patch(`/orders/cancel/${o._id}`); alert('Cancelled')}}>Cancel</button>}
                    {o.paymentStatus === 'unpaid' && <Link to={`/payment/${o._id}`} className="btn btn-sm btn-primary ml-2">Pay Now</Link>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}