import PropTypes from 'prop-types'
import { useState } from 'react'
import './SearchBar.css'

function SearchBar({ onSearch, isSearching }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stories..."
          className="search-input"
          disabled={isSearching}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        {query && (
          <button 
            type="button" 
            onClick={handleClear}
            className="clear-button"
            disabled={isSearching}
          >
            Clear
          </button>
        )}
      </form>
    </div>
  )
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isSearching: PropTypes.bool.isRequired
}

export default SearchBar