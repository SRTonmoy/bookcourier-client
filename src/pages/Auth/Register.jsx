import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '', avatar: null });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  function readFileAsDataURL(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      let photoURL = null;
      if (form.avatar) photoURL = await readFileAsDataURL(form.avatar);
      await updateProfile(user, { displayName: form.name, photoURL });
      await api.syncUser();
      alert('Registered');
      nav('/');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <form className="card w-full max-w-md p-6 shadow" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input className="input input-bordered w-full mb-2" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input className="input input-bordered w-full mb-2" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required type="email" />
        <input className="input input-bordered w-full mb-2" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required type="password" />
        <label className="block mb-2">Avatar</label>
        <input type="file" accept="image/*" onChange={e => setForm({...form, avatar: e.target.files[0]})} />
        <div className="mt-4">
          <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </div>
      </form>
    </div>
  );
}
