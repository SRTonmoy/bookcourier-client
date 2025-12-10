import React from 'react';
import { useParams } from 'react-router-dom';
import { getBook, placeOrder } from '../../services/api';
import { useAuth } from '../../utils/AuthProvider';

export default function BookDetails(){
  const { id } = useParams();
  const [book, setBook] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState({ phone: '', address: '' });
  const { user } = useAuth();

  React.useEffect(()=>{ getBook(id).then(r=> setBook(r)).catch(console.error); },[id]);

  const handleOrder = async () => {
    try {
      await placeOrder({ bookId: id, phone: form.phone, address: form.address });
      setModalOpen(false);
      alert('Order placed — pending and unpaid');
    } catch (e) { console.error(e); alert('Order failed'); }
  };

  if (!book) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="grid md:grid-cols-3 gap-6">
        <img src={book.image || 'https://picsum.photos/400/500'} alt={book.title} className="w-full" />
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold">{book.title}</h2>
          <p className="text-sm">by {book.author}</p>
          <p className="mt-4">{book.description || 'No description provided.'}</p>
          <div className="mt-6 flex gap-4">
            <button onClick={()=> setModalOpen(true)} className="btn btn-primary">Order Now</button>
          </div>

          {modalOpen && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Order: {book.title}</h3>
                <label className="block mt-3">Name</label>
                <input className="input input-bordered w-full" value={user?.displayName || ''} readOnly />
                <label className="block mt-3">Email</label>
                <input className="input input-bordered w-full" value={user?.email || ''} readOnly />
                <label className="block mt-3">Phone</label>
                <input className="input input-bordered w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <label className="block mt-3">Address</label>
                <textarea className="textarea textarea-bordered w-full" value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea>
                <div className="modal-action">
                  <button className="btn" onClick={()=> setModalOpen(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleOrder}>Place Order</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
