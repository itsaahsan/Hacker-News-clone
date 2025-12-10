import PropTypes from 'prop-types'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/useAuth'
import './StoryItem.css'

function StoryItem({ story, rank, onStoryClick, showFavoriteButton = true }) {
  const { user, isFavorite, addToFavorites, removeFromFavorites } = useAuth()
  const [localVoted, setLocalVoted] = useState(false)

  const handleVote = async (e, increment = 1) => {
    e.stopPropagation()
    if (user) {
      try {
        await axios.post(`/api/items/${story.id}/vote`, { increment });
      } catch (error) {
        console.error('Voting failed:', error);
        alert('Voting failed. Please try again.');
      }
    } else {
      // Guest voting (local only)
      setLocalVoted(!localVoted)
    }
  }

  const handleFavorite = (e) => {
    e.stopPropagation()
    if (!user) return
    
    if (isFavorite(story.id)) {
      removeFromFavorites(story.id)
    } else {
      addToFavorites(story.id)
    }
  }

  const handleCommentsClick = (e) => {
    e.preventDefault()
    onStoryClick && onStoryClick(story)
  }

  const handleStoryTitleClick = (e) => {
    // Only handle clicks on the title itself, not on links
    if (e.target.tagName === 'A' && e.target.href && !e.target.href.includes('#item?id=')) {
      return // Let external links open normally
    }
    e.preventDefault()
    onStoryClick && onStoryClick(story)
  }

  const getHostname = (url) => {
    if (!url) return ''
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return ''
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp
    
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  return (
    <>
      <tr className="story-row">
        <td className="rank-cell">
          <span className="rank">{rank}.</span>
        </td>
        <td className="vote-cell">
          <div className="vote-buttons">
            <button 
              className="vote-btn upvote"
              onClick={(e) => handleVote(e, 1)}
              aria-label="Upvote"
            >▴</button>
          </div>
        </td>
        <td className="story-cell">
          <div className="story-title" onClick={handleStoryTitleClick} style={{ cursor: 'pointer' }}>
            <a href={story.url || `#item?id=${story.id}`} className="story-link">
              {story.title}
            </a>
            {story.url && (
              <span className="story-host">
                {' '}(<a href={story.url}>{getHostname(story.url)}</a>)
              </span>
            )}
            {showFavoriteButton && user && (
              <button 
                onClick={handleFavorite}
                className={`favorite-button ${isFavorite(story.id) ? 'favorited' : ''}`}
                title={isFavorite(story.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                ⭐
              </button>
            )}
          </div>
        </td>
      </tr>
      <tr className="story-meta-row">
        <td colSpan="2"></td>
        <td className="meta-cell">
          <div className="story-meta">
            <span className="separator"> by </span>
            <a href={`#user?id=${story.by}`} className="author">{story.by}</a>
            <span className="separator"> </span>
            <a href={`#item?id=${story.id}`} className="time">
              {getTimeAgo(story.time)}
            </a>
            <span className="separator"> | </span>
            <button 
              onClick={handleCommentsClick} 
              className="comments-button"
              title="View comments"
            >
              {story.descendants || 0} comments
            </button>
          </div>
        </td>
      </tr>
      <tr className="spacer-row">
        <td colSpan="3" className="spacer"></td>
      </tr>
    </>
  )
}

StoryItem.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string,
    score: PropTypes.number,
    by: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    descendants: PropTypes.number,
    kids: PropTypes.arrayOf(PropTypes.number)
  }).isRequired,
  rank: PropTypes.number.isRequired,
  onStoryClick: PropTypes.func.isRequired,
  showFavoriteButton: PropTypes.bool
}

export default StoryItem