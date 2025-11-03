import { useTheme } from '../contexts/ThemeContext'
import './ThemeToggle.css'

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle