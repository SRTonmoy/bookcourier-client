import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { firebaseApp } from '../../firebase/firebase.config'
import { Users, Shield, BookOpen } from 'lucide-react'

export default function Login() {
  const auth = getAuth(firebaseApp)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  // 🔹 Demo credentials
  const demoUser = {
    email: 'Teset@gmail.com',
    password: 'Test11$11',
    role: 'user',
    
  }

  const demoAdmin = {
    email: 'admin@gmail.com',
    password: 'Adminof11$',
    role: 'admin',
    
  }

  const demoLibrarian = {
    email: 'library@gmail.com',
    password: 'Aa12345@',
    role: 'librarian', 
    
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDemoLogin = (demoAccount) => {
    setEmail(demoAccount.email)
    setPassword(demoAccount.password)
    
    // Auto-login after a brief delay for better UX
    setTimeout(() => {
      signInWithEmailAndPassword(auth, demoAccount.email, demoAccount.password)
        .then(() => {
          navigate(from, { replace: true })
        })
        .catch(err => {
          setError(err.message)
        })
    }, 100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200 p-4">
      <div className="card w-full max-w-2xl shadow-2xl">
        <div className="card-body p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-muted">Sign in to access your account</p>
          </div>

          {/* 🔹 Demo Buttons */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted mb-3 text-center">Quick Login with Demo Accounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                className="btn btn-outline h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-content transition-all"
                onClick={() => handleDemoLogin(demoUser)}
              >
                <Users size={24} />
                <div className="text-center">
                  <div className="font-semibold">Demo User</div>
                  <div className="text-xs text-muted mt-1">Regular User</div>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-outline h-auto py-4 flex flex-col items-center gap-2 hover:bg-secondary hover:text-secondary-content transition-all"
                onClick={() => handleDemoLogin(demoLibrarian)}
              >
                <BookOpen size={24} />
                <div className="text-center">
                  <div className="font-semibold">Demo Librarian</div>
                  <div className="text-xs text-muted mt-1">Manage Books</div>
                </div>
              </button>

              <button
                type="button"
                className="btn btn-outline h-auto py-4 flex flex-col items-center gap-2 hover:bg-accent hover:text-accent-content transition-all"
                onClick={() => handleDemoLogin(demoAdmin)}
              >
                <Shield size={24} />
                <div className="text-center">
                  <div className="font-semibold">Demo Admin</div>
                  <div className="text-xs text-muted mt-1">Full Access</div>
                </div>
              </button>
            </div>
          </div>

          <div className="divider">OR</div>

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
                <Link to="/forgot-password" className="label-text-alt link link-primary">
                  Forgot password?
                </Link>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            {error && (
              <div className="alert alert-error shadow-lg">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-sm" />
                <span className="label-text">Remember me</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full btn-lg"
            >
              Sign In
            </button>
          </form>

          <div className="divider">OR</div>

          {/* Google Login */}
          <div className="space-y-4">
            <button 
              className="btn btn-outline w-full gap-2 hover:bg-base-200"
              onClick={handleGoogle}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="link link-primary font-semibold">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Demo Credentials Info */}
      <div className="fixed bottom-4 left-4 bg-base-100 p-4 rounded-lg shadow-lg border max-w-xs hidden md:block">
        <h4 className="font-bold text-sm mb-2">Demo Credentials</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="font-medium">User:</span>
            <span className="text-muted">Teset@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <span className="font-medium">Librarian:</span>
            <span className="text-muted">librarian@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <span className="font-medium">Admin:</span>
            <span className="text-muted">admin@gmail.com</span>
          </div>
          <div className="mt-2 text-xs text-muted">
            All demo passwords are shown in the form when clicked
          </div>
        </div>
      </div>
    </div>
  )
}