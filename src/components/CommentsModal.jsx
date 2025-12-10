import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { fetchItem } from '../services/hackerNewsApi'
import './CommentsModal.css'

function CommentsModal({ storyId, onClose, story }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadComments = async () => {
      if (!story?.kids) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Load first 20 comments
        const commentIds = story.kids.slice(0, 20)
        const commentPromises = commentIds.map(id => fetchItem(id))
        const commentData = await Promise.all(commentPromises)
        setComments(commentData.filter(comment => comment && !comment.deleted))
      } catch (err) {
        setError('Failed to load comments')
        console.error('Error loading comments:', err)
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  }, [storyId, story])

  const getTimeAgo = (timestamp) => {
    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp
    
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  const formatText = (text) => {
    if (!text) return ''
    // Basic HTML decode and formatting
    return text
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/<p>/g, '\n\n')
      .replace(/<\/p>/g, '')
      .replace(/<[^>]*>/g, '') // Remove other HTML tags
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{story?.title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="story-info">
          <div className="story-meta">
            <span>{story?.score} points by {story?.by} {getTimeAgo(story?.time)}</span>
            {story?.url && (
              <span> | <a href={story.url} target="_blank" rel="noopener noreferrer">link</a></span>
            )}
          </div>
          {story?.text && (
            <div className="story-text">
              {formatText(story.text)}
            </div>
          )}
        </div>

        <div className="comments-section">
          <h3>{story?.descendants || 0} comments</h3>
          
          {loading && <div className="loading">Loading comments...</div>}
          {error && <div className="error">{error}</div>}
          
          {!loading && !error && comments.length === 0 && (
            <div className="no-comments">No comments yet.</div>
          )}
          
          {!loading && !error && comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-meta">
                <span className="comment-author">{comment.by}</span>
                <span className="comment-time">{getTimeAgo(comment.time)}</span>
              </div>
              <div className="comment-text">
                {formatText(comment.text)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

CommentsModal.propTypes = {
  storyId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  story: PropTypes.shape({
    kids: PropTypes.arrayOf(PropTypes.number),
    title: PropTypes.string,
    score: PropTypes.number,
    by: PropTypes.string,
    time: PropTypes.number,
    url: PropTypes.string,
    text: PropTypes.string,
    descendants: PropTypes.number
  }).isRequired
}

export default CommentsModal