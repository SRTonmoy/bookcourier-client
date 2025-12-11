import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { firebaseApp } from '../../firebase/firebase.config'

export default function Register(){
  const auth = getAuth(firebaseApp)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState(null)

  const validatePassword = (pwd) => {
    // strong password: min 8, one uppercase, one number
    return /(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}/.test(pwd)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validatePassword(password)) return setError('Password must be at least 8 characters, contain an uppercase letter and a number')

    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name, photoURL: image || null })
      navigate('/')
    }catch(err){ setError(err.message) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-md shadow">
        <div className="card-body">
          <h2 className="card-title">Register</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="input input-bordered w-full" required />
            <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="input input-bordered w-full" required />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="input input-bordered w-full" required />

            <div>
              <label className="block text-sm">Profile Image (optional)</label>
              <input type="file" accept="image/*" onChange={e=>setImage(URL.createObjectURL(e.target.files[0]))} className="mt-2" />
            </div>

            {error && <p className="text-error">{error}</p>}

            <div className="flex justify-between items-center">
              <button className="btn btn-primary">Register</button>
              <Link to="/login" className="link">Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}