import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebase.config';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Login(){
  const [form, setForm] = useState({ email: '', password: ''});
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, form.email, form.password);
      await api.syncUser();
      nav('/');
    } catch (e) {
      alert(e.message);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      await api.syncUser();
      nav('/');
    } catch (e) {
      alert(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <form className="card w-full max-w-md p-6 shadow" onSubmit={handleEmail}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input className="input input-bordered w-full mb-2" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required type="email" />
        <input className="input input-bordered w-full mb-2" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required type="password" />
        <div className="mt-4">
          <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </div>
        <div className="divider">OR</div>
        <button type="button" onClick={handleGoogle} className="btn btn-outline w-full">Continue with Google</button>
      </form>
    </div>
  );
}
