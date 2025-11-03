import { useState } from 'react'
import './Navigation.css'

function Navigation({ currentSection, onSectionChange }) {
  const sections = [
    { key: 'top', label: 'top', path: '/' },
    { key: 'new', label: 'new', path: '/newest' },
    { key: 'ask', label: 'ask', path: '/ask' },
    { key: 'show', label: 'show', path: '/show' },
    { key: 'jobs', label: 'jobs', path: '/jobs' }
  ]

  return (
    <nav className="navigation">
      {sections.map((section, index) => (
        <span key={section.key}>
          {index > 0 && <span className="nav-separator"> | </span>}
          <button
            className={`nav-button ${currentSection === section.key ? 'active' : ''}`}
            onClick={() => onSectionChange(section.key)}
          >
            {section.label}
          </button>
        </span>
      ))}
    </nav>
  )
}

export default Navigation