import './AutoRefreshControl.css'

function AutoRefreshControl({ 
  isEnabled, 
  onToggle, 
  nextRefreshIn, 
  nextRefreshSeconds 
}) {
  return (
    <div className="auto-refresh-control">
      <button 
        onClick={onToggle}
        className={`auto-refresh-button ${isEnabled ? 'enabled' : ''}`}
        title={isEnabled ? 'Disable auto-refresh' : 'Enable auto-refresh (every 5 minutes)'}
      >
        {isEnabled ? '⏸' : '▶'} Auto-refresh
      </button>
      {isEnabled && (
        <span className="refresh-countdown">
          Next: {nextRefreshIn}
        </span>
      )}
    </div>
  )
}

export default AutoRefreshControl