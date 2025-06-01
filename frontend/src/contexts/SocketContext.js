import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [user, socket]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    // Listen for project updates
    socket.on('projectUpdated', (data) => {
      console.log('Project updated:', data);
    });

    // Listen for task updates
    socket.on('taskUpdated', (data) => {
      console.log('Task updated:', data);
    });

    // Listen for new notifications
    socket.on('newNotification', (notification) => {
      console.log('New notification:', notification);
    });

    return () => {
      socket.off('projectUpdated');
      socket.off('taskUpdated');
      socket.off('newNotification');
    };
  }, [socket]);

  // Socket utility functions
  const emitProjectUpdate = (projectData) => {
    if (socket && connected) {
      socket.emit('projectUpdate', projectData);
    }
  };

  const emitTaskUpdate = (taskData) => {
    if (socket && connected) {
      socket.emit('taskUpdate', taskData);
    }
  };

  const joinProjectRoom = (projectId) => {
    if (socket && connected) {
      socket.emit('joinProject', projectId);
    }
  };

  const leaveProjectRoom = (projectId) => {
    if (socket && connected) {
      socket.emit('leaveProject', projectId);
    }
  };

  const value = {
    socket,
    connected,
    emitProjectUpdate,
    emitTaskUpdate,
    joinProjectRoom,
    leaveProjectRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
