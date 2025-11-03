import './Header.css'
import Navigation from './Navigation'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

function Header({ currentSection, onSectionChange, onRefresh, onLoginClick, onProfileClick, onFavoritesClick, onSubmitClick }) {
  const { user, isLoggedIn } = useAuth()
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <button onClick={() => onSectionChange('top')} className="logo-button">
            <img src="/hn-logo.svg" alt="Y" className="logo-img" />
            <span className="logo-text">Hacker News</span>
          </button>
        </div>
        <Navigation 
          currentSection={currentSection}
          onSectionChange={onSectionChange}
        />
        <div className="header-actions">
          <button onClick={onRefresh} className="refresh-button" title="Refresh stories">
            ↻
          </button>
          <span className="nav-separator">|</span>
          <button onClick={onSubmitClick} className="nav-button">submit</button>
          <span className="nav-separator">|</span>
          {isLoggedIn ? (
            <>
              <button onClick={onFavoritesClick} className="nav-button" title="My favorites">
                ⭐ ({user?.favorites?.length || 0})
              </button>
              <span className="nav-separator">|</span>
              <button onClick={onProfileClick} className="nav-button" title="User profile">
                {user?.username} ({user?.karma})
              </button>
            </>
          ) : (
            <button onClick={onLoginClick} className="nav-button">
              login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header