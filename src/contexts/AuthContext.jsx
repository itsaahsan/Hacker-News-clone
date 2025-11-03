import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('hn_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    // Simulate login API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username && password.length >= 6) {
          const userData = {
            id: Math.random().toString(36).substr(2, 9),
            username,
            email: `${username}@example.com`,
            karma: Math.floor(Math.random() * 1000) + 1,
            created: Math.floor(Date.now() / 1000) - (Math.random() * 31536000), // Random time in past year
            about: '',
            submissions: [],
            favorites: [],
            voted: new Set(),
            loginTime: Date.now()
          }
          setUser(userData)
          localStorage.setItem('hn_user', JSON.stringify(userData))
          resolve(userData)
        } else {
          reject(new Error('Invalid username or password'))
        }
      }, 1000) // Simulate network delay
    })
  }

  const signup = async (username, email, password) => {
    // Simulate signup API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username && email && password.length >= 6) {
          const userData = {
            id: Math.random().toString(36).substr(2, 9),
            username,
            email,
            karma: 1,
            created: Math.floor(Date.now() / 1000),
            about: '',
            submissions: [],
            favorites: [],
            voted: new Set(),
            loginTime: Date.now()
          }
          setUser(userData)
          localStorage.setItem('hn_user', JSON.stringify(userData))
          resolve(userData)
        } else {
          reject(new Error('Please fill in all fields with valid data'))
        }
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hn_user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('hn_user', JSON.stringify(updatedUser))
  }

  const addToFavorites = (storyId) => {
    if (user && !user.favorites.includes(storyId)) {
      const updatedFavorites = [...user.favorites, storyId]
      updateUser({ favorites: updatedFavorites })
    }
  }

  const removeFromFavorites = (storyId) => {
    if (user) {
      const updatedFavorites = user.favorites.filter(id => id !== storyId)
      updateUser({ favorites: updatedFavorites })
    }
  }

  const toggleVote = (storyId) => {
    if (user) {
      const voted = new Set(user.voted)
      if (voted.has(storyId)) {
        voted.delete(storyId)
      } else {
        voted.add(storyId)
      }
      updateUser({ voted: Array.from(voted) })
      return !user.voted.includes(storyId)
    }
    return false
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    addToFavorites,
    removeFromFavorites,
    toggleVote,
    isLoggedIn: !!user,
    isFavorite: (storyId) => user?.favorites.includes(storyId) || false,
    hasVoted: (storyId) => user?.voted.includes(storyId) || false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}