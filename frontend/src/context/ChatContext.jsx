import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  // Stores { senderId: string, text: string }
  const [notifications, setNotifications] = useState([]); 

  // Connect to socket server
  useEffect(() => {
    if (user) {
      // Connect to the socket server (running on the same port as your backend)
      const newSocket = io("http://localhost:5000"); 
      setSocket(newSocket);

      // Send our userId to the socket server
      newSocket.emit("addUser", user._id);

      // Listen for the list of online users
      newSocket.on("getUsers", (users) => {
        setOnlineUsers(users);
      });

      // Listen for a new message
      newSocket.on("getMessage", (message) => {
        // We'll handle this in the ChatBox component
      });
      
      // Listen for a notification ping
      newSocket.on("getNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      // Disconnect on logout
      return () => {
        newSocket.disconnect();
      };
    } else {
      // If no user, disconnect
      if (socket) {
        socket.disconnect();
      }
    }
  }, [user]);

  return (
    <ChatContext.Provider value={{ socket, onlineUsers, notifications, setNotifications }}>
      {children}
    </ChatContext.Provider>
  );
};