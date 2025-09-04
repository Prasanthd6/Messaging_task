import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuth();
  // const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const BACKEND_URL = (import.meta.env && import.meta.env.VITE_BACKEND_URL) || 'http://localhost:5000';
  useEffect(() => {
    if (user && token) {
      const newSocket = io(BACKEND_URL, {
        auth: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        newSocket.emit('join', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user, token]);

  const sendMessage = (recipientId, message) => {
    if (socket && isConnected) {
      socket.emit('sendMessage', {
        recipientId,
        message
      });
    }
  };

  const sendTyping = (recipientId, isTyping) => {
    if (socket && isConnected) {
      socket.emit('typing', {
        recipientId,
        userId: user?.id,
        isTyping
      });
    }
  };

  const value = {
    socket,
    isConnected,
    sendMessage,
    sendTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
