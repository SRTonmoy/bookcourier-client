import React from 'react';
import api from '../../services/api';

export default function MyOrders(){
  const [orders, setOrders] = React.useState([]);

  React.useEffect(()=>{
    api.getMyOrders().then(r => setOrders(r.data || [])).catch(console.error);
  },[]);

  return (
    <div>
      <h3 className="text-xl mb-4">My Orders</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr><th>Book</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o.book?.title}</td>
                <td>{new Date(o.orderedAt).toLocaleString()}</td>
                <td>{o.status} / {o.paymentStatus}</td>
                <td>
                  {o.status === 'pending' && <button className="btn btn-sm btn-error">Cancel</button>}
                  {o.paymentStatus === 'unpaid' && <button className="btn btn-sm btn-primary ml-2">Pay Now</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
