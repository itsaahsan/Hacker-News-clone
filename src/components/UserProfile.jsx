import PropTypes from 'prop-types'
import { useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import './UserProfile.css'

function UserProfile({ onClose }) {
  const { user, updateUser, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    about: user?.about || ''
  })

  const handleSave = () => {
    updateUser(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({ about: user?.about || '' })
    setIsEditing(false)
  }

  const getTimeAgo = (timestamp) => {
    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp
    
    if (diff < 86400) return 'today'
    if (diff < 31536000) return `${Math.floor(diff / 86400)} days ago`
    return `${Math.floor(diff / 31536000)} years ago`
  }

  if (!user) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h2>User Profile</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <div className="info-row">
              <label>Username:</label>
              <span className="username">{user.username}</span>
            </div>
            
            <div className="info-row">
              <label>Karma:</label>
              <span className="karma">{user.karma}</span>
            </div>
            
            <div className="info-row">
              <label>Created:</label>
              <span>{getTimeAgo(user.created)}</span>
            </div>
            
            <div className="info-row">
              <label>Favorites:</label>
              <span>{user.favorites?.length || 0} stories</span>
            </div>
            
            <div className="info-row">
              <label>Votes Cast:</label>
              <span>{user.voted?.length || 0}</span>
            </div>
          </div>

          <div className="about-section">
            <div className="about-header">
              <label>About:</label>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="edit-button">
                  Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="edit-about">
                <textarea
                  value={editData.about}
                  onChange={(e) => setEditData({ ...editData, about: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="about-textarea"
                />
                <div className="edit-actions">
                  <button onClick={handleSave} className="save-button">Save</button>
                  <button onClick={handleCancel} className="cancel-button">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="about-text">
                {user.about || <em>No bio provided</em>}
              </div>
            )}
          </div>

          <div className="profile-actions">
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

UserProfile.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default UserProfile