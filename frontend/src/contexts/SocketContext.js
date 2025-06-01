import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
        query: {
          userId: user._id,
        },
        autoConnect: false,
      });

      // Connect to socket
      newSocket.connect();

      // Set up event listeners
      newSocket.on('connect', () => {
        console.log('Connected to server');
        setSocket(newSocket);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setSocket(null);
      });

      // Listen for online users updates
      newSocket.on('onlineUsers', (users) => {
        setOnlineUsers(users);
      });

      // Listen for project updates
      newSocket.on('projectUpdated', (data) => {
        // This will be handled in components that need real-time project updates
        console.log('Project updated:', data);
      });

      // Listen for task updates
      newSocket.on('taskUpdated', (data) => {
        // This will be handled in components that need real-time task updates
        console.log('Task updated:', data);
      });

      // Listen for new task assignments
      newSocket.on('taskAssigned', (data) => {
        // This will be handled for notifications
        console.log('Task assigned:', data);
      });

      // Error handling
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      // Cleanup function
      return () => {
        newSocket.close();
        setSocket(null);
        setOnlineUsers([]);
      };
    } else {
      // Clean up socket when user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setOnlineUsers([]);
      }
    }
  }, [isAuthenticated, user]);

  // Socket event emitters
  const joinProject = (projectId) => {
    if (socket) {
      socket.emit('joinProject', projectId);
    }
  };

  const leaveProject = (projectId) => {
    if (socket) {
      socket.emit('leaveProject', projectId);
    }
  };

  const updateProject = (projectData) => {
    if (socket) {
      socket.emit('updateProject', projectData);
    }
  };

  const updateTask = (taskData) => {
    if (socket) {
      socket.emit('updateTask', taskData);
    }
  };

  const assignTask = (taskData) => {
    if (socket) {
      socket.emit('assignTask', taskData);
    }
  };

  // Subscribe to specific events
  const subscribeToEvent = (eventName, callback) => {
    if (socket) {
      socket.on(eventName, callback);
      
      // Return unsubscribe function
      return () => {
        socket.off(eventName, callback);
      };
    }
    return () => {};
  };

  const value = {
    socket,
    onlineUsers,
    joinProject,
    leaveProject,
    updateProject,
    updateTask,
    assignTask,
    subscribeToEvent,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;