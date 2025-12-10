import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import StoryItem from './StoryItem'
import './StoryList.css'

function StoryList({ stories, onStoryClick, fetchMoreStories, isFetchingMore }) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isFetching ||
        isFetchingMore
      ) {
        return;
      }
      setIsFetching(true);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching, isFetchingMore]);

  useEffect(() => {
    if (!isFetching || !fetchMoreStories) return;
    fetchMoreStories().finally(() => setIsFetching(false));
  }, [isFetching, fetchMoreStories]);

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
      {isFetchingMore && (
        <div className="loading-more">
          <p>Loading more stories...</p>
        </div>
      )}
    </div>
  )
}

StoryList.propTypes = {
  stories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired
    })
  ).isRequired,
  onStoryClick: PropTypes.func.isRequired,
  fetchMoreStories: PropTypes.func,
  isFetchingMore: PropTypes.bool
}

export default StoryList;