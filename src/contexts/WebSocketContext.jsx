import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { WebSocketContext } from './WebSocketContext.js';

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_story') {
        setStories(prev => [data.payload, ...prev]);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, stories }}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired
};