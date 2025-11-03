import StoryItem from './StoryItem'
import './StoryList.css'

function StoryList({ stories, onStoryClick }) {
  if (stories.length === 0) {
    return (
      <div className="story-list">
        <div className="no-stories">No stories found.</div>
      </div>
    )
  }

  return (
    <div className="story-list">
      <table className="story-table">
        <tbody>
          {stories.map((story, index) => (
            <StoryItem 
              key={story.id} 
              story={story} 
              rank={index + 1}
              onStoryClick={onStoryClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StoryList