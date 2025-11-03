import { useState, useEffect, useCallback } from 'react'
import './App.css'
import './styles/darkMode.css'
import Header from './components/Header'
import StoryList from './components/StoryList'
import SearchBar from './components/SearchBar'
import CommentsModal from './components/CommentsModal'
import LoginModal from './components/LoginModal'
import UserProfile from './components/UserProfile'
import FavoritesModal from './components/FavoritesModal'
import SubmitModal from './components/SubmitModal'
import LoadingSpinner from './components/LoadingSpinner'
import AutoRefreshControl from './components/AutoRefreshControl'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { fetchStoriesByType, searchStories } from './services/hackerNewsApi'
import { useAutoRefresh } from './hooks/useAutoRefresh'

function AppContent() {
  const [stories, setStories] = useState([])
  const [allStories, setAllStories] = useState([]) // For search functionality
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentSection, setCurrentSection] = useState('top')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
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

  useEffect(() => {
    loadStories(currentSection)
  }, [currentSection])

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

  // Auto-refresh functionality
  const {
    isAutoRefreshEnabled,
    toggleAutoRefresh,
    nextRefreshIn,
    nextRefreshSeconds
  } = useAutoRefresh(handleRefresh, 5) // 5 minutes interval

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
        <AutoRefreshControl
          isEnabled={isAutoRefreshEnabled}
          onToggle={toggleAutoRefresh}
          nextRefreshIn={nextRefreshIn}
          nextRefreshSeconds={nextRefreshSeconds}
        />
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
      />
      <SearchBar onSearch={handleSearch} isSearching={isSearching} />
      <AutoRefreshControl
        isEnabled={isAutoRefreshEnabled}
        onToggle={toggleAutoRefresh}
        nextRefreshIn={nextRefreshIn}
        nextRefreshSeconds={nextRefreshSeconds}
      />
      
      {searchQuery && (
        <div className="search-results-info">
          Found {stories.length} result{stories.length !== 1 ? 's' : ''} for "{searchQuery}"
        </div>
      )}
      
      <StoryList stories={stories} onStoryClick={handleStoryClick} />
      
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
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App