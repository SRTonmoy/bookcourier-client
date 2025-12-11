import React, { createContext, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { firebaseApp } from '../firebase/firebase.config'
import axiosPublic from '../api/axiosPublic'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const auth = getAuth(firebaseApp)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (current) => {
      setLoading(true)
      if (current) {
        const token = await current.getIdToken()
        localStorage.setItem('access-token', token)

        // request server jwt if required (optional)
        // const res = await axiosPublic.post('/jwt', { email: current.email })
        setUser(current)
      } else {
        localStorage.removeItem('access-token')
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem('access-token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}