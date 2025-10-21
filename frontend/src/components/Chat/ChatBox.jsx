import React, { useState, useEffect, useRef } from 'react';
import axios from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import ChatMessage from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageCircleQuestion, ArrowLeft } from 'lucide-react'; // <-- IMPORT ArrowLeft
import { useNavigate } from 'react-router-dom';

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const ChatBox = ({ currentChat, onNewMessage, hasConversations }) => {
  const { user } = useAuth();
  const { socket } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const scrollRef = useRef();
  const navigate = useNavigate(); // <-- INITIALIZE

  const otherMember = currentChat?.members.find(m => m._id !== user._id);

  // 1. Fetch messages
  useEffect(() => {
    if (!currentChat) {
      setMessages([]);
      return; 
    }
    const getMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const res = await axios.get(`/messages/${currentChat._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    getMessages();
  }, [currentChat]);

  // 2. Listen for socket messages
  useEffect(() => {
    if (!socket || !currentChat || !otherMember) return;
    const messageListener = (message) => {
      if (message.conversationId === currentChat._id || message.senderId === otherMember._id) {
        setMessages((prev) => [...prev, { ...message, createdAt: Date.now() }]);
      }
      onNewMessage();
    };
    socket.on("getMessage", messageListener);
    return () => socket.off("getMessage", messageListener);
  }, [socket, currentChat, otherMember, onNewMessage]);

  // 3. Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Handle send
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    const messageToSend = {
      conversationId: currentChat._id, senderId: user._id, text: newMessage,
    };
    socket.emit("sendMessage", {
      senderId: user._id, receiverId: otherMember._id, text: newMessage, conversationId: currentChat._id
    });
    try {
      const res = await axios.post("/messages", messageToSend);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // This is the empty state for both mobile and desktop
  if (!currentChat) {
    return (
      <div className="flex-col items-center justify-center h-full text-center p-4 hidden md:flex">
        <MessageCircleQuestion className="w-20 h-20 text-muted-foreground mb-6" />
        <h3 className="text-2xl font-semibold mb-2">
          {hasConversations ? "Select a chat" : "No chats yet"}
        </h3>
        <p className="text-lg text-muted-foreground">
          {hasConversations 
            ? "Choose a conversation from the left to view messages." 
            : "Find a roommate to start a new chat!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
        {/* --- NEW MOBILE BACK BUTTON --- */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" // Only show on mobile
          onClick={() => navigate('/chat')} // Go back to the list
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {/* --- END OF BUTTON --- */}
        
        <img
          src={otherMember?.profilePic || defaultAvatar}
          alt={otherMember?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <h3 className="font-semibold text-lg text-foreground">{otherMember?.name}</h3>
      </div>
      
      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          messages.map((m) => (
            <div key={m._id || m.createdAt} ref={scrollRef}>
              <ChatMessage 
                message={m} 
                isOwnMessage={m.senderId === user._id} 
              />
            </div>
          ))
        )}
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-border bg-card">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow rounded-lg"
          disabled={isLoadingMessages}
        />
        <Button 
          type="submit" 
          className="bg-[#5b5dda] text-white hover:bg-[#4a4ab5] rounded-lg"
          disabled={isLoadingMessages || newMessage.trim() === ""}
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;