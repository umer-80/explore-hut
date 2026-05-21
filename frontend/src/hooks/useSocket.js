import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        console.log('✅ Socket.IO connected');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket.IO disconnected');
        setIsConnected(false);
      });

      socket.on('activeUsers', (count) => {
        setActiveUsers(count);
      });
    }

    return () => {
      // Don't disconnect on unmount, keep connection alive
    };
  }, []);

  return { socket, isConnected, activeUsers };
};

export const useListingViewers = (listingId) => {
  const [viewerCount, setViewerCount] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !listingId) return;

    // Join listing room
    socket.emit('joinListing', listingId);

    // Listen for viewer count updates
    socket.on('listingViewers', (count) => {
      setViewerCount(count);
    });

    // Cleanup: leave room on unmount
    return () => {
      socket.emit('leaveListing', listingId);
      socket.off('listingViewers');
    };
  }, [socket, listingId]);

  return viewerCount;
};
