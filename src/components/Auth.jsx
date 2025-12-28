// src/components/Auth.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false) // Si loo qariyo/muujiyo emailka
  const navigate = useNavigate()

  // 1. Google Login Function
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      if (error) throw error
    } catch (error) {
      alert('Error logging in with Google: ' + error.message)
    }
  }

  // 2. Email + Password Login Function
  const handleEmailLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // Successful sign in — auth state change in App.jsx will update session
      navigate('/today')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '40px 30px', 
      border: '1px solid #ddd', 
      borderRadius: '12px', 
      backgroundColor: 'white', 
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Log in or Sign up</h2>

      {/* --- GOOGLE BUTTON --- */}
      <button
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '50px', // Qaab wareegsan (Pill shape)
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '20px',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#f9f9f9'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
      >
        {/* Google Icon SVG */}
        <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
        </svg>
        Continue with Google
      </button>

      {/* --- DIVIDER (OR) --- */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
        <span style={{ padding: '0 10px', color: '#888', fontSize: '14px' }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
      </div>

      {/* --- EMAIL SECTION --- */}
      
      {!showEmailInput ? (
          // Badhanka Buluugga ah (Initial State)
          <button 
            onClick={() => setShowEmailInput(true)}
            style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#3b5bdb', // Blue color like image
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
            }}
          >
            Continue with Email
          </button>
      ) : (
          // Foomka Emailka (Marka la riixo badhanka buluugga ah)
          <form onSubmit={handleEmailLogin}>
            <div style={{ marginBottom: '12px' }}>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
              />
            </div>
            <button 
                disabled={loading}
                style={{ width: '100%', padding: '12px', backgroundColor: '#3b5bdb', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <button 
                type="button" 
                onClick={() => setShowEmailInput(false)}
                style={{ marginTop: '10px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', width: '100%' }}
            >
                Cancel
            </button>
          </form>
      )}

      {/* Footer Text */}
      <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: '#666' }}>
        Already have an account? <span onClick={() => setShowEmailInput(true)} style={{ color: '#3b5bdb', cursor: 'pointer', fontWeight: 'bold' }}>Log in</span>
      </p>

    </div>
  )
}