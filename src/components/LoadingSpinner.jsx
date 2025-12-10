import PropTypes from 'prop-types'
import './LoadingSpinner.css'

function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  return (
    <div className={`loading-container ${size}`}>
      <div className="spinner"></div>
      <span className="loading-text">{text}</span>
    </div>
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  text: PropTypes.string
}

export default LoadingSpinner