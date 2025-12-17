import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { firebaseApp } from '../../firebase/firebase.config'

export default function Register() {
  const auth = getAuth(firebaseApp)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [error, setError] = useState(null)

const validatePassword = (pwd) =>
  /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd)

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!validatePassword(password)) {
      return setError(
        'Password must be at least 8 characters, contain an uppercase letter and a number'
      )
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const avatar =
        photoURL || 'https://i.pravatar.cc/300?img=12'

      // 🔥 Firebase profile
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: avatar
      })

      // 🔥 MongoDB user save
      await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          role: 'user',
          photoURL: avatar,
          createdAt: new Date()
        })
      })

      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-full max-w-md shadow">
        <div className="card-body">
          <h2 className="card-title">Register</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="url"
              placeholder="Photo URL (optional)"
              className="input input-bordered w-full"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
            />

            {error && <p className="text-error text-sm">{error}</p>}

            <div className="flex justify-between items-center">
              <button className="btn btn-primary">Register</button>
              <Link to="/login" className="link">
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
