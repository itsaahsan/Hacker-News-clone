import './LoadingSpinner.css'

function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  return (
    <div className={`loading-container ${size}`}>
      <div className="spinner"></div>
      <span className="loading-text">{text}</span>
    </div>
  )
}

export default LoadingSpinner