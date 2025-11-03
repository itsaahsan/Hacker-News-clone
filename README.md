# Hacker News Clone

A modern React-based clone of Hacker News built with Vite.

## Features

- 📰 **Multiple Story Categories** - Top, New, Ask HN, Show HN, Jobs
- 🔍 **Real-time Search** - Search through story titles, content, and authors
- 💬 **Comments Modal** - View story comments in a popup modal
- 🔄 **Auto-refresh** - Automatically refresh stories every 5 minutes
- 🔼 **Interactive Voting** - Clickable upvote arrows (UI only)
- ⏰ **Real-time Timestamps** - "X hours/days ago" display
- 🔗 **External Links** - Shows domain names for external stories
- 📱 **Responsive Design** - Matches original HN aesthetic
- ⚡ **Fast Loading** - Built with Vite for optimal performance
- 🎯 **Loading States** - Elegant loading spinners and error handling

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning fast build tool
- **Hacker News API** - Official Firebase API
- **CSS3** - Custom styling to match original HN look

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top navigation bar
│   ├── Header.css
│   ├── StoryList.jsx       # List container for stories
│   ├── StoryList.css
│   ├── StoryItem.jsx       # Individual story component
│   └── StoryItem.css
├── services/
│   └── hackerNewsApi.js    # API service functions
├── App.jsx                 # Main application component
├── App.css
├── main.jsx               # React entry point
└── index.css              # Global styles
```

## API Integration

This project uses the official Hacker News API:
- Base URL: `https://hacker-news.firebaseio.com/v0/`
- Endpoints used:
  - `/topstories.json` - Get top story IDs
  - `/item/{id}.json` - Get story details

## Features Implemented

- ✅ **Story Categories** - Top, New, Ask, Show, Jobs
- ✅ **Real-time Search** - Search through all loaded stories
- ✅ **Comments Display** - Modal popup with story comments
- ✅ **Auto-refresh** - Configurable auto-refresh with countdown
- ✅ **Story Ranking** - Numbered list of stories
- ✅ **Interactive Voting** - Clickable upvote arrows (UI only)
- ✅ **Time Formatting** - Human-readable timestamps
- ✅ **External Links** - Domain detection and display
- ✅ **Responsive Layout** - Works on all screen sizes
- ✅ **Loading States** - Spinners and proper error handling
- ✅ **Navigation** - Easy switching between story types

## Future Enhancements

- 🌙 **Dark Mode** - Toggle between light and dark themes
- 👤 **User Authentication** - Login and user profiles
- 🔗 **Nested Comments** - Display comment replies and threads
- 📱 **Mobile App** - React Native version
- 🔖 **Bookmarks** - Save favorite stories
- 📊 **Analytics** - Story popularity trends
- 🎨 **Themes** - Customizable color schemes
- 💾 **Offline Mode** - Cache stories for offline reading

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning and development!