import PropTypes from 'prop-types'
import './Header.css'
import Navigation from './Navigation'
import { useAuth } from '../contexts/useAuth';

function Header({ currentSection, onSectionChange, onLoginClick, onProfileClick, onFavoritesClick, onSubmitClick }) {
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

Header.propTypes = {
  currentSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired,
  onFavoritesClick: PropTypes.func.isRequired,
  onSubmitClick: PropTypes.func.isRequired
};

export default Header