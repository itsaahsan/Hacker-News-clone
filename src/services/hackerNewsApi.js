const BASE_URL = 'https://hacker-news.firebaseio.com/v0'

// Fetch a single item by ID
export const fetchItem = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/item/${id}.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error)
    throw error
  }
}

// Fetch top story IDs
export const fetchTopStoryIds = async () => {
  try {
    const response = await fetch(`${BASE_URL}/topstories.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching top story IDs:', error)
    throw error
  }
}

// Fetch top stories with full details
export const fetchTopStories = async (limit = 30) => {
  try {
    const storyIds = await fetchTopStoryIds()
    const topStoryIds = storyIds.slice(0, limit)
    
    // Fetch all stories in parallel
    const storyPromises = topStoryIds.map(id => fetchItem(id))
    const stories = await Promise.all(storyPromises)
    
    // Filter out any null stories (deleted items)
    return stories.filter(story => story !== null)
  } catch (error) {
    console.error('Error fetching top stories:', error)
    throw error
  }
}

// Fetch new story IDs
export const fetchNewStoryIds = async () => {
  try {
    const response = await fetch(`${BASE_URL}/newstories.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching new story IDs:', error)
    throw error
  }
}

// Fetch ask story IDs
export const fetchAskStoryIds = async () => {
  try {
    const response = await fetch(`${BASE_URL}/askstories.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching ask story IDs:', error)
    throw error
  }
}

// Fetch show story IDs
export const fetchShowStoryIds = async () => {
  try {
    const response = await fetch(`${BASE_URL}/showstories.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching show story IDs:', error)
    throw error
  }
}

// Fetch job story IDs
export const fetchJobStoryIds = async () => {
  try {
    const response = await fetch(`${BASE_URL}/jobstories.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching job story IDs:', error)
    throw error
  }
}

// Fetch stories by type
export const fetchStoriesByType = async (type, limit = 30, offset = 0) => {
  try {
    let storyIds = []
    
    switch (type) {
      case 'top':
        storyIds = await fetchTopStoryIds()
        break
      case 'new':
        storyIds = await fetchNewStoryIds()
        break
      case 'ask':
        storyIds = await fetchAskStoryIds()
        break
      case 'show':
        storyIds = await fetchShowStoryIds()
        break
      case 'jobs':
        storyIds = await fetchJobStoryIds()
        break
      default:
        storyIds = await fetchTopStoryIds()
    }
    
    const topStoryIds = storyIds.slice(offset, offset + limit)
    const storyPromises = topStoryIds.map(id => fetchItem(id))
    const stories = await Promise.all(storyPromises)
    
    return stories.filter(story => story !== null)
  } catch (error) {
    console.error(`Error fetching ${type} stories:`, error)
    throw error
  }
}

// Search stories (basic client-side search)
export const searchStories = async (query, stories) => {
  if (!query || !stories) return []
  
  const lowerQuery = query.toLowerCase()
  return stories.filter(story => 
    story.title?.toLowerCase().includes(lowerQuery) ||
    story.text?.toLowerCase().includes(lowerQuery) ||
    story.by?.toLowerCase().includes(lowerQuery)
  )
}