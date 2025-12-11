import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { firebaseApp } from '../../firebase/firebase.config'

export default function Login(){
  const auth = getAuth(firebaseApp)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    try{
      await signInWithEmailAndPassword(auth, email, password)
      navigate(from, { replace: true })
    }catch(err){ setError(err.message) }
  }

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-md shadow">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="input input-bordered w-full" required />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="input input-bordered w-full" required />
            {error && <p className="text-error">{error}</p>}
            <div className="flex justify-between items-center">
              <button className="btn btn-primary">Login</button>
              <Link to="/register" className="link">Register</Link>
            </div>
          </form>
          <div className="divider">OR</div>
          <button className="btn btn-outline" onClick={handleGoogle}>Continue with Google</button>
        </div>
      </div>
    </div>
  )
}