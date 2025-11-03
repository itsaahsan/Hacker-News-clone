import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'
import './SubmitModal.css'

function SubmitModal({ onClose }) {
  const { user, isLoggedIn } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    text: ''
  })
  const [submissionType, setSubmissionType] = useState('url') // 'url' or 'text'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isLoggedIn) {
      setError('You must be logged in to submit stories')
      return
    }

    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    if (submissionType === 'url' && !formData.url.trim()) {
      setError('URL is required for link submissions')
      return
    }

    if (submissionType === 'text' && !formData.text.trim()) {
      setError('Text is required for text submissions')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simulate submission API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError('Failed to submit story. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="submit-modal" onClick={(e) => e.stopPropagation()}>
          <div className="submit-header">
            <h2>Submit Story</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="submit-content">
            <div className="login-required">
              <p>You must be logged in to submit stories.</p>
              <p>Please log in and try again.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="submit-modal" onClick={(e) => e.stopPropagation()}>
          <div className="submit-header">
            <h2>Submit Story</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="submit-content">
            <div className="success-message">
              <h3>✅ Story Submitted Successfully!</h3>
              <p>Your story has been submitted and will appear in the new stories section.</p>
              <p>This window will close automatically...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="submit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="submit-header">
          <h2>Submit Story</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          <div className="submission-type">
            <label>
              <input
                type="radio"
                value="url"
                checked={submissionType === 'url'}
                onChange={(e) => setSubmissionType(e.target.value)}
              />
              Link
            </label>
            <label>
              <input
                type="radio"
                value="text"
                checked={submissionType === 'text'}
                onChange={(e) => setSubmissionType(e.target.value)}
              />
              Text
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter story title"
              maxLength={80}
            />
            <small>{formData.title.length}/80 characters</small>
          </div>

          {submissionType === 'url' ? (
            <div className="form-group">
              <label htmlFor="url">URL *</label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="https://example.com"
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="text">Text *</label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your story text..."
                rows={8}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="submit-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <LoadingSpinner size="small" text="Submitting..." />
              ) : (
                'Submit Story'
              )}
            </button>
            <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
              Cancel
            </button>
          </div>
        </form>

        <div className="submit-guidelines">
          <h4>Submission Guidelines:</h4>
          <ul>
            <li>Please ensure your title is descriptive and accurate</li>
            <li>For links, submit the original source when possible</li>
            <li>For text posts, be clear and concise</li>
            <li>Follow community guidelines and be respectful</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SubmitModal