import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import ConvoList from '@/components/Chat/ConvoList';
import ChatBox from '@/components/Chat/ChatBox';
import { Loader2 } from 'lucide-react'; 

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  
  const { user } = useAuth();
  const { onlineUsers, setNotifications } = useChat();
  const { conversationId } = useParams(); // This is the key
  const navigate = useNavigate();

  const fetchConversations = async () => {
    if (!user) return;
    setLoadingConversations(true);
    try {
      const res = await axios.get("/conversations");
      const sortedConvos = res.data.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setConversations(sortedConvos);

      if (conversationId) {
        const activeConvo = sortedConvos.find(c => c._id === conversationId);
        setCurrentChat(activeConvo);
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setLoadingConversations(false);
    }
  };
  
  useEffect(() => {
    fetchConversations();
  }, [user]); // Only fetch all convos when user loads

  // This effect runs when the URL param or conversations list changes
  useEffect(() => {
    if (conversationId) {
      const activeConvo = conversations.find(c => c._id === conversationId);
      setCurrentChat(activeConvo);
    } else {
      setCurrentChat(null);
    }
  }, [conversationId, conversations]);

  // This effect clears notifications for the open chat
  useEffect(() => {
    if (currentChat) {
      const otherMember = currentChat.members.find(m => m._id !== user._id);
      if (otherMember) {
        setNotifications(prev => 
          prev.filter(n => n.senderId !== otherMember._id)
        );
      }
    }
  }, [currentChat, user, setNotifications]);

  return (
    <div className="pt-25 w-full h-screen bg-background">
      <div className="container mx-auto h-[calc(100%-3rem)] max-w-7xl">
        <div className="w-full h-full flex rounded-2xl border border-border overflow-hidden bg-card shadow-lg">

          {loadingConversations ? (
            <div className="flex flex-col items-center justify-center w-full">
              <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
              <p className="text-xl text-muted-foreground">Loading your chats...</p>
            </div>
          ) : (
            <>
              {/* --- LEFT SIDEBAR (CHAT LIST) ---
                - On mobile (hidden md:...), hide this if a conversationId is present
                - On desktop (md:block), always show it
              */}
              <div className={`
                ${conversationId ? 'hidden' : 'block'} 
                md:block w-full md:w-1/3 lg:w-1/4 h-full border-r border-border bg-card overflow-y-auto custom-scrollbar
              `}>
                <ConvoList
                  conversations={conversations}
                  currentChat={currentChat}
                  setCurrentChat={setCurrentChat} // This is for desktop clicks
                  onlineUsers={onlineUsers}
                />
              </div>
              
              {/* --- RIGHT WINDOW (CHAT BOX) ---
                - On mobile (hidden md:...), hide this if no conversationId is present
                - On desktop (md:block), always show it
              */}
              <div className={`
                ${conversationId ? 'block' : 'hidden'} 
                md:block flex-grow h-full bg-background
              `}>
                <ChatBox
                  currentChat={currentChat}
                  onNewMessage={fetchConversations}
                  hasConversations={conversations.length > 0} 
                />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChatPage;