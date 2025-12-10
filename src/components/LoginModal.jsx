import PropTypes from 'prop-types'
import { useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import LoadingSpinner from './LoadingSpinner'
import './LoginModal.css'

function LoginModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, signup } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await login(formData.username, formData.password)
      } else {
        await signup(formData.username, formData.email, formData.password)
      }
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData({ username: '', email: '', password: '' })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your username"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your password"
              minLength={6}
            />
            <small>Password must be at least 6 characters</small>
          </div>

          {isLogin && (
            <div className="form-group">
              <button
                type="button"
                className="forgot-password-button"
                onClick={() => alert('Password reset link sent!')}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <LoadingSpinner size="small" text={isLogin ? 'Logging in...' : 'Signing up...'} />
            ) : (
              isLogin ? 'Login' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="toggle-mode">
          <button type="button" onClick={toggleMode} className="toggle-button">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>

        <div className="demo-info">
          <p><strong>Demo:</strong> Use any username with password length ≥ 6 characters</p>
        </div>
      </div>
    </div>
  )
}

LoginModal.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default LoginModal