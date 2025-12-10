import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Header from './components/Header'
import StoryList from './components/StoryList'
import SearchBar from './components/SearchBar'
import CommentsModal from './components/CommentsModal'
import LoginModal from './components/LoginModal'
import UserProfile from './components/UserProfile'
import FavoritesModal from './components/FavoritesModal'
import SubmitModal from './components/SubmitModal'
import LoadingSpinner from './components/LoadingSpinner'
import { AuthProvider } from './contexts/AuthContext'
import { WebSocketProvider } from './contexts/WebSocketContext'
import { fetchStoriesByType, searchStories } from './services/hackerNewsApi'

function AppContent() {
  const [stories, setStories] = useState([])
  const [allStories, setAllStories] = useState([]) // For search functionality
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentSection, setCurrentSection] = useState('top')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [currentOffset, setCurrentOffset] = useState(0)
  const [selectedStory, setSelectedStory] = useState(null)
  const [showComments, setShowComments] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)

  const loadStories = useCallback(async (section = currentSection) => {
    try {
      setLoading(true)
      setError(null)
      setCurrentOffset(0)
      const fetchedStories = await fetchStoriesByType(section, 30)
      setStories(fetchedStories)
      setAllStories(fetchedStories)
      
      // If there was a search query, re-apply it to the new stories
      if (searchQuery) {
        const searchResults = await searchStories(searchQuery, fetchedStories)
        setStories(searchResults)
      }
    } catch (err) {
      setError(`Failed to load ${section} stories`)
      console.error('Error loading stories:', err)
    } finally {
      setLoading(false)
    }
  }, [currentSection, searchQuery])

  const fetchMoreStories = useCallback(async () => {
    if (isFetchingMore || searchQuery) return // Don't fetch more during search
    
    try {
      setIsFetchingMore(true)
      const newOffset = currentOffset + 30
      setCurrentOffset(newOffset)
      
      const moreStories = await fetchStoriesByType(currentSection, 30, newOffset)
      
      if (moreStories.length > 0) {
        const updatedStories = [...stories, ...moreStories]
        setStories(updatedStories)
        setAllStories(updatedStories)
        
        // Re-apply search if active
        if (searchQuery) {
          const searchResults = await searchStories(searchQuery, updatedStories)
          setStories(searchResults)
        }
      }
    } catch (err) {
      console.error('Error loading more stories:', err)
    } finally {
      setIsFetchingMore(false)
    }
  }, [currentSection, currentOffset, stories, isFetchingMore, searchQuery])

  useEffect(() => {
    loadStories(currentSection)
  }, [currentSection, loadStories])

  const handleSectionChange = (section) => {
    setCurrentSection(section)
    setSearchQuery('')
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (!query) {
      setStories(allStories)
      return
    }

    try {
      setIsSearching(true)
      const searchResults = await searchStories(query, allStories)
      setStories(searchResults)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleStoryClick = (story) => {
    setSelectedStory(story)
    setShowComments(true)
  }

  const handleCloseComments = () => {
    setShowComments(false)
    setSelectedStory(null)
  }

  const handleLoginClick = () => {
    setShowLogin(true)
  }

  const handleCloseLogin = () => {
    setShowLogin(false)
  }

  const handleProfileClick = () => {
    setShowProfile(true)
  }

  const handleCloseProfile = () => {
    setShowProfile(false)
  }

  const handleFavoritesClick = () => {
    setShowFavorites(true)
  }

  const handleCloseFavorites = () => {
    setShowFavorites(false)
  }

  const handleSubmitClick = () => {
    setShowSubmit(true)
  }

  const handleCloseSubmit = () => {
    setShowSubmit(false)
  }

  const handleRefresh = useCallback(() => {
    loadStories(currentSection)
  }, [loadStories, currentSection])

  if (loading) {
    return (
      <div className="app">
        <Header 
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
          onRefresh={handleRefresh}
          onLoginClick={handleLoginClick}
          onProfileClick={handleProfileClick}
          onFavoritesClick={handleFavoritesClick}
          onSubmitClick={handleSubmitClick}
        />
        <SearchBar onSearch={handleSearch} isSearching={isSearching} />
        <LoadingSpinner 
          size="large" 
          text={`Loading ${currentSection} stories...`} 
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header 
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
          onRefresh={handleRefresh}
          onLoginClick={handleLoginClick}
          onProfileClick={handleProfileClick}
          onFavoritesClick={handleFavoritesClick}
          onSubmitClick={handleSubmitClick}
        />
        <SearchBar onSearch={handleSearch} isSearching={isSearching} />
        <div className="error">
          {error}
          <button onClick={handleRefresh} className="retry-button">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header 
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        onRefresh={handleRefresh}
        onLoginClick={handleLoginClick}
        onProfileClick={handleProfileClick}
        onFavoritesClick={handleFavoritesClick}
        onSubmitClick={handleSubmitClick}
      />
      <SearchBar onSearch={handleSearch} isSearching={isSearching} />
      
      {searchQuery && (
        <div className="search-results-info">
          Found {stories.length} result{stories.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
        </div>
      )}
      
      <StoryList 
        stories={stories} 
        onStoryClick={handleStoryClick}
        fetchMoreStories={fetchMoreStories}
        isFetchingMore={isFetchingMore}
      />
      
      {showComments && selectedStory && (
        <CommentsModal 
          storyId={selectedStory.id}
          story={selectedStory}
          onClose={handleCloseComments}
        />
      )}
      
      {showLogin && (
        <LoginModal onClose={handleCloseLogin} />
      )}
      
      {showProfile && (
        <UserProfile onClose={handleCloseProfile} />
      )}
      
      {showFavorites && (
        <FavoritesModal 
          onClose={handleCloseFavorites}
          onStoryClick={handleStoryClick}
        />
      )}
      
      {showSubmit && (
        <SubmitModal onClose={handleCloseSubmit} />
      )}
    </div>
  )
}

function App() {
  return (
    <WebSocketProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </WebSocketProvider>
  )
}

export default App