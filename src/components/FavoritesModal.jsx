import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fetchItem } from '../services/hackerNewsApi'
import StoryItem from './StoryItem'
import LoadingSpinner from './LoadingSpinner'
import './FavoritesModal.css'

function FavoritesModal({ onClose, onStoryClick }) {
  const { user } = useAuth()
  const [favoriteStories, setFavoriteStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.favorites?.length) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const storyPromises = user.favorites.map(id => fetchItem(id))
        const stories = await Promise.all(storyPromises)
        setFavoriteStories(stories.filter(story => story !== null))
      } catch (err) {
        setError('Failed to load favorite stories')
        console.error('Error loading favorites:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [user?.favorites])

  const handleStoryClick = (story) => {
    onStoryClick(story)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="favorites-modal" onClick={(e) => e.stopPropagation()}>
        <div className="favorites-header">
          <h2>My Favorites ({user?.favorites?.length || 0})</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="favorites-content">
          {loading && <LoadingSpinner size="medium" text="Loading favorites..." />}
          
          {error && <div className="error">{error}</div>}
          
          {!loading && !error && favoriteStories.length === 0 && (
            <div className="no-favorites">
              <p>No favorite stories yet.</p>
              <p>Click the ⭐ next to any story to add it to your favorites!</p>
            </div>
          )}
          
          {!loading && !error && favoriteStories.length > 0 && (
            <div className="favorites-list">
              <table className="story-table">
                <tbody>
                  {favoriteStories.map((story, index) => (
                    <StoryItem 
                      key={story.id} 
                      story={story} 
                      rank={index + 1}
                      onStoryClick={handleStoryClick}
                      showFavoriteButton={false}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FavoritesModal